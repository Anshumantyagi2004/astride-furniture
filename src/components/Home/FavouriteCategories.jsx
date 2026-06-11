"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { BsCartPlus } from "react-icons/bs";
import { useRouter } from "next/navigation";

import { Plus_Jakarta_Sans } from "next/font/google";

const sans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-sans",
});

const TABS = ["Bar Stool", "Gaming Chair", "Office Chair", "Staff Chair", "Study Chair"];

const FavouriteCard = ({ product, index, activeCategory, isWishlisted, onToggleWishlist }) => {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const [isHovered, setIsHovered] = React.useState(false);
    const timerRef = React.useRef(null);
    const router = useRouter();

    const images = product.allImages && product.allImages.length > 0 
        ? product.allImages 
        : [product.image];

    React.useEffect(() => {
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

    // Use actual DB values mapped from our API
    const salePrice = product.price || 0;
    const originalPrice = product.originalPrice || 0;
    const discountText = product.discount || "-0%";
    const ratingValue = product.rating || 4.7;
    const ratingReviews = 12 + (index * 7); // Dynamic mock review count for visual balance

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 15 },
                show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } }
            }}
            whileHover={{ y: -6 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => router.push(`/products/${product.id}`)}
            className="group relative rounded-[24px] overflow-hidden bg-white border border-gray-200/60 transition-all duration-300 hover:border-slate-300/80 hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)] min-w-[270px] sm:min-w-0 snap-start flex-shrink-0 cursor-pointer font-sans"
        >
            {/* Action Buttons (Fade in on hover) */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                <button 
                    className={`w-[34px] h-[34px] rounded-full shadow-sm border border-gray-100 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 ${
                        isWishlisted ? "bg-[#161316] text-white" : "bg-white text-gray-500 hover:bg-[#161316] hover:text-white"
                    }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product.id);
                    }}
                >
                    <Heart size={15} className={isWishlisted ? "fill-current" : ""} />
                </button>

                <button 
                    className="w-[34px] h-[34px] rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#161316] hover:text-white hover:scale-105 active:scale-95 transition-all duration-200"
                    onClick={(e) => {
                        e.stopPropagation();
                        window.dispatchEvent(new CustomEvent('add-to-cart', { detail: { ...product, quantity: 1 } }));
                    }}
                >
                    <BsCartPlus size={16} />
                </button>
            </div>

            {/* Image Container with premium rounded margins & neutral background */}
            <div className="m-3 rounded-2xl relative h-[220px] bg-[#F3F4F6] overflow-hidden flex flex-col items-center justify-center">
                <Image
                    src={images[currentImageIndex] || product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-6 transform scale-100 group-hover:scale-105 transition-all duration-500 ease-in-out"
                />

                {/* Pagination Dots */}
                {images.length > 1 && (
                    <div className="absolute bottom-2 flex gap-1.5 justify-center w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        {images.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-3 bg-slate-800' : 'w-1.5 bg-slate-300'}`}
                            />
                        ))}
                    </div>
                )}

                {/* Premium Rating Badge - Bottom-Left */}
                <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-[6px] border border-gray-100 shadow-xs text-[10px] font-bold text-gray-700 flex items-center gap-1 font-sans">
                    <span>{ratingValue}</span>
                    <span className="text-[#8B5CF6] text-xs">★</span>
                    <span className="text-gray-400 font-normal">({ratingReviews})</span>
                </div>
            </div>

            {/* Card Details Area */}
            <div className="px-5 pb-5 pt-1 font-sans">
                {/* Brand/Subtitle */}
                <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#8B5CF6] mb-1 font-sans">
                    Astride Premium
                </div>

                {/* Product Title */}
                <h3 className="text-[16px] font-semibold text-gray-800 line-clamp-1 group-hover:text-[#8B5CF6] transition-colors duration-300 font-sans">
                    {product.name}
                </h3>

                {/* Pricing Row */}
                <div className="flex items-baseline gap-2 mt-2 font-sans">
                    <span className="text-base sm:text-[17px] font-bold text-gray-900 font-sans">
                        ₹{salePrice.toLocaleString("en-IN")}
                    </span>

                    <span className="text-xs text-gray-400 line-through font-sans">
                        ₹{originalPrice.toLocaleString("en-IN")}
                    </span>

                    <span className="text-[11px] font-bold text-[#EC4899] font-sans">
                        {discountText} OFF
                    </span>
                </div>
            </div>

            {/* Decorative subtle bottom hover bar */}
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </motion.div>
    );
};

