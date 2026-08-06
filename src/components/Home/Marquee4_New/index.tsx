"use client";
import { Poppins } from "next/font/google";
import { useEffect, useRef } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["900"],
});

export default function Marquee4_New() {
const ref = useRef<HTMLDivElement | null>(null);
 useEffect(() => {
  const element = ref.current;
  if (!element) return;

  const observer = new IntersectionObserver(([entry]) => {
    element.style.animationPlayState =
      entry.isIntersecting ? "running" : "paused";
  });

  observer.observe(element);

  return () => {
    observer.unobserve(element);
  };
}, []);

  const content = (
    <div
      className={`flex items-center gap-16 whitespace-nowrap uppercase pr-16 ${poppins.className}`}
    >
      <span className="text-[28px] md:text-[36px] lg:text-[44px] font-black text-white">
        Sit. Slay.
      </span>

      <span className="text-[34px] text-white">✦</span>

      <span className="text-[28px] md:text-[36px] lg:text-[44px] font-black bg-gradient-to-r from-[#9333EA] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent">
        Rep Seat.
      </span>

      <span className="text-[34px] text-white">✦</span>

      <span
        className="text-[28px] md:text-[36px] lg:text-[44px] font-black"
        style={{
          color: "transparent",
          WebkitTextStroke: "1.8px white",
        }}
      >
        Comfort That Hits Different.
      </span>

      <span className="text-[34px] text-white">✦</span>

      <span className="text-[28px] md:text-[36px] lg:text-[44px] font-black text-white">
        Your Space.
      </span>

      <span className="text-[34px] text-white">✦</span>

      <span className="text-[28px] md:text-[36px] lg:text-[44px] font-black bg-gradient-to-r from-[#9333EA] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent">
        Your Vibe.
      </span>

      <span className="text-[34px] text-white">✦</span>

      <span
        className="text-[28px] md:text-[36px] lg:text-[44px] font-black"
        style={{
          color: "transparent",
          WebkitTextStroke: "1.8px white",
        }}
      >
        Game On.
      </span>

      <span className="text-[34px] text-white">✦</span>
    </div>
  );

  return (
    <div className="overflow-hidden select-none">
      <div className="bg-[#050505] py-3">
        <div
          ref={ref}
          className="flex w-max animate-marquee"
          style={{ animationPlayState: "running" }} // 👈 default state fix
        >
          {content}
          {content}
        </div>
      </div>
    </div>
  );
}