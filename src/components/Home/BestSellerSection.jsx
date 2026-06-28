"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Eye, Star } from "lucide-react";
import { BsCartPlus } from "react-icons/bs";

const BestSellerSectionCard = ({ product }) => {
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const timerRef = useRef(null);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const images = product.allImages && product.allImages.length > 0 
        ? product.allImages 
        : [product.image];

    useEffect(() => {
        // ✅ Mobile optimization: Disable image carousel on mobile (< 768px)
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        
        if (isHovered && images.length > 1 && !isMobile) {
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

    const handleAddToCart = (e) => {
        e.stopPropagation();
        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        };
        window.dispatchEvent(new CustomEvent('add-to-cart', { detail: cartItem }));
    };

    const toggleWishlist = (e) => {
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
        let list = [];
        try { list = JSON.parse(localStorage.getItem("astride_wishlist") || "[]"); } catch (err) {}
        if (!isWishlisted) {
            if (!list.some(p => p.id === product.id)) {
                list.push({ ...product });
            }
        } else {
            list = list.filter(p => p.id !== product.id);
        }
        localStorage.setItem("astride_wishlist", JSON.stringify(list));
        window.dispatchEvent(new Event("astride_wishlist_updated"));
    };

    // Auto-check wishlist status on mount
    useEffect(() => {
        try {
            const list = JSON.parse(localStorage.getItem("astride_wishlist") || "[]");
            if (list.some(p => p.id === product.id)) setIsWishlisted(true);
        } catch (err) {}
    }, [product.id]);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => router.push(`/products/${product.slug || product.id}`)}
            className="group relative rounded-2xl md:rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-none md:shadow-sm md:hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
        >
            {/* SALE / DISCOUNT BADGE */}
            <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20 flex flex-col gap-1 md:gap-2">
                <div className="px-2 py-1 md:px-3.5 md:py-1.5 rounded-full bg-zinc-900 text-white text-[8px] md:text-[11px] font-bold tracking-wider shadow-sm uppercase">
                    {product.discount}
                </div>
            </div>

            {/* QUICK ACTION BUTTONS */}
            <div className="hidden md:flex absolute top-4 right-4 z-20 flex-col gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                    onClick={toggleWishlist}
                    className={`w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center transition-colors duration-300 shadow-md ${
                        isWishlisted ? "bg-zinc-900 text-white" : "bg-white text-zinc-800 hover:bg-zinc-900 hover:text-white"
                    }`}
                >
                    <Heart size={16} className={isWishlisted ? "fill-current" : ""} />
                </button>

                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/products/${product.slug || product.id}`);
                    }}
                    className="w-10 h-10 rounded-full border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-900 hover:text-white flex items-center justify-center transition-colors duration-300 shadow-md"
                >
                    <Eye size={16} />
                </button>
            </div>

            {/* PRODUCT IMAGE CONTAINER */}
            <div className="relative h-[160px] md:h-[290px] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-zinc-50/50 to-transparent">
                <div className="relative z-10 p-3 md:p-6 w-full h-[130px] md:h-[230px] flex flex-col items-center justify-center">
                    <Image
                        src={images[currentImageIndex] || product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-4 md:p-6 shadow-none md:drop-shadow-[0_15px_30px_rgba(0,0,0,0.08)] scale-100 md:group-hover:scale-105 transition-all duration-300 md:duration-500"
                        sizes="(max-width: 768px) 50vw, 25vw"
                    />
                </div>
                
                {/* Pagination Dots */}
                {images.length > 1 && (
                    <div className="absolute bottom-2 flex gap-1.5 justify-center w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        {images.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-3 bg-zinc-800' : 'w-1.5 bg-zinc-300'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* PRODUCT DETAILS */}
            <div className="px-3 md:px-6 pt-2 md:pt-3 pb-3 md:pb-6 relative">
                
                {/* TITLE */}
                <h3 className="text-[16px] md:text-xl font-bold text-zinc-900 leading-tight">
                    {product.name}
                </h3>

                {/* RATING */}
                <div className="flex items-center gap-0.5 md:gap-1 mt-0.5 md:mt-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={10}
                            className={`md:w-[13px] md:h-[13px] ${
                                i < product.rating
                                    ? "fill-yellow-500 text-yellow-500"
                                    : "fill-zinc-200 text-zinc-200"
                            }`}
                        />
                    ))}

                    <span className="hidden md:inline text-xs text-zinc-400 ml-1 font-medium">
                        ({product.rating}.0 Reviews)
                    </span>
                </div>

                {/* DESCRIPTION */}
                <p className="hidden md:block text-zinc-500 text-[13px] mt-2.5 leading-relaxed line-clamp-2">
                    {product.description}
                </p>

                {/* PRICE AND CART */}
                <div className="flex items-end justify-between mt-2 md:mt-5 pt-2 md:pt-4 border-t border-zinc-100">
                    <div>
                        <p className="text-zinc-400 text-[10px] md:text-xs line-through mb-0 md:mb-0.5">
                            ₹{product.originalPrice.toLocaleString("en-IN")}
                        </p>

                        <h4 className="text-sm md:text-2xl font-black text-zinc-900 tracking-tight">
                            ₹{product.price.toLocaleString("en-IN")}
                        </h4>
                    </div>

                    {/* CART BUTTON */}
                    <button 
                        onClick={handleAddToCart}
                        className="w-7 h-7 md:w-11 md:h-11 rounded-full border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-900 hover:text-white flex items-center justify-center transition-colors duration-300 shadow-md"
                    >
                        <BsCartPlus className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function BestSellerSection() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                // Add cache busting timestamp to always fetch fresh data
                const res = await fetch(`/api/product?t=${Date.now()}`);
                const data = await res.json();
                if (data.success && data.products && data.products.length > 0) {
                    const mappedProducts = data.products.map((prod) => {
                        const discPercent = prod.oldPrice && prod.realPrice
                            ? Math.round((1 - (prod.realPrice / prod.oldPrice)) * 100)
                            : 60;
                        
                        let normalizedCategory = "Ergonomic Focus";
                        const dbCategory = prod.category && prod.category.name ? prod.category.name.toUpperCase() : "";
                        if (dbCategory.includes("GAMING") || dbCategory.includes("GAME")) normalizedCategory = "Premium Choice";
                        else if (dbCategory.includes("STUDY")) normalizedCategory = "Best Seller";
                        else if (dbCategory.includes("BAR") || dbCategory.includes("STOOL")) normalizedCategory = "Top Rated";

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
                            slug: prod.slug,
                            name: prod.productName,
                            price: prod.realPrice,
                            originalPrice: prod.oldPrice,
                            discount: `${discPercent}% OFF`,
                            tag: normalizedCategory,
                            image: blackImage || fallbackImage || "/Png1/chair12_ErgoFit.webp",
                            allImages: Array.from(new Set(allImages)),
                            rating: prod.rating || 5,
                            description: prod.shortDescription || "Premium ergonomic chair with breathable mesh, adjustable comfort, and modern luxury aesthetics."
                        };
                    });
                    
                    // Filter products to pick ones that have multiple images
                    const multipleImageProducts = mappedProducts.filter(p => p.allImages.length > 1);
                    
                    // Fill up to 8 products
                    const finalProducts = [...multipleImageProducts];
                    for (let p of mappedProducts) {
                        if (finalProducts.length >= 8) break;
                        if (!finalProducts.find(exist => exist.id === p.id)) {
                            finalProducts.push(p);
                        }
                    }
                    
                    setProducts(finalProducts.slice(0, 8));
                }
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
        
        // Auto-refresh every 10 seconds to catch product changes
        const interval = setInterval(fetchProducts, 10000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative overflow-hidden bg-zinc-50 py-5">
            {/* Lightweight Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-[-80px] w-[250px] h-[250px] bg-zinc-200/20 rounded-full blur-[50px]" />
                <div className="absolute bottom-[-80px] right-[-80px] w-[250px] h-[250px] bg-white rounded-full blur-[50px]" />
            </div>

            <div className="relative z-10 lg:px-15 md:px-10 px-6">
                
                {/* SECTION HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
                    <div className="flex flex-col items-start text-left">
                        <span className="inline-flex md:hidden items-center text-slate-500 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mb-2">
                            EXPLORE BESTSELLERS
                        </span>
                        <div className="text-5xl sm:text-6xl lg:text-[4rem] font-extrabold uppercase leading-[0.9] tracking-tighter">
                            <span className="block text-[#161316]">BEST SELLING</span>
                            <span className="block text-transparent [-webkit-text-stroke:1.5px_#18181b] mt-[6px]">CHAIRS</span>
                        </div>
                    </div>

                    <div>
                        <Link 
                            href="/products" 
                            className="group inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-full border border-zinc-900 text-zinc-900 font-bold uppercase tracking-wider text-xs md:text-sm hover:bg-zinc-900 hover:text-white transition-colors duration-300"
                        >
                            All Products
                            <span className="group-hover:translate-x-1 transition-transform duration-300">
                                →
                            </span>
                        </Link>
                    </div>
                </div>

                {/* PRODUCTS GRID */}
                {loading ? (
                    <div className="flex items-center justify-center py-20 w-full">
                        <div className="w-10 h-10 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-8">
                        {products.map((product) => (
                            <BestSellerSectionCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}