'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface BentoCategory {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  colSpan: string; // Tailwind grid-column span e.g. 'lg:col-span-8'
  imageClass: string; // Custom image positioning classes
  href: string;
}

const CATEGORIES: BentoCategory[] = [
  {
    id: 1,
    title: 'Gaming Chair',
    subtitle: 'Explore high-performance racing cockpits designed for ultimate lumbar support and game-winning comfort.',
    image: '/Png1/chair6c_Rapid Black .webp',
    colSpan: 'lg:col-span-8 md:col-span-7 col-span-12',
    imageClass: 'absolute -right-6 bottom-0 w-[45%] h-[95%] min-h-[220px] max-h-[340px] transform group-hover:scale-105 transition-transform duration-500 ease-out',
    href: '/products?category=Gaming Chair'
  },
  {
    id: 2,
    title: 'Staff Chair',
    subtitle: 'Sleek executive task chairs engineered to maximize posture.',
    image: '/Png1/Chair6a_Amica Black .webp',
    colSpan: 'lg:col-span-4 md:col-span-5 col-span-12',
    imageClass: 'absolute -right-4 bottom-0 w-[55%] h-[80%] min-h-[180px] max-h-[260px] transform group-hover:scale-105 transition-transform duration-500 ease-out',
    href: '/products?category=Staff Chair'
  },
  {
    id: 3,
    title: 'Study Chair',
    subtitle: 'Self-adjusting active tension cradles.',
    image: '/Png1/chair5_AIRSENSE.webp',
    colSpan: 'lg:col-span-4 md:col-span-5 col-span-12',
    imageClass: 'absolute -right-4 bottom-0 w-[55%] h-[80%] min-h-[180px] max-h-[260px] transform group-hover:scale-105 transition-transform duration-500 ease-out',
    href: '/products?category=Study Chair'
  },
  {
    id: 4,
    title: 'Bar Stool',
    subtitle: 'Elevate your counter experience with premium luxury bar stools and ergonomic counter-height seating.',
    image: '/Png1/chair11_octave.webp',
    colSpan: 'lg:col-span-8 md:col-span-7 col-span-12',
    imageClass: 'absolute -right-6 bottom-0 w-[45%] h-[95%] min-h-[220px] max-h-[340px] transform group-hover:scale-105 transition-transform duration-500 ease-out',
    href: '/products?category=Bar Stool'
  }
];

export default function BentoCategories() {
  return (
    <section 
      className="w-full bg-[#FAFAFA] pt-20 pb-6 px-6 md:px-12 lg:px-20 overflow-hidden"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}
    >
      <div className="max-w-[1440px] mx-auto flex flex-col gap-10">
        
        {/* Bento Grid layout */}
        <div className="grid grid-cols-12 gap-6 w-full items-stretch">
          {CATEGORIES.map((category) => (
            <Link 
              href={category.href}
              key={category.id}
              className={`${category.colSpan} bg-[#F4F4F6]/60 hover:bg-[#ECECEF]/65 rounded-[32px] p-8 md:p-12 min-h-[320px] flex flex-col justify-between group relative overflow-hidden transition-all duration-300 border border-neutral-100/50 hover:shadow-lg`}
            >
              {/* Left Content Area */}
              <div className="flex flex-col gap-3.5 max-w-[55%] relative z-10">
                <h3 className="text-3xl md:text-[34px] font-bold text-[#111111] tracking-tight leading-none group-hover:underline decoration-neutral-800 decoration-2 underline-offset-4">
                  {category.title}
                </h3>
                
                <p className="text-neutral-500 text-xs md:text-sm leading-relaxed font-sans font-medium">
                  {category.subtitle}
                </p>
              </div>

              {/* Bottom Interactive Trigger Link */}
              <div className="relative z-10 mt-8">
                <span className="inline-flex items-center gap-2 text-sm font-bold text-[#111111] border-b border-black/80 pb-0.5 group-hover:border-black transition-all">
                  Explore category 
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300 stroke-[2.5]" />
                </span>
              </div>

              {/* Right Side Crop Image */}
              <div className={category.imageClass}>
                <Image 
                  src={category.image} 
                  alt={category.title} 
                  fill
                  className="object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.06)]"
                  sizes="(max-width: 768px) 100vw, 33vw"
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
