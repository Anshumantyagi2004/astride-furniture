"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";


const comparisons = [
    {
        category: "Office Chairs",
        left: {
            name: "ErgoFit Office",
            image: "/Product/1.webp",
            price: "₹12,999",
        },
        right: {
            name: "Other Brand",
            image: "/Product/AlphaBrown_8.webp",
            price: "₹18,999",
        },
        features: [
            { label: "Ergonomic Design", left: true, right: false },
            { label: "Lumbar Support", left: true, right: true },
            { label: "3-Year Warranty", left: true, right: false },
            { label: "Premium Mesh", left: true, right: false },
        ],
    },
    {
        category: "Gaming Chairs",
        left: {
            name: "ErgoFit Gaming",
            image: "/Product/Infographic-6.webp",
            price: "₹15,999",
        },
        right: {
            name: "Other Gaming",
            image: "/Product/InfographicDesign-1.webp",
            price: "₹22,999",
        },
        features: [
            { label: "Footrest", left: true, right: false },
            { label: "4D Armrests", left: true, right: false },
            { label: "180° Recline", left: true, right: true },
            { label: "Premium Leather", left: true, right: false },
        ],
    },
];

function Icon({ val }) {
    return val ? (
        <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200/70 flex items-center justify-center">
            <Check size={15} strokeWidth={2.5} className="text-emerald-600" />
        </div>
    ) : (
        <div className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
            <X size={15} strokeWidth={2.5} className="text-red-400" />
        </div>
    );
}

