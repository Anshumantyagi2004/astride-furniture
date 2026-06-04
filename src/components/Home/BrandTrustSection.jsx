"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ShoppingBag, Users, Award, Star } from "lucide-react";

function Counter({ value, start }) {
    const [count, setCount] = useState("0");

    useEffect(() => {
        if (!start) return;
        const match = value.match(/([\d.]+)(.*)/);
        if (!match) { setCount(value); return; }
        const numVal = parseFloat(match[1]);
        const suffix = match[2] || "";
        const isFloat = match[1].includes(".");
        const duration = 1500;
        const startTime = performance.now();
        const update = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = numVal * ease;
            setCount((isFloat ? current.toFixed(1) : Math.floor(current).toString()) + suffix);
            if (progress < 1) requestAnimationFrame(update);
            else setCount(value);
        };
        requestAnimationFrame(update);
    }, [start, value]);

    return <span>{count}</span>;
}

const metrics = [
    { icon: ShoppingBag, value: "55K+", label: "Orders Delivered" },
    { icon: Users,       value: "40K+", label: "Happy Customers"  },
    { icon: Award,       value: "11+",  label: "Years Experience" },
    { icon: Star,        value: "4.8",  label: "Customer Rating"  },
];

export default function BrandTrustSection() {
    const [inView, setInView] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="w-full overflow-hidden relative"
            style={{
                background: "linear-gradient(160deg, #F5F0E8 0%, #EDE8DD 40%, #E8E2D6 100%)",
            }}
        >
            <div className="max-w-7xl mx-auto px-6 py-14 relative z-10">

                {/* Heading */}
                <div className="text-center mb-12">
                    <h2
                        className="text-3xl sm:text-4xl lg:text-[2.8rem] font-black leading-tight tracking-tight"
                        style={{ color: "#1C2B4A" }}
                    >
                        India&apos;s Leading{" "}
                        <em
                            className="not-italic font-light"
                            style={{
                                background: "linear-gradient(135deg, #2E6B9E, #1C4E80)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            Ergonomic Chair
                        </em>{" "}
                        Brand
                    </h2>

                    <div className="flex items-center justify-center gap-3 mt-5">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#2E6B9E]/40" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2E6B9E]/50" />
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#2E6B9E]/40" />
                    </div>
                </div>

                {/* Stats — no cards, clean editorial row */}
                <div
                    className="grid grid-cols-2 md:grid-cols-4 mb-10"
                    style={{
                        background: "rgba(255,255,255,0.9)",
                        borderRadius: "20px",
                        border: "1px solid rgba(44,107,158,0.12)",
                        boxShadow: "0 8px 40px rgba(28,43,74,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
                    }}
                >
                    {metrics.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={idx}
                                className={`group flex flex-col items-center justify-center py-10 px-6 cursor-default relative transition-all duration-300 hover:-translate-y-1 ${idx !== metrics.length - 1 ? "border-r border-[#1C2B4A]/[0.07]" : ""}`}
                                style={{ borderRadius: idx === 0 ? "20px 0 0 20px" : idx === metrics.length - 1 ? "0 20px 20px 0" : "" }}
                            >
                                {/* Icon */}
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                                    style={{
                                        background: "linear-gradient(135deg, #2E6B9E15, #1C4E8020)",
                                        border: "1px solid rgba(46,107,158,0.15)",
                                    }}
                                >
                                    <Icon size={20} strokeWidth={1.75} style={{ color: "#2E6B9E" }} />
                                </div>

                                {/* Number */}
                                <h3
                                    className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-2"
                                    style={{ color: "#1C2B4A" }}
                                >
                                    <Counter value={item.value} start={inView} />
                                </h3>

                                {/* Label */}
                                <p
                                    className="text-[10px] font-bold uppercase tracking-[0.18em]"
                                    style={{ color: "#7A8BA0" }}
                                >
                                    {item.label}
                                </p>

                                {/* Hover underline */}
                                <div
                                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-10 rounded-full transition-all duration-500"
                                    style={{ background: "linear-gradient(90deg, #2E6B9E, #1C4E80)" }}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Available On */}
                <div
                    className="flex items-center justify-center md:justify-between flex-wrap gap-5"
                    style={{
                        background: "rgba(255,255,255,0.85)",
                        borderRadius: "16px",
                        border: "1px solid rgba(28,43,74,0.08)",
                        padding: "14px 36px",
                        boxShadow: "0 2px 16px rgba(28,43,74,0.04)",
                    }}
                >
                    <span
                        className="text-[10px] font-black uppercase tracking-[0.28em]"
                        style={{ color: "#7A8BA0" }}
                    >
                        Available On
                    </span>

                    <div className="hidden md:block h-5 w-px" style={{ background: "rgba(28,43,74,0.12)" }} />

                    <div className="flex items-center gap-8">
                        <div className="relative w-[120px] h-[46px] opacity-80 hover:opacity-100 transition-opacity duration-300">
                            <Image src="/Logo/amazon.webp" alt="Amazon" fill className="object-contain scale-[1.4]" />
                        </div>
                        <div className="relative w-[120px] h-[46px] opacity-80 hover:opacity-100 transition-opacity duration-300">
                            <Image src="/Logo/FLIPKART_Webp.webp" alt="Flipkart" fill className="object-contain" />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}