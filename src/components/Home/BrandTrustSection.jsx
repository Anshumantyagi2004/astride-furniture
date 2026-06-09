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
                background: "linear-gradient(160deg, #E4E4E7 0%, #D4D4D8 40%, #A1A1AA 100%)",
            }}
        >
            <div className="max-w-7xl mx-auto px-6 py-14 relative z-10">

                {/* Heading */}
                <div className="text-center mb-12">
                    <h2
                        className="text-3xl sm:text-4xl lg:text-[2.8rem] font-black leading-tight tracking-tight text-zinc-900"
                    >
                        India&apos;s Leading{" "}
                        <em
                            className="not-italic font-light"
                            style={{
                                background: "linear-gradient(135deg, #71717A, #18181B)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            Ergonomic Chair
                        </em>{" "}
                        Brand
                    </h2>

                    <div className="flex items-center justify-center gap-3 mt-5">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-zinc-500/40" />
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-500/50" />
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-zinc-500/40" />
                    </div>
                </div>

                {/* Stats — no cards, clean editorial row */}
                <div
                    className="grid grid-cols-2 md:grid-cols-4 mb-10"
                    style={{
                        background: "rgba(255,255,255,0.92)",
                        borderRadius: "20px",
                        border: "1px solid rgba(113,113,122,0.15)",
                        boxShadow: "0 8px 40px rgba(24,24,27,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
                    }}
                >
                    {metrics.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={idx}
                                className={`group flex flex-col items-center justify-center py-10 px-6 cursor-default relative transition-all duration-300 hover:-translate-y-1 ${idx !== metrics.length - 1 ? "border-r border-zinc-900/[0.07]" : ""}`}
                                style={{ borderRadius: idx === 0 ? "20px 0 0 20px" : idx === metrics.length - 1 ? "0 20px 20px 0" : "" }}
                            >
                                {/* Icon */}
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                                    style={{
                                        background: "linear-gradient(135deg, rgba(113,113,122,0.1), rgba(24,24,27,0.15))",
                                        border: "1px solid rgba(113,113,122,0.2)",
                                    }}
                                >
                                    <Icon size={20} strokeWidth={1.75} className="text-zinc-700" />
                                </div>

                                {/* Number */}
                                <h3
                                    className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-2 text-zinc-900"
                                >
                                    <Counter value={item.value} start={inView} />
                                </h3>

                                {/* Label */}
                                <p
                                    className="text-[14px] font-bold uppercase tracking-[0.16em] text-zinc-500 text-center"
                                >
                                    {item.label}
                                </p>

                                {/* Hover underline */}
                                <div
                                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-10 rounded-full transition-all duration-500"
                                    style={{ background: "linear-gradient(90deg, #71717A, #18181B)" }}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Available On */}
                <div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mx-auto max-w-[90%] sm:max-w-[600px] p-4 sm:py-3 sm:px-8"
                    style={{
                        background: "rgba(255,255,255,0.9)",
                        borderRadius: "18px",
                        border: "1px solid rgba(113,113,122,0.12)",
                        boxShadow: "0 2px 16px rgba(24,24,27,0.03)",
                    }}
                >
                    <span
                        className="text-[12px] font-black uppercase tracking-[0.28em] text-zinc-600 whitespace-nowrap"
                    >
                        Available On
                    </span>

                    <div className="hidden sm:block h-6 w-px bg-zinc-300 flex-shrink-0" />

                    <div className="flex items-center gap-6 sm:gap-8">
                        {/* Amazon */}
                        <div className="flex items-center justify-center h-[110px] sm:h-[100px] opacity-85 hover:opacity-100 transition-opacity duration-300">
                            <Image src="/Logo/amazon.webp" alt="Amazon" width={130} height={40} className="object-contain h-full w-auto" />
                        </div>
                        {/* Flipkart */}
                        <div className="flex items-center justify-center h-[40px] sm:h-[38px] opacity-85 hover:opacity-100 transition-opacity duration-300">
                            <Image src="/Logo/FLIPKART_Webp.webp" alt="Flipkart" width={80} height={28} className="object-contain h-full w-auto" />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}