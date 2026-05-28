"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import {
    Trophy,
    ShieldCheck,
    Sparkles,
    Sofa,
} from "lucide-react";

const features = [
    {
        title: "11+ Years Experience",
        icon: Trophy,
    },
    {
        title: "Unmatched Comfort",
        icon: Sofa,
    },
    {
        title: "Sleek Aesthetics",
        icon: Sparkles,
    },
    {
        title: "Quality Products",
        icon: ShieldCheck,
    },
];

export default function MarketplaceReviews() {
    return (
        <section className="w-full py-10 bg-white overflow-hidden">

            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-8">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#161316] leading-tight">
                            India&apos;s Leading
                            <span className="text-[#FF6D29]">
                                {" "}Ergonomic Furniture
                            </span>
                            {" "}Brand
                        </h2>
                    </motion.div>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                    {/* AMAZON */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        // transition={{ duration: 0.2, delay: 0.1 }}
                        whileHover={{
                            y: -8,
                        }}
                        className="
          group
          relative
          bg-white
          border
          border-[#E7DDD5]
          rounded-[28px]
          p-6
          overflow-hidden
          transition-all
          duration-500
          hover:border-[#FF6D29]
          hover:shadow-[0_20px_50px_rgba(255,109,41,0.12)]
          flex
          flex-col
          items-center
          justify-center
        "
                    >

                        {/* TOP GLOW */}
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF6D29] scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                        <div className="relative w-[120px] h-[45px]">

                            <Image
                                src="/Amazon_icon.png"
                                alt="Amazon"
                                fill
                                className="object-contain"
                            />
                        </div>

                        <h3 className="mt-6 text-3xl font-semibold text-[#161316]">
                            55K+
                        </h3>

                        <p className="mt-2 text-sm text-[#FF6D29] font-medium">
                            Orders Delivered
                        </p>

                        {/* GLOW */}
                        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-[#FF6D29]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                    </motion.div>

                    {/* FLIPKART */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        //    transition={{ duration: 0.2, delay: 0.1 }}
                        whileHover={{
                            y: -8,
                        }}
                        className="
          group
          relative
          bg-white
          border
          border-[#E7DDD5]
          rounded-[28px]
          p-6
          overflow-hidden
          transition-all
          duration-500
          hover:border-[#FF6D29]
          hover:shadow-[0_20px_50px_rgba(255,109,41,0.12)]
          flex
          flex-col
          items-center
          justify-center
        "
                    >

                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF6D29] scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                        <div className="relative w-[120px] h-[45px]">

                            <Image
                                src="/Flipkart-Icon-Logo-Small.png"
                                alt="Flipkart"
                                fill
                                className="object-contain"
                            />
                        </div>

                        <h3 className="mt-6 text-3xl font-semibold text-[#161316]">
                            40K+
                        </h3>

                        <p className="mt-2 text-sm text-[#FF6D29] font-medium">
                            Happy Customers
                        </p>

                        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-[#FF6D29]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                    </motion.div>

                    {/* FEATURES */}
                    {features.map((item, index) => {

                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                // transition={{
                                //     duration: 0.3,
                                //     delay: index * 0.05,
                                // }}
                                whileHover={{ y: -8, }}
                                className="
              group
              relative
              bg-white
              border
              border-[#E7DDD5]
              rounded-[28px]
              px-5
              py-7
              overflow-hidden
              transition-all
              duration-500
              hover:border-[#FF6D29]
              hover:shadow-[0_20px_50px_rgba(255,109,41,0.12)]
            "
                            >

                                {/* TOP BAR */}
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF6D29] scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                                {/* ICON */}
                                <div
                                    className="
                  relative
                  z-10
                  w-14
                  h-14
                  rounded-2xl
                  mx-auto
                  bg-[#FFF1EA]
                  border
                  border-[#FFD7C5]
                  text-[#FF6D29]
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-500
                  group-hover:bg-[#FF6D29]
                  group-hover:text-white
                  group-hover:scale-110
                "
                                >
                                    <Icon size={26} />
                                </div>

                                {/* CONTENT */}
                                <div className="relative z-10 mt-6 text-center px-8">

                                    <h3 className="text-lg font-semibold text-[#161316] leading-snug">
                                        {item.title}
                                    </h3>

                                </div>

                                {/* GLOW */}
                                <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-[#FF6D29]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}