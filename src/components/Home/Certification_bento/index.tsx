"use client";

import React, { useState, memo } from 'react';
import { motion, Variants } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import {
  IconCertificate,
  IconArmchair
} from '@tabler/icons-react';

import 'swiper/css';
import 'swiper/css/pagination';

// Optimized static animation variant descriptors pushed outside component runtime lifecycle
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 120,
    },
  },
};

// Hoisted Certifications static data model array mapping layer
const CERTS_DATA = [
  {
    title: "ISO 9001:2015",
    subtitle: "Quality management system for the manufacturing and supply of revolving chairs.",
    whyTitle: "WHY ASTRIDE IS BETTER THAN COMPETITORS?",
    whyPoints: [
      { title: "Standardized Quality", desc: "Unlike generic brands with volatile quality, Astride implements ISO-audited repeatable assembly lines." },
      { title: "Defect-Free Guarantee", desc: "Our certified production workflow virtually eliminates component mismatches and visual flaws." },
      { title: "Strict Quality Control", desc: "Every batch undergoes rigorous quality-gate tests before leaving our manufacturing unit." }
    ],
    pdfUrl: "/Pdf/pdf_2.pdf",
    bgColor: "#2c405a",
    accentColor: "#93c5fd",
    footerLeft: "Status: Active",
    footerRight: "Audit: Passed",
    icon: IconCertificate,
    iframeHeight: "550px",
    regNo: "Reg: 25EQQW45"
  },
  {
    title: "ANSI BIFMA X5.1",
    subtitle: "General-purpose office chair durability standard, 2017 (R2022).",
    whyTitle: "WHY ASTRIDE IS BETTER THAN COMPETITORS?",
    whyPoints: [
      { title: "Ten-Year Durability", desc: "Astride swivels and tilts withstand 120,000+ extreme load cycles vs. competitors' quick wear." },
      { title: "Heavyweight Safety", desc: "Armrests, backrests, and premium cylinders secure heavy payloads without breaking or leaking." },
      { title: "Advanced Anti-Topple", desc: "Built with high-spec stability margins to prevent tipping at any dynamic tilt configurations." }
    ],
    pdfUrl: "/Pdf/BIFMA.pdf",
    bgColor: "#1b3f2f",
    accentColor: "#4ade80",
    footerLeft: "Status: Active",
    footerRight: "Safety: Certified",
    icon: IconArmchair,
    iframeHeight: "1200px",
    regNo: "Standard Compliance"
  }
];

const SWIPER_MODULES = [Pagination, Autoplay];
const SWIPER_PAGINATION_CONFIG = { clickable: true };
const SWIPER_AUTOPLAY_CONFIG = { delay: 3000, disableOnInteraction: false };

interface CertCardProps {
  title: string;
  subtitle: string;
  whyTitle: string;
  whyPoints: { title: string; desc: string }[];
  pdfUrl: string;
  bgColor: string;
  accentColor: string;
  footerLeft: string;
  footerRight: string;
  icon: React.ComponentType<any>;
  iframeHeight?: string;
  regNo?: string;
}

