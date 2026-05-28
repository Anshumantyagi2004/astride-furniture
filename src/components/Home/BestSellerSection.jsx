"use client";

import Image from "next/image";

import {
    Heart,
    Eye,
    ShoppingBag,
    Star,
    ArrowRight,
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
        <section className="relative overflow-hidden bg-[#F6F3F1] py-10">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-[-120px] w-[420px] h-[420px] bg-[#FF6D29]/20 rounded-full blur-[120px]" />

                <div className="absolute bottom-[-150px] right-[-120px] w-[420px] h-[420px] bg-[#453027]/20 rounded-full blur-[140px]" />
            </div>

            <div className="relative z-10 lg:px-15 md:px-10 px-4">
                <div className="text-center mb-5">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#161316] leading-"
                    >
                        Best Selling <br />

                        <span className="bg-gradient-to-r from-[#FF6D29] to-[#453027] bg-clip-text text-transparent">
                            Ergonomic Chairs
                        </span>
                    </motion.h2>
                </div>

                {/* PRODUCTS */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 70 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.02, }}
                            viewport={{ once: true }}
                            whileHover={{ y: -10, }}
                            className="group relative rounded-xl border border-[#453027]/10 bg-white/70 backdrop-blur-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_60px_rgba(255,109,41,0.18)] transition-all duration-500"
                        >
                            <div className="absolute top-2 left-2 z-20">
                                <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF6D29] to-[#ff8b55] text-white text-xs font-bold shadow-[0_8px_20px_rgba(255,109,41,0.35)]">
                                    {product.discount} OFF
                                </div>
                            </div>

                            <div className="absolute top-2 right-2 z-20 flex flex-col gap-3 opacity-0 group-hover:opacity-100 translate-x-5 group-hover:translate-x-0 transition-all duration-500">
                                <button className="w-11 h-11 rounded-full border border-[#453027]/10 bg-white text-[#161316] hover:bg-[#FF6D29] hover:text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110">
                                    <Heart size={18} />
                                </button>

                                <button className="w-11 h-11 rounded-full border border-[#453027]/10 bg-white text-[#161316] hover:bg-[#453027] hover:text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110">
                                    <Eye size={18} />
                                </button>
                            </div>

                            <div className="relative h-[280px] flex items-center justify-center overflow-hidden">
                                <div className="absolute w-[250px] h-[250px] bg-[#FF6D29]/10 rounded-full blur-[90px] opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                <motion.div
                                    whileHover={{ scale: 1.05, }}
                                    transition={{ duration: 0.3 }}
                                    className="relative z-10"
                                >
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        width={500}
                                        height={500}
                                        className="w-full h-[250px] object-contain drop-shadow-[0_25px_50px_rgba(255,109,41,0.30)] group-hover:drop-shadow-[0_35px_65px_rgba(255,109,41,0.45)] transition-all duration-500"
                                    />
                                </motion.div>
                            </div>

                            <div className="px-6 pt-2 pb-4">
                                {/* TITLE */}
                                <h3 className="text-[22px] font-semibold text-[#161316] group-hover:text-[#FF6D29] transition-all duration-300 line-clamp-1">
                                    {product.name}
                                </h3>

                                <div className="flex items-center gap-1">
                                    {[...Array(product.rating)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={15}
                                            className="fill-[#FFB547] text-[#FFB547]"
                                        />
                                    ))}

                                    <span className="text-sm text-[#8B8B8B] ml-1">
                                        ({product.rating}.0 Reviews)
                                    </span>
                                </div>

                                {/* DESCRIPTION */}
                                <p className="text-[#484848] text-sm mt-1 leading-relaxed">
                                    Premium ergonomic chair with breathable mesh,
                                    adjustable comfort, and modern luxury aesthetics.
                                </p>

                                {/* FEATURES */}
                                <div className="flex items-center gap-2 flex-wrap mt-2">

                                    <span className="px-3 py-1 rounded-full bg-[#F3F3F3] text-xs text-[#5B5B5B] border border-[#453027]/5">
                                        Ergonomic
                                    </span>

                                    <span className="px-3 py-1 rounded-full bg-[#F3F3F3] text-xs text-[#5B5B5B] border border-[#453027]/5">
                                        Premium
                                    </span>

                                    <span className="px-3 py-1 rounded-full bg-[#F3F3F3] text-xs text-[#5B5B5B] border border-[#453027]/5">
                                        Mesh Back
                                    </span>
                                </div>

                                {/* PRICE */}
                                <div className="flex items-end justify-between mt-4">
                                    <div>
                                        <p className="text-[#8B8B8B] text-sm line-through">
                                            {product.oldPrice}
                                        </p>

                                        <h4 className="text-3xl font-bold text-[#161316]">
                                            {product.price}
                                        </h4>
                                    </div>

                                    <div className="absolute bottom-5 right-5 z-20 flex flex-col gap-3 opacity-0 group-hover:opacity-100 translate-x-5 group-hover:translate-x-0 transition-all duration-500">
                                        <button className="w-11 h-11 rounded-full border border-[#453027]/10 bg-white text-[#161316] hover:bg-[#FF6D29] hover:text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110">
                                            <BsCartPlus size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}