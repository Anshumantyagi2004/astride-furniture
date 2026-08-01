'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';


const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
});

// 1. EXPANDED INTERFACE FOR TOTAL CONTROL
interface BentoCategory {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  colSpan: string;
  imageClass: string;
  href: string;
  // INDEPENDENT CONTROLS FOR MOBILE TWEAKING
  mobileTitleOffset?: string; 
  mobileSubtitleOffset?: string; 
  mobileButtonOffset?: string; 
  mobileImageScale?: string; 
}

// 2. UPDATED ARRAY
const CATEGORIES: BentoCategory[] = [
  {
    id: 1,
    title: 'Gaming Chair',
    subtitle: 'Explore high-performance racing cockpits designed for ultimate lumbar support and game-winning comfort.',
    image: '/Png1/chair11_octave.webp',
    href: '/products/category/gaming-chair',
    colSpan: 'lg:col-span-8 md:col-span-7 col-span-12',
    imageClass: 'absolute right-2 top-1/2 -translate-y-1/2 md:top-auto md:bottom-0 md:-translate-y-3 w-[42%] md:w-[32%] h-[85%] md:h-[80%] transform md:group-hover:scale-105 transition-transform duration-500 ease-out',
    
    // TWEAK THESE TO FIX THE GAMING CHAIR OVERLAP:
    mobileTitleOffset: 'translate-y-[-10px]',    // Moves Title UP
    mobileSubtitleOffset: 'translate-y-[0px]', // Moves Subtitle UP (gives it room)
    mobileButtonOffset: 'translate-y-[4px]',   // Moves Button UP (away from dots)
    mobileImageScale: 'scale-[0.95]',
  },
  {
    id: 4,
    title: 'Staff Chair',
    subtitle: 'Sleek executive task chairs engineered to maximize posture.',
    image: '/Png1/chair4_ACE.webp',
    href: '/products/category/staff-chair',
    colSpan: 'lg:col-span-4 md:col-span-5 col-span-12',
    imageClass: 'absolute right-2 top-1/2 -translate-y-1/2 md:top-auto md:bottom-0 md:-translate-y-9 w-[38%] md:w-[35%] h-[80%] md:h-[80%] transform md:group-hover:scale-105 transition-transform duration-500 ease-out',
    
    // TWEAK THESE:
    mobileTitleOffset: 'translate-y-[-16px]',
    mobileSubtitleOffset: 'translate-y-[0px]',
    mobileButtonOffset: 'translate-y-[6px]',
    mobileImageScale: 'scale-[0.95]',
  },
  {
    id: 3,
    title: 'Study Chair',
    subtitle: 'Self-adjusting active tension cradles.',
    image: '/Png1/chair5_AIRSENSE.webp',
    href: '/products/category/study-chair',
    colSpan: 'lg:col-span-4 md:col-span-5 col-span-12',
    imageClass: 'absolute right-1 top-1/2 -translate-y-1/2 md:top-auto md:bottom-0 md:translate-y-0 w-[48%] md:w-[52%] h-[95%] md:h-[110%] transform md:group-hover:scale-105 transition-transform duration-500 ease-out',
    
    // TWEAK THESE:
    mobileTitleOffset: 'translate-y-[-16px]',
    mobileSubtitleOffset: 'translate-y-[5px]',
    mobileButtonOffset: 'translate-y-[6px]',
    mobileImageScale: 'scale-[0.95]',
  },
  {
    id: 2,
    title: 'Bar Stools & Cafe Chair',
    subtitle: 'Elevate your counter experience with premium luxury bar stools and ergonomic counter-height seating.',
    image: '/Png1/chair6c_Rapid Black.webp',
    href: '/products/category/bar-stool',
    colSpan: 'lg:col-span-8 md:col-span-7 col-span-12',
    imageClass: 'absolute right-2 top-1/2 -translate-y-1/2 md:top-auto md:bottom-0 md:translate-y-0 w-[45%] md:w-[40%] h-[90%] md:h-[95%] transform md:group-hover:scale-105 transition-transform duration-500 ease-out',
    
    // TWEAK THESE:
    mobileTitleOffset: 'translate-y-[0px]',
    mobileSubtitleOffset: 'translate-y-[0px]',
    mobileButtonOffset: 'translate-y-[0px]',
    mobileImageScale: 'scale-[1.0]',
  }
];

