"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo, memo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";

const ALL_CHAIRS = [
  { src: "/Png1/chair12_ErgoFit.webp", name: "ErgoFit Premium", price: 1299, slug: "chair12-ergofit" },
  { src: "/Png1/Chair7_Delton.webp", name: "Delton Pro", price: 1099, slug: "chair7-delton" },
  { src: "/Png1/img1 (1).webp", name: "Classic Comfort", price: 899, slug: "chair6a-amica-black" },
  { src: "/Png1/chair4_ACE.webp", name: "ACE Task", price: 799, slug: "chair4-ace" },
  { src: "/Png1/chair5_AIRSENSE.webp", name: "AirSense", price: 749, slug: "chair5-airsense" },
  { src: "/Png1/chair6_AlphaGrey.webp", name: "Alpha Grey", price: 699, slug: "chair6-alphagrey" },
  { src: "/Png1/Chair6a_Amica Black .webp", name: "Amica Black", price: 649, slug: "chair6a-amica-black" },
  { src: "/Png1/Chair6b_Gladus Grey.webp", name: "Gladus Grey", price: 599, slug: "chair6b-gladus-grey" },
  { src: "/Png1/chair6c_Rapid Black .webp", name: "Rapid Black", price: 549, slug: "chair6c-rapid-black" },
  { src: "/Png1/chair8_ERIZO.webp", name: "Erizo Mesh", price: 499, slug: "chair8-erizo" },
  { src: "/Png1/chair9_FitWell.webp", name: "FitWell Basic", price: 399, slug: "chair9-fitwell" },
  { src: "/Png1/chair10_FitWell.webp", name: "FitWell Pro", price: 449, slug: "chair10-fitwell" },
  { src: "/Png1/chair11_octave.webp", name: "Octave Studio", price: 299, slug: "chair11-octave" },
].sort((a, b) => b.price - a.price);

function getPosition(index: number, visibleCount: number, maxCount: number, isMobile: boolean) {
  const isVisible = index < visibleCount;
  const effectiveTotal = isVisible ? visibleCount : maxCount;

  if (effectiveTotal === 1) return { left: "50%", top: "45%", scale: isMobile ? 0.9 : 1.1, zIndex: 100 };

  if (effectiveTotal === 2) {
    return {
      left: index === 0 ? (isMobile ? "30%" : "35%") : (isMobile ? "70%" : "65%"),
      top: "45%",
      scale: isMobile ? 0.75 : 0.9,
      zIndex: 100 - index,
    };
  }

  if (effectiveTotal === 3) {
    if (isMobile) {
      if (index === 0) return { left: "20%", top: "45%", scale: 0.65, zIndex: 90 };
      if (index === 1) return { left: "50%", top: "45%", scale: 0.75, zIndex: 100 };
      if (index === 2) return { left: "80%", top: "45%", scale: 0.65, zIndex: 90 };
    } else {
      if (index === 0) return { left: "50%", top: "60%", scale: 0.95, zIndex: 100 };
      if (index === 1) return { left: "25%", top: "35%", scale: 0.8, zIndex: 90 };
      if (index === 2) return { left: "75%", top: "35%", scale: 0.8, zIndex: 90 };
    }
  }

  const columns = isMobile ? 4 : 5;
  const row = Math.floor(index / columns);
  const col = index % columns;
  const itemsInRow = Math.min(columns, effectiveTotal - row * columns);
  const colOffset = (columns - itemsInRow) / 2;

  const left = isMobile ? `${12.5 + (col + colOffset) * 25}%` : `${15 + (col + colOffset) * 17.5}%`; 
  const top = isMobile ? `${20 + row * 20}%` : `${20 + row * 30}%`;
  const scale = isMobile ? 0.55 : 0.475;

  return { left, top, scale, zIndex: 100 - index };
}

