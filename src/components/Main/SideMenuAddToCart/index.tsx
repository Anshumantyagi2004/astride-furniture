"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, Minus, Plus } from 'lucide-react';
import gsap from 'gsap';

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
}

export default function SideMenuAddToCart() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('astride_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing cart localStorage:', e);
      }
    }
  }, []);

  // Save cart to localStorage
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('astride_cart', JSON.stringify(items));
    window.dispatchEvent(new Event('astride_cart_updated'));
  };

  // Listen to add-to-cart global events
  useEffect(() => {
    const handleAddToCart = (e: Event) => {
      const customEvent = e as CustomEvent<CartItem>;
      const newItem = customEvent.detail;

      const savedCart = localStorage.getItem('astride_cart');
      let currentItems: CartItem[] = [];
      if (savedCart) {
        try {
          currentItems = JSON.parse(savedCart);
        } catch (e) {
          console.error(e);
        }
      }

      const existingItemIndex = currentItems.findIndex((item) => item.id.toString() === newItem.id.toString());
      let updatedItems: CartItem[];
      if (existingItemIndex > -1) {
        updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + (newItem.quantity || 1)
        };
      } else {
        updatedItems = [...currentItems, { ...newItem, quantity: newItem.quantity || 1 }];
      }

      saveCart(updatedItems);

      // Open side menu with slight delay to ensure state updates
      setTimeout(() => {
        setIsOpen(true);
      }, 50);
    };

    const handleOpenCartOnly = () => {
      setIsOpen(true);
    };

    window.addEventListener('add-to-cart', handleAddToCart);
    window.addEventListener('open-cart-sidebar', handleOpenCartOnly);

    return () => {
      window.removeEventListener('add-to-cart', handleAddToCart);
      window.removeEventListener('open-cart-sidebar', handleOpenCartOnly);
    };
  }, []);

  // GSAP animation on open/close
  useEffect(() => {
    if (isOpen) {
      // Disable body scroll when cart is open
      document.body.style.overflow = 'hidden';
      
      gsap.to('.cart-backdrop', { opacity: 1, duration: 0.3, pointerEvents: 'auto', ease: 'power2.out' });
      gsap.fromTo('.cart-sidebar-panel', 
        { x: '105%', opacity: 0.9 }, 
        { x: '0%', opacity: 1, duration: 0.5, ease: 'power4.out' }
      );
    } else {
      document.body.style.overflow = '';
      
      gsap.to('.cart-backdrop', { opacity: 0, duration: 0.3, pointerEvents: 'none', ease: 'power2.in' });
      gsap.to('.cart-sidebar-panel', { x: '105%', duration: 0.4, ease: 'power3.in' });
    }
  }, [isOpen]);

  const handleUpdateQuantity = (id: string | number, delta: number) => {
    const existingItem = cartItems.find((item) => item.id === id);
    if (existingItem && existingItem.quantity === 1 && delta === -1) {
      handleRemoveItem(id);
      return;
    }
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCart(updated);
  };

  const handleRemoveItem = (id: string | number) => {
    const updated = cartItems.filter((item) => item.id !== id);
    saveCart(updated);
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={() => setIsOpen(false)}
        className="cart-backdrop fixed inset-0 bg-black/45 z-[9999] opacity-0 pointer-events-none transition-opacity duration-300"
      />

      {/* Floating Cart Sidebar Panel */}
      <div 
        className="cart-sidebar-panel fixed top-0 right-0 bottom-0 md:top-4 md:right-4 md:bottom-4 w-full max-w-full md:max-w-[420px] bg-white rounded-none md:rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-[10000] flex flex-col justify-between overflow-hidden transform translate-x-[105%]"
        style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
      >
        {/* Header section */}
        <div className="p-6 pb-4 border-b border-neutral-100 flex items-center justify-between">
          <span className="font-semibold text-neutral-800 text-[16px] tracking-tight">
            Cart ({totalItemsCount})
          </span>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors flex items-center justify-center text-neutral-600 focus:outline-none"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 scrollbar-none">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-12">
              <span className="text-neutral-300 text-6xl">🛒</span>
              <p className="text-[14px] text-neutral-400 font-medium">Your cart feels light. Let's add some premium comfort!</p>
              <button 
                onClick={() => setIsOpen(false)}
                className="mt-2 px-5 py-2.5 bg-black text-white text-[12px] font-bold rounded-xl hover:bg-neutral-800 transition-colors tracking-wider uppercase"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-neutral-100/50 pb-5 items-start relative group">
                {/* Image */}
                <div className="relative w-20 h-20 bg-neutral-50 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-neutral-100">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill
                    className="object-contain p-2 mix-blend-multiply"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-h-[80px]">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-semibold text-neutral-800 text-[14px] leading-tight tracking-tight pr-4">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400 mt-1 font-medium">
                        Material: Premium Cushioning
                      </p>
                    </div>
                    <span className="font-semibold text-neutral-800 text-[14px] tracking-tight shrink-0">
                      ₹{item.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Quantity selector & Delete row */}
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-1 bg-neutral-50 rounded-lg p-0.5 border border-neutral-200/50">
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-black rounded transition-colors"
                      >
                        <Minus size={11} strokeWidth={2.5} />
                      </button>
                      <span className="w-6 text-center text-[12px] font-semibold text-neutral-800">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-black rounded transition-colors"
                      >
                        <Plus size={11} strokeWidth={2.5} />
                      </button>
                    </div>

                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="w-7 h-7 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-red-500 transition-all border border-neutral-100"
                    >
                      <X size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Subtotal & Action buttons */}
        <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 flex flex-col gap-4">
          <div className="flex justify-between items-baseline">
            <span className="text-[14px] font-medium text-neutral-500">Subtotal</span>
            <span className="text-[20px] font-bold text-neutral-900 tracking-tight">
              ₹{subtotal.toLocaleString()}
            </span>
          </div>

          <button 
            disabled={cartItems.length === 0}
            onClick={() => {
              setIsOpen(false);
              router.push('/checkout');
            }}
            className={`w-full py-4 text-center rounded-2xl text-[14px] font-semibold transition-all shadow-md focus:outline-none ${
              cartItems.length === 0 
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none' 
                : 'bg-black text-white hover:bg-neutral-900 active:scale-[0.98]'
            }`}
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
}
