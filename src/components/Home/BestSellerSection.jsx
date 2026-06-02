"use client";

import React from "react";
import Image from "next/image";

import {
    Heart,
    Eye,
    Star,
    Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";
import { BsCartPlus } from "react-icons/bs";

const products = [
    {
        id: 1,
        name: "ErgoFit Chair",
        price: "₹12,999",
        oldPrice: "₹21,999",
        image: "/Png1/chair4_ACE.webp",
        rating: 5,
        discount: "30% OFF",
        tag: "Best Seller",
    },
    {
        id: 2,
        name: "Alpha Brown Chair",
        price: "₹15,499",
        oldPrice: "₹24,999",
        image: "/Png1/Chair7_Delton.webp",
        rating: 4,
        discount: "20% OFF",
        tag: "Premium Choice",
    },
    {
        id: 3,
        name: "Luxury Gaming Chair",
        price: "₹18,999",
        oldPrice: "₹28,999",
        image: "/Png1/chair11_octave.webp",
        rating: 5,
        discount: "35% OFF",
        tag: "Top Rated",
    },
    {
        id: 4,
        name: "Modern Office Chair",
        price: "₹11,999",
        oldPrice: "₹18,999",
        image: "/Png1/chair6_AlphaGrey.webp",
        rating: 4,
        discount: "25% OFF",
        tag: "Ergonomic Focus",
    },
    {
        id: 5,
        name: "Executive Chair",
        price: "₹19,999",
        oldPrice: "₹31,999",
        image: "/Png1/chair4_ACE.webp",
        rating: 5,
        discount: "40% OFF",
        tag: "Luxury Tier",
    },
    {
        id: 6,
        name: "Comfort Pro Chair",
        price: "₹13,499",
        oldPrice: "₹22,999",
        image: "/Png1/Chair7_Delton.webp",
        rating: 4,
        discount: "18% OFF",
        tag: "Popular",
    },
    {
        id: 7,
        name: "Premium Desk Chair",
        price: "₹14,999",
        oldPrice: "₹25,999",
        image: "/Png1/chair11_octave.webp",
        rating: 5,
        discount: "28% OFF",
        tag: "New Arrival",
    },
    {
        id: 8,
        name: "Elite Workspace Chair",
        price: "₹17,499",
        oldPrice: "₹27,999",
        image: "/Png1/chair6_AlphaGrey.webp",
        rating: 5,
        discount: "32% OFF",
        tag: "Special Edition",
    },
];

export default function BestSellerSection() {
    return (
        <section className="relative overflow-hidden bg-zinc-50 py-10">
            {/* Soft, luxurious grey/white radial background flares */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-[-150px] w-[500px] h-[500px] bg-zinc-200/40 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-white rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 lg:px-15 md:px-10 px-6">
                
                {/* SECTION HEADER */}
                <div className="text-center mb-8 relative">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 tracking-tight"
                    >
                        Best Selling <br />
                        <span className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-600 bg-clip-text text-transparent">
                            Ergonomic Chairs
                        </span>
                    </motion.h2>
                </div>

                {/* PRODUCTS GRID */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-8">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8 }}
                            className="group relative rounded-2xl md:rounded-3xl border border-zinc-200/80 bg-white/80 backdrop-blur-md overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-zinc-400 transition-all duration-300 cursor-pointer"
                        >
                            {/* SALE / DISCOUNT BADGE */}
                            <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20 flex flex-col gap-1 md:gap-2">
                                <div className="px-2 py-1 md:px-3.5 md:py-1.5 rounded-full bg-zinc-900 text-white text-[8px] md:text-[11px] font-bold tracking-wider shadow-sm uppercase">
                                    {product.discount}
                                </div>
                                <div className="hidden md:block px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-zinc-200 text-zinc-700 text-[10px] font-semibold tracking-wide shadow-sm">
                                    {product.tag}
                                </div>
                            </div>

                            {/* QUICK ACTION BUTTONS */}
                            <div className="hidden md:flex absolute top-4 right-4 z-20 flex-col gap-2.5 opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-300">
                                <button className="w-10 h-10 rounded-full border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-900 hover:text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110">
                                    <Heart size={16} />
                                </button>

                                <button className="w-10 h-10 rounded-full border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-900 hover:text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110">
                                    <Eye size={16} />
                                </button>
                            </div>

                            {/* PRODUCT IMAGE CONTAINER */}
                            <div className="relative h-[160px] md:h-[290px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-zinc-50/50 to-transparent">
                                {/* Subtle white/grey inner glow on hover */}
                                <div className="absolute w-[120px] h-[120px] md:w-[200px] md:h-[200px] bg-zinc-100 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                
                                <motion.div
                                    whileHover={{ scale: 1.04 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative z-10 p-3 md:p-6 w-full h-[130px] md:h-[230px] flex items-center justify-center"
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.08)] group-hover:drop-shadow-[0_25px_40px_rgba(0,0,0,0.12)] transition-all duration-500"
                                    />
                                </motion.div>
                            </div>

                            {/* PRODUCT DETAILS */}
                            <div className="px-3 md:px-6 pt-2 md:pt-3 pb-3 md:pb-6 relative">
                                
                                {/* TITLE */}
                                <h3 className="text-[13px] md:text-xl font-bold text-zinc-900 group-hover:text-zinc-600 transition-all duration-300 line-clamp-1">
                                    {product.name}
                                </h3>

                                {/* RATING */}
                                <div className="flex items-center gap-0.5 md:gap-1 mt-0.5 md:mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={10}
                                            className={`md:w-[13px] md:h-[13px] ${
                                                i < product.rating
                                                    ? "fill-yellow-500 text-yellow-500"
                                                    : "fill-zinc-200 text-zinc-200"
                                            }`}
                                        />
                                    ))}

                                    <span className="hidden md:inline text-xs text-zinc-400 ml-1 font-medium">
                                        ({product.rating}.0 Reviews)
                                    </span>
                                </div>

                                {/* DESCRIPTION */}
                                <p className="hidden md:block text-zinc-500 text-[13px] mt-2.5 leading-relaxed line-clamp-2">
                                    Premium ergonomic chair with breathable mesh,
                                    adjustable comfort, and modern luxury aesthetics.
                                </p>

                                {/* PRICE AND CART */}
                                <div className="flex items-end justify-between mt-2 md:mt-5 pt-2 md:pt-4 border-t border-zinc-100">
                                    <div>
                                        <p className="text-zinc-400 text-[10px] md:text-xs line-through mb-0 md:mb-0.5">
                                            {product.oldPrice}
                                        </p>

                                        <h4 className="text-sm md:text-2xl font-black text-zinc-900 tracking-tight">
                                            {product.price}
                                        </h4>
                                    </div>

                                    {/* CART BUTTON */}
                                    <button className="w-7 h-7 md:w-11 md:h-11 rounded-full border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-900 hover:text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-105">
                                        <BsCartPlus className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}