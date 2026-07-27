"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

interface CartItem {
  id: string | number;
  _id?: string | number;
  name: string;
  price: number;
  image: string;
  slug?: string;
  quantity: number;
  color?: string;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Razorpay" | "">("Razorpay");
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    stateName: "",
    pinCode: "",
    customMessage: "",
    billingAddress: "",
  });

  // Validation Error State
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    stateName: "",
    pinCode: "",
  });

  const shippingCost = 0;

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

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc: number, item: CartItem) => acc + (item.price * item.quantity), 0);
  }, [cartItems]);

  // Smoother, stricter validation rules
  const validateField = (name: string, value: string) => {
    if (!value.trim()) return "Required field";

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Invalid email format";
    }
    if (name === "phone" && value.length !== 10) {
      return "Requires exactly 10 digits";
    }
    if (name === "pinCode" && value.length !== 6) {
      return "Requires exactly 6 digits";
    }
    if ((name === "fullName" || name === "city" || name === "stateName") && value.trim().length < 2) {
      return "Too short";
    }
    return "";
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // 1. STRICT TEXT: Prevent numbers and special characters in Name, City, and State
    if ((name === 'fullName' || name === 'city' || name === 'stateName') && !/^[a-zA-Z\s]*$/.test(value)) {
      return; 
    }

    // 2. STRICT NUMBERS: Prevent letters in Phone and PIN Code
    if ((name === 'phone' || name === 'pinCode') && !/^\d*$/.test(value)) {
      return;
    }
    
    // 3. MAX LENGTHS: Restrict phone to 10 digits and PIN to 6 digits
    if (name === 'phone' && value.length > 10) return;
    if (name === 'pinCode' && value.length > 6) return;

    setFormData(prev => ({ ...prev, [name]: value }));

    // Instant error clearing as user types
    setErrors(prev => {
      const fieldName = name as keyof typeof errors;
      if (prev[fieldName]) {
        return { ...prev, [fieldName]: validateField(name, value) };
      }
      return prev;
    });
  }, []);

  // Validate on blur (when user clicks away from the field)
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  }, []);

  const removeItem = useCallback((id: string | number, color?: string) => {
    setCartItems(prev => {
      const updated = prev.filter(item => !(item.id === id && (item.color || "") === (color || "")));
      localStorage.setItem('astride_cart', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const placeOrder = useCallback(async () => {
    if (isProcessing) return;
    try {
      // =====================================================================
      // ORIGINAL FORM VALIDATION - COMMENTED OUT (Magic Checkout handles this)
      // =====================================================================
      // const newErrors = {
      //   fullName: validateField("fullName", formData.fullName),
      //   email: validateField("email", formData.email),
      //   phone: validateField("phone", formData.phone),
      //   address: validateField("address", formData.address),
      //   city: validateField("city", formData.city),
      //   stateName: validateField("stateName", formData.stateName),
      //   pinCode: validateField("pinCode", formData.pinCode),
      // };
      // setErrors(newErrors);
      // if (Object.values(newErrors).some(err => err !== "")) {
      //   window.scrollTo({ top: 0, behavior: "smooth" });
      //   return;
      // }
      // =====================================================================

      if (!paymentMethod) {
        alert("Please select a payment method before proceeding.");
        return;
      }

      // Fetch user from API using JWT token if available
      const token = sessionStorage.getItem("auth_token");
      let userId: string | null = null;
      if (token) {
        try {
          const userRes = await fetch("/api/user/profile", {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (userRes.ok) {
            const userData = await userRes.json();
            if (userData.success && userData.user) {
              userId = userData.user._id;
            }
          }
        } catch (error) {
          console.error("Failed to fetch user profile, proceeding as guest:", error);
        }
      }

      setIsProcessing(true);
      
      const totalAmount = subtotal + shippingCost;
      // NOTE: shippingInfo populated by Razorpay Magic Checkout — fields are empty by design
      const orderData = {
        userId: userId,
        shippingInfo: {
          fullName: formData.fullName || "",
          email: formData.email || "",
          phone: formData.phone || "",
          address: formData.address || "",
          city: formData.city || "",
          state: formData.stateName || "",
          pinCode: formData.pinCode || "",
        },
        products: cartItems.map((item) => {
          // Robustly extract the raw MongoDB ObjectId from any cart item format:
          const rawId = item.id ?? item._id ?? "";
          const rawIdStr = String(rawId);
          let productId: string;
          if (/^[a-f0-9]{24}$/i.test(rawIdStr)) {
            productId = rawIdStr;
          } else if (rawIdStr.includes("-")) {
            const candidate = rawIdStr.split("-")[0];
            productId = /^[a-f0-9]{24}$/i.test(candidate) ? candidate : rawIdStr;
          } else {
            productId = rawIdStr;
          }
          return {
            productId,
            productName: item.name,
            image: item.image,
            slug: item.slug,
            color: item.color ?? (rawIdStr.includes("-") ? rawIdStr.split("-").slice(1).join("-") : undefined),
            quantity: item.quantity,
            price: item.price,
          };
        }),
        pricing: { subtotal, shippingCharge: shippingCost, total: totalAmount },
      };

      if (paymentMethod === "COD") {
        const response = await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...orderData, paymentMethod: "COD" }),
        });
        const data = await response.json();
        if (data.success) {
          setOrderId(data.order?._id || data.orderId || "");
          setShowSuccess(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
          localStorage.removeItem("astride_cart");
          setCartItems([]);
        } else {
          alert(data.message || "Failed to place order.");
        }
        setIsProcessing(false);
      } else {
        const res = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            amount: totalAmount * 100,
            cartItems: cartItems, // Required for Razorpay Magic Checkout line_items
          }), 
        });
        const razorpayOrder = await res.json();
        
        if (!razorpayOrder.success) {
          alert("Failed to initiate payment. Please try again.");
          setIsProcessing(false);
          return;
        }
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Astride Furniture",
          description: "Order Payment",
          order_id: razorpayOrder.order_id,
          one_click_checkout: true,
          remember_customer: true,
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch("/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
            } finally {
              setIsProcessing(false);
            }
          },
          modal: { 
            ondismiss: function () { 
              console.log("Razorpay modal closed by user"); 
              setIsProcessing(false);
            } 
          },
          prefill: { name: formData.fullName, email: formData.email, contact: formData.phone },
          theme: { color: "#000000" },
        };
        if (!(window as any).Razorpay) {
          alert("Payment system is still loading. Please try again in a moment.");
          setIsProcessing(false);
          return;
        }
        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.on("payment.failed", function (response: any) {
          const reason = response?.error?.description || response?.error?.reason || "Payment was declined";
          alert("Payment failed: " + reason + "\n\nPlease try a different payment method or card.");
          setIsProcessing(false);
        });
        paymentObject.open();
      }
    } catch (error: any) {
      console.error(error);
      alert("Error: " + (error?.message || "Something went wrong. Please try again."));
      setIsProcessing(false);
    }
  }, [formData, cartItems, subtotal, paymentMethod, isProcessing]);

  // Sleek error styling
  const getInputClass = (error: string) => `w-full px-4 py-3 bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-base md:text-sm font-medium ${
    error 
      ? 'border-red-300 focus:ring-red-500/20 text-red-900 bg-red-50/40 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.2)]' 
      : 'border-neutral-200 focus:ring-black focus:border-transparent'
  }`;

  // Mini Error Message UI
  const ErrorMessage = ({ error }: { error: string }) => {
    if (!error) return null;
    return (
      <div className="flex items-center gap-1.5 mt-1.5 pl-1 animate-in fade-in slide-in-from-top-1 duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-red-500 shrink-0">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        <span className="text-[9px] font-black text-red-500 uppercase tracking-widest leading-none">
          {error}
        </span>
      </div>
    );
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <Script
        src="https://checkout.razorpay.com/v1/magic-checkout.js"
        strategy="afterInteractive"
        onLoad={() => console.log("Razorpay Magic Checkout script loaded")}
      />
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200/80 bg-white text-neutral-600 hover:text-black hover:border-neutral-400 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-xs"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
          {/* LEFT: Magic Checkout - Address & Payment handled by Razorpay */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.04),_0_5px_15px_rgba(0,0,0,0.01)] border border-neutral-100">
              
              {/* Magic Checkout Info */}
              <div className="flex flex-col items-center text-center gap-6 py-6">
                <div className="w-16 h-16 bg-[#072654] rounded-2xl flex items-center justify-center shadow-lg">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 3L4 9v7c0 6.627 5.148 12.825 12 14 6.852-1.175 12-7.373 12-14V9L16 3z" fill="#3395FF" fillOpacity="0.3"/>
                    <path d="M11 16l3.5 3.5L21 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <div>
                  <h2 className="text-xl font-black text-neutral-900 tracking-tight">Razorpay Magic Checkout</h2>
                  <p className="text-sm text-neutral-500 font-medium mt-2 max-w-sm mx-auto leading-relaxed">
                    Complete your purchase instantly. Razorpay will securely handle your address, OTP verification, and payment — all in one step.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                  <div className="flex flex-col items-center gap-1.5 bg-neutral-50 rounded-2xl p-3 border border-neutral-100">
                    <span className="text-lg">📍</span>
                    <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wide text-center">Saved Address</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 bg-neutral-50 rounded-2xl p-3 border border-neutral-100">
                    <span className="text-lg">⚡</span>
                    <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wide text-center">1-Click OTP</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 bg-neutral-50 rounded-2xl p-3 border border-neutral-100">
                    <span className="text-lg">🔒</span>
                    <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wide text-center">Secure Pay</span>
                  </div>
                </div>

                <div className="w-full pt-2 hidden md:block">
                  <button
                    type="button"
                    onClick={placeOrder}
                    disabled={isProcessing || cartItems.length === 0}
                    className={`w-full bg-[#072654] text-white py-4 rounded-xl font-bold text-base hover:bg-[#0a3070] transition-all active:scale-[0.99] shadow-lg shadow-[#072654]/30 flex items-center justify-center gap-3 ${
                      isProcessing || cartItems.length === 0 ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Opening Razorpay...
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        Pay Securely with Razorpay
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[10px] text-neutral-400 font-medium">
                  Powered by <span className="font-bold text-[#3395FF]">Razorpay Magic Checkout</span> · 100M+ shoppers trust this
                </p>
              </div>

              {/* =====================================================================
                  ORIGINAL SHIPPING FORM - COMMENTED OUT (Replaced by Magic Checkout)
                  ===================================================================== */}
              {/*
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neutral-900">Shipping Information</h2>
                <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black transition-colors">
                  Login
                </Link>
              </div>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Full Name</label>
                    <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} onBlur={handleBlur} className={getInputClass(errors.fullName)} />
                    <ErrorMessage error={errors.fullName} />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Email</label>
                    <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} onBlur={handleBlur} className={getInputClass(errors.email)} />
                    <ErrorMessage error={errors.email} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label>Phone Number</label>
                  <input type="text" name="phone" placeholder="10-digit Phone Number" value={formData.phone} onChange={handleInputChange} onBlur={handleBlur} className={getInputClass(errors.phone)} />
                  <ErrorMessage error={errors.phone} />
                </div>
                <div className="flex flex-col">
                  <label>Shipping Address</label>
                  <textarea name="address" placeholder="Street Address (Shipping)" value={formData.address} onChange={handleInputChange} onBlur={handleBlur} rows={3} className={`${getInputClass(errors.address)} resize-none`} />
                  <ErrorMessage error={errors.address} />
                </div>
                <div className="flex flex-col">
                  <label>City</label>
                  <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} onBlur={handleBlur} className={getInputClass(errors.city)} />
                  <ErrorMessage error={errors.city} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label>State</label>
                    <input type="text" name="stateName" placeholder="State" value={formData.stateName} onChange={handleInputChange} onBlur={handleBlur} className={getInputClass(errors.stateName)} />
                    <ErrorMessage error={errors.stateName} />
                  </div>
                  <div className="flex flex-col">
                    <label>PIN Code</label>
                    <input type="text" name="pinCode" placeholder="6-digit PIN" value={formData.pinCode} onChange={handleInputChange} onBlur={handleBlur} className={getInputClass(errors.pinCode)} />
                    <ErrorMessage error={errors.pinCode} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label>Custom Order Note (Optional)</label>
                  <textarea name="customMessage" rows={3} placeholder="Special instructions..." value={formData.customMessage} onChange={handleInputChange} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm resize-none" />
                </div>
                <div className="pt-2 hidden md:block">
                  <button type="button" onClick={placeOrder} disabled={isProcessing} className="w-full bg-black text-white py-4 rounded-xl font-bold text-base">
                    {isProcessing ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </form>
              */}

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
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-200">
                    {cartItems.map((item) => (
                      <div key={`${item.id}-${item.color || ""}`} className="relative flex gap-4 items-center bg-neutral-50 p-3 rounded-2xl border border-neutral-100">
                        <button
                          onClick={() => removeItem(item.id, item.color)}
                          aria-label="Remove item"
                          className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full bg-neutral-200 hover:bg-red-100 hover:text-red-500 text-neutral-500 transition-all duration-200 text-[10px] font-black leading-none"
                        >
                          ✕
                        </button>
                        <div className="relative w-20 h-20 bg-white rounded-xl flex items-center justify-center shrink-0 border border-neutral-100 shadow-sm p-1">
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            fill
                            className="object-contain mix-blend-multiply"
                          />
                        </div>
                        <div className="flex-1 min-w-0 pr-4">
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

                  <div className="pt-2 md:hidden">
                    <button 
                      type="button"
                      onClick={placeOrder}
                      disabled={isProcessing || cartItems.length === 0}
                      className={`w-full bg-[#072654] text-white py-4 rounded-xl font-bold text-base hover:bg-[#0a3070] transition-all active:scale-[0.99] shadow-lg shadow-[#072654]/30 flex items-center justify-center gap-3 ${
                        isProcessing || cartItems.length === 0 ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Opening Razorpay...
                        </>
                      ) : (
                        <>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                          </svg>
                          Pay Securely with Razorpay
                        </>
                      )}
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
                href="/track-order"
                className="flex-1 py-3.5 bg-neutral-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all text-center shadow-md active:scale-95"
              >
                Track Order
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