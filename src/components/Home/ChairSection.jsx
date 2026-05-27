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
        <section className="relative overflow-hidden bg-[#161316] py-10 font-[Barlow]">

            {/* BACKGROUND GLOW */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#FF6D29]/10 blur-[180px] rounded-full"></div>

            <div className="relative z-10 md:px-25 px-4 lg:px-10">
                <div className="text-center mb-10">
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
                        className="text-4xl md:text-6xl font-bold text-white leading-"
                    >
                        Designed For <br />
                        Modern Workspace
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
                    {chairImages.map((image, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 80 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.7,
                                delay: index * 0.12,
                            }}
                            whileHover={{
                                y: -15,
                                scale: 1.03,
                            }}
                            className="group relative bg-white/5 border border-white/10 rounded-[30px] overflow-hidden backdrop-blur-xl hover:border-[#FF6D29]/60 transition-all duration-500"
                        >

                            {/* CARD GLOW */}
                            <div className="absolute inset-0 bg-gradient-to-b from-[#FF6D29]/0 via-[#FF6D29]/0 to-[#FF6D29]/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                            {/* IMAGE */}
                            <div className="relative h-[420px] flex items-center justify-center p-6">

                                <motion.div
                                    whileHover={{ rotate: -2 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <Image
                                        src={image}
                                        alt="Ergonomic Chair"
                                        width={500}
                                        height={500}
                                        className="w-full h-[380px] object-contain drop-shadow-[0_25px_50px_rgba(255,109,41,0.18)]"
                                    />
                                </motion.div>
                            </div>

                            {/* BOTTOM CONTENT */}
                            <div className="relative z-10 px-6 pb-4">

                                <div className="flex items-center justify-between">

                                    <div>
                                        <h3 className="text-white text-xl font-semibold">
                                            Elite Chair
                                        </h3>

                                        <p className="text-[#BABABA] text-sm mt-1">
                                            Ergonomic Comfort
                                        </p>
                                    </div>

                                    <button className="w-11 h-11 rounded-full bg-[#FF6D29] text-white flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-[0_10px_30px_rgba(255,109,41,0.4)]">
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