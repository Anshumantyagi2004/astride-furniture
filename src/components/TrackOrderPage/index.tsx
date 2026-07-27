"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
interface OrderItem {
  productName: string;
  image: string;
  color?: string;
  quantity: number;
  price: number;
}
interface Order {
  _id: string;
  createdAt: string;
  status: string;
  pricing: {
    total: number;
  };
  products: OrderItem[];
}
const ORDER_STATUS_STEPS = ["Confirmed", "Processing", "Dispatched", "Out for Delivery", "Delivered"];
export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [isCancelling, setIsCancelling] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  useEffect(() => {
    const rawPhoneParam = searchParams?.get('phone');
    if (rawPhoneParam) {
      const cleanNum = rawPhoneParam.replace(/\D/g, '').slice(-10);
      if (cleanNum.length === 10 && cleanNum !== phone) {
        setPhone(cleanNum);
        fetchOrdersByPhone(cleanNum);
      }
    }
  }, [searchParams, phone]);

  const fetchOrdersByPhone = async (num: string) => {
    setError("");
    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/order/track?phone=${num}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError(data.message || "Failed to load orders");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setIsCancelling(orderId);
    try {
      const res = await fetch("/api/order/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, phone }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Order cancelled successfully");
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: "Cancelled" } : o))
        );
      } else {
        alert(data.message || "Failed to cancel order");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsCancelling(null);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setError("");
    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/order/track?phone=${phone}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError(data.message || "Failed to load orders");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const getStatusIndex = (currentStatus: string) => {
    // Maps various status strings to our visual tracking steps
    if (["Pending", "Confirmed"].includes(currentStatus)) return 0;
    if (["Processing", "Processing / Packing"].includes(currentStatus)) return 1;
    if (["Dispatched", "Shipped"].includes(currentStatus)) return 2;
    if (currentStatus === "Out for Delivery") return 3;
    if (currentStatus === "Delivered") return 4;
    return -1; // For cancelled or returned orders
  };
  return (
    <div className="min-h-screen bg-neutral-50/50 pt-2 sm:pt-6 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight mb-3">Track Your Order</h1>
          <p className="text-base text-neutral-500 font-medium max-w-lg mx-auto">
            Enter the 10-digit phone number you used during checkout to view your order status in real-time.
          </p>
        </div>
        {/* Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 mb-10 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <form onSubmit={handleTrack} className="space-y-5">
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-neutral-700 mb-2 uppercase tracking-wide">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">+91</span>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter 10-digit number"
                  className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-900/10 focus:border-blue-900 text-neutral-900 font-medium transition-all outline-none placeholder:text-neutral-400"
                  required
                />
              </div>
            </div>
            {error && <p className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-slate-900 to-blue-950 text-white py-3.5 px-4 rounded-xl font-bold text-lg hover:from-slate-800 hover:to-blue-900 transition-all duration-300 ease-out shadow-lg shadow-blue-950/20 hover:shadow-xl hover:shadow-blue-950/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none"
            >
              {isLoading ? "Fetching Details..." : "Track Orders"}
            </button>
          </form>
        </div>
        {/* Results Section */}
        {hasSearched && !isLoading && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="text-center bg-white p-8 rounded-lg border border-neutral-200 shadow-sm">
                <p className="text-neutral-600 font-medium">No orders found for this phone number.</p>
              </div>
            ) : (
              orders.map((order) => {
                const currentStepIdx = getStatusIndex(order.status);
                const isCancelledOrReturned = currentStepIdx === -1;
                return (
                  <div key={order._id} className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-neutral-100 overflow-hidden">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between bg-neutral-50/50 p-6 border-b border-neutral-100">
                      <div>
                        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Order ID</p>
                        <p className="text-sm font-black text-neutral-800">{order._id}</p>
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Placed On</p>
                        <p className="text-sm font-bold text-neutral-800">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="mt-4 sm:mt-0 text-left sm:text-right">
                        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Total Amount</p>
                        <p className="text-lg font-black text-blue-900">₹{order.pricing.total.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8">
                      {/* Products List */}
                      <div className="space-y-4 mb-8">
                        {order.products.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-4 p-3 hover:bg-neutral-50 rounded-2xl transition-colors duration-200">
                            <div className="relative w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-neutral-100 shadow-sm p-1">
                              {item.image && (
                                <Image
                                  src={item.image}
                                  alt={item.productName}
                                  fill
                                  className="object-contain"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-bold text-neutral-900 truncate">{item.productName}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="inline-flex items-center justify-center px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[11px] font-bold rounded-md">Qty: {item.quantity}</span>
                                {item.color && (
                                  <span className="inline-flex items-center justify-center px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[11px] font-bold rounded-md">Color: {item.color}</span>
                                )}
                              </div>
                            </div>
                            <div className="text-base font-black text-neutral-800">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Active Status Display Banner */}
                      <div className="mb-8 flex justify-between items-center bg-gradient-to-r from-neutral-50 to-neutral-100 p-4 rounded-xl border border-neutral-100 shadow-inner">
                        <span className="text-sm font-bold text-neutral-600 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-900 animate-pulse"></div>
                          Current Status
                        </span>
                        <span className={`text-sm font-black px-4 py-1.5 rounded-full shadow-sm ${
                          order.status === "Delivered" ? "bg-green-50 text-green-700 border border-green-200" :
                          ["Cancelled", "Return Rejected"].includes(order.status) ? "bg-red-50 text-red-700 border border-red-200" :
                          order.status.includes("Return") || order.status.includes("Refund") ? "bg-blue-50 text-blue-800 border border-blue-200" :
                          "bg-blue-50/50 text-blue-900 border border-blue-200"
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Status Stepper */}
                      {isCancelledOrReturned ? (
                        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-bold text-center border border-red-100 shadow-sm">
                          This order has been marked as: <span className="underline decoration-red-300 underline-offset-4">{order.status}</span>
                        </div>
                      ) : (
                        <div className="mt-8 px-2 sm:px-6 relative pb-2 sm:pb-8">
                          <div className="relative flex items-center justify-between">
                            {/* Progress Line Background */}
                            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 bg-neutral-100 rounded-full z-0 overflow-hidden">
                              {/* Active Progress Line */}
                              <div
                                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-700 to-blue-900 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(30,58,138,0.2)]"
                                style={{ width: `${(currentStepIdx / (ORDER_STATUS_STEPS.length - 1)) * 100}%` }}
                              ></div>
                            </div>
                            
                            {ORDER_STATUS_STEPS.map((step, idx) => {
                              const isCompleted = idx <= currentStepIdx;
                              const isCurrent = idx === currentStepIdx;
                              return (
                                <div key={step} className="flex flex-col items-center z-10 group cursor-default">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                                      isCompleted 
                                        ? 'bg-blue-900 text-white shadow-[0_0_15px_rgba(30,58,138,0.3)]' 
                                        : 'bg-white border-4 border-neutral-100 text-neutral-400'
                                    } ${isCurrent ? 'ring-4 ring-blue-100 scale-110' : ''}`}
                                  >
                                    {isCompleted ? '✓' : idx + 1}
                                  </div>
                                  <span className={`absolute mt-12 text-[10px] sm:text-[11px] uppercase tracking-wide transition-all duration-300 whitespace-nowrap hidden sm:block ${
                                    isCompleted ? 'text-neutral-900 font-black' : 'text-neutral-400 font-bold'
                                  }`}>
                                    {step}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Cancel Order Button */}
                      {!["Dispatched", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Return Requested", "Return Approved", "Return Rejected", "Refund Initiated", "Refunded"].includes(order.status) && (
                        <div className="mt-8 flex justify-end">
                          <button
                            onClick={() => setConfirmCancelId(order._id)}
                            disabled={isCancelling === order._id}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                          >
                            {isCancelling === order._id ? "Cancelling..." : "Cancel Order"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmCancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-neutral-100 shadow-2xl transform scale-100 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Cancel Order</h3>
            <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
              Are you sure you want to cancel this order? This action will mark your order as cancelled, and any payments processed will be reviewed for refund.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmCancelId(null)}
                className="flex-1 px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl text-sm transition-colors duration-200"
              >
                No, Keep Order
              </button>
              <button
                onClick={() => {
                  const id = confirmCancelId;
                  setConfirmCancelId(null);
                  handleCancelOrder(id);
                }}
                className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition-colors duration-200 shadow-lg shadow-rose-600/20"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}