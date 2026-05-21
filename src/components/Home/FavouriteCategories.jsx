"use client";

import { useState } from "react";

import Image from "next/image";

import { motion, AnimatePresence } from "framer-motion";

const categories = {
    "Office Chair": [
        {
            id: 1,
            name: "ErgoFit Pro Chair",
            image: "/Product/1.webp",
        },
        {
            id: 2,
            name: "Executive Mesh Chair",
            image: "/Product/AlphaBrown_8.webp",
        },
        {
            id: 3,
            name: "Comfort Office Chair",
            image: "/Product/Infographic-6.webp",
        },
        {
            id: 4,
            name: "Modern Workspace Chair",
            image: "/Product/InfographicDesign-1.webp",
        },
        {
            id: 5,
            name: "Premium Office Chair",
            image: "/Product/1.webp",
        },
        {
            id: 6,
            name: "Ergo Executive",
            image: "/Product/AlphaBrown_8.webp",
        },
        {
            id: 7,
            name: "Workspace Elite",
            image: "/Product/Infographic-6.webp",
        },
        {
            id: 8,
            name: "Office Master Chair",
            image: "/Product/InfographicDesign-1.webp",
        },
    ],

    "Gaming Chair": [
        {
            id: 1,
            name: "Gaming Beast Chair",
            image: "/Product/Infographic-6.webp",
        },
        {
            id: 2,
            name: "RGB Gaming Chair",
            image: "/Product/InfographicDesign-1.webp",
        },
        {
            id: 3,
            name: "Pro Gamer Seat",
            image: "/Product/1.webp",
        },
        {
            id: 4,
            name: "Recliner Gaming Chair",
            image: "/Product/AlphaBrown_8.webp",
        },
        {
            id: 5,
            name: "Ultra Gaming Chair",
            image: "/Product/Infographic-6.webp",
        },
        {
            id: 6,
            name: "Comfort Gamer Chair",
            image: "/Product/InfographicDesign-1.webp",
        },
        {
            id: 7,
            name: "Elite Gaming Seat",
            image: "/Product/1.webp",
        },
        {
            id: 8,
            name: "Turbo Gamer Chair",
            image: "/Product/AlphaBrown_8.webp",
        },
    ],

    "BAR STOOLS": [
        {
            id: 1,
            name: "Luxury Bar Stool",
            image: "/Product/AlphaBrown_8.webp",
        },
        {
            id: 2,
            name: "Modern Bar Chair",
            image: "/Product/1.webp",
        },
        {
            id: 3,
            name: "Wooden Bar Stool",
            image: "/Product/InfographicDesign-1.webp",
        },
        {
            id: 4,
            name: "Premium Counter Stool",
            image: "/Product/Infographic-6.webp",
        },
        {
            id: 5,
            name: "Classic Stool",
            image: "/Product/AlphaBrown_8.webp",
        },
        {
            id: 6,
            name: "Elegant Bar Chair",
            image: "/Product/1.webp",
        },
        {
            id: 7,
            name: "Minimal Stool",
            image: "/Product/InfographicDesign-1.webp",
        },
        {
            id: 8,
            name: "Designer Stool",
            image: "/Product/Infographic-6.webp",
        },
    ],
};

export default function FavouriteCategories() {
    const [activeCategory, setActiveCategory] =
        useState("Office Chair");

    return (
        <section className="w-full py-10 bg-[#f8fafc] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#00badb]/10 text-[#00badb] text-sm font-semibold uppercase tracking-wide">
                        Explore Collections
                    </span>

                    <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-[#243447]">
                        Our Favourite Categories
                    </h2>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 mt-5">
                    {Object.keys(categories).map((category) => (
                        <motion.button
                            key={category}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ y: -2 }}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300
                ${activeCategory === category
                                    ? "bg-[#00badb] text-white shadow-lg"
                                    : "bg-white text-[#243447] border border-gray-200 hover:border-[#00badb]"
                                }`}
                        >
                            {category}
                        </motion.button>
                    ))}
                </div>

                <AnimatePresence mode="wait">

                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -25 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-10"
                    >

                        {categories[activeCategory].map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    delay: index * 0.05,
                                }}
                                whileHover={{
                                    y: -8,
                                }}
                                className="group bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
                            >

                                {/* IMAGE */}
                                <div className="relative h-[220px] bg-gray-50 overflow-hidden">

                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-4 group-hover:scale-105 transition-all duration-500"
                                    />

                                    {/* GLOW EFFECT */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#00badb]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                </div>

                                {/* CONTENT */}
                                <div className="p-4 text-center">

                                    <h3 className="text-[15px] sm:text-lg font-semibold text-[#243447] line-clamp-1">
                                        {product.name}
                                    </h3>

                                    <button className="mt-4 px-5 py-2 rounded-full bg-[#00badb] hover:bg-cyan-500 text-white text-sm font-medium transition-all duration-300">
                                        View Product
                                    </button>

                                </div>

                            </motion.div>
                        ))}

                    </motion.div>

                </AnimatePresence>
            </div>
        </section>
    );
}