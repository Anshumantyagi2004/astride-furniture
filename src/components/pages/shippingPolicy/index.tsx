'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Span } from 'next/dist/trace';

export default function ShippingPolicyPage() {
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
            Astride[MBTC INTRAFURNISH PRIVATE LIMITED] 
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl font-extrabold uppercase tracking-[0.05em] text-white font-sans"
          >
            Shipping Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-sm max-w-xl mx-auto mt-4 leading-relaxed font-light"
          >
            Please read our shipping and delivery timelines and guidelines.
          </motion.p>
        </div>
      </div>

      {/* ── CONTENT CONTAINER ── */}
      <div className="max-w-3xl mx-auto px-6 mt-16 space-y-8">
        
        {/* General Info */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-zinc-200/60 rounded-3xl p-8 hover:border-zinc-800 transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.01)]"
        >
          <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-tight mb-4">
            Shipping & Delivery Timelines
          </h3>
          <p className="text-zinc-600 text-base leading-relaxed font-light mb-4">
            Delivery timelines are estimates and may vary depending on location and external factors.
          </p>
          <p className="text-zinc-600 text-base leading-relaxed font-light">
            Astride[MBTC INTRAFURNISH PRIVATE LIMITED] is not liable for delays caused by courier services or unforeseen circumstances beyond our control.
          </p>
        </motion.div>

        {/* ── TRANSIT TIMES TABLE ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-zinc-200/60 rounded-3xl p-6 sm:p-8 hover:border-zinc-800 transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.01)]"
        >
          <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-tight mb-6">
            Estimated Transit Times
          </h3>
          
          {/* Mobile optimized overflow container */}
          <div className="w-full overflow-x-auto rounded-2xl border border-zinc-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  <th className="px-4 sm:px-6 py-4 text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Location / City Type
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Estimated Delivery Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-zinc-900">
                    Metropolitan Cities
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-zinc-600">
                    5 - 7 Days
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-zinc-900">
                    Urban Cities (Tier 2/3)
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-zinc-600">
                    7 - 12 Days
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ── CONTACT SECTION ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#161316] text-white rounded-3xl p-8 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.02] rounded-full blur-2xl" />
          <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">
            Contact Us
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-light">
            For shipping and logistics queries, please reach out to us:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-semibold tracking-wider uppercase">
            <div  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center">
              <span className="text-zinc-500 text-[10px] mb-1">Email</span>
              <a href="mailto:support@astride.in" className="text-white text-xs sm:text-sm">support@astride.in</a>
              <a href="mailto:sales@astride.in" className="text-white text-xs sm:text-sm mt-1">sales@astride.in</a>
            </div>
            <a href="tel:+917311164111"  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center">
              <span className="text-zinc-500 text-[10px] mb-1">Phone</span>
              <span  className="text-white text-xs sm:text-sm">+91-7311164111</span> 
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}