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
        desc: "Engineered with multi-directional ergonomic joints, this headrest offers precise height and angle customization to cradle your cervical spine. It acts as an active tension-release system, targeting the neck and upper shoulder muscles to prevent strain during marathon coding, gaming, or high-focus design sessions. Conforms dynamically to your movements to ensure alignment whether sitting upright or fully reclining.",
        specs: ["Cervical Cradle", "Multi-Angle Tilt", "Height Adjustment"],
        style: { left: "6%", top: "0%" },
        mobileStyle: { left: "3%", top: "6%" }, // Change these percentages to reposition the headrest dot on mobile!
        cardPosition: "right",
    },
    {
        id: "backrest",
        title: "Tensile Mesh Backrest",
        desc: "Upholstered with hyper-breathable, dual-weave elastomeric mesh imported from Germany. This high-tensile material dynamically contours to the unique curve of your thoracic spine, providing active resistance that keeps your posture correct. The open-grid pattern completely eliminates heat and moisture build-up, maintaining a perfectly cool contact surface even during intensive 10-hour workdays.",
        specs: ["German Elastomer", "High Tensile Strength", "Zero Heat Retention"],
        style: { left: "16%", top: "40%" },
        mobileStyle: { left: "13%", top: "40%" }, // Change these percentages to reposition the backrest dot on mobile!
        cardPosition: "right",
    },
    {
        id: "armrest",
        title: "4D Ergonomic Armrests",
        desc: "Advanced 4D adaptive support mechanism adjustable in height, depth, pivot angle, and width to perfectly align with your elbow joints and neutral wrist alignment. Covered in high-density, soft-touch PU cushioning, these armrests significantly reduce pressure on the ulnar nerve and diminish shoulder fatigue by supporting the natural weight of your arms.",
        specs: ["4D Multi-Pivot", "PU Cushioning", "Width & Depth Slide"],
        style: { left: "38.5%", top: "10%" },
        mobileStyle: { left: "37%", top: "18%" }, // Change these percentages to reposition the armrest dot on mobile!
        cardPosition: "right",
    },
    {
        id: "seat",
        title: "Dual-Density Cushion",
        desc: "Anatomically contoured high-resilience foam base featuring a waterfall front edge design that relieves pressure behind the knees and improves blood flow to the lower limbs. Incorporates dual-density foam zoning that absorbs pelvic pressure and distributes body weight evenly, ensuring comfort that doesn't compress or sag over years of heavy daily usage.",
        specs: ["High-Resilience Foam", "Waterfall Edge", "Ischial Pressure Relief"],
        style: { left: "55.5%", top: "25%" },
        mobileStyle: { left: "55.5%", top: "36%" }, // Change these percentages to reposition the seat dot on mobile!
        cardPosition: "left",
    },
    {
        id: "suspension",
        title: "Class 4 Gas Suspension",
        desc: "Equipped with a heavy-duty Class 4 nitrogen-charged gas lift cylinder providing fluid height adjustments and responsive vertical shock absorption. Built to rigorous international safety standards (BIFMA/SGS), this cylinder ensures ultra-smooth travel, silent 360-degree rotation, and exceptional stability, rated for lifetime performance.",
        specs: ["Class 4 Safety", "Nitrogen Charged", "Smooth Travel"],
        style: { left: "72%", top: "25%" },
        mobileStyle: { left: "71%", top: "30%" }, // Change these percentages to reposition the suspension dot on mobile!
        cardPosition: "right",
    },
    {
        id: "base",
        title: "Die-Cast Star Base",
        desc: "Manufactured from aviation-grade reinforced aluminum alloy, this die-cast 5-star base is engineered to withstand extreme static loads up to 350 lbs. Fitted with whisper-quiet, floor-safe PU casters that glide effortlessly across hardwood, carpets, and tile surfaces without leaving unsightly scuffs, scratches, or tread marks.",
        specs: ["Aviation-Grade Alloy", "350 lbs Capacity", "Floor-Safe PU Casters"],
        style: { left: "84%", top: "47%" },
        mobileStyle: { left: "83%", top: "40.5%" }, // Change these percentages to reposition the base dot on mobile!
        cardPosition: "left",
    },
];

