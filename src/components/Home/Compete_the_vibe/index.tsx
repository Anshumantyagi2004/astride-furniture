"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const STATIC_FALLBACKS = [
  {
    id: "10",
    name: "FitWell Pro",
    category: "Study Chair",
    image: "/Png1/chair10_FitWell.webp",
    allImages: ["/Png1/chair10_FitWell.webp"],
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
    allImages: ["/Png1/chair9_FitWell.webp"],
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
    allImages: ["/Png1/chair11_octave.webp"],
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
    allImages: ["/Product/AlphaBrown_8.webp"],
    oldPrice: "₹24,999",
    price: "₹19,499",
    rawPrice: 19499,
    sticker: "boss mode",
    stickerBg: "bg-[#EC4899] text-white"
  }
];

function VibeProductCard({ product }: { product: any }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const images = product.allImages && product.allImages.length > 0
    ? product.allImages
    : [product.image];

  useEffect(() => {
    if (isHovered && images.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCurrentImageIndex(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, images.length]);

  return (
    <Link
      href={`/products/${product.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col overflow-visible rounded-[18px] md:rounded-[28px] border-[2px] md:border-[2.5px] border-[#131313] bg-white shadow-[4px_4px_0_#131313] md:shadow-[6px_6px_0_#131313] transition-all duration-[250ms] hover:-translate-y-[5px] md:hover:-translate-y-[7px] hover:shadow-[6px_8px_0_rgba(19,19,19,0.9)] md:hover:shadow-[9px_12px_0_rgba(19,19,19,0.9)] cursor-pointer h-full"
    >
      {/* Sticker */}
      {product.sticker && (
        <span
          className={`absolute left-2 md:left-4 top-[-10px] md:top-[-13px] z-10 rotate-[-3deg] px-2 md:px-[14px] py-1 md:py-[5px] text-[10px] md:text-[13px] font-semibold border-[2px] md:border-[2.5px] border-[#131313] shadow-[2px_2px_0_#131313] md:shadow-[3px_3px_0_#131313] ${product.stickerBg}`}
        >
          {product.sticker}
        </span>
      )}

      {/* Product Image Wrapper */}
      <div className="rounded-t-[16px] md:rounded-t-[25px] bg-[radial-gradient(ellipse_at_50%_80%,#f4f4f5,#fff_70%)] px-2 md:px-[16px] pb-2 md:pb-[6px] pt-4 md:pt-[24px] relative h-[160px] md:h-[230px] flex items-center justify-center overflow-hidden">
        <Image
          src={images[currentImageIndex] || product.image}
          alt={product.name}
          width={300}
          height={200}
          className="mx-auto h-[130px] md:h-[200px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.06] group-hover:rotate-[-1.5deg]"
        />

        {/* Pagination Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2 flex gap-1.5 justify-center w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            {images.map((_: any, idx: number) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-3 bg-[#131313]' : 'w-1.5 bg-slate-300'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col gap-1 md:gap-[7px] px-3 md:px-[18px] pb-3 md:pb-[20px] pt-3 md:pt-[16px]">
        <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.14em] text-[#EC4899]">
          {product.category}
        </span>

        <h3 className="text-[14px] md:text-[16px] font-bold uppercase text-[#131313] group-hover:text-[#8B5CF6] transition-colors duration-300 line-clamp-1">
          {product.name}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-1 md:pt-[6px]">
          <span className="text-[14px] md:text-[17px] font-bold text-[#131313] flex flex-col md:flex-row md:items-center">
            <s className="mr-0 md:mr-[7px] text-[11px] md:text-[13px] font-medium text-[#999]">
              {product.oldPrice}
            </s>
            <span>{product.price}</span>
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
            className="grid h-[32px] w-[32px] md:h-[42px] md:w-[42px] place-items-center rounded-full bg-[#131313] text-white transition-all duration-200 hover:rotate-90 hover:bg-[#8B5CF6] cursor-pointer shrink-0"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              className="h-[14px] w-[14px] md:h-[18px] md:w-[18px]"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function CompeteTheVibe() {
  const [products, setProducts] = useState<any[]>(STATIC_FALLBACKS);

  useEffect(() => {
    async function fetchVibeProducts() {
      try {
        const res = await fetch("/api/product");
        const data = await res.json();

        if (data.success && data.products && data.products.length > 0) {
          const multiImageProducts = data.products.filter((prod: any) => {
            const imageCount = prod.colorVariants?.reduce(
              (acc: number, variant: any) => acc + (variant.images?.length || 0),
              0
            ) || 0;
            return imageCount > 1;
          });

          if (multiImageProducts.length > 0) {
            const mapped = multiImageProducts.slice(0, 4).map((prod: any, idx: number) => {
              const discPercent = prod.oldPrice && prod.realPrice
                ? Math.round((1 - (prod.realPrice / prod.oldPrice)) * 100)
                : 60;

              let normalizedCategory = prod.category?.name || (typeof prod.category === "string" ? prod.category : "Ergonomic Chair");

              const blackVariant = prod.colorVariants?.find(
                (v: any) => v.colorName?.toLowerCase() === "black"
              );
              const blackImage = blackVariant?.images?.[0]?.url;
              const fallbackImage = prod.colorVariants?.find(
                (v: any) => v.images && v.images.length > 0
              )?.images?.[0]?.url;

              const colorImages = prod.colorVariants?.reduce((acc: string[], variant: any) => {
                if (variant.images) {
                  return [...acc, ...variant.images.map((img: any) => img.url)];
                }
                return acc;
              }, []) || [];
              const rootImages = prod.images ? prod.images.map((img: any) => img.url || img) : [];
              const allImages = [...rootImages, ...colorImages];

              const stickers = [
                { text: "staff fave", bg: "bg-[#DCF351] text-[#131313]" },
                { text: "", bg: "" },
                { text: "new drop", bg: "bg-[#DCF351] text-[#131313]" },
                { text: "boss mode", bg: "bg-[#EC4899] text-white" }
              ];
              const stickerChoice = stickers[idx % stickers.length];

              return {
                id: prod._id || prod.slug,
                name: prod.productName,
                category: normalizedCategory,
                image: blackImage || fallbackImage || "/Png1/chair12_ErgoFit.webp",
                allImages: Array.from(new Set(allImages)),
                oldPrice: `₹${(prod.oldPrice || prod.realPrice * 2).toLocaleString()}`,
                price: `₹${prod.realPrice.toLocaleString()}`,
                rawPrice: prod.realPrice,
                sticker: stickerChoice.text,
                stickerBg: stickerChoice.bg
              };
            });

            if (mapped.length < 4) {
              const needed = 4 - mapped.length;
              setProducts([...mapped, ...STATIC_FALLBACKS.slice(0, needed)]);
            } else {
              setProducts(mapped);
            }
          }
        }
      } catch (e) {
        console.error("Error fetching recommended vibe products:", e);
      }
    }
    fetchVibeProducts();
  }, []);

  return (
    <section className={`pt-2 pb-0 md:pt-3 md:pb-6 bg-white ${sans.className}`}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        
        {/* Header section - Flex Row to keep button on the right */}
        <div className="mb-4 md:mb-12 flex flex-row items-end justify-between gap-2 md:gap-5">
          <div className="flex-1">
            {/* Adjusted heading exactly to 35px for mobile */}
            <h2 className="text-[35px] md:text-[48px] lg:text-[58px] font-black leading-tight text-[#131313]">
              You might{" "}
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent font-extrabold">
                also slay in.
              </span>
            </h2>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1 md:gap-2 rounded-full bg-[#131313] px-3 py-2 md:px-7 md:py-4 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-[#1F1F1F] hover:shadow-xl text-[10px] md:text-base shrink-0 mb-1"
          >
            All products
            <span className="text-sm md:text-lg">→</span>
          </Link>
        </div>

        {/* MOBILE VIEW (Auto-swiping 2 items per view) */}
        <div className="block md:hidden w-full pb-0 px-1">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={12}
            slidesPerView={2}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            className="w-full !overflow-visible"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id} className="pb-0 pt-3 h-auto">
                <VibeProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* DESKTOP VIEW (Standard Grid) */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[30px]">
          {products.map((product) => (
            <VibeProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}