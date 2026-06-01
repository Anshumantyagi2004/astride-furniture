"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import ChairFinder from "../ChairFinder";

const CHAIR_IMAGES = [
  "/Png1/Chair6a_Amica Black .webp",
  "/Png1/Chair6b_Gladus Grey.webp",
  "/Png1/Chair7_Delton.webp",
  "/Png1/chair10_FitWell.webp",
  "/Png1/chair11_octave.webp",
  "/Png1/chair12_ErgoFit.webp",
  "/Png1/chair4_ACE.webp",
  "/Png1/chair5_AIRSENSE.webp",
  "/Png1/chair6_AlphaGrey.webp",
  "/Png1/chair6c_Rapid Black .webp",
  "/Png1/chair8_ERIZO.webp",
  "/Png1/chair9_FitWell.webp",
];

// Distribute images across 3 rows - 4 unique chairs per row
const TOP_CHAIRS = [CHAIR_IMAGES[0], CHAIR_IMAGES[1], CHAIR_IMAGES[2], CHAIR_IMAGES[3]];
const MID_CHAIRS = [CHAIR_IMAGES[4], CHAIR_IMAGES[5], CHAIR_IMAGES[6], CHAIR_IMAGES[7]];
const BOTTOM_CHAIRS = [CHAIR_IMAGES[8], CHAIR_IMAGES[9], CHAIR_IMAGES[10], CHAIR_IMAGES[11]];

interface CircularChairsProps {
  onStart?: () => void;
}

