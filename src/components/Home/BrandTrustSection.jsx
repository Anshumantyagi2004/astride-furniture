"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShoppingBag, Users, Award, Star } from "lucide-react";

// Hook/Component for count-up animation when in view
function Counter({ value }) {
    const [count, setCount] = useState("0");
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (!isInView) return;

        // Parse number and suffix from string (e.g. "55K+" -> "55" and "K+")
        const match = value.match(/([\d.]+)(.*)/);
        if (!match) {
            setCount(value);
            return;
        }

        const numVal = parseFloat(match[1]);
        const suffix = match[2] || "";
        const isFloat = match[1].includes(".");

        let start = 0;
        const duration = 1200; // 1.2s animation
        const startTime = performance.now();

        const update = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out quad
            const easeProgress = progress * (2 - progress);
            const current = start + (numVal - start) * easeProgress;

            const formatted = isFloat ? current.toFixed(1) : Math.floor(current).toString();
            setCount(formatted + suffix);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                setCount(value);
            }
        };

        requestAnimationFrame(update);
    }, [isInView, value]);

    return <span ref={ref}>{count}</span>;
}

const metrics = [
    {
        icon: ShoppingBag,
        value: "55K+",
        label: "Orders Delivered",
    },
    {
        icon: Users,
        value: "40K+",
        label: "Happy Customers",
    },
    {
        icon: Award,
        value: "11+",
        label: "Years Experience",
    },
    {
        icon: Star,
        value: "4.8",
        label: "Customer Rating",
        hasRatingStar: true,
    },
];

export default function MarketplaceReviews() {
    return (
        <section className="w-full pt-8 pb-4 bg-[#F8F7F5] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">

                {/* Heading Section */}
                <div className="text-center mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#161316] leading-tight tracking-tight">
                            India&apos;s Leading{" "}
                            <span className="text-[#FF6D29]">Ergonomic Furniture</span> Brand
                        </h2>

                        {/* Custom Separator Divider Accent */}
                        <div className="flex items-center justify-center gap-4 mt-5">
                            <div className="w-14 h-[1px] bg-gradient-to-r from-transparent to-[#FF6D29]"></div>
                            <div className="w-2 h-2 rounded-full bg-[#FF6D29]"></div>
                            <div className="w-14 h-[1px] bg-gradient-to-l from-transparent to-[#FF6D29]"></div>
                        </div>
                    </motion.div>
                </div>

                {/* 4-Column Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 md:gap-y-0 max-w-6xl mx-auto items-center">
                    {metrics.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className={`text-center flex flex-col items-center justify-center px-4 ${idx !== metrics.length - 1 ? "md:border-r border-gray-200/70" : ""
                                    }`}
                            >
                                {/* Circular Outline Icon Container */}
                                <div className="w-14 h-14 rounded-full bg-[#FFF1EA] border border-[#FFD7C5] text-[#FF6D29] flex items-center justify-center mb-5 transition-transform duration-300 hover:scale-110">
                                    <Icon size={24} strokeWidth={1.75} />
                                </div>

                                {/* Metric Value with Counter */}
                                <div className="flex items-center justify-center gap-1">
                                    <h3 className="text-3xl md:text-4xl font-extrabold text-[#161316] tracking-tight">
                                        <Counter value={item.value} />
                                    </h3>
                                    {item.hasRatingStar}
                                </div>

                                {/* Metric Label */}
                                <p className="mt-2 text-xs md:text-sm text-[#52525b] font-semibold leading-relaxed">
                                    {item.label}
                                </p>

                                {/* Orange Segment Accent Underline */}

                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom Available On Pill Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="w-full max-w-4xl mx-auto mt-8 bg-[#FFF6F1]/60 border border-[#FFEBE0]/40 rounded-full py-4 px-6 md:px-10 flex items-center justify-center md:justify-between flex-wrap gap-4 shadow-[0_4px_16px_rgba(255,109,41,0.02)]"
                >
                    {/* Left Text Label */}
                    <div className="flex items-center gap-4">
                        <span className="text-[13px] md:text-sm font-extrabold uppercase tracking-wider text-gray-700">
                            Available On
                        </span>
                        <div className="hidden md:block h-5 w-[1px] bg-gray-200"></div>
                    </div>

                    {/* Right Brand Logos */}
                    <div className="flex items-center gap-6 md:gap-8 flex-wrap justify-center">
                        {/* Amazon Logo */}
                        <div className="relative w-[130px] h-[60px] transition-transform hover:scale-105">
                            <Image
                                src="/Logo/amazon.webp"
                                alt="Amazon"
                                fill
                                className="object-contain scale-[1.5]"
                            />
                        </div>

                        {/* Flipkart Logo */}
                        <div className="relative w-[130px] h-[60px] transition-transform hover:scale-105">
                            <Image
                                src="/Logo/FLIPKART_Webp.webp"
                                alt="Flipkart"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}