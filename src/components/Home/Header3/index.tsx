"use client";

import Image from "next/image";

interface BannerCard {
  id: number;
  subtitle: string;
  title: string;
  image: string;
  bgColor: string;
  textColor: string;
}

const CARDS: BannerCard[] = [
  {
    id: 1,
    subtitle: "ERGONOMIC DESIGN",
    title: "Comfort Redefined",
    image: "/Png/header3_a.jpeg",
    bgColor: "bg-[#D0E2EC]", // Soft light blue
    textColor: "text-zinc-800",
  },
  {
    id: 2,
    subtitle: "PREMIUM SEATING",
    title: "Sit Better",
    image: "/Png/Header3_b.jpeg",
    bgColor: "bg-[#E5D7C6]", // Soft tan/beige
    textColor: "text-zinc-800",
  },
  {
    id: 3,
    subtitle: "MODERN WORKSPACE",
    title: "Work Smarter",
    image: "/Png/header3_C.jpeg",
    bgColor: "bg-[#BAC6C3]", // Muted sage green
    textColor: "text-zinc-800",
  },
];

export default function Header3() {
  return (
    <section className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CARDS.map((card) => (
            <div
              key={card.id}
              className={`relative overflow-hidden rounded-[24px] ${card.bgColor} ${card.textColor} h-[260px] flex items-center justify-between p-10 group hover:shadow-xl transition-all duration-300 cursor-pointer`}
            >
              {/* Text Content */}
              <div className="flex flex-col z-10 max-w-[60%]">
                <span className="text-[14px] font-bold tracking-[0.15em] text-zinc-600 uppercase mb-3">
                  {card.subtitle}
                </span>
                <h3 className="text-[32px] font-serif text-zinc-800 leading-[1.2] mb-4">
                  {card.title.split(' ').map((word, i) => (
                    <span key={i} className="block">{word}</span>
                  ))}
                </h3>
                <div className="w-12 h-[1px] bg-zinc-400" />
              </div>

              {/* Image Container */}
              <div className="relative inset-0 w-full h-full z-0">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
