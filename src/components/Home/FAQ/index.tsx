'use client';

import React, { useState } from 'react';
import { Plus_Jakarta_Sans } from "next/font/google";

const sans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-sans",
});

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How does the 30-day workspace trial work?",
    answer: "Try any ASTRIDE® chair in your actual workspace for 30 days. Not feeling it? Return it within the window for a hassle-free, full refund."
  },
  {
    question: "Are the chairs difficult to assemble?",
    answer: "Nope. Step-by-step instructions, an assembly video, and all the tools come in the box. Most people are sitting pretty in 10–15 minutes."
  },
  {
    question: "Can I pay in monthly installments?",
    answer: "Yes — flexible, interest-free monthly plans through our partner payment providers. Pick your plan at checkout."
  },
  {
    question: "How is the dynamic lumbar support different?",
    answer: "Unlike static supports, ours responds and auto-adjusts to your posture and movement in real time — continuous lower-back support all day."
  },
  {
    question: "What's the shipping cost and timeline?",
    answer: "Free standard shipping on all orders. Delivery typically lands in 3–7 business days depending on your address."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className={`w-full pt-2 pb-8 md:pt-4 md:pb-16 bg-[#FAFAFA] border-t border-neutral-100 ${sans.className}`} id="faq">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-20 items-start">
        
        {/* Left Column */}
        <div className="lg:col-span-5 flex flex-col items-center text-center lg:items-start lg:text-left gap-4 lg:sticky lg:top-24 self-start">
          <div className="flex items-center gap-2 justify-center lg:justify-start">
            <div className="w-6 h-px bg-neutral-400" />
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.28em]">
              Support &amp; Clarity
            </span>
            <div className="w-6 h-px bg-neutral-400 lg:hidden" />
          </div>

          <h2 className={`text-4xl md:text-5xl lg:text-6xl ${sans.className} text-[#131313] font-black tracking-tight leading-[1.05]`}>
            Frequently
            <br />
            <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent font-extralight tracking-normal text-5xl md:text-6xl lg:text-7xl">
              asked.
            </span>
          </h2>

          <p className="text-neutral-500 text-sm md:text-[15px] font-medium leading-relaxed max-w-xs mx-auto lg:mx-0 mt-1">
            Everything you need to know about our ergonomic technology,
            trial policies, and purchasing experience.
          </p>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-7 flex flex-col w-full">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className="bg-white border-[2.5px] border-[#131313] rounded-[14px] mb-[16px] shadow-[5px_5px_0_#131313] overflow-hidden"
              >
                <button 
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center gap-[18px] bg-transparent border-none text-left py-[20px] px-[22px] font-bold text-[16px] md:text-[17px] text-[#131313] cursor-pointer"
                >
                  <span className="font-black text-[15px] text-[#EC4899] flex-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{item.question}</span>
                  <span 
                    className={`ml-auto flex-none w-[30px] h-[30px] rounded-full flex items-center justify-center text-[19px] font-bold transition-transform duration-[250ms] border-2 border-[#131313] ${
                      isOpen ? 'rotate-45 bg-[#EC4899] text-white' : 'bg-[#DCF351] text-[#131313]'
                    }`}
                  >
                    +
                  </span>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-out`}
                  style={{ maxHeight: isOpen ? '500px' : '0' }}
                >
                  <p className="px-[22px] pb-[22px] pl-[60px] text-[#444] text-[14.5px] font-medium leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}