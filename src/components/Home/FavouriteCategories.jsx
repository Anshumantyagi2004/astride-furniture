"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import { FaCartPlus } from "react-icons/fa6";
import { BsCartPlus } from "react-icons/bs";

const categories = {
    "Gaming Chair": [
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

    "Executive Chair": [
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

    "Staff Chair": [
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

    "Study Chair": [
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

    "Bar Stool": [
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
    const [activeCategory, setActiveCategory] = useState("Gaming Chair");

    return (
        <section className="w-full py-10 bg-white overflow-hidden">

            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center">
                    <span className="inline-flex items-center text-[#FF6D29] text-xs sm:text-sm font-semibold uppercase tracking-[0.2em]">
                        Explore Collections
                    </span>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#161316] leading-tight">
                        Our Favourite Categories
                    </h2>
                    <div className="w-24 h-[2px] bg-[#FF6D29] mx-auto mt-2 rounded-full"></div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                    {Object.keys(categories).map((category) => (
                        <motion.button key={category} whileTap={{ scale: 0.95 }}
                            whileHover={{ y: -2 }} onClick={() => setActiveCategory(category)}
                            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 border
                    ${activeCategory === category
                                    ? "bg-[#161316] text-white border-[#161316] shadow-lg"
                                    : "bg-white text-[#161316] border-[#E7DDD5] hover:border-[#FF6D29] hover:text-[#FF6D29]"
                                }`}
                        >
                            {category}
                        </motion.button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div key={activeCategory} initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.35 }}
                        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12"
                    >
                        {categories[activeCategory].map((product, index) => (
                            <motion.div key={product.id} initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.02, }}
                                whileHover={{ y: -8, }}
                                className="group relative rounded-3xl overflow-hidden bg-white border border-[#E7DDD5] transition-all duration-500 hover:border-[#FF6D29] hover:shadow-[0_20px_50px_rgba(255,109,41,0.12)]">
                                <div className="absolute top-4 right-4 z-20 flex flex-col gap-3">
                                    <button className="w-10 h-10 rounded-full bg-white border border-[#E7DDD5] flex items-center justify-center text-[#161316] hover:bg-[#FF6D29] hover:border-[#FF6D29] hover:text-white transition-all duration-300">
                                        <Heart size={18} />
                                    </button>

                                    <button className="w-10 h-10 rounded-full bg-white border border-[#E7DDD5]
                                     flex items-center justify-center text-[#161316] hover:bg-[#FF6D29] hover:border-[#FF6D29] hover:text-white transition-all duration-300">
                                        <BsCartPlus size={20} />
                                    </button>
                                </div>

                                <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-[#FF6D29] text-white text-xs font-semibold">
                                    -25%
                                </div>

                                <div className="relative h-[250px] bg-[#F8F5F1] overflow-hidden">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-6 group-hover:scale-105 transition-all duration-700"
                                    />

                                    {/* SOFT GLOW */}
                                    <div className="absolute inset-0 bg-[#FF6D29]/0 group-hover:bg-[#FF6D29]/5 transition-all duration-500"></div>
                                </div>

                                <div className="px-5 py-2">
                                    <h3 className="text-[17px] font-semibold text-[#161316] line-clamp-1">
                                        {product.name}
                                    </h3>

                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span key={star} className="text-[#FFB547] text-sm">
                                                ★
                                            </span>
                                        ))}

                                        <span className="ml-2 text-sm text-[#6B7280]">
                                            (4.8)
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 mt-">
                                        <span className="text-2xl font-bold text-[#161316]">
                                            ₹12,999
                                        </span>

                                        <span className="text-[#9CA3AF] line-through text-base">
                                            ₹17,999
                                        </span>
                                    </div>
                                </div>

                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-[#FF6D29] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}