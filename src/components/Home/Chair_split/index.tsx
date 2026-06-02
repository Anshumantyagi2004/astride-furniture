'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import ChairErizo from '../../../../public/Png1/chair8_ERIZO.webp';

export default function Chair_split() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll progress of the entire container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Smooth easing for all transitions
    const easeInOutCubic = [0.4, 0, 0.2, 1];

    // Sticky pane shifts from left (with a slight right shift for tightness) to right (with a slight left shift)
    const stickyPaneX = useTransform(scrollYProgress, [0.25, 0.9], ["5%", "95%"]);

    // Chair animations with smooth easing
    const centerChairX = useTransform(scrollYProgress, [0.25, 0.9], ["-8vw", "0vw"]);
    const centerChairScale = useTransform(scrollYProgress, [0.25, 0.9], [1.08, 0.95]);

    const leftChairX = useTransform(scrollYProgress, [0.25, 0.9], ["0vw", "-12vw"]);
    const leftChairOpacity = useTransform(scrollYProgress, [0, 0.25, 0.4, 1], [0, 0, 0.95, 0.95]);
    const leftChairScale = useTransform(scrollYProgress, [0.25, 0.9], [0.75, 0.84]);

    const rightChairX = useTransform(scrollYProgress, [0.25, 0.9], ["0vw", "12vw"]);
    const rightChairOpacity = useTransform(scrollYProgress, [0, 0.25, 0.4, 1], [0, 0, 0.95, 0.95]);
    const rightChairScale = useTransform(scrollYProgress, [0.25, 0.9], [0.75, 1.06]);

    const sizeIndicatorOpacity = useTransform(scrollYProgress, [0.3, 0.9], [0, 1]);

    return (
        <div
            ref={containerRef}
            className="hidden md:block relative w-full h-[155vh] bg-black text-white"
            style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
            }}
        >
            {/* ── STICKY SHOWCASE PANE ── */}
            <div className="sticky top-0 w-full h-[100vh] overflow-hidden z-10 select-none pointer-events-none">
                <motion.div
                    style={{ x: stickyPaneX }}
                    className="w-full md:w-1/2 h-full flex items-center justify-center relative pointer-events-auto"
                >
                    {/* Left Chair (SMALL SIZE) */}
                    <motion.div
                        style={{ x: leftChairX, opacity: leftChairOpacity, scale: leftChairScale, zIndex: 10 }}
                        className="absolute will-change-transform"
                    >
                        <div className="relative">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black tracking-widest bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded">
                                LOW PROFILE
                            </span>
                            <Image src={ChairErizo} alt="Astride Chair Low Profile" width={330} height={330} quality={95} style={{ imageRendering: '-webkit-optimize-contrast' }} className="object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] brightness-90" priority />
                        </div>
                    </motion.div>

                    {/* Center Chair (STANDARD POSITION) */}
                    <motion.div
                        style={{ x: centerChairX, scale: centerChairScale, zIndex: 20 }}
                        className="absolute will-change-transform"
                    >
                        <div className="relative">
                            <motion.span style={{ opacity: sizeIndicatorOpacity }} className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black tracking-widest bg-white text-black px-2 py-0.5 rounded">
                                STANDARD
                            </motion.span>
                            <Image src={ChairErizo} alt="Astride Chair Standard" width={330} height={330} quality={95} style={{ imageRendering: '-webkit-optimize-contrast' }} className="object-contain filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)]" priority />
                        </div>
                    </motion.div>

                    {/* Right Chair (EXTENDED HEIGHT) */}
                    <motion.div
                        style={{ x: rightChairX, opacity: rightChairOpacity, scale: rightChairScale, zIndex: 10 }}
                        className="absolute will-change-transform"
                    >
                        <div className="relative">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black tracking-widest bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded">
                                EXTENDED HEIGHT
                            </span>
                            <Image src={ChairErizo} alt="Astride Chair Extended" width={330} height={330} quality={95} style={{ imageRendering: '-webkit-optimize-contrast' }} className="object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] brightness-95" priority />
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* ── SCROLLING INFORMATION PANELS ── */}

            {/* Section 1: Positioned on the Right (shifted left to close gap) */}
            <div className="absolute top-0 right-[4vw] w-full md:w-[46%] min-h-screen flex flex-col justify-center pl-2 pr-6 md:pl-4 md:pr-8 py-4 z-20 pointer-events-none">
                <div className="flex flex-col gap-1.5 pointer-events-auto">
                    <div className="flex flex-col gap-0.5">
                        <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                            Premium Ergonomic Chairs <br />
                            <span className="text-neutral-500 font-medium">Redefined for modern workspaces</span>
                        </h2>
                        <p className="text-neutral-400 text-sm font-medium leading-relaxed max-w-lg mt-0.5">
                            More comfort. Deeper personalization. Exceptional durability. With research-backed design innovations engineered for serious performance, Astride chairs provide unparalleled support. Elevate your workspace with pro-grade ergonomics — designed for professionals.
                        </p>
                    </div>

                    <div className="border-t border-neutral-900 pt-2">
                        <h3 className="text-xs font-black tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
                            Our most technologically advanced ergonomic chair yet
                        </h3>
                        <ul className="flex flex-col gap-1 text-[10px] font-black tracking-widest text-neutral-300">
                            {[
                                "PRECISION-ENGINEERED SEAT BASE",
                                "BREATHABLE PREMIUM MESH",
                                "DYNAMIC LUMBAR SUPPORT",
                                "ADJUSTABLE SEAT DEPTH",
                                "MULTI-DIMENSIONAL 4D ARMRESTS"
                            ].map((spec, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-neutral-600 rounded-full flex-shrink-0" />
                                    {spec}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Section 2: Positioned on the Left (shifted right to close gap) */}
            <div className="absolute top-[55vh] left-[4vw] w-full md:w-[46%] min-h-screen flex flex-col justify-center pr-2 pl-6 md:pr-4 md:pl-8 py-4 z-20 pointer-events-none">
                <div className="flex flex-col gap-1.5 pointer-events-auto">
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase">
                                FIND YOUR PERFECT FIT
                            </span>
                            <span className="text-[7px] font-black tracking-wider bg-white text-black px-1.5 py-0.5 rounded">
                                ADAPTABLE
                            </span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                            One ergonomic chair. <br />
                            Universal adjustability.
                        </h2>
                        <p className="text-neutral-400 text-sm font-medium leading-relaxed max-w-lg mt-0.5">
                            Personalized ergonomic support for everyone. Because we're all built differently. Intelligent adjustable mechanisms allow the chair to adapt dynamically to your body. From height adjustments to flexible armrests—find your perfect sitting posture effortlessly.
                        </p>
                    </div>

                    {/* Adjustability Range Table */}
                    <div className="border-t border-neutral-900 pt-2 max-w-lg">
                        <h3 className="text-xs font-black tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
                            ADJUSTABILITY RANGE
                        </h3>
                        <div className="flex flex-col gap-0.5 font-semibold text-xs text-neutral-300">
                            {[
                                { size: "SEAT HEIGHT", ht: "18\" - 22\"", wt: "Adjustable" },
                                { size: "ARMREST HEIGHT", ht: "6\" - 10\"", wt: "Adjustable" },
                                { size: "WEIGHT CAPACITY", ht: "Up to", wt: "135kg", isGold: true }
                            ].map((row, i) => (
                                <div key={i} className="flex justify-between items-center py-1 border-b border-neutral-900/60">
                                    <span className={`font-black tracking-wider text-[11px] ${row.isGold ? 'text-white' : ''}`}>
                                        {row.size}
                                    </span>
                                    <div className="flex gap-8 text-[11px] text-neutral-400 font-bold">
                                        <span>{row.ht}</span>
                                        <span className="w-16 text-right">{row.wt}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}