"use client";

import React from "react";
import Marquee from "react-fast-marquee";

const Marquee1 = () => {
  const marqueeItems = [
    "FREE SHIPPING PAN INDIA",
    "30-DAY TRIAL",
    "5-YEAR WARRANTY",
    "ISO CERTIFIED",
  ];

  return (
    <section className="w-full">
      <div className="px-6 mb-8 text-center block md:hidden bg-[#F8F9FA] pt-8">
        <span className="text-[10px] tracking-[0.25em] font-extrabold uppercase text-slate-400 block mb-3">
          Anatomy of Comfort
        </span>
        <h2 className="text-3xl font-extrabold text-[#161316] tracking-tight mb-4">
          Engineered Down to Every Part
        </h2>
        <p className="text-zinc-600 text-sm leading-relaxed max-w-md mx-auto">
          A seating framework engineered with advanced orthopedic research to optimize sitting posture, maximize breathability, and ensure long-term comfort.
        </p>
      </div>

      {/* Marquee Section */}
      <div className="w-full bg-[#F4F4F6] py-4 overflow-hidden flex items-center">
        <Marquee gradient={false} speed={40} autoFill={true}>
          {marqueeItems.map((item, idx) => (
            <div key={idx} className="pr-8 md:pr-16 flex items-center gap-8 md:gap-16">
              <span className="text-xs sm:text-sm md:text-[13px] font-bold tracking-[0.25em] text-[#47474a] uppercase">
                {item}
              </span>
              <span className="text-sm md:text-base text-[#a1a1a6]">✦</span>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Marquee1;
