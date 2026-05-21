"use client";

import Image from "next/image";

import {
    Star,
    ShoppingCart,
    Heart,
    Eye,
    BadgePercent,
} from "lucide-react";

import { motion } from "framer-motion";

const products = [
    {
        id: 1,
        name: "ErgoFit Chair",
        price: "₹12,999",
        oldPrice: "₹21,999",
        image: "/Product/1.webp",
        rating: 5,
        discount: "30% OFF",
    },
    {
        id: 2,
        name: "Alpha Brown Chair",
        price: "₹15,499",
        oldPrice: "₹24,999",
        image: "/Product/AlphaBrown_8.webp",
        rating: 4,
        discount: "20% OFF",
    },
    {
        id: 3,
        name: "Luxury Gaming Chair",
        price: "₹18,999",
        oldPrice: "₹28,999",
        image: "/Product/Infographic-6.webp",
        rating: 5,
        discount: "35% OFF",
    },
    {
        id: 4,
        name: "Modern Office Chair",
        price: "₹11,999",
        oldPrice: "₹18,999",
        image: "/Product/InfographicDesign-1.webp",
        rating: 4,
        discount: "25% OFF",
    },
    {
        id: 5,
        name: "Executive Chair",
        price: "₹19,999",
        oldPrice: "₹31,999",
        image: "/Product/1.webp",
        rating: 5,
        discount: "40% OFF",
    },
    {
        id: 6,
        name: "Comfort Pro Chair",
        price: "₹13,499",
        oldPrice: "₹22,999",
        image: "/Product/AlphaBrown_8.webp",
        rating: 4,
        discount: "18% OFF",
    },
    {
        id: 7,
        name: "Premium Desk Chair",
        price: "₹14,999",
        oldPrice: "₹25,999",
        image: "/Product/Infographic-6.webp",
        rating: 5,
        discount: "28% OFF",
    },
    {
        id: 8,
        name: "Elite Workspace Chair",
        price: "₹17,499",
        oldPrice: "₹27,999",
        image: "/Product/InfographicDesign-1.webp",
        rating: 5,
        discount: "32% OFF",
    },
];

export default function BestSellerSection() {
    return (
        <section className="w-full bg-gray-100 py-10">
            <div className="lg:px-15 md:px-10 px-4">
                <div className="text-center mb-8">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#243447]">
                        Best {" "}

                        <span className="text-[#00badb] relative inline-block">
                            Sellers
                            <span className="absolute left-0 -bottom-2 w-full h-[4px] bg-[#00badb]/20 rounded-full"></span>
                        </span>
                    </h2>

                    <p className="mt-4 text-gray-700 max-w-2xl mx-auto leading-relaxed">
                        Explore our top-selling ergonomic chairs crafted for
                        premium comfort, productivity, and modern workspace elegance.
                    </p>

                    <div className="flex items-center justify-center gap-2 mt-4">
                        <span className="w-16 h-[2px] bg-[#00badb]/30 rounded-full"></span>

                        <span className="w-3 h-3 rounded-full bg-[#00badb]"></span>

                        <span className="w-16 h-[2px] bg-[#00badb]/30 rounded-full"></span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.2,
                                delay: index * 0.02,
                            }}
                            viewport={{ once: true }}
                            whileHover={{
                                y: -10,
                            }}
                            className="group relative bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500"
                        >
                            <div className="absolute top-4 left-4 z-20 bg-[#00badb] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                                <BadgePercent size={14} />
                                {product.discount}
                            </div>

                            <div className="absolute top-4 right-4 z-20 flex flex-col gap-3 opacity-0 group-hover:opacity-100 translate-x-5 group-hover:translate-x-0 transition-all duration-500">
                                <button className="w-10 h-10 rounded-full bg-white shadow-md hover:bg-[#00badb] hover:text-white text-[#00badb] flex items-center justify-center transition-all">
                                    <Heart size={18} />
                                </button>

                                <button className="w-10 h-10 rounded-full bg-white shadow-md hover:bg-[#00badb] hover:text-white text-[#00badb] flex items-center justify-center transition-all">
                                    <Eye size={18} />
                                </button>
                            </div>

                            <div className="relative bg-white h-[240px] overflow-hidden">
                                <motion.div
                                    whileHover={{ scale: 1.08 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full h-full"
                                >
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-5"
                                    />
                                </motion.div>
                            </div>

                            <div className="p-5">
                                <h3 className="text-[15px] sm:text-lg font-semibold text-[#243447] line-clamp-1 group-hover:text-[#00badb] transition-all duration-300">
                                    {product.name}
                                </h3>

                                <div className="flex items-center gap-1">
                                    {[...Array(product.rating)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className="fill-yellow-400 text-yellow-400"
                                        />
                                    ))}
                                    <span className="text-sm text-gray-500 ml-1">
                                        ({product.rating}.0)
                                    </span>
                                </div>

                                <div className="mt-2 flex items-center gap-2 flex-wrap">
                                    <span className="text-2xl font-bold text-[#00badb]">
                                        {product.price}
                                    </span>

                                    <span className="text-sm text-gray-400 line-through">
                                        {product.oldPrice}
                                    </span>
                                </div>

                                {/* BUTTON */}
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="mt-4 w-full bg-[#00badb] hover:bg-cyan-500 text-white py-3 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-md"
                                >
                                    <ShoppingCart size={18} />
                                    Add to Cart
                                </motion.button>

                            </div>
                        </motion.div>
                    ))}

                </div>
            </div>
        </section>
    );
}