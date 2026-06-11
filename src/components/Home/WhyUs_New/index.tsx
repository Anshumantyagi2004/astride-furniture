import Image from "next/image";

export default function StatsSection_New() {
  const stats = [
    { num: "75,000", symbol: "+", label: "Orders delivered", symbolSize: "text-[40px] md:text-[52px] lg:text-[62px]", translate: "translate-y-[-10px]" },
    { num: "50,000", symbol: "+", label: "Happy customers", symbolSize: "text-[40px] md:text-[52px] lg:text-[62px]", translate: "translate-y-[-10px]" },
    { num: "12",     symbol: "+", label: "Years experience", symbolSize: "text-[40px] md:text-[52px] lg:text-[62px]", translate: "translate-y-[-10px]" },
    { num: "4.8",   symbol: "★", label: "Customer rating", symbolSize: "text-[23px] md:text-[32px] lg:text-[38px]", translate: "translate-y-[2px]" },
  ];

  return (
    <section className="bg-[#DCF351] border-y-[3px] border-[#131313] pt-[30px] pb-[35px] md:pt-[40px] md:pb-[45px] lg:pt-[50px] lg:pb-[50px]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12">
        {/* Heading */}
        <h2 className="text-center font-black uppercase leading-tight text-[#131313] text-[32px] md:text-[46px] lg:text-[58px]">
          India&apos;s leading Ergonomic Chair brand
        </h2>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((item, index) => (
            <div
              key={index}
              className="rounded-[24px] border-[2.5px] border-[#131313] bg-white px-4 py-8 text-center shadow-[6px_6px_0_#131313]"
            >
              <b className="flex items-center justify-center leading-none font-black text-[#131313] gap-[2px]">
                <span className="text-[28px] md:text-[34px] lg:text-[40px]">{item.num}</span>
                <span className={`leading-none select-none transform ${item.symbolSize} ${item.translate}`}>{item.symbol}</span>
              </b>

              <span className="mt-3 block text-[13px] font-semibold uppercase tracking-[0.08em] text-[#555]">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Platforms */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#131313]">
            Available on
          </span>

          <div className="flex items-center">
            <Image
              src="/Logo/amazon.webp"
              alt="Amazon"
              width={100}
              height={24}
              className="h-[24px] md:h-[28px] w-auto object-contain"
            />
          </div>

          <div className="flex items-center">
            <Image
              src="/Logo/FLIPKART_Webp.webp"
              alt="Flipkart"
              width={100}
              height={24}
              className="h-[24px] md:h-[28px] w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}