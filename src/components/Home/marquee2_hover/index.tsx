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
    <div className="w-full bg-[#0a0a0a] py-2 md:py-3 overflow-hidden flex items-center border-y border-zinc-900 relative z-20">
      <Marquee gradient={false} speed={60} autoFill={true}>
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 md:gap-6 pr-4 md:pr-6">
            <span 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-widest uppercase transition-all duration-300 text-transparent cursor-default hover:text-white hover:[-webkit-text-stroke:0px] [-webkit-text-stroke:1.5px_#888] leading-none pt-1.5 md:pt-2 inline-block"
            >
              {item}
            </span>
            <span className="text-2xl md:text-4xl text-zinc-500 opacity-90 leading-none align-middle">✦</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default Marquee2Hover;
