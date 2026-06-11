"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const PRODUCTS = [
  {
    id: "10",
    name: "FitWell Pro",
    category: "Study Chair",
    image: "/Png1/chair10_FitWell.webp",
    oldPrice: "₹12,499",
    price: "₹9,999",
    rawPrice: 9999,
    sticker: "staff fave",
    stickerBg: "bg-[#DCF351] text-[#131313]"
  },
  {
    id: "9",
    name: "FitWell Basic",
    category: "Staff Chair",
    image: "/Png1/chair9_FitWell.webp",
    oldPrice: "₹9,499",
    price: "₹7,499",
    rawPrice: 7499,
    sticker: "",
    stickerBg: ""
  },
  {
    id: "11",
    name: "Octave Studio",
    category: "Bar Stool",
    image: "/Png1/chair11_octave.webp",
    oldPrice: "₹8,999",
    price: "₹6,999",
    rawPrice: 6999,
    sticker: "new drop",
    stickerBg: "bg-[#DCF351] text-[#131313]"
  },
  {
    id: "alpha-brown",
    name: "Alpha Brown",
    category: "Office Chair",
    image: "/Product/AlphaBrown_8.webp",
    oldPrice: "₹24,999",
    price: "₹19,499",
    rawPrice: 19499,
    sticker: "boss mode",
    stickerBg: "bg-[#EC4899] text-white"
  }
];

export default function CompeteTheVibe() {
  return (
    <section className={`pt-2 pb-4 md:pt-3 md:pb-6 bg-white ${sans.className}`}>
      <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12">
        
        {/* Header section */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="inline-block rounded-full border border-[#131313] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#8B5CF6]">
              Complete the vibe
            </span>

            <h2 className="mt-4 text-[36px] font-black leading-tight text-[#131313] md:text-[48px] lg:text-[58px]">
              You might{" "}
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent font-extrabold">
                also slay in.
              </span>
            </h2>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-[#131313] px-7 py-4 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-[#1F1F1F] hover:shadow-xl"
          >
            All products
            <span className="text-lg">→</span>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-[30px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {PRODUCTS.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group relative flex flex-col overflow-visible rounded-[28px] border-[2.5px] border-[#131313] bg-white shadow-[6px_6px_0_#131313] transition-all duration-[250ms] hover:-translate-y-[7px] hover:shadow-[9px_12px_0_rgba(19,19,19,0.9)] cursor-pointer"
            >
              {/* Sticker */}
              {product.sticker && (
                <span
                  className={`absolute left-4 top-[-13px] z-10 rotate-[-3deg] px-[14px] py-[5px] text-[13px] font-semibold border-[2.5px] border-[#131313] shadow-[3px_3px_0_#131313] ${product.stickerBg}`}
                >
                  {product.sticker}
                </span>
              )}

              {/* Product Image Wrapper */}
              <div className="rounded-t-[25px] bg-[radial-gradient(ellipse_at_50%_80%,#f4f4f5,#fff_70%)] px-[16px] pb-[6px] pt-[24px] relative h-[230px] flex items-center justify-center overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="mx-auto h-[200px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.06] group-hover:rotate-[-1.5deg]"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-1 flex-col gap-[7px] px-[18px] pb-[20px] pt-[16px]">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#EC4899]">
                  {product.category}
                </span>

                <h3 className="text-[16px] font-bold uppercase text-[#131313] group-hover:text-[#8B5CF6] transition-colors duration-300 line-clamp-1">
                  {product.name}
                </h3>

                <div className="mt-auto flex items-center justify-between pt-[6px]">
                  <span className="text-[17px] font-bold text-[#131313]">
                    <s className="mr-[7px] text-[13px] font-medium text-[#999]">
                      {product.oldPrice}
                    </s>
                    {product.price}
                  </span>

                  <button
                    aria-label={`Add ${product.name} to cart`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.dispatchEvent(
                        new CustomEvent("add-to-cart", {
                          detail: {
                            id: product.id,
                            name: product.name,
                            price: product.rawPrice,
                            image: product.image,
                            quantity: 1,
                          },
                        })
                      );
                    }}
                    className="grid h-[42px] w-[42px] place-items-center rounded-full bg-[#131313] text-white transition-all duration-200 hover:rotate-90 hover:bg-[#8B5CF6] cursor-pointer"
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
