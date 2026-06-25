"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

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
  const [isMounted, setIsMounted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Razorpay">("COD");

  // Grouped Form State: Reduces React state allocation memory overhead
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    stateName: "",
    pinCode: "",
  });

  const shippingCost = 49;

  useEffect(() => {
    setIsMounted(true);
    window.scrollTo(0, 0);
    const savedCart = localStorage.getItem('astride_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Derived State: Eliminates a redundant useState hook and render cycle
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc: number, item: CartItem) => acc + (item.price * item.quantity), 0);
  }, [cartItems]);

  // Centralized Handler: Prevents inline function garbage collection churn
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

const placeOrder = useCallback(async () => {
    try {
      const { fullName, email, phone, address, city, stateName, pinCode } = formData;
      if (!fullName || !email || !phone || !address || !city || !stateName || !pinCode) {
        alert("Please fill all fields");
        return;
      }
      const savedUser = localStorage.getItem("user");
      const user = savedUser ? JSON.parse(savedUser) : null;
      if (!user || !user.id) {
        alert("Please log in first to place an order");
        return;
      }
      const totalAmount = subtotal + shippingCost;
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
          total: totalAmount,
        },
      };
      if (paymentMethod === "COD") {
        // --- 1. CASH ON DELIVERY FLOW ---
        const response = await fetch("/api/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...orderData, paymentMethod: "COD" }),
        });
        const data = await response.json();
        if (data.success) {
          setOrderId(data.order?._id || data.orderId || "");
          setShowSuccess(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
          localStorage.removeItem("astride_cart");
          setCartItems([]);
        }
      } else {
        // --- 2. RAZORPAY ONLINE PAYMENT FLOW ---
        // Create the Razorpay Order
        const res = await fetch("/api/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: totalAmount * 100 }), // Amount in paise
        });
        const razorpayOrder = await res.json();
        
        if (!razorpayOrder.success) {
          alert("Failed to initiate payment. Please try again.");
          return;
        }
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Astride Furniture",
          description: "Order Payment",
          order_id: razorpayOrder.order_id,
          handler: async function (response: any) {
            try {
              // Verify payment and save the order in MongoDB
              const verifyRes = await fetch("/api/verify-payment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderData,
                }),
              });
              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                setOrderId(verifyData.order?._id || "");
                setShowSuccess(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
                localStorage.removeItem("astride_cart");
                setCartItems([]);
              } else {
                alert("Payment verification failed: " + verifyData.message);
              }
            } catch (err: any) {
              alert("Verification error: " + (err?.message || "Please contact support."));
            }
          },
          // Handle payment failures gracefully (card declined, bank error, etc.)
          modal: {
            ondismiss: function () {
              console.log("Razorpay modal closed by user");
            },
          },
          prefill: {
            name: fullName,
            email: email,
            contact: phone,
          },
          theme: {
            color: "#000000",
          },
        };
        // Guard: ensure Razorpay script is loaded
        if (!(window as any).Razorpay) {
          alert("Payment system is still loading. Please try again in a moment.");
          return;
        }
        // Open the Razorpay Modal
        const paymentObject = new (window as any).Razorpay(options);
        // Handle payment failures (card declined, international card blocked, etc.)
        paymentObject.on("payment.failed", function (response: any) {
          const reason = response?.error?.description || response?.error?.reason || "Payment was declined";
          alert("Payment failed: " + reason + "\n\nPlease try a different payment method or card.");
        });
        paymentObject.open();
      }
    } catch (error: any) {
      console.error(error);
      alert("Error: " + (error?.message || "Something went wrong. Please try again."));
    }
  }, [formData, cartItems, subtotal, paymentMethod]);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 font-sans">
    {/* Load Razorpay script asynchronously */}
    <Script
      src="https://checkout.razorpay.com/v1/checkout.js"
      strategy="afterInteractive"
      onLoad={() => console.log("Razorpay script loaded successfully")}
    />
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
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm font-medium"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Address</label>
                  <textarea 
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm font-medium resize-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">City</label>
                  <input 
                    type="text" 
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">State</label>
                    <input 
                      type="text" 
                      name="stateName"
                      placeholder="State"
                      value={formData.stateName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">PIN Code</label>
                    <input 
                      type="text" 
                      name="pinCode"
                      placeholder="PIN Code"
                      value={formData.pinCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                {/* PAYMENT METHOD SELECTOR */}
                <div className="space-y-3 pt-2 pb-4">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Payment Method</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("COD")}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                        paymentMethod === "COD"
                          ? "border-black bg-black text-white"
                          : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-300"
                      }`}
                    >
                      Cash on Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("Razorpay")}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                        paymentMethod === "Razorpay"
                          ? "border-black bg-black text-white"
                          : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-300"
                      }`}
                    >
                      Pay Online
                    </button>
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

      {/* SUCCESS CONFIRMATION MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full p-8 text-center shadow-2xl border border-neutral-100 flex flex-col items-center gap-5 transform scale-100 transition-all">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-3xl font-bold shadow-sm">
              ✓
            </div>
            <div>
              <h3 className="text-2xl font-black text-neutral-900 uppercase tracking-tight">Order Confirmed!</h3>
              {orderId && (
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">ID: {orderId}</p>
              )}
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed font-medium">
              Thank you for shopping with <span className="font-extrabold text-neutral-900">Astride</span>. Your order has been placed successfully and is now being processed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
              <Link 
                href="/account/orders"
                className="flex-1 py-3.5 bg-neutral-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all text-center shadow-md active:scale-95"
              >
                View Orders
              </Link>
              <Link 
                href="/products"
                className="flex-1 py-3.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-50 transition-all text-center shadow-sm active:scale-95"
              >
                Shop More
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}