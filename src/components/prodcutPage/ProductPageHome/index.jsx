"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import ProductPageCard from '../ProductPageCard';

// Premium product catalog
const PRODUCTS = [
  {
    id: 1,
    name: "Astride Assassin Pro",
    price: 14999,
    originalPrice: 29999,
    discount: "-60%",
    image: "/Png1/chair12_ErgoFit.webp",
    category: "Gaming Chair",
    backSupport: "High Back",
    height: "5'7\" - 6'6\"",
    hours: "8+ Hours",
    colors: ["#ef4444", "#3b82f6", "#0f172a"],
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
    category: "Gaming Chair",
    backSupport: "High Back",
    height: "5'2\" - 5'10\"",
    hours: "8+ Hours",
    colors: ["#0f172a", "#6b7280"],
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
    category: "Office Chair",
    backSupport: "High Back",
    height: "5'7\" - 6'6\"",
    hours: "8+ Hours",
    colors: ["#f8fafc", "#0f172a"],
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
    category: "Office Chair",
    backSupport: "High Back",
    height: "4'11\" - 5'10\"",
    hours: "6-8 Hours",
    colors: ["#3b82f6", "#ef4444"],
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
    category: "Staff Chair",
    backSupport: "High Back",
    height: "5'7\" - 6'6\"",
    hours: "8+ Hours",
    colors: ["#6b7280", "#0f172a"],
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
    category: "Study Chair",
    backSupport: "High Back",
    height: "5'7\" - 6'6\"",
    hours: "8+ Hours",
    colors: ["#0f172a"],
    rating: 4.9,
    capacity: "150 kg",
  },
];

const TABS = ["All Products", "Gaming Chair", "Office Chair", "Staff Chair", "Study Chair", "Bar Stool"];

