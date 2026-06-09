"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pinCode, setPinCode] = useState("");

  const shippingCost = 49;

  useEffect(() => {
    setIsMounted(true);
    window.scrollTo(0, 0);
    const savedCart = localStorage.getItem('astride_cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        setCartItems(items);
        const total = items.reduce((acc: number, item: CartItem) => acc + (item.price * item.quantity), 0);
        setSubtotal(total);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const placeOrder = async () => {
    try {
      if (
        !fullName ||
        !email ||
        !phone ||
        !address ||
        !city ||
        !stateName ||
        !pinCode
      ) {
        alert("Please fill all fields");
        return;
      }

      const savedUser = localStorage.getItem("user");
      const user = savedUser ? JSON.parse(savedUser) : null;

      if (!user || !user.id) {
        alert("Please log in first to place an order");
        return;
      }

      const orderData = {
        userId: user.id,
        shippingInfo: {
          fullName,
          email,
          phone,
          address,
          city,
          state: stateName,
          pinCode,
        },

        products: cartItems.map((item) => {
          const cleanProductId = typeof item.id === 'string' && item.id.includes('-') 
            ? item.id.split('-')[0] 
            : item.id;
          return {
            productId: cleanProductId,
            productName: item.name,
            image: item.image,
            color: item.color || (typeof item.id === 'string' && item.id.includes('-') ? item.id.split('-')[1] : undefined),
            quantity: item.quantity,
            price: item.price,
          };
        }),

        pricing: {
          subtotal,
          shippingCharge: shippingCost,
          total: subtotal + shippingCost,
        },

        paymentMethod: "COD",
      };

      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Order placed successfully");
        localStorage.removeItem("astride_cart");
        setCartItems([]);
        setSubtotal(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Back navigation header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200/80 bg-white text-neutral-600 hover:text-black hover:border-neutral-400 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-xs"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Products
          </Link>
          <span className="hidden sm:inline text-[9px] font-bold text-neutral-400 uppercase tracking-[0.25em]">
            Astride Furniture
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-center text-neutral-900 mb-10 tracking-tight">
          Checkout
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* LEFT: Shipping Information */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.04),_0_5px_15px_rgba(0,0,0,0.01)] border border-neutral-100">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">Shipping Information</h2>
              
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Email</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm font-medium"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Address</label>
                  <textarea 
                    placeholder="123 Main St, Apt 4B"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm font-medium resize-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">City</label>
                  <input 
                    type="text" 
                    placeholder="Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">State</label>
                    <input 
                      type="text" 
                      placeholder="Maharashtra"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">PIN Code</label>
                    <input 
                      type="text" 
                      placeholder="400001"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 hidden md:block">
                  <button 
                    type="button"
                    onClick={placeOrder}
                    className="w-full bg-black text-white py-4 rounded-xl font-bold text-base hover:bg-neutral-800 transition-colors active:scale-[0.99] shadow-lg shadow-black/20"
                  >
                    Place Order
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="w-full lg:w-[450px] shrink-0">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.04),_0_5px_15px_rgba(0,0,0,0.01)] border border-neutral-100 sticky top-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">Order Summary</h2>

              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-neutral-500 font-medium mb-4">Your cart is empty.</p>
                  <Link href="/products" className="text-black font-bold underline underline-offset-4 hover:text-neutral-700">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Item List */}
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-200">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center bg-neutral-50 p-3 rounded-2xl border border-neutral-100">
                        <div className="relative w-20 h-20 bg-white rounded-xl flex items-center justify-center shrink-0 border border-neutral-100 shadow-sm">
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            fill
                            className="object-contain p-2 mix-blend-multiply"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-neutral-900 text-sm truncate">{item.name}</h4>
                          <div className="flex flex-col gap-0.5 mt-0.5">
                            <p className="text-xs text-neutral-500 font-medium">Quantity: {item.quantity}</p>
                            {item.color && (
                              <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wide">Color: {item.color}</p>
                            )}
                          </div>
                          <p className="text-sm font-black text-neutral-900 mt-1">₹{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-neutral-200 pt-6 space-y-3">
                    <div className="flex justify-between items-center text-sm font-medium text-neutral-500">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium text-neutral-500">
                      <span>Shipping</span>
                      <span>{shippingCost > 0 ? `₹${shippingCost}` : 'Free'}</span>
                    </div>
                  </div>

                  <div className="border-t border-neutral-900 pt-4 mt-4">
                    <div className="flex justify-between items-end">
                      <span className="text-base font-bold text-neutral-900">Total</span>
                      <span className="text-2xl font-black text-neutral-900">
                        ₹{(subtotal + (subtotal > 0 ? shippingCost : 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Place Order Button - mobile only */}
                  <div className="pt-2 md:hidden">
                    <button 
                      type="button"
                      onClick={placeOrder}
                      className="w-full bg-black text-white py-4 rounded-xl font-bold text-base hover:bg-[#111111] transition-colors active:scale-[0.99] shadow-lg shadow-black/20"
                    >
                      Place Order
                    </button>
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
