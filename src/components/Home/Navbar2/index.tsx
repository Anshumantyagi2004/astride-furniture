'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingCart, ChevronRight } from 'lucide-react';

interface SeriesChair {
  name: string;
  image: string;
  tag?: string;
  buyUrl: string;
  learnUrl: string;
}

interface ChairCategory {
  label: string;
  chairs: SeriesChair[];
}

const CHAIR_CATEGORIES: Record<string, ChairCategory> = {
  'Gaming Chair': {
    label: 'Gaming Chair',
    chairs: [
      { name: 'ACE Pro', image: '/Png1/chair4_ACE.png', tag: 'Bestseller', buyUrl: '#buy', learnUrl: '#learn' },
      { name: 'AlphaGrey', image: '/Png1/chair6_AlphaGrey.png', tag: 'Pro', buyUrl: '#buy', learnUrl: '#learn' },
      { name: 'Rapid Black', image: '/Png1/chair6c_Rapid Black .png', tag: 'Active', buyUrl: '#buy', learnUrl: '#learn' }
    ]
  },
  'Executive Chair': {
    label: 'Executive Chair',
    chairs: [
      { name: 'ERIZO', image: '/Png1/chair8_ERIZO.png', tag: 'Luxury', buyUrl: '#buy', learnUrl: '#learn' },
      { name: 'Gladus Grey', image: '/Png1/Chair6b_Gladus Grey.png', tag: 'Hybrid', buyUrl: '#buy', learnUrl: '#learn' },
      { name: 'ErgoFit', image: '/Png1/chair12_ErgoFit.png', tag: 'Premium', buyUrl: '#buy', learnUrl: '#learn' }
    ]
  },
  'Staff Chair': {
    label: 'Staff Chair',
    chairs: [
      { name: 'Amica Black', image: '/Png1/Chair6a_Amica Black .png', tag: 'Classic', buyUrl: '#buy', learnUrl: '#learn' },
      { name: 'Delton', image: '/Png1/Chair7_Delton.png', tag: 'Comfort', buyUrl: '#buy', learnUrl: '#learn' },
      { name: 'Avien', image: '/Png1/chair13_Avien.png', tag: 'New', buyUrl: '#buy', learnUrl: '#learn' }
    ]
  },
  'Study Chair': {
    label: 'Study Chair',
    chairs: [
      { name: 'AIRSENSE', image: '/Png1/chair5_AIRSENSE.png', tag: 'Aero', buyUrl: '#buy', learnUrl: '#learn' },
      { name: 'octave', image: '/Png1/chair11_octave.png', tag: 'Mesh', buyUrl: '#buy', learnUrl: '#learn' },
      { name: 'FitWell', image: '/Png1/chair9_FitWell.png', tag: 'Support', buyUrl: '#buy', learnUrl: '#learn' }
    ]
  },
  'Bar Stool': {
    label: 'Bar Stool',
    chairs: [
      { name: 'Zenith Stool', image: '/Png1/chair10_FitWell.png', tag: 'Stool', buyUrl: '#buy', learnUrl: '#learn' },
      { name: 'Apex Stool', image: '/Png1/chair9_FitWell.png', tag: 'Comfort', buyUrl: '#buy', learnUrl: '#learn' }
    ]
  }
};

const CATEGORY_KEYS = ['Gaming Chair', 'Executive Chair', 'Staff Chair', 'Study Chair', 'Bar Stool'];

