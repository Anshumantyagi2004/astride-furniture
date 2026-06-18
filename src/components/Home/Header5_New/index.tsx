"use client";

import { memo } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

// Move static configurations out of the runtime loop to optimize memory footprints
const CATEGORIES = [
  {
    label: "GAMING",
    desc: "Level up your game",
    bg: "#EDE9FE",
    color: "#8B5CF6",
    shadow: "rgba(139, 92, 246, 0.15)",
    link: "/products?category=Gaming%20Chair",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
        <rect x="2" y="7" width="20" height="12" rx="4" />
        <path d="M12 11v4M10 13h4" />
        <circle cx="7.5" cy="13" r="0.7" fill="currentColor" />
        <circle cx="16.5" cy="11.5" r="0.7" fill="currentColor" />
        <circle cx="16.5" cy="14.5" r="0.7" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "WORK",
    desc: "Built for focus & productivity",
    bg: "#FDE8D8",
    color: "#F97316",
    shadow: "rgba(249, 115, 22, 0.15)",
    link: "/products?category=Office%20Chair",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="8" y1="14" x2="16" y2="14" />
      </svg>
    ),
  },
  {
    label: "STUDY",
    desc: "Comfort for long study hours",
    bg: "#ECFCE5",
    color: "#22C55E",
    shadow: "rgba(34, 197, 94, 0.15)",
    link: "/products?category=Study%20Chair",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    label: "LIFESTYLE",
    desc: "Chill in style",
    bg: "#DBEAFE",
    color: "#3B82F6",
    shadow: "rgba(59, 130, 246, 0.15)",
    link: "/products?category=Bar%20Stool",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
        <path d="M8 3l4 8 4-8" />
        <path d="M5 3h14" />
        <path d="M12 11v10" />
        <path d="M8 21h8" />
      </svg>
    ),
  },
  {
    label: "NEW DROPS",
    desc: "Fresh designs every week",
    bg: "#FCE7F3",
    color: "#EC4899",
    shadow: "rgba(236, 72, 153, 0.15)",
    link: "/products",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
        <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
        <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" />
      </svg>
    ),
  },
];

// Instantiating framer motion descriptors outside components removes instantiation cost on updates
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.02 },
  },
};

const headingVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    rotateX: 25,
    rotateY: -15,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 175,
      damping: 16,
    },
  },
};

// Memoized Grid Card to isolate layout render threads
const GridCard = memo(({ cat }: { cat: typeof CATEGORIES[0] }) => (
  <motion.div
    variants={cardVariants}
    whileHover={{
      y: -10,
      scale: 1.03,
      boxShadow: `0 20px 30px -4px ${cat.shadow}, 0 4px 12px -2px ${cat.shadow}`,
      borderColor: cat.color
    }}
    whileTap={{ scale: 0.97 }}
    className="shrink-0 lg:shrink w-[180px] md:w-[200px] lg:w-auto rounded-2xl border-2 border-transparent transition-all duration-300"
  >
    <Link
      href={cat.link}
      className="group flex flex-col items-center text-center gap-4 rounded-2xl px-3 sm:px-4 py-7 w-full h-full block"
      style={{ backgroundColor: cat.bg }}
    >
      <div
        className="transition-all duration-300 group-hover:scale-115 group-hover:rotate-8 group-hover:-translate-y-1"
        style={{ '--hover-color': cat.color } as React.CSSProperties}
      >
        <div className="text-slate-700 group-hover:text-[var(--hover-color)] transition-colors duration-300">
          {cat.icon}
        </div>
      </div>
      <div>
        <p
          className="text-[13px] font-black tracking-widest text-slate-900 uppercase mb-[6px] transition-colors duration-300 group-hover:text-[var(--hover-color)]"
          style={{ '--hover-color': cat.color } as React.CSSProperties}
        >
          {cat.label}
        </p>
        <p className="text-[12px] text-slate-500 leading-snug">{cat.desc}</p>
      </div>
    </Link>
  </motion.div>
));
GridCard.displayName = "GridCard";

export default function Header5_New() {
  return (
    <section className="w-full pt-4 pb-4 lg:py-12 px-5 md:px-8 lg:px-16 max-w-[1440px] mx-auto overflow-hidden">
      <motion.div
        className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-14"
        style={{ perspective: 1200 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* Left Segment: Heading */}
        <motion.div className="shrink-0 lg:w-[230px]" variants={headingVariants}>
          <h2 className="text-[30px] md:text-[36px] lg:text-[34px] font-black tracking-tight leading-tight text-slate-900 uppercase mb-1 lg:mb-3">
            Shop by{" "}
            <span className="bg-linear-to-r from-[#D946EF] to-[#F97316] bg-clip-text text-transparent">
              Vibe
            </span>
          </h2>
          <p className="text-[13px] lg:text-[14px] text-slate-500 leading-normal lg:leading-relaxed max-w-[200px] lg:max-w-[180px]">
            Find the perfect chair for every part of your day.
          </p>
        </motion.div>

        {/* Mobile View Native Slider */}
        <div className="block lg:hidden w-full py-1 overflow-x-auto scrollbar-none snap-x snap-mandatory flex gap-4 scroll-smooth">
          {CATEGORIES.map((cat) => (
            <div 
              key={cat.label} 
              className="shrink-0 snap-center rounded-2xl border-2 border-transparent"
              style={{ width: '220px' }}
            >
              <Link
                href={cat.link}
                className="group flex flex-col items-center text-center gap-5 rounded-2xl px-4 py-8 w-full h-full block"
                style={{
                  backgroundColor: cat.bg,
                  boxShadow: `0 10px 20px -5px ${cat.shadow}`
                }}
              >
                <div style={{ color: cat.color }}>
                  {cat.icon}
                </div>
                <div>
                  <p className="text-[14px] font-black tracking-widest text-slate-900 uppercase mb-1">
                    {cat.label}
                  </p>
                  <p className="text-[12px] text-slate-500 leading-snug">{cat.desc}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Desktop View Grid */}
        <div className="hidden lg:grid lg:grid-cols-5 lg:overflow-visible pb-1 w-full lg:flex-1">
          {CATEGORIES.map((cat) => (
            <GridCard key={cat.label} cat={cat} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}