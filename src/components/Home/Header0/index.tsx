"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/loader";
import { ChevronRight } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

// const Swiper = dynamic(() => import("swiper/react").then(m => m.Swiper), { ssr: false });
// const SwiperSlide = dynamic(() => import("swiper/react").then(m => m.SwiperSlide), { ssr: false });

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
  const router = useRouter();
  const [showFinder, setShowFinder] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const handleUrlCheck = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("finder") === "true") {
        setShowFinder(true);
        setTimeout(() => {
          const url = new URL(window.location.href);
          url.searchParams.delete("finder");
          window.history.replaceState({}, "", url.pathname + url.search);
        }, 100);
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

  const handleBannerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
  setTimeout(() => {
    router.push("/products");
  }, 150);
  };

  if (showFinder) {
    return (
      <section id="circular-chairs" className="relative w-full h-[60vh] sm:h-[70vh] md:h-[85vh] md:min-h-[600px] overflow-hidden bg-zinc-900">
        <ChairFinder onBack={() => setShowFinder(false)} />
      </section>
    );
  }

  const slides = [
    { src: "/Png1/main_banner.webp", alt: "Main Banner" },
    { src: "/Png1/main_Banner_2.webp", alt: "Secondary Banner" }
  ];

  const mobileSlides = [
    { src: "/Png1/Mobile_banner.webp", alt: "Mobile Banner 1" },
    { src: "/Png1/Mobile_banner2.webp", alt: "Mobile Banner 2" }
  ];

  return (
    <section id="circular-chairs" className="relative w-full h-auto aspect-square md:h-[85vh] md:min-h-[600px] overflow-hidden bg-zinc-900">
      
      {/* Existing UI Loader Overlay */}
      {isNavigating && (
        <div className="absolute inset-0 z-50 bg-[#f8fafc]/90 backdrop-blur-sm flex flex-col items-center justify-center">
          <Loader />
        </div>
      )}

      {/* DESKTOP BANNER CAROUSEL (md and up) */}
      <div className="hidden md:block w-full h-full">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={slides.length > 1}
          className="w-full h-full"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx} className="relative w-full h-full">
              {/* Background Image (Entirely Clickable Link to Products) */}
              <Link 
                href="/products" 
                onClick={handleBannerClick}
                className="relative inset-0 z-0 cursor-pointer block w-full h-full"
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-cover object-center"
                  priority={idx === 0}
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* MOBILE BANNER CAROUSEL (less than md) */}
      <div className="block md:hidden w-full h-full">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={slides.length > 1}
          className="w-full h-full"
        >
          {mobileSlides.map((slide, idx) => (
            <SwiperSlide key={idx} className="relative w-full h-full">
              <Link 
                href="/products" 
                onClick={handleBannerClick}
                className="relative inset-0 z-0 cursor-pointer block w-full h-full"
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  priority={idx === 0}
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
