"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Grid } from "swiper/modules";

import "swiper/css";
import "swiper/css/grid";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

// Full fallback list in case API fails
const fallbackProducts = [
  {
    id: "1",
    sticker: "hot rn 🔥",
    hot: true,
    category: "Gaming Chair",
    name: "ErgoFit Premium",
    image: "https://astride-furniture.vercel.app/Png1/chair12_ErgoFit.webp",
    allImages: ["https://astride-furniture.vercel.app/Png1/chair12_ErgoFit.webp"],
    oldPrice: "₹18,999",
    price: "₹14,499",
    rawPrice: 14499,
    rawOriginalPrice: 18999,
  },
  {
    id: "2",
    sticker: "staff fave",
    hot: false,
    category: "Study Chair",
    name: "FitWell Pro",
    image: "https://astride-furniture.vercel.app/Png1/chair10_FitWell.webp",
    allImages: ["https://astride-furniture.vercel.app/Png1/chair10_FitWell.webp"],
    oldPrice: "₹12,499",
    price: "₹9,999",
    rawPrice: 9999,
    rawOriginalPrice: 12499,
  },
  {
    id: "3",
    sticker: "",
    hot: false,
    category: "Staff Chair",
    name: "FitWell Basic",
    image: "https://astride-furniture.vercel.app/Png1/chair9_FitWell.webp",
    allImages: ["https://astride-furniture.vercel.app/Png1/chair9_FitWell.webp"],
    oldPrice: "₹9,499",
    price: "₹7,499",
    rawPrice: 7499,
    rawOriginalPrice: 9499,
  },
  {
    id: "4",
    sticker: "new drop",
    hot: false,
    category: "Bar Stool",
    name: "Octave Studio",
    image: "https://astride-furniture.vercel.app/Png1/chair11_octave.webp",
    allImages: ["https://astride-furniture.vercel.app/Png1/chair11_octave.webp"],
    oldPrice: "₹8,999",
    price: "₹6,999",
    rawPrice: 6999,
    rawOriginalPrice: 8999,
  },
  {
    id: "5",
    sticker: "",
    hot: false,
    category: "Office Chair",
    name: "Classic Comfort",
    image: "https://astride-furniture.vercel.app/Png1/img1%20(1).webp",
    allImages: ["https://astride-furniture.vercel.app/Png1/img1%20(1).webp"],
    oldPrice: "₹11,999",
    price: "₹8,999",
    rawPrice: 8999,
    rawOriginalPrice: 11999,
  },
  {
    id: "6",
    sticker: "boss mode",
    hot: true,
    category: "Office Chair",
    name: "Alpha Brown",
    image: "https://astride-furniture.vercel.app/Product/AlphaBrown_8.webp",
    allImages: ["https://astride-furniture.vercel.app/Product/AlphaBrown_8.webp"],
    oldPrice: "₹24,999",
    price: "₹19,499",
    rawPrice: 19499,
    rawOriginalPrice: 24999,
  },
  {
    id: "7",
    sticker: "limited",
    hot: false,
    category: "Gaming Chair",
    name: "Carbon Pro",
    image: "https://astride-furniture.vercel.app/Png1/chair8_ERIZO.webp",
    allImages: ["https://astride-furniture.vercel.app/Png1/chair8_ERIZO.webp"],
    oldPrice: "₹21,999",
    price: "₹16,999",
    rawPrice: 16999,
    rawOriginalPrice: 21999,
  },
  {
    id: "8",
    sticker: "selling fast",
    hot: true,
    category: "Study Chair",
    name: "FlexiBack Elite",
    image: "https://astride-furniture.vercel.app/Png1/chair7_ERIZO.webp",
    allImages: ["https://astride-furniture.vercel.app/Png1/chair7_ERIZO.webp"],
    oldPrice: "₹15,999",
    price: "₹11,499",
    rawPrice: 11499,
    rawOriginalPrice: 15999,
  },
];

