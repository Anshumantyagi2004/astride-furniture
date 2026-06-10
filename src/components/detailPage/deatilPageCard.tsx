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
  const [activeTab, setActiveTab] = useState<'description' | 'features' | 'specs' | 'application'>('description');
  const tabContentRef = useRef<HTMLDivElement>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

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

  // Set initial selected color and active image when product changes
  useEffect(() => {
    if (product) {
      const firstVariantWithImages = product.colorVariants?.find((v: any) => v.images && v.images.length > 0);
      const initialColor = firstVariantWithImages?.colorName || product.colors?.[0] || "Black";
      setSelectedColor(initialColor);
      
      const initialImage = firstVariantWithImages?.images?.[0]?.url || product.image;
      setActiveImage(initialImage);
    }
  }, [product]);

  useEffect(() => {
    if (product && selectedColor) {
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
      id: `${product.id}-${selectedColor}`,
      name: product.name,
      price: product.price,
      image: activeImage || product.image,
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

  const allVariantImages = product?.colorVariants?.reduce(
    (acc: any[], variant: any) => {
      if (variant.images) {
        return [...acc, ...variant.images];
      }
      return acc;
    },
    []
  ) || [];

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
      // Synchronize color selection indicator with the active image's variant
      const variant = product?.colorVariants?.find((v: any) => 
        v.images?.some((img: any) => img.url === nextImage)
      );
      if (variant && variant.colorName) {
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
      // Synchronize color selection indicator with the active image's variant
      const variant = product?.colorVariants?.find((v: any) => 
        v.images?.some((img: any) => img.url === prevImage)
      );
      if (variant && variant.colorName) {
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
      className="max-w-[1380px] mx-auto p-4 md:p-8 lg:p-10 bg-white min-h-screen font-sans"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* Breadcrumbs */}
      <div className="text-[13px] md:text-[15px] text-neutral-400 font-medium mb-6 flex flex-wrap items-center gap-x-1.5 gap-y-1 tracking-wide leading-relaxed">
        <span className="hover:text-black cursor-pointer transition-colors whitespace-nowrap">Home</span>
        <span className="text-neutral-300">/</span>
        <span className="hover:text-black cursor-pointer transition-colors whitespace-nowrap">{product.category}</span>
        <span className="text-neutral-300">/</span>
        <span className="text-neutral-600 font-semibold text-[14px] md:text-[16px]">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 mt-2">
        {/* Left: Image Gallery */}
        <div className="w-full lg:w-[44%] lg:sticky lg:top-20 self-start flex flex-col gap-4">
          
          {/* Main Image */}
          <div 
            className="w-full h-[350px] md:h-[500px] lg:h-[600px] xl:h-[700px] flex items-center justify-center relative group rounded-[28px] border-[2.5px] border-[#131313] bg-[radial-gradient(ellipse_at_50%_78%,#ece4d2,#fff_72%)] shadow-[6px_6px_0_#131313] shrink-0"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Sticker */}
            <span className="absolute -top-4 left-5 rotate-[-3deg] bg-[#EC4899] px-4 py-2 text-[15px] font-bold text-white shadow-[3px_3px_0_#131313] z-20 pointer-events-none">
              hot rn 🔥
            </span>

            {/* Discount */}
            <div className="absolute right-5 top-5 flex h-[74px] w-[74px] rotate-[8deg] flex-col items-center justify-center rounded-full border-[2.5px] border-[#131313] bg-[#DCF351] text-center font-extrabold shadow-[3px_3px_0_#131313] z-20 pointer-events-none">
              <small className="text-[10px] uppercase tracking-wide">
                save
              </small>
              <span className="text-[15px]">{product.discount || "24%"}</span>
            </div>

            {/* Handwritten Note */}
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rotate-[-2.5deg] border-b-4 border-[#8B5CF6] text-[18px] md:text-[22px] font-bold text-[#8B5CF6] whitespace-nowrap z-20 pointer-events-none">
              main character energy.
            </span>
            {allVariantImages.length > 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); goPrevImage(); }}
                className="absolute left-4 lg:hidden z-10 w-9 h-9 rounded-full bg-white/60 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex items-center justify-center text-slate-700 active:bg-white transition-all duration-200 ease-out active:scale-90"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>
            )}

            <Image 
              src={activeImage || product.image} 
              alt={product.name} 
              fill
              className="object-contain p-8 lg:p-12 hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply"
            />

            {allVariantImages.length > 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); goNextImage(); }}
                className="absolute right-4 lg:hidden z-10 w-9 h-9 rounded-full bg-white/60 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex items-center justify-center text-slate-700 active:bg-white transition-all duration-200 ease-out active:scale-90"
              >
                <ChevronRight size={20} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Thumbnails strip */}
          {allVariantImages.length > 1 && (
            <div className="flex flex-row justify-center lg:justify-start gap-3.5 shrink-0 overflow-x-auto pb-2 scrollbar-none w-full">
              {allVariantImages.map((img: any, idx: number) => {
                const isActive = activeImage === img.url;
                return (
                  <button
                    key={idx}
                    onClick={() => handleThumbnailClick(img.url)}
                    className={`relative w-[72px] lg:w-[86px] aspect-square bg-white border-[2.5px] rounded-[14px] p-2.5 flex items-center justify-center transition-all duration-200 shrink-0 hover:-translate-y-1 ${
                      isActive 
                        ? 'border-[#8B5CF6] shadow-[3px_3px_0_#8B5CF6] -rotate-2' 
                        : 'border-[#131313] shadow-[3px_3px_0_rgba(19,19,19,0.85)]'
                    }`}
                  >
                    <Image 
                      src={img.url} 
                      alt={`Thumbnail ${idx + 1}`} 
                      fill 
                      className="object-contain p-2 mix-blend-multiply" 
                    />
                  </button>
                );
              })}
            </div>
          )}

        </div>

        {/* Right: Details */}
        <div className="w-full lg:w-[58%] flex flex-col pt-2 text-black">
          
          <div className="text-[12px] font-bold tracking-[0.16em] uppercase text-[#EC4899]">
            {product.category} · SKU AST-{product.id || 'EF12'}
          </div>
          <span className="table mt-3.5 text-neutral-500 font-medium">Comfort that hits different.</span>
          
          <h1 className="text-[clamp(36px,4.6vw,60px)] font-bold mt-4 leading-[1.1] tracking-tight">
            {product.name.split(' ')[0]} <span className="bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-transparent bg-clip-text">{product.name.split(' ').slice(1).join(' ')}</span>
          </h1>
          
          <div className="flex items-center gap-2.5 mt-3.5 font-semibold text-[14px]">
            <span className="text-[#ea580c] tracking-[2px] text-[17px]" aria-hidden="true">★★★★★</span>
            <span>{product.rating || "4.8"}</span>
            <a href="#reviews" className="text-[#777] border-b-[1.5px] border-dashed border-[#999] hover:text-[#EC4899] transition-colors">
              512 verified reviews
            </a>
          </div>

          <div className="flex items-baseline gap-3.5 my-5 flex-wrap">
            <span className="text-[clamp(30px,3.4vw,42px)] font-bold">₹{product.price.toLocaleString()}</span>
            <s className="text-[#999] text-[19px]">₹{product.originalPrice.toLocaleString()}</s>
            <span className="bg-[#DCF351] font-extrabold text-[12px] tracking-[0.06em] px-3 py-1.5 -rotate-2 shadow-[2.5px_2.5px_0_#131313]">
              You save ₹{(product.originalPrice - product.price).toLocaleString()}
            </span>
          </div>
          
          <p className="text-[12.5px] text-[#888]">Inclusive of all taxes. Free shipping, obviously.</p>
          
          <div 
            className="mt-4 text-[#444] max-w-[520px] text-[15px] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.shortDescription || `The chair your back has been manifesting. <strong style="color:#8B5CF6">Dynamic lumbar support</strong> that moves with you, breathable mesh that never gets sweaty, and <strong style="color:#8B5CF6">4D armrests</strong> for marathon sessions — work, ranked, or both.` }}
          />

          <div className="mt-6">
            <span className="text-[12px] font-bold tracking-[0.14em] uppercase flex gap-2 items-center">
              Colour — <span className="text-[#EC4899] normal-case tracking-normal font-bold">{selectedColor}</span>
            </span>
            <div className="flex gap-3 mt-3">
              {(product.colors || []).map((colorName: string) => {
                const colorHex = COLOR_MAP[colorName.toLowerCase()] || colorName.toLowerCase();
                const isSelected = selectedColor?.toLowerCase() === colorName?.toLowerCase();
                
                return (
                  <button 
                    key={colorName}
                    type="button"
                    onClick={() => {
                      setSelectedColor(colorName);
                    }}
                    style={{ backgroundColor: colorHex }}
                    className={`w-[42px] h-[42px] rounded-full border-[2.5px] border-[#131313] relative transition-transform duration-150 hover:scale-[1.12] focus:outline-none ${
                      isSelected 
                        ? 'ring-4 ring-offset-2 ring-transparent before:absolute before:-inset-[7px] before:rounded-full before:border-[2.5px] before:border-dashed before:border-[#8B5CF6]' 
                        : ''
                    }`}
                    title={colorName}
                    aria-label={colorName}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <span className="text-[12px] font-bold tracking-[0.14em] uppercase flex gap-2 items-center">
              Fit — <span className="text-[#EC4899] normal-case tracking-normal font-bold">Standard</span>
            </span>
            <div className="flex gap-3 mt-3 flex-wrap">
              <button className="bg-white border-[2.5px] border-[#131313] rounded-xl px-4.5 py-3 font-bold text-[13px] tracking-[0.05em] uppercase shadow-[3px_3px_0_rgba(19,19,19,0.85)] transition-transform duration-150 hover:-translate-y-0.5">Low profile</button>
              <button className="bg-[#131313] text-[#DCF351] border-[2.5px] border-[#131313] rounded-xl px-4.5 py-3 font-bold text-[13px] tracking-[0.05em] uppercase shadow-[3px_3px_0_rgba(19,19,19,0.85)] transition-transform duration-150 -rotate-1.5 hover:-translate-y-0.5">Standard</button>
              <button className="bg-white border-[2.5px] border-[#131313] rounded-xl px-4.5 py-3 font-bold text-[13px] tracking-[0.05em] uppercase shadow-[3px_3px_0_rgba(19,19,19,0.85)] transition-transform duration-150 hover:-translate-y-0.5">Extended height</button>
            </div>
          </div>

          <div className="flex gap-4 mt-8 flex-wrap items-stretch">
            {/* Quantity */}
            <div className="flex items-center border-[2.5px] border-[#131313] rounded-[14px] bg-white shadow-[4px_4px_0_#131313]" aria-label="Quantity">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-[46px] h-full min-h-[54px] bg-transparent border-none text-[22px] font-bold hover:text-[#EC4899]">−</button>
              <span className="min-w-[34px] text-center font-extrabold text-[17px]">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-[46px] h-full min-h-[54px] bg-transparent border-none text-[22px] font-bold hover:text-[#EC4899]">+</button>
            </div>
            
            {/* Add to cart */}
            <button onClick={handleAddToCartClick} className="flex-1 min-w-[220px] bg-[#131313] text-white font-bold text-[16px] tracking-wide rounded-[14px] border-[2.5px] border-[#131313] shadow-[4px_4px_0_#131313] hover:translate-y-0.5 transition-transform">
              Add to cart <span className="ml-2 font-normal">→</span>
            </button>
            
            {/* Wishlist */}
            <button onClick={handleToggleWishlist} className={`w-[56px] min-h-[54px] border-[2.5px] border-[#131313] rounded-[14px] bg-white grid place-items-center shadow-[4px_4px_0_#131313] transition-transform duration-200 hover:-translate-y-1 ${isWishlisted ? 'group on' : 'group'}`} aria-label="Add to wishlist">
              <Heart size={24} className={`transition-colors duration-200 ${isWishlisted ? 'fill-[#EC4899] stroke-[#EC4899]' : 'stroke-[#131313] group-hover:stroke-[#EC4899]'}`} />
            </button>
          </div>
          
          <div className="mt-3.5 mb-8">
            <button onClick={handleAddToCartClick} className="w-full min-h-[54px] bg-white text-[#131313] font-bold text-[16px] tracking-wide rounded-[14px] border-[2.5px] border-[#131313] shadow-[4px_4px_0_#131313] hover:bg-[#fafafa] hover:translate-y-0.5 transition-all">
              Buy it now
            </button>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="rounded-[12px] border-2 border-[#131313] bg-white px-3 py-4 text-center shadow-[3px_3px_0_rgba(19,19,19,0.85)] flex flex-col items-center justify-center">
              <span className="mb-1 block text-[20px]">🚚</span>
              <span className="block text-[11.5px] font-bold uppercase tracking-[0.04em] text-[#131313]">
                Free
                <br />
                Shipping
              </span>
            </div>

            <div className="rounded-[12px] border-2 border-[#131313] bg-white px-3 py-4 text-center shadow-[3px_3px_0_rgba(19,19,19,0.85)] flex flex-col items-center justify-center">
              <span className="mb-1 block text-[20px]">↩️</span>
              <span className="block text-[11.5px] font-bold uppercase tracking-[0.04em] text-[#131313]">
                30 Day
                <br />
                Returns
              </span>
            </div>

            <div className="rounded-[12px] border-2 border-[#131313] bg-white px-3 py-4 text-center shadow-[3px_3px_0_rgba(19,19,19,0.85)] col-span-2 sm:col-span-1 flex flex-col items-center justify-center">
              <span className="mb-1 block text-[20px]">🛡️</span>
              <span className="block text-[11.5px] font-bold uppercase tracking-[0.04em] text-[#131313]">
                2 Year
                <br />
                Warranty
              </span>
            </div>
          </div>

          {/* Handwritten Note */}
          <span className="mt-6 inline-block rotate-[-1deg] text-[21px] font-bold text-[#8B5CF6]">
            your back will thank you ✦
          </span>

        </div>
      </div>

      {/* DETAILS Section */}
      <section className="py-[clamp(60px,8vw,100px)] mt-16 bg-[#FAFAFA] rounded-[32px] border-[2.5px] border-[#131313] px-4 md:px-10 lg:px-16 shadow-[8px_8px_0_#131313] relative overflow-hidden w-full">
            <div className="mb-10">
              <span className="inline-block bg-[#DCF351] px-4 py-1.5 rounded-full border-[2.5px] border-[#131313] text-[12px] font-bold tracking-[0.14em] uppercase shadow-[2.5px_2.5px_0_#131313] -rotate-2">
                The nerd stuff
              </span>
              <h2 className="text-[clamp(32px,4.4vw,54px)] font-bold mt-4 leading-[1.05] tracking-tight text-[#131313]">
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
                          className="animate-fade-in space-y-4"
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
                          className="animate-fade-in space-y-4"
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
                          <li className="flex gap-4 items-start">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="flex-none w-[19px] h-[19px] mt-[3px]"><path d="m5 13 4 4L19 7"/></svg>
                            <div><strong className="text-black font-semibold">Accommodates you :</strong> The chair features extended headrest, lumbar pillow and has ample space to accommodate you cross legged.</div>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Dials Card */}
              <div className="bg-[#131313] text-white rounded-[28px] p-[clamp(26px,3vw,40px)] rotate-[0.8deg] shadow-[10px_10px_0_#8B5CF6] relative">
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
