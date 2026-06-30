"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";

const setups = [
  {
    img: "/Real_people_real_Setup/15.webp",
    tag: "#GamingSetup",
  },
  {
    img: "/Real_people_real_Setup/16.webp",
    tag: "#WorkFromHome",
  },
  {
    img: "/Real_people_real_Setup/17.webp",
    tag: "#StudyCorner",
  },
  {
    img: "/Real_people_real_Setup/18.webp",
    tag: "#MinimalDesk",
  },
  {
    img: "/Real_people_real_Setup/19.webp",
    tag: "#CozyVibes",
  },
];

export default function RealSetup_New() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      className="w-full pt-2 pb-6 md:pt-4 md:pb-8 px-5 md:px-8 lg:px-16 overflow-hidden"
      style={{
        backgroundColor: "#F5EFE6",
        backgroundImage:
          "linear-gradient(#d6c9b8 1px, transparent 1px), linear-gradient(90deg, #d6c9b8 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      {/* Header Section (Row Layout) */}
      <div className="flex flex-row items-end justify-between mb-4 md:mb-6 gap-2">
        <div className="flex-1">
          {/* Reduced heading size on mobile (18px) but preserved desktop size */}
          <h2
            className="text-[18px] sm:text-[22px] md:text-[clamp(24px,3.6vw,38px)] font-extrabold leading-tight tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <span className="text-[#8B5CF6]">REAL</span>
            <span className="text-[#131313]"> PEOPLE. </span>
            <span className="text-[#8B5CF6]">REAL</span>
            <span className="text-[#F97316]"> SETUPS.</span>
          </h2>
          <p
            className="text-[11px] md:text-[13.5px] text-[#555] mt-1 font-medium"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Tag us{" "}
            <span className="text-[#8B5CF6] font-semibold">@astride.furniture</span>{" "}
            to get featured!
          </p>
        </div>

        {/* Explore More - Now on the same row */}
        <Link
          href="/products"
          className="flex items-center gap-1 md:gap-2 text-[10px] md:text-[12px] font-bold tracking-[0.14em] uppercase text-[#131313] hover:text-[#8B5CF6] transition-colors whitespace-nowrap mb-1 md:mb-2"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          EXPLORE MORE
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3 md:w-4 md:h-4">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Scrollable Gallery + Arrows */}
      <div className="relative mt-2">
        {/* Left Arrow */}
        <button
          className="setup-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 rounded-full bg-white border-[2px] border-[#131313] shadow-[2px_2px_0_#131313] flex items-center justify-center hover:bg-[#f0f0f0] transition-colors cursor-pointer"
          aria-label="Scroll left"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#131313" strokeWidth="2.5" className="w-4 h-4">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Swiper Auto-Scrolling Strip */}
        <Swiper
          modules={[Autoplay, Navigation]}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          navigation={{
            prevEl: ".setup-prev",
            nextEl: ".setup-next",
          }}
          breakpoints={{
            0: { slidesPerView: 2, spaceBetween: 10 },
            640: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 32 },
          }}
          className="w-full py-1 setup-swiper"
        >
          {setups.map((setup, idx) => (
            <SwiperSlide key={idx}>
              <div
                className="relative w-full h-[200px] md:h-[260px] rounded-[18px] border-[2px] border-[#131313] shadow-[3px_3px_0_#131313] overflow-hidden group cursor-pointer hover:-translate-y-1 transition-transform duration-200"
              >
                {/* Image */}
                <Image
                  src={setup.img}
                  alt={setup.tag}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />

                {/* Gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Right Arrow */}
        <button
          className="setup-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 rounded-full bg-[#131313] flex items-center justify-center shadow-[2px_2px_0_rgba(0,0,0,0.3)] hover:bg-[#333] transition-colors cursor-pointer"
          aria-label="Scroll right"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-4 h-4">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  );
}