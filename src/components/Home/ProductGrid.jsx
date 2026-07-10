"use client";

import Image from "next/image";

import { motion } from "framer-motion";

import {
    ShoppingCart,
    Heart,
    Eye,
    Plus,
} from "lucide-react";

const products = [
    {
        id: 1,
        image: "/Product/AlphaBrown_8.webp",
        title: "Modern Lounge Sofa",
        price: "₹24,999",
        oldPrice: "₹31,999",
        className: "col-span-2 row-span-2",
        top: "40%",
        left: "28%",
    },
    {
        id: 2,
        image: "/694_9.webp",
        title: "Luxury Curved Sofa",
        price: "₹42,999",
        oldPrice: "₹52,999",
        className: "col-span-4 row-span-1",
        top: "28%",
        left: "35%",
    },
    {
        id: 3,
        image: "/Product/InfographicDesign-1.webp",
        title: "Premium Beige Sofa",
        price: "₹18,999",
        oldPrice: "₹24,999",
        className: "col-span-2 row-span-2",
        top: "55%",
        left: "30%",
    },
    {
        id: 4,
        image: "/Product/Infographic_Design-6.webp",
        title: "Designer Accent Chair",
        price: "₹14,999",
        oldPrice: "₹19,999",
        className: "col-span-2 row-span-2",
        top: "70%",
        left: "22%",
    },
    {
        id: 5,
        image: "/694_9.webp",
        title: "Minimal Luxury Sofa",
        price: "₹28,999",
        oldPrice: "₹35,999",
        className: "col-span-2 row-span-1",
        top: "65%",
        left: "70%",
    },
];

export default function ShopTheLook() {
    return (
        <section className="w-full py-15 bg-white overflow-visible">
            <div className="max-w-7xl mx-auto px-4 overflow-visible">

                {/* HEADING */}
                <div className="text-center mb-10">
                    <span className="inline-flex items-center text-[#FF6D29] text-xs sm:text-sm font-semibold uppercase tracking-[0.2em]">
                        Shop The Look
                    </span>

                    <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#161316]">
                        Curated Luxury Spaces
                    </h2>

                    <p className="mt-4 text-[#2e3138] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                        Explore premium interiors and discover furniture
                        pieces crafted for modern aesthetics, elegance,
                        and everyday comfort.
                    </p>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-2 lg:grid-cols-6 auto-rows-[220px] gap-5 overflow-visible relative z-10">

                    {products.map((product, index) => (

                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.2,
                                delay: index * 0.02,
                            }}
                            whileHover={{
                                y: -6,
                            }}
                            className={`group relative overflow-visible rounded-[30px] bg-white border border-[#E7DDD5] hover:border-[#FF6D29] transition-all duration-500 hover:z-50 before:absolute before:inset-0 before:z-[-1] before:rounded-[30px] before:shadow-[0_20px_50px_rgba(255,109,41,0.12)] before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100 ${product.className}`}>
                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover rounded-[30px] group-hover:scale-105 transition-all duration-700"
                            />

                            <div className="absolute inset-0 rounded-[30px] bg-gradient-to-t from-[#161316]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                            <div className="absolute z-[999]" style={{ top: product.top, left: product.left, }}>
                                <div className="relative group/dot">
                                    <span className="absolute -inset-3 rounded-full border border-white/50 animate-ping"></span>
                                    <span className="absolute -inset-1 rounded-full border border-white/60"></span>

                                    <button className="relative w-7 h-7 rounded-full bg-white border-2 border-[#FF6D29] shadow-lg flex  items-center justify-center z-20">
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF6D29]"></span>
                                    </button>

                                    <div className="absolute left-1/2 top-full mt-4 -translate-x-1/2 opacity-0 invisible group-hover/dot:opacity-100 group-hover/dot:visible transition-all duration-300 ease-out z-[1000] pointer-events-auto">
                                        {/* Premium Frosted Connected Stem */}
                                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-white/90 border-t border-l border-white/60 z-10"></div>
                                        
                                        {/* Main Apple-Inspired Card */}
                                        <div className="w-[260px] p-3 rounded-[28px] bg-white/95 backdrop-blur-2xl border border-white/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.8)] transition-all duration-300">
                                            {/* Nested Card-in-Card Image Container */}
                                            <div className="relative h-[145px] w-full rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.03)] bg-[#FDFDFD] border border-black/[0.03]">
                                                <Image
                                                    src={product.image}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            {/* Details Block */}
                                            <div className="px-2 pt-3 pb-1">
                                                <h3 className="text-sm font-bold text-[#1C1A17] tracking-tight truncate">
                                                    {product.title}
                                                </h3>

                                                <div className="flex items-baseline gap-2 mt-1">
                                                    <span className="text-base font-extrabold text-[#1C1A17] tracking-tight">
                                                        {product.price}
                                                    </span>
                                                    <span className="text-[11px] text-[#8C8680] line-through font-medium">
                                                        {product.oldPrice}
                                                    </span>
                                                </div>

                                                {/* Premium Apple Pill Button */}
                                                <button className="flex items-center justify-center gap-1.5 mt-3.5 w-full py-2.5 rounded-full bg-[#1C1A17] hover:bg-[#FF6D29] hover:shadow-[0_6px_16px_rgba(255,109,41,0.25)] text-white text-xs font-bold tracking-tight transition-all duration-300">
                                                    <Eye size={13} strokeWidth={2.5} />
                                                    <span>View Product</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF6D29] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}