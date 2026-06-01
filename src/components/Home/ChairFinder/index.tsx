"use client";

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
// img_from thhe Png1_circular 

const ALL_CHAIRS = [
  { src: "/Png1/chair12_ErgoFit.webp", name: "ErgoFit Premium", price: 1299 },
  { src: "/Png1/Chair7_Delton.webp", name: "Delton Pro", price: 1099 },
  { src: "/Png1/img1 (1).webp", name: "Classic Comfort", price: 899 },
  { src: "/Png1/chair4_ACE.webp", name: "ACE Task", price: 799 },
  { src: "/Png1/chair5_AIRSENSE.webp", name: "AirSense", price: 749 },
  { src: "/Png1/chair6_AlphaGrey.webp", name: "Alpha Grey", price: 699 },
  { src: "/Png1/Chair6a_Amica Black .webp", name: "Amica Black", price: 649 },
  { src: "/Png1/Chair6b_Gladus Grey.webp", name: "Gladus Grey", price: 599 },
  { src: "/Png1/chair6c_Rapid Black .webp", name: "Rapid Black", price: 549 },
  { src: "/Png1/chair8_ERIZO.webp", name: "Erizo Mesh", price: 499 },
  { src: "/Png1/chair9_FitWell.webp", name: "FitWell Basic", price: 399 },
  { src: "/Png1/chair10_FitWell.webp", name: "FitWell Pro", price: 449 },
  { src: "/Png1/chair11_octave.webp", name: "Octave Studio", price: 299 },
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

  const scale = isMobile ? 0.4275 : 0.475;

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
    <div className="absolute inset-0 z-[999] w-full h-full bg-[#f5f5f5] flex flex-col overflow-hidden pt-[10px] px-[10px]">
      
      {/* ── Close Button ── */}
      <button
        onClick={onBack}
        className="absolute top-6 right-6 z-[100] w-12 h-12 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-gray-500 hover:text-gray-900 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-gray-200/50 transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label="Close and go back"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

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
        <div className="w-full max-w-[440px] bg-white/95 backdrop-blur-xl rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-200/40 px-5 py-2.5 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-200 text-gray-400 hover:text-gray-600 flex-shrink-0 active:scale-95"
            aria-label="Go back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase whitespace-nowrap flex-shrink-0">
            Sitting time
          </span>

          <div className="relative flex-1 h-8 flex items-center">
            <div className="absolute left-0 right-0 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-150 ease-out"
                style={{
                  width: `${sliderValue}%`,
                  background: "#9ca3af",
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
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.18)] pointer-events-none transition-[left] duration-150 ease-out border-2 border-[#9ca3af]"
              style={{ left: `calc(${sliderValue}% - 8px)` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
