"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion, Variants } from "framer-motion";
import ChairFinder from "../ChairFinder";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 140,
    },
  },
};

export default function Header0() {
  const [showFinder, setShowFinder] = useState(false);

  useEffect(() => {
    const handleUrlCheck = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("finder") === "true") {
        setShowFinder(true);
      }
    };

    handleUrlCheck();

    const handleOpenEvent = () => {
      setShowFinder(true);
    };

    window.addEventListener("open-chair-finder", handleOpenEvent);
    return () => {
      window.removeEventListener("open-chair-finder", handleOpenEvent);
    };
  }, []);

  if (showFinder) {
    return (
      <section id="circular-chairs" className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-zinc-900">
        <ChairFinder onBack={() => setShowFinder(false)} />
      </section>
    );
  }

  return (
    <section className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-zinc-900">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Png/main_banner.png"
          alt="Main Banner"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full max-w-[1500px] mx-auto px-4 md:px-12 lg:px-16 flex flex-col justify-center">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl text-white mb-10 md:mb-16"
        >
          <motion.span 
            variants={itemVariants}
            className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase mb-4 block text-white/60"
          >
            <span className="text-white font-extrabold mr-2 tracking-[0.25em] bg-white/10 px-2 py-0.5 rounded border border-white/20">
              ASTRIDE
            </span> 
            CHAIR COLLECTION
          </motion.span>
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-serif mb-6 tracking-tight leading-[1.1] max-w-2xl md:max-w-3xl"
          >
            Sit Better, Perform Better
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl font-light text-white/90 leading-relaxed mb-10 max-w-md"
          >
            Discover ergonomic office chairs and advanced gaming chairs crafted for all-day comfort. Enhance your workspace and gaming zone with durable, stylish seating solutions.
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <Link href="/products" className="group inline-flex items-center relative h-14">
              <div className="absolute left-0 w-14 h-14 rounded-full border border-white/50 group-hover:scale-110 group-hover:bg-white/10 flex items-center justify-center transition-all duration-500">
                <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
              </div>
              <span className="pl-20 pr-6 text-sm font-semibold tracking-widest uppercase text-white group-hover:translate-x-2 transition-transform duration-500">
                View Collection
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Pagination */}
      
    </section>
  );
}
