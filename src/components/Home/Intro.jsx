"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import {
    ShieldCheck,
    Sofa,
    Sparkles,
    Armchair,
} from "lucide-react";

export default function BrandAboutSection() {
    return (
        <section className="w-full py-12 bg-[#F8F5F1] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-14 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-2 gap-5"
                    >
                        <div className="col-span-2 relative h-[320px] rounded-[30px] overflow-hidden bg-white border border-[#E7DDD5] hover:border-[#FF6D29] transition-all duration-500">
                            <Image
                                src="/694_9.webp"
                                alt="Office Chair"
                                fill
                                className="object-cover hover:scale-105 transition-all duration-700"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-[#161316]/30 via-transparent to-transparent"></div>
                        </div>

                        <div className="relative h-[300px] rounded-[28px] overflow-hidden bg-white
                         border border-[#E7DDD5] hover:border-[#FF6D29] transition-all duration-500">
                            <Image
                                src="/Product/AlphaBrown_8.webp"
                                alt="Chair"
                                fill
                                className="object-cover hover:scale-105 transition-all duration-700"
                            />
                        </div>

                        <div className="relative h-[300px] rounded-[28px]
                         overflow-hidden bg-white border border-[#E7DDD5] hover:border-[#FF6D29] transition-all duration-500">
                            <Image
                                src="/Product/Infographic-6.webp"
                                alt="Chair"
                                fill
                                className="object-cover hover:scale-105 transition-all duration-700"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >

                        {/* TAG */}
                        <span className="flex flex-col justify-start items-start text-[#FF6D29] text-xs sm:text-sm font-semibold uppercase tracking-[0.2em]">
                            About ASTRIDE
                            <div className="w-20 h-[2px] bg-[#FF6D29] mt-2 rounded-full"></div>
                        </span>

                        {/* HEADING */}
                        <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#161316] leading-tight">
                            India’s Trusted Office Chair Manufacturer & Supplier
                        </h2>

                        {/* DESCRIPTION */}
                        <p className="mt-4 text-[#3f4248] leading-relaxed text-base sm:text-lg">
                            At{" "}
                            <span className="font-semibold text-[#FF6D29]">
                                ASTRIDE
                            </span>
                            , we create premium ergonomic office chairs designed
                            for comfort, elegance, and productivity. From
                            work-from-home setups to executive seating solutions,
                            every chair is crafted with modern aesthetics and
                            exceptional support.
                        </p>

                        <p className="mt-4 text-[#3f4248] leading-relaxed text-base sm:text-lg">
                            Explore mesh back chairs, lumbar support chairs,
                            revolving office chairs, adjustable seating, and
                            modern workspace collections built with innovation,
                            durability, and style.
                        </p>

                        {/* FEATURES */}
                        <div className="grid grid-cols-2 gap-4 mt-5">
                            <div className="flex items-center gap-4 p-5 rounded-2xl
                            bg-white border border-[#E7DDD5] hover:border-[#FF6D29] transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-[#FF6D29] flex items-center justify-center shrink-0">
                                    <Sofa size={22} className="text-white" />
                                </div>

                                <h3 className="font-semibold text-[#161316]">
                                    Ergonomic Comfort
                                </h3>
                            </div>

                            <div className="flex items-center gap-4 p-5 rounded-2xl
                            bg-white border border-[#E7DDD5] hover:border-[#FF6D29] transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-[#FF6D29] flex items-center justify-center shrink-0">
                                    <ShieldCheck size={22} className="text-white" />
                                </div>

                                <h3 className="font-semibold text-[#161316]">
                                    Premium Quality
                                </h3>
                            </div>

                            <div className="flex items-center gap-4 p-5 rounded-2xl
                            bg-white border border-[#E7DDD5] hover:border-[#FF6D29] transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-[#FF6D29] flex items-center justify-center shrink-0">
                                    <Sparkles size={22} className="text-white" />
                                </div>

                                <h3 className="font-semibold text-[#161316]">
                                    Sleek Aesthetics
                                </h3>
                            </div>

                            <div className="flex items-center gap-4 p-5 rounded-2xl
                            bg-white border border-[#E7DDD5] hover:border-[#FF6D29] transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-[#FF6D29] flex items-center justify-center shrink-0">
                                    <Armchair size={22} className="text-white" />
                                </div>

                                <h3 className="font-semibold text-[#161316]">
                                    Modern Designs
                                </h3>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}