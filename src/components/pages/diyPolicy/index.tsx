'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function DiyPolicyPage() {
  return (
    <main className="bg-[#F8F9FA] text-[#161316] min-h-screen pb-24" style={{ fontFamily: '"Inter", sans-serif' }}>
      {/* ── HEADER BANNER ── */}
      <div className="bg-[#161316] text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-zinc-200/[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] mb-4"
          >
            ASTRIDE[MBTC INTRAFURNISH PRIVATE LIMITED] 
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl font-extrabold uppercase tracking-[0.05em] text-white font-sans"
          >
            DIY Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-sm max-w-xl mx-auto mt-4 leading-relaxed font-light"
          >
            Assembly & Installation Guidelines for Astride Ergonomic Products
          </motion.p>
        </div>
      </div>

      {/* ── CONTENT CONTAINER ── */}
      <div className="max-w-3xl mx-auto px-6 mt-16 space-y-8">

        {/* Section 1: Self-Assembly Concept */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-zinc-200/60 rounded-3xl p-8 hover:border-zinc-800 transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.01)]"
        >
          <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-tight mb-4">
            Do-It-Yourself (DIY) Assembly
          </h3>
          <p className="text-zinc-600 text-base leading-relaxed font-light mb-4">
            All Astride products are designed for effortless, hassle-free self-assembly. Each package contains precision-engineered parts and basic tools required to set up your furniture quickly.
          </p>
        </motion.div>

        {/* Section 2: Onsite Service Availability */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-zinc-200/60 rounded-3xl p-8 hover:border-zinc-800 transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.01)]"
        >
          <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-tight mb-4">
            Onsite Assembly Service
          </h3>
          <p className="text-zinc-600 text-base leading-relaxed font-light">
            <strong className="font-semibold text-zinc-950">No onsite assembly service is available.</strong> Our products are strictly shipped for self-assembly by the customer.
          </p>
        </motion.div>

        {/* Section 3: Installation Manuals & Video Guides */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-zinc-200/60 rounded-3xl p-8 hover:border-zinc-800 transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.01)]"
        >
          <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-tight mb-4">
            Installation Manuals & Assistance
          </h3>
          <p className="text-zinc-600 text-base leading-relaxed font-light">
            Need help assembling your product? <strong className="font-semibold text-zinc-950">On request, we can provide digital installation manuals</strong> and step-by-step assembly guides/videos to assist you. Simply reach out to our customer support team with your order details.
          </p>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#161316] text-white rounded-3xl p-8 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.02] rounded-full blur-2xl" />
          <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">
            Request Assembly Manual
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-light">
            To request an installation manual or assembly guidance, contact us:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-semibold tracking-wider uppercase">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center">
              <span className="text-zinc-500 text-[10px] mb-1">Email</span>
              <span className="text-white text-xs sm:text-sm">support@astride.in</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center">
              <span className="text-zinc-500 text-[10px] mb-1">Phone / WhatsApp</span>
              <span className="text-white text-xs sm:text-sm">+91-7311164111</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
