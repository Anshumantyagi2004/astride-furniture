"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
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

type RowType = "top" | "mid" | "bottom";

interface ChairItem {
  src: string;
  row: RowType;
  initialX: number;
  scaleFactor: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function buildChairs(): ChairItem[] {
  const rows: { row: RowType; count: number }[] = [
    { row: "top", count: 7 },
    { row: "mid", count: 5 },
    { row: "bottom", count: 7 },
  ];
  let idx = 0;
  const items: ChairItem[] = [];
  for (const { row, count } of rows) {
    for (let i = 0; i < count; i++) {
      items.push({
        src: CHAIR_IMAGES[idx % CHAIR_IMAGES.length],
        row,
        // Distribute seamlessly across the -25% to 125% span (150vw total)
        initialX: (150 / count) * i - 25,
        scaleFactor: 0.8 + (i % 2 === 0 ? 0.12 : 0),
      });
      idx++;
    }
  }
  return items;
}

const ROW_CONFIG: Record<RowType, { y: number; speed: number; dir: number; size: number }> = {
  top: { y: 15, speed: 4.2, dir: 1, size: 140 },     // left to right, higher up to avoid text touch
  mid: { y: 52, speed: 3.5, dir: -1, size: 85 },     // right to left, smaller, slower
  bottom: { y: 84, speed: 4.8, dir: 1, size: 140 },  // left to right
};

interface CircularChairsProps {
  onStart?: () => void;
}

export default function CircularChairs({ onStart = () => { } }: CircularChairsProps) {
  const chairs = useRef<ChairItem[]>(buildChairs());
  const [mounted, setMounted] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [showFinder, setShowFinder] = useState(false);

  const hoveredIdxRef = useRef<number | null>(null);
  const chairRefs = useRef<(HTMLDivElement | null)[]>([]);
  const container3DRef = useRef<HTMLDivElement | null>(null);

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const interpolatedMouse = useRef({ x: 0.5, y: 0.5 });

  const isLowEndRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const touchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isLowSpec = touchDevice || window.innerWidth < 1024;
      isLowEndRef.current = isLowSpec;
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    lastTimeRef.current = 0;

    const animate = (ts: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = ts;
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      const delta = (ts - lastTimeRef.current) / 1000;
      lastTimeRef.current = ts;
      
      const activeDelta = Math.min(delta, 0.1);
      timeRef.current += activeDelta;
      const curTime = timeRef.current;
      const isLowEnd = isLowEndRef.current;

      // Skip heavy math/tilting on low-end or touch devices
      if (!isLowEnd) {
        const easeFactor = 1 - Math.exp(-12 * activeDelta);
        interpolatedMouse.current.x += (mouseRef.current.x - interpolatedMouse.current.x) * easeFactor;
        interpolatedMouse.current.y += (mouseRef.current.y - interpolatedMouse.current.y) * easeFactor;

        if (container3DRef.current) {
          const tiltX = (interpolatedMouse.current.y - 0.5) * -8;
          const tiltY = (interpolatedMouse.current.x - 0.5) * 8;
          container3DRef.current.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        }
      }

      const items = chairs.current;
      const currentHovered = hoveredIdxRef.current;
      const mouseX = interpolatedMouse.current.x;
      const mouseY = interpolatedMouse.current.y;

      for (let i = 0; i < items.length; i++) {
        const el = chairRefs.current[i];
        if (!el) continue;

        const chair = items[i];
        const cfg = ROW_CONFIG[chair.row];

        let x = chair.initialX + curTime * cfg.speed * cfg.dir;
        const span = 150;
        x = ((x + 25) % span);
        if (x < 0) x += span;
        x -= 25;

        const y = cfg.y;
        const depth = chair.row === "mid" ? 0.1 : 0.9;
        const isHovered = currentHovered === i;
        
        const baseScale = (0.7 + depth * 0.3) * chair.scaleFactor;
        const scale = baseScale * (isHovered ? 1.35 : 1);
        const opacity = chair.row === "mid" ? 0.12 : (0.6 + depth * 0.4);
        const zIndex = isHovered ? 999 : Math.round(depth * 100);

        let finalScale = scale;

        // Skip heavy proximity calculations on touch/low-end devices
        if (!isLowEnd) {
          const dx = x / 100 - mouseX;
          const dy = y / 100 - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mag = Math.max(0, 1 - dist / 0.18);
          finalScale = scale * (1 + mag * 0.16);

          // Apply halo segment updates
          const halo = el.querySelector('.chair-halo') as HTMLElement | null;
          if (halo) halo.style.opacity = `${0.08 + mag * 0.18}`;

          const cursorHalo = el.querySelector('.chair-cursor-halo') as HTMLElement | null;
          if (cursorHalo) cursorHalo.style.opacity = `${mag * 0.20}`;
        }

        el.style.left = `${x}%`;
        el.style.top = `${y}%`;
        el.style.transform = `translate(-50%,-50%) scale(${finalScale})`;
        el.style.opacity = `${opacity}`;
        el.style.zIndex = `${zIndex}`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top) / r.height,
    };
  }, []);

  const handleMouseEnterChair = (idx: number) => {
    hoveredIdxRef.current = idx;
    setHoveredIdx(idx);
  };

  const handleMouseLeaveChair = () => {
    hoveredIdxRef.current = null;
    setHoveredIdx(null);
  };

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
        @keyframes chair-appear {
          from { opacity:0; transform:translate(-50%,-50%) scale(0.4); }
          to   { opacity:1; transform:translate(-50%,-50%) scale(1); }
        }
        @keyframes title-fade {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes metallic-drift {
          0% { background-position: 50% 10%, 80% 50%, 0% 0%; }
          100% { background-position: 50% 25%, 85% 45%, 0% 0%; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.4); opacity: 0.08; }
          33% { transform: scale(0.65); opacity: 0.06; }
          66% { transform: scale(0.9); opacity: 0.03; }
          100% { transform: scale(1.15); opacity: 0.01; }
        }
        @keyframes bloom-breathe {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.15); opacity: 0.55; }
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
          animation: metallic-drift 15s ease-in-out infinite alternate;
        }
        .pulse-ring-animation {
          animation: pulse-ring 12s linear infinite;
        }
        .bloom-breathe-animation {
          animation: bloom-breathe 8s ease-in-out infinite;
        }
      `}</style>

      <div
        className="relative w-full h-[85vh] overflow-hidden flex items-center justify-center select-none local-metallic-bg"
        style={{
          fontFamily: "'Inter', sans-serif",
        }}
        onMouseMove={handleMouseMove}
      >


        {/* ── Subtle dark overlay — keeps contrast without hiding rays ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "rgba(0,0,0,0.05)",
            zIndex: 2,
          }}
        />


        {/* ── 3-D orbit layer — perspective scoped here only ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 4, perspective: "900px" }}
        >
          <div
            ref={container3DRef}
            className="absolute inset-0 pointer-events-none will-change-transform"
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          >
            {chairs.current.map((chair, idx) => {
              const cfg = ROW_CONFIG[chair.row];
              
              // Initial calculations to avoid flash before first anim frame
              const x = chair.initialX;
              const y = cfg.y;
              const depth = chair.row === "mid" ? 0.1 : 0.9;
              const scale = (0.7 + depth * 0.3) * chair.scaleFactor;
              const opacity = chair.row === "mid" ? 0.12 : (0.6 + depth * 0.4);
              const zIndex = Math.round(depth * 100);

              return (
                <div
                  key={idx}
                  ref={(el) => {
                    chairRefs.current[idx] = el;
                  }}
                  className="absolute pointer-events-auto cursor-pointer will-change-transform"
                  onMouseEnter={() => handleMouseEnterChair(idx)}
                  onMouseLeave={handleMouseLeaveChair}
                  style={{
                    left: `${x}%`, top: `${y}%`,
                    transform: `translate(-50%,-50%) scale(${scale})`,
                    opacity: mounted ? opacity : 0,
                    zIndex,
                    animation: mounted
                      ? `chair-appear 0.7s cubic-bezier(0.22,1,0.36,1) ${idx * 20}ms both`
                      : "none",
                    transition: "opacity 0.3s ease, transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)",
                  }}
                >
                  {/* chair visibility halo — always present so black chairs stay visible */}
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none chair-halo opacity-[0.08] transition-opacity duration-200"
                    style={{
                      background: "radial-gradient(circle, rgba(255,255,255,1) 0%, transparent 68%)",
                      transform: "scale(1.7)",
                      filter: "blur(22px)",
                    }}
                  />
                  {/* extra boost when cursor is near */}
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none chair-cursor-halo opacity-0 transition-opacity duration-200"
                    style={{
                      background: "radial-gradient(circle, rgba(255,255,255,1) 0%, transparent 65%)",
                      transform: "scale(2.2)",
                      filter: "blur(28px)",
                    }}
                  />
                  <div className="relative">
                    <Image
                      src={chair.src}
                      alt={`Chair ${idx + 1}`}
                      width={cfg.size}
                      height={cfg.size}
                      className="object-contain pointer-events-none select-none transition-filter duration-200"
                      style={{
                        width: `min(22vw,${cfg.size}px)`,
                        height: `min(22vw,${cfg.size}px)`,
                        filter: `brightness(${0.92 + depth * 0.12})`,
                      }}
                      priority={idx < 10}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Hero content written directly on the background ── */}
        <div
          className="relative flex flex-col items-center gap-6 text-center pointer-events-auto px-6 py-12"
          style={{
            zIndex: 200,
            maxWidth: "520px",
            animation: mounted ? "float-in 1s cubic-bezier(0.22,1,0.36,1) both" : "none",
          }}
        >
          {/* eyebrow pill */}
          

          {/* headline */}
          <div className="flex flex-col gap-2 items-center">
            <h1
              className="m-0 font-black tracking-tight"
              style={{
                fontSize: "clamp(1.5rem, 3.2vw, 2.25rem)",
                color: "#0f172a",
                letterSpacing: "-0.02em",
                animation: mounted ? "title-fade 0.9s ease 0.15s both" : "none",
              }}
            >
              The Astride Series
            </h1>
            <span className="text-xs uppercase font-bold tracking-[0.3em] text-neutral-500">
              Engineered For Excellence
            </span>
          </div>

          {/* divider line */}
          <div style={{
            width: "40px", height: "2px",
            background: "#0f172a",
            opacity: 0.15,
            borderRadius: "2px"
          }} />

          {/* tagline */}
          <p
            className="m-0 font-medium"
            style={{
              fontSize: "0.9rem",
              color: "rgba(15, 23, 42, 0.7)",
              maxWidth: "360px",
              lineHeight: 1.6,
            }}
          >
            Actually built for comfort. Masterfully crafted with premium materials to deliver ultimate ergonomic support for your workspace or gaming setup.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full mt-4">
            {/* primary — Shop Now */}
            <button
              onClick={onStart}
              className="w-full sm:w-auto relative inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-black uppercase tracking-widest rounded-full overflow-hidden cursor-pointer"
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

            {/* secondary — Find Your Chair */}
            <button
              onClick={() => setShowFinder(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-black uppercase tracking-widest rounded-full cursor-pointer"
              style={{
                background: "transparent",
                border: "1px solid rgba(15, 23, 42, 0.2)",
                color: "#0f172a",
                transition: "background 0.2s ease, border-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = "rgba(0, 0, 0, 0.05)";
                b.style.borderColor = "rgba(15, 23, 42, 0.5)";
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = "transparent";
                b.style.borderColor = "rgba(15, 23, 42, 0.2)";
              }}
            >
              Find Your Chair
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
