"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import expandedImg from "../../../public/expanded/image_ct.png";

interface Hotspot {
    id: string;
    title: string;
    desc: string;
    specs: string[];
    style: React.CSSProperties;
    mobileStyle?: React.CSSProperties; // Custom coordinates for mobile view
    cardPosition: "top" | "bottom" | "left" | "right";
}

const HOTSPOTS: Hotspot[] = [
    {
        id: "headrest",
        title: "Adjustable Headrest",
        desc: "Multi-directional ergonomic support with height and angle customization to cradle your cervical spine and relieve neck strain.",
        specs: ["Cervical Cradle", "Multi-Angle Tilt", "Height Adjustment"],
        style: { left: "6%", top: "0%" },
        mobileStyle: { left: "3%", top: "6%" }, // Change these percentages to reposition the headrest dot on mobile!
        cardPosition: "right",
    },
    {
        id: "backrest",
        title: "Tensile Mesh Backrest",
        desc: "Hyper-breathable, dual-weave elastomeric mesh imported from Germany. Dynamically conforms to your thoracic spine while keeping you cool.",
        specs: ["German Elastomer", "High Tensile Strength", "Zero Heat Retention"],
        style: { left: "16%", top: "40%" },
        mobileStyle: { left: "13%", top: "40%" }, // Change these percentages to reposition the backrest dot on mobile!
        cardPosition: "right",
    },
    {
        id: "armrest",
        title: "4D Ergonomic Armrests",
        desc: "Fully adaptive support adjustable in height, depth, pivot angle, and width to perfectly align with elbow and shoulder dynamics.",
        specs: ["4D Multi-Pivot", "PU Cushioning", "Width & Depth Slide"],
        style: { left: "38.5%", top: "10%" },
        mobileStyle: { left: "37%", top: "18%" }, // Change these percentages to reposition the armrest dot on mobile!
        cardPosition: "right",
    },
    {
        id: "seat",
        title: "Dual-Density Cushion",
        desc: "Contoured high-resilience foam base with waterfall edge design to improve blood circulation and reduce pressure behind the knees.",
        specs: ["High-Resilience Foam", "Waterfall Edge", "Ischial Pressure Relief"],
        style: { left: "55.5%", top: "25%" },
        mobileStyle: { left: "55.5%", top: "36%" }, // Change these percentages to reposition the seat dot on mobile!
        cardPosition: "left",
    },
    {
        id: "suspension",
        title: "Class 4 Gas Suspension",
        desc: "Heavy-duty nitrogen charged lift cylinder providing fluid height adjustments and responsive vertical shock absorption.",
        specs: ["Class 4 Safety", "Nitrogen Charged", "Smooth Travel"],
        style: { left: "72%", top: "25%" },
        mobileStyle: { left: "71%", top: "30%" }, // Change these percentages to reposition the suspension dot on mobile!
        cardPosition: "right",
    },
    {
        id: "base",
        title: "Die-Cast Star Base",
        desc: "Aviation-grade reinforced aluminum alloy base. Heavy-duty construction rated to support up to 350 lbs with whisper-quiet, non-scuffing PU casters.",
        specs: ["Aviation-Grade Alloy", "350 lbs Capacity", "Floor-Safe PU Casters"],
        style: { left: "84%", top: "47%" },
        mobileStyle: { left: "83%", top: "40.5%" }, // Change these percentages to reposition the base dot on mobile!
        cardPosition: "left",
    },
];

