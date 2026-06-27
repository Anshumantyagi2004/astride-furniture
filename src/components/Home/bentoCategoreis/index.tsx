'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules'; // Switched Navigation to Pagination
import 'swiper/css';
import 'swiper/css/pagination'; // Imported pagination CSS

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
});

interface BentoCategory {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  colSpan: string; 
  imageClass: string; 
  href: string;
  translate?: string; 
}

// Default fallback categories
const DEFAULT_CATEGORIES: BentoCategory[] = [
  {
    id: 1,
    title: 'Gaming Chair',
    subtitle: 'Explore high-performance racing cockpits designed for ultimate lumbar support and game-winning comfort.',
    image: '/Png1/chair11_octave.webp',
    colSpan: 'lg:col-span-8 md:col-span-7 col-span-12',
    imageClass: 'absolute right-2 bottom-0 w-[45%] md:w-[32%] h-[75%] md:h-[80%] transform group-hover:scale-105 transition-transform duration-500 ease-out',
    href: '/products?category=Gaming%20Chair',
    translate: '-translate-y-2 md:-translate-y-3'
  },
  {
    id: 2,
    title: 'Staff Chair',
    subtitle: 'Sleek executive task chairs engineered to maximize posture.',
    image: '/Png1/chair4_ACE.webp',
    colSpan: 'lg:col-span-4 md:col-span-5 col-span-12',
    imageClass: 'absolute right-2 bottom-0 w-[42%] md:w-[35%] h-[75%] md:h-[80%] transform group-hover:scale-105 transition-transform duration-500 ease-out',
    href: '/products?category=Staff%20Chair',
    translate: '-translate-y-4 md:-translate-y-9'
  },
  {
    id: 3,
    title: 'Study Chair',
    subtitle: 'Self-adjusting active tension cradles.',
    image: '/Png1/chair5_AIRSENSE.webp',
    colSpan: 'lg:col-span-4 md:col-span-5 col-span-12',
    imageClass: 'absolute right-2 bottom-0 w-[55%] md:w-[52%] h-[95%] md:h-[110%] transform group-hover:scale-105 transition-transform duration-500 ease-out',
    href: '/products?category=Study%20Chair',
    translate: ''
  },
  {
    id: 4,
    title: 'Bar Stools & Cafe Chair',
    subtitle: 'Elevate your counter experience with premium luxury bar stools and ergonomic counter-height seating.',
    image: '/Png1/chair6c_Rapid Black.webp',
    colSpan: 'lg:col-span-8 md:col-span-7 col-span-12',
    imageClass: 'absolute right-2 bottom-0 w-[48%] md:w-[40%] h-[85%] md:h-[95%] transform group-hover:scale-105 transition-transform duration-500 ease-out',
    href: '/products?category=Bar%20Stools%20%26%20Cafe%20Chair',
    translate: ''
  }
];

