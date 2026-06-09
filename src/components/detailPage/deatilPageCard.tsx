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
      <div className="text-[10px] md:text-[12px] text-neutral-400 font-medium mb-6 flex flex-wrap items-center gap-x-1.5 gap-y-1 tracking-wide leading-relaxed">
        <span className="hover:text-black cursor-pointer transition-colors whitespace-nowrap">Home</span>
        <span className="text-neutral-300">/</span>
        <span className="hover:text-black cursor-pointer transition-colors whitespace-nowrap">{product.category}</span>
        <span className="text-neutral-300">/</span>
        <span className="text-neutral-600 font-semibold text-[11px] md:text-[13px]">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 mt-2">
        {/* Left: Image Gallery */}
        <div className="w-full lg:w-[44%] lg:sticky lg:top-20 self-start flex flex-col lg:flex-row-reverse gap-4 lg:gap-6">
          
          {/* Main Image */}
          <div 
            className="w-full lg:flex-1 h-[350px] md:h-[500px] lg:h-[calc(100vh-120px)] flex items-center justify-center relative overflow-hidden group bg-[#FAFAFA] rounded-[32px] lg:rounded-2xl shrink-0"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
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
            <div className="flex flex-row lg:flex-col justify-center lg:justify-start gap-3 w-full lg:w-[80px] shrink-0 overflow-x-auto lg:overflow-y-auto max-h-auto lg:max-h-[calc(100vh-120px)] px-1.5 lg:px-0 pb-2 lg:pb-0 scrollbar-none lg:scrollbar-thin">
              {allVariantImages.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => handleThumbnailClick(img.url)}
                  className={`relative w-[60px] lg:w-full aspect-square rounded-full lg:rounded-xl bg-[#FAFAFA] border-2 transition-all duration-200 shrink-0 ${
                    activeImage === img.url ? 'border-black' : 'border-transparent hover:border-neutral-350'
                  }`}
                >
                  <Image 
                    src={img.url} 
                    alt={`Thumbnail ${idx + 1}`} 
                    fill 
                    className="object-contain p-1.5 mix-blend-multiply" 
                  />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Right: Details */}
        <div className="w-full lg:w-[58%] flex flex-col pt-2 text-black">
          
          <h1 
            className="text-xl lg:text-[22px] font-semibold tracking-tight leading-tight mb-4 uppercase"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            {product.name}
          </h1>

          <div 
            className="hidden lg:block text-[14px] text-neutral-500 leading-relaxed font-medium mb-5 pr-4"
            dangerouslySetInnerHTML={{ __html: product.shortDescription || `Premium ergonomic seat tailored for long sessions, perfect for gaming setups and casual office workspace styling.` }}
          />

          <p className="text-[13px] font-semibold text-neutral-800 mb-5">
            Stock is available & ready to ship!
          </p>

          {/* Top 5 Specifications Section */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="mb-6 border border-neutral-200/50 bg-[#FAFAFA]/80 rounded-2xl p-5" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
              <div className="text-[11px] font-semibold text-neutral-500 tracking-[0.15em] uppercase mb-4">
                Product Specifications
              </div>
              <div className="flex flex-col">
                {product.specifications.slice(0, 5).map((spec: any, idx: number) => (
                  <div 
                    key={idx} 
                    className="flex justify-between items-start py-2.5 border-b border-neutral-200/60 last:border-b-0 gap-4"
                  >
                    <span className="text-[11px] font-semibold text-neutral-700 uppercase tracking-wider shrink-0 mt-0.5">
                      {spec.name || spec.key}
                    </span>
                    <span className="text-[13px] font-bold text-neutral-900 text-right leading-tight max-w-[70%]">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <hr className="border-neutral-200 mb-5" />

          <div className="flex justify-between items-center mb-5 gap-4 flex-wrap sm:flex-nowrap">
            <div className="flex items-baseline gap-3">
              <span className="text-[28px] lg:text-[30px] font-semibold tracking-tighter">Rs. {product.price.toLocaleString()}</span>
              <span className="text-sm text-neutral-400 line-through font-medium">Rs. {product.originalPrice.toLocaleString()}</span>
            </div>
            
            <button
              onClick={handleToggleWishlist}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold tracking-wide transition-all duration-300 select-none hover:scale-105 active:scale-95 ${
                isWishlisted
                  ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100/80 shadow-[0_2px_10px_rgba(239,68,68,0.12)]"
                  : "border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 text-neutral-600 hover:shadow-sm"
              }`}
            >
              <Heart 
                size={14} 
                className={`transition-all duration-300 ${
                  isWishlisted 
                    ? "fill-red-500 text-red-500 scale-110 animate-[bounce_1s_infinite]" 
                    : "text-neutral-500 group-hover:scale-110"
                }`} 
              />
              <span>{isWishlisted ? "Wishlisted" : "Add to Wishlist"}</span>
            </button>
          </div>

          <hr className="border-neutral-200 mb-5" />

          <div className="mb-6">
            <div className="flex items-center justify-between sm:block w-full">
              <div>
                <p className="text-[15px] font-semibold mb-3">
                  Select Color
                </p>
                <div className="flex flex-wrap gap-4">
                  {(product.colors || []).map((colorName: string) => {
                    const colorHex = COLOR_MAP[colorName.toLowerCase()] || colorName.toLowerCase();
                    const isSelected = selectedColor?.toLowerCase() === colorName?.toLowerCase();
                    
                    return (
                      <div key={colorName} className="flex flex-col items-center gap-1">
                        <button 
                          type="button"
                          onClick={() => {
                            setSelectedColor(colorName);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          style={{ backgroundColor: colorHex }}
                          className={`w-7 h-7 rounded-full border border-neutral-300 shadow-sm transition-all duration-200 focus:outline-none ${
                            isSelected 
                              ? 'ring-2 ring-offset-2 ring-black scale-110' 
                              : 'hover:scale-105'
                          }`}
                          title={colorName}
                        />
                        <span className={`text-[10px] font-bold transition-colors tracking-wide ${
                          isSelected ? 'text-black font-black' : 'text-neutral-500'
                        }`}>
                          {colorName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile-only Quantity selector */}
              <div className="sm:hidden flex flex-col items-center self-start">
                <span className="text-[15px] font-semibold mb-3 text-black">Quantity</span>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors text-black font-medium text-base"
                  >
                    -
                  </button>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#E5E7EB] text-black font-semibold text-[15px]">
                    {quantity}
                  </div>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors text-black font-medium text-base"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-neutral-200 mb-6" />

          {/* Quantity & Actions Container */}
          <div className="flex flex-col gap-3 mb-8">
            {/* Row 1: Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Desktop-only Quantity Selector */}
              <div className="hidden sm:flex items-center gap-1.5">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors text-black font-medium text-base"
                >
                  -
                </button>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#E5E7EB] text-black font-semibold text-[15px]">
                  {quantity}
                </div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors text-black font-medium text-base"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <CustomButton onClick={handleAddToCartClick} variant="primary" fullWidth className="flex-1 ml-1">
                <span className="text-[14px] tracking-wide font-semibold mr-2">Add To Cart</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </CustomButton>
            </div>

            {/* Row 2: Buy Now Button */}
            <CustomButton onClick={handleAddToCartClick} variant="secondary" fullWidth className="mt-1">
              Buy It Now
            </CustomButton>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: 'Free Shipping' },
              { icon: RotateCcw, label: 'Return Policy' },
              { icon: ShieldCheck, label: '3 Yrs Warranty' },
            ].map((prop, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center text-center gap-2 bg-[#F8F9FA] rounded-xl py-4 px-2 hover:bg-[#F3F4F6] transition-colors">
                <prop.icon size={20} strokeWidth={1.5} className="text-black" />
                <span className="text-[12px] font-semibold text-black tracking-wide">{prop.label}</span>
              </div>
            ))}
          </div>

          {/* Premium Specs & Details Tabs Component */}
          <div className="bg-[#F3F4F6] text-black rounded-[24px] p-6 md:p-8 mt-10 border border-neutral-200 transition-all duration-300">
            {/* Tab Headers */}
            <div className="flex border-b border-neutral-300/70 overflow-x-auto scrollbar-none mb-6">
              {[
                { id: 'description', label: 'Description' },
                { id: 'features', label: 'Key Features' },
                { id: 'specs', label: 'Specs' },
                { id: 'application', label: 'Application' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className="pb-3 px-4 font-semibold text-[14px] md:text-[15px] whitespace-nowrap transition-all relative flex-1 text-center text-black"
                >
                  <span className={activeTab === tab.id ? 'text-black font-bold' : 'text-neutral-500 hover:text-black font-semibold'}>
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-black rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div ref={tabContentRef} className="text-base md:text-[17px] leading-relaxed text-neutral-900 font-normal rich-text-override">
              <style dangerouslySetInnerHTML={{ __html: `
                .rich-text-override, .rich-text-override * {
                  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                  font-size: 15.5px !important;
                  color: #1f2937 !important;
                  line-height: 1.8 !important;
                }
                .rich-text-override strong, .rich-text-override strong * {
                  font-weight: 700 !important;
                  color: #000000 !important;
                }
                .rich-text-override ul {
                  list-style-type: disc !important;
                  padding-left: 20px !important;
                  margin-top: 10px !important;
                  margin-bottom: 10px !important;
                }
                .rich-text-override ol {
                  list-style-type: decimal !important;
                  padding-left: 20px !important;
                  margin-top: 10px !important;
                  margin-bottom: 10px !important;
                }
                .rich-text-override li {
                  margin-bottom: 12px !important;
                }
                .rich-text-override p {
                  margin-bottom: 14px !important;
                }
                .rich-text-override h1 {
                  font-size: 22px !important;
                  font-weight: 700 !important;
                  color: #000000 !important;
                  margin-top: 20px !important;
                  margin-bottom: 10px !important;
                }
                .rich-text-override h2 {
                  font-size: 19px !important;
                  font-weight: 600 !important;
                  color: #000000 !important;
                  margin-top: 18px !important;
                  margin-bottom: 8px !important;
                }
                .rich-text-override h3 {
                  font-size: 17px !important;
                  font-weight: 600 !important;
                  color: #000000 !important;
                  margin-top: 16px !important;
                  margin-bottom: 6px !important;
                }
              `}} />
              {activeTab === 'description' && (
                <div 
                  className="animate-fade-in space-y-4"
                  dangerouslySetInnerHTML={{
                    __html: product.longDescription || `Meet the ${product.name} — built for those who live and breathe performance. Wrapped in sleek, premium upholstery with breathable spandex panels, it keeps you cool under pressure. The soft velour neck pillow and memory foam lumbar support mould to your posture, making long gaming sessions feel effortless. Precision-designed carbon-textured 4D armrests provide versatile positioning, while the newly engineered Frog Mechanism gives you complete control over recline and tilt. Features a heavy-duty metal base, Class 4 gas lift, and smooth-rolling casters. The ultimate premium chair under ₹20,000 for users in India.`
                  }}
                />
              )}

              {activeTab === 'features' && (
                product.keyfeatures ? (
                  <div 
                    className="animate-fade-in space-y-4"
                    dangerouslySetInnerHTML={{ __html: product.keyfeatures }}
                  />
                ) : (
                  <ul className="space-y-3.5">
                    <li className="flex gap-2">
                      <span className="text-black font-bold">•</span>
                      <span><strong className="text-black font-semibold">Adjusts as per you :</strong> The specially designed frog mechanism allows you to lock the chair at different angles apt for different activities.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-black font-bold">•</span>
                      <span><strong className="text-black font-semibold">Breathable fabric :</strong> Made with a combination of breathable Spandex and PU leather refrains heat build up and supports better air circulation.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-black font-bold">•</span>
                      <span><strong className="text-black font-semibold">Remembers you :</strong> The memory foam lumbar pillow takes the shape of your spine and supports your back.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-black font-bold">•</span>
                      <span><strong className="text-black font-semibold">Accommodates you :</strong> The chair features extended headrest, lumbar pillow and has ample space to accommodate you cross legged.</span>
                    </li>
                  </ul>
                )
              )}

              {activeTab === 'specs' && (
                <div className="overflow-x-auto max-h-[300px] overflow-y-auto pr-1">
                  <table className="w-full text-left border-collapse border border-neutral-300 text-[12.5px]">
                    <tbody>
                      {(product.specifications || []).map((spec: any, idx: number) => (
                        <tr key={idx} className="border-b border-neutral-300 hover:bg-neutral-200/50 transition-colors">
                          <td className="py-2 px-3 font-semibold text-neutral-600 border-r border-neutral-300 w-1/2">{spec.name || spec.key}</td>
                          <td className="py-2 px-3 text-neutral-800 font-semibold w-1/2">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'application' && (
                product.application ? (
                  <div 
                    className="animate-fade-in space-y-4"
                    dangerouslySetInnerHTML={{ __html: product.application }}
                  />
                ) : isBarStool ? (
                  <div className="space-y-4 font-medium text-neutral-700 animate-fade-in">
                    <div>
                      <h4 className="font-semibold text-black text-[14px] mb-1">Kitchen Counter & Islands</h4>
                      <p className="text-neutral-600">Perfect height and swivel features designed for premium home kitchen setups.</p>
                    </div>
                    <hr className="border-neutral-300" />
                    <div>
                      <h4 className="font-semibold text-black text-[14px] mb-1">Cafés, Bars & Restaurants</h4>
                      <p className="text-neutral-600">Durable frame and elegant aesthetics built to withstand high-traffic commercial dining environments.</p>
                    </div>
                    <hr className="border-neutral-300" />
                    <div>
                      <h4 className="font-semibold text-black text-[14px] mb-1">Lounge & Reception Areas</h4>
                      <p className="text-neutral-600">Adds a touch of sophistication to modern reception tables and relaxation zones.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 font-medium text-neutral-700 animate-fade-in">
                    <div>
                      <h4 className="font-semibold text-black text-[14px] mb-1">Office & Professional Workspace</h4>
                      <p className="text-neutral-600">Engineered to support 8+ hours of continuous usage with optimal posture correction.</p>
                    </div>
                    <hr className="border-neutral-300" />
                    <div>
                      <h4 className="font-semibold text-black text-[14px] mb-1">Home Office & Study Rooms</h4>
                      <p className="text-neutral-600">Compact and stylish design that integrates beautifully into home workspaces without cluttering.</p>
                    </div>
                    <hr className="border-neutral-300" />
                    <div>
                      <h4 className="font-semibold text-black text-[14px] mb-1">Gaming Setups</h4>
                      <p className="text-neutral-600">High-back support, comfortable cushioning, and dynamic armrests tailored for gamers.</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
