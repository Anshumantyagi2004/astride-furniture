"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { useProducts } from "@/context/ProductsContext";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const sans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-sans",
});

const chairData = [
    { 
        mainImage: "/Png1/img1 (1).webp", 
        hoverImage: "/Png/img1 (2).png", 
        name: "Ergonomic Comfort", 
        subtitle: "ErgoFit",
        productId: "6a27a9016149f2acd03556be",
        mainScaleValue: 0.95,
        hoverScaleValue: 1.00
    },
    { 
        mainImage: "/Png1/chair12_ErgoFit.webp", 
        hoverImage: "/Png1/chair12_ErgoFit12a.png", 
        name: "ErgoFit Premium", 
        subtitle: "Ergonomic White",
        productId: "6a27a9016149f2acd03556be",
        mainScaleValue: 0.95,
        hoverScaleValue: 1.00
    },
    { 
        mainImage: "/Png1/chair10_FitWell.webp", 
        hoverImage: "/Png1/chair10_FitWell10a.png", 
        name: "Ergonomic Comfort", 
        subtitle: "FlexPro",
        productId: "6a22790f4299b73c074f7e50",
        mainScaleValue: 0.95,
        hoverScaleValue: 1.00
    },
    { 
        mainImage: "/Png1/chair9_FitWell.webp", 
        hoverImage: "/Png1/chair9_FitWell9a.png", 
        name: "FitWell Basic", 
        subtitle: "FitWell Ergonomic",
        productId: "6a2269068d4f1a8c812a9e92",
        mainScaleValue: 0.95,
        hoverScaleValue: 1.00
    },
    { 
        mainImage: "/Png1/chair11_octave.webp", 
        hoverImage: "/Png1/chair11_octave11a.png", 
        name: "Studio", 
        subtitle: "Octave",
        productId: "6a225caabb685c5865ef3f59",
        mainScaleValue: 0.95,
        hoverScaleValue: 1.00
    },
];

function ChairCard({ chair, products, priorityLoad }) {
    // Find product by ID
    const product = products.find(p => p._id === chair.productId);
    const targetUrl = product ? `/products/${product.slug}` : `/products`;

    return (
        <Link
            href={targetUrl}
            className={`group relative bg-white border border-gray-200 rounded-[30px] overflow-hidden transition-all duration-300 block h-full w-full cursor-pointer md:hover:border-zinc-400 md:hover:-translate-y-3 md:hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] ${sans.className}`}
        >
            {/* HOVER GLOW (Desktop Only) */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-zinc-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

            {/* IMAGE CONTAINER */}
            <div className="relative h-[300px] md:h-[420px] flex items-center justify-center p-6">
                <div className="w-full h-full flex items-center justify-center relative transition-transform duration-300 md:group-hover:scale-105 md:group-hover:-rotate-1">
                    
                    {/* Main Image (Stacked - visible by default, hides on desktop hover) */}
                    <div 
                        className="absolute w-full h-[260px] md:h-[380px] transition-all duration-500 flex items-center justify-center md:group-hover:opacity-0 md:group-hover:scale-90"
                        style={{ transform: `scale(${chair.mainScaleValue || 0.95})` }}
                    >
                        <Image
                            src={chair.mainImage}
                            alt={chair.name}
                            width={400}
                            height={400}
                            priority={priorityLoad}
                            className="w-full h-full object-contain shadow-none transition-all duration-500"
                        />
                    </div>

                    {/* Hover Image (Stacked - hidden by default, shows on desktop hover) */}
                    <div 
                        className="hidden md:flex absolute w-full h-[260px] md:h-[380px] transition-all duration-500 items-center justify-center opacity-0 scale-90 md:group-hover:opacity-100 md:group-hover:scale-100 pointer-events-none"
                    >
                        <Image
                            src={chair.hoverImage}
                            alt={`${chair.name} Alternative View`}
                            width={400}
                            height={400}
                            loading="lazy"
                            className="w-full h-full object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.08)] transition-all duration-500"
                        />
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="relative z-10 px-6 pb-5 bg-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className={`text-xl text-[#161316] font-bold ${sans.className}`}>
                            {chair.name}
                        </h3>
                        <p className={`text-[#8B5CF6] text-sm font-semibold mt-1 ${sans.className}`}>
                            {chair.subtitle}
                        </p>
                    </div>
                    <div className="w-11 h-11 rounded-full bg-zinc-950 text-white flex items-center justify-center transition-all duration-300 md:group-hover:scale-110 md:group-hover:bg-zinc-800">
                        →
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function ChairSection() {
    const { products, loading } = useProducts();

    return (
        <section className={`relative overflow-hidden bg-[#f1f3f5] pb-10 pt-6 border-t border-t-white ${sans.className}`}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-zinc-400/10 blur-[180px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 px-4 md:px-10 lg:px-20 mx-auto max-w-[1600px]">
                <div className="text-center mb-8">
                    <p className={`uppercase tracking-[5px] text-[#8B5CF6] text-sm font-extrabold ${sans.className}`}>
                        Premium Ergonomics
                    </p>
                    <h2 className={`text-4xl md:text-6xl font-black text-[#161316] leading-none mt-2 ${sans.className}`}>
                        Designed For <br />
                        <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent font-extrabold">Modern Workspace</span>
                    </h2>
                </div>

                {/* SWIPER CAROUSEL */}
                <div className="w-full">
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1} // Changed from 1.15 to exactly 1 to remove side lines
                        loop={true}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2.2,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 24,
                            },
                            1280: {
                                slidesPerView: 5,
                                spaceBetween: 24,
                            }
                        }}
                        className="!pb-10"
                    >
                        {chairData.map((chair, index) => (
                            <SwiperSlide key={index} className="!h-auto flex">
                                <ChairCard 
                                    chair={chair} 
                                    products={products} 
                                    priorityLoad={index < 2} 
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}