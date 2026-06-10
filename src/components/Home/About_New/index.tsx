import Image from "next/image";
import { Plus_Jakarta_Sans } from "next/font/google";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export default function AboutSection_New() {
  const chips = [
    "Ergonomic comfort",
    "Premium quality",
    "Sleek aesthetics",
    "Modern designs",
  ];

  return (
    <section
      id="about"
      className="relative bg-[#F1E8D6] py-[70px] md:py-[90px] lg:py-[120px]"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* Left Content */}
          <div>
            {/* Eyebrow */}
            <span className={`inline-block rounded-full border border-[#131313] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#8B5CF6] ${sans.className}`}>
              About ASTRIDE®
            </span>

            {/* Heading */}
            <h2 className="mt-5 text-[36px] font-black leading-tight text-[#131313] md:text-[48px] lg:text-[58px]">
              India&apos;s trusted{" "}
              <span className={`${sans.className} bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent font-extrabold`}>
                chair makers.
              </span>
            </h2>

            {/* Paragraphs */}
            <p className={`mt-5 max-w-[540px] text-[16px] font-medium leading-8 text-[#333333] ${sans.className}`}>
              We create premium ergonomic chairs designed for comfort,
              elegance, and productivity. From work-from-home setups to
              executive seating, every chair is crafted with modern aesthetics
              and serious support.
            </p>

            <p className={`mt-5 max-w-[540px] text-[16px] font-medium leading-8 text-[#333333] ${sans.className}`}>
              Mesh backs, lumbar support, revolving bases, adjustable
              everything — built with innovation, durability, and a whole lot
              of style.
            </p>

            {/* Chips */}
            <div className="mt-8 flex flex-wrap gap-3">
              {chips.map((chip, index) => (
                <span
                  key={chip}
                  className={`
                    rounded-full px-[18px] py-[9px]
                    text-[13px] font-semibold
                    ${sans.className}
                    ${
                      index % 2 === 0
                        ? "border-2 border-[#131313] bg-white shadow-[3px_3px_0_#131313] -rotate-1"
                        : "border-2 border-[#8B5CF6] bg-white shadow-[3px_3px_0_#8B5CF6] rotate-[1.4deg]"
                    }
                  `}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            {/* Frame */}
            <div
              className="rotate-[2deg] bg-gradient-to-br from-[#A78BFA] to-[#EC4899] p-[18px]"
              style={{
                clipPath:
                  "polygon(0 6%,5% 0,95% 2%,100% 10%,98% 94%,92% 100%,6% 98%,0 90%)",
              }}
            >
              <Image
                src="https://astride-furniture.vercel.app/Product/AlphaBrown_8.webp"
                alt="Astride Alpha chair"
                width={700}
                height={700}
                className="max-h-[430px] w-full rounded-lg bg-white object-contain"
              />
            </div>

            {/* Sticky Note */}
            <div
              className="
                absolute -bottom-6 -left-4
                -rotate-[4deg]
                bg-[#DCF351]
                px-[22px] py-3
                text-[22px] font-bold
                text-[#131313]
                shadow-[5px_5px_0_#131313]
              "
            >
              crafted, not copied ✦
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}