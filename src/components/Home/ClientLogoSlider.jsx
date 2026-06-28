"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
const clients = [
    "/Clients/1.webp",
    "/Clients/2.webp",
    "/Clients/3.webp",
    "/Clients/4.webp",
    "/Clients/5.webp",
    "/Clients/6.webp",
    "/Clients/7.webp",
    "/Clients/8.webp",
];

export default function ClientLogoSlider() {
    // ✅ Mobile optimization: Disable motion animations on mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    return (
        <section className="w-full pt-10 bg-linear-to-b bg-[#F8F5F1] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center">
                    <span className="text-[#FF6D29] font-bold tracking-[0.18em] uppercase">
                        Trusted By Top Brands
                    </span>

                    <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A]">
                        Our Clients
                    </h2>
                </div>

                <Swiper
                    modules={[Autoplay]}
                    slidesPerView={2}
                    loop={true}
                    speed={isMobile ? 1500 : 3500}
                    autoplay={{
                        delay: 0,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        480: {
                            slidesPerView: 3,
                            spaceBetween: 14,
                        },
                        768: {
                            slidesPerView: 4,
                            spaceBetween: 18,
                        },
                        1024: {
                            slidesPerView: 6,
                            spaceBetween: 20,
                        },
                    }}
                    className="client-swiper py-10!"
                >

                    {clients.map((client, index) => (
                        <SwiperSlide key={index}>
                            <motion.div
                                whileHover={!isMobile ? {
                                    y: -10,
                                    scale: 1.04,
                                } : {}}
                                transition={!isMobile ? { duration: 0.25 } : {}}
                                className="flex items-center justify-center"
                            >
                                <div className="group relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full bg-white/70 md:backdrop-blur-xl border border-white/60 overflow-hidden shadow-none md:shadow-sm md:hover:shadow-md transition-all duration-300 md:duration-500 flex items-center justify-center p-6">
                                    <Image
                                        src={client}
                                        alt={`Client ${index + 1}`}
                                        width={120}
                                        height={120}
                                        className="object-contain w-full h-full transition-all duration-300 md:duration-500 md:group-hover:scale-105"
                                    />
                                    <div className="hidden md:block absolute inset-0 bg-linear-to-br from-[#8B5CF6]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                    <div className="hidden md:block absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 bg-linear-to-br from-white/40 via-transparent to-transparent"></div>
                                </div>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}