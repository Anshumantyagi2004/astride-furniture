"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo, memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";

function getPosition(index: number, visibleCount: number, maxCount: number, isMobile: boolean) {
  const isVisible = index < visibleCount;
  const effectiveTotal = isVisible ? visibleCount : maxCount;

  // --- FINAL STAGE PRESENTATION (1-3 Chairs Left) ---
  if (effectiveTotal === 1) {
    return { left: "50vw", top: "38dvh", scale: isMobile ? 1.0 : 1.2, zIndex: 100 };
  }
  
  if (effectiveTotal === 2) {
    return {
      left: index === 0 ? (isMobile ? "30vw" : "38vw") : (isMobile ? "70vw" : "62vw"),
      top: "38dvh",
      scale: isMobile ? 0.8 : 1.0,
      zIndex: 100 - index,
    };
  }
  
  if (effectiveTotal === 3) {
    return {
      left: index === 0 ? (isMobile ? "20vw" : "32vw") : index === 1 ? "50vw" : (isMobile ? "80vw" : "68vw"),
      top: "38dvh",
      // Middle chair is slightly larger and in front
      scale: index === 1 ? (isMobile ? 0.85 : 1.1) : (isMobile ? 0.65 : 0.85),
      zIndex: index === 1 ? 100 : 90,
    };
  }

  // --- STATIC GRID MATH (4+ Chairs) ---
  // Fix: Base ALL layout calculations on 'maxCount' instead of 'effectiveTotal'. 
  // This locks the grid positions in place so they NEVER jump when a row finishes.
  const columns = isMobile ? 5 : 6;
  const row = Math.floor(index / columns);
  const col = index % columns;

  const totalRows = Math.ceil(maxCount / columns);
  const itemsInRow = Math.min(columns, maxCount - row * columns);
  const colOffset = (columns - itemsInRow) / 2;

  // X Axis (left)
  const colWidth = isMobile ? 20 : 16.66;
  const startX = isMobile ? 10 : 8.33; 
  const left = `${startX + (col + colOffset) * colWidth}vw`;

  // Y Axis (top) 
  // Fix: Tighter row spacing and higher start point to ensure it NEVER drops behind the slider
  const rowSpacing = isMobile ? 11 : 14; 
  const totalGridHeight = (totalRows - 1) * rowSpacing;
  
  // Center around 38dvh (higher than true center to account for the bottom slider area)
  let startY = 38 - (totalGridHeight / 2);
  
  // Guardrail so we don't clip into the top header
  if (startY < 12) startY = 12;

  const top = `${startY + row * rowSpacing}dvh`;

  // Fix: Noticeably increased scales for both desktop and mobile
  let scale = isMobile ? 0.52 : 0.6; 
  if (totalRows > 4) {
    scale = isMobile ? 0.45 : 0.52; 
  }

  return { left, top, scale, zIndex: 100 - index };
}

