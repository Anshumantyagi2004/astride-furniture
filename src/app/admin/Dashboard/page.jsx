"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/Admin/Sidebar";
import { Plus_Jakarta_Sans } from "next/font/google";
import { 
    ShoppingBag, 
    Users, 
    Headphones, 
    MessageSquare, 
    Boxes,
    ArrowUpRight,
    Loader2,
    Calendar,
    User as UserIcon,
    TrendingUp
} from "lucide-react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export default function Page() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const { data } = await axios.get("/api/admin/stats");
            if (data.success) {
                setData(data);
            }
        } catch (error) {
            console.error("Failed to load dashboard stats", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className={`min-h-screen bg-[#FDFBF7] flex items-center justify-center ${sans.className}`}>
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-[#8B5CF6]" size={36} />
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Loading Dashboard...</span>
                </div>
            </div>
        );
    }

    const { stats, recentInquiries, recentContacts, chartData, recentOrders } = data || {
        stats: { products: 0, orders: 0, users: 0, inquiries: 0, contacts: 0 },
        recentInquiries: [],
        recentContacts: [],
        chartData: [],
        recentOrders: []
    };

    return (
        <div className={`min-h-screen bg-[#FDFBF7] flex ${sans.className}`}>
            <Sidebar />

            <main className="flex-1 p-6 md:p-10 lg:p-12 text-[#131313]">
                <div className="max-w-[1440px] mx-auto">
                    {/* Welcome Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                            Admin Overview
                        </h1>
                        <p className="text-sm md:text-base text-neutral-500 font-medium mt-1">
                            Welcome back! Here is a summary of your website metrics today.
                        </p>
                    </div>

                    {/* Neo-Brutalist Grid Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                        {/* 1. Products Card */}
                        <Link href="/admin/products" className="bg-white border-[2.5px] border-[#131313] rounded-[24px] p-5 shadow-[4px_4px_0_#131313] flex items-center gap-4 hover:-translate-y-1 hover:shadow-[6px_6px_0_#131313] transition-all cursor-pointer">
                            <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] border-2 border-[#131313] flex items-center justify-center text-emerald-600 shadow-[2px_2px_0_#131313]">
                                <ShoppingBag size={20} />
                            </div>
                            <div>
                                <span className="text-[10px] text-neutral-400 font-black uppercase tracking-wider block mb-0.5">Products</span>
                                <span className="text-2xl font-black leading-none">{stats.products}</span>
                            </div>
                        </Link>

                        {/* 2. Users Card */}
                        <Link href="/admin/users" className="bg-white border-[2.5px] border-[#131313] rounded-[24px] p-5 shadow-[4px_4px_0_#131313] flex items-center gap-4 hover:-translate-y-1 hover:shadow-[6px_6px_0_#131313] transition-all cursor-pointer">
                            <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] border-2 border-[#131313] flex items-center justify-center text-blue-600 shadow-[2px_2px_0_#131313]">
                                <Users size={20} />
                            </div>
                            <div>
                                <span className="text-[10px] text-neutral-400 font-black uppercase tracking-wider block mb-0.5">Users</span>
                                <span className="text-2xl font-black leading-none">{stats.users}</span>
                            </div>
                        </Link>

                        {/* 3. Inquiries Card */}
                        <Link href="/admin/inquiries" className="bg-white border-[2.5px] border-[#131313] rounded-[24px] p-5 shadow-[4px_4px_0_#131313] flex items-center gap-4 hover:-translate-y-1 hover:shadow-[6px_6px_0_#131313] transition-all cursor-pointer">
                            <div className="w-12 h-12 rounded-xl bg-[#FFFBEB] border-2 border-[#131313] flex items-center justify-center text-amber-600 shadow-[2px_2px_0_#131313]">
                                <Headphones size={20} />
                            </div>
                            <div>
                                <span className="text-[10px] text-neutral-400 font-black uppercase tracking-wider block mb-0.5">Inquiries</span>
                                <span className="text-2xl font-black leading-none">{stats.inquiries}</span>
                            </div>
                        </Link>

                        {/* 4. Contacts Card */}
                        <Link href="/admin/contacts" className="bg-white border-[2.5px] border-[#131313] rounded-[24px] p-5 shadow-[4px_4px_0_#131313] flex items-center gap-4 hover:-translate-y-1 hover:shadow-[6px_6px_0_#131313] transition-all cursor-pointer">
                            <div className="w-12 h-12 rounded-xl bg-[#F5F3FF] border-2 border-[#131313] flex items-center justify-center text-[#8B5CF6] shadow-[2px_2px_0_#131313]">
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <span className="text-[10px] text-neutral-400 font-black uppercase tracking-wider block mb-0.5">Messages</span>
                                <span className="text-2xl font-black leading-none">{stats.contacts}</span>
                            </div>
                        </Link>

                        {/* 5. Orders Card */}
                        <Link href="/admin/orders" className="bg-white border-[2.5px] border-[#131313] rounded-[24px] p-5 shadow-[4px_4px_0_#131313] flex items-center gap-4 hover:-translate-y-1 hover:shadow-[6px_6px_0_#131313] transition-all cursor-pointer">
                            <div className="w-12 h-12 rounded-xl bg-[#FFF5F5] border-2 border-[#131313] flex items-center justify-center text-red-500 shadow-[2px_2px_0_#131313]">
                                <Boxes size={20} />
                            </div>
                            <div>
                                <span className="text-[10px] text-neutral-400 font-black uppercase tracking-wider block mb-0.5">Orders</span>
                                <span className="text-2xl font-black leading-none">{stats.orders}</span>
                            </div>
                        </Link>
                    </div>

                    {/* Sales Chart Section */}
                    <div className="mb-8 bg-white border-[3px] border-[#131313] rounded-[28px] shadow-[6px_6px_0_#131313] p-6">
                        <div className="flex items-center justify-between border-b-[2px] border-neutral-100 pb-4 mb-6">
                            <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                <TrendingUp size={18} className="text-[#8B5CF6]" />
                                Sales Trend - Last 7 Days
                            </h2>
                        </div>
                        {chartData && chartData.length > 0 ? (
                            <div className="w-full h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis 
                                            dataKey="date" 
                                            stroke="#9ca3af"
                                            style={{ fontSize: '12px', fontWeight: 600 }}
                                        />
                                        <YAxis 
                                            stroke="#9ca3af"
                                            style={{ fontSize: '12px', fontWeight: 600 }}
                                            label={{ value: 'Sales (₹)', angle: -90, position: 'insideLeft' }}
                                        />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: '2px solid #131313',
                                                borderRadius: '8px',
                                                boxShadow: '4px 4px 0 #131313'
                                            }}
                                            labelStyle={{ color: '#131313', fontWeight: 700 }}
                                            formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="sales" 
                                            stroke="#8B5CF6" 
                                            strokeWidth={3}
                                            dot={{ fill: '#8B5CF6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 7 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="text-sm text-neutral-400 py-12 text-center">No sales data available.</p>
                        )}
                    </div>

                    {/* Recent Orders Section */}
                    <div className="mb-8 bg-white border-[3px] border-[#131313] rounded-[28px] shadow-[6px_6px_0_#131313] p-6">
                        <div className="flex items-center justify-between border-b-[2px] border-neutral-100 pb-4 mb-4">
                            <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                <ShoppingBag size={18} className="text-[#8B5CF6]" />
                                Recent Orders
                            </h2>
                            <Link href="/admin/orders" className="text-xs font-bold text-[#8B5CF6] hover:underline flex items-center gap-0.5">
                                View All <ArrowUpRight size={14} />
                            </Link>
                        </div>
                        
                        {recentOrders.length === 0 ? (
                            <p className="text-sm text-neutral-400 py-6 text-center">No recent orders.</p>
                        ) : (
                            <div className="space-y-3">
                                {recentOrders.map((order) => (
                                    <Link key={order._id} href={`/admin/orders#order-${order._id}`} className="flex items-center justify-between border-b border-neutral-50 pb-3 last:border-b-0 last:pb-0 hover:bg-neutral-50 p-2 rounded-lg transition-colors -mx-2 px-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold text-[#131313]">
                                                    {order.userId?.name 
                                                        ? order.userId.name 
                                                        : (order.shippingInfo?.fullName 
                                                            ? `${order.shippingInfo.fullName} (Guest User)` 
                                                            : "Guest User")}
                                                </p>
                                                <span className="text-xs text-neutral-400">
                                                    Order ID: {order._id.toString().slice(-6).toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-neutral-500 mt-1">
                                                {order.products?.length || 0} item(s) • {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-[#131313]">₹{(order.pricing?.total || 0).toLocaleString()}</p>
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full border-2 border-[#131313] shadow-[1px_1px_0_#131313] mt-1 inline-block ${
                                                order.paymentStatus === "Paid" ? "bg-[#ECFDF5] text-emerald-600" : "bg-[#FFFBEB] text-amber-600"
                                            }`}>
                                                {order.paymentStatus || "Pending"}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Dual Columns for Recent Feeds */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* Column 1: Recent Inquiries */}
                        <div className="bg-white border-[3px] border-[#131313] rounded-[28px] shadow-[6px_6px_0_#131313] p-6">
                            <div className="flex items-center justify-between border-b-[2px] border-neutral-100 pb-4 mb-4">
                                <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                    <Headphones size={18} className="text-[#8B5CF6]" />
                                    Recent Bulk Inquiries
                                </h2>
                                <Link href="/admin/inquiries" className="text-xs font-bold text-[#8B5CF6] hover:underline flex items-center gap-0.5">
                                    View All <ArrowUpRight size={14} />
                                </Link>
                            </div>
                            
                            {recentInquiries.length === 0 ? (
                                <p className="text-sm text-neutral-400 py-6 text-center">No recent inquiries.</p>
                            ) : (
                                <div className="space-y-4">
                                    {recentInquiries.map((enquiry) => (
                                        <div key={enquiry._id} className="flex items-center justify-between border-b border-neutral-50 pb-3 last:border-b-0 last:pb-0">
                                            <div>
                                                <p className="text-sm font-bold text-[#131313]">{enquiry.fullName}</p>
                                                <span className="text-xs text-neutral-400 font-medium">{enquiry.companyName} • {enquiry.quantity} chairs</span>
                                            </div>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border-2 border-[#131313] shadow-[1px_1px_0_#131313] ${
                                                enquiry.status === "contacted" ? "bg-[#EFF6FF] text-blue-600" : enquiry.status === "closed" ? "bg-[#ECFDF5] text-green-600" : "bg-[#FFFBEB] text-amber-600"
                                            }`}>
                                                {enquiry.status || "pending"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Column 2: Recent Contact Messages */}
                        <div className="bg-white border-[3px] border-[#131313] rounded-[28px] shadow-[6px_6px_0_#131313] p-6">
                            <div className="flex items-center justify-between border-b-[2px] border-neutral-100 pb-4 mb-4">
                                <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                    <MessageSquare size={18} className="text-[#8B5CF6]" />
                                    Recent Contact Messages
                                </h2>
                                <Link href="/admin/contacts" className="text-xs font-bold text-[#8B5CF6] hover:underline flex items-center gap-0.5">
                                    View All <ArrowUpRight size={14} />
                                </Link>
                            </div>

                            {recentContacts.length === 0 ? (
                                <p className="text-sm text-neutral-400 py-6 text-center">No recent messages.</p>
                            ) : (
                                <div className="space-y-4">
                                    {recentContacts.map((contact) => (
                                        <div key={contact._id} className="flex items-start justify-between border-b border-neutral-50 pb-3 last:border-b-0 last:pb-0 gap-4">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-bold text-[#131313] truncate">{contact.fullName}</p>
                                                    <span className="text-[10px] text-neutral-400 font-medium shrink-0">
                                                        {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString(undefined, { dateStyle: 'short' }) : ""}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-neutral-500 font-medium truncate mt-0.5" title={contact.message}>
                                                    {contact.message}
                                                </p>
                                            </div>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border-2 border-[#131313] shadow-[1px_1px_0_#131313] shrink-0 ${
                                                contact.status === "contacted" ? "bg-[#EFF6FF] text-blue-600" : contact.status === "closed" ? "bg-[#ECFDF5] text-green-600" : "bg-[#FFFBEB] text-amber-600"
                                            }`}>
                                                {contact.status || "pending"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