const Header2 = () => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const countRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    let start = 0;
                    const end = 50000;
                    const duration = 2000; // 2 seconds
                    const startTime = performance.now();

                    const animate = (currentTime: number) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Ease out quad
                        const easeProgress = progress * (2 - progress);
                        const currentCount = Math.floor(easeProgress * end);

                        if (countRef.current) {
                            countRef.current.innerText = currentCount.toLocaleString();
                        }

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            if (countRef.current) {
                                countRef.current.innerText = end.toLocaleString();
                            }
                        }
                    };

                    requestAnimationFrame(animate);
                    observer.disconnect(); // Trigger once
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section id="anatomy" ref={containerRef} className="w-full bg-[#F5F5F7] overflow-hidden relative flex items-center pt-0 pb-0 border-t border-zinc-200 border-b border-zinc-200">
            {/* Premium Minimalist Background Grid & Ambient Glows */}
            <div className="absolute inset-0 opacity-40">
                <div className="h-full w-full bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:100px_100px]" />
            </div>
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-orange-500/5 blur-[150px] pointer-events-none" />

            <div className="max-w-[1600px] mx-auto px-0 w-full relative z-10">
                {/* Exploded Chair Section */}
                <div className="relative w-full flex flex-col items-center mt-0 bg-white/40 rounded-[32px] border border-zinc-200/80 pt-3 md:pt-6 lg:pt-12 pb-0 md:pb-0 lg:pb-0 px-3 md:px-6 lg:px-12 overflow-visible shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
                    {/* Chair Image Wrapper */}
                    <div className="relative w-full max-w-[1450px] scale-110 md:scale-100 transition-transform duration-500">
                        <Image
                            src={expandedImg}
                            alt="Exploded Chair"
                            className={`w-full h-auto object-contain select-none transition-all duration-700 -mt-[4%] md:-mt-[6%] -mb-[10%] md:-mb-[12%] ${activeId ? "opacity-100 md:opacity-30 brightness-95 scale-[1.01]" : "opacity-100"
                                }`}
                            priority
                        />

                        {/* Hotspots - Visible on Desktop & Mobile */}
                        <div>
                            {HOTSPOTS.map((hotspot) => {
                                const isActive = activeId === hotspot.id;

                                return (
                                    <div
                                        key={hotspot.id}
                                        className={`absolute group transition-all duration-300 ${isActive ? "z-50" : "z-30"}`}
                                        style={isMobile && hotspot.mobileStyle ? hotspot.mobileStyle : hotspot.style}
                                        onMouseEnter={() => setActiveId(hotspot.id)}
                                        onMouseLeave={() => setActiveId(null)}
                                        onClick={() => setActiveId(isActive ? null : hotspot.id)}
                                    >
                                        {/* Pulsing Hotspot Trigger */}
                                        <div className="relative cursor-pointer flex items-center justify-center w-4 h-4 md:w-8 md:h-8">
                                            <div className={`absolute w-3 h-3 md:w-6 md:h-6 bg-orange-500/30 rounded-full animate-ping pointer-events-none transition-transform duration-300 ${isActive ? "scale-150" : ""
                                                }`} />
                                            <div className={`absolute w-2 h-2 md:w-4 md:h-4 rounded-full pointer-events-none transition-all duration-300 ${isActive ? "bg-orange-600 scale-125 shadow-[0_0_12px_rgba(249,115,22,0.8)]" : "bg-orange-500/60"
                                                }`} />
                                            <div className="w-1 h-1 md:w-2.5 md:h-2.5 bg-orange-600 rounded-full ring-[1.5px] md:ring-4 ring-white transition-all duration-300 group-hover:scale-125" />
                                        </div>

                                        {/* Connecting Line Indicator - Desktop Only */}
                                        <div
                                            className={`hidden md:block absolute pointer-events-none transition-all duration-500 border-t border-dashed border-orange-500/50 ${isActive ? "w-16 opacity-100" : "w-0 opacity-0"
                                                }`}
                                            style={{
                                                left: hotspot.cardPosition === "right" ? "100%" : "auto",
                                                right: hotspot.cardPosition === "left" ? "100%" : "auto",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                            }}
                                        />

                                        {/* Floating Glassmorphic Spec Card - Desktop Only */}
                                        <div
                                            className={`hidden md:block absolute w-[320px] bg-white/95 backdrop-blur-xl border border-zinc-200 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500 ease-out z-40 pointer-events-none ${isActive
                                                ? "opacity-100 translate-y-0 scale-100 visible"
                                                : "opacity-0 scale-95 invisible"
                                                }`}
                                            style={{
                                                top: hotspot.cardPosition === "top" ? "auto" : "50%",
                                                bottom: hotspot.cardPosition === "top" ? "140%" : "auto",
                                                left:
                                                    hotspot.cardPosition === "right"
                                                        ? "calc(100% + 24px)"
                                                        : hotspot.cardPosition === "top"
                                                            ? "50%"
                                                            : "auto",
                                                right:
                                                    hotspot.cardPosition === "left"
                                                        ? "calc(100% + 24px)"
                                                        : "auto",
                                                transform:
                                                    hotspot.cardPosition === "top"
                                                        ? "translateX(-50%)"
                                                        : "translateY(-50%)",
                                            }}
                                        >
                                            <span className="text-[10px] tracking-widest font-bold uppercase text-orange-600">
                                                Technical Spec
                                            </span>
                                            <h4 className="text-black text-lg font-bold mt-1 mb-2">
                                                {hotspot.title}
                                            </h4>
                                            <p className="text-zinc-600 text-xs leading-relaxed mb-4 font-light">
                                                {hotspot.desc}
                                            </p>
                                            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-100">
                                                {hotspot.specs.map((spec, sIdx) => (
                                                    <span
                                                        key={sIdx}
                                                        className="text-[9px] font-bold bg-zinc-50 border border-zinc-200 text-zinc-700 px-2 py-0.5 rounded-md"
                                                    >
                                                        {spec}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile Dynamic Single Specifications Card (Unique Futuristic Glassmorphic Holo-Card) */}
                    <div className="mt-8 md:hidden w-full z-30">
                        {(() => {
                            const activeHotspot = HOTSPOTS.find(h => h.id === (activeId || "headrest")) || HOTSPOTS[0];
                            const activeIdx = HOTSPOTS.findIndex(h => h.id === activeHotspot.id);
                            return (
                                <div
                                    className="bg-white/90 backdrop-blur-xl border border-zinc-200/80 rounded-[32px] p-7 shadow-[0_30px_60px_rgba(0,0,0,0.05)] transition-all duration-500 relative overflow-hidden group"
                                >
                                    {/* Iridescent Corner Accent Glows */}
                                    <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/20 blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
                                    <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-gradient-to-tr from-amber-500/10 to-orange-500/20 blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

                                    {/* Dynamic Premium Border Highlight */}
                                    <div className="absolute top-0 left-0 right-0 h-[3.5px] bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600" />

                                    {/* Slider Dot Indicators */}
                                    <div className="flex gap-3 justify-center mb-6 pb-4 border-b border-zinc-100/80">
                                        {HOTSPOTS.map((h) => {
                                            const isSelected = (activeId || "headrest") === h.id;
                                            return (
                                                <button
                                                    key={h.id}
                                                    onClick={() => setActiveId(h.id)}
                                                    className={`h-2.5 rounded-full transition-all duration-500 ${isSelected
                                                        ? "w-8 bg-gradient-to-r from-orange-500 to-amber-600 shadow-[0_3px_10px_rgba(249,115,22,0.4)]"
                                                        : "w-2.5 bg-zinc-300 hover:bg-zinc-400"
                                                        }`}
                                                />
                                            );
                                        })}
                                    </div>

                                    {/* Spec Content with unique layout */}
                                    <div className="flex items-center gap-2 mb-3.5">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-50">
                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
                                        </div>
                                        <span className="text-[10px] tracking-[0.2em] font-extrabold uppercase bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                            TECH SPECIFICATION {activeIdx + 1} OF {HOTSPOTS.length}
                                        </span>
                                    </div>

                                    <h4 className="text-zinc-950 text-2xl font-black tracking-tight mb-3">
                                        {activeHotspot.title}
                                    </h4>

                                    <p className="text-zinc-600 text-sm leading-relaxed mb-6 font-light">
                                        {activeHotspot.desc}
                                    </p>

                                    {/* Premium Badges with hover state */}
                                    <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-100/80">
                                        {activeHotspot.specs.map((spec, sIdx) => (
                                            <span
                                                key={sIdx}
                                                className="text-[10px] font-semibold bg-white/90 border border-zinc-200/80 text-zinc-700 px-3.5 py-1.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-2 hover:border-orange-300 transition-all duration-300"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500" />
                                                {spec}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Header2;