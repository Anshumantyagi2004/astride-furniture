"use client";

import React, { useState, useEffect } from 'react';
import DetailPageCard from './deatilPageCard';
import Reviews from '../Home/Reviews';
import DetailedHero from './detailed_hero';

export default function DetailPage({ productId }: { productId?: string }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const res = await fetch("/api/product");
        const data = await res.json();
        
        // Default fallback static products list matching ProductPageHome
        const fallbackProducts = [
          {
            id: 1,
            name: "Astride Assassin Pro",
            price: 14999,
            originalPrice: 29999,
            discount: "-60%",
            image: "/Png1/chair12_ErgoFit.webp",
            category: "Ergonomic Chairs",
            backSupport: "High Back",
            height: "5'7\" - 6'6\"",
            hours: "8+ Hours",
            colors: ["Red", "Black", "Grey", "Blue"],
            rating: 4.8,
            capacity: "120 kg",
          },
          {
            id: 2,
            name: "Astride Monster T-Series",
            price: 16499,
            originalPrice: 32999,
            discount: "-60%",
            image: "/Png1/Chair7_Delton.webp",
            category: "Ergonomic Chairs",
            backSupport: "High Back",
            height: "5'2\" - 5'10\"",
            hours: "8+ Hours",
            colors: ["Black", "Grey"],
            rating: 4.5,
            capacity: "120 kg",
          },
          {
            id: 3,
            name: "Astride Vision Elite",
            price: 18999,
            originalPrice: 35999,
            discount: "-57%",
            image: "/Png1/chair4_ACE.webp",
            category: "Office Task Chair",
            backSupport: "High Back",
            height: "5'7\" - 6'6\"",
            hours: "8+ Hours",
            colors: ["White", "Black"],
            rating: 4.9,
            capacity: "150 kg",
          },
          {
            id: 4,
            name: "Astride Monster S-Mesh",
            price: 15499,
            originalPrice: 29999,
            discount: "-58%",
            image: "/Png1/chair5_AIRSENSE.webp",
            category: "Office Task Chair",
            backSupport: "High Back",
            height: "4'11\" - 5'10\"",
            hours: "6-8 Hours",
            colors: ["Blue", "Red"],
            rating: 4.6,
            capacity: "120 kg",
          },
          {
            id: 5,
            name: "Astride Beast Stealth",
            price: 19999,
            originalPrice: 39999,
            discount: "-60%",
            image: "/Png1/chair6_AlphaGrey.webp",
            category: "Bar Stools",
            backSupport: "High Back",
            height: "5'7\" - 6'6\"",
            hours: "8+ Hours",
            colors: ["Grey", "Black"],
            rating: 4.7,
            capacity: "150 kg",
          },
          {
            id: 6,
            name: "Astride Ghost Phantom",
            price: 21999,
            originalPrice: 42999,
            discount: "-59%",
            image: "/Png1/Chair6a_Amica Black .webp",
            category: "Bar Stools",
            backSupport: "High Back",
            height: "5'7\" - 6'6\"",
            hours: "8+ Hours",
            colors: ["Black"],
            rating: 4.9,
            capacity: "150 kg",
          }
        ];

        let allProducts = fallbackProducts;
        if (data.success && data.products && data.products.length > 0) {
          const dbProducts = data.products.map((prod: any) => {
            const discPercent = prod.oldPrice && prod.realPrice
              ? Math.round((1 - (prod.realPrice / prod.oldPrice)) * 100)
              : 60;
            
            let normalizedCategory = "Ergonomic Chairs";
            const dbCategory = prod.category && prod.category.name ? prod.category.name.toUpperCase() : "";
            if (dbCategory.includes("BAR")) {
              normalizedCategory = "Bar Stools";
            } else if (dbCategory.includes("OFFICE") || dbCategory.includes("TASK")) {
              normalizedCategory = "Office Task Chair";
            }

            const blackVariant = prod.colorVariants?.find(
              (v: any) => v.colorName?.toLowerCase() === "black"
            );
            const blackImage = blackVariant?.images?.[0]?.url;
            const fallbackImage = prod.colorVariants?.find(
              (v: any) => v.images && v.images.length > 0
            )?.images?.[0]?.url;

            return {
              id: prod._id,
              name: prod.productName,
              price: prod.realPrice,
              originalPrice: prod.oldPrice,
              discount: `-${discPercent}%`,
              image: blackImage || fallbackImage || "/Png1/chair12_ErgoFit.webp",
              category: normalizedCategory,
              backSupport: prod.backSupport || "High Back",
              height: prod.height || "5'7\" - 6'6\"",
              hours: prod.hours || "8+ Hours",
              colors: prod.colorVariants && prod.colorVariants.length > 0 
                ? prod.colorVariants.map((v: any) => v.colorName).filter(Boolean)
                : [],
              colorVariants: prod.colorVariants || [],
              rating: prod.rating || 4.7,
              capacity: prod.capacity || "150 kg",
              shortDescription: prod.shortDescription,
              longDescription: prod.longDescription,
              keyfeatures: prod.keyfeatures,
              application: prod.application,
              whychoose: prod.whychoose,
              specifications: prod.specifications
            };
          });
          allProducts = [...dbProducts, ...fallbackProducts];
        }

        const found = allProducts.find(p => p.id.toString() === productId?.toString()) || allProducts[0];
        setProduct(found);
      } catch (err) {
        console.error("Error loading product detail data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-[1380px] mx-auto p-4 md:p-8 lg:p-10 bg-white min-h-screen flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Loading Premium Seating...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1380px] mx-auto p-4 md:p-8 lg:p-10 bg-white min-h-screen flex items-center justify-center font-sans">
        <p className="text-base font-semibold text-red-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <DetailPageCard product={product} />
      <Reviews />
      <DetailedHero/>
    </div>
  );
}