function BestsellerCard({ product }: { product: any }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const images = product.allImages && product.allImages.length > 0
    ? product.allImages
    : [product.image];

  useEffect(() => {
    if (isHovered && images.length > 1) {
      setCurrentImageIndex(0);
      timerRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 1500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCurrentImageIndex(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, images.length]);

  return (
    <article
      onClick={() => router.push(`/products/${product.slug || product.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col overflow-visible rounded-[18px] sm:rounded-[28px] border-[2px] sm:border-[2.5px] border-[#131313] bg-white shadow-[4px_4px_0_#131313] sm:shadow-[6px_6px_0_#131313] transition-all duration-300 hover:-translate-y-2 hover:shadow-[6px_8px_0_rgba(19,19,19,0.9)] sm:hover:shadow-[9px_12px_0_rgba(19,19,19,0.9)] cursor-pointer"
    >
      {/* Sticker */}
      {product.sticker && (
        <span
          className={`absolute left-2 sm:left-4 top-[-10px] sm:top-[-13px] z-10 rotate-[-3deg] px-2 py-1 sm:px-[14px] sm:py-[5px] text-[10px] sm:text-[13px] font-semibold shadow-[2px_2px_0_#131313] sm:shadow-[3px_3px_0_#131313] ${sans.className} ${
            product.hot
              ? "bg-[#EC4899] text-white"
              : "bg-[#DCF351] text-[#131313]"
          }`}
        >
          {product.sticker}
        </span>
      )}

      {/* Product Image */}
      <div className="rounded-t-[16px] sm:rounded-t-[25px] bg-[radial-gradient(ellipse_at_50%_80%,#ece4d2,#fff_70%)] px-2 sm:px-[18px] pb-2 pt-4 sm:pt-[26px] relative h-[160px] sm:h-[250px] flex items-center justify-center overflow-hidden">
        <Image
          src={images[currentImageIndex] || product.image}
          alt={product.name}
          width={300}
          height={300}
          className="mx-auto h-[140px] sm:h-[230px] w-auto object-contain transition duration-300 group-hover:rotate-[-1.5deg] group-hover:scale-105"
        />

        {/* Pagination Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2 flex gap-1.5 justify-center w-full opacity-100 transition-opacity duration-300 z-10">
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
      <div className={`flex flex-1 flex-col gap-1 sm:gap-2 px-3 sm:px-5 pb-3 sm:pb-[22px] pt-3 sm:pt-[18px] ${sans.className}`}>
        <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-[#EC4899]">
          {product.category}
        </span>

        <h3 className={`text-[14px] sm:text-[17px] font-semibold uppercase text-[#131313] group-hover:text-[#8B5CF6] transition-colors duration-300 line-clamp-1`}>
          {product.name}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-1 sm:pt-2">
          <span className="text-[14px] sm:text-[19px] font-bold text-[#131313] flex flex-col sm:flex-row sm:items-center">
            <s className="mr-0 sm:mr-2 text-[11px] sm:text-[14px] font-medium text-[#999]">
              {product.oldPrice}
            </s>
            <span>{product.price}</span>
          </span>

          <button
            aria-label={`Add ${product.name} to cart`}
            onClick={(e) => {
              e.stopPropagation();
              window.dispatchEvent(new CustomEvent('add-to-cart', { 
                detail: { 
                  id: product.id,
                  name: product.name,
                  price: product.rawPrice || 9999,
                  originalPrice: product.rawOriginalPrice || 12999,
                  image: product.image,
                  slug: product.slug,
                  quantity: 1
                } 
              }));
            }}
            className="grid h-8 w-8 sm:h-11 sm:w-11 place-items-center rounded-full bg-[#131313] text-white transition duration-300 hover:rotate-90 hover:bg-[#8B5CF6] cursor-pointer flex-shrink-0"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

export default function BestSellersSection_New() {
  const [productsList, setProductsList] = useState<any[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { margin: "0px" });
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  useEffect(() => {
    if (swiperInstance && swiperInstance.autoplay) {
      if (isInView) {
        swiperInstance.autoplay.start();
      } else {
        swiperInstance.autoplay.stop();
      }
    }
  }, [isInView, swiperInstance]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const cached = sessionStorage.getItem("astride_bestsellers_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.length > 0) {
            setProductsList(parsed);
            setLoading(false);
          }
        }
      } catch (e) {
        console.error("Failed to parse cached bestsellers:", e);
      }

      try {
        const res = await fetch("/api/product?t=" + Date.now(), {
          cache: "no-store",
          headers: { "Cache-Control": "no-store, no-cache, must-revalidate" }
        });
        const data = await res.json();
        if (data.success && data.products && data.products.length > 0) {
          const mappedProducts = data.products.map((prod: any, idx: number) => {
            const discPercent = prod.oldPrice && prod.realPrice
              ? Math.round((1 - (prod.realPrice / prod.oldPrice)) * 100)
              : 60;
            
            let normalizedCategory = "Gaming Chair";
            const dbCategory = prod.category && prod.category.name ? prod.category.name.toUpperCase() : "";
            if (dbCategory.includes("GAMING") || dbCategory.includes("GAME")) {
              normalizedCategory = "Gaming Chair";
            } else if (dbCategory.includes("EXECUTIVE")) {
              normalizedCategory = "Office Chair";
            } else if (dbCategory.includes("STAFF")) {
              normalizedCategory = "Staff Chair";
            } else if (dbCategory.includes("STUDY")) {
              normalizedCategory = "Study Chair";
            } else if (dbCategory.includes("BAR") || dbCategory.includes("STOOL")) {
              normalizedCategory = "Bar Stool";
            } else if (dbCategory.includes("OFFICE") || dbCategory.includes("TASK") || dbCategory.includes("ERGO")) {
              normalizedCategory = "Office Chair";
            }

            const blackVariant = prod.colorVariants?.find((v: any) => v.colorName?.toLowerCase() === "black");
            const blackImage = blackVariant?.images?.[0]?.url;

            const fallbackVariant = prod.colorVariants?.find((v: any) => v.images && v.images.length > 0);
            const fallbackImage = fallbackVariant?.images?.[0]?.url;

            const defaultVariant = blackVariant || fallbackVariant;
            const allImages = defaultVariant?.images?.map((img: any) => img.url) || [];

            const stickers = ["hot rn 🔥", "staff fave", "", "new drop", "", "boss mode", "limited", "selling fast"];
            const sticker = stickers[idx % stickers.length] || "";
            const hot = sticker === "hot rn 🔥" || sticker === "boss mode" || sticker === "selling fast";

            return {
              id: prod._id,
              slug: prod.slug,
              sticker,
              hot,
              category: normalizedCategory,
              name: prod.productName,
              image: blackImage || fallbackImage || "/Png1/chair12_ErgoFit.webp",
              allImages: Array.from(new Set(allImages)),
              oldPrice: `₹${(prod.oldPrice || (prod.realPrice * 2.5)).toLocaleString("en-IN")}`,
              price: `₹${(prod.realPrice || 9999).toLocaleString("en-IN")}`,
              rawPrice: prod.realPrice,
              rawOriginalPrice: prod.oldPrice,
            };
          });

          const withMultipleImages = mappedProducts.filter((p: any) => p.allImages && p.allImages.length > 1);
          
          let finalProducts = [...withMultipleImages];
          if (finalProducts.length < 8) {
            const singleImageProducts = mappedProducts.filter((p: any) => !p.allImages || p.allImages.length <= 1);
            finalProducts = [...finalProducts, ...singleImageProducts];
          }
          
          const resultList = finalProducts.slice(0, 8);
          setProductsList(resultList);
          sessionStorage.setItem("astride_bestsellers_cache", JSON.stringify(resultList));
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <section id="shop" ref={sectionRef} className="pt-2 pb-[10px] md:pt-3 md:pb-[15px] lg:pt-4 lg:pb-[20px] overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-3 md:px-8 lg:px-12">
        {/* Section Header UPDATED: Now vertically stacking, with pill/button in the same flex row */}
        <div className="mb-4 flex flex-col gap-2 px-1 md:px-0">
          
          <div className="flex flex-row items-center justify-between w-full">
            <span className={`inline-block rounded-full border border-[#131313] bg-white px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-[#8B5CF6] shrink-0 ${sans.className}`}>
              Explore bestsellers
            </span>

            {/* Reduced padding specifically on mobile: px-3 py-1.5 */}
            <Link
              href="/products"
              className={`inline-flex items-center gap-1 md:gap-2 rounded-full bg-[#131313] px-3 py-1.5 md:px-7 md:py-4 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-[#1F1F1F] hover:shadow-xl text-[11px] md:text-base shrink-0 ${sans.className}`}
            >
              All products
              <span className="text-sm md:text-lg">→</span>
            </Link>
          </div>

          <h2 className={`mt-1 text-[36px] font-black leading-tight text-[#131313] md:text-[48px] lg:text-[58px] ${sans.className}`}>
            Best selling{" "}
            <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent font-extrabold">
              chairs.
            </span>
          </h2>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* MOBILE 2x2 GRID SWIPER (md:hidden) */}
            {/* Added pt-4 to prevent the sticker from getting chopped off */}
            <div className="block md:hidden w-full mt-6">
              <style jsx global>{`
                .best-swiper.swiper {
                  width: 100%;
                  height: auto;
                  padding-bottom: 24px;
                }
                .best-swiper .swiper-slide {
                  height: auto !important;
                }
                .best-swiper .swiper-wrapper {
                  flex-direction: row !important;
                }
              `}</style>
              <Swiper
                onSwiper={setSwiperInstance}
                modules={[Autoplay, Grid]}
                grid={{
                  rows: 2,
                  fill: "row"
                }}
                slidesPerView={2}
                spaceBetween={12}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                className="best-swiper w-full"
              >
                {productsList.map((product) => (
                  <SwiperSlide key={product.id}>
                    {/* Added pt-4 here as well for good measure */}
                    <div className="pb-3 pt-4">
                      <BestsellerCard product={product} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* DESKTOP/TABLET GRID VIEW (hidden md:grid) */}
            {/* Added pt-4 for the same reason on desktop */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[30px] px-1 md:px-0 mt-6 pt-4">
              {productsList.map((product) => (
                <BestsellerCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}