'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function CancellationPolicyPage() {
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
            Cancellation Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-sm max-w-xl mx-auto mt-4 leading-relaxed font-light"
          >
            Please read our cancellation policy guidelines carefully.
          </motion.p>
        </div>
      </div>

      {/* ── CONTENT CONTAINER ── */}
      <div className="max-w-3xl mx-auto px-6 mt-16 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-zinc-200/60 rounded-3xl p-8 hover:border-zinc-800 transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.01)]"
        >
          <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-tight mb-4">
            Can I cancel my order?
          </h3>
          <p className="text-zinc-600 text-base leading-relaxed font-light">
            Orders can be canceled within <strong className="font-semibold text-zinc-950">24 hours</strong> of placing the order, only if the order has not been dispatched. Once the order is shipped, cancellations or refunds are not possible.
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
            Contact Us
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-light">
            For cancellation requests, please reach out to us:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-semibold tracking-wider uppercase">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center">
              <span className="text-zinc-500 text-[10px] mb-1">Email</span>
              <span className="text-white text-xs sm:text-sm">support@astride.in</span>
              
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center">
              <span className="text-zinc-500 text-[10px] mb-1">Phone</span>
              <span className="text-white text-xs sm:text-sm">+91-7311164111</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
