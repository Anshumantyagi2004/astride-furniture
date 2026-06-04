"use client";

import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function HeroSection() {
    return (<>
        <section className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">

                <div className="lg:col-span-2 sm:hidden flex h-100 relative rounded-xl overflow-hidden">
                    <Image
                        // src="/ERGo_GIF.webp"
                        src="/Mobile_Ergofit.webp"
                        alt="Hero GIF"
                        fill
                        priority
                        className="object-cover"
                    />
                </div>

                <div className="lg:col-span-1 lg:flex hidden lg:h-[350px]">
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        autoplay={{ delay: 2500, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                        loop={true}
                        className="h-full w-full rounded-xl overflow-hidden"
                    >
                        {[
                            "/1.jpg",
                            "/2.jpg",
                            "/3.jpg",
                            // "/Product/InfographicDesign-1.webp",
                        ].map((img, index) => (
                            <SwiperSlide key={index}>
                                <div className="relative w-full h-full bg-white">
                                    <Image
                                        src={img}
                                        alt={`Slide ${index + 1}`}
                                        fill
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>

         <section className="w-full py-2 md:px-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                <div className="h-[200px] relative rounded-xl overflow-hidden">
                    <Image
                        src="/Artboard_2_copy_2.webp"
                        // src="/Mobile_Ergofit.webp"
                        alt="Hero GIF"
                        fill
                        priority
                        className="object-cover"
                    />
                </div>
                <div className="h-[200px] relative rounded-xl overflow-hidden">
                    <Image
                        src="/Artboard_2_copy_5.webp"
                        // src="/Mobile_Ergofit.webp"
                        alt="Hero GIF"
                        fill
                        priority
                        className="object-cover"
                    />
                </div>
                <div className="h-[200px] relative rounded-xl overflow-hidden">
                    <Image
                        src="/OfficeChairs.webp"
                        // src="/Mobile_Ergofit.webp"
                        alt="Hero GIF"
                        fill
                        priority
                        className="object-cover"
                    />
                </div>
            </div>
        </section>
    </>);
}