"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "@/components/Admin/Sidebar";
import {
    Package,
    IndianRupee,
    Folder,
    Edit2,
    Trash2,
    Edit,
} from "lucide-react";
import Link from "next/link";

export default function Page() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // GET PRODUCTS
    const getProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/product");

            if (data.success) {
                setProducts(data.products);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    const deleteProduct = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        try {
            const { data } = await axios.delete(`/api/product/${id}`);

            if (data.success) {
                toast.success("Product deleted successfully");
                if (typeof window !== "undefined") {
                    sessionStorage.removeItem("astride_products_cache");
                    sessionStorage.removeItem("astride_nav_products_cache");
                    sessionStorage.removeItem("astride_bestsellers_cache");
                    sessionStorage.removeItem("astride_nav_categories_cache");
                }
                getProducts();
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Delete failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />

            {/* MAIN CONTENT */}
            <main className="flex-1 p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black">
                        All Products
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Manage all your products
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6, }).map((_, index) => (
                            <div key={index} className="bg-white rounded-3xl overflow-hidden shadow animate-pulse">
                                <div className="h-56 bg-gray-300" />
                                <div className="p-5 space-y-4">
                                    <div className="h-5 bg-gray-300 rounded w-3/4" />

                                    <div className="h-4 bg-gray-200 rounded w-1/2" />

                                    <div className="h-4 bg-gray-200 rounded w-full" />

                                    <div className="h-10 bg-gray-300 rounded-xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-white rounded-3xl p-10 text-center shadow">
                        <Package
                            className="mx-auto text-gray-600 mb-4"
                            size={60}
                        />

                        <h2 className="text-2xl font-bold text-black">
                            No Products Found
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Add your first product
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product, idx) => (
                            <div key={product._id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition">
                                <div className="relative h-60 w-full bg-gray-100">
                                    <Image
                                        src={product?.colorVariants?.[0]?.images?.[0]?.url}
                                        alt={product.productName}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="p-5">
                                    <h2 className="text-xl font-bold text-black line-clamp-1">
                                        {product.productName}
                                    </h2>

                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center text-black font-bold text-xl">
                                                <IndianRupee size={18} />

                                                {product.realPrice}
                                            </div>

                                            <div className="flex items-center text-gray-600 line-through">
                                                <IndianRupee size={16} />

                                                {product.oldPrice}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Folder size={18} />

                                            <span className="text-sm">
                                                {product?.category?.name}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                                        {product.shortDescription}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <Link href={`/admin/products/${product.slug}`} className="bg-green-100 text-green-600 py-3 rounded-xl flex justify-center items-center font-medium hover:bg-green-200 transition">
                                            <Edit />
                                        </Link>

                                        <button onClick={() => deleteProduct(product._id)} className="bg-red-100 text-red-600 py-3 rounded-xl flex justify-center items-center font-medium hover:bg-red-200 transition">
                                            <Trash2 />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>)}
            </main>
        </div>
    );
}