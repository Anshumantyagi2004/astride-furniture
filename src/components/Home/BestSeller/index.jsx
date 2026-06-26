"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const BestSellerCard = ({ product }) => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  const images = product.allImages && product.allImages.length > 0 
    ? product.allImages 
    : [product.image];

  useEffect(() => {
    if (isHovered && images.length > 1) {
      // Instantly switch to the 2nd image on hover
      setCurrentImageIndex(1);
      
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

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    };
    window.dispatchEvent(new CustomEvent('add-to-cart', { detail: cartItem }));
  };

  return (
    <div 
      className="flex flex-col group h-full justify-between font-sans"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        onClick={() => router.push(`/products/${product.slug || product.id}`)}
        className="cursor-pointer"
      >
        {/* Image Container - Reduced aspect ratio for shorter length */}
        <div className="relative w-full aspect-[4/3.3] bg-[#F5F5F5] rounded-[16px] md:rounded-[24px] p-3 md:p-5 mb-3 md:mb-4 overflow-hidden flex flex-col items-center justify-center transition-colors duration-300 group-hover:bg-[#EFEFEF]">
          {/* Tag */}
          <div className="absolute top-2.5 left-2.5 md:top-4 md:left-4 bg-white px-2 py-0.5 md:px-2.5 rounded-full text-[8px] md:text-[9px] font-bold tracking-widest text-[#8B5CF6] shadow-sm z-10 uppercase font-sans">
            {product.category || 'Premium'}
          </div>
          
          {/* Product Image */}
          <div className="relative w-full h-[88%] flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform duration-500 ease-out">
            <Image 
              src={images[currentImageIndex] || product.image} 
              alt={product.name} 
              fill
              className="object-contain drop-shadow-lg p-2" 
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </div>

          {/* Pagination Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 flex gap-1.5 justify-center w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-3 bg-[#8B5CF6]' : 'w-1.5 bg-slate-300'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col font-sans">
          <h3 className="text-sm md:text-base font-semibold text-[#111111] mb-1 font-sans group-hover:text-[#8B5CF6] transition-colors line-clamp-1">
            {product.name}
          </h3>
          {/* Clamped description for compact height */}
          <p className="text-[11px] md:text-xs text-[#666666] leading-relaxed mb-2 line-clamp-2 font-sans min-h-[32px] md:min-h-[36px]">
            {product.description}
          </p>
          <div className="font-bold text-[11px] md:text-xs text-[#111111] tracking-wide mb-3 flex flex-wrap items-center gap-1.5 md:gap-2 font-sans">
            <span>₹{product.price.toLocaleString("en-IN")}</span>
            <span className="text-gray-400 text-[9px] md:text-[10px] line-through font-normal">₹{product.originalPrice.toLocaleString("en-IN")}</span>
            <span className="text-[#EC4899] text-[9px] md:text-[10px] font-extrabold">{product.discount} OFF</span>
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button 
        onClick={handleAddToCart}
        className="w-full bg-white border border-[#E5E5E5] text-[#111111] py-2 md:py-2.5 rounded-lg text-[10.5px] md:text-[12.6px] font-bold tracking-wide hover:bg-[#8B5CF6] hover:text-white hover:border-[#8B5CF6] transition-all duration-300 font-sans cursor-pointer"
      >
        Add to Cart
      </button>

    </div>
  );
};

export default function BestSeller() {
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/product");
        const data = await res.json();
        if (data.success && data.products && data.products.length > 0) {
          const mappedProducts = data.products.map((prod) => {
            const discPercent = prod.oldPrice && prod.realPrice
                ? Math.round((1 - (prod.realPrice / prod.oldPrice)) * 100)
                : 60;
            
            let normalizedCategory = "Office";
            const dbCategory = prod.category && prod.category.name ? prod.category.name.toUpperCase() : "";
            if (dbCategory.includes("GAMING") || dbCategory.includes("GAME")) normalizedCategory = "Gaming";
            else if (dbCategory.includes("STUDY")) normalizedCategory = "Study";
            else if (dbCategory.includes("BAR") || dbCategory.includes("STOOL")) normalizedCategory = "Bar";

            const blackVariant = prod.colorVariants?.find((v) => v.colorName?.toLowerCase() === "black");
            const blackImage = blackVariant?.images?.[0]?.url;

            const fallbackVariant = prod.colorVariants?.find((v) => v.images && v.images.length > 0);
            const fallbackImage = fallbackVariant?.images?.[0]?.url;

            const defaultVariant = blackVariant || fallbackVariant;
            const allImages = defaultVariant?.images?.map((img) => img.url) || [];

            return {
                id: prod._id,
                slug: prod.slug,
                name: prod.productName,
                price: prod.realPrice,
                originalPrice: prod.oldPrice,
                discount: `-${discPercent}%`,
                image: blackImage || fallbackImage || "/Png1/chair12_ErgoFit.webp",
                allImages: Array.from(new Set(allImages)),
                category: normalizedCategory,
                description: prod.shortDescription || "Elevate your setup with a perfect blend of elegance and functionality."
            };
          });
          
          // Filter products to strictly pick 4 that have multiple images
          const multipleImageProducts = mappedProducts.filter(p => p.allImages.length > 1);
          
          // If we don't have 4 with multiple images, fill the rest with whatever is available
          const finalBestsellers = [...multipleImageProducts];
          for (let p of mappedProducts) {
              if (finalBestsellers.length >= 4) break;
              if (!finalBestsellers.find(exist => exist.id === p.id)) {
                  finalBestsellers.push(p);
              }
          }
          
          setBestsellers(finalBestsellers.slice(0, 4));
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
    <section 
      className={`w-full bg-white pt-2 pb-6 md:pt-4 md:pb-8 px-6 md:px-12 lg:px-20 ${sans.className}`} 
    >
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header Area */}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-5 px-2">
          <div>
            <h2 className={`mt-0 text-[32px] font-black leading-tight text-[#131313] md:text-[42px] lg:text-[48px] ${sans.className}`}>
              Best{" "}
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent font-extrabold">
                sellers.
              </span>
            </h2>
          </div>

          <Link
            href="/products"
            className={`inline-flex items-center gap-2 rounded-full bg-[#131313] px-6 py-3 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-[#1F1F1F] hover:shadow-xl ${sans.className}`}
          >
            Browse all products 
            <span className="text-lg">→</span>
          </Link>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-[#111111] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
            {bestsellers.map((product) => (
              <BestSellerCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
