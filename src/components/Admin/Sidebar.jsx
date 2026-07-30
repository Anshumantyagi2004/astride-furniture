import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import {
    LayoutDashboard,
    PackagePlus,
    Boxes,
    ShoppingBag,
    Users,
    Settings,
    Headphones,
    MessageSquare,
    LogOut,
    FileText
} from "lucide-react";

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const [unreadCounts, setUnreadCounts] = useState({
        orders: 0,
        inquiries: 0,
        contacts: 0
    });

    // Fetch unread counts directly from MongoDB
    const fetchUnreadCounts = async () => {
        try {
            const [ordersRes, inquiriesRes, contactsRes] = await Promise.allSettled([
                axios.get('/api/order'),
                axios.get('/api/enquiry'),
                axios.get('/api/contact')
            ]);

            setUnreadCounts({
                orders: ordersRes.status === 'fulfilled' ? ordersRes.value.data?.unreadCount || 0 : 0,
                inquiries: inquiriesRes.status === 'fulfilled' ? inquiriesRes.value.data?.unreadCount || 0 : 0,
                contacts: contactsRes.status === 'fulfilled' ? contactsRes.value.data?.unreadCount || 0 : 0,
            });
        } catch (err) {
            console.error("Error fetching unread notification counts:", err);
        }
    };

    useEffect(() => {
        fetchUnreadCounts();
    }, []);

    // Mark items as read when admin visits the section
    useEffect(() => {
        if (!pathname) return;

        const markAsRead = async () => {
            if (pathname.startsWith("/admin/orders") && unreadCounts.orders > 0) {
                await axios.patch('/api/order');
                setUnreadCounts(prev => ({ ...prev, orders: 0 }));
            } else if (pathname.startsWith("/admin/inquiries") && unreadCounts.inquiries > 0) {
                await axios.patch('/api/enquiry');
                setUnreadCounts(prev => ({ ...prev, inquiries: 0 }));
            } else if (pathname.startsWith("/admin/contacts") && unreadCounts.contacts > 0) {
                await axios.patch('/api/contact');
                setUnreadCounts(prev => ({ ...prev, contacts: 0 }));
            }
        };

        markAsRead();
    }, [pathname, unreadCounts]);

    const handleLogout = () => {
        document.cookie =
            "admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        router.push("/admin/login");
    };

    const navItems = [
        { href: "/admin/Dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/categories", label: "Categories", icon: Boxes },
        { href: "/admin/add-product", label: "Add Product", icon: PackagePlus },
        { href: "/admin/products", label: "All Products", icon: ShoppingBag },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/orders", label: "Orders", icon: Settings, badge: unreadCounts.orders },
        { href: "/admin/inquiries", label: "Bulk Inquiries", icon: Headphones, badge: unreadCounts.inquiries },
        { href: "/admin/contacts", label: "Contacts", icon: MessageSquare, badge: unreadCounts.contacts },
        { href: "/admin/blogs", label: "Blogs", icon: FileText },
    ];

    const handleNavItemClick = async (item) => {
        try {
            if (item.href === "/admin/orders" && unreadCounts.orders > 0) {
                setUnreadCounts(prev => ({ ...prev, orders: 0 }));
                await axios.patch('/api/order');
            } else if (item.href === "/admin/inquiries" && unreadCounts.inquiries > 0) {
                setUnreadCounts(prev => ({ ...prev, inquiries: 0 }));
                await axios.patch('/api/enquiry');
            } else if (item.href === "/admin/contacts" && unreadCounts.contacts > 0) {
                setUnreadCounts(prev => ({ ...prev, contacts: 0 }));
                await axios.patch('/api/contact');
            }
        } catch (e) {
            console.error("Failed to mark as read", e);
        }
    };

    return (
        <aside className="w-[260px] min-w-[260px] flex-shrink-0 bg-white border-r border-gray-200 shadow-sm hidden md:flex flex-col h-screen sticky top-0">
            <div className="h-20 flex items-center px-6 border-b border-gray-200 flex-shrink-0">
                <h1 className="text-2xl font-bold text-[#00badb] whitespace-nowrap">
                    Admin Panel
                </h1>
            </div>

            {/* MENU */}
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== "/admin/Dashboard" && pathname?.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => handleNavItemClick(item)}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
                                isActive
                                    ? "bg-[#00badb] text-white shadow-md shadow-[#00badb]/20"
                                    : "text-gray-700 hover:bg-[#00badb]/10 hover:text-[#00badb]"
                            }`}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <Icon size={20} className="shrink-0" />
                                <span className="whitespace-nowrap">{item.label}</span>
                            </div>

                            {Boolean(item.badge) && item.badge > 0 && (
                                <span className={`shrink-0 ml-2 px-2 py-0.5 text-xs font-bold rounded-full transition-all ${
                                    isActive
                                        ? "bg-white text-red-600 shadow-sm"
                                        : "bg-red-500 text-white animate-pulse"
                                }`}>
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100 flex-shrink-0">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 rounded-xl font-medium text-sm transition"
                >
                    <LogOut size={20} className="shrink-0" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
