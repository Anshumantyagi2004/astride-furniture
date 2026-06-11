import { Cormorant_Garamond, Poppins } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export default function Marquee4_New() {
  const content = (
    <div className="flex items-center gap-16 whitespace-nowrap uppercase pr-16">
      {/* Normal */}
      <span
        className={`${poppins.className} text-[28px] md:text-[36px] lg:text-[44px] font-black tracking-[-0.03em] text-white`}
      >
        Sit. Slay.
      </span>

      <span className="text-[34px] text-white">✦</span>

      {/* Gradient */}
      <span
        className={`${poppins.className} text-[28px] md:text-[36px] lg:text-[44px] font-black tracking-[-0.03em] bg-gradient-to-r from-[#9333EA] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent`}
      >
        Rep Seat.
      </span>

      <span className="text-[34px] text-white">✦</span>

      {/* Outline Bold */}
      <span
        className={`${poppins.className} text-[28px] md:text-[36px] lg:text-[44px] font-black`}
        style={{ color: "transparent", WebkitTextStroke: "1.8px white", wordSpacing: "0.15em" }}
      >
        Comfort That Hits Different.
      </span>

      <span className="text-[34px] text-white">✦</span>

      {/* Normal */}
      <span
        className={`${poppins.className} text-[28px] md:text-[36px] lg:text-[44px] font-black tracking-[-0.03em] text-white`}
      >
        Your Space.
      </span>

      <span className="text-[34px] text-white">✦</span>

      {/* Gradient */}
      <span
        className={`${poppins.className} text-[28px] md:text-[36px] lg:text-[44px] font-black tracking-[-0.03em] bg-gradient-to-r from-[#9333EA] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent`}
      >
        Your Vibe.
      </span>

      <span className="text-[34px] text-white">✦</span>

      {/* Outline Bold */}
      <span
        className={`${poppins.className} text-[28px] md:text-[36px] lg:text-[44px] font-black`}
        style={{ color: "transparent", WebkitTextStroke: "1.8px white", wordSpacing: "0.15em" }}
      >
        Game On.
      </span>

      <span className="text-[34px] text-white">✦</span>
    </div>
  );

  return (
    <div className="overflow-hidden select-none">
      {/* Marquee */}
      <div className="bg-[#050505] py-3">
        <div className="flex w-max animate-marquee">
          {content}
          {content}
        </div>
      </div>
    </div>
  );
}