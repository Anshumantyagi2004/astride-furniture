"use client";

import React, { useState, useEffect, memo, useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import {
  IconCertificate,
  IconArmchair
} from '@tabler/icons-react';



const BisIcon = ({ size = 28, style, ...props }: { size?: number; style?: React.CSSProperties; [key: string]: any }) => {
  const fillAccent = style?.color || "currentColor";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      {...props}
    >
      {/* Outer Blue Triangular Shape with inner cutouts */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M 50 10 
           L 88 64 
           H 68 
           L 50 37 
           L 32 64 
           H 12 
           Z 
           M 50 48 
           L 38 64 
           H 62 
           Z"
        fill={fillAccent}
      />
      {/* Red circle in the center */}
      <circle cx="50" cy="46" r="8" fill="#ef4444" />
      {/* Bottom tray/stand */}
      <path
        d="M 8 68 
           L 18 82 
           H 82 
           L 92 68 
           H 80 
           L 74 76 
           H 26 
           L 20 68 
           Z"
        fill={fillAccent}
      />
    </svg>
  );
};

const BifmaIcon = ({ size = 28, style, ...props }: { size?: number; style?: React.CSSProperties; [key: string]: any }) => {
  const fillAccent = style?.color || "currentColor";
  const width = size * 1.45;
  const height = size * 0.95;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      {...props}
    >
      {/* Upper bold BIFMA */}
      <text
        x="60"
        y="32"
        fill={fillAccent}
        fontSize="34"
        fontWeight="900"
        fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        textAnchor="middle"
        letterSpacing="-1.5px"
      >
        BIFMA
      </text>
      {/* Swoosh curve line */}
      <path
        d="M 5 52 Q 60 34 115 44 Q 60 26 5 52"
        fill={fillAccent}
      />
      {/* Lower thin BIFMA */}
      <text
        x="80"
        y="68"
        fill={fillAccent}
        fontSize="17"
        fontWeight="800"
        fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        textAnchor="middle"
        letterSpacing="0.5px"
      >
        BIFMA
      </text>
    </svg>
  );
};

