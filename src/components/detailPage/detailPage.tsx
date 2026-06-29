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
      
      // Clear stale product caches to ensure fresh data
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("astride_products_cache");
        sessionStorage.removeItem("astride_nav_products_cache");
      }
      
      let initialProduct: any = null;

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

        if (!initialProduct) {
          const rawCached = sessionStorage.getItem("astride_nav_products_cache");
          if (rawCached) {
            const parsed = JSON.parse(rawCached);
            if (parsed && parsed.length > 0) {
              const foundDb = parsed.find((p: any) => 
                p._id?.toString() === productId?.toString() || 
                p.slug === productId
              );
              if (foundDb) {
                const discPercent = foundDb.oldPrice && foundDb.realPrice
                  ? Math.round((1 - (foundDb.realPrice / foundDb.oldPrice)) * 100)
                  : 60;
                
                // Use actual category name from database instead of normalizing
                const category = foundDb.category && foundDb.category.name ? foundDb.category.name : "Ergonomic Chairs";

                const blackVariant = foundDb.colorVariants?.find(
                  (v: any) => v.colorName?.toLowerCase() === "black"
                );
                const blackImage = blackVariant?.images?.[0]?.url;
                const fallbackImage = foundDb.colorVariants?.find(
                  (v: any) => v.images && v.images.length > 0
                )?.images?.[0]?.url;

                const mapped = {
                  id: foundDb._id,
                  slug: foundDb.slug,
                  name: foundDb.productName,
                  price: foundDb.realPrice,
                  originalPrice: foundDb.oldPrice,
                  discount: `-${discPercent}%`,
                  image: blackImage || fallbackImage || "/Png1/chair12_ErgoFit.webp",
                  category: category,
                  backSupport: foundDb.backSupport || "High Back",
                  height: foundDb.height || "5'7\" - 6'6\"",
                  hours: foundDb.hours || "8+ Hours",
                  colors: foundDb.colorVariants && foundDb.colorVariants.length > 0 
                    ? foundDb.colorVariants.map((v: any) => v.colorName).filter(Boolean)
                    : [],
                  colorVariants: foundDb.colorVariants || [],
                  rating: foundDb.rating || 4.7,
                  capacity: foundDb.capacity || "150 kg",
                  shortDescription: foundDb.shortDescription,
                  longDescription: foundDb.longDescription,
                  keyfeatures: foundDb.keyfeatures,
                  application: foundDb.application,
                  whychoose: foundDb.whychoose,
                  specifications: foundDb.specifications
                };
                initialProduct = mapped;
                setProduct(mapped);
                setLoading(false);
              }
            }
          }
        }
      } catch (e) {
        console.error("Error loading product from cache:", e);
      }

      // 2. Fetch single product data from database
      try {
        const res = await fetch(`/api/product/${productId}?t=${Date.now()}`);
        const data = await res.json();
        
        if (data.success && data.product) {
          const prod = data.product;
          const discPercent = prod.oldPrice && prod.realPrice
            ? Math.round((1 - (prod.realPrice / prod.oldPrice)) * 100)
            : 60;
          
          // Use actual category name from database instead of normalizing
          const category = prod.category && prod.category.name ? prod.category.name : "Ergonomic Chairs";

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
            category: category,
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
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-white flex items-center justify-center font-sans z-50">
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
