"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Package,
    IndianRupee,
    Folder,
    Edit2,
    Trash2,
    Edit,
    Heart
} from "lucide-react";
import Link from "next/link";
import { MdAddShoppingCart } from "react-icons/md";

export default function Product() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // GET PRODUCTS
    const getProducts = async () => {
        try {
            setLoading(true);
            // Add cache busting with timestamp
            const { data } = await axios.get(`/api/product?t=${Date.now()}`);

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

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* MAIN CONTENT */}
            <main className="flex-1 p-6">
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
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product, idx) => (
                            <div key={product._id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition">
                                <div className="relative h-90 w-full bg-gray-100">
                                    <Image
                                        src={product?.images?.[0]?.url}
                                        alt={product.productName}
                                        width={100}
                                        height={100}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="px-4 py-2">
                                    <h2 className="text-xl font-bold text-black hover:underline hover:text-red-600">
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

                                        <div className="flex gap-3 text-gray-800">
                                            <button className="hover:text-[#00badb] border border-gray-400 rounded-full p-2 transition-all duration-300 hover:scale-110">
                                                <Heart size={20} strokeWidth={1.8} />
                                            </button>

                                            <button className="hover:text-[#00badb] border border-gray-400 rounded-full p-2 transition-all duration-300 hover:scale-110">
                                                <MdAddShoppingCart size={22} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>)}
            </main>
        </div>
    );
}