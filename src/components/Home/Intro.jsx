"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
    ShieldCheck,
    Sofa,
    Sparkles,
    Armchair,
} from "lucide-react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function BrandAboutSection() {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animating left image grid
            gsap.fromTo(
                ".intro-image-card",
                { opacity: 0, y: 40, scale: 0.96 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.7,
                    stagger: 0.12,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                }
            );

            // Animating right content headers & paragraphs
            gsap.fromTo(
                ".intro-content-item",
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 75%",
                        toggleActions: "play none none reverse",
                    },
                }
            );

            // Animating right feature cards
            gsap.fromTo(
                ".intro-feature-card",
                { opacity: 0, y: 20, scale: 0.97 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.06,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 70%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="w-full py-12 bg-[#F4F4F5] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-14 items-center">
                    {/* LEFT IMAGE GRID */}
                    <div className="grid grid-cols-2 gap-5">
                        <div className="col-span-2 relative h-[320px] rounded-[30px] overflow-hidden bg-white border border-zinc-200 hover:border-zinc-800 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 intro-image-card group">
                            <Image
                                src="/694_9.webp"
                                alt="Office Chair"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#161316]/30 via-transparent to-transparent"></div>
                        </div>

                        <div className="relative h-[300px] rounded-[28px] overflow-hidden bg-white border border-zinc-200 hover:border-zinc-800 hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] transition-all duration-500 intro-image-card group">
                            <Image
                                src="/Product/AlphaBrown_8.webp"
                                alt="Chair"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>

                        <div className="relative h-[300px] rounded-[28px] overflow-hidden bg-white border border-zinc-200 hover:border-zinc-800 hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] transition-all duration-500 intro-image-card group">
                            <Image
                                src="/Product/Infographic-6.webp"
                                alt="Chair"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>

                    {/* RIGHT CONTENT COLUMN */}
                    <div>
                        {/* TAG */}
                        <span className="flex flex-col justify-start items-start text-zinc-500 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] intro-content-item">
                            About ASTRIDE
                            <div className="w-14 h-[2px] bg-zinc-800 mt-2 rounded-full"></div>
                        </span>

                        {/* HEADING */}
                        <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#161316] leading-tight intro-content-item">
                            India’s Trusted Office Chair Manufacturer & Supplier
                        </h2>

                        {/* DESCRIPTION */}
                        <p className="mt-4 text-[#3f4248] leading-relaxed text-base sm:text-lg intro-content-item">
                            At{" "}
                            <span className="font-bold text-zinc-900">
                                ASTRIDE
                            </span>
                            , we create premium ergonomic office chairs designed
                            for comfort, elegance, and productivity. From
                            work-from-home setups to executive seating solutions,
                            every chair is crafted with modern aesthetics and
                            exceptional support.
                        </p>

                        <p className="mt-4 text-[#3f4248] leading-relaxed text-base sm:text-lg intro-content-item font-light">
                            Explore mesh back chairs, lumbar support chairs,
                            revolving office chairs, adjustable seating, and
                            modern workspace collections built with innovation,
                            durability, and style.
                        </p>

                        {/* FEATURES */}
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="flex items-center gap-4 p-4 md:p-5 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-800 hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group cursor-default intro-feature-card">
                                <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-800 group-hover:bg-zinc-900 group-hover:text-white group-hover:scale-110 flex items-center justify-center shrink-0 transition-all duration-300">
                                    <Sofa size={22} />
                                </div>
                                <h3 className="font-semibold text-[#161316] text-sm md:text-base group-hover:text-zinc-900 transition-colors duration-300">
                                    Ergonomic Comfort
                                </h3>
                            </div>

                            <div className="flex items-center gap-4 p-4 md:p-5 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-800 hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group cursor-default intro-feature-card">
                                <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-800 group-hover:bg-zinc-900 group-hover:text-white group-hover:scale-110 flex items-center justify-center shrink-0 transition-all duration-300">
                                    <ShieldCheck size={22} />
                                </div>
                                <h3 className="font-semibold text-[#161316] text-sm md:text-base group-hover:text-zinc-900 transition-colors duration-300">
                                    Premium Quality
                                </h3>
                            </div>

                            <div className="flex items-center gap-4 p-4 md:p-5 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-800 hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group cursor-default intro-feature-card">
                                <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-800 group-hover:bg-zinc-900 group-hover:text-white group-hover:scale-110 flex items-center justify-center shrink-0 transition-all duration-300">
                                    <Sparkles size={22} />
                                </div>
                                <h3 className="font-semibold text-[#161316] text-sm md:text-base group-hover:text-zinc-900 transition-colors duration-300">
                                    Sleek Aesthetics
                                </h3>
                            </div>

                            <div className="flex items-center gap-4 p-4 md:p-5 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-800 hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group cursor-default intro-feature-card">
                                <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-800 group-hover:bg-zinc-900 group-hover:text-white group-hover:scale-110 flex items-center justify-center shrink-0 transition-all duration-300">
                                    <Armchair size={22} />
                                </div>
                                <h3 className="font-semibold text-[#161316] text-sm md:text-base group-hover:text-zinc-900 transition-colors duration-300">
                                    Modern Designs
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}