export default function CircularChairs({ onStart = () => { } }: CircularChairsProps) {
  const [mounted, setMounted] = useState(false);
  const [showFinder, setShowFinder] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (showFinder) {
    return (
      <div className="relative w-full h-[85vh] overflow-hidden select-none">
        <ChairFinder onBack={() => setShowFinder(false)} />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        @keyframes float-in {
          from { opacity:0; transform:translateY(28px) scale(0.95); }
          to   { opacity:1; transform:translateY(0)    scale(1); }
        }
        @keyframes metallic-drift {
          0% { background-position: 50% 10%, 80% 50%, 0% 0%; }
          100% { background-position: 50% 25%, 85% 45%, 0% 0%; }
        }
        .local-metallic-bg {
          background: 
            radial-gradient(ellipse at 50% 20%, rgba(255, 255, 255, 0.75) 0%, transparent 60%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.4) 0%, transparent 50%),
            linear-gradient(135deg, 
              #f5f7fa 0%, 
              #fafbfc 25%, 
              #f1f3f6 50%,
              #f8f9fb 75%, 
              #ebedf0 100%
            );
          background-size: 150% 150%;
        }
        @media (min-width: 1024px) {
          .local-metallic-bg {
            animation: metallic-drift 15s ease-in-out infinite alternate;
          }
        }

        /* 100% mathematically bulletproof hardware-accelerated infinite marquee */
        @keyframes marquee-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes marquee-right {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }

        .marquee-container {
          display: flex;
          width: 100%;
          overflow: visible;
        }

        .marquee-track-left {
          display: flex;
          width: max-content;
          animation: marquee-left 25s linear infinite;
        }

        .marquee-track-right {
          display: flex;
          width: max-content;
          animation: marquee-right 28s linear infinite;
        }

        .marquee-group {
          display: flex;
          gap: 50px;
          padding-right: 50px;
          flex-shrink: 0;
        }

        .marquee-item {
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .marquee-item {
            width: 84px;
            height: 90px;
          }
          .marquee-group {
            gap: 25px;
            padding-right: 25px;
          }
          .marquee-track-left {
            animation-duration: 16s;
          }
          .marquee-track-right {
            animation-duration: 18s;
          }
        }

        .marquee-item:hover {
          transform: scale(1.1);
        }
      `}</style>

      <div
        className="relative w-full h-[85vh] overflow-hidden flex flex-col justify-between select-none local-metallic-bg py-6"
        style={{
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Subtle dark overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "rgba(0,0,0,0.02)",
            zIndex: 2,
          }}
        />

        {/* ── Stacked Horizontal Rows (With wide spacing away from central content card) ── */}
        <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between pt-1 pb-1 pointer-events-auto z-5 overflow-visible">
          
          {/* Row 1: Top (Left to Right, Seamless) */}
          <div className="w-full overflow-visible py-4 marquee-container">
            <div className="marquee-track-left">
              {/* Group 1 */}
              <div className="marquee-group">
                {[...TOP_CHAIRS, ...TOP_CHAIRS, ...TOP_CHAIRS, ...TOP_CHAIRS].map((src, idx) => (
                  <div key={`top-g1-${idx}`} className="marquee-item">
                    <Image
                      src={src}
                      alt={`Top Chair ${idx}`}
                      width={100}
                      height={100}
                      className="object-contain pointer-events-none select-none"
                      style={{ width: "85%", height: "85%" }}
                      priority={idx < 4}
                    />
                  </div>
                ))}
              </div>
              {/* Group 2 (Identical Copy for seamless loop) */}
              <div className="marquee-group">
                {[...TOP_CHAIRS, ...TOP_CHAIRS, ...TOP_CHAIRS, ...TOP_CHAIRS].map((src, idx) => (
                  <div key={`top-g2-${idx}`} className="marquee-item">
                    <Image
                      src={src}
                      alt={`Top Chair copy ${idx}`}
                      width={100}
                      height={100}
                      className="object-contain pointer-events-none select-none"
                      style={{ width: "85%", height: "85%" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Middle (Right to Left, Seamless, Faded) */}
          <div className="w-full overflow-visible py-4 marquee-container opacity-[0.08]">
            <div className="marquee-track-right">
              {/* Group 1 */}
              <div className="marquee-group">
                {[...MID_CHAIRS, ...MID_CHAIRS, ...MID_CHAIRS, ...MID_CHAIRS].map((src, idx) => (
                  <div key={`mid-g1-${idx}`} className="marquee-item">
                    <Image
                      src={src}
                      alt={`Mid Chair ${idx}`}
                      width={100}
                      height={100}
                      className="object-contain pointer-events-none select-none"
                      style={{ width: "85%", height: "85%" }}
                      priority={idx < 4}
                    />
                  </div>
                ))}
              </div>
              {/* Group 2 (Identical Copy for seamless loop) */}
              <div className="marquee-group">
                {[...MID_CHAIRS, ...MID_CHAIRS, ...MID_CHAIRS, ...MID_CHAIRS].map((src, idx) => (
                  <div key={`mid-g2-${idx}`} className="marquee-item">
                    <Image
                      src={src}
                      alt={`Mid Chair copy ${idx}`}
                      width={100}
                      height={100}
                      className="object-contain pointer-events-none select-none"
                      style={{ width: "85%", height: "85%" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Bottom (Left to Right, Seamless) */}
          <div className="w-full overflow-visible py-4 marquee-container">
            <div className="marquee-track-left">
              {/* Group 1 */}
              <div className="marquee-group">
                {[...BOTTOM_CHAIRS, ...BOTTOM_CHAIRS, ...BOTTOM_CHAIRS, ...BOTTOM_CHAIRS].map((src, idx) => (
                  <div key={`bottom-g1-${idx}`} className="marquee-item">
                    <Image
                      src={src}
                      alt={`Bottom Chair ${idx}`}
                      width={100}
                      height={100}
                      className="object-contain pointer-events-none select-none"
                      style={{ width: "85%", height: "85%" }}
                      priority={idx < 4}
                    />
                  </div>
                ))}
              </div>
              {/* Group 2 (Identical Copy for seamless loop) */}
              <div className="marquee-group">
                {[...BOTTOM_CHAIRS, ...BOTTOM_CHAIRS, ...BOTTOM_CHAIRS, ...BOTTOM_CHAIRS].map((src, idx) => (
                  <div key={`bottom-g2-${idx}`} className="marquee-item">
                    <Image
                      src={src}
                      alt={`Bottom Chair copy ${idx}`}
                      width={100}
                      height={100}
                      className="object-contain pointer-events-none select-none"
                      style={{ width: "85%", height: "85%" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ── Central Floating Hero Content Card ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div
            className="flex flex-col items-center gap-3 md:gap-4 text-center pointer-events-auto px-5 py-4 md:px-6 md:py-6 rounded-3xl"
            style={{
              maxWidth: "500px",
              background: "rgba(255, 255, 255, 0.55)",
              backdropFilter: "blur(18px)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
              boxShadow: "0 20px 40px -15px rgba(0,0,0,0.06)",
              animation: mounted ? "float-in 1s cubic-bezier(0.22,1,0.36,1) both" : "none",
            }}
          >
            {/* Headline */}
            <div className="flex flex-col gap-1 items-center">
              <h1
                className="m-0 font-black tracking-tight"
                style={{
                  fontSize: "clamp(1.5rem, 3.2vw, 2.25rem)",
                  color: "#0f172a",
                  letterSpacing: "-0.02em",
                }}
              >
                The Astride Series
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-neutral-500">
                Engineered For Excellence
              </span>
            </div>

            {/* Divider */}
            <div style={{
              width: "30px", height: "2px",
              background: "#0f172a",
              opacity: 0.15,
              borderRadius: "2px"
            }} />

            {/* Tagline */}
            <p
              className="m-0 font-medium"
              style={{
                fontSize: "0.85rem",
                color: "rgba(15, 23, 42, 0.7)",
                maxWidth: "360px",
                lineHeight: 1.5,
              }}
            >
              Actually built for comfort. Masterfully crafted with premium materials to deliver ultimate ergonomic support for your workspace or gaming setup.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-row items-center justify-center gap-3 w-full mt-2">
              <button
                onClick={onStart}
                className="px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-full overflow-hidden cursor-pointer"
                style={{
                  background: "#0f172a",
                  color: "#ffffff",
                  border: "none",
                  transition: "transform 0.2s ease, opacity 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.transform = "scale(1.02)";
                  b.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.transform = "scale(1)";
                  b.style.opacity = "1";
                }}
              >
                Shop Collection
              </button>

              <button
                onClick={() => setShowFinder(true)}
                className="px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-full cursor-pointer"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(15, 23, 42, 0.15)",
                  color: "#0f172a",
                  transition: "background 0.2s ease, border-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.background = "rgba(0, 0, 0, 0.03)";
                  b.style.borderColor = "rgba(15, 23, 42, 0.4)";
                }}
                onMouseLeave={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.background = "transparent";
                  b.style.borderColor = "rgba(15, 23, 42, 0.15)";
                }}
              >
                Find Your Chair
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
