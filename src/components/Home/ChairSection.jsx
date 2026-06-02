"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const chairData = [
    { image: "/Png1/img1 (1).webp", name: "Classic Comfort", subtitle: "Ergonomic Comfort" },
    { image: "/Png1/chair11_octave.webp", name: "Octave Studio", subtitle: "Ergonomic Comfort" },
    { image: "/Png1/chair12_ErgoFit.webp", name: "ErgoFit Premium", subtitle: "Ergonomic Comfort" },
    { image: "/Png1/chair10_FitWell.webp", name: "FitWell Pro", subtitle: "Ergonomic Comfort" },
    { image: "/Png1/chair9_FitWell.webp", name: "FitWell Basic", subtitle: "Ergonomic Comfort" },
];

export default function ChairSection() {
    return (
        <section className="relative overflow-hidden bg-[#F8F5F1] pb-20 pt-10 border-t border-t-white">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-zinc-400/10 blur-[180px] rounded-full"></div>
            <div className="relative z-10 md:px-25 px-4 lg:px-10">
                <div className="text-center mb-8">
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="uppercase tracking-[5px] text-zinc-500 text-sm font-semibold"
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
                <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-6 scrollbar-hide md:grid md:grid-cols-2 xl:grid-cols-5 md:gap-6 -mx-4 px-4 md:mx-0 md:px-0">
                    {chairData.map((chair, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            whileHover={{
                                y: -12,
                            }}
                            className="group relative bg-white border border-gray-200 rounded-[30px] overflow-hidden hover:border-zinc-400 transition-all duration-300 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] min-w-[290px] max-w-[320px] snap-center flex-shrink-0 md:min-w-0 md:max-w-none"
                        >

                            {/* HOVER GLOW */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-500/5 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                            {/* IMAGE */}
                            <div className="relative h-[300px] md:h-[420px] flex items-center justify-center p-6">

                                <motion.div
                                    whileHover={{
                                        scale: 1.03,
                                        rotate: -1,
                                    }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full h-full flex items-center justify-center"
                                >
                                    <Image
                                        src={chair.image}
                                        alt={chair.name}
                                        width={500}
                                        height={500}
                                        className="w-full h-[260px] md:h-[380px] object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.08)] group-hover:drop-shadow-[0_35px_65px_rgba(0,0,0,0.12)] transition-all duration-500"
                                    />
                                </motion.div>
                            </div>

                            {/* CONTENT */}
                            <div className="relative z-10 px-6 pb-5">

                                <div className="flex items-center justify-between">

                                    <div>
                                        <h3 className="text-xl text-[#161316] font-semibold">
                                            {chair.name}
                                        </h3>

                                        <p className="text-[#6B7280] text-sm mt-1">
                                            {chair.subtitle}
                                        </p>
                                    </div>

                                    <button className="w-11 h-11 rounded-full bg-zinc-950 text-white flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:bg-zinc-800">
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