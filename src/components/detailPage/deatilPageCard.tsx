"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Truck, RotateCcw, ShieldCheck, ArrowRight, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import CustomButton from './deatileProductCardButton';
import gsap from 'gsap';

const COLOR_MAP: Record<string, string> = {
  black: '#000000',
  white: '#ffffff',
  red: '#dc2626',
  blue: '#2563eb',
  grey: '#4b5563',
  gray: '#4b5563',
  orange: '#ea580c',
  green: '#16a34a',
  yellow: '#ca8a04',
  pink: '#db2777',
  purple: '#9333ea',
  brown: '#7c2d12',
};

export default function DetailPageCard({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Red');
  const [activeImage, setActiveImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'description' | 'features' | 'specs' | 'application' | 'whychoose'>('description');
  const tabContentRef = useRef<HTMLDivElement>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  // When true, the selectedColor useEffect skips resetting activeImage (used by arrow navigation)
  const skipImageResetRef = useRef(false);

  useEffect(() => {
    if (product) {
      const saved = localStorage.getItem("astride_wishlist");
      if (saved) {
        try {
          const list = JSON.parse(saved);
          const exists = list.some((item: any) => item.id.toString() === product.id.toString());
          setIsWishlisted(exists);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [product]);

  const handleToggleWishlist = () => {
    if (!product) return;
    const saved = localStorage.getItem("astride_wishlist");
    let list: any[] = [];
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {}
    }
    
    const exists = list.some((item: any) => item.id.toString() === product.id.toString());
    if (exists) {
      list = list.filter((item: any) => item.id.toString() !== product.id.toString());
      setIsWishlisted(false);
    } else {
      const discountVal = product.discount || "60%";
      list.push({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || product.price * 2,
        discount: discountVal.replace("-", ""),
        image: activeImage || product.image,
        rating: product.rating || 4.7
      });
      setIsWishlisted(true);
    }
    localStorage.setItem("astride_wishlist", JSON.stringify(list));
    window.dispatchEvent(new Event("astride_wishlist_updated"));
  };

  // Set initial selected color, active image, and active tab when product changes
  useEffect(() => {
    if (product) {
      const firstVariantWithImages = product.colorVariants?.find((v: any) => v.images && v.images.length > 0);
      const initialColor = firstVariantWithImages?.colorName || product.colors?.[0] || "Black";
      setSelectedColor(initialColor);
      
      const initialImage = firstVariantWithImages?.images?.[0]?.url || product.image;
      setActiveImage(initialImage);
      
      // Keep description open by default
      setActiveTab('description');
    }
  }, [product]);

  useEffect(() => {
    if (product && selectedColor) {
      // If flagged by arrow navigation, just clear the flag and skip the image reset
      if (skipImageResetRef.current) {
        skipImageResetRef.current = false;
        return;
      }
      const variant = product.colorVariants?.find(
        (v: any) => v.colorName?.toLowerCase() === selectedColor?.toLowerCase()
      );
      if (variant && variant.images && variant.images.length > 0) {
        setActiveImage((curr) => {
          const isCurrentInVariant = variant.images.some((img: any) => img.url === curr);
          if (!isCurrentInVariant) {
            return variant.images[0].url;
          }
          return curr;
        });
      } else {
        setActiveImage(product.image);
      }
    }
  }, [selectedColor, product]);

  const handleThumbnailClick = (imgUrl: string) => {
    setActiveImage(imgUrl);
    // Find which color variant this image belongs to and select that color
    const variant = product?.colorVariants?.find((v: any) => 
      v.images?.some((img: any) => img.url === imgUrl)
    );
    if (variant && variant.colorName) {
      setSelectedColor(variant.colorName);
    }
  };

  useEffect(() => {
    if (tabContentRef.current) {
      gsap.fromTo(
        tabContentRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [activeTab]);

  const handleAddToCartClick = () => {
    if (!product) return;
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: activeImage || product.image,
      slug: product.slug,
      quantity: quantity,
      color: selectedColor
    };
    window.dispatchEvent(new CustomEvent('add-to-cart', { detail: cartItem }));
  };

  if (!product) {
    return (
      <div className="max-w-[1380px] mx-auto p-4 md:p-8 lg:p-10 bg-white min-h-screen flex items-center justify-center font-sans">
        <p className="text-base font-semibold text-red-500">Product not found.</p>
      </div>
    );
  }

  const allVariantImages = React.useMemo(() => {
    if (!product?.colorVariants) return [];
    // Always use a fixed order (same as colorVariants array) so arrow navigation
    // is stable and never reorders when selectedColor changes
    return product.colorVariants.reduce((acc: any[], v: any) => {
      if (v.images && v.images.length > 0) {
        return [...acc, ...v.images];
      }
      return acc;
    }, []);
  }, [product]);

  const isBarStool = product.category?.toLowerCase().includes("bar");

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const goNextImage = () => {
    const currentUrl = activeImage || product.image;
    const currentIndex = allVariantImages.findIndex((img: any) => img.url === currentUrl);
    if (currentIndex !== -1) {
      let nextImage;
      if (currentIndex < allVariantImages.length - 1) {
        nextImage = allVariantImages[currentIndex + 1].url;
      } else {
        nextImage = allVariantImages[0].url;
      }
      setActiveImage(nextImage);
      // Update the highlighted colour swatch without resetting the image
      const variant = product?.colorVariants?.find((v: any) =>
        v.images?.some((img: any) => img.url === nextImage)
      );
      if (variant && variant.colorName) {
        skipImageResetRef.current = true;
        setSelectedColor(variant.colorName);
      }
    }
  };

  const goPrevImage = () => {
    const currentUrl = activeImage || product.image;
    const currentIndex = allVariantImages.findIndex((img: any) => img.url === currentUrl);
    if (currentIndex !== -1) {
      let prevImage;
      if (currentIndex > 0) {
        prevImage = allVariantImages[currentIndex - 1].url;
      } else {
        prevImage = allVariantImages[allVariantImages.length - 1].url;
      }
      setActiveImage(prevImage);
      // Update the highlighted colour swatch without resetting the image
      const variant = product?.colorVariants?.find((v: any) =>
        v.images?.some((img: any) => img.url === prevImage)
      );
      if (variant && variant.colorName) {
        skipImageResetRef.current = true;
        setSelectedColor(variant.colorName);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      goNextImage();
    } else if (isRightSwipe) {
      goPrevImage();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div 
      className="max-w-[1380px] mx-auto p-4 md:p-6 lg:p-6 bg-white min-h-screen font-sans"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      <style>{`
        .description-style ul {
          list-style: none !important;
          padding-left: 0 !important;
          margin: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 16px !important;
        }
        .description-style li {
          position: relative !important;
          padding-left: 32px !important;
          list-style-type: none !important;
          color: #444 !important;
          font-size: 15px !important;
          line-height: 1.6 !important;
          font-family: inherit !important;
        }
        .description-style li::before {
          content: "" !important;
          position: absolute !important;
          left: 0 !important;
          top: 3px !important;
          width: 19px !important;
          height: 19px !important;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238B5CF6' stroke-width='2.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m5 13 4 4L19 7'/%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-size: contain !important;
        }
      `}</style>
      {/* Breadcrumbs */}
      <div className="text-[12px] md:text-[13px] text-neutral-400 font-medium mb-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 tracking-wide leading-relaxed">
        <span className="hover:text-black cursor-pointer transition-colors whitespace-nowrap">Home</span>
        <span className="text-neutral-300">/</span>
        <span className="hover:text-black cursor-pointer transition-colors whitespace-nowrap">{product.category}</span>
        <span className="text-neutral-300">/</span>
        <span className="text-neutral-600 font-semibold text-[13px] md:text-[14px]">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 xl:gap-10 mt-5">
        {/* Left: Image Gallery */}
        <div className="w-full lg:w-[38%] 2xl:w-[40%] flex flex-col gap-3">
          
          {/* Thumbnails strip - horizontal row below main image */}
          {allVariantImages.length > 1 && (
            <div className="order-2 flex flex-row gap-2.5 overflow-x-auto pb-1 scrollbar-none w-full justify-start">
              {allVariantImages.map((img: any, idx: number) => {
                const isActive = activeImage === img.url;
                return (
                  <button
                    key={idx}
                    onClick={() => handleThumbnailClick(img.url)}
                    className={`relative w-[72px] h-[72px] bg-white border-[2.5px] rounded-[14px] p-2 flex items-center justify-center transition-all duration-200 shrink-0 hover:-translate-y-1 ${
                      isActive 
                        ? 'border-[#8B5CF6] shadow-[3px_3px_0_#8B5CF6] -rotate-2' 
                        : 'border-[#131313] shadow-[3px_3px_0_rgba(19,19,19,0.85)]'
                    }`}
                  >
                    <Image 
                      src={img.url} 
                      alt={`Thumbnail ${idx + 1}`} 
                      fill 
                      className="object-contain p-1.5 mix-blend-multiply" 
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Main Image */}
          <div 
            id="main-product-image"
            className="order-1 w-full aspect-square relative group rounded-[28px] border-[2.5px] border-[#131313] bg-white shadow-[6px_6px_0_#131313] overflow-hidden flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Discount */}
            <div className="absolute right-5 top-5 flex h-[74px] w-[74px] rotate-[8deg] flex-col items-center justify-center rounded-full border-[2.5px] border-[#131313] bg-[#DCF351] text-center font-extrabold shadow-[3px_3px_0_#131313] z-20 pointer-events-none">
              <small className="text-[10px] uppercase tracking-wide">
                save
              </small>
              <span className="text-[15px]">{product.discount || "24%"}</span>
            </div>

            {/* Handwritten Note */}
            
            {allVariantImages.length > 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); goPrevImage(); }}
                className="absolute left-4 z-10 w-11 h-11 rounded-full bg-white border-2 border-[#131313] shadow-[3px_3px_0_#131313] hover:bg-[#DCF351] hover:-translate-y-0.5 hover:-translate-x-0.5 active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0_#131313] transition-all flex items-center justify-center text-slate-900"
              >
                <ChevronLeft size={22} strokeWidth={3} />
              </button>
            )}

            {(() => {
              const currentSrc = activeImage || product.image;
              const isLifestyle = currentSrc && (
                currentSrc.includes("unsplash") || 
                currentSrc.includes("lifestyle") ||
                currentSrc.includes("setup") ||
                currentSrc.includes("infographic") ||
                currentSrc.includes("banner") ||
                currentSrc.includes("/Product/") ||
                currentSrc.includes("/product/")
              );
              
              if (isLifestyle) {
                return (
                  <img 
                    src={currentSrc} 
                    alt={product.name} 
                    className="w-full h-full object-cover block"
                  />
                );
              }
              return (
                <img 
                  src={currentSrc} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-6 block"
                />
              );
            })()}

            {allVariantImages.length > 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); goNextImage(); }}
                className="absolute right-4 z-10 w-11 h-11 rounded-full bg-white border-2 border-[#131313] shadow-[3px_3px_0_#131313] hover:bg-[#DCF351] hover:-translate-y-0.5 hover:translate-x-0.5 active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0_#131313] transition-all flex items-center justify-center text-slate-900"
              >
                <ChevronRight size={22} strokeWidth={3} />
              </button>
            )}
          </div>

        </div>

        {/* Right: Details */}
        <div className="w-full lg:w-[50%] 2xl:w-[48%] flex flex-col pt-1 text-black">
          
          <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#EC4899]">
            {product.category}
          </div>
         
          
          <h1 className="text-[clamp(26px,2.8vw,42px)] font-black mt-2 leading-[1.05] tracking-tight">
            {product.name.split(' ')[0]} <span className="bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-transparent bg-clip-text">{product.name.split(' ').slice(1).join(' ')}</span>
          </h1>
          
          <div className="flex items-center gap-2.5 mt-2 font-semibold text-[13px]">
            <span className="text-[#ea580c] tracking-[2px] text-[15px]" aria-hidden="true">★★★★★</span>
            <span>{product.rating || "4.8"}</span>
            <a href="#reviews" className="text-[#777] border-b-[1.5px] border-dashed border-[#999] hover:text-[#EC4899] transition-colors">
              512 verified reviews
            </a>
          </div>

          <div className="flex items-baseline gap-3.5 my-3 flex-wrap">
            <span className="text-[clamp(24px,2.6vw,34px)] font-bold">₹{product.price.toLocaleString()}</span>
            <s className="text-[#999] text-[17px]">₹{product.originalPrice.toLocaleString()}</s>
            <span className="bg-[#DCF351] font-extrabold text-[11px] tracking-[0.06em] px-2.5 py-1 -rotate-2 shadow-[2px_2px_0_#131313]">
              You save ₹{(product.originalPrice - product.price).toLocaleString()}
            </span>
          </div>
          
          <p className="text-[11.5px] text-[#888]">Inclusive of all taxes.</p>
          
          <div 
            className="mt-2 text-[#444] max-w-[520px] text-[13.5px] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.shortDescription || `The chair your back has been manifesting. <strong style="color:#8B5CF6">Dynamic lumbar support</strong> that moves with you, breathable mesh that never gets sweaty, and <strong style="color:#8B5CF6">4D armrests</strong> for marathon sessions — work, ranked, or both.` }}
          />

          <div className="mt-3.5">
            <span className="text-[11px] font-bold tracking-[0.12em] uppercase flex gap-2 items-center">
              Colour — <span className="text-[#EC4899] normal-case tracking-normal font-bold">{selectedColor}</span>
            </span>
            <div className="flex items-center gap-2.5 mt-2 pr-1">
              {(product.colors || []).map((colorName: string) => {
                const colorHex = COLOR_MAP[colorName.toLowerCase()] || colorName.toLowerCase();
                const isSelected = selectedColor?.toLowerCase() === colorName?.toLowerCase();
                
                return (
                  <button 
                    key={colorName}
                    type="button"
                    onClick={() => {
                      setSelectedColor(colorName);
                      // Smoothly scroll up to the main product image on variant click
                      const el = document.getElementById("main-product-image");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "center" });
                      }
                    }}
                    style={{ backgroundColor: colorHex }}
                    className={`w-[32px] h-[32px] rounded-full border-[2.5px] border-[#131313] relative transition-transform duration-150 hover:scale-[1.12] focus:outline-none ${
                      isSelected 
                        ? 'ring-4 ring-offset-2 ring-transparent before:absolute before:-inset-[5px] before:rounded-full before:border-[2px] before:border-dashed before:border-[#8B5CF6]' 
                        : ''
                    }`}
                    title={colorName}
                    aria-label={colorName}
                  />
                );
              })}
              {/* Heart icon - mobile only, right-aligned in swatches row */}
              <button onClick={handleToggleWishlist} className={`lg:hidden ml-auto flex items-center gap-1.5 px-3 h-[36px] border-[2.5px] border-[#131313] rounded-full shadow-[3px_3px_0_#131313] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:shadow-[1px_1px_0_#131313] shrink-0 ${isWishlisted ? 'bg-[#fdf0f6]' : 'bg-white'}`} aria-label="Add to wishlist">
                <Heart size={14} className={`transition-all duration-200 ${isWishlisted ? 'fill-[#EC4899] stroke-[#EC4899] scale-110' : 'stroke-[#131313]'}`} />
                <span className={`text-[11px] font-extrabold tracking-[0.05em] uppercase transition-colors duration-200 ${isWishlisted ? 'text-[#EC4899]' : 'text-[#131313]'}`}>{isWishlisted ? 'Saved ✓' : 'Wishlist'}</span>
              </button>
            </div>
          </div>



          <div className="flex gap-3 mt-5 flex-wrap items-stretch">
            {/* Quantity */}
            <div className="flex items-center border-[2.5px] border-[#131313] rounded-[14px] bg-white shadow-[3px_3px_0_#131313]" aria-label="Quantity">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-[38px] h-full min-h-[46px] bg-transparent border-none text-[18px] font-bold hover:text-[#EC4899]">−</button>
              <span className="min-w-[28px] text-center font-extrabold text-[15px]">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-[38px] h-full min-h-[46px] bg-transparent border-none text-[18px] font-bold hover:text-[#EC4899]">+</button>
            </div>
            
            {/* Add to cart */}
            <button onClick={handleAddToCartClick} className="flex-1 min-w-[200px] bg-[#131313] text-white font-bold text-[15px] tracking-wide rounded-[14px] border-[2.5px] border-[#131313] shadow-[3px_3px_0_#131313] py-2.5 hover:translate-y-0.5 transition-transform">
              Add to cart <span className="ml-1.5 font-normal">→</span>
            </button>
            
            {/* Wishlist - desktop only, hidden on mobile since it's in the color row */}
            <button onClick={handleToggleWishlist} className={`hidden lg:grid w-[48px] min-h-[46px] border-[2.5px] border-[#131313] rounded-[14px] bg-white place-items-center shadow-[3px_3px_0_#131313] transition-transform duration-200 hover:-translate-y-1 ${isWishlisted ? 'group on' : 'group'}`} aria-label="Add to wishlist">
              <Heart size={20} className={`transition-colors duration-200 ${isWishlisted ? 'fill-[#EC4899] stroke-[#EC4899]' : 'stroke-[#131313] group-hover:stroke-[#EC4899]'}`} />
            </button>
          </div>
          
          <div className="mt-2.5 mb-4">
            <button onClick={handleAddToCartClick} className="w-full min-h-[46px] py-2.5 bg-white text-[#131313] font-bold text-[15px] tracking-wide rounded-[14px] border-[2.5px] border-[#131313] shadow-[3px_3px_0_#131313] hover:bg-[#fafafa] hover:translate-y-0.5 transition-all">
              Buy it now
            </button>
          </div>

          {/* Value Props - Premium Strip */}
          <div className="w-full flex items-stretch border-[2.5px] border-[#131313] rounded-[16px] bg-white shadow-[3px_3px_0_#131313] overflow-hidden mt-1">
            {/* Free Shipping */}
            <div className="flex-1 min-w-0 flex flex-col lg:flex-row items-center justify-center gap-1.5 px-1.5 py-2.5">
              <div className="w-[34px] h-[34px] rounded-[9px] bg-[#f0fdf4] border-[1.5px] border-[#131313] flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 3h15v13H1z" stroke="#16a34a" strokeWidth="1.8"/>
                  <path d="M16 8h4l3 4v4h-7V8z" stroke="#16a34a" strokeWidth="1.8"/>
                  <circle cx="5.5" cy="18.5" r="2" stroke="#16a34a" strokeWidth="1.8"/>
                  <circle cx="18.5" cy="18.5" r="2" stroke="#16a34a" strokeWidth="1.8"/>
                </svg>
              </div>
              <div className="min-w-0 text-center lg:text-left">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.04em] text-[#131313] leading-tight">Free Shipping</p>
                <p className="text-[8px] text-[#888] font-medium leading-none mt-0.5">Pan India</p>
              </div>
            </div>
            <div className="w-[1.5px] bg-[#e5e5e5] shrink-0 my-2" />
            {/* 30 Day Returns */}
            <div className="flex-1 min-w-0 flex flex-col lg:flex-row items-center justify-center gap-1.5 px-1.5 py-2.5">
              <div className="w-[34px] h-[34px] rounded-[9px] bg-[#fdf4ff] border-[1.5px] border-[#131313] flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="#9333ea" strokeWidth="1.8"/>
                  <path d="M3 3v5h5" stroke="#9333ea" strokeWidth="1.8"/>
                  <path d="M12 7v5l4 2" stroke="#9333ea" strokeWidth="1.8"/>
                </svg>
              </div>
              <div className="min-w-0 text-center lg:text-left">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.04em] text-[#131313] leading-tight">30 Day Returns</p>
                <p className="text-[8px] text-[#888] font-medium leading-none mt-0.5">No questions</p>
              </div>
            </div>
            <div className="w-[1.5px] bg-[#e5e5e5] shrink-0 my-2" />
            {/* 2 Year Warranty */}
            <div className="flex-1 min-w-0 flex flex-col lg:flex-row items-center justify-center gap-1.5 px-1.5 py-2.5">
              <div className="w-[34px] h-[34px] rounded-[9px] bg-[#fff7ed] border-[1.5px] border-[#131313] flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#ea580c" strokeWidth="1.8"/>
                  <path d="m9 12 2 2 4-4" stroke="#ea580c" strokeWidth="1.8"/>
                </svg>
              </div>
              <div className="min-w-0 text-center lg:text-left">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.04em] text-[#131313] leading-tight">2 Yr Warranty</p>
                <p className="text-[8px] text-[#888] font-medium leading-none mt-0.5">Full coverage</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* DETAILS Section */}
      <section className="py-[clamp(18px,2.5vw,26px)] mt-1 bg-[#FAFAFA] rounded-[32px] border-[2.5px] border-[#131313] px-4 md:px-10 lg:px-16 shadow-[8px_8px_0_#131313] relative overflow-hidden w-full">
            <div className="mb-6">
              <h2 className="text-[clamp(32px,4.4vw,54px)] font-bold leading-[1.05] tracking-tight text-[#131313]">
                Everything <span className="bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-transparent bg-clip-text">it's packing.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-[clamp(30px,5vw,70px)] items-start">
              {/* Accordion List */}
              <div className="flex flex-col gap-4">
                
                {/* Description */}
                <div className="bg-white border-[2.5px] border-[#131313] rounded-[14px] shadow-[5px_5px_0_#131313] overflow-hidden transition-all">
                  <button 
                    onClick={() => setActiveTab(activeTab === 'description' ? ('' as any) : 'description')}
                    className="w-full flex items-center gap-4 bg-transparent border-none text-left px-5 py-4 font-bold text-[16px]"
                  >
                    <span className="flex-none w-[34px] h-[34px] rounded-[10px] bg-[#f4f4f5] border-2 border-[#131313] grid place-items-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#131313" strokeWidth="2" className="w-[18px] h-[18px]"><path d="M4 6h16M4 12h16M4 18h10"/></svg>
                    </span>
                    Description
                    <span className={`ml-auto flex-none w-[30px] h-[30px] rounded-full border-2 border-[#131313] grid place-items-center text-[19px] font-bold transition-transform duration-300 ${activeTab === 'description' ? 'rotate-45 bg-[#EC4899] text-white' : 'bg-[#DCF351] text-[#131313]'}`}>
                      +
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${activeTab === 'description' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 pb-6 text-[#444] text-[15px] leading-[1.6]">
                      <p className="mb-6">The ErgoFit Premium is our most technologically advanced ergonomic chair yet — developed with orthopedic research to optimize posture, maximize breathability, and keep you locked in through long sessions.</p>
                      <ul className="space-y-4">
                        <li className="flex gap-4 items-start">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="flex-none w-[19px] h-[19px] mt-[3px]"><path d="m5 13 4 4L19 7"/></svg>
                          <span>Precision-engineered seat base with adjustable depth</span>
                        </li>
                        <li className="flex gap-4 items-start">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="flex-none w-[19px] h-[19px] mt-[3px]"><path d="m5 13 4 4L19 7"/></svg>
                          <span>Breathable premium mesh — zero swamp-back</span>
                        </li>
                        <li className="flex gap-4 items-start">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="flex-none w-[19px] h-[19px] mt-[3px]"><path d="m5 13 4 4L19 7"/></svg>
                          <span>Dynamic lumbar support that auto-adjusts in real time</span>
                        </li>
                        <li className="flex gap-4 items-start">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="flex-none w-[19px] h-[19px] mt-[3px]"><path d="m5 13 4 4L19 7"/></svg>
                          <span>Multi-dimensional 4D armrests</span>
                        </li>
                        <li className="flex gap-4 items-start">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="flex-none w-[19px] h-[19px] mt-[3px]"><path d="m5 13 4 4L19 7"/></svg>
                          <span>Smooth 360° revolve + whisper-quiet castors</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Specs */}
                <div className="bg-white border-[2.5px] border-[#131313] rounded-[14px] shadow-[5px_5px_0_#131313] overflow-hidden transition-all">
                  <button 
                    onClick={() => setActiveTab(activeTab === 'specs' ? ('' as any) : 'specs')}
                    className="w-full flex items-center gap-4 bg-transparent border-none text-left px-5 py-4 font-bold text-[16px]"
                  >
                    <span className="flex-none w-[34px] h-[34px] rounded-[10px] bg-[#f4f4f5] border-2 border-[#131313] grid place-items-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#131313" strokeWidth="2" className="w-[18px] h-[18px]"><path d="M14 3v6h6M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z"/></svg>
                    </span>
                    Specifications
                    <span className={`ml-auto flex-none w-[30px] h-[30px] rounded-full border-2 border-[#131313] grid place-items-center text-[19px] font-bold transition-transform duration-300 ${activeTab === 'specs' ? 'rotate-45 bg-[#EC4899] text-white' : 'bg-[#DCF351] text-[#131313]'}`}>
                      +
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${activeTab === 'specs' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 pb-6 text-[#444] text-[14.5px]">
                      <table className="w-full border-collapse mt-1.5">
                        <tbody>
                          {(product.specifications && product.specifications.length > 0 ? product.specifications : [
                            { name: 'Seat height', value: '18" – 22", gas-lift adjustable' },
                            { name: 'Armrest height', value: '6" – 10", 4D adjustable' },
                            { name: 'Weight capacity', value: 'Up to 135 kg' },
                            { name: 'Assembly', value: '10–15 mins, tools included' }
                          ]).map((spec: any, idx: number) => (
                            <tr key={idx}>
                              <td className="py-2.5 px-1 border-b-[1.5px] border-dashed border-[#d8cdb4] font-bold uppercase text-[12px] tracking-[0.08em] text-[#666] w-[46%]">{spec.name || spec.key}</td>
                              <td className="py-2.5 px-1 border-b-[1.5px] border-dashed border-[#d8cdb4] text-[14px]">{spec.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Application */}
                <div className="bg-white border-[2.5px] border-[#131313] rounded-[14px] shadow-[5px_5px_0_#131313] overflow-hidden transition-all">
                  <button 
                    onClick={() => setActiveTab(activeTab === 'application' ? ('' as any) : 'application')}
                    className="w-full flex items-center gap-4 bg-transparent border-none text-left px-5 py-4 font-bold text-[16px]"
                  >
                    <span className="flex-none w-[34px] h-[34px] rounded-[10px] bg-[#f4f4f5] border-2 border-[#131313] grid place-items-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#131313" strokeWidth="2" className="w-[18px] h-[18px]"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    </span>
                    Application
                    <span className={`ml-auto flex-none w-[30px] h-[30px] rounded-full border-2 border-[#131313] grid place-items-center text-[19px] font-bold transition-transform duration-300 ${activeTab === 'application' ? 'rotate-45 bg-[#EC4899] text-white' : 'bg-[#DCF351] text-[#131313]'}`}>
                      +
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${activeTab === 'application' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 pb-6 text-[#444] text-[15px] leading-[1.6]">
                      {product.application ? (
                        <div 
                          className="animate-fade-in space-y-4 description-style"
                          dangerouslySetInnerHTML={{ __html: product.application }}
                        />
                      ) : isBarStool ? (
                        <ul className="space-y-4 animate-fade-in">
                          <li className="flex gap-4 items-start">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="flex-none w-[19px] h-[19px] mt-[3px]"><path d="m5 13 4 4L19 7"/></svg>
                            <div><strong className="text-black font-semibold">Kitchen Counter & Islands:</strong> Perfect height and swivel features designed for premium home kitchen setups.</div>
                          </li>
                          <li className="flex gap-4 items-start">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="flex-none w-[19px] h-[19px] mt-[3px]"><path d="m5 13 4 4L19 7"/></svg>
                            <div><strong className="text-black font-semibold">Cafés, Bars & Restaurants:</strong> Durable frame and elegant aesthetics built to withstand high-traffic commercial dining environments.</div>
                          </li>
                          <li className="flex gap-4 items-start">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="flex-none w-[19px] h-[19px] mt-[3px]"><path d="m5 13 4 4L19 7"/></svg>
                            <div><strong className="text-black font-semibold">Lounge & Reception Areas:</strong> Adds a touch of sophistication to modern reception tables and relaxation zones.</div>
                          </li>
                        </ul>
                      ) : (
                        <ul className="space-y-4 animate-fade-in">
                          <li className="flex gap-4 items-start">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="flex-none w-[19px] h-[19px] mt-[3px]"><path d="m5 13 4 4L19 7"/></svg>
                            <div><strong className="text-black font-semibold">Office & Professional Workspace:</strong> Engineered to support 8+ hours of continuous usage with optimal posture correction.</div>
                          </li>
                          <li className="flex gap-4 items-start">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="flex-none w-[19px] h-[19px] mt-[3px]"><path d="m5 13 4 4L19 7"/></svg>
                            <div><strong className="text-black font-semibold">Home Office & Study Rooms:</strong> Compact and stylish design that integrates beautifully into home workspaces without cluttering.</div>
                          </li>
                          <li className="flex gap-4 items-start">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="flex-none w-[19px] h-[19px] mt-[3px]"><path d="m5 13 4 4L19 7"/></svg>
                            <div><strong className="text-black font-semibold">Gaming Setups:</strong> High-back support, comfortable cushioning, and dynamic armrests tailored for gamers.</div>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-white border-[2.5px] border-[#131313] rounded-[14px] shadow-[5px_5px_0_#131313] overflow-hidden transition-all">
                  <button 
                    onClick={() => setActiveTab(activeTab === 'features' ? ('' as any) : 'features')}
                    className="w-full flex items-center gap-4 bg-transparent border-none text-left px-5 py-4 font-bold text-[16px]"
                  >
                    <span className="flex-none w-[34px] h-[34px] rounded-[10px] bg-[#f4f4f5] border-2 border-[#131313] grid place-items-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#131313" strokeWidth="2" className="w-[18px] h-[18px]"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </span>
                    Key Features
                    <span className={`ml-auto flex-none w-[30px] h-[30px] rounded-full border-2 border-[#131313] grid place-items-center text-[19px] font-bold transition-transform duration-300 ${activeTab === 'features' ? 'rotate-45 bg-[#EC4899] text-white' : 'bg-[#DCF351] text-[#131313]'}`}>
                      +
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${activeTab === 'features' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 pb-6 text-[#444] text-[15px] leading-[1.6]">
                      {product.keyfeatures ? (
                        <div 
                          className="animate-fade-in space-y-4 description-style"
                          dangerouslySetInnerHTML={{ __html: product.keyfeatures }}
                        />
                      ) : (
                        <ul className="space-y-4 animate-fade-in">
                          <li className="flex gap-4 items-start">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="flex-none w-[19px] h-[19px] mt-[3px]"><path d="m5 13 4 4L19 7"/></svg>
                            <div><strong className="text-black font-semibold">Adjusts as per you :</strong> The specially designed frog mechanism allows you to lock the chair at different angles apt for different activities.</div>
                          </li>
                          <li className="flex gap-4 items-start">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="flex-none w-[19px] h-[19px] mt-[3px]"><path d="m5 13 4 4L19 7"/></svg>
                            <div><strong className="text-black font-semibold">Breathable fabric :</strong> Made with a combination of breathable Spandex and PU leather refrains heat build up and supports better air circulation.</div>
                          </li>
                          <li className="flex gap-4 items-start">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="flex-none w-[19px] h-[19px] mt-[3px]"><path d="m5 13 4 4L19 7"/></svg>
                            <div><strong className="text-black font-semibold">Remembers you :</strong> The memory foam lumbar pillow takes the shape of your spine and supports your back.</div>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                {/* Why Choose Astride Accordion */}
                <div className="bg-white border-[2.5px] border-[#131313] rounded-[14px] shadow-[5px_5px_0_#131313] overflow-hidden transition-all">
                  <button 
                    onClick={() => setActiveTab(activeTab === 'whychoose' ? ('' as any) : 'whychoose')}
                    className="w-full flex items-center gap-4 bg-transparent border-none text-left px-5 py-4 font-bold text-[16px]"
                  >
                    <span className="flex-none w-[34px] h-[34px] rounded-[10px] bg-[#f4f4f5] border-2 border-[#131313] grid place-items-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#131313" strokeWidth="2" className="w-[18px] h-[18px]"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 16v-4M12 8h.01"/></svg>
                    </span>
                    Why Choose Astride
                    <span className={`ml-auto flex-none w-[30px] h-[30px] rounded-full border-2 border-[#131313] grid place-items-center text-[19px] font-bold transition-transform duration-300 ${activeTab === 'whychoose' ? 'rotate-45 bg-[#EC4899] text-white' : 'bg-[#DCF351] text-[#131313]'}`}>
                      +
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${activeTab === 'whychoose' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 pb-6 text-[#444] text-[15px] leading-[1.6]">
                      <ul className="space-y-4 animate-fade-in">
                        <li className="flex gap-4 items-start">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="flex-none w-[19px] h-[19px] mt-[3px]"><path d="m5 13 4 4L19 7"/></svg>
                          <span><strong className="text-black font-semibold">Ergonomic Innovation:</strong> ASTRIDE® is dedicated to delivering high-quality office seating solutions that combine comfort, durability, and ergonomic innovation.</span>
                        </li>
                        <li className="flex gap-4 items-start">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="flex-none w-[19px] h-[19px] mt-[3px]"><path d="m5 13 4 4L19 7"/></svg>
                          <span><strong className="text-black font-semibold">Postural Support:</strong> Designed to support healthy posture and improve productivity through thoughtful ergonomic features.</span>
                        </li>
                        <li className="flex gap-4 items-start">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="flex-none w-[19px] h-[19px] mt-[3px]"><path d="m5 13 4 4L19 7"/></svg>
                          <span><strong className="text-black font-semibold">Premium Materials:</strong> Manufactured using premium nylon and polypropylene materials for superior durability and dependable long-term performance.</span>
                        </li>
                        <li className="flex gap-4 items-start">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="flex-none w-[19px] h-[19px] mt-[3px]"><path d="m5 13 4 4L19 7"/></svg>
                          <span><strong className="text-black font-semibold">Adaptive Functionality:</strong> Features adjustable seating functionality that adapts to different users and workspace requirements.</span>
                        </li>
                        <li className="flex gap-4 items-start">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="flex-none w-[19px] h-[19px] mt-[3px]"><path d="m5 13 4 4L19 7"/></svg>
                          <span><strong className="text-black font-semibold">Versatile Aesthetics:</strong> Combines professional aesthetics with practical usability, making it suitable for both residential and commercial applications.</span>
                        </li>
                        <li className="flex gap-4 items-start">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="flex-none w-[19px] h-[19px] mt-[3px]"><path d="m5 13 4 4L19 7"/></svg>
                          <span><strong className="text-black font-semibold">Exceptional Value:</strong> Offers exceptional value through its blend of ergonomic comfort, durable construction, modern styling, and reliable performance.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>

              {/* Dials Card */}
              <div className="bg-[#131313] text-white rounded-[28px] p-[clamp(26px,3vw,40px)] rotate-0 lg:rotate-[0.8deg] shadow-[10px_10px_0_#8B5CF6] relative">
                <span className="absolute -top-4 right-5 bg-[#DCF351] text-[#131313] font-bold text-[14px] px-3.5 py-1.5 rotate-[3deg] shadow-[3px_3px_0_rgba(0,0,0,0.6)] border-2 border-[#131313] whitespace-nowrap">
                  fits everybody ✦
                </span>
                <h3 className="font-bold text-[22px] uppercase leading-[1.05]">
                  One chair. <br/><em className="not-italic bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-transparent bg-clip-text">Universal adjustability.</em>
                </h3>
                
                <div className="mt-4">
                  <div className="flex justify-between items-center py-4 border-b-[1.5px] border-dashed border-[#3a3a3a]">
                    <span className="text-[12px] tracking-[0.12em] uppercase text-[#9a9a9a] font-semibold">Seat height</span>
                    <b className="font-bold text-[21px] bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-transparent bg-clip-text">18" – 22"</b>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b-[1.5px] border-dashed border-[#3a3a3a]">
                    <span className="text-[12px] tracking-[0.12em] uppercase text-[#9a9a9a] font-semibold">Armrest height</span>
                    <b className="font-bold text-[21px] bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-transparent bg-clip-text">6" – 10"</b>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b-[1.5px] border-dashed border-[#3a3a3a]">
                    <span className="text-[12px] tracking-[0.12em] uppercase text-[#9a9a9a] font-semibold">Weight capacity</span>
                    <b className="font-bold text-[21px] bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-transparent bg-clip-text">135 kg</b>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="text-[12px] tracking-[0.12em] uppercase text-[#9a9a9a] font-semibold">Recline lock</span>
                    <b className="font-bold text-[21px] bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-transparent bg-clip-text">4 positions</b>
                  </div>
                </div>
                <div className="mt-6 flex justify-center drop-shadow-[0_0_60px_rgba(255,255,255,1)] drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]">
                  <Image src={product.image || "/Png1/chair12_ErgoFit.webp"} alt="Adjustability" width={240} height={230} className="object-contain max-h-[230px]" />
                </div>
              </div>
            </div>
          </section>
    </div>
  );
}
