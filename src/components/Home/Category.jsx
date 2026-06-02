"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Category() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const getCategories = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get("/api/category");

            if (data.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <section className="relative overflow-hidden bg-[#F8F5F1] py-10">

            {/* HEADING */}
            <div className="relative z-10 md:px-15 px-4 mb-4">
                <div 
                    className="text-5xl sm:text-6xl lg:text-[4.5rem] font-black uppercase leading-[0.85] tracking-tighter"
                    style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
                >
                    <span className="block text-[#161316]">TRENDING</span>
                    <span className="block text-transparent [-webkit-text-stroke:2px_#18181b]">PRODUCTS</span>
                </div>
            </div>

            {/* SOFT BACKGROUND GLOW */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF6D29]/10 blur-[140px] rounded-full" />

            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#453027]/10 blur-[160px] rounded-full" />

            {/* CONTENT */}
            <div className="relative md:px-15 px-4 pt-8">

                {loading ? (
                    <div className="text-center text-[#453027] text-lg">
                        Loading...
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">

                            {[...categories, ...categories,].map(
                                (category, index) => (
                                    <motion.div
                                        key={category._id}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.2,
                                            delay: index * 0.02,
                                        }}
                                        viewport={{ once: true }}
                                        whileHover={{
                                            y: -8,
                                        }}
                                        className="group relative overflow-hidden rounded-3xl bg-white border border-[#E7DDD5] transition-all duration-500 hover:border-[#FF6D29] hover:shadow-[0_15px_40px_rgba(255,109,41,0.12)]">

                                        <div className="relative h-72 overflow-hidden rounded-3xl">
                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-t from-[#161316]/80 via-[#161316]/10 to-transparent" />
                                            <div className="absolute inset-0 bg-[#FF6D29]/0 group-hover:bg-[#FF6D29]/5 transition-all duration-500" />
                                        </div>

                                        <div className="absolute bottom-0 left-0 w-full px-5 py-2">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-white text-xl font-semibold capitalize tracking-wide">
                                                        {category.name}
                                                    </h3>
                                                </div>

                                                <div className="w-8 h-8 rounded-full
                                              bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center
                                              text-white group-hover:bg-[#FF6D29] group-hover:border-[#FF6D29] transition-all duration-500 group-hover:rotate-45">
                                                    <ArrowRight size={18} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF6D29] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                                    </motion.div>
                                ))}
                        </div>
                    </>)}
            </div>
        </section>
    );
}