export default function BentoCategories() {
  const [categories, setCategories] = useState<BentoCategory[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        // Fetch with cache busting timestamp
        const res = await fetch(`/api/category?t=${Date.now()}`);
        const data = await res.json();
        
        if (data.success && data.categories && data.categories.length > 0) {
          // Map API categories to BentoCategory format
          const mappedCategories = data.categories.map((cat: any, index: number) => {
            // Determine layout and positioning based on index
            const layouts = [
              {
                colSpan: 'lg:col-span-8 md:col-span-7 col-span-12',
                imageClass: 'absolute right-2 bottom-0 w-[45%] md:w-[32%] h-[75%] md:h-[80%] transform group-hover:scale-105 transition-transform duration-500 ease-out',
                translate: '-translate-y-2 md:-translate-y-3'
              },
              {
                colSpan: 'lg:col-span-4 md:col-span-5 col-span-12',
                imageClass: 'absolute right-2 bottom-0 w-[42%] md:w-[35%] h-[75%] md:h-[80%] transform group-hover:scale-105 transition-transform duration-500 ease-out',
                translate: '-translate-y-4 md:-translate-y-9'
              },
              {
                colSpan: 'lg:col-span-4 md:col-span-5 col-span-12',
                imageClass: 'absolute right-2 bottom-0 w-[55%] md:w-[52%] h-[95%] md:h-[110%] transform group-hover:scale-105 transition-transform duration-500 ease-out',
                translate: ''
              },
              {
                colSpan: 'lg:col-span-8 md:col-span-7 col-span-12',
                imageClass: 'absolute right-2 bottom-0 w-[48%] md:w-[40%] h-[85%] md:h-[95%] transform group-hover:scale-105 transition-transform duration-500 ease-out',
                translate: ''
              }
            ];
            
            const layout = layouts[index % layouts.length];
            const categoryImage = cat.categoryImage || DEFAULT_CATEGORIES[index % DEFAULT_CATEGORIES.length].image;
            
            return {
              id: cat._id || index + 1,
              title: cat.name,
              subtitle: cat.description || 'Explore our premium collection.',
              image: categoryImage,
              ...layout,
              href: `/products?category=${encodeURIComponent(cat.name)}`
            };
          });
          
          setCategories(mappedCategories);
        } else {
          setCategories(DEFAULT_CATEGORIES);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories(DEFAULT_CATEGORIES);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCategories();
    
    // Refetch every 10 seconds for new categories
    const interval = setInterval(fetchCategories, 10000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section 
      className={`w-full bg-[#FAFAFA] pt-6 pb-4 px-4 md:pt-8 md:pb-6 md:px-12 lg:px-20 overflow-hidden ${sans.className}`}
    >
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6 md:gap-10">
        
        {/* MOBILE VIEW: Auto-swiping Carousel with Pagination Dots */}
        <div className="block md:hidden relative w-full pt-2 pb-6">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }} // Enabled the dots
            className="w-full h-full px-2 pb-12 !overflow-visible" // Added pb-12 for dot spacing
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id} className="h-auto">
                <Link 
                  href={category.href}
                  className="h-full bg-white rounded-[24px] border-[2px] border-[#131313] shadow-[4px_4px_0_#131313] p-6 min-h-[260px] flex flex-col justify-between group relative overflow-visible transition-all duration-300 w-full"
                >
                  {/* Left Content Area */}
                  <div className="flex flex-col gap-2 max-w-[58%] relative z-10">
                    <h3 className={`text-[24px] font-extrabold tracking-tight leading-none bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent drop-shadow-sm pb-1 ${sans.className}`}>
                      {category.title}
                    </h3>
                    
                    <p className="text-[#555] text-[12px] leading-relaxed font-medium">
                      {category.subtitle}
                    </p>
                  </div>

                  {/* Bottom Interactive Trigger Link */}
                  <div className="relative z-10 mt-6">
                    <span className="inline-flex items-center gap-1 text-[13px] font-bold text-[#131313] uppercase tracking-wide group-hover:text-[#8B5CF6] transition-colors">
                      Explore category 
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300 stroke-[2.5]" />
                    </span>
                  </div>

                  {/* Right Side Crop Image */}
                  <div className={`${category.imageClass} ${category.translate || ''}`}>
                    <Image 
                      src={category.image} 
                      alt={category.title} 
                      fill
                      className="object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.06)]"
                      sizes="(max-width: 768px) 50vw, 33vw"
                      priority
                    />
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* DESKTOP VIEW: Standard Bento Grid */}
        <div className="hidden md:grid grid-cols-12 gap-[30px] w-full items-stretch">
          {categories.map((category) => (
            <Link 
              href={category.href}
              key={category.id}
              className={`${category.colSpan} h-full bg-white rounded-[28px] border-[2.5px] border-[#131313] shadow-[6px_6px_0_#131313] p-12 min-h-[320px] flex flex-col justify-between group relative overflow-visible transition-all duration-300 hover:-translate-y-2 hover:shadow-[9px_12px_0_rgba(19,19,19,0.9)]`}
            >
              {/* Left Content Area */}
              <div className="flex flex-col gap-3.5 max-w-[55%] relative z-10">
                <h3 className={`text-[34px] font-extrabold tracking-tight leading-none bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent drop-shadow-sm pb-1 ${sans.className}`}>
                  {category.title}
                </h3>
                
                <p className="text-[#555] text-sm leading-relaxed font-medium">
                  {category.subtitle}
                </p>
              </div>

              {/* Bottom Interactive Trigger Link */}
              <div className="relative z-10 mt-8">
                <span className="inline-flex items-center gap-2 text-[15px] font-bold text-[#131313] uppercase tracking-wide group-hover:text-[#8B5CF6] transition-colors">
                  Explore category 
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300 stroke-[2.5]" />
                </span>
              </div>

              {/* Right Side Crop Image */}
              <div className={`${category.imageClass} ${category.translate || ''}`}>
                <Image 
                  src={category.image} 
                  alt={category.title} 
                  fill
                  className="object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.06)]"
                  sizes="(max-width: 768px) 50vw, 33vw"
                  priority
                />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}