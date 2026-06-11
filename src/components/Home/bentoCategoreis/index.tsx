'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';

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
  colSpan: string; // Tailwind grid-column span e.g. 'lg:col-span-8'
  imageClass: string; // Custom image positioning classes
  href: string;
  translate?: string; // Optional Tailwind translate class to move up/down
}

const CATEGORIES: BentoCategory[] = [
  {
    id: 1,
    title: 'Gaming Chair',
    subtitle: 'Explore high-performance racing cockpits designed for ultimate lumbar support and game-winning comfort.',
    image: '/Png1/chair11_octave.webp',
    colSpan: 'lg:col-span-8 md:col-span-7 col-span-12',
    imageClass: 'absolute right-2 bottom-0 w-[32%] h-[80%] transform group-hover:scale-105 transition-transform duration-500 ease-out',
    href: '/products?category=Gaming%20Chair',
    translate: '-translate-y-3'
  },
  {
    id: 2,
    title: 'Staff Chair',
    subtitle: 'Sleek executive task chairs engineered to maximize posture.',
    image: '/Png1/chair4_ACE.webp',
    colSpan: 'lg:col-span-4 md:col-span-5 col-span-12',
    imageClass: 'absolute right-2 bottom-0 w-[35%] h-[80%] transform group-hover:scale-105 transition-transform duration-500 ease-out',
    href: '/products?category=Staff%20Chair',
    translate: '-translate-y-9'
  },
  {
    id: 3,
    title: 'Study Chair',
    subtitle: 'Self-adjusting active tension cradles.',
    image: '/Png1/chair5_AIRSENSE.webp',
    colSpan: 'lg:col-span-4 md:col-span-5 col-span-12',
    imageClass: 'absolute right-2 bottom-0 w-[52%] h-[110%] transform group-hover:scale-105 transition-transform duration-500 ease-out',
    href: '/products?category=Study%20Chair',
    translate: ''
  },
  {
    id: 4,
    title: 'Bar Stool',
    subtitle: 'Elevate your counter experience with premium luxury bar stools and ergonomic counter-height seating.',
    image: '/Png1/chair6c_Rapid Black .webp',
    colSpan: 'lg:col-span-8 md:col-span-7 col-span-12',
    imageClass: 'absolute right-2 bottom-0 w-[40%] h-[95%] transform group-hover:scale-105 transition-transform duration-500 ease-out',
    href: '/products?category=Bar%20Stool',
    translate: ''
  }
];

export default function BentoCategories() {
  return (
    <section 
      className={`w-full bg-[#FAFAFA] pt-8 pb-6 px-6 md:px-12 lg:px-20 overflow-hidden ${sans.className}`}
    >
      <div className="max-w-[1440px] mx-auto flex flex-col gap-10">
        
        {/* Bento Grid layout */}
        <div className="grid grid-cols-12 gap-[30px] w-full items-stretch">
          {CATEGORIES.map((category) => (
            <Link 
              href={category.href}
              key={category.id}
              className={`${category.colSpan} h-full bg-white rounded-[28px] border-[2.5px] border-[#131313] shadow-[6px_6px_0_#131313] p-8 md:p-12 min-h-[320px] flex flex-col justify-between group relative overflow-visible transition-all duration-300 hover:-translate-y-2 hover:shadow-[9px_12px_0_rgba(19,19,19,0.9)]`}
            >
              {/* Left Content Area */}
              <div className="flex flex-col gap-3.5 max-w-[55%] relative z-10">
                <h3 className={`text-3xl md:text-[34px] font-extrabold tracking-tight leading-none bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent drop-shadow-sm pb-1 ${sans.className}`}>
                  {category.title}
                </h3>
                
                <p className="text-[#555] text-s md:text-sm leading-relaxed font-medium">
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
