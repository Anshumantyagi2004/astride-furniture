'use client';

import React from 'react';
import { motion } from 'framer-motion';

const sections = [
  { id: 'intro', title: '1. Introduction', content: 'Welcome to Astride. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions.' },
  { id: 'use', title: '2. Use of Website', content: 'You agree to use this website only for lawful purposes and in a way that does not infringe the rights of others or restrict their use.' },
  { id: 'product', title: '3. Product Information', content: 'We strive to ensure that all product details, pricing, and images are accurate. However, Astride reserves the right to modify or update information at any time without prior notice.' },
  { id: 'orders', title: '4. Orders & Payments', content: 'All orders placed through the website are subject to acceptance and availability. We reserve the right to cancel or refuse any order at our discretion.' },
  { id: 'shipping', title: '5. Shipping & Delivery', content: 'Delivery timelines are estimates and may vary depending on location and external factors. Astride is not liable for delays caused by courier or unforeseen circumstances.' },
  { id: 'returns', title: '6. Returns & Replacement', content: 'Products are eligible for replacement only in case of damaged, defective, or incorrect items, as per our Return & Refund Policy.' },
  { id: 'accounts', title: '7. User Accounts', content: 'You are responsible for maintaining the confidentiality of your account and password. Astride is not responsible for unauthorized access.' },
  { id: 'intellectual', title: '8. Intellectual Property', content: 'All content on this website including text, images, logos, and design is the property of Astride and may not be used without permission.' },
  { id: 'liability', title: '9. Limitation of Liability', content: 'Astride shall not be held liable for any indirect or consequential damages arising from the use of our website or products.' },
  { id: 'changes', title: '10. Changes to Terms', content: 'We reserve the right to update these terms at any time. Continued use of the website means you accept the updated terms.' }
];

export default function TermsConditionsPage() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <main className="bg-[#F8F9FA] text-[#161316] min-h-screen pb-24" style={{ fontFamily: '"Inter", sans-serif' }}>
      {/* ── HEADER BANNER ── */}
      <div className="bg-[#161316] text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-zinc-200/[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] mb-4"
          >
            Astride Agreement
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl font-extrabold uppercase tracking-[0.05em] text-white font-sans"
          >
            Terms & Conditions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-sm max-w-xl mx-auto mt-4 leading-relaxed font-light"
          >
            Please read these terms carefully before using Astride services.
          </motion.p>
        </div>
      </div>

      {/* ── CONTENT CONTAINER ── */}
      <div className="max-w-6xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-12">
        {/* Sticky Sidebar Navigation */}
        <aside className="hidden lg:block sticky top-28 h-fit max-h-[80vh] overflow-y-auto pr-4 border-r border-zinc-200/80">
          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-6">Contents</h3>
          <ul className="space-y-3 text-xs font-semibold text-zinc-500">
            {sections.map((sec) => (
              <li key={sec.id}>
                <button
                  onClick={() => scrollToSection(sec.id)}
                  className="hover:text-[#161316] transition-colors text-left"
                >
                  {sec.title}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => scrollToSection('contact')}
                className="hover:text-[#161316] transition-colors text-left font-bold"
              >
                11. Contact Us
              </button>
            </li>
          </ul>
        </aside>

        {/* Content cards */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((sec, index) => (
              <motion.div
                id={sec.id}
                key={sec.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white border border-zinc-200/60 rounded-3xl p-6 hover:border-zinc-800 transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.01)]"
              >
                <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight mb-3">
                  {sec.title}
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed font-light">
                  {sec.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div
            id="contact"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#161316] text-white rounded-3xl p-8 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.02] rounded-full blur-2xl" />
            <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">
              11. Contact Us
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-light">
              If you have any questions about these Terms & Conditions, please reach out to us:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-semibold tracking-wider uppercase">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center">
                <span className="text-zinc-500 text-[10px] mb-1">Email</span>
                <span className="text-white text-xs sm:text-sm">support@astride.in</span>
                <span className="text-white text-xs sm:text-sm mt-1">sales@astride.in</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center">
                <span className="text-zinc-500 text-[10px] mb-1">Phone</span>
                <span className="text-white text-xs sm:text-sm">+91-7311164111</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
