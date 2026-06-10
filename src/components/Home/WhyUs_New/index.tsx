import Image from "next/image";
import { Caveat } from "next/font/google";

const caveat = Caveat({ subsets: ["latin"], weight: ["700"] });

export default function StatsSection_New() {
  const stats = [
    { num: "75,000", symbol: "+", label: "Orders delivered" },
    { num: "50,000", symbol: "+", label: "Happy customers" },
    { num: "12",     symbol: "+", label: "Years experience" },
    { num: "4.8",   symbol: "★", label: "Customer rating" },
  ];

  return (
    <section className="bg-[#DCF351] border-y-[3px] border-[#131313] py-[60px] md:py-[75px] lg:py-[90px]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12">
        {/* Heading */}
        <h2 className="text-center font-black uppercase leading-tight text-[#131313] text-[32px] md:text-[46px] lg:text-[58px]">
          India&apos;s leading{" "}
          <span className={`${caveat.className} text-[38px] md:text-[54px] lg:text-[68px] not-italic`}>
            Ergonomic Chair
          </span>
          {" "}brand
        </h2>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((item, index) => (
            <div
              key={index}
              className="rounded-[24px] border-[2.5px] border-[#131313] bg-white px-4 py-8 text-center shadow-[6px_6px_0_#131313]"
            >
              <b className="flex items-end justify-center leading-none font-black text-[#131313] gap-[2px]">
                <span className="text-[28px] md:text-[34px] lg:text-[40px]">{item.num}</span>
                <span className="text-[40px] md:text-[52px] lg:text-[62px] leading-none">{item.symbol}</span>
              </b>

              <span className="mt-3 block text-[13px] font-semibold uppercase tracking-[0.08em] text-[#555]">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Platforms */}
        <div className="mt-11 flex flex-wrap items-center justify-center gap-5">
          <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#131313]">
            Available on
          </span>

          <div className="rounded-[10px] border-2 border-[#131313] bg-white px-[14px] py-[5px]">
            <Image
              src="https://astride-furniture.vercel.app/Logo/amazon.webp"
              alt="Amazon"
              width={90}
              height={30}
              className="h-[30px] w-auto"
            />
          </div>

          <div className="rounded-[10px] border-2 border-[#131313] bg-white px-[14px] py-[5px]">
            <Image
              src="https://astride-furniture.vercel.app/Logo/FLIPKART_Webp.webp"
              alt="Flipkart"
              width={100}
              height={30}
              className="h-[30px] w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}