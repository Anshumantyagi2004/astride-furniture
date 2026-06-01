"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import LightRays from "../LightRays";

const CHAIR_IMAGES = [
  "/Png1/Chair6a_Amica Black .png",
  "/Png1/Chair6b_Gladus Grey.png",
  "/Png1/Chair7_Delton.png",
  "/Png1/chair10_FitWell.png",
  "/Png1/chair11_octave.png",
  "/Png1/chair12_ErgoFit.png",
  "/Png1/chair4_ACE.png",
  "/Png1/chair5_AIRSENSE.png",
  "/Png1/chair6_AlphaGrey.png",
  "/Png1/chair6c_Rapid Black .png",
  "/Png1/chair8_ERIZO.png",
  "/Png1/chair9_FitWell.png",
];

type RowType = "top" | "mid" | "bottom";

interface ChairItem {
  src: string;
  row: RowType;
  initialX: number;
  scaleFactor: number;
}

/* each particle has a fixed grey shade */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  lightness: number; // 50–95 — grey → near-white
  phase: number;
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

function buildParticles(): Particle[] {
  const rand = seededRandom(17);
  return Array.from({ length: 60 }, () => ({
    x: rand() * 100,
    y: rand() * 120 - 10,
    vx: (rand() - 0.5) * 2.2,
    vy: -(0.6 + rand() * 2.0),   // always rising
    size: 1 + rand() * 3,
    lightness: 50 + rand() * 45,        // 50 (mid-grey) → 95 (near-white)
    phase: rand() * Math.PI * 2,
  }));
}

const ROW_CONFIG: Record<RowType, { y: number; speed: number; dir: number; size: number }> = {
  top: { y: 22, speed: 4.2, dir: 1, size: 140 },     // left to right
  mid: { y: 52, speed: 3.5, dir: -1, size: 85 },     // right to left, smaller, slower
  bottom: { y: 84, speed: 4.8, dir: 1, size: 140 },  // left to right
};

interface CircularChairsProps {
  onStart?: () => void;
}

