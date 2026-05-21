"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { Star } from "lucide-react";

export default function MarketplaceReviews() {
    return (
        <section className="w-full py-10 bg-gradient-to-b from-white to-[#f8fafc] overflow-hidden">

            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#243447] leading-tight"
                    >
                        India&apos;s Leading Ergonomic Furniture Brand
                    </motion.h2>

                    <div className="flex items-center justify-center gap-2 mt-4">
                        <span className="w-16 h-[2px] bg-[#00badb]/30 rounded-full"></span>

                        <span className="w-3 h-3 rounded-full bg-[#00badb]"></span>

                        <span className="w-16 h-[2px] bg-[#00badb]/30 rounded-full"></span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        whileHover={{ y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500"
                    >
                        <div className="flex h-30 items-center justify-center">
                            <Image
                                src="/Amazon_icon.png"
                                alt="Amazon"
                                width={180}
                                height={80}
                                className="h-full w-full object-contain"
                            />
                        </div>

                        <div className="mt-2 text-center">

                            <h3 className="text-5xl font-bold text-[#243447]">
                                55K+
                            </h3>

                            <p className="mt-2 text-gray-600 text-lg font-medium">
                                Customer Reviews
                            </p>

                            {/* STARS */}
                            <div className="flex items-center justify-center gap-1 mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={22}
                                        className="fill-yellow-400 text-yellow-400"
                                    />
                                ))}
                            </div>

                            <p className="mt-3 text-[#00badb] font-semibold text-lg">
                                4.9/5 Average Rating
                            </p>

                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        whileHover={{ y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500"
                    >
                        <div className="flex h-30 items-center justify-center">
                            <Image
                                src="/Flipkart-Icon-Logo-Small.png"
                                alt="Flipkart"
                                width={180}
                                height={80}
                                className="h-full w-full object-contain"
                            />
                        </div>

                        <div className="mt-2 text-center">

                            <h3 className="text-5xl font-bold text-[#243447]">
                                40K+
                            </h3>

                            <p className="mt-2 text-gray-600 text-lg font-medium">
                                Verified Ratings
                            </p>

                            {/* STARS */}
                            <div className="flex items-center justify-center gap-1 mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={22}
                                        className="fill-yellow-400 text-yellow-400"
                                    />
                                ))}
                            </div>

                            <p className="mt-3 text-[#00badb] font-semibold text-lg">
                                4.8/5 Customer Satisfaction
                            </p>

                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}