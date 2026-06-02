'use client';

import React, { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface ChairDeal {
  id: number;
  name: string;
  category: 'family' | 'lowest' | 'last-chance';
  description: string;
  originalPrice: number;
  dealPrice: number;
  discountPercentage: number;
  image: string;
  imageSize: string; // Custom size class to ensure all images look perfectly uniform
  tag?: string;
}

const CHAIR_DEALS: ChairDeal[] = [
  {
    id: 1,
    name: 'ASTRIDE ACE',
    category: 'last-chance',
    description: 'Ergonomic high-back premium office task seat, adjustable armrests',
    originalPrice: 44990,
    dealPrice: 29990,
    discountPercentage: 33,
    image: '/Png1/chair4_ACE.webp',
    imageSize: 'w-[68%] h-[68%]',
    tag: 'Top seller'
  },
  {
    id: 2,
    name: 'ASTRIDE AIRSENSE',
    category: 'family',
    description: 'Sleek multi-tension dynamic lumbar support, breathable cloud mesh',
    originalPrice: 26990,
    dealPrice: 18990,
    discountPercentage: 30,
    image: '/Png1/chair5_AIRSENSE.webp',
    imageSize: 'w-[92%] h-[92%]' // Increased to make the image larger
  },
  {
    id: 3,
    name: 'ASTRIDE DELTON',
    category: 'family',
    description: 'Interactive posture adjustment task chair with adaptive neck cradle',
    originalPrice: 32990,
    dealPrice: 24990,
    discountPercentage: 24,
    image: '/Png1/Chair7_Delton.webp',
    imageSize: 'w-[62%] h-[62%]', // Increased to make the image larger
    tag: 'New Offer'
  },
  {
    id: 4,
    name: 'AMICA BLACK',
    category: 'family',
    description: 'Executive premium heavy-duty woven mesh task seat with high backrest',
    originalPrice: 39990,
    dealPrice: 27990,
    discountPercentage: 30,
    image: '/Png1/Chair6a_Amica Black .webp',
    imageSize: 'w-[88%] h-[88%]', // Increased to make the image larger
    tag: 'Popular'
  },
  {
    id: 13,
    name: 'ASTRIDE OCTAVE',
    category: 'family',
    description: 'Sleek multi-tension dynamic lumbar support, breathable cloud mesh signature Octave series',
    originalPrice: 26990,
    dealPrice: 18990,
    discountPercentage: 30,
    image: '/Png1/chair11_octave.webp',
    imageSize: 'w-[68%] h-[68%]' // Increased to make the image larger
  },
  {
    id: 5,
    name: 'ASTRIDE ERIZO',
    category: 'lowest',
    description: 'Luxury handcrafted top-grain leather executive lounge armchair',
    originalPrice: 79990,
    dealPrice: 59990,
    discountPercentage: 25,
    image: '/Png1/chair8_ERIZO.webp',
    imageSize: 'w-[88%] h-[88%]', // Increased to make the image larger
    tag: 'Lowest Price Guarantee'
  },
  {
    id: 6,
    name: 'FITWELL WHITE',
    category: 'lowest',
    description: 'Self-adjusting active tension task support, white chassis mesh',
    originalPrice: 29990,
    dealPrice: 21990,
    discountPercentage: 26,
    image: '/Png1/chair10_FitWell.webp',
    imageSize: 'w-[68%] h-[68%]' // Increased to make the image larger
  },
  {
    id: 7,
    name: 'OCTAVE MESH',
    category: 'lowest',
    description: 'High-ventilation signature ergonomic workspace seat',
    originalPrice: 35990,
    dealPrice: 26990,
    discountPercentage: 25,
    image: '/Png1/chair11_octave.webp',
    imageSize: 'w-[68%] h-[68%]', // Increased to make the image larger
    tag: 'Lowest Price'
  },
  {
    id: 8,
    name: 'ERGOFIT ELITE',
    category: 'lowest',
    description: 'Multi-dimensional structural body adaptive foam cradle chair',
    originalPrice: 42990,
    dealPrice: 31990,
    discountPercentage: 25,
    image: '/Png1/chair12_ErgoFit.webp',
    imageSize: 'w-[68%] h-[68%]' // Increased to make the image larger
  },
  {
    id: 9,
    name: 'RAPID BLACK',
    category: 'last-chance',
    description: 'Instant response ergonomic active response carbon racing cockpit',
    originalPrice: 49990,
    dealPrice: 34990,
    discountPercentage: 30,
    image: '/Png1/chair6c_Rapid Black .webp',
    imageSize: 'w-[68%] h-[68%]', // Increased to make the image larger
    tag: 'Last 5 items left'
  },
  {
    id: 10,
    name: 'GLADUS GREY',
    category: 'last-chance',
    description: 'Sleek premium hybrid suede high-back active office lounge chair',
    originalPrice: 39990,
    dealPrice: 28990,
    discountPercentage: 27,
    image: '/Png1/Chair6b_Gladus Grey.webp',
    imageSize: 'w-[68%] h-[68%]', // Increased to make the image larger
    tag: 'Selling Fast'
  },
  {
    id: 11,
    name: 'ALPHA GREY',
    category: 'last-chance',
    description: 'Premium composite micro-weave smart tension task chair',
    originalPrice: 45990,
    dealPrice: 31990,
    discountPercentage: 30,
    image: '/Png1/chair6_AlphaGrey.webp',
    imageSize: 'w-[68%] h-[68%]' // Increased to make the image larger
  },
  {
    id: 12,
    name: 'FITWELL ACTIVE',
    category: 'last-chance',
    description: 'Dynamic responsive lumbar backrest active task seat',
    originalPrice: 29990,
    dealPrice: 19990,
    discountPercentage: 33,
    image: '/Png1/chair9_FitWell.webp',
    imageSize: 'w-[68%] h-[68%]', // Increased to make the image larger
    tag: 'Final Clearance'
  }
];

export default function AstrideOffers() {
  const [activeCategory, setActiveCategory] = useState<'family' | 'lowest' | 'last-chance'>('family');
  const [bannerSrc, setBannerSrc] = useState('/Png1/chair12_ErgoFit.webp');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredDeals = CHAIR_DEALS.filter(deal => deal.category === activeCategory);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 285, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -285, behavior: 'smooth' });
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
        
        {/* Component Header Block with Integrated Navigation Arrows */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl md:text-[34px] font-extrabold text-[#111111] tracking-tight">
              Today&apos;s best deals
            </h2>
            {/* Slider Aligned Navigation Controls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={scrollLeft}
                aria-label="Scroll left"
                className="w-10 h-10 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-800 stroke-[2]" />
              </button>
              <button 
                onClick={scrollRight}
                aria-label="Scroll right"
                className="w-10 h-10 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 text-neutral-800 stroke-[2]" />
              </button>
            </div>
          </div>
          
          {/* Pill Selector Filters */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            <button 
              onClick={() => setActiveCategory('family')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeCategory === 'family' 
                  ? 'bg-white text-black border-2 border-black font-extrabold shadow-sm' 
                  : 'bg-[#F5F5F5] hover:bg-neutral-200 text-neutral-800 border border-transparent font-semibold'
              }`}
            >
              Astride Family offers
            </button>
            <button 
              onClick={() => setActiveCategory('lowest')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeCategory === 'lowest' 
                  ? 'bg-white text-black border-2 border-black font-extrabold shadow-sm' 
                  : 'bg-[#F5F5F5] hover:bg-neutral-200 text-neutral-800 border border-transparent font-semibold'
              }`}
            >
              Our lowest price
            </button>
            <button 
              onClick={() => setActiveCategory('last-chance')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeCategory === 'last-chance' 
                  ? 'bg-white text-black border-2 border-black font-extrabold shadow-sm' 
                  : 'bg-[#F5F5F5] hover:bg-neutral-200 text-neutral-800 border border-transparent font-semibold'
              }`}
            >
              Last chance
            </button>
          </div>
        </div>

        {/* Dynamic Deals Layout Panel */}
        <div className="w-full relative">
          
          {/* Aligned Horizontal Product & Banner Container perfectly calculated for exactly 3 cards + 1 blue card visible on desktop */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory items-stretch pr-[calc(50%+12px)] md:pr-[calc(33.333%+8px)] lg:pr-[calc(25%+6px)] scroll-pl-6 scroll-pr-[calc(50%+12px)] md:scroll-pr-[calc(33.333%+8px)] lg:scroll-pr-[calc(25%+6px)]"
          >
            {filteredDeals.map((deal) => {
              const savings = deal.originalPrice - deal.dealPrice;

              return (
                <div 
                  key={deal.id}
                  className="w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] h-[340px] shrink-0 flex flex-col justify-between bg-white rounded-lg p-3 snap-start group relative border border-neutral-100/50 hover:border-neutral-200 hover:shadow-md transition-all duration-300"
                >
                  
                  <div>
                    {/* Top Image Container - Shorter Aspect Ratio */}
                    <div className="relative w-full aspect-[4/2.6] bg-neutral-50 rounded-md flex items-center justify-center p-3 mb-3 group-hover:bg-neutral-100/70 transition-colors duration-300">
                      {/* Tag Badge */}
                      {deal.tag && (
                        <span className="absolute top-2 left-2 bg-[#D11243] text-white text-[9px] font-black tracking-wider px-2 py-0.5 uppercase rounded-sm z-10">
                          {deal.tag}
                        </span>
                      )}
                      
                      {/* Inner wrapper uses fixed uniform sizes to ensure all images look perfectly identical */}
                      <div className="relative transform group-hover:scale-105 transition-transform duration-500 ease-out flex items-center justify-center w-[85%] h-[85%]">
                        <img 
                          src={deal.image} 
                          alt={deal.name} 
                          className="w-full h-full object-contain drop-shadow-md"
                        />
                      </div>
                    </div>

                    {/* Product Info Block (Clean Minimal Design) */}
                    <div className="flex flex-col gap-1">
                      <h3 className="font-extrabold text-[#111111] text-[14px] tracking-wider font-sans group-hover:underline decoration-black decoration-1.5 underline-offset-2 mb-1 truncate">
                        {deal.name}
                      </h3>
                      
                      <p className="text-neutral-500 text-[11px] font-serif leading-relaxed line-clamp-2 min-h-[32px] max-h-[32px] overflow-hidden">
                        {deal.description}
                      </p>
                    </div>
                  </div>

                  {/* Pricing Block - Sitting statically at the absolute bottom because of justify-between and fixed height */}
                  <div className="flex flex-col gap-0.5 mt-auto pt-2 border-t border-neutral-50">
                    <div className="flex items-baseline gap-1 text-[#111111]">
                      <span className="text-xs font-bold font-sans">Rs.</span>
                      <span className="text-2xl font-black tracking-tight">{deal.dealPrice.toLocaleString()}</span>
                    </div>
                    
                    <div className="text-[12px] font-bold text-[#D11243] tracking-wide">
                      {deal.discountPercentage}% off, save Rs. {savings.toLocaleString()}
                    </div>
                    
                    <div className="text-[11px] text-neutral-400 font-semibold mt-0.5">
                      Original Price: Rs. {deal.originalPrice.toLocaleString()}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Fixed Right Blue Card - Positioned Absolutely over the sliding track so cards slide underneath it */}
          <div className="absolute right-0 top-0 h-[340px] w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] bg-[#0058A3] rounded-lg overflow-hidden flex flex-col justify-between shadow-2xl z-20 text-white border border-[#0058A3]">
            {/* Banner Promotional Image Area - Fixed height to prevent pushing button out */}
            <div className="relative w-full h-[130px] shrink-0 bg-[#004e92] flex items-center justify-center p-3">
              <div className="relative w-[50%] h-[50%] flex items-center justify-center">
                <img 
                  src={bannerSrc} 
                  alt="Astride Family offers" 
                  className="w-full h-full object-contain drop-shadow-md scale-95 transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>

            {/* Banner Content with beautiful bottom padding */}
            <div className="p-4 pb-4 flex flex-col justify-between flex-grow gap-3">
              <div className="flex flex-col gap-1.5">
                <h4 className="text-white text-xl font-extrabold tracking-tight underline decoration-white decoration-2 underline-offset-4 cursor-pointer hover:text-neutral-100 transition-colors">
                  Astride Family offers
                </h4>
                
                <p className="text-neutral-100 text-[11px] leading-relaxed font-semibold">
                  Every saving helps. Get more for less with Astride Family member discounts on premium ergonomic products across the entire range.
                </p>
              </div>
              
              <button className="w-full mt-auto bg-white hover:bg-neutral-100 text-black font-extrabold text-xs tracking-wider py-2.5 rounded-full transition-all duration-300 uppercase shadow-md active:scale-95 cursor-pointer">
                JOIN FAMILY CLUB
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
