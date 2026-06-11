"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  IconCertificate,
  IconShieldCheck,
  IconArmchair,
  IconAward,
  IconWorldCheck,
  IconDownload
} from '@tabler/icons-react';

const dummyPdf = "data:application/pdf;base64,JVBERi0xLjQKJdfluqgKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqMiAwIG9iajw8L1R5cGUvUGFnZXMvQ291bnQgMS9LaWRzWzMgMCBSXT4+ZW5kb2JqMyAwIG9iajw8L1R5cGUvUGFnZS9QYXJlbnQgMiAwIFIvTWVkaWFCb3hbMCAwIDU5NSA4NDJdL0NvbnRlbnRzIDQgMCBSPj5lbmRvYmo0IDAgb2JqPDwvTGVuZ3RoIDU+PnN0cmVhbQplbmRzdHJlYW1lbmRvYmoKdHJhaWxlcjw8L1NpemUgNS9Sb290IDEgMCBSPj4lJUVPRg==";

const marqueeItems = [
  { icon: IconCertificate, label: 'ISO 9001:2015', color: 'text-[#93c5fd]' },
  { icon: IconShieldCheck, label: 'TÜV Rheinland', color: 'text-[#86efac]' },
  { icon: IconArmchair, label: 'ANSI BIFMA X5.1', color: 'text-[#fde047]' },
  { icon: IconAward, label: 'EGAC accredited', color: 'text-[#93c5fd]' },
  { icon: IconWorldCheck, label: 'IAF recognized', color: 'text-[#86efac]' },
];

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
    <section className="w-full pt-8 pb-16 px-5 md:px-8 lg:px-16 overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div variants={itemVariants} className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] text-transparent bg-clip-text uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Backed By Standards
            </h2>
            <p className="text-sm font-medium text-zinc-400" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Quality, safety and durability — independently verified
            </p>
          </div>
          
          <a
            href={dummyPdf}
            download="all-certificates.pdf"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white text-white hover:text-[#1a1a1a] font-black px-5 py-2.5 rounded-xl transition-all duration-200 text-xs tracking-wider uppercase w-fit cursor-pointer group"
          >
            <IconDownload size={16} stroke={2.5} className="text-white group-hover:text-[#1a1a1a] transition-colors duration-200" />
            Download All PDFs
          </a>
        </motion.div>

        {/* Marquee strip */}
        <motion.div
          variants={itemVariants}
          className="overflow-hidden rounded-xl bg-[#222] py-3 mb-6"
          style={{
            maskImage:
              'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
            WebkitMaskImage:
              'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
          }}
        >
          <div className="flex w-max animate-marquee">
            {Array.from({ length: 4 }).map((_, trackIdx) => (
              <div key={trackIdx} className="flex items-center gap-12 pr-12 whitespace-nowrap">
                {marqueeItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-2 text-xs font-black ${item.color} uppercase tracking-wider whitespace-nowrap opacity-90`}
                    >
                      <Icon size={18} stroke={2.5} className={item.color} />
                      {item.label}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-5">
          {/* Featured card - ISO */}
          <motion.div variants={itemVariants} className="md:row-span-2 bg-[#2c405a] rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-xl bg-black/20 flex items-center justify-center mb-6">
                <IconCertificate size={24} stroke={2.5} className="text-[#93c5fd]" />
              </div>
              <h3 className="text-2xl font-semibold text-[#93c5fd] mb-3">
                ISO 9001:2015
              </h3>
              <p className="text-[15px] text-blue-100/90 leading-relaxed mb-8">
                Quality management system for the manufacturing and supply of
                revolving chairs. Audited and accredited under EGAC, IAF code 23.
              </p>
              
              <a 
                href={dummyPdf} 
                download="iso-certificate.pdf" 
                className="inline-flex items-center gap-2 bg-black/20 hover:bg-black/40 text-[#93c5fd] font-medium px-4 py-2 rounded-xl transition-all duration-200 text-sm w-fit cursor-pointer group"
              >
                <IconDownload size={16} stroke={2.5} className="text-[#93c5fd]" />
                Certificate
              </a>
            </div>
            <div className="mt-8 pt-5 border-t border-white/10">
              <div className="flex justify-between text-sm py-2">
                <span className="text-blue-200/60 font-medium">Number</span>
                <span className="font-mono text-blue-100 font-medium">25EQQW45</span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="text-blue-200/60 font-medium">Valid until</span>
                <span className="text-blue-100 font-medium">12 Jan 2029</span>
              </div>
            </div>
          </motion.div>

          {/* TUV card */}
          <motion.div variants={itemVariants} className="bg-[#1f4b23] rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="flex items-start sm:items-center justify-between mb-4 flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-3">
                  <IconShieldCheck size={28} stroke={2} className="text-[#86efac]" />
                  <h3 className="text-xl font-semibold text-[#86efac]">
                    TÜV Rheinland
                  </h3>
                </div>
                <a 
                  href={dummyPdf} 
                  download="tuv-certificate.pdf" 
                  className="inline-flex items-center justify-center w-9 h-9 shrink-0 rounded-xl bg-black/20 text-[#86efac] hover:bg-black/40 transition-all cursor-pointer"
                  title="Download TUV Certificate"
                >
                  <IconDownload size={18} stroke={2} />
                </a>
              </div>
              <p className="text-[15px] text-green-100/90 leading-relaxed">
                Performance and safety test, passed with full compliance.
              </p>
            </div>
            <p className="text-xs font-mono text-green-200/60 mt-6">
              IN25N16F 001 · Jan 2026
            </p>
          </motion.div>

          {/* ANSI card */}
          <motion.div variants={itemVariants} className="bg-[#6b4e16] rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="flex items-start sm:items-center justify-between mb-4 flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-3">
                  <IconArmchair size={28} stroke={2} className="text-[#fde047]" />
                  <h3 className="text-xl font-semibold text-[#fde047]">
                    ANSI BIFMA X5.1
                  </h3>
                </div>
                <a 
                  href={dummyPdf} 
                  download="ansi-certificate.pdf" 
                  className="inline-flex items-center justify-center w-9 h-9 shrink-0 rounded-xl bg-black/20 text-[#fde047] hover:bg-black/40 transition-all cursor-pointer"
                  title="Download ANSI Certificate"
                >
                  <IconDownload size={18} stroke={2} />
                </a>
              </div>
              <p className="text-[15px] text-yellow-100/90 leading-relaxed">
                General-purpose office chair durability standard, 2017 (R2022).
              </p>
            </div>
            <p className="text-xs font-mono text-yellow-200/60 mt-6">
              Result: Pass
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default CertificationsBento;

