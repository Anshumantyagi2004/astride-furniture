'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function RefundPolicyPage() {
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
            ASTRIDE [MBTC INTRAFURNISH PRIVATE LIMITED]
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl font-extrabold uppercase tracking-[0.05em] text-white font-sans"
          >
            Refund Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-sm max-w-xl mx-auto mt-4 leading-relaxed font-light"
          >
            Please read our refund policy guidelines carefully.
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
          <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-tight mb-6">
            Refund & Cancellation Policy
          </h3>
          <ul className="space-y-4 text-zinc-600 text-base leading-relaxed font-light list-disc pl-5">
            <li>
              Returns are generally not available.
            </li>
            <li>
              In some cases, if the brand allows returns, the product may be eligible for a return.
            </li>
            <li>
              For approved returns, <strong className="font-semibold text-zinc-950">15% of the courier charges</strong> will be deducted from the refundable amount.
            </li>
            <li>
              Cancellation requests are accepted only before the order is dispatched.
            </li>
          </ul>
        </motion.div>

        {/* ── DEDUCTION TABLE & NOTE ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-zinc-200/60 rounded-3xl p-6 sm:p-8 hover:border-zinc-800 transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.01)]"
        >
          <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-tight mb-6">
            Refund Deductions Structure
          </h3>

          {/* Table */}
          <div className="w-full overflow-hidden rounded-2xl border border-zinc-100 mb-6">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  <th className="w-1/2 px-3 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Order Status
                  </th>
                  <th className="w-1/2 px-3 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Refund Deduction
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium text-zinc-900 break-words">
                    Before Dispatch
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-zinc-600 break-words">
                    2% processing charges
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium text-zinc-900 break-words">
                    After Dispatch
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-zinc-600 break-words">
                    3% of the order value
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium text-zinc-900 break-words">
                    In Transit
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-zinc-600 break-words">
                    15% of the order value
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Note Section */}
          <div className="border-t border-zinc-100 pt-6">
            <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-3">
              Note:
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600 font-light list-disc pl-5">
              <li>
                <strong className="font-semibold text-zinc-950">Cash on Delivery (COD)</strong> is not available as of Now.
              </li>
              <li>
                Refunds will be processed only after the returned product is received and passes the quality inspection (where applicable).
              </li>
            </ul>
          </div>
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
            For refund or replacement inquiries, please reach out to us:
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
