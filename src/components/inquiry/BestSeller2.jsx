"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProducts } from "@/context/ProductsContext";

const BestSellerCard = ({ product }) => {
  const router = useRouter();

  const handleAddToCart = () => {
    const cardVariantColor =
      product.color || product.colorVariants?.[0]?.colorName || "Black";

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug,
      quantity: 1,
      color: cardVariantColor,
    };

    window.dispatchEvent(new CustomEvent("add-to-cart", { detail: cartItem }));
  };

  return (
    <div>
      <div
        onClick={() => router.push(`/products/${product.slug || product.id}`)}
        className="cursor-pointer"
      >
        {/* Tag */}

        {/* Product Image */}
        <div className="relative w-full h-[220px] flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform duration-500 ease-out">
          {" "}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain drop-shadow-lg p-2"
            sizes="(max-width: 768px) 100vw, 25vw"
            loading="lazy"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col font-sans">
        <h3 className="text-sm md:text-base font-semibold text-[#111111] mb-1 font-sans group-hover:text-[#8B5CF6] transition-colors line-clamp-1">
          {product.name}
        </h3>

        <p className="text-[11px] md:text-xs text-[#666666] leading-relaxed mb-2 line-clamp-2 font-sans min-h-[32px] md:min-h-[36px]">
          {product.description}
        </p>

        <div className="font-bold text-[11px] md:text-xs text-[#111111] tracking-wide mb-3 flex flex-wrap items-center gap-1.5 md:gap-2 font-sans">
          <span>₹{product.price.toLocaleString("en-IN")}</span>
          <span className="text-gray-400 text-[9px] md:text-[10px] line-through font-normal">
            ₹{product.originalPrice.toLocaleString("en-IN")}
          </span>
          <span className="text-[#EC4899] text-[9px] md:text-[10px] font-extrabold">
            {product.discount} OFF
          </span>
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

export default function BestSeller2() {
  const { products: rawProducts, loading } = useProducts();
  const [bestsellers, setBestsellers] = useState([]);

  useEffect(() => {
    if (!rawProducts || rawProducts.length === 0) return;
    const mappedProducts = rawProducts.map((prod) => {
      const discPercent =
        prod.oldPrice && prod.realPrice
          ? Math.round((1 - prod.realPrice / prod.oldPrice) * 100)
          : 60;

      let normalizedCategory = "Office";
      const dbCategory =
        prod.category && prod.category.name
          ? prod.category.name.toUpperCase()
          : "";
      if (dbCategory.includes("GAMING") || dbCategory.includes("GAME"))
        normalizedCategory = "Gaming";
      else if (dbCategory.includes("STUDY")) normalizedCategory = "Study";
      else if (dbCategory.includes("BAR") || dbCategory.includes("STOOL"))
        normalizedCategory = "Bar";

      const blackVariant = prod.colorVariants?.find(
        (v) => v.colorName?.toLowerCase() === "black",
      );
      const fallbackVariant = prod.colorVariants?.find(
        (v) => v.images && v.images.length > 0,
      );

      const defaultVariant = blackVariant || fallbackVariant;
      const sortedVariantImages = defaultVariant?.images
        ? [...defaultVariant.images].sort((a, b) => {
            const aIsInfographic = a.imageType === "infographic";
            const bIsInfographic = b.imageType === "infographic";
            if (aIsInfographic && !bIsInfographic) return -1;
            if (!aIsInfographic && bIsInfographic) return 1;
            return 0;
          })
        : [];
      const allImages = sortedVariantImages.map((img) => img.url || img);
      const coverImage =
        sortedVariantImages[0]?.url ||
        defaultVariant?.images?.[0]?.url ||
        "/Png1/chair12_ErgoFit.webp";

      return {
        id: prod._id,
        slug: prod.slug,
        name: prod.productName,
        price: prod.realPrice,
        originalPrice: prod.oldPrice,
        discount: `-${discPercent}%`,
        image: coverImage,
        allImages: Array.from(new Set(allImages)),
        category: normalizedCategory,
        colorVariants: prod.colorVariants,
        color: defaultVariant?.colorName || prod.color,
        description:
          prod.shortDescription ||
          "Elevate your setup with a perfect blend of elegance and functionality.",
      };
    });

    const multipleImageProducts = mappedProducts.filter(
      (p) => p.allImages.length > 1,
    );
    const finalBestsellers = [...multipleImageProducts];
    for (let p of mappedProducts) {
      if (finalBestsellers.length >= 4) break;
      if (!finalBestsellers.find((exist) => exist.id === p.id)) {
        finalBestsellers.push(p);
      }
    }
    setBestsellers(finalBestsellers.slice(0, 4));
  }, [rawProducts]);

  return (
    <section className="w-full bg-white pt-2 pb-6 md:pt-4 md:pb-8 px-6 md:px-12 lg:px-20 font-sans">
      <div className="max-w-[1440px] mx-auto">
        {/* Header Area */}
        <div className="mb-5 flex flex-col items-start md:flex-row md:items-end md:justify-between gap-5 px-0 md:px-2">
          <div className="pt-3 md:pt-0">
            <h2 className="mt-0 text-[32px] font-black leading-tight text-[#131313] md:text-[42px] lg:text-[48px] font-sans">
              Best{" "}
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent font-extrabold">
                sellers.
              </span>
            </h2>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-[#131313] px-6 py-3 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-[#1F1F1F] hover:shadow-xl font-sans"
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
