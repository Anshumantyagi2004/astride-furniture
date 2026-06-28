"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const sans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-sans",
});

export default function Category() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const getCategories = async () => {
        try {
            setLoading(true);

            // Add cache busting with timestamp to force fresh data
            const { data } = await axios.get(`/api/category?t=${Date.now()}`, {
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });

            if (data.success) {
                const mappedCats = data.categories.map((cat) => {
                    if (cat.name === "Bar Stool" || cat.name === "Bar Stools") {
                        return { ...cat, name: "Bar Stools & Cafe Chair" };
                    }
                    return cat;
                });
                setCategories(mappedCats);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
        
        // Refetch categories every 10 seconds to catch new additions
        const interval = setInterval(getCategories, 10000);
        
        // Also listen for storage changes (in case user opened admin in another tab)
        const handleStorageChange = () => {
            getCategories();
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <section className={`relative overflow-hidden bg-[#FAFAFA] pt-2 pb-4 ${sans.className}`}>

            {/* HEADING */}
            <div className="relative z-10 md:px-15 px-4 mb-4 max-w-[1400px] mx-auto">
                <p className="uppercase tracking-[5px] text-[#8B5CF6] text-sm font-extrabold mb-2">
                    Browse Collection
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#131313] leading-[1.05] mt-2 tracking-tight">
                    Trending <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent font-extrabold pr-2">Category</span>
                </h2>
            </div>

            {/* CONTENT */}
            <div className="relative md:px-15 px-4 pt-2">

                {loading ? (
                    <div className="text-center text-zinc-600 text-lg font-medium">
                        Loading...
                    </div>
                ) : (
                    <>
                        {/* MOBILE SCROLL VIEW (Swiper) */}
                        <div className="block sm:hidden w-full">
                            <Swiper
                                modules={[Autoplay]}
                                spaceBetween={12}
                                slidesPerView={2}
                                loop={true}
                                autoplay={{
                                    delay: 1500,
                                    disableOnInteraction: false,
                                }}
                                className="w-full pb-4"
                            >
                                {categories.map((category, index) => (
                                    <SwiperSlide key={index}>
                                        <Link 
                                            href={`/products?category=${encodeURIComponent(category.name)}`} 
                                            className="w-full block"
                                        >
                                            <div className="group relative overflow-hidden rounded-[14px] bg-white border-[2.5px] border-[#131313] shadow-[4px_4px_0_#131313] active:translate-y-[2px] active:shadow-[2px_2px_0_#131313] transition-all duration-200">
                                                <div className="relative h-[150px] w-full overflow-hidden bg-white border-b-[2.5px] border-[#131313]">
                                                    <img
                                                        src={category.image}
                                                        alt={category.name}
                                                        className="w-full h-full object-contain p-2"
                                                    />
                                                </div>
                                                <div className="w-full px-3 py-2.5 bg-white">
                                                    <div className="flex items-center justify-between gap-1">
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="text-[#131313] font-black capitalize tracking-tight text-xs truncate">
                                                                 {category.name}
                                                            </h3>
                                                        </div>
                                                        <div className="w-6 h-6 rounded-full border-[1.5px] border-[#131313] bg-[#DCF351] flex items-center justify-center text-[#131313] shrink-0">
                                                            <ArrowRight size={12} strokeWidth={3} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* DESKTOP/TABLET GRID VIEW */}
                        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-6 lg:gap-8 max-w-[1400px] mx-auto">
                            {categories.map(
                                (category, index) => (
                                    <Link key={index} href={`/products?category=${encodeURIComponent(category.name)}`} className="w-full block">
                                        <motion.div
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.2,
                                            delay: index * 0.02,
                                        }}
                                        viewport={{ once: true, margin: "200px" }}
                                        className="group relative overflow-hidden rounded-[14px] bg-white border-[2.5px] border-[#131313] shadow-[5px_5px_0_#131313] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[9px_12px_0_rgba(19,19,19,0.9)] max-md:!opacity-100 max-md:!transform-none">

                                        <div className="relative h-[300px] w-full overflow-hidden bg-white border-b-[2.5px] border-[#131313]">
                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>

                                        <div className="w-full px-4 py-4 bg-white">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className={`text-[#131313] font-black capitalize tracking-tight group-hover:text-[#EC4899] transition-all duration-300 ${
                                                        category.name.toLowerCase().includes("bar stools") || category.name.length > 18
                                                            ? "text-[12.5px] xl:text-[13.5px] 2xl:text-base whitespace-nowrap -translate-x-3"
                                                            : "text-lg"
                                                    }`} title={category.name}>
                                                         {category.name}
                                                    </h3>
                                                </div>

                                                <div className="w-8 h-8 rounded-full border-2 border-[#131313] bg-[#DCF351] flex items-center justify-center text-[#131313] transition-transform duration-300 group-hover:rotate-45 group-hover:bg-[#EC4899] group-hover:text-white shrink-0">
                                                    <ArrowRight size={18} strokeWidth={3} />
                                                </div>
                                            </div>
                                        </div>

                                    </motion.div>
                                    </Link>
                                ))}
                        </div>
                    </>)}
            </div>
        </section>
    );
}