export default function FavouriteCategories() {
    const [activeCategory, setActiveCategory] = useState("Bar Stool");
    const [productsList, setProductsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlisted, setWishlisted] = useState({});

    useEffect(() => {
        const saved = localStorage.getItem("astride_wishlist");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const dict = {};
                parsed.forEach(item => { dict[item.id] = true; });
                setWishlisted(dict);
            } catch (e) {}
        }
    }, []);

    const toggleWishlist = (id) => {
        setWishlisted((prev) => {
            const updated = { ...prev, [id]: !prev[id] };
            const product = productsList.find(p => p.id === id);
            let list = [];
            try { list = JSON.parse(localStorage.getItem("astride_wishlist") || "[]"); } catch (e) {}
            if (updated[id]) {
                if (product && !list.some(p => p.id === id)) {
                    list.push({
                        id: product.id, name: product.name, price: product.price,
                        originalPrice: product.originalPrice, discount: product.discount,
                        image: product.image, rating: product.rating
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
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    const activeProducts = productsList.filter(p => p.category === activeCategory);

    return (
        <section className={`w-full pt-16 pb-10 bg-[#F8F9FA] overflow-hidden ${sans.className}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-start text-left mb-4">
                    <span className="inline-flex items-center text-[#8B5CF6] text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mb-2 font-sans">
                        Explore Collections
                    </span>
                    <div className="text-5xl sm:text-6xl lg:text-[4rem] font-extrabold uppercase leading-[0.9] tracking-tighter font-sans">
                        <span className="block text-[#161316] font-sans">TRENDING</span>
                        <span 
                            className="block font-sans font-black"
                            style={{
                                backgroundImage: "linear-gradient(to right, #8B5CF6, #EC4899, #F97316)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                                color: "transparent"
                            }}
                        >
                            NOW
                        </span>
                    </div>
                </div>

                {/* Fluid active tab switcher */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-1.5 bg-gray-100 rounded-full max-w-2xl mx-auto mt-4 border border-gray-200/50">
                    {TABS.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className="relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-300 focus:outline-none"
                        >
                            {activeCategory === category && (
                                <motion.div
                                    layoutId="activeCategoryBg"
                                    className="absolute inset-0 bg-[#161316] rounded-full shadow-sm"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                            <span
                                className={`relative z-10 transition-colors duration-300 ${
                                    activeCategory === category ? "text-white" : "text-gray-500 hover:text-gray-900"
                                }`}
                            >
                                {category}
                            </span>
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory}
                            variants={{
                                hidden: { opacity: 0 },
                                show: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.04 }
                                }
                            }}
                            initial="hidden"
                            animate="show"
                            exit={{ opacity: 0, transition: { duration: 0.15 } }}
                            className="flex overflow-x-auto gap-4 pb-4 scrollbar-none snap-x snap-mandatory sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6 sm:pb-0 sm:overflow-visible mt-12"
                        >
                            {activeProducts.length > 0 ? (
                                activeProducts.map((product, index) => (
                                    <FavouriteCard 
                                        key={product.id} 
                                        product={product} 
                                        index={index} 
                                        activeCategory={activeCategory} 
                                        isWishlisted={wishlisted[product.id]}
                                        onToggleWishlist={toggleWishlist}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center text-slate-400 font-medium">
                                    No products found in this category.
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </section>
    );
}