"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IconCertificate,
  IconArmchair,
  IconDownload
} from '@tabler/icons-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 120,
    },
  },
};

interface WhyPoint {
  title: string;
  desc: string;
}

interface CertCardProps {
  title: string;
  subtitle: string;
  whyTitle: string;
  whyPoints: WhyPoint[];
  pdfUrl: string;
  bgColor: string;
  accentColor: string;
  footerLeft: string;
  footerRight: string;
  icon: React.ComponentType<any>;
  iframeHeight?: string;
  regNo?: string;
}

const CertCard = ({ 
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
    <div className="w-full relative" style={{ height: "440px", perspective: "1000px" }}>
      <div 
        style={{
          width: "100%",
          height: "100%",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          position: "relative"
        }}
      >
        {/* FRONT SIDE */}
        <div 
          className="rounded-2xl pt-4 pb-6 px-4 md:px-5 flex flex-col justify-between border border-white/5 shadow-lg absolute inset-0"
          style={{
            backgroundColor: bgColor,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center shrink-0">
                  <Icon size={22} stroke={2.5} style={{ color: accentColor }} />
                </div>
                <h3 className="text-xl font-bold truncate" style={{ color: accentColor }}>
                  {title}
                </h3>
              </div>
              <button 
                onClick={() => setIsFlipped(true)}
                className="text-xs font-bold bg-black/20 hover:bg-black/40 px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer text-white"
              >
                Verify Certificate ⟲
              </button>
            </div>
            
            <p className="text-[15.5px] font-medium text-white leading-relaxed mb-4">
              {subtitle}
            </p>

            <div className="space-y-3 bg-black/20 p-4.5 rounded-xl border border-white/5 shadow-inner">
              <h4 className="text-[12px] uppercase tracking-wider font-black text-white/90" style={{ color: accentColor }}>
                {whyTitle}
              </h4>
              <div className="space-y-3">
                {whyPoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-[16px] leading-relaxed">
                    <span className="text-[18px] shrink-0 leading-none select-none" style={{ color: accentColor }}>✓</span>
                    <p className="text-white/90">
                      <strong className="text-white font-bold">{pt.title}:</strong> {pt.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-3.5 pt-3 border-t border-white/10 flex justify-between items-center text-[13px] text-white/70">
            <span className="font-semibold text-white/95">{footerLeft}</span>
            <span className="bg-black/20 px-2.5 py-0.5 rounded-md font-bold text-white">
              {footerRight}
            </span>
          </div>
        </div>

        {/* BACK SIDE */}
        <div 
          className="rounded-2xl pt-4 pb-6 px-4 md:px-5 flex flex-col justify-between border border-white/5 shadow-lg absolute inset-0"
          style={{
            backgroundColor: bgColor,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center shrink-0">
                  <Icon size={18} stroke={2.5} style={{ color: accentColor }} />
                </div>
                <h3 className="text-lg font-bold truncate text-white">
                  {title} PDF
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => setIsFlipped(false)}
                  className="text-xs font-bold bg-black/20 hover:bg-black/40 px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95 text-white cursor-pointer"
                >
                  Back ⟲
                </button>
              </div>
            </div>
            
            {/* Scrollable PDF viewer */}
            <div className="w-full h-[275px] rounded-xl overflow-y-auto bg-black/35 border border-white/5 relative scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <iframe 
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`} 
                className="w-full border-0"
                style={{ 
                  height: iframeHeight,
                  pointerEvents: "auto"
                }}
                title={`${title} Certificate`}
              />
            </div>
          </div>
          
          <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center text-xs text-white/50">
            <span>Scroll inside window to view certificate</span>
            {regNo && (
              <span className="font-mono bg-black/20 px-2 py-0.5 rounded-md text-white/85">
                {regNo}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CertificationsBento = () => {
  return (
    <section className="w-full pt-8 pb-8 px-5 md:px-8 lg:px-16 overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
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

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ISO Card */}
          <motion.div variants={itemVariants}>
            <CertCard 
              title="ISO 9001:2015"
              subtitle="Quality management system for the manufacturing and supply of revolving chairs."
              whyTitle="WHY ASTRIDE IS BETTER THAN COMPETITORS?"
              whyPoints={[
                { title: "Standardized Quality", desc: "Unlike generic brands with volatile quality, Astride implements ISO-audited repeatable assembly lines." },
                { title: "Defect-Free Guarantee", desc: "Our certified production workflow virtually eliminates component mismatches and visual flaws." },
                { title: "Strict Quality Control", desc: "Every batch undergoes rigorous quality-gate tests before leaving our manufacturing unit." }
              ]}
              pdfUrl="/Pdf/pdf_2.pdf"
              bgColor="#2c405a"
              accentColor="#93c5fd"
              footerLeft="Status: Active"
              footerRight="Audit: Passed"
              icon={IconCertificate}
              iframeHeight="550px"
              regNo="Reg: 25EQQW45"
            />
          </motion.div>

          {/* ANSI BIFMA Card */}
          <motion.div variants={itemVariants}>
            <CertCard 
              title="ANSI BIFMA X5.1"
              subtitle="General-purpose office chair durability standard, 2017 (R2022)."
              whyTitle="WHY ASTRIDE IS BETTER THAN COMPETITORS?"
              whyPoints={[
                { title: "Ten-Year Durability", desc: "Astride swivels and tilts withstand 120,000+ extreme load cycles vs. competitors' quick wear." },
                { title: "Heavyweight Safety", desc: "Armrests, backrests, and premium cylinders secure heavy payloads without breaking or leaking." },
                { title: "Advanced Anti-Topple", desc: "Built with high-spec stability margins to prevent tipping at any dynamic tilt configurations." }
              ]}
              pdfUrl="/Pdf/BIFMA.pdf"
              bgColor="#1b3f2f"
              accentColor="#4ade80"
              footerLeft="Status: Active"
              footerRight="Safety: Certified"
              icon={IconArmchair}
              iframeHeight="1200px"
              regNo="Standard Compliance"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default CertificationsBento;