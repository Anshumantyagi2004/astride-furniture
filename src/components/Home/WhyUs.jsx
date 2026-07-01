"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
    Armchair,
    HeartHandshake,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const sans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-sans",
});

export default function WhyUs() {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const features = [
        {
            icon: <ShieldCheck size={28} strokeWidth={2} />,
            title: "Premium Quality",
            desc: "Crafted using durable premium materials with modern finishing and long-lasting comfort that stands the test of time.",
            stat: "ISO Certified",
        },
        {
            icon: <HeartHandshake size={28} strokeWidth={2} />,
            title: "Trusted By Customers",
            desc: "Loved by thousands of professionals for elegant design, ergonomic comfort, and everyday usability.",
            stat: "50,000+ Users",
        },
        {
            icon: <Sparkles size={28} strokeWidth={2} />,
            title: "Luxury Aesthetics",
            desc: "Minimal modern styling curated to elevate every workspace and interior effortlessly with a timeless look.",
            stat: "Award-Winning Design",
        },
        {
            icon: <Armchair size={28} strokeWidth={2} />,
            title: "Ergonomic Comfort",
            desc: "Research-backed ergonomic support that improves posture, enhances focus, and reduces fatigue during long hours.",
            stat: "5-Year Warranty",
        },
    ];

    return (
        <section className={`relative py-2 bg-[#F8F9FA] overflow-hidden ${sans.className}`}>

            {/* BACKGROUND — subtle blue/slate blobs, no orange */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-80px] left-[-80px] w-[360px] h-[360px] bg-slate-200/40 blur-[130px] rounded-full" />
                <div className="absolute bottom-[-80px] right-[-80px] w-[320px] h-[320px] bg-blue-100/20 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">

                {/* HEADER */}
                <motion.div
                    key={isMobile ? 'm-why-header' : 'd-why-header'}
                    initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, margin: "200px" }}
                    className="text-center max-w-3xl mx-auto mb-5 max-md:!opacity-100 max-md:!transform-none"
                >
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#161316] leading-[1.08] tracking-tight font-sans lg:whitespace-nowrap">
                        Designed For{" "}
                        <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
                            Modern Living
                        </span>
                    </h2>

                    <p className="mt-3 text-slate-500 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-sans line-clamp-2">
                        We combine premium craftsmanship, ergonomic comfort, and
                        contemporary aesthetics to create chairs that enhance both
                        productivity and lifestyle.
                    </p>
                </motion.div>

                {/* MOBILE VIEW (Swiper) */}
                <div className="block md:hidden w-full pb-4">
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={12}
                        slidesPerView={2}
                        loop={true}
                        autoplay={{
                            delay: 1500,
                            disableOnInteraction: false,
                        }}
                        className="w-full !overflow-hidden"
                    >
                        {features.map((item, index) => (
                            <SwiperSlide key={index} className="w-full pb-2 pr-1">
                                <div className="group relative rounded-[16px] border-2 border-[#131313] bg-white p-4 flex flex-col items-center justify-center text-center gap-3 overflow-hidden cursor-default min-h-[130px] shadow-[4px_4px_0_#131313] active:translate-y-[2px] active:shadow-[2px_2px_0_#131313] transition-all duration-200">
                                    {/* ICON BOX */}
                                    <div className="relative w-11 h-11 rounded-full bg-[#0F1E36] border-2 border-[#131313] flex items-center justify-center text-white flex-shrink-0 shadow-[2px_2px_0_#131313]">
                                        <div className="relative z-10 scale-90">{item.icon}</div>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="relative z-10 w-full">
                                        <h3 className="text-[11px] font-extrabold text-[#131313] uppercase tracking-wider font-sans">
                                            {item.title}
                                        </h3>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* DESKTOP VIEW (Grid) */}
                <div className="hidden md:grid grid-cols-2 xl:grid-cols-4 gap-5">
                    {features.map((item, index) => (
                        <motion.div
                            key={isMobile ? `m-feat-${index}` : `d-feat-${index}`}
                            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            viewport={{ once: true, margin: "200px" }}
                            whileHover={{ y: -8 }}
                            className="group relative rounded-[28px] border border-slate-200/70 bg-white p-8 flex flex-row items-center gap-4 md:block overflow-hidden transition-all duration-400 hover:border-slate-300 hover:shadow-[0_16px_48px_rgba(15,23,42,0.06)] cursor-default max-md:!opacity-100 max-md:!transform-none"
                        >
                            {/* CARD GLASSY TOP HIGHLIGHT */}
                            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

                            {/* TOP NUMBER */}
                            <span className="absolute top-7 right-8 text-5xl font-black text-slate-100 group-hover:text-slate-200 transition-colors duration-500 select-none leading-none hidden md:block font-sans">
                                {String(index + 1).padStart(2, "0")}
                            </span>

                            {/* ICON BOX */}
                            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 transition-all duration-400 group-hover:bg-gradient-to-r group-hover:from-[#8B5CF6] group-hover:to-[#EC4899] group-hover:text-white group-hover:border-transparent group-hover:scale-105 shadow-sm flex-shrink-0">
                                {/* subtle inner glow on hover */}
                                <div className="absolute inset-0 rounded-2xl bg-slate-900/0 group-hover:bg-slate-900/10 blur-md transition-all duration-500" />
                                <div className="relative z-10">{item.icon}</div>
                            </div>

                            {/* CONTENT */}
                            <div className="mt-0 md:mt-7 relative z-10 flex-grow">
                                <h3 className="text-base md:text-xl font-bold text-[#161316] leading-snug tracking-tight font-sans">
                                    {item.title}
                                </h3>

                                <p className="hidden md:block mt-3 text-slate-500 leading-relaxed text-[14px] font-sans">
                                    {item.desc}
                                </p>

                                {/* STAT PILL */}
                                <div className="hidden md:inline-flex mt-5 items-center gap-1.5 bg-slate-50 border border-slate-200/80 text-slate-500 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full font-sans">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                                    {item.stat}
                                </div>
                            </div>

                            {/* BOTTOM ACCENT BAR */}
                            <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] group-hover:w-full transition-all duration-500 rounded-full" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}