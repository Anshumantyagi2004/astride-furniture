import React from 'react';
import Image from 'next/image';
import Button from '../Button_ProductPageCard/Button_prodctPageCard';

const ProductPageCard = ({ product, isWishlisted, onToggleWishlist }) => {
  return (
    <div className="group relative w-full max-w-[280px] aspect-[3/4] bg-white rounded-[32px] p-5 border border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.04),_0_5px_15px_rgba(0,0,0,0.01),_inset_0_1px_2px_rgba(255,255,255,0.9),_inset_0_-2px_6px_rgba(15,23,42,0.02)] flex flex-col justify-between overflow-hidden cursor-pointer hover:scale-[1.03] hover:shadow-[0_25px_50px_rgba(0,0,0,0.08)] transition-all duration-500 ease-out">
      {/* Background radial reflection glow for added visual shine */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/80 via-transparent to-black/[0.01] pointer-events-none rounded-[32px]" />

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
          className="w-8 h-8 rounded-full bg-slate-50 hover:bg-white flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_14px_rgba(0,0,0,0.06)] active:scale-90 transition-all duration-200 focus:outline-none border border-slate-100"
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

      {/* Image Area with Shadow Pop */}
      <div className="relative w-full h-[58%] flex items-center justify-center z-[5]">
        <Image
          src={product.image}
          alt={product.name}
          width={280}
          height={280}
          className="object-contain h-full w-auto filter drop-shadow-[0_16px_32px_rgba(15,23,42,0.12)] scale-105 hover:scale-110 transition-transform duration-500 ease-out"
          priority
        />
      </div>

      {/* Bottom Metadata */}
      <div className="w-full flex flex-col gap-2 z-10 relative">
        {/* Name, Rating & Pricing */}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-base font-black text-slate-900 tracking-tight leading-tight md:text-lg pr-2">
            {product.name}
          </h3>
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-black text-slate-900 md:text-base">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-[11px] font-bold text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            </div>
            {product.rating && (
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-slate-100 shadow-sm shrink-0 mb-[1px]">
                <span className="text-[10px] font-black text-slate-800">{product.rating}</span>
                <svg 
                  width="10" 
                  height="10" 
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
        <div className="w-full mt-2">
          <Button />
        </div>
      </div>
    </div>
  );
};

export default ProductPageCard;