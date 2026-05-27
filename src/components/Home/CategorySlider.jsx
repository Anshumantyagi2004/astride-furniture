"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";

const categories = [
  {
    name: "Chair",
    image: "/cat.jpg",
  },
  {
    name: "Table",
    image: "/cat.jpg",
  },
  {
    name: "Sofa",
    image: "/cat.jpg",
  },
  {
    name: "Lamp",
    image: "/cat.jpg",
  },
  {
    name: "Office",
    image: "/cat.jpg",
  },
  {
    name: "Gaming",
    image: "/cat.jpg",
  },
  {
    name: "Bedroom",
    image: "/cat.jpg",
  },
];

export default function CategorySlider() {
  
  return (
    <section className="w-full pt-10 bg-white overflow-hidden">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#243447] leading-tight">
          Shop by{" "}
          <span className="text-[#00badb] relative inline-block">
            Category
            <span className="absolute left-0 -bottom-2 w-full h-[4px] bg-[#00badb]/20 rounded-full"></span>
          </span>
        </h2>

        {/* DESCRIPTION */}
        <p className="max-w-2xl mx-auto mt-4 text-gray-500 text-sm sm:text-base leading-relaxed">
          Discover thoughtfully designed furniture collections crafted
          for comfort, style, and modern living spaces.
        </p>

        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="w-16 h-[2px] bg-[#00badb]/30 rounded-full"></span>

          <span className="w-3 h-3 rounded-full bg-[#00badb]"></span>

          <span className="w-16 h-[2px] bg-[#00badb]/30 rounded-full"></span>
        </div>
      </div>

      {/* SWIPER */}
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        loop={true}
        // spaceBetween={20}
        breakpoints={{
          0: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
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
            spaceBetween: 10,
          },
        }}
        className="px-4 py-10!"
      >
        {categories.map((category, index) => (
          <SwiperSlide key={index}>

            <motion.div
              whileHover={{
                y: -8,
                scale: 1.03,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
              }}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-md bg-white">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover hover:scale-110 transition-all duration-500"
                />
              </div>

              <h3 className="mt-2 text-sm sm:text-base font-semibold text-[#243447] text-center">
                {category.name}
              </h3>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}