export default function Navbar2() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 3, minutes: 9, seconds: 4 });

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeCategory = activeMenu ? CHAIR_CATEGORIES[activeMenu] : null;

  return (
    <header 
      className="w-full z-[1000] relative select-none"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}
    >
      {/* ── Top Announcement Bar ── */}
      <div className="w-full bg-black px-6 py-2.5 text-xs flex justify-between items-center flex-wrap gap-2 text-white">
        <div className="flex items-center gap-2">
          <span className="font-extrabold tracking-wider bg-white text-black px-1.5 py-0.5 rounded-sm text-[10px]">
            LIMITED FLASH SALE
          </span>
          <span className="text-neutral-300 font-bold uppercase tracking-wide text-[11px]">
            | Up to $129 OFF select products
          </span>
        </div>
        <div className="flex items-center gap-4 text-neutral-300 font-bold text-[11px]">
          <span className="font-mono text-white">
            Sale ends in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </span>
          <Link href="#sale" className="font-extrabold text-white hover:text-neutral-300 inline-flex items-center gap-1 transition-colors uppercase tracking-wider">
            SHOP SALE
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── Main Header ── */}
      <nav 
        className="w-full bg-white border-b border-neutral-200 px-8 py-5 flex justify-between items-center transition-colors relative"
        onMouseLeave={() => setActiveMenu(null)}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          {/* Custom Minimalist Geometric Logo (Solid Black) */}
          <div className="w-8 h-8 rounded bg-black flex items-center justify-center transition-transform duration-300">
            <span className="font-black text-white text-sm tracking-tighter">A</span>
          </div>
          <span className="font-black tracking-[0.25em] text-base text-black">
            ASTRIDE
          </span>
        </Link>

        {/* Chair categories centered in the middle of the navbar */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-8 mx-auto flex-wrap justify-center flex-1 px-2">
          {CATEGORY_KEYS.map((category) => (
            <button
              key={category}
              onMouseEnter={() => setActiveMenu(category)}
              className={`px-3 py-2 text-xs font-black tracking-wider transition-all duration-200 border-b-2 uppercase ${
                activeMenu === category 
                  ? 'border-black text-black bg-neutral-50' 
                  : 'border-transparent text-neutral-800 hover:text-black hover:bg-neutral-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6 shrink-0">
          {/* Icons */}
          <div className="flex items-center gap-5 text-neutral-800">
            <button className="hover:text-black transition-colors cursor-pointer p-1">
              <Search className="w-4.5 h-4.5 stroke-[2.5]" />
            </button>

            {/* Shopping Cart with Popover */}
            <div 
              className="relative"
              onMouseEnter={() => setIsCartOpen(true)}
              onMouseLeave={() => setIsCartOpen(false)}
            >
              <button className="hover:text-black transition-colors cursor-pointer p-1">
                <ShoppingCart className="w-4.5 h-4.5 stroke-[2.5]" />
              </button>

              {/* Cart Popover */}
              {isCartOpen && (
                <div className="absolute right-0 top-full pt-3.5 w-80 z-[1100] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-white border border-neutral-200 rounded-xl shadow-xl p-6 text-center">
                    <p className="text-neutral-500 text-sm font-bold mb-4">Cart is empty.</p>
                    <Link 
                      href="#sale" 
                      className="block w-full py-3 text-xs font-extrabold text-white bg-black hover:bg-neutral-800 rounded-lg transition-colors shadow-sm"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Dropdown Mega Menus ── */}
        {activeCategory && (
          <div 
            className="absolute left-0 top-full w-full bg-white border-b border-neutral-200 text-neutral-800 py-5 px-12 z-[900] shadow-xl animate-in fade-in slide-in-from-top-4 duration-300"
            onMouseEnter={() => setActiveMenu(activeMenu)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-3 gap-8">
                {activeCategory.chairs.map((chair, index) => (
                  <div 
                    key={index}
                    className="flex flex-col items-center group relative cursor-pointer"
                  >
                    {/* Visual Container */}
                    <div className="relative w-full aspect-[4/3.2] bg-neutral-50/70 border border-neutral-200/50 rounded-2xl flex items-center justify-center p-4 group-hover:bg-neutral-100/60 group-hover:border-neutral-300 transition-all duration-300">

                      <div className="relative w-[90%] h-[90%] transform group-hover:scale-105 transition-transform duration-500 ease-out flex items-center justify-center">
                        <Image
                          src={chair.image}
                          alt={chair.name}
                          fill
                          className="object-contain drop-shadow-md"
                          sizes="18vw"
                        />
                      </div>
                    </div>

                    {/* Metadata (Centered Title & Action CTAs) */}
                    <div className="mt-3 flex flex-col items-center gap-1 w-full">
                      <span className="font-extrabold text-neutral-900 text-sm tracking-tight text-center group-hover:underline underline-offset-2 transition-all">
                        {chair.name}
                      </span>
                      
                      {/* Buy Action Link */}
                      <div className="mt-0.5">
                        <Link 
                          href={chair.buyUrl}
                          className="text-[11px] font-black text-neutral-500 hover:text-black underline underline-offset-2 decoration-1 transition-colors uppercase tracking-wider"
                        >
                          Buy
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
