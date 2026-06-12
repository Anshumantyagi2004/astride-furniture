"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";

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
    <article
      onClick={() => router.push(`/products/${product.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col overflow-visible rounded-[28px] border-[2.5px] border-[#131313] bg-white shadow-[6px_6px_0_#131313] transition-all duration-300 hover:-translate-y-2 hover:shadow-[9px_12px_0_rgba(19,19,19,0.9)] cursor-pointer"
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
      <div className="rounded-t-[25px] bg-[radial-gradient(ellipse_at_50%_80%,#ece4d2,#fff_70%)] px-[18px] pb-2 pt-[26px] relative h-[250px] flex items-center justify-center overflow-hidden">
        <Image
          src={images[currentImageIndex] || product.image}
          alt={product.name}
          width={300}
          height={300}
          className="mx-auto h-[230px] w-auto object-contain transition duration-300 group-hover:rotate-[-1.5deg] group-hover:scale-105"
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
      <div className={`flex flex-1 flex-col gap-2 px-5 pb-[22px] pt-[18px] ${sans.className}`}>
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#EC4899]">
          {product.category}
        </span>

        <h3 className={`text-[17px] font-semibold uppercase text-[#131313] group-hover:text-[#8B5CF6] transition-colors duration-300 line-clamp-1`}>
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
            onClick={(e) => {
              e.stopPropagation();
              window.dispatchEvent(new CustomEvent('add-to-cart', { 
                detail: { 
                  id: product.id,
                  name: product.name,
                  price: product.rawPrice || 9999,
                  originalPrice: product.rawOriginalPrice || 12999,
                  image: product.image,
                  quantity: 1
                } 
              }));
            }}
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
  );
}

export default function BestSellersSection_New() {
  const [productsList, setProductsList] = useState<any[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/product");
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
            const fallbackImage = prod.colorVariants?.find((v: any) => v.images && v.images.length > 0)?.images?.[0]?.url;

            const colorImages = prod.colorVariants?.reduce((acc: string[], variant: any) => {
              if (variant.images) {
                return [...acc, ...variant.images.map((img: any) => img.url)];
              }
              return acc;
            }, []) || [];
            const rootImages = prod.images ? prod.images.map((img: any) => img.url || img) : [];
            const allImages = [...rootImages, ...colorImages];

            const stickers = ["hot rn 🔥", "staff fave", "", "new drop", "", "boss mode", "limited", "selling fast"];
            const sticker = stickers[idx % stickers.length] || "";
            const hot = sticker === "hot rn 🔥" || sticker === "boss mode" || sticker === "selling fast";

            return {
              id: prod._id,
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

          // Pick only those that have multiple images to ensure the hover slideshow works on all of them
          const withMultipleImages = mappedProducts.filter((p: any) => p.allImages && p.allImages.length > 1);
          
          let finalProducts = [...withMultipleImages];
          if (finalProducts.length < 8) {
            const singleImageProducts = mappedProducts.filter((p: any) => !p.allImages || p.allImages.length <= 1);
            finalProducts = [...finalProducts, ...singleImageProducts];
          }
          
          setProductsList(finalProducts.slice(0, 8));
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
    <section id="shop" className="pt-2 pb-[10px] md:pt-3 md:pb-[15px] lg:pt-4 lg:pb-[20px]">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-4 flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className={`inline-block rounded-full border border-[#131313] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#8B5CF6] ${sans.className}`}>
              Explore bestsellers
            </span>

            <h2 className={`mt-2 text-[36px] font-black leading-tight text-[#131313] md:text-[48px] lg:text-[58px] ${sans.className}`}>
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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-[30px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productsList.map((product) => (
              <BestsellerCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}