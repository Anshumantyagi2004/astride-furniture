"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Armchair,
    HeartHandshake,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

export default function WhyUs() {

    const features = [
        {
            icon: <ShieldCheck size={28} strokeWidth={2.2} />,
            title: "Premium Quality",
            desc: "Crafted using durable premium materials with modern finishing and long-lasting comfort.",
        },
        {
            icon: <HeartHandshake size={28} strokeWidth={2.2} />,
            title: "Trusted By Customers",
            desc: "Loved by thousands of customers for elegant design, comfort, and everyday usability.",
        },
        {
            icon: <Sparkles size={28} strokeWidth={2.2} />,
            title: "Luxury Aesthetics",
            desc: "Minimal modern styling designed to elevate every workspace and interior effortlessly.",
        },
        {
            icon: <Armchair size={28} strokeWidth={2.2} />,
            title: "Ergonomic Comfort",
            desc: "Smart ergonomic support that improves posture and reduces fatigue during long hours.",
        },
    ];

    return (
        <section className="relative py-10 bg-[#F8F5F1] overflow-hidden">

            {/* BACKGROUND */}
            <div className="absolute inset-0 overflow-hidden">

                <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-[#FF6D29]/10 blur-[120px] rounded-full"></div>

                <div className="absolute bottom-[-100px] right-[-100px] w-[320px] h-[320px] bg-[#453027]/10 blur-[120px] rounded-full"></div>

            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-0">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto"
                >

                    <span
                        className="
              text-[#FF6D29]
              text-
              font-bold
              tracking-[0.18em]
              uppercase
            "
                    >
                        Why Choose Us
                    </span>

                    <h2 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#161316] leading-[1.1]">
                        Designed For
                        <span className="text-[#FF6D29]"> Modern Living</span>
                    </h2>

                    <p className="mt-4 text-[#6B7280] text-base sm:text-lg leading-relaxed">
                        We combine premium craftsmanship, ergonomic comfort,
                        and contemporary aesthetics to create chairs that
                        enhance both productivity and lifestyle.
                    </p>
                </motion.div>

                {/* FEATURE CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">

                    {features.map((item, index) => (

                        <motion.div
                            key={index}
                            initial={{
                                opacity: 0,
                                y: 50,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            // transition={{
                            //     duration: 0.2,
                            //     delay: index * 0.2,
                            // }}
                            viewport={{ once: true }}
                            whileHover={{
                                y: -10,
                            }}
                            className="
                group
                relative
                rounded-[30px]
                border
                border-[#E8DDD5]
                bg-white/80
                backdrop-blur-xl
                p-8
                overflow-hidden
                transition-all
                duration-500
                hover:border-[#FF6D29]
                hover:shadow-[0_20px_60px_rgba(255,109,41,0.12)]
              "
                        >

                            {/* TOP NUMBER */}
                            <span
                                className="
                  absolute
                  top-10
                  right-10
                  text-5xl
                  font-semibold
                  text-[#161316]/50
                  group-hover:text-[#FF6D29]/100

                  transition-all
                  duration-500
                "
                            >
                                {index + 1}
                            </span>

                            {/* ICON */}
                            <div
                                className="
                  relative
                  w-16
                  h-16
                  rounded-2xl
                  bg-[#FFF1EA]
                  border
                  border-[#FFD8C7]
                  flex
                  items-center
                  justify-center
                  text-[#FF6D29]
                  transition-all
                  duration-500
                  group-hover:bg-[#FF6D29]
                  group-hover:text-white
                  group-hover:scale-110
                "
                            >

                                <div className="absolute inset-0 rounded-2xl bg-[#FF6D29]/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                                <div className="relative z-10">
                                    {item.icon}
                                </div>
                            </div>

                            {/* CONTENT */}
                            <div className="mt-8 relative z-10">

                                <h3 className="text-2xl font-semibold text-[#161316] leading-snug">
                                    {item.title}
                                </h3>

                                <p className="mt-4 text-[#6B7280] leading-relaxed text-[15px]">
                                    {item.desc}
                                </p>

                            </div>

                            {/* BOTTOM BAR */}
                            <div
                                className="
                  absolute
                  bottom-0
                  left-0
                  h-[3px]
                  w-0
                  bg-[#FF6D29]
                  group-hover:w-full
                  transition-all
                  duration-500
                "
                            ></div>

                            {/* HOVER GLOW */}
                            <div
                                className="
                  absolute
                  -bottom-20
                  -right-20
                  w-40
                  h-40
                  bg-[#FF6D29]/10
                  blur-3xl
                  opacity-0
                  group-hover:opacity-100
                  transition-all
                  duration-700
                "
                            ></div>

                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}