"use client";

import Link from "next/link";
import Image from "next/image";

const modes = [
  {
    label: "WORK MODE",
    tagline: "Focused. Productive.",
    badge: "🏢",
    accent: "#C8F135",
    img: "/Perfect_setup/Office.webp",
    alt: "Work mode office chair setup",
    link: "/products?category=Office%20Chair",
  },
  {
    label: "STUDY MODE",
    tagline: "Learn. Grow. Achieve.",
    badge: "📚",
    accent: "#818CF8",
    img: "/Perfect_setup/Study.webp",
    alt: "Study mode desk setup",
    link: "/products?category=Study%20Chair",
  },
  {
    label: "GAME MODE",
    tagline: "Play. Win. Repeat.",
    badge: "🎮",
    accent: "#EC4899",
    img: "/Perfect_setup/Game-clean.webp",
    alt: "Gaming setup with RGB lighting",
    link: "/products?category=Gaming%20Chair",
  },
  {
    label: "CHILL MODE",
    tagline: "Relax. Unwind.",
    badge: "✨",
    accent: "#F97316",
    img: "/Perfect_setup/Chill.webp",
    alt: "Chill lounge chair setup",
    link: "/products?category=Bar%20Stool",
  },
];

export default function Header6_New() {
  return (
    <section className="w-full bg-[#080808] pt-6 pb-0 px-5 md:px-8 lg:px-16 overflow-hidden relative">

      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute top-0 left-[250px] w-[400px] h-[300px] rounded-full bg-[#8B5CF6]/10 blur-[80px]" />
      <div className="pointer-events-none absolute bottom-0 right-[100px] w-[300px] h-[200px] rounded-full bg-[#C8F135]/8 blur-[70px]" />

      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-stretch gap-10 lg:gap-28">

        {/* ── Left Panel ── */}
        <div className="relative flex-shrink-0 lg:w-[260px] flex flex-col justify-center gap-6">

          {/* Decorative top arrow */}
          <svg
            viewBox="0 0 40 40"
            className="absolute -top-4 -left-1 w-7 h-7 text-[#C8F135]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path d="M6 34 L34 6M18 6h16v16" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          {/* Heading */}
          <div className="mt-4">
            <h2 className="text-[34px] md:text-[44px] font-black uppercase leading-[0.95] tracking-[-0.03em] text-white">
              Build Your
            </h2>
            <h2
              className="text-[36px] md:text-[44px] font-black uppercase leading-[0.95] tracking-[-0.03em]"
              style={{
                background: "linear-gradient(90deg, #8B5CF6 0%, #EC4899 55%, #F97316 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Perfect Setup
            </h2>

            {/* Animated lime underline */}
            <div className="mt-3 flex items-center gap-2">
              <div className="w-[110px] h-[3px] bg-[#C8F135] rounded-full" />
              <div className="w-[14px] h-[3px] bg-[#C8F135]/40 rounded-full" />
              <div className="w-[6px] h-[3px] bg-[#C8F135]/20 rounded-full" />
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-[13.5px] text-white/55 leading-relaxed">
            Chairs that fit your flow.<br />
            Setups that match your mood.
          </p>

          {/* CTA Button */}
          <Link
            href="#shop"
            className="group inline-flex items-center gap-3 border border-[#C8F135] text-[#C8F135] font-black text-[11px] tracking-[0.18em] uppercase px-5 py-[11px] rounded-md w-fit hover:bg-[#C8F135] hover:text-black transition-all duration-250 relative overflow-hidden"
          >
            <span className="relative z-10">Explore Setups</span>
            <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>

          {/* Decorative arrow bottom */}
          <svg
            viewBox="0 0 50 50"
            className="absolute bottom-2 right-[-16px] w-9 h-9 text-[#8B5CF6]/70 hidden lg:block"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path d="M8 8 L42 42M26 42h16V26" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 flex-1">
          {modes.map((mode) => (
            <Link
              key={mode.label}
              href={mode.link}
              className="group relative w-full h-[270px] md:h-[350px] rounded-[16px] md:rounded-[20px] overflow-hidden bg-[#111111] cursor-pointer transition-all duration-350 hover:-translate-y-2 hover:shadow-2xl select-none outline-none focus:outline-none active:outline-none"
              style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}
            >
              {/* Image filling entire card */}
              <div className="absolute inset-0 w-full h-full overflow-hidden outline-none">
                <Image
                  src={mode.img}
                  alt={mode.alt}
                  fill
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-600 ease-out select-none outline-none"
                  loading="lazy"
                  
                />
                {/* Layered gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 from-5% via-black/30 via-45% to-black/0 pointer-events-none" />
              </div>

              {/* Accent badge top-right */}
              <div
                className="absolute top-2.5 right-2.5 text-[15px] md:text-[18px] w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm border border-white/10 select-none z-20"
              >
                {mode.badge}
              </div>

              {/* Text overlay — pinned to the very bottom */}
              <div className="absolute bottom-0 left-0 right-0 z-20 px-4 md:px-5 pb-4 md:pb-5 flex flex-col gap-[3px] md:gap-[5px] outline-none">
                <p className="text-white font-black text-[12px] md:text-[13.5px] tracking-[0.16em] uppercase select-none">
                  {mode.label}
                </p>
                <p className="text-white/45 text-[10.5px] md:text-[12px] leading-snug select-none">{mode.tagline}</p>
                <div
                  className="mt-1 md:mt-2 text-[10.5px] md:text-[12px] font-black uppercase tracking-[0.18em] flex items-center gap-1 transition-all duration-200 w-fit outline-none"
                  style={{ color: mode.accent }}
                >
                  Shop Now <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">→</span>
                </div>
              </div>

              {/* Hover glow outline */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-[16px] md:rounded-[20px] z-20"
                style={{ boxShadow: `inset 0 0 0 1.5px ${mode.accent}50` }}
              />
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
