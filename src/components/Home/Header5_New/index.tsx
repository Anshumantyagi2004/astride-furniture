"use client";

import Link from "next/link";

const categories = [
  {
    label: "GAMING",
    desc: "Level up your game",
    bg: "#EDE9FE",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14">
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
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14">
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
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    label: "LIFESTYLE",
    desc: "Chill in style",
    bg: "#DBEAFE",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14">
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
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14">
        <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
        <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" />
      </svg>
    ),
  },
];

export default function Header5_New() {
  return (
    <section className="w-full py-12 px-5 md:px-8 lg:px-16 max-w-[1440px] mx-auto">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-14">

        {/* Left: Heading */}
        <div className="shrink-0 lg:w-[230px]">
          <h2 className="text-[34px] md:text-[40px] font-black tracking-tight leading-tight text-slate-900 uppercase mb-3">
            Shop by{" "}
            <span className="bg-gradient-to-r from-[#D946EF] to-[#F97316] bg-clip-text text-transparent">
              Vibe
            </span>
          </h2>
          <p className="text-[14px] text-slate-500 leading-relaxed max-w-[180px]">
            Find the perfect chair for every part of your day.
          </p>
        </div>

        {/* Right: Cards */}
        <div className="flex gap-4 overflow-x-auto pb-1 w-full scrollbar-hide">
          {categories.map((cat) => (
            <Link
              href="#shop"
              key={cat.label}
              className="group flex-shrink-0 w-[180px] md:w-[200px] rounded-2xl px-5 py-7 flex flex-col items-center text-center gap-4 transition-all duration-200 hover:scale-[1.04] hover:shadow-lg"
              style={{ backgroundColor: cat.bg }}
            >
              <div className="text-slate-700">{cat.icon}</div>
              <div>
                <p className="text-[13px] font-black tracking-widest text-slate-900 uppercase mb-[6px]">
                  {cat.label}
                </p>
                <p className="text-[12px] text-slate-500 leading-snug">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
