'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BESTSELLERS = [
  {
    id: 1,
    name: 'Astride Ace',
    description: 'Elevate your setup with the sophisticated Ace, a perfect blend of elegance and functionality.',
    price: '$650.00 USD',
    image: '/Png1/chair4_ACE.webp',
    tag: 'GEAR',
  },
  {
    id: 2,
    name: 'Astride Delton',
    description: 'Stay connected and monitor your posture effortlessly with the Delton, your essential companion.',
    price: '$720.00 USD',
    image: '/Png1/Chair7_Delton.webp',
    tag: 'GEAR',
  },
  {
    id: 3,
    name: 'Astride Octave',
    description: 'Experience deep, powerful comfort and crystal-clear focus with the Octave for long sessions.',
    price: '$320.00 USD',
    image: '/Png1/chair11_octave.webp',
    tag: 'GEAR',
  },
  {
    id: 4,
    name: 'Astride Erizo',
    description: 'Immerse yourself in premium quality and enjoy the ultimate seating experience with our top-notch Erizo.',
    price: '$900.00 USD',
    image: '/Png1/chair6_AlphaGrey.webp',
    tag: 'GEAR',
  },
];

export default function BestSeller() {
  const handleAddToCart = (product) => {
    const numericPrice = parseFloat(product.price.replace(/[^0-9.]/g, ''));
    const cartItem = {
      id: `bestseller-${product.id}`,
      name: product.name,
      price: numericPrice,
      image: product.image,
      quantity: 1
    };
    window.dispatchEvent(new CustomEvent('add-to-cart', { detail: cartItem }));
  };

  return (
    <section 
      className="w-full bg-white pt-4 pb-12 md:py-16 px-6 md:px-12 lg:px-20" 
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
    >
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <h2 className="text-3xl md:text-[32px] font-medium text-[#111111]">
            Bestsellers
          </h2>
          <Link href="/products" className="text-sm font-semibold text-[#111111] hover:text-gray-500 transition-colors mt-4 md:mt-0 flex items-center gap-2">
            Browse all products 
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {BESTSELLERS.map((product) => (
            <div key={product.id} className="flex flex-col group h-full justify-between">
              
              <div>
                {/* Image Container - Reduced aspect ratio for shorter length */}
                <div className="relative w-full aspect-[4/3.3] bg-[#F5F5F5] rounded-[24px] p-5 mb-4 overflow-hidden flex items-center justify-center transition-colors duration-300 group-hover:bg-[#EFEFEF]">
                  {/* Tag */}
                  <div className="absolute top-4 left-4 bg-white px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest text-[#111111] shadow-sm z-10">
                    {product.tag}
                  </div>
                  
                  {/* Product Image */}
                  <div className="relative w-full h-[88%] flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500 ease-out">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-contain drop-shadow-lg" 
                    />
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                  <h3 className="text-base font-semibold text-[#111111] mb-1">
                    {product.name}
                  </h3>
                  {/* Clamped description for compact height */}
                  <p className="text-xs text-[#666666] leading-relaxed mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="font-bold text-xs text-[#111111] tracking-wide mb-3">
                    {product.price}
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button 
                onClick={() => handleAddToCart(product)}
                className="w-full bg-white border border-[#E5E5E5] text-[#111111] py-2.5 rounded-lg text-xs font-bold tracking-wide hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all duration-300"
              >
                Add to Cart
              </button>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
