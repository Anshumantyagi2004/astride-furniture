"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const chairImages = [
    "/Png/IMG_43370.png",
    "/Png/IMG_4345.png",
    "/Png/IMG_4343.png",
    "/Png/IMG_4341.png",
    "/Png/IMG_4337.png",
];

export default function ChairSection() {
    return (
        <section className="relative overflow-hidden bg-[#F8F5F1] pb-16 pt-10 border-t border-t-white">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#FF6D29]/10 blur-[180px] rounded-full"></div>
            <div className="relative z-10 md:px-25 px-4 lg:px-10">
                <div className="text-center mb-8">
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="uppercase tracking-[5px] text-[#FF6D29] text-sm font-semibold"
                    >
                        Premium Ergonomics
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-4xl md:text-6xl font-bold text-[#161316] leading- mt-"
                    >
                        Designed For <br />
                        Modern Workspace
                    </motion.h2>
                </div>

                {/* CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
                    {chairImages.map((image, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            // transition={{
                            //     duration: 0.5,
                            //     delay: index * 0.1,
                            // }}
                            whileHover={{
                                y: -12,
                            }}
                            className="group relative bg-white border border-gray-200 rounded-[30px] overflow-hidden hover:border-[#FF6D29]/40 transition-all duration-500 shadow-sm hover:shadow-[0_20px_50px_rgba(255,109,41,0.15)]"
                        >

                            {/* HOVER GLOW */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FF6D29]/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                            {/* IMAGE */}
                            <div className="relative h-[420px] flex items-center justify-center p-6">

                                <motion.div
                                    whileHover={{
                                        scale: 1.03,
                                        rotate: -1,
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Image
                                        src={image}
                                        alt="Ergonomic Chair"
                                        width={500}
                                        height={500}
                                        className="w-full h-[380px] object-contain drop-shadow-[0_25px_45px_rgba(255,109,41,0.35)] group-hover:drop-shadow-[0_35px_65px_rgba(255,109,41,0.55)] transition-all duration-500"
                                    />
                                </motion.div>
                            </div>

                            {/* CONTENT */}
                            <div className="relative z-10 px-6 pb-5">

                                <div className="flex items-center justify-between">

                                    <div>
                                        <h3 className="text-xl text-[#161316] font-semibold">
                                            Elite Chair
                                        </h3>

                                        <p className="text-[#6B7280] text-sm mt-1">
                                            Ergonomic Comfort
                                        </p>
                                    </div>

                                    <button className="w-11 h-11 rounded-full bg-[#FF6D29] text-white flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-[0_10px_30px_rgba(255,109,41,0.35)]">
                                        →
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}