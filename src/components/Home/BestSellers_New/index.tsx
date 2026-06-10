"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const products = [
  {
    id: 1,
    sticker: "hot rn 🔥",
    hot: true,
    category: "Gaming Chair",
    name: "ErgoFit Premium",
    image:
      "https://astride-furniture.vercel.app/Png1/chair12_ErgoFit.webp",
    oldPrice: "₹18,999",
    price: "₹14,499",
  },
  {
    id: 2,
    sticker: "staff fave",
    hot: false,
    category: "Study Chair",
    name: "FitWell Pro",
    image:
      "https://astride-furniture.vercel.app/Png1/chair10_FitWell.webp",
    oldPrice: "₹12,499",
    price: "₹9,999",
  },
  {
    id: 3,
    sticker: "",
    hot: false,
    category: "Staff Chair",
    name: "FitWell Basic",
    image:
      "https://astride-furniture.vercel.app/Png1/chair9_FitWell.webp",
    oldPrice: "₹9,499",
    price: "₹7,499",
  },
  {
    id: 4,
    sticker: "new drop",
    hot: false,
    category: "Bar Stool",
    name: "Octave Studio",
    image:
      "https://astride-furniture.vercel.app/Png1/chair11_octave.webp",
    oldPrice: "₹8,999",
    price: "₹6,999",
  },
  {
    id: 5,
    sticker: "",
    hot: false,
    category: "Office Chair",
    name: "Classic Comfort",
    image:
      "https://astride-furniture.vercel.app/Png1/img1%20(1).webp",
    oldPrice: "₹11,999",
    price: "₹8,999",
  },
  {
    id: 6,
    sticker: "boss mode",
    hot: true,
    category: "Office Chair",
    name: "Alpha Brown",
    image:
      "https://astride-furniture.vercel.app/Product/AlphaBrown_8.webp",
    oldPrice: "₹24,999",
    price: "₹19,499",
  },
];

export default function BestSellersSection_New() {
  return (
    <section id="shop" className="py-[70px] md:py-[90px] lg:py-[120px]">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className={`inline-block rounded-full border border-[#131313] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#8B5CF6] ${sans.className}`}>
              Explore bestsellers
            </span>

            <h2 className={`mt-5 text-[36px] font-black leading-tight text-[#131313] md:text-[48px] lg:text-[58px] ${sans.className}`}>
              Best selling{" "}
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent font-extrabold">
                chairs.
              </span>
            </h2>
          </div>

          <Link
            href="/products"
            className={`inline-flex items-center gap-2 rounded-full bg-[#131313] px-7 py-4 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-[#1F1F1F] hover:shadow-xl ${sans.className}`}
          >
            All products
            <span className="text-lg">→</span>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-[30px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="group relative flex flex-col overflow-visible rounded-[28px] border-[2.5px] border-[#131313] bg-white shadow-[6px_6px_0_#131313] transition-all duration-300 hover:-translate-y-2 hover:shadow-[9px_12px_0_rgba(19,19,19,0.9)]"
            >
              {/* Sticker */}
              {product.sticker && (
                <span
                  className={`absolute left-4 top-[-13px] z-10 rotate-[-3deg] px-[14px] py-[5px] text-[13px] font-semibold shadow-[3px_3px_0_#131313] ${sans.className} ${
                    product.hot
                      ? "bg-[#EC4899] text-white"
                      : "bg-[#DCF351] text-[#131313]"
                  }`}
                >
                  {product.sticker}
                </span>
              )}

              {/* Product Image */}
              <div className="rounded-t-[15px] bg-[radial-gradient(ellipse_at_50%_80%,#ece4d2,#fff_70%)] px-[18px] pb-2 pt-[26px]">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="mx-auto h-[230px] w-auto object-contain transition duration-300 group-hover:rotate-[-1.5deg] group-hover:scale-105"
                />
              </div>

              {/* Product Info */}
              <div className={`flex flex-1 flex-col gap-2 px-5 pb-[22px] pt-[18px] ${sans.className}`}>
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#EC4899]">
                  {product.category}
                </span>

                <h3 className={`text-[17px] font-semibold uppercase text-[#131313] ${sans.className}`}>
                  {product.name}
                </h3>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="text-[19px] font-bold text-[#131313]">
                    <s className="mr-2 text-[14px] font-medium text-[#999]">
                      {product.oldPrice}
                    </s>
                    {product.price}
                  </span>

                  <button
                    aria-label={`Add ${product.name} to cart`}
                    className="grid h-11 w-11 place-items-center rounded-full bg-[#131313] text-white transition duration-300 hover:rotate-90 hover:bg-[#8B5CF6] cursor-pointer"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      className="h-[18px] w-[18px]"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}