export default function ProductPageHome() {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedBackSupport, setSelectedBackSupport] = useState(null);
  const [selectedHours, setSelectedHours] = useState(null);
  const [selectedCapacity, setSelectedCapacity] = useState(null);
  const [maxPrice, setMaxPrice] = useState(25000);
  const [wishlisted, setWishlisted] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const searchParams = useSearchParams();
  const catParam = searchParams ? searchParams.get('category') : null;
  const searchParam = searchParams ? searchParams.get('search') : null;

  useEffect(() => {
    if (catParam) {
      const decoded = decodeURIComponent(catParam);
      let match = TABS.find(t => t.toLowerCase() === decoded.toLowerCase());
      if (!match && decoded.toLowerCase().includes('bar')) {
         match = "Bar Stool";
      }
      if (match) {
        setSelectedCategory(match);
      }
    } else {
      setSelectedCategory("All Products");
    }
    if (searchParam) {
      setSearchQuery(decodeURIComponent(searchParam));
    } else {
      setSearchQuery("");
    }
  }, [catParam, searchParam]);

  // Reset specific filters when category changes to avoid empty result sets
  useEffect(() => {
    setSelectedBackSupport(null);
    setSelectedHours(null);
    setSelectedCapacity(null);
  }, [selectedCategory]);

  // Reset price filter to default when category changes to avoid empty results
  useEffect(() => {
    setMaxPrice(25000);
  }, [selectedCategory]);

  useEffect(() => {
    const saved = localStorage.getItem("astride_wishlist");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const dict = {};
        parsed.forEach(item => {
          dict[item.id] = true;
        });
        setWishlisted(dict);
      } catch (e) {
        console.error(e);
      }
    }
  }, [productsList]);

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
            
            // Normalize Category string to match frontend TABS
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

            const blackVariant = prod.colorVariants?.find(
              (v) => v.colorName?.toLowerCase() === "black"
            );
            const blackImage = blackVariant?.images?.[0]?.url;
            const fallbackImage = prod.colorVariants?.find(
              (v) => v.images && v.images.length > 0
            )?.images?.[0]?.url;

            // Extract all image URLs across all color variants
            const allImages = prod.colorVariants?.reduce((acc, variant) => {
              if (variant.images) {
                return [...acc, ...variant.images.map((img) => img.url)];
              }
              return acc;
            }, []) || [];

            return {
              id: prod._id,
              name: prod.productName,
              price: prod.realPrice,
              originalPrice: prod.oldPrice,
              discount: `-${discPercent}%`,
              image: blackImage || fallbackImage || "/Png1/chair12_ErgoFit.webp",
              allImages: Array.from(new Set(allImages)),
              category: normalizedCategory,
              backSupport: prod.backSupport || "High Back",
              height: prod.height || "5'7\" - 6'6\"",
              hours: prod.hours || "8+ Hours",
              colors: prod.colors || ["#0f172a"],
              rating: prod.rating || 4.7,
              capacity: prod.capacity || "150 kg",
            };
          });
          console.log("Mapped products count:", mappedProducts.length);
          console.log("Categories of products:", mappedProducts.map(p => p.category));
          setProductsList(mappedProducts);
        }
      } catch (err) {
        console.error("Error fetching products from API:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter logic
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      if (selectedCategory && selectedCategory !== "All Products" && product.category !== selectedCategory) return false;
      if (selectedBackSupport && product.backSupport !== selectedBackSupport) return false;
      if (selectedHours && product.hours !== selectedHours) return false;
      if (selectedCapacity && product.capacity !== selectedCapacity) return false;
      if (product.price > maxPrice) return false;
      return true;
    });
  }, [productsList, selectedCategory, selectedBackSupport, selectedHours, selectedCapacity, maxPrice]);

  const toggleWishlist = (id) => {
    setWishlisted((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      const product = productsList.find(p => p.id === id);
      const saved = localStorage.getItem("astride_wishlist");
      let list = [];
      if (saved) {
        try { list = JSON.parse(saved); } catch (e) {}
      }
      if (updated[id]) {
        if (product && !list.some(p => p.id === id)) {
          list.push({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice || product.price,
            discount: product.discount || "0%",
            image: product.image,
            rating: product.rating || 4.7
          });
        }
      } else {
        list = list.filter(p => p.id !== id);
      }
      localStorage.setItem("astride_wishlist", JSON.stringify(list));
      window.dispatchEvent(new Event("astride_wishlist_updated"));
      return updated;
    });
  };

  const clearFilters = () => {
    setSelectedCategory("All Products");
    setSelectedBackSupport(null);
    setSelectedHours(null);
    setSelectedCapacity(null);
    setMaxPrice(25000);
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFiltersCount = [selectedBackSupport, selectedHours, selectedCapacity, maxPrice !== 25000 ? true : null].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans select-none overflow-x-hidden">
      
      {/* ── Page Header ── */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-8 md:pt-16 pb-0">
        
        {/* Breadcrumb */}
        <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 md:mb-10">
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Home</span>
          <span>/</span>
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Products</span>
          <span>/</span>
          <span className="text-slate-900">{selectedCategory}</span>
        </div>

        {/* Title */}
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase text-black mb-3 md:mb-5">
            {selectedCategory === "All Products" ? "All Premium Seating" : selectedCategory === "Gaming Chair" ? "Gaming Series" : selectedCategory === "Office Chair" ? "Office Series" : selectedCategory === "Staff Chair" ? "Staff Series" : selectedCategory === "Study Chair" ? "Study Series" : "Premium Bar Stools"}
          </h1>
          <p className="max-w-2xl mx-auto text-xs md:text-base text-neutral-500 leading-relaxed font-medium px-2">
            Discover Astride's premium ergonomics — masterfully engineered seating built for long-session endurance, proactive posture correction, and premium styling.
          </p>
        </div>

        {/* ── Category Tabs — Horizontal Scrollable on Mobile ── */}
        <div className="relative mb-4 md:mb-8">
          {/* Mobile Swipe Hint */}
          <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1 mb-2.5 md:hidden select-none">
            <span>Select Category</span>
            <span className="flex items-center gap-1.5 text-slate-600 font-extrabold animate-pulse">
              Swipe
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-2 md:flex-wrap md:justify-center md:overflow-visible scrollbar-hide relative z-0" style={{ scrollbarWidth: 'none' }}>
            {TABS.map((tab) => {
              const isActive = selectedCategory === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setSelectedCategory(tab)}
                  className={`shrink-0 px-4 md:px-6 py-2.5 md:py-3 rounded-full font-bold uppercase text-[10px] md:text-xs tracking-widest focus:outline-none transition-all duration-300 ${
                    isActive 
                      ? "bg-black text-white shadow-lg scale-105" 
                      : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-black"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
          {/* Fade mask for mobile overflow */}
          <div className="absolute right-0 bottom-2 top-[22px] w-12 bg-gradient-to-l from-[#f8fafc] to-transparent pointer-events-none md:hidden z-10" />
        </div>

        {/* ── Mobile Filter Bar ── */}
        <div className="flex lg:hidden items-center justify-between mb-4 px-0">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {filteredProducts.length} Products
          </p>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black text-white text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/></svg>
            Filters{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ""}
          </button>
        </div>
      </div>

      {/* ── Mobile Filter Drawer (Slide-up) ── */}
      {isFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-[1000]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsFilterOpen(false)}
          />
          {/* Panel */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-black">Filters</h2>
              <div className="flex items-center gap-4">
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                    Clear All
                  </button>
                )}
                <button onClick={() => setIsFilterOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>

            {/* Back Support */}
            <div className="mb-7 border-b border-slate-100 pb-7">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Back Support</h3>
              <div className="flex flex-wrap gap-3">
                {["High Back"].map((bs) => (
                  <button
                    key={bs}
                    onClick={() => setSelectedBackSupport(selectedBackSupport === bs ? null : bs)}
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${selectedBackSupport === bs ? 'bg-black text-white border-black' : 'bg-white text-slate-600 border-slate-200'}`}
                  >
                    {bs}
                  </button>
                ))}
              </div>
            </div>

            {/* Hours */}
            <div className="mb-7 border-b border-slate-100 pb-7">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Hours of Usage</h3>
              <div className="flex flex-wrap gap-3">
                {["6-8 Hours", "8+ Hours"].map((hr) => (
                  <button
                    key={hr}
                    onClick={() => setSelectedHours(selectedHours === hr ? null : hr)}
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${selectedHours === hr ? 'bg-black text-white border-black' : 'bg-white text-slate-600 border-slate-200'}`}
                  >
                    {hr}
                  </button>
                ))}
              </div>
            </div>

            {/* Capacity */}
            <div className="mb-7 border-b border-slate-100 pb-7">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Capacity (in KGs)</h3>
              <div className="flex flex-wrap gap-3">
                {["120 kg", "150 kg"].map((cap) => (
                  <button
                    key={cap}
                    onClick={() => setSelectedCapacity(selectedCapacity === cap ? null : cap)}
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${selectedCapacity === cap ? 'bg-black text-white border-black' : 'bg-white text-slate-600 border-slate-200'}`}
                  >
                    {cap}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Max Price</h3>
                <span className="text-sm font-black text-slate-900">₹{maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range" min={0} max={25000} step={500} value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
              />
            </div>

            <button
              onClick={() => setIsFilterOpen(false)}
              className="w-full py-4 bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-widest"
            >
              Show {filteredProducts.length} Products
            </button>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pb-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* ── Desktop Sidebar Filters ── */}
          <aside className="hidden lg:block w-full lg:w-[280px] shrink-0 lg:sticky lg:top-32 h-fit lg:pr-8 bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-black">Filters</h2>
              {(selectedBackSupport || selectedHours || selectedCapacity || maxPrice !== 25000) && (
                <button onClick={clearFilters} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors">
                  Clear All
                </button>
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">Back Support</h3>
              <div className="flex flex-col gap-2">
                {["High Back"].map((bs) => (
                  <label key={bs} className="flex items-center gap-3 cursor-pointer text-xs font-bold text-slate-650 group">
                    <input type="radio" name="backSupport" checked={selectedBackSupport === bs} onChange={() => setSelectedBackSupport(selectedBackSupport === bs ? null : bs)} className="accent-slate-900 w-4 h-4 cursor-pointer" />
                    <span className="group-hover:text-slate-905 transition-colors">{bs}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">Hours of Usage</h3>
              <div className="flex flex-col gap-2">
                {["6-8 Hours", "8+ Hours"].map((hr) => (
                  <label key={hr} className="flex items-center gap-3 cursor-pointer text-xs font-bold text-slate-650 group">
                    <input type="radio" name="hours" checked={selectedHours === hr} onChange={() => setSelectedHours(selectedHours === hr ? null : hr)} className="accent-slate-900 w-4 h-4 cursor-pointer" />
                    <span className="group-hover:text-slate-905 transition-colors">{hr}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">Capacity (in KGs)</h3>
              <div className="flex flex-col gap-2">
                {["120 kg", "150 kg"].map((cap) => (
                  <label key={cap} className="flex items-center gap-3 cursor-pointer text-xs font-bold text-slate-650 group">
                    <input type="radio" name="capacity" checked={selectedCapacity === cap} onChange={() => setSelectedCapacity(selectedCapacity === cap ? null : cap)} className="accent-slate-900 w-4 h-4 cursor-pointer" />
                    <span className="group-hover:text-slate-905 transition-colors">{cap}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Max Price</h3>
                <span className="text-[13px] font-black text-slate-900">₹{maxPrice.toLocaleString()}</span>
              </div>
              <input type="range" min={0} max={25000} step={500} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-slate-900 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none" />
            </div>
          </aside>

          {/* ── Product Grid ── */}
          <main className="flex-1 w-full">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 w-full">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="relative rounded-[24px] md:rounded-[32px] overflow-hidden bg-white border border-slate-100 w-full flex flex-col animate-pulse shadow-sm">
                    <div className="m-2 md:m-3 rounded-[18px] md:rounded-[24px] relative h-[160px] md:h-[260px] bg-[#F8F9FA] flex flex-col items-center justify-center overflow-hidden">
                      <div className="w-24 h-24 bg-slate-200/40 rounded-full blur-3xl absolute"></div>
                    </div>
                    <div className="px-3 md:px-6 pb-4 md:pb-6 pt-2 flex flex-col flex-1 gap-2 md:gap-3">
                      <div className="w-16 h-2 bg-slate-200 rounded-full mt-1"></div>
                      <div className="w-4/5 h-4 bg-slate-200 rounded-lg"></div>
                      <div className="flex items-end gap-2 mt-auto pt-3">
                        <div className="w-16 h-5 bg-slate-200 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-[32px] p-12 text-center shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
                <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">No matching chairs found</p>
                <button onClick={clearFilters} className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform">
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 lg:gap-10 w-full">
                {filteredProducts.map((prod) => (
                  <div key={prod.id} className="w-full flex justify-center animate-fade-in">
                    <ProductPageCard
                      product={prod}
                      isWishlisted={wishlisted[prod.id]}
                      onToggleWishlist={toggleWishlist}
                    />
                  </div>
                ))}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