const ChairCard = memo(({ chair, left, top, scale, zIndex, isVisible, index }: { 
  chair: any, left: string, top: string, scale: number, zIndex: number, isVisible: boolean, index: number 
}) => {
  const detailUrl = chair.slug ? `/products/${chair.slug}` : `/products`;

  return (
    <div
      className="absolute w-[150px] h-[150px] md:w-[250px] md:h-[250px]"
      style={{
        left,
        top,
        transform: `translate3d(-50%, -50%, 0) scale(${isVisible ? scale : 0.85})`,
        opacity: isVisible ? 1 : 0,
        zIndex,
        pointerEvents: isVisible ? "auto" : "none",
        transition: "left 0.7s cubic-bezier(0.16, 1, 0.3, 1), top 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <Link href={detailUrl} className="relative block w-full h-full cursor-pointer hover:scale-105 transition-transform duration-300">
        <Image
          src={chair.src}
          alt={chair.name}
          fill
          sizes="(max-width: 768px) 150px, 250px"
          priority={index < 8} 
          className="object-contain drop-shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
        />
      </Link>
    </div>
  );
});
ChairCard.displayName = "ChairCard";

const ChairGrid = memo(({ chairs, visibleCount, isMobile }: { chairs: any[], visibleCount: number, isMobile: boolean }) => {
  const maxCount = chairs.length;
  
  const positions = useMemo(() => {
    const totalVisible = Math.max(1, visibleCount);
    return chairs.map((_, index) => getPosition(index, totalVisible, maxCount, isMobile));
  }, [maxCount, visibleCount, isMobile]);

  return (
    <motion.div
      key="still-grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full h-full mx-auto"
    >
      {chairs.map((chair, index) => (
        <ChairCard 
          key={chair.name} 
          chair={chair} 
          left={positions[index].left}
          top={positions[index].top}
          scale={positions[index].scale}
          zIndex={positions[index].zIndex}
          isVisible={index < visibleCount} 
          index={index} 
        />
      ))}
    </motion.div>
  );
});
ChairGrid.displayName = "ChairGrid";

interface ChairFinderProps {
  onBack: () => void;
}

export default function ChairFinder({ onBack }: ChairFinderProps) {
  const [chairs, setChairs] = useState<any[]>(ALL_CHAIRS);
  
  const [visibleCount, setVisibleCount] = useState(ALL_CHAIRS.length);
  const visibleCountRef = useRef(ALL_CHAIRS.length);

  const [isMobile, setIsMobile] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const fillRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  
  const activePointer = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const cached = sessionStorage.getItem("astride_nav_products_cache");
        let productsData;
        if (cached) {
          productsData = JSON.parse(cached);
        } else {
          const res = await fetch("/api/product");
          const json = await res.json();
          if (json.success) {
            productsData = json.products;
            sessionStorage.setItem("astride_nav_products_cache", JSON.stringify(productsData));
          }
        }

        if (productsData && productsData.length > 0) {
          const mapped = productsData.map((p: any) => {
            const firstImg = p.images?.[0];
            const src = (typeof firstImg === 'string' ? firstImg : firstImg?.url) || p.colorVariants?.[0]?.images?.[0]?.url || "/placeholder.png";
            return { src, name: p.productName, price: p.realPrice || 0, slug: p.slug || p._id };
          }).sort((a: any, b: any) => b.price - a.price);
          
          setChairs(mapped);
          setVisibleCount(mapped.length);
          visibleCountRef.current = mapped.length;
        }
      } catch (err) {
        console.error("Error loading products for ChairFinder:", err);
      }
    };
    fetchProducts();
  }, []);

  const { row1, row2, row3 } = useMemo(() => {
    return {
      row1: chairs.length >= 5 ? [...chairs.slice(0, 5), ...chairs.slice(0, 5)] : [...chairs, ...chairs],
      row2: chairs.length >= 10 ? [...chairs.slice(5, 10), ...chairs.slice(5, 10)] : [...chairs, ...chairs],
      row3: chairs.length >= 10 ? [...chairs.slice(10), ...chairs.slice(10)] : [...chairs, ...chairs],
    };
  }, [chairs]);

  const updateSliderFromEvent = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = x / rect.width;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    
    rafRef.current = requestAnimationFrame(() => {
      // GPU-accelerated direct DOM mutations (Zero Layout Thrashing)
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${percentage})`;
      if (thumbRef.current) thumbRef.current.style.transform = `translate3d(${x - 12}px, -50%, 0)`;

      const newVisibleCount = Math.max(1, Math.ceil(chairs.length * (1 - percentage)));
      
      if (newVisibleCount !== visibleCountRef.current) {
        visibleCountRef.current = newVisibleCount;
        setVisibleCount(newVisibleCount);
      }
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointer.current !== null) return;
    activePointer.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    if (!isTouched) setIsTouched(true);
    
    if (thumbRef.current) {
      thumbRef.current.style.transition = 'transform 0.1s cubic-bezier(0.16, 1, 0.3, 1)';
    }
    
    updateSliderFromEvent(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== activePointer.current) return;
    
    if (thumbRef.current) {
      thumbRef.current.style.transition = 'none';
    }
    
    updateSliderFromEvent(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== activePointer.current) return;
    activePointer.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="absolute inset-0 z-[999] w-full h-full bg-[#f5f5f7] flex flex-col overflow-hidden pt-[10px] px-[10px]">
      
      <button
        onClick={onBack}
        className="absolute top-6 right-6 z-[100] w-12 h-12 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-gray-500 hover:text-gray-900 shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-gray-200/50 transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Close and go back"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isTouched ? (
            <motion.div
              key="moving-swiper"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full flex flex-col justify-center gap-4 md:gap-8 mx-auto py-8"
            >
              <div className="text-center mb-2 px-4">
                <span className="text-zinc-500 text-[10px] tracking-widest uppercase block mb-1">Interactive Discovery</span>
                <h2 className="text-gray-900 text-2xl md:text-3xl font-serif font-bold uppercase tracking-tight">Slide sitting time to find your perfect chair</h2>
              </div>
              
              <div className="w-full overflow-hidden">
                <Swiper modules={[Autoplay]} slidesPerView={isMobile ? 4 : 5} spaceBetween={15} loop={true} speed={5000} autoplay={{ delay: 0, disableOnInteraction: false }} allowTouchMove={false} className="pointer-events-none [&_.swiper-wrapper]:!ease-linear">
                  {row1.map((chair, idx) => (
                    <SwiperSlide key={`r1-${idx}`} className="flex justify-center items-center">
                      <Image src={chair.src} alt={chair.name} width={180} height={180} className="w-[80px] h-[80px] md:w-[130px] md:h-[130px] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.06)]" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="w-full overflow-hidden">
                <Swiper modules={[Autoplay]} slidesPerView={isMobile ? 4 : 5} spaceBetween={15} loop={true} speed={5000} autoplay={{ delay: 0, disableOnInteraction: false, reverseDirection: true }} allowTouchMove={false} className="pointer-events-none [&_.swiper-wrapper]:!ease-linear">
                  {row2.map((chair, idx) => (
                    <SwiperSlide key={`r2-${idx}`} className="flex justify-center items-center">
                      <Image src={chair.src} alt={chair.name} width={180} height={180} className="w-[80px] h-[80px] md:w-[130px] md:h-[130px] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.06)]" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="w-full overflow-hidden">
                <Swiper modules={[Autoplay]} slidesPerView={isMobile ? 4 : 5} spaceBetween={15} loop={true} speed={5000} autoplay={{ delay: 0, disableOnInteraction: false }} allowTouchMove={false} className="pointer-events-none [&_.swiper-wrapper]:!ease-linear">
                  {row3.map((chair, idx) => (
                    <SwiperSlide key={`r3-${idx}`} className="flex justify-center items-center">
                      <Image src={chair.src} alt={chair.name} width={180} height={180} className="w-[80px] h-[80px] md:w-[130px] md:h-[130px] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.06)]" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </motion.div>
          ) : (
            <ChairGrid chairs={chairs} visibleCount={visibleCount} isMobile={isMobile} />
          )}
        </AnimatePresence>
      </div>

      <div className="w-full flex justify-center pb-10 sm:pb-8 px-4 relative z-50">
        <div className="w-full max-w-[480px] bg-white/80 backdrop-blur-2xl rounded-[24px] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.1)] border border-white/40 px-6 py-5 flex flex-col gap-4">
          
          <div className="w-full">
            <div 
              ref={trackRef}
              className="relative w-full h-10 flex items-center cursor-pointer select-none touch-none group"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{ touchAction: "none" }}
            >
              <div className="absolute left-0 right-0 h-2.5 bg-gray-200/60 rounded-full overflow-hidden pointer-events-none inset-0 my-auto shadow-inner">
                <div
                  ref={fillRef}
                  className="h-full w-full rounded-full transition-none will-change-transform"
                  style={{ transform: "scaleX(0)", transformOrigin: "left", background: "#8e95a0" }}
                />
              </div>
              
              <div
                ref={thumbRef}
                className="absolute top-1/2 left-0 w-7 h-7 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] pointer-events-none border-[3.5px] border-[#8e95a0] transition-none will-change-transform group-active:scale-95 duration-200"
                style={{ transform: "translate3d(-14px, -50%, 0)" }}
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200/60 transition-all duration-300 text-gray-500 hover:text-gray-800 active:scale-90 shadow-sm"
              aria-label="Go back"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span className="text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase pointer-events-none">
              Adjust Sitting Time
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}