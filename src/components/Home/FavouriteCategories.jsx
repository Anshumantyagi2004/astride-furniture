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
                        {categories[activeCategory].map((product, index) => {
                            // Calculate premium dynamic pricing and ratings
                            const basePrice = 3999 + (product.id * 1500) + (index * 800);
                            const discountPercent = 20 + ((product.id + index) % 4) * 5; // e.g. 20%, 25%, 30%, 35%
                            const salePrice = Math.round((basePrice * (1 - discountPercent / 100)) / 100) * 100 - 1;
                            const originalPrice = Math.round(basePrice / 100) * 100;
                            const ratingValue = (4.3 + ((product.id * 3 + index) % 7) * 0.1).toFixed(1);
                            const ratingReviews = 12 + (product.id * 14) + (index * 7);

                            return (
                                <motion.div key={product.id} initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.02, }}
                                    whileHover={{ y: -8, }}
                                    className="group relative rounded-[28px] overflow-hidden bg-white border border-gray-100 transition-all duration-500 hover:border-[#FF6D29]/30 hover:shadow-[0_20px_40px_rgba(255,109,41,0.08)]">

                                    {/* Action Buttons (Fade in on hover) */}
                                    <div className="absolute top-5 right-5 z-20 flex flex-col gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button className="w-9 h-9 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#FF6D29] hover:border-[#FF6D29] hover:text-white transition-all duration-300">
                                            <Heart size={16} />
                                        </button>

                                        <button className="w-9 h-9 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#FF6D29] hover:border-[#FF6D29] hover:text-white transition-all duration-300">
                                            <BsCartPlus size={18} />
                                        </button>
                                    </div>

                                    {/* Image Container with premium rounded margins & neutral background */}
                                    <div className="m-3 rounded-2xl relative h-[240px] bg-[#F4F4F5] overflow-hidden">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-5 group-hover:scale-105 transition-all duration-700"
                                        />

                                        {/* Premium Rating Badge - Bottom-Left of the image (exactly matching the 3rd image) */}
                                        <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-[4px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-[11px] font-extrabold text-gray-800 flex items-center gap-1">
                                            <span>{ratingValue}</span>
                                            <span className="text-[#03a685] text-xs">★</span>
                                        </div>

                                        {/* Soft hover glow overlay */}
                                        <div className="absolute inset-0 bg-[#FF6D29]/0 group-hover:bg-[#FF6D29]/2 transition-all duration-500"></div>
                                    </div>

                                    {/* Card Details Area */}
                                    <div className="px-5 pb-5 pt-1">
                                        {/* Brand/Subtitle */}
                                        <div className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-0.5">
                                            Astride Premium
                                        </div>

                                        {/* Product Title */}
                                        <h3 className="text-base font-semibold text-gray-800 line-clamp-1 group-hover:text-[#FF6D29] transition-colors duration-300">
                                            {product.name}
                                        </h3>

                                        {/* Pricing Row (exactly matching the inline styling of the 3rd image) */}
                                        <div className="flex items-baseline gap-2 mt-2">
                                            <span className="text-[17px] font-bold text-gray-900">
                                                ₹{salePrice.toLocaleString("en-IN")}
                                            </span>

                                            <span className="text-xs text-gray-400 line-through">
                                                ₹{originalPrice.toLocaleString("en-IN")}
                                            </span>

                                            <span className="text-[11px] font-extrabold text-[#FF6D29] uppercase">
                                                ({discountPercent}% OFF)
                                            </span>
                                        </div>
                                    </div>

                                    {/* Decorative bottom hover bar */}
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-[#FF6D29] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}