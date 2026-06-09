"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
      className="flex flex-col group h-full justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        onClick={() => router.push(`/products/${product.id}`)}
        className="cursor-pointer"
      >
        {/* Image Container - Reduced aspect ratio for shorter length */}
        <div className="relative w-full aspect-[4/3.3] bg-[#F5F5F5] rounded-[24px] p-5 mb-4 overflow-hidden flex flex-col items-center justify-center transition-colors duration-300 group-hover:bg-[#EFEFEF]">
          {/* Tag */}
          <div className="absolute top-4 left-4 bg-white px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest text-[#111111] shadow-sm z-10 uppercase">
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
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-3 bg-slate-800' : 'w-1.5 bg-slate-300'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-[#111111] mb-1">
            {product.name}
          </h3>
          {/* Clamped description for compact height */}
          <p className="text-xs text-[#666666] leading-relaxed mb-2 line-clamp-2">
            {product.description}
          </p>
          <div className="font-bold text-xs text-[#111111] tracking-wide mb-3 flex items-center gap-2">
            <span>₹{product.price.toLocaleString("en-IN")}</span>
            <span className="text-gray-400 text-[10px] line-through font-normal">₹{product.originalPrice.toLocaleString("en-IN")}</span>
            <span className="text-[#03a685] text-[10px]">{product.discount} OFF</span>
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button 
        onClick={handleAddToCart}
        className="w-full bg-white border border-[#E5E5E5] text-[#111111] py-2.5 rounded-lg text-xs font-bold tracking-wide hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all duration-300"
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
            const fallbackImage = prod.colorVariants?.find((v) => v.images && v.images.length > 0)?.images?.[0]?.url;

            const colorImages = prod.colorVariants?.reduce((acc, variant) => {
                if (variant.images) {
                    return [...acc, ...variant.images.map((img) => img.url)];
                }
                return acc;
            }, []) || [];
            const rootImages = prod.images ? prod.images.map(img => img.url || img) : [];
            const allImages = [...rootImages, ...colorImages];

            return {
                id: prod._id,
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
      className="w-full bg-white pt-0 pb-12 md:py-16 px-6 md:px-12 lg:px-20" 
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
    >
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <h2 className="text-3xl md:text-[32px] font-medium text-[#111111]">
            Bestsellers
          </h2>
          <Link href="/products" className="text-sm font-semibold text-[#111111] hover:text-gray-500 transition-colors mt-4 md:mt-0 flex items-center gap-2">
            Browse all products 
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-[#111111] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {bestsellers.map((product) => (
              <BestSellerCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
