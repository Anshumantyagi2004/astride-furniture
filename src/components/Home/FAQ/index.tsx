'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How does the 30-day workspace trial work?",
    answer: "We offer a 30-day trial period so you can experience ASTRIDE® chairs in your actual workspace. If you are not completely satisfied, you can return the chair within 30 days for a hassle-free, full refund."
  },
  {
    question: "Are the chairs difficult to assemble?",
    answer: "No, our chairs are designed for quick and easy assembly. We provide step-by-step instructions, an assembly video, and all necessary tools in the package. Most users complete assembly in 10 to 15 minutes."
  },
  {
    question: "Can I pay in monthly installments?",
    answer: "Yes, we offer flexible, interest-free monthly installment plans through our partner payment providers. You can easily select your preferred plan at checkout."
  },
  {
    question: "How is the dynamic lumbar support different?",
    answer: "Unlike traditional static supports, our dynamic lumbar support automatically responds and auto-adjusts to your posture and movements in real-time, providing continuous, ergonomic lower-back support."
  },
  {
    question: "What is the shipping cost and timeline?",
    answer: "We provide free standard shipping on all orders. Standard delivery typically takes 3 to 7 business days, depending on your shipping address."
  }
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const leftVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      className="w-full select-none border-t border-neutral-100"
      style={{ background: 'linear-gradient(160deg, #F5F5F5 0%, #EFEFEF 100%)' }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-20 items-start">

        {/* ── Left Column — Sticky Heading ── */}
        <motion.div
          className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-24 self-start"
          variants={leftVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-px bg-neutral-400" />
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.28em]">
              Support &amp; Clarity
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-neutral-900 font-black tracking-tight leading-[1.05] uppercase">
            Frequently
            <br />
            <span className="text-neutral-400 font-extralight italic normal-case tracking-normal text-5xl md:text-6xl lg:text-7xl">
              asked.
            </span>
          </h2>

          {/* Description */}
          <p className="text-neutral-500 text-sm md:text-[15px] font-medium leading-relaxed max-w-xs mt-1">
            Everything you need to know about our ergonomic technology, trial policies, and purchasing experience.
          </p>

          {/* Stat pill */}
          <div className="mt-4 inline-flex items-center gap-2 bg-white/70 border border-neutral-200/60 backdrop-blur-sm rounded-full px-4 py-2 w-fit shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-neutral-600 tracking-wide">
              {faqData.length} questions answered
            </span>
          </div>
        </motion.div>

        {/* ── Right Column — Accordion ── */}
        <motion.div
          className="lg:col-span-7 flex flex-col"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`border-b border-neutral-200/70 transition-colors duration-300 ${
                  isOpen ? 'bg-white/60' : 'hover:bg-white/40'
                } rounded-lg px-2`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full py-5 md:py-6 flex justify-between items-center text-left gap-6 group cursor-pointer"
                >
                  {/* Number + Question */}
                  <div className="flex items-start gap-4">
                    <span className={`text-xs font-black mt-1 tabular-nums transition-colors duration-300 ${isOpen ? 'text-neutral-900' : 'text-neutral-300'}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-base md:text-[17px] font-bold tracking-tight transition-colors duration-300 ${
                      isOpen ? 'text-neutral-950' : 'text-neutral-600 group-hover:text-neutral-900'
                    }`}>
                      {item.question}
                    </span>
                  </div>

                  {/* Animated +/× icon */}
                  <motion.div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border transition-all duration-300 ${
                      isOpen
                        ? 'bg-neutral-900 border-neutral-900'
                        : 'bg-transparent border-neutral-200 group-hover:border-neutral-400'
                    }`}
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M6 1V11M1 6H11"
                        stroke={isOpen ? 'white' : '#9CA3AF'}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </motion.div>
                </button>

                {/* Animated Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        initial={{ y: -8 }}
                        animate={{ y: 0 }}
                        exit={{ y: -8 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="pb-5 pl-10 pr-4 text-[14px] md:text-[15px] text-neutral-500 leading-relaxed font-medium"
                      >
                        {item.answer}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
