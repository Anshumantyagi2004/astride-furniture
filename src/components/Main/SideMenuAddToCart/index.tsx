"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, Minus, Plus } from 'lucide-react';

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  slug?: string;
  quantity: number;
  category?: string;
  color?: string;
}

export default function SideMenuAddToCart() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // Don't render until after mount to prevent SSR flash
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const storageDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Mount: set flag, load cart
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem('astride_cart');
    if (savedCart) {
      try { setCartItems(JSON.parse(savedCart)); } catch {}
    }
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (!isMounted) return;
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, isMounted]);

  // Debounced localStorage sync
  const syncCartState = useCallback((items: CartItem[]) => {
    if (storageDebounceRef.current) clearTimeout(storageDebounceRef.current);
    storageDebounceRef.current = setTimeout(() => {
      localStorage.setItem('astride_cart', JSON.stringify(items));
      window.dispatchEvent(new Event('astride_cart_updated'));
    }, 100);
  }, []);

  // Global cart events - only after mount
  useEffect(() => {
    if (!isMounted) return;

    const handleAddToCart = (e: Event) => {
      const newItem = (e as CustomEvent<CartItem>).detail;
      setCartItems((prev) => {
        const idx = prev.findIndex(i => i.id.toString() === newItem.id.toString());
        const updated = idx > -1
          ? prev.map((i, n) => n === idx ? { ...i, quantity: i.quantity + (newItem.quantity || 1) } : i)
          : [...prev, { ...newItem, quantity: newItem.quantity || 1 }];
        syncCartState(updated);
        return updated;
      });
      setIsOpen(true);
    };

    const handleOpenCart = () => setIsOpen(true);

    window.addEventListener('add-to-cart', handleAddToCart);
    window.addEventListener('open-cart-sidebar', handleOpenCart);
    return () => {
      window.removeEventListener('add-to-cart', handleAddToCart);
      window.removeEventListener('open-cart-sidebar', handleOpenCart);
    };
  }, [isMounted, syncCartState]);

  const handleUpdateQuantity = useCallback((id: string | number, delta: number) => {
    startTransition(() => {
      setCartItems((prev) => {
        const item = prev.find(i => i.id === id);
        const updated = item?.quantity === 1 && delta === -1
          ? prev.filter(i => i.id !== id)
          : prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i);
        syncCartState(updated);
        return updated;
      });
    });
  }, [syncCartState]);

  const handleRemoveItem = useCallback((id: string | number) => {
    startTransition(() => {
      setCartItems((prev) => {
        const updated = prev.filter(i => i.id !== id);
        syncCartState(updated);
        return updated;
      });
    });
  }, [syncCartState]);

  const { totalItemsCount, subtotal } = useMemo(() => cartItems.reduce(
    (acc, item) => ({
      totalItemsCount: acc.totalItemsCount + item.quantity,
      subtotal: acc.subtotal + item.price * item.quantity,
    }),
    { totalItemsCount: 0, subtotal: 0 }
  ), [cartItems]);

  // Don't render anything until after mount — prevents SSR/hydration flash
  if (!isMounted) return null;

  return (
    <>
      {/* Backdrop — pure CSS fade */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/45 z-[9999] transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar Panel — pure CSS slide */}
      <div
        className={`fixed top-0 right-0 bottom-0 md:top-4 md:right-4 md:bottom-4 w-full max-w-full md:max-w-[420px] bg-white rounded-none md:rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-[10000] flex flex-col justify-between overflow-hidden transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-[calc(100%+24px)]'
        }`}
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
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' }}>
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
                <div className="relative w-20 h-20 bg-neutral-50 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-neutral-100 p-1">
                  <Image 
                    src={item.image} 
                    alt={item.name}
                    fill
                    className="object-contain mix-blend-multiply"
                    loading="lazy"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-h-[80px]">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-semibold text-neutral-800 text-[14px] leading-tight tracking-tight pr-4">
                        {item.name}
                      </h4>
                      <div className="flex flex-col gap-0.5 mt-1">
                        <p className="text-[11px] text-neutral-400 font-medium">
                          Material: Premium Cushioning
                        </p>
                        {item.color && (
                          <p className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">
                            Color: {item.color}
                          </p>
                        )}
                      </div>
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