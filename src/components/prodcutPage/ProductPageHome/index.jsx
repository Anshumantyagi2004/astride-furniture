"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
    category: "Executive Chair",
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
    category: "Executive Chair",
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

const TABS = ["All Products", "Gaming Chair", "Executive Chair", "Staff Chair", "Study Chair", "Bar Stool"];

export default function ProductPageHome() {
  const [productsList, setProductsList] = useState(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedBackSupport, setSelectedBackSupport] = useState(null);
  const [selectedHours, setSelectedHours] = useState(null);
  const [selectedCapacity, setSelectedCapacity] = useState(null);
  const [maxPrice, setMaxPrice] = useState(25000);
  const [wishlisted, setWishlisted] = useState({});

  useEffect(() => {
    async function fetchProducts() {
      try {
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
              normalizedCategory = "Executive Chair";
            } else if (dbCategory.includes("STAFF")) {
              normalizedCategory = "Staff Chair";
            } else if (dbCategory.includes("STUDY")) {
              normalizedCategory = "Study Chair";
            } else if (dbCategory.includes("BAR") || dbCategory.includes("STOOL")) {
              normalizedCategory = "Bar Stool";
            } else if (dbCategory.includes("OFFICE") || dbCategory.includes("TASK") || dbCategory.includes("ERGO")) {
              normalizedCategory = "Executive Chair";
            }

            return {
              id: prod._id,
              name: prod.productName,
              price: prod.realPrice,
              originalPrice: prod.oldPrice,
              discount: `-${discPercent}%`,
              image: prod.images && prod.images[0] ? prod.images[0].url : "/Png1/chair12_ErgoFit.webp",
              category: normalizedCategory,
              backSupport: prod.backSupport || "High Back",
              height: prod.height || "5'7\" - 6'6\"",
              hours: prod.hours || "8+ Hours",
              colors: prod.colors || ["#0f172a"],
              rating: prod.rating || 4.7,
              capacity: prod.capacity || "150 kg",
            };
          });
          setProductsList(mappedProducts);
        }
      } catch (err) {
        console.error("Error fetching products from API:", err);
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
    setWishlisted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const clearFilters = () => {
    setSelectedCategory("All Products");
    setSelectedBackSupport(null);
    setSelectedHours(null);
    setSelectedCapacity(null);
    setMaxPrice(25000);
  };

  // Animations variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    },
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans px-4 md:px-8 py-8 md:py-16 select-none overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto w-full">
        
        {/* ── Breadcrumb Navigation ── */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-10"
        >
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Home</span>
          <span>/</span>
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Products</span>
          <span>/</span>
          <span className="text-slate-900">{selectedCategory}</span>
        </motion.div>

        {/* ── Dynamic Category Title Header ── */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase text-black mb-5">
            {selectedCategory === "All Products" ? "All Premium Seating" : selectedCategory === "Gaming Chair" ? "Gaming Series" : selectedCategory === "Executive Chair" ? "Executive Series" : selectedCategory === "Staff Chair" ? "Staff Series" : selectedCategory === "Study Chair" ? "Study Series" : "Premium Bar Stools"}
          </h1>
          <p className="max-w-3xl mx-auto text-sm md:text-base text-neutral-500 leading-relaxed font-medium">
            Discover Astride's premium ergonomics — masterfully engineered seating built for long-session endurance, proactive posture correction, adjustable support components, and premium styling.
          </p>
        </motion.div>

        {/* ── Pill Tab Navigation ── */}
        <div className="flex justify-center items-center gap-3 md:gap-4 flex-wrap pb-4 mb-16 max-w-4xl mx-auto">
          {TABS.map((tab) => {
            const isActive = selectedCategory === tab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedCategory(tab)}
                className={`relative px-6 py-3 rounded-full font-bold uppercase text-[11px] md:text-xs tracking-widest focus:outline-none transition-all duration-300 ${
                  isActive 
                    ? "bg-black text-white shadow-lg scale-105" 
                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-black"
                }`}
              >
                <span>{tab}</span>
              </button>
            );
          })}
        </div>

        {/* ── Main Catalog Grid (Two Column) ── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* ── Sidebar Filters ── */}
          <motion.aside 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-[280px] shrink-0 lg:sticky lg:top-32 h-fit lg:pr-8 bg-neutral-50 p-6 rounded-2xl border border-neutral-100"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-black">Filters</h2>
              {(selectedCategory !== "All Products" || selectedBackSupport || selectedHours || selectedCapacity || maxPrice !== 25000) && (
                <button
                  onClick={clearFilters}
                  className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Back Support */}
            <div className="mb-8">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">Back Support</h3>
              <div className="flex flex-col gap-2">
                {["High Back"].map((bs) => (
                  <label key={bs} className="flex items-center gap-3 cursor-pointer text-xs font-bold text-slate-650 group">
                    <input
                      type="radio"
                      name="backSupport"
                      checked={selectedBackSupport === bs}
                      onChange={() => setSelectedBackSupport(selectedBackSupport === bs ? null : bs)}
                      className="accent-slate-900 w-4 h-4 cursor-pointer"
                    />
                    <span className="group-hover:text-slate-905 transition-colors">{bs}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Hours of Usage */}
            <div className="mb-8">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">Hours of Usage</h3>
              <div className="flex flex-col gap-2">
                {["6-8 Hours", "8+ Hours"].map((hr) => (
                  <label key={hr} className="flex items-center gap-3 cursor-pointer text-xs font-bold text-slate-650 group">
                    <input
                      type="radio"
                      name="hours"
                      checked={selectedHours === hr}
                      onChange={() => setSelectedHours(selectedHours === hr ? null : hr)}
                      className="accent-slate-900 w-4 h-4 cursor-pointer"
                    />
                    <span className="group-hover:text-slate-905 transition-colors">{hr}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Capacity (in KGs) */}
            <div className="mb-8">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">Capacity (in KGs)</h3>
              <div className="flex flex-col gap-2">
                {["120 kg", "150 kg"].map((cap) => (
                  <label key={cap} className="flex items-center gap-3 cursor-pointer text-xs font-bold text-slate-650 group">
                    <input
                      type="radio"
                      name="capacity"
                      checked={selectedCapacity === cap}
                      onChange={() => setSelectedCapacity(selectedCapacity === cap ? null : cap)}
                      className="accent-slate-900 w-4 h-4 cursor-pointer"
                    />
                    <span className="group-hover:text-slate-905 transition-colors">{cap}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Max Price</h3>
                <span className="text-[13px] font-black text-slate-900">₹{maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={0}
                max={25000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
              />
            </div>
          </motion.aside>

          {/* ── Product List Grid ── */}
          <main className="flex-1 w-full">
            <AnimatePresence mode="popLayout">
              {filteredProducts.length === 0 ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-slate-100 rounded-[32px] p-12 text-center shadow-[0_20px_40px_rgba(0,0,0,0.03)]"
                >
                  <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">No matching chairs found</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="grid"
                  layout
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10 justify-items-center w-full"
                >
                  {filteredProducts.map((prod) => (
                    <motion.div
                      key={prod.id}
                      layout
                      variants={itemVariants}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="w-full flex justify-center"
                    >
                      <ProductPageCard
                        product={prod}
                        isWishlisted={wishlisted[prod.id]}
                        onToggleWishlist={toggleWishlist}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </main>

        </div>
      </div>
    </div>
  );
}