export default function BentoCategories() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section 
      className={`w-full bg-[#FAFAFA] pt-6 pb-4 px-4 md:pt-8 md:pb-6 md:px-12 lg:px-20 overflow-hidden ${sans.className}`}
    >
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6 md:gap-10">
        
        {/* MOBILE VIEW */}
        {isMobile && (
          <div className="block md:hidden relative w-full pt-2 pb-6">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            loop={CATEGORIES.length >= 6}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            className="w-full h-full px-2 pb-12 !overflow-visible" 
          >
            {CATEGORIES.map((category, index) => (
              <SwiperSlide key={category.id} className="h-auto">
                <Link 
                  href={category.href}
                  className="h-full bg-white rounded-[24px] border-[2px] border-[#131313] shadow-[4px_4px_0_#131313] p-5 sm:p-6 min-h-[220px] flex flex-col justify-center group relative overflow-visible w-full"
                >
                  {/* TEXT & BUTTON CONTAINER */}
                  <div className={`flex flex-col gap-4 max-w-[62%] relative z-10`}>
                    
                    <div className="flex flex-col gap-1.5">
                      {/* 1. TITLE CONTROLLER */}
                      <h3 className={`text-[22px] sm:text-[24px] font-extrabold tracking-tight leading-[1.1] bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent drop-shadow-sm pb-1 transition-transform duration-300 ${category.mobileTitleOffset || ''} ${sans.className}`}>
                        {category.title}
                      </h3>
                      
                      {/* 2. SUBTITLE CONTROLLER */}
                      <p className={`text-[#555] text-[11px] sm:text-[12px] leading-relaxed font-medium line-clamp-3 transition-transform duration-300 ${category.mobileSubtitleOffset || ''}`}>
                        {category.subtitle}
                      </p>
                    </div>

                    {/* 3. BUTTON CONTROLLER */}
                    <div className={`transition-transform duration-300 ${category.mobileButtonOffset || ''}`}>
                      <span className="inline-flex items-center gap-1 text-[13px] font-bold text-[#131313] uppercase tracking-wide transition-colors">
                        Explore category 
                        <ArrowRight className="w-4 h-4 transform stroke-[2.5]" />
                      </span>
                    </div>

                  </div>

                  {/* 4. IMAGE SCALE CONTROLLER */}
                  <div className={`${category.imageClass} ${category.mobileImageScale || ''} transition-transform duration-300`}>
                    <div className="relative w-full h-full">
                      <Image 
                        src={category.image} 
                        alt={category.title} 
                        fill
                        className="object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.06)]"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        priority={index === 0} 
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        )}

        {/* DESKTOP VIEW (Unchanged) */}
        <div className="hidden md:grid grid-cols-12 gap-[30px] w-full items-stretch">
          {CATEGORIES.map((category, index) => (
            <Link 
              href={category.href}
              key={category.id}
              className={`${category.colSpan} h-full bg-white rounded-[28px] border-[2.5px] border-[#131313] shadow-[6px_6px_0_#131313] p-12 min-h-[320px] flex flex-col justify-between group relative overflow-visible transition-all duration-300 hover:-translate-y-2 hover:shadow-[9px_12px_0_rgba(19,19,19,0.9)]`}
            >
              <div className="flex flex-col gap-3.5 max-w-[55%] relative z-10">
                <h3 className={`text-[34px] font-extrabold tracking-tight leading-none bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent drop-shadow-sm pb-1 ${sans.className}`}>
                  {category.title}
                </h3>
                <p className="text-[#555] text-sm leading-relaxed font-medium">
                  {category.subtitle}
                </p>
              </div>

              <div className="relative z-10 mt-8">
                <span className="inline-flex items-center gap-2 text-[15px] font-bold text-[#131313] uppercase tracking-wide md:group-hover:text-[#8B5CF6] transition-colors">
                  Explore category 
                  <ArrowRight className="w-5 h-5 transform md:group-hover:translate-x-1 transition-transform duration-300 stroke-[2.5]" />
                </span>
              </div>

              <div className={`${category.imageClass}`}>
                <div className="relative w-full h-full">
                  <Image 
                    src={category.image} 
                    alt={category.title} 
                    fill
                    className="object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.06)]"
                    sizes="(max-width: 768px) 50vw, 33vw"
                    priority={index < 2} 
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}