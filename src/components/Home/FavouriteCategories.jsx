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
            name: "Octave Gaming Pro",
            image: "/Png1/chair11_octave.webp",
        },
        {
            id: 2,
            name: "ACE Gaming Edition",
            image: "/Png1/chair4_ACE.webp",
        },
        {
            id: 3,
            name: "ErgoFit Ultra Gaming",
            image: "/Png1/chair12_ErgoFit.webp",
        },
        {
            id: 4,
            name: "AlphaGrey Combat",
            image: "/Png1/chair6_AlphaGrey.webp",
        },
        {
            id: 5,
            name: "Delton Esports Elite",
            image: "/Png1/Chair7_Delton.webp",
        },
        {
            id: 6,
            name: "Erizo RGB Edition",
            image: "/Png1/chair8_ERIZO.webp",
        },
        {
            id: 7,
            name: "FitWell Gaming Lite",
            image: "/Png1/chair9_FitWell.webp",
        },
        {
            id: 8,
            name: "FitWell Gaming Pro",
            image: "/Png1/chair10_FitWell.webp",
        },
    ],

    "Executive Chair": [
        {
            id: 1,
            name: "ErgoFit Premium Executive",
            image: "/Png1/chair12_ErgoFit.webp",
        },
        {
            id: 2,
            name: "Delton High-Back Pro",
            image: "/Png1/Chair7_Delton.webp",
        },
        {
            id: 3,
            name: "AlphaGrey Executive Mesh",
            image: "/Png1/chair6_AlphaGrey.webp",
        },
        {
            id: 4,
            name: "Amica Black Classic",
            image: "/Png1/Chair6a_Amica Black .webp",
        },
        {
            id: 5,
            name: "Gladus Premium Grey",
            image: "/Png1/Chair6b_Gladus Grey.webp",
        },
        {
            id: 6,
            name: "AirSense Aero Mesh",
            image: "/Png1/chair5_AIRSENSE.webp",
        },
        {
            id: 7,
            name: "Erizo Ergonomic Mesh",
            image: "/Png1/chair8_ERIZO.webp",
        },
        {
            id: 8,
            name: "Classic Comfort Director",
            image: "/Png1/img1 (1).webp",
        },
    ],

    "Staff Chair": [
        {
            id: 1,
            name: "AirSense Task Chair",
            image: "/Png1/chair5_AIRSENSE.webp",
        },
        {
            id: 2,
            name: "Amica Black Tasker",
            image: "/Png1/Chair6a_Amica Black .webp",
        },
        {
            id: 3,
            name: "Rapid Black Tasker",
            image: "/Png1/chair6c_Rapid Black .webp",
        },
        {
            id: 4,
            name: "Delton Staff Comfort",
            image: "/Png1/Chair7_Delton.webp",
        },
        {
            id: 5,
            name: "Erizo Staff Mesh",
            image: "/Png1/chair8_ERIZO.webp",
        },
        {
            id: 6,
            name: "FitWell Basic Staff",
            image: "/Png1/chair9_FitWell.webp",
        },
        {
            id: 7,
            name: "FitWell Pro Staff",
            image: "/Png1/chair10_FitWell.webp",
        },
        {
            id: 8,
            name: "ACE Task Support",
            image: "/Png1/chair4_ACE.webp",
        },
    ],

    "Study Chair": [
        {
            id: 1,
            name: "Classic Comfort Study",
            image: "/Png1/img1 (1).webp",
        },
        {
            id: 2,
            name: "FitWell Basic Student",
            image: "/Png1/chair9_FitWell.webp",
        },
        {
            id: 3,
            name: "FitWell Pro Study",
            image: "/Png1/chair10_FitWell.webp",
        },
        {
            id: 4,
            name: "Octave Studio Student",
            image: "/Png1/chair11_octave.webp",
        },
        {
            id: 5,
            name: "ACE Task Study",
            image: "/Png1/chair4_ACE.webp",
        },
        {
            id: 6,
            name: "AirSense Lite Study",
            image: "/Png1/chair5_AIRSENSE.webp",
        },
        {
            id: 7,
            name: "Erizo Study Mesh",
            image: "/Png1/chair8_ERIZO.webp",
        },
        {
            id: 8,
            name: "Gladus Grey Student",
            image: "/Png1/Chair6b_Gladus Grey.webp",
        },
    ],

    "Bar Stool": [
        {
            id: 1,
            name: "Zenith Pro Stool",
            image: "/Png1/chair10_FitWell.webp",
        },
        {
            id: 2,
            name: "Apex Bar Stool",
            image: "/Png1/chair9_FitWell.webp",
        },
        {
            id: 3,
            name: "Octave Counter Stool",
            image: "/Png1/chair11_octave.webp",
        },
        {
            id: 4,
            name: "Delton High Counter",
            image: "/Png1/Chair7_Delton.webp",
        },
        {
            id: 5,
            name: "ACE High Stool",
            image: "/Png1/chair4_ACE.webp",
        },
        {
            id: 6,
            name: "AirSense High Stool",
            image: "/Png1/chair5_AIRSENSE.webp",
        },
        {
            id: 7,
            name: "AlphaGrey Counter Stool",
            image: "/Png1/chair6_AlphaGrey.webp",
        },
        {
            id: 8,
            name: "Erizo Bar Stool",
            image: "/Png1/chair8_ERIZO.webp",
        },
    ],
};

