"use client";

import React from "react";
import Marquee from "react-fast-marquee";

const Marquee2Hover = () => {
  const items = [
    "ERGONOMIC",
    "PREMIUM",
    "REFINED",
    "MODERN",
    "COMFORT",
  ];

  return (
    <div className="w-full bg-[#0a0a0a] py-4 md:py-6 overflow-hidden flex items-center border-y border-zinc-900">
      <Marquee gradient={false} speed={60} autoFill={true}>
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 md:gap-6 pr-4 md:pr-6">
            <span 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-widest uppercase transition-all duration-300 text-transparent cursor-default hover:text-white hover:[-webkit-text-stroke:0px] [-webkit-text-stroke:1.5px_#888]"
            >
              {item}
            </span>
            <span className="text-2xl md:text-4xl text-zinc-500 opacity-90">✦</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default Marquee2Hover;
