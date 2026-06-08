"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Truck, RotateCcw, ShieldCheck, ArrowRight } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'description' | 'features' | 'specs' | 'details'>('description');
  const tabContentRef = useRef<HTMLDivElement>(null);

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
        // Only set active image to the first image of the selected variant
        // if the current activeImage is not already in the selected variant's images
        const isCurrentInVariant = variant.images.some((img: any) => img.url === activeImage);
        if (!isCurrentInVariant) {
          setActiveImage(variant.images[0].url);
        }
      } else {
        setActiveImage(product.image);
      }
    }
  }, [selectedColor, product, activeImage]);

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

      return (
        <div 
          className="max-w-[1380px] mx-auto p-4 md:p-8 lg:p-10 bg-white min-h-screen font-sans"
          style={{ fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
        >
          {/* Breadcrumbs */}
          <div className="text-[12px] text-neutral-400 font-medium mb-6 flex items-center gap-1.5 tracking-wide">
            <span className="hover:text-black cursor-pointer transition-colors">Home</span>
            <span className="text-neutral-300">/</span>
            <span className="hover:text-black cursor-pointer transition-colors">{product.category}</span>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-600 font-semibold">{product.name}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 mt-2">
            {/* Left: Image Gallery */}
            <div className="w-full lg:w-[44%] lg:sticky lg:top-20 self-start flex gap-4">
              {/* Thumbnails strip */}
              {allVariantImages.length > 1 && (
                <div className="flex flex-col gap-3 w-[70px] md:w-[80px] shrink-0 overflow-y-auto max-h-[400px] md:max-h-[500px] lg:max-h-[calc(100vh-120px)] pr-1 scrollbar-thin">
                  {allVariantImages.map((img: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => handleThumbnailClick(img.url)}
                      className={`relative w-full aspect-square rounded-xl overflow-hidden bg-[#FAFAFA] border-2 transition-all duration-200 shrink-0 ${
                        activeImage === img.url ? 'border-black' : 'border-transparent hover:border-neutral-300'
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

              {/* Main Image */}
              <div className="flex-1 h-[400px] md:h-[500px] lg:h-[calc(100vh-120px)] flex items-center justify-center relative overflow-hidden group bg-[#FAFAFA] rounded-2xl">
                <Image 
                  src={activeImage || product.image} 
                  alt={product.name} 
                  fill
                  className="object-contain p-8 lg:p-12 hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply"
                />
              </div>
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
            className="text-[14px] text-neutral-500 leading-relaxed font-medium mb-5 pr-4"
            dangerouslySetInnerHTML={{ __html: product.shortDescription || `Premium ergonomic seat tailored for long sessions, perfect for gaming setups and casual office workspace styling.` }}
          />

          <p className="text-[13px] font-semibold mb-5">
            Stock is available & ready to ship!
          </p>

          <hr className="border-neutral-200 mb-5" />

          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-[28px] lg:text-[30px] font-semibold tracking-tighter">Rs. {product.price.toLocaleString()}</span>
            <span className="text-sm text-neutral-400 line-through font-medium">Rs. {product.originalPrice.toLocaleString()}</span>
          </div>

          <hr className="border-neutral-200 mb-5" />

          <div className="mb-6">
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
                      onClick={() => setSelectedColor(colorName)}
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

          <hr className="border-neutral-200 mb-6" />

          {/* Quantity & Actions Container */}
          <div className="flex flex-col gap-3 mb-8">
            {/* Row 1: Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Quantity */}
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
                { id: 'features', label: 'Features' },
                { id: 'specs', label: 'Specs' },
                { id: 'details', label: 'Item Details' }
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
            <div ref={tabContentRef} className="text-[13.5px] leading-relaxed text-neutral-700">
              {activeTab === 'description' && (
                <div 
                  className="animate-fade-in font-medium text-neutral-700 space-y-4"
                  dangerouslySetInnerHTML={{
                    __html: product.longDescription || `Meet the ${product.name} — built for those who live and breathe performance. Wrapped in sleek, premium upholstery with breathable spandex panels, it keeps you cool under pressure. The soft velour neck pillow and memory foam lumbar support mould to your posture, making long gaming sessions feel effortless. Precision-designed carbon-textured 4D armrests provide versatile positioning, while the newly engineered Frog Mechanism gives you complete control over recline and tilt. Features a heavy-duty metal base, Class 4 gas lift, and smooth-rolling casters. The ultimate premium chair under ₹20,000 for users in India.`
                  }}
                />
              )}

              {activeTab === 'features' && (
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
              )}

              {activeTab === 'specs' && (
                <div className="overflow-x-auto max-h-[300px] overflow-y-auto pr-1">
                  <table className="w-full text-left border-collapse border border-neutral-300 text-[12.5px]">
                    <tbody>
                      {[
                        { name: 'Upholstery', value: 'Spandex Fabric + PU Leather' },
                        { name: 'Lumbar Support', value: 'Yes' },
                        { name: 'Back Support', value: product.backSupport || 'High Back' },
                        { name: 'Armrest', value: '4D' },
                        { name: 'Capacity', value: product.capacity || '150 Kg' },
                        { name: 'Hours of usage', value: product.hours || '> 12Hrs' },
                        { name: 'Headrest', value: 'Yes' },
                        { name: 'Maximum Seat Height', value: '57 cm' },
                        { name: 'Minimum Seat Height', value: '49 cm' },
                        { name: 'Armrest Height Range', value: '7 cm' },
                        { name: 'Backrest Height', value: '88 cm' },
                        { name: 'Backrest Shoulder Width', value: '51 cm' },
                        { name: 'Seat Dimensions', value: '50 x 54 cm' },
                        { name: 'Lumbar Support Type', value: 'Height Adjustable & Removable' },
                        { name: 'Lumbar Support Material', value: 'Velour Upholstery' },
                        { name: 'Foam Type', value: 'Memory Foam' },
                        { name: 'Adjustable Neck Pillow', value: 'Yes' },
                        { name: 'Wheel Size', value: '6 cm' },
                        { name: 'Wheel Type', value: 'PU Wheels' },
                      ].map((spec, idx) => (
                        <tr key={idx} className="border-b border-neutral-300 hover:bg-neutral-200/50 transition-colors">
                          <td className="py-2 px-3 font-semibold text-neutral-600 border-r border-neutral-300 w-1/2">{spec.name}</td>
                          <td className="py-2 px-3 text-neutral-800 font-semibold w-1/2">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="space-y-4 font-medium text-neutral-700">
                  <div>
                    <h4 className="font-semibold text-black text-[14px] mb-1">Country of Origin</h4>
                    <p className="text-neutral-600">China</p>
                  </div>
                  <hr className="border-neutral-300" />
                  <div>
                    <h4 className="font-semibold text-black text-[14px] mb-1">Manufacturer</h4>
                    <p className="text-neutral-600">Green Soul Ergonomics Pvt. Ltd., Maharashtra, India.</p>
                    <p className="text-xs text-neutral-400 mt-1">Customer Care: +91 8444-956-789 | info@greensoul.online</p>
                  </div>
                  <hr className="border-neutral-300" />
                  <div>
                    <h4 className="font-semibold text-black text-[14px] mb-1">Manufacturer Contact</h4>
                    <p className="text-neutral-600">GREEN SOUL ERGONOMICS PRIVATE LIMITED, BUILDING D2 UNIT 8 TO 14, GREEN SPACE VILLAGE VAHULI, VILLAGE VAHULI BHIWANDI, THANE 421101, State: MAHARASHTRA</p>
                    <p className="text-xs text-neutral-400 mt-1">Phone: +91 8444-956-789 | Email: info@greensoul.online</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
