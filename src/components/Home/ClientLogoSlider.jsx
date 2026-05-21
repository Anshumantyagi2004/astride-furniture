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
    return (
        <section className="w-full pt-10 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#00badb]/10 text-[#00badb] text-sm font-semibold uppercase tracking-wide">
                        Trusted By Top Brands
                    </span>

                    <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-[#243447]">
                        Our Clients
                    </h2>

                    <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                        Proudly delivering ergonomic workspace solutions
                        to leading companies and organizations.
                    </p>
                </div>

                <Swiper
                    modules={[Autoplay]}
                    slidesPerView={2}
                    loop={true}
                    speed={3500}
                    autoplay={{
                        delay: 0,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        480: {
                            slidesPerView: 3,
                            spaceBetween: 10,
                        },
                        768: {
                            slidesPerView: 4,
                            spaceBetween: 10,
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
                                whileHover={{
                                    y: -6,
                                    scale: 1.04,
                                }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center justify-center"
                            >

                                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center p-4">

                                    <Image
                                        src={client}
                                        alt={`Client ${index + 1}`}
                                        width={120}
                                        height={120}
                                        className="object-contain w-full h-full rounded-full"
                                    />

                                </div>

                            </motion.div>

                        </SwiperSlide>
                    ))}

                </Swiper>
            </div>
        </section>
    );
}