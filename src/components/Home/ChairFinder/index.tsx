"use client";

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
// img_from thhe Png1_circular 

const ALL_CHAIRS = [
  { src: "/Png/chair12_ErgoFit.png", name: "ErgoFit Premium", price: 1299 },
  { src: "/Png/Chair7_Delton.png", name: "Delton Pro", price: 1099 },
  { src: "/Png/img1 (1).png", name: "Classic Comfort", price: 899 },
  { src: "/Png/chair4_ACE.png", name: "ACE Task", price: 799 },
  { src: "/Png/chair5_AIRSENSE.png", name: "AirSense", price: 749 },
  { src: "/Png/chair6_AlphaGrey.png", name: "Alpha Grey", price: 699 },
  { src: "/Png/Chair6a_Amica Black .png", name: "Amica Black", price: 649 },
  { src: "/Png/Chair6b_Gladus Grey.png", name: "Gladus Grey", price: 599 },
  { src: "/Png/chair6c_Rapid Black .png", name: "Rapid Black", price: 549 },
  { src: "/Png/chair8_ERIZO.png", name: "Erizo Mesh", price: 499 },
  { src: "/Png/chair9_FitWell.png", name: "FitWell Basic", price: 399 },
  { src: "/Png/chair10_FitWell.png", name: "FitWell Pro", price: 449 },
  { src: "/Png/chair11_octave.png", name: "Octave Studio", price: 299 },
].sort((a, b) => b.price - a.price);

function getPosition(index: number, total: number, isMobile: boolean) {
  // Single chair centered layout
  if (total === 1) return { left: "50%", top: "45%", scale: isMobile ? 0.9 : 1.1, zIndex: 100 };

  // Two chairs side-by-side
  if (total === 2) {
    return {
      left: index === 0 ? (isMobile ? "30%" : "35%") : (isMobile ? "70%" : "65%"),
      top: "45%",
      scale: isMobile ? 0.75 : 0.9,
      zIndex: 100 - index,
    };
  }

  // Three chairs layout
  if (total === 3) {
    if (isMobile) {
      if (index === 0) return { left: "20%", top: "45%", scale: 0.65, zIndex: 90 };
      if (index === 1) return { left: "50%", top: "45%", scale: 0.75, zIndex: 100 };
      if (index === 2) return { left: "80%", top: "45%", scale: 0.65, zIndex: 90 };
    } else {
      if (index === 0) return { left: "50%", top: "60%", scale: 0.95, zIndex: 100 };
      if (index === 1) return { left: "25%", top: "35%", scale: 0.8, zIndex: 90 };
      if (index === 2) return { left: "75%", top: "35%", scale: 0.8, zIndex: 90 };
    }
  }

  // Centered multi-row cluster grid for total > 3
  const columns = isMobile ? 3 : 5;
  const row = Math.floor(index / columns);
  const col = index % columns;
  const itemsInRow = Math.min(columns, total - row * columns);
  const colOffset = (columns - itemsInRow) / 2;

  const left = isMobile
    ? `${20 + (col + colOffset) * 30}%` // centered 3-column slots: 20%, 50%, 80%
    : `${15 + (col + colOffset) * 17.5}%`; // centered 5-column slots

  const top = isMobile
    ? `${18 + row * 22}%`  // row 0: 18%, row 1: 40%, row 2: 62%, row 3: 84%
    : `${20 + row * 30}%`;

  const scale = isMobile ? 0.45 : 0.5;

  return {
    left,
    top,
    scale,
    zIndex: 100 - index,
  };
}

interface ChairFinderProps {
  onBack: () => void;
}

export default function ChairFinder({ onBack }: ChairFinderProps) {
  const [sliderValue, setSliderValue] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const visibleCount = Math.max(1, Math.ceil(ALL_CHAIRS.length * (1 - sliderValue / 100)));

  const getTimeLabel = useCallback(() => {
    if (sliderValue < 34) return "QUICK SESSION";
    if (sliderValue < 67) return "HALF DAY";
    return "ALL DAY";
  }, [sliderValue]);

  return (
    <div className="relative w-full h-screen bg-[#f5f5f5] flex flex-col overflow-hidden pt-[10px] px-[10px]">

      {/* ── Main content area ── */}
      <div className="flex-1 relative overflow-hidden">
        <div className="relative w-full h-full max-w-[1200px] mx-auto transition-all duration-700">
          {ALL_CHAIRS.map((chair, index) => {
            const isVisible = index < visibleCount;
            const pos = getPosition(index, Math.max(1, visibleCount), isMobile);

            return (
              <div
                key={chair.name}
                className="absolute transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  left: pos.left,
                  top: pos.top,
                  transform: `translate(-50%, -50%) scale(${isVisible ? pos.scale : 0.1})`,
                  opacity: isVisible ? 1 : 0,
                  zIndex: pos.zIndex,
                  pointerEvents: isVisible ? "auto" : "none",
                }}
              >
                <Image
                  src={chair.src}
                  alt={chair.name}
                  width={320}
                  height={320}
                  className="w-auto h-auto max-w-[180px] md:max-w-[280px] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.05)] hover:scale-110 transition-transform duration-300"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom slider card ── */}
      <div className="w-full flex justify-center pb-6 sm:pb-4 px-2 sm:px-4 relative z-50">
        <div className="w-full max-w-[460px] bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_2px_24px_rgba(0,0,0,0.07)] px-5 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              aria-label="Go back"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#1a1a1a]">Sitting time</span>
            </div>

            <div className="w-10 h-10" />
          </div>

          <div className="relative w-full h-10 flex items-center mb-1">
            <div className="absolute left-0 right-0 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-150 ease-out"
                style={{
                  width: `${sliderValue}%`,
                  background: "#ef4444",
                }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 touch-none"
              aria-label="Sitting time"
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.2)] pointer-events-none transition-[left] duration-150 ease-out border-2 border-[#ef4444]"
              style={{ left: `calc(${sliderValue}% - 12px)` }}
            />
          </div>

          <p className="text-center text-[10px] tracking-[0.2em] uppercase text-gray-400 font-bold mt-1">
            {getTimeLabel()}
          </p>
        </div>
      </div>
    </div>
  );
}
