'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Loader from '../../ui/loader';

export default function AstrideOffers() {
  const [productsList, setProductsList] = useState<any[]>([]);
  const [bannerSrc, setBannerSrc] = useState('/Png1/chair12_ErgoFit.webp');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/product");
        const data = await res.json();
        if (data.success && data.products && data.products.length > 0) {
          // Filter to only products with multiple images
          const filtered = data.products.filter((prod: any) => {
            const colorImages = prod.colorVariants?.reduce((acc: string[], variant: any) => {
              if (variant.images) {
                return [...acc, ...variant.images.map((img: any) => img.url)];
              }
              return acc;
            }, []) || [];
            const rootImages = prod.images ? prod.images.map((img: any) => img.url || img) : [];
            const allImages = Array.from(new Set([...rootImages, ...colorImages]));
            return allImages.length > 1; // Products which have multiple images
          });

          const mappedProducts = filtered.map((prod: any, idx: number) => {
            const blackVariant = prod.colorVariants?.find((v: any) => v.colorName?.toLowerCase() === "black");
            const blackImage = blackVariant?.images?.[0]?.url;
            const fallbackImage = prod.colorVariants?.find((v: any) => v.images && v.images.length > 0)?.images?.[0]?.url;
            const fallbackRoot = prod.images?.[0]?.url || prod.images?.[0];
            
            const mainImage = blackImage || fallbackImage || fallbackRoot || "/Png1/chair12_ErgoFit.webp";
            const originalPrice = prod.oldPrice || (prod.realPrice ? Math.floor(prod.realPrice * 1.5) : 29990);
            const dealPrice = prod.realPrice || 18990;
            const savings = originalPrice - dealPrice;
            const discountPercentage = Math.round((savings / originalPrice) * 100);

            return {
              id: prod._id || idx.toString(),
              name: prod.productName,
              description: prod.description || "Ergonomic workspace seating solution with dynamic support.",
              originalPrice,
              dealPrice,
              savings,
              discountPercentage,
              image: mainImage,
              tag: idx % 3 === 0 ? "Top seller" : (idx % 4 === 0 ? "Selling Fast" : null)
            };
          });

          setProductsList(mappedProducts.slice(0, 10));
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    }
    fetchProducts();
  }, []);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="w-full bg-[#FFFFFF] py-16 px-6 md:px-12 lg:px-20 overflow-hidden"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}
    >
      <div className="max-w-[1440px] mx-auto flex flex-col gap-8">
        
        {/* Component Header Block */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl md:text-[34px] font-extrabold text-[#111111] tracking-tight">
              Today&apos;s best deals
            </h2>
            {/* Slider Navigation Controls with Neo-Brutalist styling */}
            <div className="flex items-center gap-2">
              <button 
                onClick={scrollLeft}
                aria-label="Scroll left"
                className="w-10 h-10 bg-[#DCF351] hover:bg-[#c9e13b] border-2 border-[#131313] rounded-full flex items-center justify-center shadow-[3px_3px_0_#131313] active:translate-y-[2px] active:shadow-[1px_1px_0_#131313] transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-800 stroke-[3]" />
              </button>
              <button 
                onClick={scrollRight}
                aria-label="Scroll right"
                className="w-10 h-10 bg-[#DCF351] hover:bg-[#c9e13b] border-2 border-[#131313] rounded-full flex items-center justify-center shadow-[3px_3px_0_#131313] active:translate-y-[2px] active:shadow-[1px_1px_0_#131313] transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 text-neutral-800 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Deals Layout Panel */}
        <div className="w-full relative min-h-[460px]">
          
          {productsList.length === 0 ? (
            <div className="h-[460px] mr-[calc(50%+12px)] md:mr-[calc(33.333%+8px)] lg:mr-[calc(25%+6px)] flex items-center justify-center bg-[#f4f4f5] rounded-[14px] border-[2.5px] border-[#131313] shadow-[5px_5px_0_#131313]">
              <Loader />
            </div>
          ) : (
            /* Slider Container */
            <div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory items-stretch pr-[calc(50%+12px)] md:pr-[calc(33.333%+8px)] lg:pr-[calc(25%+6px)] scroll-pl-6 scroll-pr-[calc(50%+12px)] md:scroll-pr-[calc(33.333%+8px)] lg:scroll-pr-[calc(25%+6px)]"
            >
              {productsList.map((deal) => {
                return (
                  <Link 
                    key={deal.id}
                    href={`/products/${deal.id}`}
                    className="w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] h-[460px] shrink-0 flex flex-col justify-between bg-white rounded-[14px] p-4 snap-start group relative border-[2.5px] border-[#131313] shadow-[5px_5px_0_#131313] hover:-translate-y-1 hover:shadow-[8px_8px_0_#131313] transition-all duration-300"
                  >
                    
                    <div>
                      {/* Top Image Container */}
                      <div className="relative w-full h-[220px] bg-[#f4f4f5] rounded-[10px] border-2 border-transparent group-hover:border-[#131313] flex items-center justify-center p-3 mb-4 transition-all duration-300 overflow-hidden">
                        {/* Tag Badge */}
                        {deal.tag && (
                          <span className="absolute top-3 left-3 bg-[#EC4899] text-white text-[10px] font-black tracking-wider px-2.5 py-1 uppercase rounded-sm z-10 border border-[#131313] shadow-[2px_2px_0_#131313]">
                            {deal.tag}
                          </span>
                        )}
                        
                        <div className="relative transform group-hover:scale-110 transition-transform duration-500 ease-out flex items-center justify-center w-[95%] h-[95%]">
                          <img 
                            src={deal.image} 
                            alt={deal.name} 
                            className="w-full h-full object-contain drop-shadow-xl"
                          />
                        </div>
                      </div>

                      {/* Product Info Block */}
                      <div className="flex flex-col gap-1.5">
                        <h3 className="font-extrabold text-[#111111] text-[16px] tracking-wide font-sans mb-1 truncate uppercase">
                          {deal.name}
                        </h3>
                        
                        <p className="text-neutral-600 text-[12px] leading-relaxed line-clamp-2 min-h-[36px] max-h-[36px] overflow-hidden">
                          {deal.description}
                        </p>
                      </div>
                    </div>

                    {/* Pricing Block */}
                    <div className="flex flex-col gap-1 mt-auto pt-3 border-t-2 border-dashed border-neutral-200">
                      <div className="flex items-baseline gap-1 text-[#111111]">
                        <span className="text-sm font-bold font-sans">Rs.</span>
                        <span className="text-[28px] font-black tracking-tight">{deal.dealPrice.toLocaleString()}</span>
                      </div>
                      
                      <div className="text-[13px] font-extrabold text-[#D11243] tracking-wide uppercase">
                        {deal.discountPercentage}% off, save Rs. {deal.savings.toLocaleString()}
                      </div>
                      
                      <div className="text-[12px] text-neutral-500 font-bold mt-0.5 line-through decoration-neutral-400">
                        Original Price: Rs. {deal.originalPrice.toLocaleString()}
                      </div>
                    </div>

                  </Link>
                );
              })}
            </div>
          )}

          {/* Fixed Right Blue Card - Positioned Absolutely over the sliding track so cards slide underneath it */}
          <div className="absolute right-0 top-0 h-[460px] w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] bg-[#0058A3] rounded-[14px] overflow-hidden flex flex-col justify-between z-20 text-white border-[2.5px] border-[#131313] shadow-[6px_6px_0_#131313]">
            {/* Banner Promotional Image Area */}
            <div className="relative w-full h-[180px] shrink-0 bg-[#004e92] border-b-[2.5px] border-[#131313] flex items-center justify-center p-4">
              <div className="relative w-[70%] h-[70%] flex items-center justify-center">
                <img 
                  src={bannerSrc} 
                  alt="Astride Family offers" 
                  className="w-full h-full object-contain drop-shadow-2xl scale-100 transition-transform duration-700 hover:scale-110"
                />
              </div>
            </div>

            {/* Banner Content */}
            <div className="p-5 pb-5 flex flex-col justify-between flex-grow gap-4">
              <div className="flex flex-col gap-2">
                <h4 className="text-white text-[22px] font-extrabold tracking-tight underline decoration-white decoration-[3px] underline-offset-[6px] cursor-pointer hover:text-neutral-100 transition-colors">
                  Astride Family offers
                </h4>
                
                <p className="text-neutral-100 text-[13px] leading-relaxed font-semibold mt-2">
                  Every saving helps. Get more for less with Astride Family member discounts on premium ergonomic products across the entire range.
                </p>
              </div>
              
              <button 
                onClick={() => {
                  const el = document.getElementById('newsletter');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full mt-auto bg-[#DCF351] hover:bg-[#c9e13b] text-[#131313] font-black text-sm tracking-wider py-3.5 rounded-full transition-all duration-300 uppercase border-[2.5px] border-[#131313] shadow-[4px_4px_0_#131313] active:translate-y-[2px] active:shadow-[2px_2px_0_#131313] cursor-pointer"
              >
                JOIN FAMILY CLUB
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
