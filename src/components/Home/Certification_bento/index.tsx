"use client";

import React from 'react';
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

const CertificationsBento = () => {
  return (
    <section className="w-full pt-6 pb-0 px-5 md:px-8 lg:px-16 overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div variants={itemVariants} className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] text-transparent bg-clip-text uppercase tracking-wider mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Backed By Standards
            </h2>
            <p className="text-sm font-medium text-zinc-400" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Quality, safety and durability — independently verified
            </p>
          </div>
          
          <a
            href="/Pdf/BIFMA.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white text-white hover:text-[#1a1a1a] font-black px-5 py-2.5 rounded-xl transition-all duration-200 text-xs tracking-wider uppercase w-fit cursor-pointer group"
          >
            <IconDownload size={16} stroke={2.5} className="text-white group-hover:text-[#1a1a1a] transition-colors duration-200" />
            View BIFMA PDF
          </a>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Featured card - ISO */}
          <motion.div variants={itemVariants} className="bg-[#2c405a] rounded-2xl pt-6 pb-9 px-6 md:pt-8 md:pb-10 md:px-8 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center shrink-0">
                    <IconCertificate size={22} stroke={2.5} className="text-[#93c5fd]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#93c5fd] truncate">
                    ISO 9001:2015
                  </h3>
                </div>
                <a 
                  href="/Pdf/pdf_2.pdf" 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-xl bg-black/20 hover:bg-black/40 flex items-center justify-center text-[#93c5fd] shrink-0 transition-all duration-200"
                  title="Open PDF"
                >
                  <IconDownload size={18} stroke={2.5} />
                </a>
              </div>
              <p className="text-[13px] text-blue-100/80 leading-relaxed mb-3">
                Quality management system for the manufacturing and supply of revolving chairs. Audited and accredited under EGAC, IAF code 23.
              </p>
              
              {/* UPDATED: Relative container with Absolute iframe */}
              <div className="w-full h-[600px] rounded-xl overflow-hidden bg-black/30 border border-white/5 relative transform" style={{ transform: "translateY(-20px)" }}>
                <iframe 
                  src="/Pdf/pdf_2.pdf#toolbar=0&navpanes=0" 
                  className="absolute w-full border-0"
                  style={{ 
                    height: "100%", 
                    top: "0", 
                    left: "0" 
                  }}
                  title="ISO 9001:2015 Certificate PDF"
                />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
              <div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-blue-200/60 font-medium">Number</span>
                  <span className="font-mono text-blue-100 font-medium">25EQQW45</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-blue-200/60 font-medium">Valid until</span>
                  <span className="text-blue-100 font-medium">12 Jan 2029</span>
                </div>
              </div>
              <span className="text-xs font-mono text-blue-200 bg-black/20 px-3 py-0.5 rounded-md">
                Result: N/A
              </span>
            </div>
          </motion.div>

          {/* ANSI card */}
          <motion.div variants={itemVariants} className="bg-[#6b4e16] rounded-2xl pt-6 pb-9 px-6 md:pt-8 md:pb-10 md:px-8 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center shrink-0">
                    <IconArmchair size={22} stroke={2} className="text-[#fde047]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#fde047] truncate">
                    ANSI BIFMA X5.1
                  </h3>
                </div>
                <a 
                  href="/Pdf/BIFMA.pdf" 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-xl bg-black/20 hover:bg-black/40 flex items-center justify-center text-[#fde047] shrink-0 transition-all duration-200"
                  title="Open PDF"
                >
                  <IconDownload size={18} stroke={2.5} />
                </a>
              </div>
              <p className="text-[13px] text-yellow-100/80 leading-relaxed mb-3">
                General-purpose office chair durability standard, 2017 (R2022).
              </p>
              
              {/* UPDATED: Relative container with Absolute iframe */}
              <div className="w-full h-[600px] rounded-xl overflow-hidden bg-black/30 border border-white/5 relative transform" style={{ transform: "translateY(0)" }}>
                <iframe 
                  src="/Pdf/BIFMA.pdf#toolbar=0&navpanes=0" 
                  className="absolute w-full border-0"
                  style={{ 
                    height: "100%", 
                    top: "0", 
                    left: "0" 
                  }}
                  title="ANSI BIFMA X5.1 PDF"
                />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
              <span className="text-yellow-200/60 text-xs font-medium">Verification Status</span>
              <span className="text-xs font-mono text-yellow-200 bg-black/20 px-3 py-0.5 rounded-md">
                Result: Pass
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default CertificationsBento;