const ChairCard = memo(({ chair, left, top, scale, zIndex, isVisible, index }: { 
  chair: any, left: string, top: string, scale: number, zIndex: number, isVisible: boolean, index: number 
}) => {
  const detailUrl = chair.slug ? `/products/${chair.slug}` : `/products`;

  return (
    <div
      className="absolute top-0 left-0 w-[150px] h-[150px] md:w-[250px] md:h-[250px]"
      style={{
        transform: `translate3d(calc(${left} - 50%), calc(${top} - 50%), 0) scale(${isVisible ? scale : 0.85})`,
        opacity: isVisible ? 1 : 0,
        zIndex,
        pointerEvents: isVisible ? "auto" : "none",
        transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform, opacity"
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
  }, [maxCount, visibleCount, isMobile, chairs]);

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
          key={chair.slug || index} 
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
  const [chairs, setChairs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const cached = sessionStorage.getItem("astride_nav_products_cache");
        let productsData;
        
        if (cached) {
          productsData = JSON.parse(cached);
        } else {
          const res = await fetch("/api/product?t=" + Date.now(), {
            cache: "no-store",
            headers: { "Cache-Control": "no-store, no-cache, must-revalidate" }
          });
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
        }
      } catch (err) {
        console.error("Error loading products for ChairFinder:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const { row1, row2, row3 } = useMemo(() => {
    if (chairs.length === 0) return { row1: [], row2: [], row3: [] };
    
    const third = Math.ceil(chairs.length / 3);
    const p1 = chairs.slice(0, third);
    const p2 = chairs.slice(third, third * 2);
    const p3 = chairs.slice(third * 2);

    return {
      row1: [...p1, ...p1, ...p1], 
      row2: [...p2, ...p2, ...p2],
      row3: [...p3, ...p3, ...p3],
    };
  }, [chairs]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isTouched) setIsTouched(true);
    const rawValue = Number(e.target.value);
    const max = chairs.length;
    setVisibleCount(max - rawValue + 1);
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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 text-gray-400">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-500 rounded-full animate-spin"></div>
            <span className="text-sm font-medium tracking-widest uppercase">Loading Chairs...</span>
          </div>
        ) : (
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
                  <Swiper modules={[Autoplay]} key={`swiper-row1-${row1.length}`} slidesPerView={4} breakpoints={{ 768: { slidesPerView: 6 } }} spaceBetween={15} loop={row1.length > 6 && !isLoading} speed={5000} autoplay={{ delay: 0, disableOnInteraction: false }} allowTouchMove={false} className="pointer-events-none [&_.swiper-wrapper]:!ease-linear">
                    {row1.map((chair, idx) => (
                      <SwiperSlide key={`r1-${idx}`} className="flex justify-center items-center">
                        <Image src={chair.src} alt={chair.name} width={180} height={180} className="w-[80px] h-[80px] md:w-[130px] md:h-[130px] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.06)]" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                <div className="w-full overflow-hidden">
                  <Swiper modules={[Autoplay]} key={`swiper-row2-${row2.length}`} slidesPerView={4} breakpoints={{ 768: { slidesPerView: 6 } }} spaceBetween={15} loop={row2.length > 6 && !isLoading} speed={5000} autoplay={{ delay: 0, disableOnInteraction: false, reverseDirection: true }} allowTouchMove={false} className="pointer-events-none [&_.swiper-wrapper]:!ease-linear">
                    {row2.map((chair, idx) => (
                      <SwiperSlide key={`r2-${idx}`} className="flex justify-center items-center">
                        <Image src={chair.src} alt={chair.name} width={180} height={180} className="w-[80px] h-[80px] md:w-[130px] md:h-[130px] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.06)]" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                <div className="w-full overflow-hidden">
                  <Swiper modules={[Autoplay]} key={`swiper-row3-${row3.length}`} slidesPerView={4} breakpoints={{ 768: { slidesPerView: 6 } }} spaceBetween={15} loop={row3.length > 6 && !isLoading} speed={5000} autoplay={{ delay: 0, disableOnInteraction: false }} allowTouchMove={false} className="pointer-events-none [&_.swiper-wrapper]:!ease-linear">
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
        )}
      </div>

      {!isLoading && chairs.length > 0 && (
        <div className="w-full flex justify-center pb-10 sm:pb-8 px-4 relative z-50">
          <div className="w-full max-w-[480px] bg-white/80 backdrop-blur-2xl rounded-[24px] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.1)] border border-white/40 px-6 py-5 flex flex-col gap-4">
            
            <div className="w-full flex items-center h-10">
              <input
                type="range"
                min={1}
                max={chairs.length}
                value={chairs.length - visibleCount + 1}
                onChange={handleSliderChange}
                onTouchStart={() => setIsTouched(true)}
                onMouseDown={() => setIsTouched(true)}
                className="w-full h-2.5 bg-gray-200/60 rounded-full appearance-none outline-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 
                           [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3.5px] 
                           [&::-webkit-slider-thumb]:border-[#8e95a0] [&::-webkit-slider-thumb]:shadow-[0_4px_16px_rgba(0,0,0,0.2)] 
                           active:[&::-webkit-slider-thumb]:scale-95 [&::-webkit-slider-thumb]:transition-transform
                           
                           [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:h-7 
                           [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3.5px] 
                           [&::-moz-range-thumb]:border-[#8e95a0] [&::-moz-range-thumb]:shadow-[0_4px_16px_rgba(0,0,0,0.2)]
                           active:[&::-moz-range-thumb]:scale-95 [&::-moz-range-thumb]:transition-transform"
              />
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
      )}
    </div>
  );
}