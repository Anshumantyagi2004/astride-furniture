"use client";

import React from 'react';
import Image from "next/image";

// ==========================================
// CONFIGURATION INTERFACE FOR PLATFORM LOGOS
// ==========================================
const LOGO_CONFIG = {
  amazon: {
    mobileHeight: "70px",
    mobileWidth: "68.5px",
    mobileTranslateY: "0px",
    desktopHeight: "83px",
    desktopWidth: "auto",
    desktopTranslateY: "3px",
  },
  flipkart: {
    mobileHeight: "24px",
    mobileWidth: "auto",
    mobileTranslateY: "-7px",
    desktopHeight: "30px",
    desktopWidth: "auto",
    desktopTranslateY: "-3px",
  }
};

// ==========================================
// GLOW & BACKDROP SPREAD/INTENSITY CONFIG
// ==========================================
const GLOW_CONFIG = {
  amazon: {
    mobileSpread: "20px",       
    mobileIntensity: "0.27",    

    desktopSpread: "20px",      
    desktopIntensity: "0.27",   
  },
  flipkart: {
    mobileSpread: "24px",       
    mobileIntensity: "0.25",    

    desktopSpread: "36px",      
    desktopIntensity: "0.75",   
  }
};

export default function StatsSection_New() {
  const stats = [
    { num: "75,000", symbol: "+", label: "Orders delivered", symbolSize: "text-[32px] sm:text-[40px] md:text-[52px] lg:text-[62px]", translate: "translate-y-[-8px] sm:translate-y-[-10px]" },
    { num: "50,000", symbol: "+", label: "Happy customers", symbolSize: "text-[32px] sm:text-[40px] md:text-[52px] lg:text-[62px]", translate: "translate-y-[-8px] sm:translate-y-[-10px]" },
    { num: "12",     symbol: "+", label: "Years experience", symbolSize: "text-[32px] sm:text-[40px] md:text-[52px] lg:text-[62px]", translate: "translate-y-[-8px] sm:translate-y-[-10px]" },
    { num: "4.8",   symbol: "★", label: "Customer rating", symbolSize: "text-[18px] sm:text-[23px] md:text-[32px] lg:text-[38px]", translate: "translate-y-[1px] md:translate-y-[2px]" },
  ];

  return (
    <section className="bg-[#0F172B] border-y-[3px] border-[#131313] pt-3 pb-4 md:pt-[40px] md:pb-[45px] lg:pt-[50px] lg:pb-[50px]">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-5 md:px-8 lg:px-12">
        
        {/* Heading */}
        <h2 className="text-center font-black uppercase leading-[1.1] text-white text-[18px] min-[375px]:text-[20px] sm:text-[26px] md:text-[46px] lg:text-[58px] mb-3 md:mb-14">
          India&apos;s leading <br className="block sm:hidden" /> Ergonomic Chair brand
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
          {stats.map((item, index) => (
            <div
              key={index}
              className="rounded-[20px] md:rounded-[24px] border-[2px] md:border-[2.5px] border-[#131313] bg-white px-2 py-5 md:px-4 md:py-8 text-center shadow-[4px_4px_0_#131313] md:shadow-[6px_6px_0_#131313]"
            >
              <b className="flex items-center justify-center leading-none font-black text-[#131313] gap-[2px]">
                <span className="text-[22px] sm:text-[28px] md:text-[34px] lg:text-[40px]">{item.num}</span>
                <span className={`leading-none select-none transform ${item.symbolSize} ${item.translate}`}>{item.symbol}</span>
              </b>

              <span className="mt-2 md:mt-3 block text-[10px] sm:text-[13px] font-semibold uppercase tracking-[0.04em] md:tracking-[0.08em] text-[#555] leading-tight">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Platforms */}
        <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <span className="text-[11px] md:text-[13px] font-bold uppercase tracking-[0.12em] text-white">
            Available on
          </span>

          <div className="flex items-center gap-4">
            {/* Amazon Logo Wrapper */}
            <div 
              style={{
                "--h-mobile": LOGO_CONFIG.amazon.mobileHeight,
                "--w-mobile": LOGO_CONFIG.amazon.mobileWidth,
                "--h-desktop": LOGO_CONFIG.amazon.desktopHeight,
                "--w-desktop": LOGO_CONFIG.amazon.desktopWidth,
                "--ty-mobile": LOGO_CONFIG.amazon.mobileTranslateY,
                "--ty-desktop": LOGO_CONFIG.amazon.desktopTranslateY,
                "--glow-blur-mobile": GLOW_CONFIG.amazon.mobileSpread,
                "--glow-opacity-mobile": GLOW_CONFIG.amazon.mobileIntensity,
                "--glow-blur-desktop": GLOW_CONFIG.amazon.desktopSpread,
                "--glow-opacity-desktop": GLOW_CONFIG.amazon.desktopIntensity,
              } as React.CSSProperties}
              className="flex items-center relative px-2 py-1"
            >
              {/* Added will-change-filter and translate-Z composite overrides to completely eliminate mobile flickering anomalies */}
              <div 
                className="absolute inset-0 bg-white pointer-events-none z-0 rounded-full [filter:blur(var(--glow-blur-mobile))] [opacity:var(--glow-opacity-mobile)] md:[filter:blur(var(--glow-blur-desktop))] md:[opacity:var(--glow-opacity-desktop)] [will-change:filter] [transform:translateZ(0)]" 
              />
              
              <Image
                src="/Logo/amazon.webp"
                alt="Amazon"
                width={200}
                height={94}
                className="h-[var(--h-mobile)] w-[var(--w-mobile)] md:h-[var(--h-desktop)] md:w-[var(--w-desktop)] [transform:translateY(var(--ty-mobile))] md:[transform:translateY(var(--ty-desktop))] object-contain relative z-10"
              />
            </div>

            {/* Flipkart Logo Wrapper */}
            <div
              style={{
                "--h-mobile": LOGO_CONFIG.flipkart.mobileHeight,
                "--w-mobile": LOGO_CONFIG.flipkart.mobileWidth,
                "--h-desktop": LOGO_CONFIG.flipkart.desktopHeight,
                "--w-desktop": LOGO_CONFIG.flipkart.desktopWidth,
                "--ty-mobile": LOGO_CONFIG.flipkart.mobileTranslateY,
                "--ty-desktop": LOGO_CONFIG.flipkart.desktopTranslateY,
                "--glow-blur-mobile": GLOW_CONFIG.flipkart.mobileSpread,
                "--glow-opacity-mobile": GLOW_CONFIG.flipkart.mobileIntensity,
                "--glow-blur-desktop": GLOW_CONFIG.flipkart.desktopSpread,
                "--glow-opacity-desktop": GLOW_CONFIG.flipkart.desktopIntensity,
              } as React.CSSProperties}
              className="flex items-center relative px-2 py-1"
            >
              {/* Added identical hardware-acceleration prompts on the neighboring backdrop for frame consistency */}
              <div 
                className="absolute inset-0 bg-white pointer-events-none z-0 rounded-md [filter:blur(var(--glow-blur-mobile))] [opacity:var(--glow-opacity-mobile)] md:[filter:blur(var(--glow-blur-desktop))] md:[opacity:var(--glow-opacity-desktop)] [will-change:filter] [transform:translateZ(0)]" 
              />
              
              <Image
                src="/Logo/FLIPKART_Webp.webp"
                alt="Flipkart"
                width={100}
                height={24}
                className="h-[var(--h-mobile)] w-[var(--w-mobile)] md:h-[var(--h-desktop)] md:w-[var(--w-desktop)] [transform:translateY(var(--ty-mobile))] md:[transform:translateY(var(--ty-desktop))] object-contain relative z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}