const IsoIcon = ({ size = 28, style, ...props }: { size?: number; style?: React.CSSProperties; [key: string]: any }) => {
  const fillAccent = style?.color || "currentColor";
  const adjustedSize = size * 1.25;
  return (
    <svg
      width={adjustedSize}
      height={adjustedSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      {...props}
    >
      {/* Globe outline (top & bottom arcs) */}
      <path d="M 12 48 A 38 38 0 0 1 88 48" stroke={fillAccent} strokeWidth="4.5" fill="none" />
      <path d="M 12 52 A 38 38 0 0 0 88 52" stroke={fillAccent} strokeWidth="4.5" fill="none" />
      
      {/* Grid lines top */}
      <path d="M 22 34 Q 50 44 78 34" stroke={fillAccent} strokeWidth="3" fill="none" />
      <path d="M 33 21 Q 50 32 67 21" stroke={fillAccent} strokeWidth="3" fill="none" />
      <path d="M 50 10 V 48" stroke={fillAccent} strokeWidth="3" />
      <path d="M 32 48 C 32 30 42 14 50 10" stroke={fillAccent} strokeWidth="3" fill="none" />
      <path d="M 68 48 C 68 30 58 14 50 10" stroke={fillAccent} strokeWidth="3" fill="none" />

      {/* Grid lines bottom */}
      <path d="M 22 66 Q 50 56 78 66" stroke={fillAccent} strokeWidth="3" fill="none" />
      <path d="M 33 79 Q 50 68 67 79" stroke={fillAccent} strokeWidth="3" fill="none" />
      <path d="M 50 90 V 52" stroke={fillAccent} strokeWidth="3" />
      <path d="M 32 52 C 32 70 42 86 50 90" stroke={fillAccent} strokeWidth="3" fill="none" />
      <path d="M 68 52 C 68 70 58 86 50 90" stroke={fillAccent} strokeWidth="3" fill="none" />
      {/* Backing solid shape to mask out globe lines in the center */}
      <rect x="18" y="38" width="64" height="24" fill="#2c405a" rx="4" />

      {/* Bold ISO text in the center */}
      <text
        x="50"
        y="58"
        fill="#ffffff"
        fontSize="34"
        fontWeight="900"
        fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        textAnchor="middle"
        letterSpacing="-0.5px"
      >
        ISO
      </text>
    </svg>
  );
};

// Static animation configuration vectors moved out of component updates scope
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

const CERTS_DATA = [
  {
    title: "ISO 9001:2015",
    subtitle: "Quality management system for the manufacturing and supply of revolving chairs.",
    whyTitle: "WHY ASTRIDE IS BETTER THAN COMPETITORS?",
    whyPoints: [
      { title: "Standardized Quality", desc: "Unlike generic brands with volatile quality, Astride implements ISO-audited repeatable assembly lines." },
      { title: "Defect-Free Guarantee", desc: "Our certified production workflow virtually eliminates component mismatches and visual flaws." },
      { title: "Strict Quality Control", desc: "Every batch undergoes rigorous quality-gate tests before leaving our manufacturing unit." },
      { title: "Traceable Supply Chain", desc: "Every nut, bolt, and cylinder is traceable back to certified premium tier-1 raw material suppliers." },
      { title: "Continuous Audits", desc: "Annual external ISO audits ensure our manufacturing methods evolve with the latest engineering advancements." }
    ],
    pdfUrl: "/Pdf/pdf_2.pdf",
    bgColor: "#2c405a",
    accentColor: "#93c5fd",
    footerLeft: "Status: Active",
    footerRight: "Audit: Passed",
    icon: IsoIcon,
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
      { title: "Advanced Anti-Topple", desc: "Built with high-spec stability margins to prevent tipping at any dynamic tilt configurations." },
      { title: "Structural Integrity", desc: "Drop-test verified to withstand high impacts without compromising the chair's core framework." },
      { title: "Eco-Friendly Material", desc: "Constructed with low-emission materials conforming to BIFMA chemical safety standard checks." }
    ],
    pdfUrl: "/Pdf/BIFMA.pdf",
    bgColor: "#1b3f2f",
    accentColor: "#4ade80",
    footerLeft: "Status: Active",
    footerRight: "Safety: Certified",
    icon: BifmaIcon,
    iframeHeight: "1200px",
    regNo: "Standard Compliance"
  },
  {
    title: "BIS Certified",
    subtitle: "Bureau of Indian Standards compliance for premium seating ergonomics and safety.",
    whyTitle: "WHY ASTRIDE IS BETTER THAN COMPETITORS?",
    whyPoints: [
      { title: "National Standards", desc: "Rigorous testing to meet Indian statutory benchmarks for structural safety." },
      { title: "Enhanced Ergonomics", desc: "Specifically certified for physiological support during long working hours." },
      { title: "Material Integrity", desc: "Non-toxic, premium fire-retardant foam and high-grade plastics verified by BIS lab tests." },
      { title: "Climate Resilience", desc: "Materials tested to endure India's high humidity and temperature variations without degrading." },
      { title: "Optimized Dimensions", desc: "Dimensions optimized specifically for the average body heights and seating preferences of Indian professionals." }
    ],
    pdfUrl: "/Pdf/BIS_Test_Report.pdf",
    bgColor: "#3c1033",
    accentColor: "#f472b6",
    footerLeft: "Status: Active",
    footerRight: "BIS: Compliant",
    icon: BisIcon,
    iframeHeight: "600px",
    regNo: "BIS Test Report"
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
  const swiper = useSwiper();
  const [isFlipped, setIsFlipped] = useState(false);
  // Track if the back panel has ever been opened to lazily render the iframe
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent.toLowerCase();
      setIsAndroid(/android/i.test(ua));
    }
  }, []);

  const handleFlipTrue = () => {
    setIsFlipped(true);
    if (!hasBeenOpened) setHasBeenOpened(true);
    if (swiper && swiper.autoplay) {
      swiper.autoplay.stop();
    }
  };

  const handleFlipFalse = () => {
    setIsFlipped(false);
    setZoom(1);
    if (swiper && swiper.autoplay) {
      swiper.autoplay.start();
    }
  };

  return (
    <div className="w-full relative h-[640px] sm:h-[580px] flex flex-col" style={{ perspective: "1000px" }}>
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
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-black/20 flex items-center justify-center shrink-0">
                  <Icon size={28} stroke={2.5} style={{ color: accentColor }} />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-black truncate" style={{ color: accentColor }}>
                  {title}
                </h3>
              </div>
              <button 
                type="button"
                onClick={handleFlipTrue}
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
                <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center shrink-0">
                  <Icon size={22} stroke={2.5} style={{ color: accentColor }} />
                </div>
                <h3 className="text-base font-black truncate text-white">
                  {title} PDF
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!isAndroid && (
                  <div className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-lg border border-white/5">
                    <button
                      type="button"
                      onClick={() => setZoom(z => Math.max(1, z - 0.25))}
                      disabled={zoom <= 1}
                      className="w-6 h-6 rounded-md bg-black/25 hover:bg-black/40 text-white font-bold flex items-center justify-center text-xs disabled:opacity-40 transition-all active:scale-90 cursor-pointer"
                      title="Zoom Out"
                    >
                      −
                    </button>
                    <span className="text-[10px] font-mono font-bold text-white/90 min-w-[32px] text-center select-none">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoom(z => Math.min(2.5, z + 0.25))}
                      disabled={zoom >= 2.5}
                      className="w-6 h-6 rounded-md bg-black/25 hover:bg-black/40 text-white font-bold flex items-center justify-center text-xs disabled:opacity-40 transition-all active:scale-90 cursor-pointer"
                      title="Zoom In"
                    >
                      +
                    </button>
                  </div>
                )}
                <button 
                  type="button"
                  onClick={handleFlipFalse}
                  className="text-[11px] font-black bg-black/25 hover:bg-black/40 px-2.5 py-1.5 rounded-lg transition-all duration-200 active:scale-95 text-white cursor-pointer"
                >
                  Back ⟲
                </button>
              </div>
            </div>
            
            <div className="w-full flex-1 rounded-xl overflow-auto bg-black/35 border border-white/5 relative scrollbar-none">
              {/* Performance improvement: Lazy load iframes only upon actual user card flip action */}
              {hasBeenOpened ? (
                isAndroid ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center gap-4 min-h-[260px]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={accentColor}
                      strokeWidth="2"
                      className="w-12 h-12 animate-pulse"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <div className="space-y-1">
                      <p className="text-white font-bold text-sm">Preview Unavailable</p>
                      <p className="text-white/60 text-xs px-2">Android devices do not support inline PDF viewing.</p>
                    </div>
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-white text-black font-extrabold rounded-xl text-xs hover:bg-white/90 transition duration-200 active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      Open PDF Certificate
                    </a>
                  </div>
                ) : (
                  <iframe 
                    src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`} 
                    className="border-0 min-h-[260px]"
                    style={{ 
                      width: `${100 * zoom}%`,
                      height: `calc(${iframeHeight} * ${zoom})`,
                      pointerEvents: "auto",
                      transition: "width 0.2s ease, height 0.2s ease",
                    }}
                    title={`${title} Certificate`}
                    loading="lazy"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
                  Loading Preview...
                </div>
              )}
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
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { margin: "0px" });
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  useEffect(() => {
    if (swiperInstance && !swiperInstance.destroyed && swiperInstance.autoplay) {
      try {
        if (isInView) {
          swiperInstance.autoplay.start();
        } else {
          swiperInstance.autoplay.stop();
        }
      } catch (err) {}
    }
  }, [isInView, swiperInstance]);

  return (
    <section ref={sectionRef} className="w-full pt-8  px-5 md:px-8 lg:px-16 overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
      <style jsx global>{`
        .cert-swiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.3) !important;
          opacity: 1 !important;
        }
        .cert-swiper .swiper-pagination-bullet-active {
          background: #9333EA !important;
        }
        .cert-swiper.swiper {
          overflow: hidden !important;
          padding-bottom: 40px !important;
          }
        .cert-swiper .swiper-pagination {
          bottom: 5px !important;
        }
      `}</style>

      {/* Performance improvement: Changed initial to false. Because animate="visible" matches layout 
          specifications, initial="visible" forces Framer Motion to run state-calculations 
          pre-mount, causing unneeded CPU overhead. */}
      <motion.div
        variants={containerVariants}
        initial={false}
        animate="visible"
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

        {/* RESPONSIVE CAROUSEL */}
        <div className="w-full pb-5">
          <Swiper
            onSwiper={setSwiperInstance}
            modules={SWIPER_MODULES}
            pagination={SWIPER_PAGINATION_CONFIG}
            autoplay={SWIPER_AUTOPLAY_CONFIG}
            loop={CERTS_DATA.length >= 4}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              768: {
                slidesPerView: 2,
              }
            }}
            className="cert-swiper w-full"
          >
            {CERTS_DATA.map((cert, idx) => (
              <SwiperSlide key={idx}>
                <CertCard {...cert} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </motion.div>
    </section>
  );
};

export default CertificationsBento;