const Header2 = () => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [count, setCount] = useState(0);
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
                    const end = 50000;
                    const duration = 2000; // 2 seconds
                    const startTime = performance.now();

                    const animate = (currentTime: number) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Ease out quad
                        const easeProgress = progress * (2 - progress);
                        const currentCount = Math.floor(easeProgress * end);

                        setCount(currentCount);

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            setCount(end);
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

    const activeHotspot = HOTSPOTS.find((h) => h.id === activeId);

    return (
        <section id="anatomy" ref={containerRef} className="flex w-full bg-[#F8F9FA] overflow-hidden relative items-center py-2 md:py-4 border-t border-zinc-200 border-b border-zinc-200">
            {/* Premium Minimalist Background Grid & Ambient Glows */}
            <div className="absolute inset-0 opacity-40">
                <div className="h-full w-full bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:100px_100px]" />
            </div>
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-slate-300/10 blur-[150px] pointer-events-none" />

            <div className="max-w-[1600px] mx-auto px-4 md:px-8 w-full relative z-10">
                {/* 2-Column Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-4 items-start bg-white/50 rounded-[32px] border border-zinc-200/80 p-4 md:p-8 lg:p-12 overflow-visible shadow-[0_20px_50px_rgba(15,23,42,0.02)]">
                    
                    {/* Left Column: Exploded Chair (approx 58% width) shifted slightly left */}
                    <div className="lg:col-span-7 relative w-full flex items-start justify-start scale-100 lg:-ml-4 transition-transform duration-500">
                        <div className="relative w-full max-w-[1050px]">
                            <Image
                                src={expandedImg}
                                alt="Exploded Chair"
                                className="w-full h-auto object-contain select-none transition-all duration-500"
                                priority
                            />

                            {/* Hotspots Container */}
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
                                            <div className="relative cursor-pointer flex items-center justify-center w-8 h-8 md:w-12 md:h-12">
                                                <div className={`absolute w-3.5 h-3.5 md:w-6 md:h-6 bg-slate-400/30 rounded-full animate-ping pointer-events-none transition-transform duration-300 ${isActive ? "scale-155" : ""}`} />
                                                <div className={`absolute w-2 h-2 md:w-4 md:h-4 rounded-full pointer-events-none transition-all duration-300 ${isActive ? "bg-slate-700 scale-125 shadow-[0_0_12px_rgba(71,85,105,0.6)]" : "bg-slate-500/60"}`} />
                                                <div className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 bg-slate-700 rounded-full ring-[1.5px] md:ring-4 ring-white transition-all duration-300 group-hover:scale-125" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Spec / Text Details (approx 42% width) with larger text */}
                    <div className="lg:col-span-5 w-full flex flex-col justify-start lg:pl-6 mt-8 lg:mt-0">
                        <div className="bg-white/90 backdrop-blur-md border border-zinc-200/80 rounded-[28px] p-6 md:p-10 shadow-[0_15px_35px_rgba(15,23,42,0.03)] relative overflow-hidden h-[420px] lg:h-[500px] flex flex-col justify-between">
                            
                            {/* Decorative Top Accent Line */}
                            <div className="absolute top-0 left-0 right-0 h-[3.5px] bg-slate-800" />

                            <div>
                                {activeHotspot ? (
                                    // Interactive Spec Detail Mode
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="flex items-center justify-center w-4 h-4 rounded-full bg-slate-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-pulse" />
                                            </div>
                                            <span className="text-[10px] sm:text-[11px] tracking-[0.2em] font-extrabold uppercase text-slate-500">
                                                Technical Specification
                                            </span>
                                        </div>

                                        <h4 className="text-zinc-950 text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 transition-all duration-300 leading-tight">
                                            {activeHotspot.title}
                                        </h4>

                                        <p className="text-zinc-600 text-sm sm:text-base leading-relaxed mb-8 font-medium transition-all duration-300">
                                            {activeHotspot.desc}
                                        </p>

                                        {/* Specs Tag Grid */}
                                        <div className="flex flex-wrap gap-2 pt-5 border-t border-zinc-100">
                                            {activeHotspot.specs.map((spec, sIdx) => (
                                                <span
                                                    key={sIdx}
                                                    className="text-[10px] sm:text-[11px] font-bold bg-zinc-50 border border-zinc-200 text-zinc-600 px-3 py-2 rounded-lg flex items-center gap-1.5"
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    // Default Overview Mode
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-[10px] sm:text-[11px] tracking-[0.25em] font-extrabold uppercase text-slate-400">
                                                Anatomy of Comfort
                                            </span>
                                        </div>

                                        <h3 className="text-zinc-950 text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
                                            Engineered Down to Every Part
                                        </h3>

                                        <p className="text-zinc-600 text-sm sm:text-base leading-relaxed mb-8 font-medium">
                                            Hover or tap on the indicators to inspect the custom technical specifications and design innovations of our flagship seating framework. Each component has been developed with advanced orthopedic research to optimize sitting posture, maximize breathability, and ensure long-term comfort for developers, gamers, and professionals alike.
                                        </p>

                                        {/* Animated Stat Counter */}
                                        <div className="pt-6 border-t border-zinc-100 flex flex-col gap-1.5">
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">{count.toLocaleString()}</span>
                                                <span className="text-2xl font-extrabold text-slate-800">+</span>
                                            </div>
                                            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400">
                                                Satisfied Users Nationwide
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Header2;