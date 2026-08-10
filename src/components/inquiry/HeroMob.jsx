"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";

const banners = [
  "/inquiry/banner4.webp",
  "/inquiry/banner2.webp",
  "/inquiry/banner3.webp",
];

const HeroMob = () => {
  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 1500,
          disableOnInteraction: false,
        }}
        // pagination={{ clickable: true }}
        className=" overflow-hidden"
      >
        {banners.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[580px]">
              <Image
                src={img}
                alt={`slide-${index}`}
                fill
                className="object-cover "
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroMob;