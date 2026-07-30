import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Button from '../Button_ProductPageCard/Button_prodctPageCard';
import { useRouter } from 'next/navigation';

const ProductPageCard = ({ product, isWishlisted, onToggleWishlist }) => {
  const router = useRouter();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const images = product.allImages && product.allImages.length > 0 
    ? product.allImages 
    : [product.image];

  useEffect(() => {
    if (images.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images.length]);
  
  return (
    <div 
      onClick={() => router.push(`/products/${product.slug || product.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative w-full max-w-[280px] h-[340px] bg-white rounded-[28px] p-4 pb-5 pt-3.5 border border-slate-100 shadow-sm flex flex-col justify-between overflow-hidden cursor-pointer hover:scale-[1.02] hover:shadow-md transition-all duration-300"
    >
      {/* Background radial reflection glow for added visual shine */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/80 via-transparent to-black/[0.01] pointer-events-none rounded-[28px]" />

      {/* Header Details (Wishlist & Discount Badge) */}
      <div className="flex items-center justify-between w-full z-10 relative">
        <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full shadow-sm">
          {product.discount}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="w-8 h-8 rounded-full bg-slate-50 hover:bg-white flex items-center justify-center shadow-sm hover:shadow active:scale-90 transition-all duration-200 focus:outline-none border border-slate-100"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={isWishlisted ? "#ef4444" : "none"}
            stroke={isWishlisted ? "#ef4444" : "#4b5563"}
            strokeWidth="2.5"
            className="transition-colors duration-200"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Image Area */}
      <div className="relative w-full h-[52%] flex flex-col items-center justify-center z-[5] my-0.5">
        <Image
          src={images[currentImageIndex] || product.image}
          alt={product.name}
          fill
          className="object-contain p-2 scale-100 hover:scale-105 transition-opacity duration-500 ease-in-out"
          sizes="(max-width: 768px) 100vw, 33vw"
          loading="lazy"
        />

        {/* Pagination Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-0 flex gap-1.5 justify-center w-full opacity-100 transition-opacity duration-300 z-10">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-3 bg-slate-800' : 'w-1.5 bg-slate-300'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Metadata */}
      <div className="w-full flex flex-col gap-1 z-10 relative">
        {/* Name, Rating & Pricing */}
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-black text-slate-900 tracking-tight leading-tight md:text-base pr-2 truncate">
            {product.name}
          </h3>
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900 md:text-sm">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            </div>
            {product.rating && (
              <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-lg border border-slate-100 shadow-sm shrink-0 mb-[1px]">
                <span className="text-[9px] font-black text-slate-800">{product.rating}</span>
                <svg 
                  width="9" 
                  height="9" 
                  viewBox="0 0 24 24" 
                  fill="#fbbf24" 
                  stroke="#fbbf24" 
                  strokeWidth="1"
                  className="mb-0.5"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Always visible animated Pearl Button component */}
        <div className="w-full mt-1.5">
          <Button onClick={(e) => {
            e.stopPropagation();
            const firstVariantColor = product.colorVariants?.[0]?.colorName || product.color;
            const cartItem = {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity: 1,
              color: firstVariantColor
            };
            window.dispatchEvent(new CustomEvent('add-to-cart', { detail: cartItem }));
          }} />
        </div>
      </div>
    </div>
  );
};

export default ProductPageCard;