"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Heart, 
  Trash2, 
  ShoppingCart, 
  Star,
  ArrowLeft
} from "lucide-react";

interface WishlistItem {
  id: string | number;
  name: string;
  price: number;
  originalPrice: number;
  discount: string;
  image: string;
  rating: number;
}

export default function WishlistPage() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem("astride_wishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error(e);
      }
    }

    const handleWishlistUpdate = () => {
      const saved = localStorage.getItem("astride_wishlist");
      if (saved) {
        try {
          setWishlist(JSON.parse(saved));
        } catch (e) {}
      }
    };

    window.addEventListener("astride_wishlist_updated", handleWishlistUpdate);
    return () => {
      window.removeEventListener("astride_wishlist_updated", handleWishlistUpdate);
    };
  }, []);

  const handleMoveToCart = (item: WishlistItem) => {
    const cartEvent = new CustomEvent("add-to-cart", {
      detail: {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1
      }
    });
    window.dispatchEvent(cartEvent);
  };

  const handleRemoveWishlist = (id: string | number) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("astride_wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("astride_wishlist_updated"));
  };

  return (
    <div className="min-h-screen bg-[#f1f3f5] text-slate-800 py-16 md:py-24 px-4 md:px-8 select-none relative overflow-hidden" style={{ fontFamily: '"Inter", sans-serif' }}>
      
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] rounded-full bg-slate-400/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-10%] w-[600px] h-[600px] rounded-full bg-slate-300/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4 mb-12">
          <button 
            onClick={() => router.push("/products")}
            className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-all w-fit"
          >
            <ArrowLeft size={14} />
            Back to Products
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-black uppercase tracking-[0.25em] mb-1">Your Collection</p>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-slate-900 leading-none">
                My Wishlist
              </h1>
            </div>
            <span className="text-xs font-black bg-slate-900 text-white px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              {wishlist.length} Items
            </span>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white border border-slate-200/60 rounded-[32px] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
          {wishlist.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-6 shadow-sm">
                <Heart size={28} />
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Your wishlist is empty</p>
              <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto font-medium">Add premium Astride ergonomic chairs to your saved collection while you browse.</p>
              <button
                onClick={() => router.push("/products")}
                className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-all shadow-md shadow-slate-900/5"
              >
                Explore Chairs
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <div key={item.id} className="border border-slate-200/60 rounded-2xl p-5 bg-slate-50/10 relative flex flex-col justify-between hover:border-slate-350 transition-all group hover:shadow-md">
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveWishlist(item.id)}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200/50 transition-all md:opacity-0 md:group-hover:opacity-100"
                  >
                    <Trash2 size={12} />
                  </button>

                  {/* Image */}
                  <div className="relative w-full aspect-square bg-white rounded-xl overflow-hidden flex items-center justify-center border border-slate-100 mb-4 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-3 mix-blend-multiply"
                    />
                  </div>

                  {/* Details */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="bg-slate-100 text-slate-700 font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md border border-slate-200">
                        -{item.discount}
                      </span>
                      <div className="flex items-center text-amber-500 text-xs font-bold">
                        <Star size={10} fill="currentColor" className="mr-0.5 text-amber-400" />
                        {item.rating}
                      </div>
                    </div>
                    
                    <h4 className="font-extrabold text-slate-800 text-xs mb-1.5 truncate">{item.name}</h4>
                    
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-sm font-black text-slate-900 font-extrabold">₹{item.price.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 line-through">₹{item.originalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98] shadow-md shadow-slate-900/5"
                  >
                    <ShoppingCart size={12} />
                    Add To Cart
                  </button>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