export default function CircularChairs({ onStart = () => { } }: CircularChairsProps) {
  const chairs = useRef<ChairItem[]>(buildChairs());
  const particles = useRef<Particle[]>(buildParticles());

  const [rotation, setRotation] = useState(0);
  const [time, setTime] = useState(0);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [mounted, setMounted] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const partPos = useRef<{ x: number; y: number; opacity: number }[]>(
    particles.current.map((p) => ({ x: p.x, y: p.y, opacity: 0.5 }))
  );
  const [, forceRender] = useState(0);

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

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

      setRotation((prev) => (prev + delta * 11) % 360);
      setTime((prev) => prev + delta);
      setMouse((prev) => ({
        x: prev.x + (mouseRef.current.x - prev.x) * 0.07,
        y: prev.y + (mouseRef.current.y - prev.y) * 0.07,
      }));

      /* move particles */
      const parts = particles.current;
      const pos = partPos.current;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        pos[i].x += (p.vx + Math.sin(ts * 0.00055 + p.phase) * 0.9) * delta;
        pos[i].y += (p.vy + Math.cos(ts * 0.00045 + p.phase) * 0.35) * delta;
        if (pos[i].y < -6) { pos[i].y = 107; pos[i].x = Math.random() * 100; }
        if (pos[i].x < -5) pos[i].x = 105;
        if (pos[i].x > 105) pos[i].x = -5;
        // opacity breathes between 0.2 and 0.75 — never stops
        pos[i].opacity = 0.2 + 0.55 * Math.abs(Math.sin(ts * 0.00055 * (0.5 + i * 0.03) + p.phase));
      }

      forceRender((n) => n + 1);
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

  const tiltX = (mouse.y - 0.5) * -8;
  const tiltY = (mouse.x - 0.5) * 8;
  const t = time;
  const pulse1 = (Math.sin(t * 0.85) + 1) / 2;
  const pulse2 = (Math.sin(t * 0.55 + 1.8) + 1) / 2;
  const pulse3 = (Math.sin(t * 0.4 + 3.2) + 1) / 2;



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
      `}</style>

      <div
        className="relative w-full h-screen overflow-hidden flex items-center justify-center select-none local-metallic-bg"
        style={{
          fontFamily: "'Inter', sans-serif",
        }}
        onMouseMove={handleMouseMove}
      >
        {/* ── LightRays background — CSS animated rays from top ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        >
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={0.85}
            lightSpread={0.5}
            pulsating={true}
          />
        </div>

        {/* ── Subtle dark overlay — keeps contrast without hiding rays ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "rgba(0,0,0,0.05)",
            zIndex: 2,
          }}
        />

        {/* ── concentric pulse rings ── */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 3 }}
        >
          {[
            { r: 0.12 + pulse1 * 0.06, op: pulse1 * 0.08, col: "0,0,0" },
            { r: 0.24 + pulse2 * 0.09, op: pulse2 * 0.06, col: "60,60,60" },
            { r: 0.42 + pulse3 * 0.14, op: pulse3 * 0.04, col: "100,100,100" },
            { r: 0.62 + pulse1 * 0.18, op: pulse1 * 0.02, col: "140,140,140" },
          ].map((ring, i) => (
            <div
              key={i}
              suppressHydrationWarning
              className="absolute rounded-full border"
              style={{
                width: "120vmin", height: "120vmin",
                borderColor: `rgb(${ring.col})`,
                opacity: Math.max(0, ring.op),
                transform: `scale(${ring.r})`,
              }}
            />
          ))}
          {/* soft white centre bloom */}
          <div
            suppressHydrationWarning
            className="absolute rounded-full"
            style={{
              width: "22vmin", height: "22vmin",
              background: "radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 70%)",
              filter: "blur(20px)",
              opacity: 0.4 + pulse1 * 0.3,
            }}
          />
        </div>

        {/* ── 3-D orbit layer — perspective scoped here only ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 4, perspective: "900px" }}
        >
          <div
            suppressHydrationWarning
            className="absolute inset-0 pointer-events-none"
            style={{
              transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
              transformStyle: "preserve-3d",
              transition: "transform 0.08s linear",
            }}
          >
            {chairs.current.map((chair, idx) => {
              const cfg = ROW_CONFIG[chair.row];
              
              // Infinite horizontal scroll positioning with wrapping from -25% to 125% screen width
              let x = chair.initialX + time * cfg.speed * cfg.dir;
              const span = 150;
              x = ((x + 25) % span);
              if (x < 0) x += span;
              x -= 25;

              // Straight horizontal line movement (no floatY wave)
              const y = cfg.y;

              // Emulate Y-axis perspective (middle row is pushed deeply back to ensure text legibility)
              const depth = chair.row === "mid" ? 0.1 : 0.9;
              const isHovered = hoveredIdx === idx;
              const scale = (0.7 + depth * 0.3) * chair.scaleFactor * (isHovered ? 1.35 : 1);
              const opacity = chair.row === "mid" ? 0.12 : (0.6 + depth * 0.4);
              const zIndex = isHovered ? 999 : Math.round(depth * 100);

              const dx = x / 100 - mouse.x;
              const dy = y / 100 - mouse.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const mag = Math.max(0, 1 - dist / 0.18);

              return (
                <div
                  key={idx}
                  suppressHydrationWarning
                  className="absolute will-change-transform pointer-events-auto cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{
                    left: `${x}%`, top: `${y}%`,
                    transform: `translate(-50%,-50%) scale(${scale * (1 + mag * 0.16)})`,
                    opacity: mounted ? opacity : 0,
                    zIndex,
                    animation: mounted
                      ? `chair-appear 0.7s cubic-bezier(0.22,1,0.36,1) ${idx * 45}ms both`
                      : "none",
                    transition: "opacity 0.3s ease, transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
                  }}
                >
                  {/* chair visibility halo — always present so black chairs stay visible */}
                  <div
                    suppressHydrationWarning
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, rgba(255,255,255,${0.08 + mag * 0.18}) 0%, transparent 68%)`,
                      transform: "scale(1.7)",
                      filter: "blur(22px)",
                    }}
                  />
                  {/* extra boost when cursor is near */}
                  {mag > 0.05 && (
                    <div
                      suppressHydrationWarning
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        background: `radial-gradient(circle, rgba(255,255,255,${mag * 0.20}) 0%, transparent 65%)`,
                        transform: "scale(2.2)",
                        filter: "blur(28px)",
                      }}
                    />
                  )}
                  <Image
                    src={chair.src}
                    alt={`Chair ${idx + 1}`}
                    width={cfg.size}
                    height={cfg.size}
                    className="object-contain pointer-events-none select-none"
                    style={{
                      width: `min(22vw,${cfg.size}px)`,
                      height: `min(22vw,${cfg.size}px)`,
                      filter: `
                      drop-shadow(0 0 ${8 + mag * 14}px rgba(255,255,255,${0.12 + mag * 0.2}))
                      brightness(${0.92 + depth * 0.12 + mag * 0.14})
                    `,
                      transition: "filter 0.1s ease",
                    }}
                    priority={idx < 10}
                  />
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
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black tracking-[0.25em] uppercase"
            style={{
              background: "rgba(0, 0, 0, 0.05)",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              color: "#475569",
            }}
          >
            <span style={{
              width: 4, height: 4, borderRadius: "50%",
              background: "#0f172a",
              display: "inline-block",
              boxShadow: "0 0 8px rgba(15,23,42,0.3)",
            }} />
            FLAGSHIP COLLECTION
          </div>

          {/* headline */}
          <div className="flex flex-col gap-2 items-center">
            <h1
              className="m-0 font-black tracking-tight"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
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

            {/* secondary — View Features */}
            <button
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
              View Features
            </button>
          </div>

          {/* trust row */}
          <div className="flex items-center gap-6 flex-wrap justify-center mt-2 w-full">
            {["Premium Materials", "Free Delivery", "12-Year Warranty"].map((label) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider"
                style={{ color: "rgba(15, 23, 42, 0.6)" }}
              >
                <svg className="w-3 h-3 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
