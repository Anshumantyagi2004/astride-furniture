'use client';

import React, { useState, useEffect, useRef } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How does the 30-day workspace trial work?",
    answer:
      "We offer a 30-day trial period so you can experience ASTRIDE® chairs in your actual workspace. If you are not completely satisfied, you can return the chair within 30 days for a hassle-free, full refund."
  },
  {
    question: "Are the chairs difficult to assemble?",
    answer:
      "No, our chairs are designed for quick and easy assembly. We provide step-by-step instructions, an assembly video, and all necessary tools in the package. Most users complete assembly in 10 to 15 minutes."
  },
  {
    question: "Can I pay in monthly installments?",
    answer:
      "Yes, we offer flexible, interest-free monthly installment plans through our partner payment providers. You can easily select your preferred plan at checkout."
  },
  {
    question: "How is the dynamic lumbar support different?",
    answer:
      "Unlike traditional static supports, our dynamic lumbar support automatically responds and auto-adjusts to your posture and movements in real-time, providing continuous, ergonomic lower-back support."
  },
  {
    question: "What is the shipping cost and timeline?",
    answer:
      "We provide free standard shipping on all orders. Standard delivery typically takes 3 to 7 business days, depending on your shipping address."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full select-none border-t border-neutral-100 overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #F5F5F5 0%, #EFEFEF 100%)'
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-20 items-start">

        {/* Left Column */}
        <div
          className={`lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-24 self-start transition-all duration-700 ease-out ${
            visible
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-8'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-px bg-neutral-400" />
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.28em]">
              Support &amp; Clarity
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl text-neutral-900 font-black tracking-tight leading-[1.05] uppercase">
            Frequently
            <br />
            <span className="text-neutral-400 font-extralight italic normal-case tracking-normal text-5xl md:text-6xl lg:text-7xl">
              asked.
            </span>
          </h2>

          <p className="text-neutral-500 text-sm md:text-[15px] font-medium leading-relaxed max-w-xs mt-1">
            Everything you need to know about our ergonomic technology,
            trial policies, and purchasing experience.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-white/80 border border-neutral-200 rounded-full px-4 py-2 w-fit shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-bold text-neutral-600 tracking-wide">
              {faqData.length} questions answered
            </span>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-7 flex flex-col">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                style={{
                  transitionDelay: `${index * 80}ms`
                }}
                className={`border-b border-neutral-200/70 rounded-lg px-2 transition-all duration-500 ease-out ${
                  visible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
                } ${
                  isOpen
                    ? 'bg-white/60'
                    : 'hover:bg-white/40'
                }`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full py-5 md:py-6 flex justify-between items-center text-left gap-6 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`text-xs font-black mt-1 tabular-nums transition-colors duration-300 ${
                        isOpen
                          ? 'text-neutral-900'
                          : 'text-neutral-300'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span
                      className={`text-base md:text-[17px] font-bold tracking-tight transition-colors duration-300 ${
                        isOpen
                          ? 'text-neutral-950'
                          : 'text-neutral-600'
                      }`}
                    >
                      {item.question}
                    </span>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border transition duration-300 ${
                      isOpen
                        ? 'bg-neutral-900 border-neutral-900 rotate-45'
                        : 'border-neutral-200'
                    }`}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M6 1V11M1 6H11"
                        stroke={isOpen ? 'white' : '#9CA3AF'}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    isOpen
                      ? 'max-h-40 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pb-5 pl-10 pr-4 text-[14px] md:text-[15px] text-neutral-500 leading-relaxed font-medium">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}