export default function ComparisonSection() {
    const swiperRef = useRef(null);
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { margin: "0px" });
    // ✅ Mobile optimization: Disable motion animations on mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const [swiperInstance, setSwiperInstance] = useState(null);

    useEffect(() => {
        if (swiperInstance && !swiperInstance.destroyed && swiperInstance.autoplay) {
            try {
                if (isInView) {
                    swiperInstance.autoplay.start();
                } else {
                    swiperInstance.autoplay.stop();
                }
            } catch (err) {}
        }
    }, [isInView, swiperInstance]);

    return (
        <section ref={sectionRef} className="w-full pt-8 pb-4 bg-[#F8F7F5] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">

                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-6 gap-4 sm:gap-6">
                    <motion.div
                        initial={isMobile ? false : { opacity: 0, y: 16 }}
                        whileInView={isMobile ? false : { opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "200px" }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="inline-block text-[10px] uppercase tracking-[0.22em] font-extrabold text-[#E25C37] mb-3 px-3.5 py-1 rounded-full border border-[#E25C37]/20 bg-[#E25C37]/[0.05]">
                            Side by Side
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1C1A17] tracking-tight leading-tight">
                            Why Astride Wins,
                            <br />
                            <span className="bg-gradient-to-r from-[#C94A28] via-[#E25C37] to-[#C9622A] bg-clip-text text-transparent">
                                Every Time.
                            </span>
                        </h2>
                    </motion.div>

                    {/* Custom Nav Arrows */}
                    <motion.div
                        initial={isMobile ? false : { opacity: 0 }}
                        whileInView={isMobile ? false : { opacity: 1 }}
                        viewport={{ once: true, margin: "200px" }}
                        transition={{ delay: 0.2 }}
                        className="hidden sm:flex items-center gap-3 self-end sm:self-auto max-md:!opacity-100 max-md:!transform-none"
                    >
                        <button
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="w-11 h-11 rounded-full border border-[#E2DDD8] bg-white hover:bg-[#1C1A17] hover:border-[#1C1A17] text-[#4A4540] hover:text-white flex items-center justify-center transition-all duration-300 shadow-none md:shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => swiperRef.current?.slideNext()}
                            className="w-11 h-11 rounded-full border border-[#E2DDD8] bg-white hover:bg-[#1C1A17] hover:border-[#1C1A17] text-[#4A4540] hover:text-white flex items-center justify-center transition-all duration-300 shadow-none md:shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </motion.div>
                </div>

                {/* Swiper */}
                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        setSwiperInstance(swiper);
                    }}
                    modules={[Pagination, Autoplay]}
                    pagination={{
                        clickable: true,
                        renderBullet: (_, className) =>
                            `<span class="${className}" style="width:28px;height:4px;border-radius:9999px;background:#1C1A17;opacity:0.18;display:inline-block;transition:all 0.3s;margin:0 3px;"></span>`,
                    }}
                    autoplay={{ delay: 4500, disableOnInteraction: false }}
                    grabCursor
                    loop={comparisons.length >= 4}
                    className="!pb-12 [&_.swiper-pagination-bullet-active]:!opacity-100 [&_.swiper-pagination-bullet-active]:!w-[44px]"
                >
                    {comparisons.map((c, i) => (
                        <SwiperSlide key={i}>
                            <motion.div
                                initial={isMobile ? false : { opacity: 0, y: 20 }}
                                whileInView={isMobile ? false : { opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "200px" }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="bg-white border border-[#E8E5E1] rounded-[28px] overflow-hidden shadow-none md:shadow-[0_8px_40px_rgba(0,0,0,0.05)] max-md:!opacity-100 max-md:!transform-none"
                            >
                                {/* === TOP SECTION: Two chairs + VS === */}
                                <div className="grid grid-cols-[1fr_1px_1fr] bg-[#FAFAF8]">

                                    {/* LEFT — Astride */}
                                    <div className="px-3 sm:px-6 py-5 sm:py-8 flex flex-col items-center text-center">
                                        <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full mb-3">
                                            ✦ Best Value
                                        </span>
                                        <div className="relative w-[110px] h-[110px] sm:w-[190px] sm:h-[190px] rounded-2xl overflow-hidden bg-white border border-[#EFEFEF]">
                                            <motion.div whileHover={{ scale: 1.05 }} className="relative w-full h-full">
                                                <Image src={c.left.image} alt={c.left.name} fill className="object-contain p-2 sm:p-3" />
                                            </motion.div>
                                        </div>
                                        <p className="mt-3 text-xs sm:text-base font-black text-[#1C1A17] leading-tight">{c.left.name}</p>
                                        <p className="text-lg sm:text-2xl font-black text-emerald-600 mt-0.5">{c.left.price}</p>
                                    </div>

                                    {/* Divider + VS badge */}
                                    <div className="relative bg-[#EDEAE6]">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#1C1A17] border-4 border-[#FAFAF8] flex items-center justify-center shadow-lg">
                                            <span className="text-[7px] font-black text-white tracking-widest">VS</span>
                                        </div>
                                    </div>

                                    {/* RIGHT — Competitor */}
                                    <div className="px-3 sm:px-6 py-5 sm:py-8 flex flex-col items-center text-center">
                                        <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#9C948E] bg-[#F4F2EF] border border-[#E0DBD5] px-2.5 py-0.5 rounded-full mb-3">
                                            Competitor
                                        </span>
                                        <div className="relative w-[110px] h-[110px] sm:w-[190px] sm:h-[190px] rounded-2xl overflow-hidden bg-white border border-[#EFEFEF]">
                                            <motion.div whileHover={{ scale: 1.05 }} className="relative w-full h-full">
                                                <Image src={c.right.image} alt={c.right.name} fill className="object-contain p-2 sm:p-3 grayscale opacity-55" />
                                            </motion.div>
                                        </div>
                                        <p className="mt-3 text-xs sm:text-base font-black text-[#9C948E] leading-tight">{c.right.name}</p>
                                        <p className="text-lg sm:text-2xl font-black text-[#BEBAB6] mt-0.5 line-through decoration-red-300/60">{c.right.price}</p>
                                    </div>
                                </div>

                                {/* === BOTTOM SECTION: Feature Table === */}
                                <div className="border-t border-[#EDEAE6]">

                                    {/* Table Column Headers */}
                                    <div className="grid grid-cols-[72px_1fr_72px] sm:grid-cols-[120px_1fr_120px] items-center py-2 sm:py-2.5 bg-[#F5F3F0] border-b border-[#EDEAE6]">
                                        <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] font-bold text-emerald-600 text-center">Astride</p>
                                        <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.12em] font-bold text-[#C0BAB4] text-center">Feature</p>
                                        <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] font-bold text-[#C0BAB4] text-center">Others</p>
                                    </div>

                                    {/* Rows */}
                                    {c.features.map((f, idx) => (
                                        <div
                                            key={idx}
                                            className={`grid grid-cols-[72px_1fr_72px] sm:grid-cols-[120px_1fr_120px] items-center py-3 border-b border-[#F2F0ED] last:border-none hover:bg-[#FAFAF8] transition-colors duration-150 ${idx % 2 === 0 ? "bg-white" : "bg-[#FDFCFB]"}`}
                                        >
                                            <div className="flex justify-center"><Icon val={f.left} /></div>
                                            <p className="text-xs sm:text-sm font-semibold text-[#4A4540] text-center px-1">{f.label}</p>
                                            <div className="flex justify-center"><Icon val={f.right} /></div>
                                        </div>
                                    ))}
                                </div>



                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>

            </div>
        </section>
    );
}