// ==========================================
// MEMOIZED CHILD CERTIFICATE CARD MODULE
// ==========================================
const CertCard = memo(({ 
  title, 
  subtitle, 
  whyTitle, 
  whyPoints, 
  pdfUrl, 
  bgColor, 
  accentColor, 
  footerLeft, 
  footerRight,
  icon: Icon,
  iframeHeight = "600px",
  regNo
}: CertCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    // Fixed height wrapper layout from image_edf161.png to prevent text pushing footers out
    <div className="w-full relative min-h-[520px] sm:min-h-[480px] flex flex-col" style={{ perspective: "1000px" }}>
      <div 
        style={{
          width: "100%",
          height: "100%",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          position: "relative",
          flex: "1 1 auto"
        }}
      >
        {/* FRONT SIDE */}
        <div 
          className="rounded-2xl pt-5 pb-5 px-4 md:px-5 flex flex-col justify-between border border-white/5 shadow-lg absolute inset-0 h-full w-full"
          style={{
            backgroundColor: bgColor,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center shrink-0">
                  <Icon size={22} stroke={2.5} style={{ color: accentColor }} />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-black truncate" style={{ color: accentColor }}>
                  {title}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsFlipped(true)}
                className="text-[11px] font-black bg-black/25 hover:bg-black/40 px-2.5 py-1.5 rounded-lg transition-all duration-200 active:scale-95 shrink-0 flex items-center gap-1 cursor-pointer text-white"
              >
                Verify ⟲
              </button>
            </div>
            
            <p className="text-[13px] md:text-[14.5px] font-semibold text-white/90 leading-relaxed mb-4">
              {subtitle}
            </p>
 
            <div className="space-y-3 bg-black/20 p-3.5 md:p-4.5 rounded-xl border border-white/5 shadow-inner flex-1 overflow-y-auto scrollbar-none">
              <h4 className="text-[11px] uppercase tracking-wider font-black text-white/80" style={{ color: accentColor }}>
                {whyTitle}
              </h4>
              <div className="space-y-2.5">
                {whyPoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2 text-[13px] md:text-[14.5px] leading-relaxed">
                    <span className="text-[14px] md:text-[16px] shrink-0 leading-none select-none" style={{ color: accentColor }}>✓</span>
                    <p className="text-white/80">
                      <strong className="text-white font-black">{pt.title}:</strong> {pt.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Constrained inside absolute boundary limits */}
          <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-[12px] text-white/70 shrink-0">
            <span className="font-bold text-white/95">{footerLeft}</span>
            <span className="bg-black/25 px-2.5 py-0.5 rounded-md font-black text-white">
              {footerRight}
            </span>
          </div>
        </div>

        {/* BACK SIDE */}
        <div 
          className="rounded-2xl pt-5 pb-5 px-4 md:px-5 flex flex-col justify-between border border-white/5 shadow-lg absolute inset-0 h-full w-full"
          style={{
            backgroundColor: bgColor,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center shrink-0">
                  <Icon size={18} stroke={2.5} style={{ color: accentColor }} />
                </div>
                <h3 className="text-base font-black truncate text-white">
                  {title} PDF
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsFlipped(false)}
                className="text-[11px] font-black bg-black/25 hover:bg-black/40 px-2.5 py-1.5 rounded-lg transition-all duration-200 active:scale-95 text-white cursor-pointer shrink-0"
              >
                Back ⟲
              </button>
            </div>
            
            {/* Scrollable PDF container region */}
            <div className="w-full flex-1 rounded-xl overflow-y-auto bg-black/35 border border-white/5 relative scrollbar-none">
              <iframe 
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`} 
                className="w-full h-full border-0 min-h-[260px]"
                style={{ 
                  height: iframeHeight,
                  pointerEvents: "auto"
                }}
                title={`${title} Certificate`}
              />
            </div>
          </div>
          
          <div className="mt-4 pt-2 border-t border-white/10 flex justify-between items-center text-[11px] text-white/50 shrink-0">
            <span className="font-medium">Scroll inside view window</span>
            {regNo && (
              <span className="font-mono bg-black/25 px-2 py-0.5 rounded-md text-white/85 font-bold">
                {regNo}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
CertCard.displayName = "CertCard";

// ==========================================
// MAIN BENTO COMPONENT MODULE
// ==========================================
const CertificationsBento = () => {
  return (
    <section className="w-full pt-8 pb-8 px-5 md:px-8 lg:px-16 overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
      <style jsx global>{`
        .cert-swiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.3) !important;
          opacity: 1 !important;
        }
        .cert-swiper .swiper-pagination-bullet-active {
          background: #9333EA !important;
        }
        .cert-swiper.swiper {
          overflow: visible !important;
        }
      `}</style>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div variants={itemVariants} className="mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-[#9333EA] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent uppercase tracking-wider mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              CERTIFICATIONS
            </h2>
            <p className="text-sm font-medium text-zinc-400" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Quality, safety and durability — independently verified
            </p>
          </div>
        </motion.div>

        {/* MOBILE CAROUSEL */}
        <div className="block md:hidden w-full pb-8">
          <Swiper
            modules={SWIPER_MODULES}
            pagination={SWIPER_PAGINATION_CONFIG}
            autoplay={SWIPER_AUTOPLAY_CONFIG}
            loop={true}
            spaceBetween={20}
            slidesPerView={1}
            className="cert-swiper w-full"
          >
            {CERTS_DATA.map((cert, idx) => (
              <SwiperSlide key={idx}>
                <motion.div variants={itemVariants}>
                  <CertCard {...cert} />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* DESKTOP GRID */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          {CERTS_DATA.map((cert, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <CertCard {...cert} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default CertificationsBento;