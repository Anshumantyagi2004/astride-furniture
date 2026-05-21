import React from 'react'
import Link from "next/link";
import {
    LayoutDashboard,
    FolderPlus,
    PackagePlus,
    Boxes,
    ShoppingBag,
    Users,
    Settings,
    Headphones,
} from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="w-[260px] bg-white border-r border-gray-200 shadow-sm hidden md:flex flex-col">
            <div className="h-20 flex items-center px-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-[#00badb]">
                    Admin Panel
                </h1>
            </div>

            {/* MENU */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                <Link href="/admin"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#00badb] hover:text-white transition-all duration-300 text-gray-700 font-medium"
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </Link>

                <Link href="/admin/add-category"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#00badb] hover:text-white transition-all duration-300 text-gray-700 font-medium"
                >
                    <FolderPlus size={20} />
                    Add Category
                </Link>

                <Link href="/admin/add-product"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#00badb] hover:text-white transition-all duration-300 text-gray-700 font-medium"
                >
                    <PackagePlus size={20} />
                    Add Product
                </Link>

                <Link href="/admin/products"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#00badb] hover:text-white transition-all duration-300 text-gray-700 font-medium"
                >
                    <ShoppingBag size={20} />
                    All Products
                </Link>

                <Link href="/admin/categories"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#00badb] hover:text-white transition-all duration-300 text-gray-700 font-medium"
                >
                    <Boxes size={20} />
                    Categories
                </Link>

                <Link href="/admin/users"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#00badb] hover:text-white transition-all duration-300 text-gray-700 font-medium"
                >
                    <Users size={20} />
                    Users
                </Link>

                <Link href="/admin/orders"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#00badb] hover:text-white transition-all duration-300 text-gray-700 font-medium"
                >
                    <Settings size={20} />
                    Orders
                </Link>

                <Link href="/admin/inquiries"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#00badb] hover:text-white transition-all duration-300 text-gray-700 font-medium"
                >
                    <Headphones size={20} />
                    Inquiries
                </Link>
            </nav>
        </aside>
    )
}
