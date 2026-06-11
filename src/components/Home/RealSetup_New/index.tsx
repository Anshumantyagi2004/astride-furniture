"use client";

import { useRef } from "react";
import Image from "next/image";

const setups = [
  {
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
    tag: "#GamingSetup",
  },
  {
    img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80",
    tag: "#WorkFromHome",
  },
  {
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    tag: "#StudyCorner",
  },
  {
    img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80",
    tag: "#MinimalDesk",
  },
  {
    img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80",
    tag: "#AstrideChair",
  },
  {
    img: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&q=80",
    tag: "#SetupGoals",
  },
];

export default function RealSetup_New() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "right" ? 300 : -300,
      behavior: "smooth",
    });
  };

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
      {/* Header Row */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2
            className="text-[clamp(24px,3.6vw,38px)] font-extrabold leading-tight tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <span className="text-[#8B5CF6]">REAL</span>
            <span className="text-[#131313]"> PEOPLE. </span>
            <span className="text-[#8B5CF6]">REAL</span>
            <span className="text-[#F97316]"> SETUPS.</span>
          </h2>
          <p
            className="text-[13.5px] text-[#555] mt-1 font-medium"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Tag us{" "}
            <span className="text-[#8B5CF6] font-semibold">@astride.furniture</span>{" "}
            to get featured!
          </p>
        </div>

        <a
          href="#"
          className="flex items-center gap-2 text-[12px] font-bold tracking-[0.14em] uppercase text-[#131313] hover:text-[#8B5CF6] transition-colors self-start mt-2"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          EXPLORE MORE
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      {/* Scrollable Gallery + Arrows */}
      <div className="relative">

        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 rounded-full bg-white border-[2px] border-[#131313] shadow-[2px_2px_0_#131313] flex items-center justify-center hover:bg-[#f0f0f0] transition-colors"
          aria-label="Scroll left"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#131313" strokeWidth="2.5" className="w-4 h-4">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Scrollable strip */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-none px-1 py-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {setups.map((setup, idx) => (
            <div
              key={idx}
              className="relative flex-none rounded-[18px] border-[2px] border-[#131313] shadow-[3px_3px_0_#131313] overflow-hidden group cursor-pointer hover:-translate-y-1 transition-transform duration-200"
              style={{ width: "220px", height: "260px" }}
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

              {/* Tag badge — fully inside card */}
              <span
                className="absolute bottom-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 text-[#131313] text-[11.5px] font-bold px-3 py-1 rounded-full border-[1.5px] border-[#131313]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {setup.tag}
              </span>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 rounded-full bg-[#131313] flex items-center justify-center shadow-[2px_2px_0_rgba(0,0,0,0.3)] hover:bg-[#333] transition-colors"
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
