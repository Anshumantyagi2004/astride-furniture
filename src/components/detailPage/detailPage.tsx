"use client";

import React, { useState, useEffect } from 'react';
import DetailPageCard from './deatilPageCard';
import Reviews from '../Home/Reviews';
import DetailedHero from './detailed_hero';
import Loader from "@/components/ui/loader";
import Reviews_New from '../Home/Reviews_New';
import CompeteTheVibe from '../Home/Compete_the_vibe';

export default function DetailPage({ productId }: { productId?: string }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      if (!productId) return;
      let initialProduct = null;

      // 1. Check local cache (sessionStorage) for instant rendering
      try {
        const cached = sessionStorage.getItem("astride_products_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.length > 0) {
            const found = parsed.find((p: any) => 
              p.id?.toString() === productId?.toString() || 
              p.slug === productId
            );
            if (found) {
              initialProduct = found;
              setProduct(found);
              setLoading(false); // disable loading spinner instantly
            }
          }
        }
      } catch (e) {
        console.error("Error loading product from cache:", e);
      }

      // 2. Fetch single product data from database
      try {
        const res = await fetch(`/api/product/${productId}`);
        const data = await res.json();
        
        if (data.success && data.product) {
          const prod = data.product;
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

          const mapped = {
            id: prod._id,
            slug: prod.slug,
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
          setProduct(mapped);
          setLoading(false);
        } else {
          throw new Error("Failed to load product details");
        }
      } catch (err) {
        console.error("Error loading single product detail data:", err);
        // Fallback to static products list matching ProductPageHome if no cache
        if (!initialProduct) {
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
          const found = fallbackProducts.find((p: any) => 
            p.id.toString() === productId?.toString() || 
            p.slug === productId
          ) || fallbackProducts[0];
          setProduct(found);
          setLoading(false);
        }
      }
    }
    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-[1380px] mx-auto p-4 md:p-8 lg:p-10 bg-[#ffffff] min-h-screen flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <Loader />
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mt-4">Loading Premium Seating...</p>
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
      


      <Reviews_New/>
      <CompeteTheVibe />
    </div>
  );
}
