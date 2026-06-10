'use client';

import React from 'react';
import { motion } from 'framer-motion';

const sections = [
  { id: 'definitions', title: '1. Definitions', content: 'Definitions used in this policy, including Data, Cookies, Astride, and User.' },
  { id: 'data-collected', title: '2. Data Collected', content: 'Categories of Data collected: Name, Email Address, Address, PIN code, Debit/Credit card details, password, occupation, interests, and similar details.' },
  { id: 'manner-collection', title: '3. Manner of Collection', content: 'Collected directly when given to us by you, or automatically recorded pursuant to your visit to the Website.' },
  { id: 'shared-by-you', title: '4. Manner Shared by You', content: 'For instance, when you contact us, register to receive products/services/newsletters, complete surveys, or enter promotions.' },
  { id: 'auto-collected', title: '5. Automatically Collected Data', content: 'System data recorded during visits including your IP address, browser type, and navigation paths.' },
  { id: 'use-of-data', title: '6. Our Use of Data', content: 'Required for improving products/services, transmission of marketing materials, record-keeping, and processing requests.' },
  { id: 'data-sharing', title: '7. Who We Share Data With', content: 'Shared with affiliates, employees, vendors, agents, advisors, and service providers assisting website operations.' },
  { id: 'security', title: '8. Keeping Data Secure', content: 'Technical and organisational measures are utilized to safeguard your Data on secure servers.' },
  { id: 'retention', title: '9. Retention of Personal Data', content: 'Retained as long as necessary to provide access, comply with legal obligations, and resolve disputes.' },
  { id: 'your-rights', title: '10. Your Rights', content: 'Right to review, correct, update, or withdraw consent regarding personal data provided to us.' },
  { id: 'security-data', title: '11. Security of Personal Data', content: 'Astride uses standard security technologies and procedures to protect your Data from unauthorized access.' },
  { id: 'third-party-links', title: '12. Links to Other Websites', content: 'Our website may contain links to third-party websites; we are not responsible for their privacy practices.' },
  { id: 'non-personal-info', title: '13. Non-Personal Information', content: 'Collection and use of non-personal information such as browser type and aggregated data to improve services.' },
  { id: 'cookies', title: '14. Cookies', content: 'This website may place cookies on your computer to improve your experience. You may disable cookies through browser settings.' },
  { id: 'general', title: '15. General', content: 'If any provision of this Privacy Policy is found invalid or unenforceable, the remaining provisions remain valid.' },
  { id: 'changes', title: '16. Changes to this Privacy Statement', content: 'Astride reserves the right to change this Privacy Policy at any time. Changes will be posted on this website.' }
];

export default function PrivacyPolicyPage() {
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
            Astride Private Limited
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl font-extrabold uppercase tracking-[0.05em] text-white font-sans"
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-sm max-w-xl mx-auto mt-4 leading-relaxed font-light"
          >
            Your privacy is important to us. Astride Private Limited (“Astride”, “we” or “us”) takes the privacy of your personal information seriously.
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
          </ul>
        </aside>

        {/* Policy Body */}
        <div className="space-y-8">
          <div className="bg-white border border-zinc-200/60 rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <h2 className="text-xl font-bold mb-4 text-zinc-900">Consent & Scope</h2>
            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-light">
              This privacy policy (“Privacy Policy”) explains what personal information we collect from you, through our interactions with you on this website, and how we use that personal information.
              By providing your consent to this Privacy Policy in the manner prescribed below, you indicate that you understand, agree and consent to this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not use this Website. You further agree that such collection, use, storage and transfer of the Data shall not cause any loss or wrongful gain to you or any other person.
            </p>
          </div>

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
        </div>
      </div>
    </main>
  );
}
