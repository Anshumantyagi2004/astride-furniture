"use client";

import { useEffect, useState } from "react";

export type RaysOrigin =
  | "top-center"
  | "top-left"
  | "top-right"
  | "right"
  | "left"
  | "bottom-center"
  | "bottom-right"
  | "bottom-left";

interface LightRaysProps {
  raysOrigin?: RaysOrigin;
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  pulsating?: boolean;
  fadeDistance?: number;
  saturation?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
  className?: string;
}

/* ── origin → CSS transform-origin + rotation ── */
const ORIGIN_MAP: Record<
  RaysOrigin,
  { transformOrigin: string; rotate: string }
> = {
  "top-center": { transformOrigin: "50% 0%", rotate: "0deg" },
  "top-left": { transformOrigin: "0% 0%", rotate: "-20deg" },
  "top-right": { transformOrigin: "100% 0%", rotate: "20deg" },
  left: { transformOrigin: "0% 50%", rotate: "-90deg" },
  right: { transformOrigin: "100% 50%", rotate: "90deg" },
  "bottom-center": { transformOrigin: "50% 100%", rotate: "180deg" },
  "bottom-left": { transformOrigin: "0% 100%", rotate: "200deg" },
  "bottom-right": { transformOrigin: "100% 100%", rotate: "160deg" },
};

const LightRays: React.FC<LightRaysProps> = ({
  raysOrigin = "top-center",
  raysColor = "#ffffff",
  raysSpeed = 1.2,
  lightSpread = 0.65,
  pulsating = true,
  className = "",
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { transformOrigin, rotate } = ORIGIN_MAP[raysOrigin];

  /* Duration for the slow sway / pulse — inversely proportional to speed */
  const baseDur = Math.max(4, 12 / raysSpeed);

  /* Build several ray "beams" with staggered angles & boosted opacities for vibrant light */
  const rays = [
    { angle: -28, width: 22, opacity: 0.38, delay: 0 },
    { angle: -16, width: 18, opacity: 0.42, delay: 1.2 },
    { angle: -6, width: 24, opacity: 0.48, delay: 0.5 },
    { angle: 4, width: 20, opacity: 0.45, delay: 1.8 },
    { angle: 14, width: 16, opacity: 0.40, delay: 0.8 },
    { angle: 24, width: 26, opacity: 0.36, delay: 2.0 },
    { angle: -22, width: 14, opacity: 0.32, delay: 1.5 },
    { angle: 8, width: 28, opacity: 0.35, delay: 0.3 },
    { angle: 18, width: 12, opacity: 0.30, delay: 2.5 },
    { angle: -12, width: 20, opacity: 0.40, delay: 1.0 },
    /* Extreme left rays */
    { angle: -38, width: 25, opacity: 0.35, delay: 0.7 },
    { angle: -48, width: 20, opacity: 0.30, delay: 1.4 },
    { angle: -58, width: 28, opacity: 0.28, delay: 2.1 },
    { angle: -72, width: 35, opacity: 0.25, delay: 0.4 },
    /* Extreme right rays */
    { angle: 36, width: 22, opacity: 0.34, delay: 1.1 },
    { angle: 46, width: 26, opacity: 0.30, delay: 0.6 },
    { angle: 56, width: 18, opacity: 0.27, delay: 2.3 },
    { angle: 70, width: 35, opacity: 0.25, delay: 1.7 },
  ];

  /* Spread multiplier — wider lightSpread = smaller cone exponent */
  const spreadMul = 0.8 + lightSpread * 0.99;

  return (
    <>
      <style>{`
        @keyframes ray-spread {
          0%, 100% { 
            opacity: calc(var(--ray-op) * 0.75); 
            transform: rotate(var(--ray-angle)) scaleX(0.85); 
          }
          50% { 
            opacity: calc(var(--ray-op) * 1.4); 
            transform: rotate(calc(var(--ray-angle) + 5deg)) scaleX(1.25); 
          }
        }
        @keyframes ray-sway-wide {
          0%, 100% { transform: rotate(var(--ray-angle)) scaleX(0.9); }
          33%      { transform: rotate(calc(var(--ray-angle) + 5deg)) scaleX(1.2); }
          66%      { transform: rotate(calc(var(--ray-angle) - 4deg)) scaleX(1.2); }
        }
      `}</style>

      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`.trim()}
        style={{
          transformOrigin,
          transform: `rotate(${rotate})`,
        }}
      >
        {rays.map((ray, i) => {
          const w = ray.width * spreadMul;
          return (
            <div
              key={i}
              suppressHydrationWarning
              style={{
                ["--ray-angle" as string]: `${ray.angle * spreadMul}deg`,
                ["--ray-op" as string]: mounted ? ray.opacity : 0,
                position: "absolute",
                top: "-15%",
                left: "50%",
                width: `${w}vw`,
                height: "140%",
                marginLeft: `${-w / 2}vw`,
                background: `linear-gradient(
                  180deg,
                  ${raysColor}${Math.round(ray.opacity * 255).toString(16).padStart(2, "0")} 0%,
                  ${raysColor}${Math.round(ray.opacity * 0.6 * 255).toString(16).padStart(2, "0")} 35%,
                  transparent 90%
                )`,
                transformOrigin: "50% 0%",
                transform: `rotate(${ray.angle * spreadMul}deg)`,
                opacity: mounted ? ray.opacity : 0,
                filter: "blur(16px)",
                willChange: "transform, opacity",
                WebkitBackfaceVisibility: "hidden",
                backfaceVisibility: "hidden",
                transformStyle: "preserve-3d",
                animation: mounted
                  ? pulsating
                    ? `ray-spread ${baseDur + i * 0.5}s ease-in-out ${ray.delay}s infinite`
                    : `ray-sway-wide ${baseDur + i * 0.7}s ease-in-out ${ray.delay}s infinite`
                  : "none",
                transition: "opacity 1.5s ease",
              }}
            />
          );
        })}

        {/* Central glow bloom - boosted for a much lighter ambient glow */}
        <div
          suppressHydrationWarning
          style={{
            position: "absolute",
            top: "-10%",
            left: "50%",
            width: "60vw",
            height: "50vh",
            marginLeft: "-30vw",
            background: `radial-gradient(ellipse at 50% 0%, ${raysColor}50 0%, ${raysColor}20 50%, transparent 80%)`,
            filter: "blur(40px)",
            opacity: mounted ? 0.8 : 0,
            transition: "opacity 2s ease",
          }}
        />
      </div>
    </>
  );
};

export default LightRays;
