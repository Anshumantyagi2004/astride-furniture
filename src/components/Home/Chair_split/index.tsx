// src/components/Home/Chair_split/index.tsx
'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import ChairErizo from '../../../../public/Png1/chair8_ERIZO.webp';

const FEATURES_LIST = [
    "Precision-Engineered Seat Base",
    "Breathable Premium Mesh",
    "Dynamic Lumbar Support",
];

const ADJUSTABILITY_DATA = [
    { label: "Seat Height", value: '18" – 22"' },
    { label: "Armrest Height", value: '6" – 10"' },
    { label: "Weight Capacity", value: "Up to 135 kg" },
];

const gradientStyle = {
    background: "linear-gradient(90deg, #8B5CF6, #EC4899)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
};

export default function Chair_split() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const stickyPaneX = useTransform(smoothProgress, [0.25, 0.9], ["5%", "95%"]);

    const centerChairX = useTransform(smoothProgress, [0.25, 0.9], ["-8vw", "0vw"]);
    const centerChairScale = useTransform(smoothProgress, [0.25, 0.9], [1.08, 0.95]);

    const leftChairX = useTransform(smoothProgress, [0.25, 0.9], ["0vw", "-12vw"]);
    const leftChairOpacity = useTransform(smoothProgress, [0, 0.25, 0.4, 1], [0, 0, 0.95, 0.95]);
    const leftChairScale = useTransform(smoothProgress, [0.25, 0.9], [0.75, 0.84]);

    const rightChairX = useTransform(smoothProgress, [0.25, 0.9], ["0vw", "12vw"]);
    const rightChairOpacity = useTransform(smoothProgress, [0, 0.25, 0.4, 1], [0, 0, 0.95, 0.95]);
    const rightChairScale = useTransform(smoothProgress, [0.25, 0.9], [0.75, 1.06]);

    const sizeIndicatorOpacity = useTransform(smoothProgress, [0.3, 0.9], [0, 1]);

    return (
        <div
            ref={containerRef}
            className="hidden md:block relative w-full h-[155vh] bg-black text-white -mt-24 md:-mt-36 font-sans"
        >
            <div className="sticky top-0 w-full h-[100vh] overflow-hidden z-10 select-none pointer-events-none">
                <motion.div
                    style={{ x: stickyPaneX, z: 0 }}
                    className="w-full md:w-1/2 h-full flex items-center justify-center relative pointer-events-auto will-change-transform"
                >
                    <motion.div
                        style={{ x: leftChairX, opacity: leftChairOpacity, scale: leftChairScale, zIndex: 10, z: 0 }}
                        className="absolute will-change-transform"
                    >
                        <div className="relative">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black tracking-widest bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded whitespace-nowrap">
                                LOW PROFILE
                            </span>
                            <Image 
                                src={ChairErizo} 
                                alt="Astride Chair Low Profile" 
                                width={330} 
                                height={330} 
                                quality={75} 
                                sizes="330px" 
                                style={{ imageRendering: '-webkit-optimize-contrast' }} 
                                className="object-contain brightness-90" 
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        style={{ x: centerChairX, scale: centerChairScale, zIndex: 20, z: 0 }}
                        className="absolute will-change-transform"
                    >
                        <div className="relative">
                            <motion.span style={{ opacity: sizeIndicatorOpacity }} className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black tracking-widest bg-white text-black px-2 py-0.5 rounded whitespace-nowrap">
                                STANDARD
                            </motion.span>
                            <Image 
                                src={ChairErizo} 
                                alt="Astride Chair Standard" 
                                width={330} 
                                height={330} 
                                quality={75} 
                                sizes="330px" 
                                style={{ imageRendering: '-webkit-optimize-contrast' }} 
                                className="object-contain" 
                                priority 
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        style={{ x: rightChairX, opacity: rightChairOpacity, scale: rightChairScale, zIndex: 10, z: 0 }}
                        className="absolute will-change-transform"
                    >
                        <div className="relative">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black tracking-widest bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded whitespace-nowrap">
                                EXTENDED HEIGHT
                            </span>
                            <Image 
                                src={ChairErizo} 
                                alt="Astride Chair Extended" 
                                width={330} 
                                height={330} 
                                quality={75} 
                                sizes="330px" 
                                style={{ imageRendering: '-webkit-optimize-contrast' }} 
                                className="object-contain brightness-95" 
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <div className="absolute top-0 right-[4vw] w-full md:w-[46%] min-h-screen flex flex-col justify-center pl-2 pr-6 md:pl-4 md:pr-8 py-4 z-20 pointer-events-none">
                <div className="flex flex-col gap-5 pointer-events-auto">
                    <h2 className="text-[54px] lg:text-[72px] xl:text-[80px] font-black uppercase leading-[1.0] tracking-[-0.02em] text-white">
                        Engineered<br />
                        <span className="font-extrabold font-sans" style={gradientStyle}>
                            To Every Part 
                        </span>
                    </h2>

                    <p className="text-[16px] font-semibold leading-relaxed text-[#D1D5DB] max-w-[480px]">
                        Our most technologically advanced ergonomic chair yet —
                        developed with orthopedic research to optimize posture,
                        maximize breathability and keep you comfortable.
                    </p>

                    <ul className="flex flex-col mt-4">
                        {FEATURES_LIST.map((spec, i) => (
                            <li key={i} className="flex items-center gap-3.5 py-[16px] border-b border-dashed border-white/15">
                                <span className="text-[#C8F135] font-extrabold text-[18px] leading-none">✓</span>
                                <span className="text-[14px] font-extrabold uppercase tracking-[0.12em] text-white">{spec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="absolute top-[55vh] left-[4vw] w-full md:w-[46%] min-h-screen flex flex-col justify-center pr-2 pl-6 md:pr-4 md:pl-8 py-4 z-20 pointer-events-none">
                <div className="flex flex-col gap-5 pointer-events-auto">
                    <h2 className="text-[54px] lg:text-[72px] xl:text-[80px] font-black uppercase leading-[1.0] tracking-[-0.02em] text-white">
                        One Chair.<br />
                        <span className="font-extrabold font-sans" style={gradientStyle}>
                            Universal Fit.
                        </span>
                    </h2>

                    <p className="text-[16px] font-semibold leading-relaxed text-[#D1D5DB] max-w-[480px]">
                        Personalized ergonomic support for everyone. Because we&apos;re all built
                        differently. Intelligent adjustable mechanisms allow the chair to adapt
                        dynamically to your body — from height to armrests.
                    </p>

                    <ul className="flex flex-col mt-4">
                        {ADJUSTABILITY_DATA.map((row, i) => (
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