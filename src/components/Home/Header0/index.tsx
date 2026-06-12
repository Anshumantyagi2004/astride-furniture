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
      <section id="circular-chairs" className="relative w-full h-[70vh] min-h-[520px] md:h-[85vh] md:min-h-[600px] overflow-hidden bg-zinc-900">
        <ChairFinder onBack={() => setShowFinder(false)} />
      </section>
    );
  }

  const prefetchProducts = async () => {
    try {
      if (typeof window !== "undefined" && !sessionStorage.getItem("astride_nav_products_cache")) {
        const res = await fetch("/api/product");
        const data = await res.json();
        if (data?.success) {
          sessionStorage.setItem("astride_nav_products_cache", JSON.stringify(data.products));
        }
      }
    } catch (err) {
      console.error("Prefetch error:", err);
    }
  };

  return (
    <section id="circular-chairs" className="relative w-full h-[70vh] min-h-[520px] md:h-[85vh] md:min-h-[600px] overflow-hidden bg-zinc-900">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Png1/main_banner.jpg"
          alt="Main Banner"
          fill
          className="object-cover object-center md:object-center object-[70%_center]"
          priority
        />
      </div>

      {/* Content Overlay */}
      {/* Content Overlay */}
      <div
        className="absolute left-6 sm:left-10 md:left-16 lg:left-24 bottom-[150px] sm:bottom-[165px] md:bottom-[195px] lg:bottom-[235px] z-10 flex flex-wrap gap-4"
        style={{ transform: "translateY(54.5px)" }}
      >
        <Link
          href="/products"
          onMouseEnter={prefetchProducts}
          style={{ transform: "translateY(32px) translateX(-80px) " }} // Move up by 20px
          className="inline-flex items-center justify-center bg-[#131313] hover:bg-[#8B5CF6] text-white font-black px-8 py-3.5 rounded-full shadow-[4px_4px_0_#000] border-[2.5px] border-black hover:shadow-[1px_1px_0_#000] hover:translate-y-[3px] hover:translate-x-[3px] transition-all duration-150 text-xs sm:text-sm tracking-wider uppercase"
        >
          Shop All
          <span className="ml-2 text-base">→</span>
        </Link>

        <button
          onClick={() => setShowFinder(true)}
          style={{ transform: "translateY(34px) translateX(-83px)" }} // Move down by 15px
          className="inline-flex items-center justify-center bg-white hover:bg-zinc-100 text-[#131313] font-black px-8 py-3.5 rounded-full shadow-[4px_4px_0_#000] border-[2.5px] border-black hover:shadow-[1px_1px_0_#000] hover:translate-y-[3px] hover:translate-x-[3px] transition-all duration-150 text-xs sm:text-sm tracking-wider uppercase cursor-pointer animate-none"
        >
          Find Your Chair
          <span className="ml-2 text-base">→</span>
        </button>
      </div>

    </section>
  );
}
