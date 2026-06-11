'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import ChairErizo from '../../../../public/Png1/chair8_ERIZO.webp';

const sans = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-sans',
});

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
            className={`hidden md:block relative w-full h-[155vh] bg-black text-white -mt-24 md:-mt-36 ${sans.className}`}
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
                            <Image src={ChairErizo} alt="Astride Chair Low Profile" width={330} height={330} quality={75} style={{ imageRendering: '-webkit-optimize-contrast' }} className="object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] brightness-90" priority />
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
                            <Image src={ChairErizo} alt="Astride Chair Standard" width={330} height={330} quality={75} style={{ imageRendering: '-webkit-optimize-contrast' }} className="object-contain filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)]" priority />
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
                            <Image src={ChairErizo} alt="Astride Chair Extended" width={330} height={330} quality={75} style={{ imageRendering: '-webkit-optimize-contrast' }} className="object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] brightness-95" priority />
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* ── SCROLLING INFORMATION PANELS ── */}

            {/* Section 1: Positioned on the Right */}
            <div className="absolute top-0 right-[4vw] w-full md:w-[46%] min-h-screen flex flex-col justify-center pl-2 pr-6 md:pl-4 md:pr-8 py-4 z-20 pointer-events-none">
                <div className="flex flex-col gap-5 pointer-events-auto">

                    {/* Heading */}
                    <h2 className="text-[54px] lg:text-[72px] xl:text-[80px] font-black uppercase leading-[1.0] tracking-[-0.02em] text-white">
                        Engineered<br />{""}
                        <span
                            className={`${sans.className} font-extrabold`}
                            style={{
                                background: "linear-gradient(90deg, #8B5CF6, #EC4899)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            To Every Part 
                        </span>
                    </h2>

                    {/* Body */}
                    <p className="text-[16px] font-semibold leading-relaxed text-[#D1D5DB] max-w-[480px]">
                        Our most technologically advanced ergonomic chair yet —
                        developed with orthopedic research to optimize posture,
                        maximize breathability and keep you comfortable.
                    </p>

                    {/* Feature list */}
                    <ul className="flex flex-col mt-4">
                        {[
                            "Precision-Engineered Seat Base",
                            "Breathable Premium Mesh",
                            "Dynamic Lumbar Support",
                        ].map((spec, i) => (
                            <li key={i} className="flex items-center gap-3.5 py-[16px] border-b border-dashed border-white/15">
                                <span className="text-[#C8F135] font-extrabold text-[18px] leading-none">✓</span>
                                <span className="text-[14px] font-extrabold uppercase tracking-[0.12em] text-white">{spec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Section 2: Positioned on the Left */}
            <div className="absolute top-[55vh] left-[4vw] w-full md:w-[46%] min-h-screen flex flex-col justify-center pr-2 pl-6 md:pr-4 md:pl-8 py-4 z-20 pointer-events-none">
                <div className="flex flex-col gap-5 pointer-events-auto">

                    {/* Badge */}
                    

                    {/* Heading */}
                    <h2 className="text-[54px] lg:text-[72px] xl:text-[80px] font-black uppercase leading-[1.0] tracking-[-0.02em] text-white">
                        One Chair.
                        <br />
                        <span
                            className={`${sans.className} font-extrabold`}
                            style={{
                                background: "linear-gradient(90deg, #8B5CF6, #EC4899)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            Universal Fit.
                        </span>
                    </h2>

                    {/* Body */}
                    <p className="text-[16px] font-semibold leading-relaxed text-[#D1D5DB] max-w-[480px]">
                        Personalized ergonomic support for everyone. Because we&apos;re all built
                        differently. Intelligent adjustable mechanisms allow the chair to adapt
                        dynamically to your body — from height to armrests.
                    </p>

                    {/* Adjustability table */}
                    <ul className="flex flex-col mt-4">
                        {[
                            { label: "Seat Height", value: '18" – 22"' },
                            { label: "Armrest Height", value: '6" – 10"' },
                            { label: "Weight Capacity", value: "Up to 135 kg" },
                        ].map((row, i) => (
                            <li key={i} className="flex items-center justify-between py-[16px] border-b border-dashed border-white/15">
                                <div className="flex items-center gap-3.5">
                                    <span className="text-[#C8F135] font-extrabold text-[18px] leading-none">✓</span>
                                    <span className="text-[14px] font-extrabold uppercase tracking-[0.12em] text-white">{row.label}</span>
                                </div>
                                <span className="text-[14px] font-bold text-white/50">{row.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}