export default function FavouriteCategories() {
    const [activeCategory, setActiveCategory] = useState("Gaming Chair");

    return (
        <section className="w-full py-16 bg-[#F8F9FA] overflow-hidden">

            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-10">
                    <span className="inline-flex items-center text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-[0.25em]">
                        Explore Collections
                    </span>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#161316] leading-tight mt-2 tracking-tight">
                        Our Favourite Categories
                    </h2>
                    <div className="w-16 h-[3px] bg-slate-800 mx-auto mt-3 rounded-full"></div>
                </div>

                {/* Fluid active tab switcher */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-1.5 bg-gray-100 rounded-full max-w-2xl mx-auto mt-8 border border-gray-200/50">
                    {Object.keys(categories).map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className="relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-300 focus:outline-none"
                        >
                            {activeCategory === category && (
                                <motion.div
                                    layoutId="activeCategoryBg"
                                    className="absolute inset-0 bg-[#161316] rounded-full shadow-sm"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                            <span
                                className={`relative z-10 transition-colors duration-300 ${
                                    activeCategory === category ? "text-white" : "text-gray-500 hover:text-gray-900"
                                }`}
                            >
                                {category}
                            </span>
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory}
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: { staggerChildren: 0.04 }
                            }
                        }}
                        initial="hidden"
                        animate="show"
                        exit={{ opacity: 0, transition: { duration: 0.15 } }}
                        className="flex overflow-x-auto gap-4 pb-4 scrollbar-none snap-x snap-mandatory sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6 sm:pb-0 sm:overflow-visible mt-12"
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
                                <motion.div
                                    key={`${activeCategory}-${product.id}`}
                                    variants={{
                                        hidden: { opacity: 0, y: 15 },
                                        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } }
                                    }}
                                    whileHover={{ y: -6 }}
                                    className="group relative rounded-[24px] overflow-hidden bg-white border border-gray-200/60 transition-all duration-300 hover:border-slate-300/80 hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)] min-w-[270px] sm:min-w-0 snap-start flex-shrink-0"
                                >
                                    {/* Action Buttons (Fade in on hover) */}
                                    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                                        <button className="w-8.5 h-8.5 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#161316] hover:text-white hover:scale-105 active:scale-95 transition-all duration-200">
                                            <Heart size={15} />
                                        </button>

                                        <button className="w-8.5 h-8.5 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#161316] hover:text-white hover:scale-105 active:scale-95 transition-all duration-200">
                                            <BsCartPlus size={16} />
                                        </button>
                                    </div>

                                    {/* Image Container with premium rounded margins & neutral background */}
                                    <div className="m-3 rounded-2xl relative h-[220px] bg-[#F3F4F6] overflow-hidden">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-6 transform group-hover:scale-103 transition-transform duration-500 ease-out"
                                        />

                                        {/* Premium Rating Badge - Bottom-Left */}
                                        <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-[6px] border border-gray-100 shadow-xs text-[10px] font-bold text-gray-700 flex items-center gap-1">
                                            <span>{ratingValue}</span>
                                            <span className="text-[#03a685] text-xs">★</span>
                                            <span className="text-gray-400 font-normal">({ratingReviews})</span>
                                        </div>
                                    </div>

                                    {/* Card Details Area */}
                                    <div className="px-5 pb-5 pt-1">
                                        {/* Brand/Subtitle */}
                                        <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                                            Astride Premium
                                        </div>

                                        {/* Product Title */}
                                        <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-1 group-hover:text-slate-900 transition-colors duration-300">
                                            {product.name}
                                        </h3>

                                        {/* Pricing Row */}
                                        <div className="flex items-baseline gap-2 mt-2">
                                            <span className="text-base sm:text-[17px] font-bold text-gray-900">
                                                ₹{salePrice.toLocaleString("en-IN")}
                                            </span>

                                            <span className="text-xs text-gray-400 line-through">
                                                ₹{originalPrice.toLocaleString("en-IN")}
                                            </span>

                                            <span className="text-[10px] sm:text-[11px] font-bold text-[#03a685]">
                                                {discountPercent}% OFF
                                            </span>
                                        </div>
                                    </div>

                                    {/* Decorative subtle bottom hover bar */}
                                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#161316] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}