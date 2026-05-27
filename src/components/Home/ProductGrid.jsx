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
        image: "/product/InfographicDesign-1.webp",
        title: "Premium Beige Sofa",
        price: "₹18,999",
        oldPrice: "₹24,999",
        className: "col-span-2 row-span-2",
        top: "55%",
        left: "30%",
    },
    {
        id: 4,
        image: "/product/Infographic_Design-6.webp",
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
                                duration: 0.5,
                                delay: index * 0.08,
                            }}
                            whileHover={{
                                y: -6,
                            }}
                            className={`group relative overflow-visible rounded-[30px] bg-white border border-[#E7DDD5] hover:border-[#FF6D29] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(255,109,41,0.12)] hover:z-50 ${product.className}`}>
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

                                    <div className="absolute left-1/2 top-0 pt-12 -translate-x-1/2 opacity-0 invisible group-hover/dot:opacity-100 group-hover/dot:visible transition-all duration-300">
                                        <div className="w-[260px] rounded-xl bg-white border border-[#E7DDD5] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.12)]">
                                            <div className="relative h-[180px] bg-[#F8F5F1]">
                                                <Image
                                                    src={product.image}
                                                    alt={product.title}
                                                    fill
                                                    className="object-contain p-5"
                                                />
                                            </div>

                                            <div className="px-5 py-2">
                                                <h3 className="text-lg font-semibold text-[#161316] leading-snug line-clamp-2">
                                                    {product.title}
                                                </h3>

                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="text-2xl font-bold text-[#161316]">
                                                        {product.price}
                                                    </span>

                                                    <span className="text-[#9CA3AF] line-through">
                                                        {product.oldPrice}
                                                    </span>
                                                </div>

                                                <button className="flex items-center justify-center gap-2 mt-2 w-full py-3 rounded-lg bg-[#161316] text-white font-medium hover:bg-[#FF6D29] transition-all duration-300">
                                                    <Eye />  View Product
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