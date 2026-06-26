"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Mail, 
  Phone, 
  Edit,
  Trash2,
  ShoppingCart,
  CheckCircle,
  Truck,
  Package,
  Star,
  ArrowRight,
  LogOut
} from "lucide-react";

interface AccountPageProps {
  activeTab: "account" | "orders" | "wishlist";
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

interface OrderItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  productId?: string;
  color?: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  paymentMethod?: string;
  items: OrderItem[];
}

interface WishlistItem {
  id: string | number;
  name: string;
  price: number;
  originalPrice: number;
  discount: string;
  image: string;
  rating: number;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  email: "",
  phone: "",
  avatar: "avatar_placeholder",
};

const MOCK_ORDERS: Order[] = [
  {
    id: "AST-2026-9938",
    date: "May 28, 2026",
    total: 14999,
    status: "Delivered",
    items: [
      {
        id: 1,
        name: "Astride Assassin Pro",
        price: 14999,
        image: "/Png1/chair12_ErgoFit.webp",
        quantity: 1
      }
    ]
  },
  {
    id: "AST-2026-8841",
    date: "April 15, 2026",
    total: 34498,
    status: "Delivered",
    items: [
      {
        id: 2,
        name: "Astride Monster T-Series",
        price: 16499,
        image: "/Png1/Chair7_Delton.webp",
        quantity: 1
      },
      {
        id: 3,
        name: "Astride Vision Elite",
        price: 17999,
        image: "/Png1/chair4_ACE.webp",
        quantity: 1
      }
    ]
  }
];

const MOCK_WISHLIST: WishlistItem[] = [
  {
    id: 4,
    name: "Astride Monster S-Mesh",
    price: 15499,
    originalPrice: 29999,
    discount: "58%",
    image: "/Png1/chair5_AIRSENSE.webp",
    rating: 4.6
  },
  {
    id: 5,
    name: "Astride Beast Stealth",
    price: 19999,
    originalPrice: 39999,
    discount: "60%",
    image: "/Png1/chair6_AlphaGrey.webp",
    rating: 4.7
  }
];

export default function AccountPage({ activeTab }: AccountPageProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("astride_profile");
    router.push("/login");
  };
  
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(DEFAULT_PROFILE);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(MOCK_WISHLIST);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = async (userId: string) => {
    try {
      const response = await fetch("/api/my-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (data.success) {
        const mappedOrders = (data.orders || []).map((o: any) => ({
          id: o._id,
          date: new Date(o.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }),
          total: o.pricing?.total || 0,
          status: o.status || o.orderStatus || "Pending",
          paymentMethod: o.paymentMethod || "COD",
          items: (o.products || []).map((p: any) => ({
            id: p._id || p.productId,
            name: p.productName,
            price: p.price,
            image: p.image,
            quantity: p.quantity,
            productId: p.productId,
            color: p.color,
          })),
        }));
        setOrders(mappedOrders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const storedProfile = localStorage.getItem("astride_profile");
    
    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && parsedUser.id) {
        fetchMyOrders(parsedUser.id);
      } else {
        router.push("/login");
        return;
      }
    } catch (e) {
      console.error(e);
      router.push("/login");
      return;
    }

    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile);
        setProfile(parsed);
        setEditForm(parsed);
      } catch (e) {
        console.error(e);
      }
    } else if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const newProfile: UserProfile = {
          ...DEFAULT_PROFILE,
          name: parsedUser.name || DEFAULT_PROFILE.name,
          email: parsedUser.email || DEFAULT_PROFILE.email,
        };
        setProfile(newProfile);
        setEditForm(newProfile);
        localStorage.setItem("astride_profile", JSON.stringify(newProfile));
      } catch (e) {
        console.error(e);
      }
    }

    const savedWishlist = localStorage.getItem("astride_wishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm(profile);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(editForm);
    localStorage.setItem("astride_profile", JSON.stringify(editForm));
    
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        parsedUser.name = editForm.name;
        localStorage.setItem("user", JSON.stringify(parsedUser));
      } catch (e) {
        console.error(e);
      }
    }

    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

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
  };

  const sidebarItems = [
    { id: "account", label: "My Account", icon: User, path: "/account" },
    { id: "orders", label: "My Orders", icon: ShoppingBag, path: "/account/orders" },
    { id: "wishlist", label: "My Wishlist", icon: Heart, path: "/account/wishlist" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f3f5] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f3f5] text-slate-800 pt-6 pb-16 md:pt-10 md:pb-24 px-4 md:px-8 select-none relative overflow-hidden" style={{ fontFamily: '"Inter", sans-serif' }}>
      
      {/* Subtle monochrome ambient glow */}
      <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] rounded-full bg-slate-400/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-10%] w-[600px] h-[600px] rounded-full bg-slate-300/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[1300px] mx-auto relative z-10">
        
        {/* Dashboard Title Header with Slate Lettering */}
        <div className="flex flex-col gap-1 mb-6">
          <p className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">Dashboard</p>
          <h1 className="text-slate-900 text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase leading-none tracking-tight">
            Profile Shell
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── Sidebar Navigation ── */}
          <aside className="lg:col-span-4 xl:col-span-3 w-full flex flex-col gap-6">
            
            {/* User Hello Header card with modern clean look */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 flex items-center gap-4 shadow-[0_15px_40px_rgba(0,0,0,0.02)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100 rounded-full blur-xl pointer-events-none transition-all group-hover:scale-125" />
              
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-slate-300 bg-slate-100 shrink-0 flex items-center justify-center text-slate-700">
                <User size={24} strokeWidth={2} />
              </div>
              
              <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5 font-bold">Astride Member</p>
                <h3 className="text-base font-extrabold text-slate-800 leading-tight truncate">{profile.name}</h3>
              </div>
            </div>

            {/* Sidebar menu list - Slate & White Card */}
            <nav className="bg-white border border-slate-200/60 rounded-3xl p-3 shadow-[0_15px_40px_rgba(0,0,0,0.02)] flex flex-col gap-1.5">
              {sidebarItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.path)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 relative overflow-hidden group ${
                      isActive
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <IconComponent size={16} strokeWidth={2.5} />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ArrowRight size={12} className={`opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 ${isActive ? "opacity-100 translate-x-0" : ""}`} />
                  </button>
                );
              })}

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 text-red-500 hover:bg-red-50 hover:text-red-650 relative overflow-hidden group"
              >
                <LogOut size={16} strokeWidth={2.5} />
                <span className="flex-1 text-left">Logout</span>
                <ArrowRight size={12} className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-red-500" />
              </button>
            </nav>
          </aside>

          {/* ── Main Content Area ── */}
          <main className="lg:col-span-8 xl:col-span-9 w-full">
            
            {/* Save success toast alert */}
            {saveSuccess && (
              <div className="mb-6 p-4 bg-slate-900 border border-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-2xl flex items-center gap-3 shadow-md animate-fade-in">
                <CheckCircle size={16} className="text-white shrink-0" />
                Info Updated Successfully!
              </div>
            )}

            {/* Content card */}
            <div className="bg-white border border-slate-200/60 rounded-[32px] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
              
              {/* MY ACCOUNTS TAB */}
              {activeTab === "account" && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-8 gap-4">
                    <div className="flex items-center gap-4">
                      <h2 className="text-2xl md:text-3xl font-light text-slate-700 tracking-wide">PERSONAL SETTINGS</h2>
                      <button
                        type="button"
                        onClick={handleEditToggle}
                        className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 uppercase tracking-widest transition-all w-fit"
                      >
                        <Edit size={14} />
                        {isEditing ? "CANCEL" : "EDIT DETAILS"}
                      </button>
                    </div>

                    {/* Avatar in the edit row on the right side */}
                    <div className="relative w-24 h-24 rounded-full border-[6px] border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white flex items-center justify-center text-slate-500 group overflow-hidden transition-all shrink-0">
                      <User size={34} strokeWidth={1.5} />
                      {isEditing && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                          <span className="text-white text-[9px] font-bold uppercase tracking-wider">Change</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-8 max-w-2xl">

                    {/* Inputs Grid */}
                    <div className="grid grid-cols-1 gap-y-8">
                      
                      {/* Name */}
                      <div className="flex flex-col gap-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-800">FULL NAME</label>
                        <input
                          type="text"
                          name="name"
                          disabled={!isEditing}
                          value={isEditing ? editForm.name : profile.name}
                          onChange={handleInputChange}
                          className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-white disabled:bg-white disabled:text-slate-500 disabled:cursor-not-allowed text-slate-700 text-[15px] font-semibold outline-none focus:border-slate-800 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                        />
                      </div>

                      {/* Phone */}
                      <div className="flex flex-col gap-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-800">PHONE NUMBER</label>
                        <div className={`relative flex items-center w-full h-14 rounded-2xl border bg-white overflow-hidden transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] ${isEditing ? 'border-slate-200 focus-within:border-slate-800' : 'border-slate-200'}`}>
                          <div className="flex items-center justify-center pl-5 pr-4 text-lg border-r border-slate-100 h-full bg-white text-slate-700">
                            🇮🇳
                          </div>
                          <input
                            type="text"
                            name="phone"
                            disabled={!isEditing}
                            value={isEditing ? editForm.phone : profile.phone}
                            onChange={handleInputChange}
                            className="w-full h-full px-5 bg-white disabled:text-slate-500 disabled:cursor-not-allowed text-slate-700 text-[15px] font-semibold outline-none"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-800">EMAIL ADDRESS</label>
                        <div className="relative shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl">
                          <input
                            type="email"
                            name="email"
                            disabled={!isEditing}
                            value={isEditing ? editForm.email : profile.email}
                            onChange={handleInputChange}
                            className="w-full h-14 pl-5 pr-14 rounded-2xl border border-slate-200 bg-white disabled:bg-white disabled:text-slate-500 disabled:cursor-not-allowed text-slate-700 text-[15px] font-semibold outline-none focus:border-slate-800 transition-all"
                          />
                          <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                        </div>
                      </div>

                    </div>

                    {/* Action buttons */}
                    {isEditing && (
                      <div className="flex items-center gap-4 pt-4">
                        <button
                          type="submit"
                          className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-900/10"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}

                  </form>
                </div>
              )}

              {/* MY ORDERS TAB */}
              {activeTab === "orders" && (
                <div>
                  <h2 className="text-lg font-black text-slate-850 uppercase tracking-wider border-b border-slate-200/60 pb-6 mb-8">
                    Order History
                  </h2>

                  {orders.length === 0 ? (
                    <div className="text-center py-16">
                      <Package size={40} className="text-slate-350 mx-auto mb-4" />
                      <p className="text-xs font-black text-slate-400 uppercase tracking-wider">No Orders Placed Yet</p>
                      <button
                        onClick={() => router.push("/products")}
                        className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-850 transition-all"
                      >
                        Browse Shop
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-slate-200/80 rounded-2xl overflow-hidden bg-slate-50/10 hover:border-slate-300 transition-all">
                          
                          {/* Order Card Header */}
                          <div className="bg-slate-50/80 px-5 md:px-6 py-5 border-b border-slate-200/60 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
                            <div className="flex w-full md:w-auto items-center gap-8 md:gap-8">
                              <div className="flex-1 md:flex-none">
                                <p className="text-[10px] md:text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">Date</p>
                                <p className="text-sm md:text-base font-bold text-slate-800">{order.date}</p>
                              </div>
                              <div className="flex-1 md:flex-none">
                                <p className="text-[10px] md:text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">Total</p>
                                <p className="text-sm md:text-base font-black text-slate-800 font-extrabold">₹{order.total.toLocaleString()}</p>
                              </div>
                              <div className="flex-1 md:flex-none">
                                <p className="text-[10px] md:text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">Method</p>
                                <span className={`inline-flex px-3.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                                  (order.paymentMethod || "COD") === "COD" 
                                    ? "bg-amber-50 text-amber-600 border border-amber-200/50" 
                                    : "bg-blue-50 text-blue-600 border border-blue-200/50"
                                }`}>
                                  {order.paymentMethod === "Razorpay" ? "Online" : (order.paymentMethod || "COD")}
                                </span>
                              </div>
                            </div>
                            <div className="w-full md:w-auto text-left md:text-right mt-2 md:mt-0">
                              <p className="text-[10px] md:text-xs font-black text-emerald-500 uppercase tracking-widest mb-1 md:text-right">Order ID</p>
                              <p className="text-sm md:text-base font-mono font-bold text-slate-800 md:text-right break-all">{order.id}</p>
                            </div>
                          </div>

                          {/* Order Card Items & Status */}
                          <div className="p-5 md:p-6 flex flex-col xl:flex-row justify-between items-start gap-8">
                            
                            <div className="space-y-4 flex-1 w-full">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex flex-row items-center gap-4 rounded-2xl p-4 bg-white/60 border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all"
                                >
                                  {/* Image — compact, left side */}
                                  <Link
                                    href={`/products/${item.productId || item.id}`}
                                    className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0 group"
                                  >
                                    <Image
                                      src={item.image || "/logo.webp"}
                                      alt={item.name || "Product Image"}
                                      fill
                                      className="object-contain p-2 mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                                    />
                                  </Link>

                                  {/* Details — right side */}
                                  <div className="flex-1 min-w-0">
                                    <Link href={`/products/${item.productId || item.id}`}>
                                      <h4 className="text-[15px] md:text-lg font-bold text-slate-900 hover:text-black transition leading-snug truncate">
                                        {item.name}
                                      </h4>
                                    </Link>

                                    {item.color && (
                                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] md:text-xs font-bold text-slate-600 mt-1.5">
                                        {item.color}
                                      </span>
                                    )}

                                    {/* Price / Qty / Total — 3 cols */}
                                    <div className="mt-3 grid grid-cols-3 gap-2">
                                      <div>
                                        <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Price</p>
                                        <p className="text-[13px] font-bold text-slate-900">₹{(item.price ?? 0).toLocaleString()}</p>
                                      </div>
                                      <div>
                                        <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Qty</p>
                                        <p className="text-[13px] font-bold text-slate-900">{item.quantity}</p>
                                      </div>
                                      <div>
                                        <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Total</p>
                                        <p className="text-[13px] font-bold text-slate-500">₹{((item.price ?? 0) * (item.quantity ?? 0)).toLocaleString()}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Status badge and actions */}
                            <div className="flex flex-col md:items-end gap-5 shrink-0 w-full xl:w-[220px] self-start mt-2 xl:mt-4 xl:mr-4">
                              <div className="flex items-center gap-2">
                                {(() => {
                                  const statusStr = (order.status || "Pending").toLowerCase().trim();
                                  if (statusStr === "delivered") {
                                    return (
                                      <>
                                        <CheckCircle size={16} className="text-emerald-500" />
                                        <span className="text-[11px] font-black text-emerald-500 uppercase tracking-wider">Delivered</span>
                                      </>
                                    );
                                  }
                                  if (statusStr === "shipped") {
                                    return (
                                      <>
                                        <Truck size={16} className="text-blue-500" />
                                        <span className="text-[11px] font-black text-blue-500 uppercase tracking-wider">Shipped</span>
                                      </>
                                    );
                                  }
                                  if (statusStr === "out for delivery") {
                                    return (
                                      <>
                                        <Truck size={16} className="text-indigo-500" />
                                        <span className="text-[11px] font-black text-indigo-500 uppercase tracking-wider">Out for Delivery</span>
                                      </>
                                    );
                                  }
                                  if (statusStr === "processing" || statusStr === "processing / packing" || statusStr.includes("processing")) {
                                    return (
                                      <>
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                                        <span className="text-[11px] font-black text-amber-500 uppercase tracking-wider">Processing / Packing</span>
                                      </>
                                    );
                                  }
                                  if (statusStr === "confirmed") {
                                    return (
                                      <>
                                        <CheckCircle size={16} className="text-teal-500" />
                                        <span className="text-[11px] font-black text-teal-500 uppercase tracking-wider">Confirmed</span>
                                      </>
                                    );
                                  }
                                  if (statusStr === "pending") {
                                    return (
                                      <>
                                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                                        <span className="text-[11px] font-black text-rose-500 uppercase tracking-wider">Pending</span>
                                      </>
                                    );
                                  }
                                  // Fallback for custom or unrecognized status
                                  return (
                                    <>
                                      <div className="w-2.5 h-2.5 rounded-full bg-slate-500 animate-pulse" />
                                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{order.status}</span>
                                    </>
                                  );
                                })()}
                              </div>

                              <div className="flex flex-row md:flex-col items-stretch justify-end gap-3 w-full mt-2">
                                <button
                                  onClick={() => {
                                    order.items.forEach(item => {
                                      const cartEvent = new CustomEvent("add-to-cart", {
                                        detail: {
                                          id: item.id,
                                          name: item.name,
                                          price: item.price,
                                          image: item.image,
                                          quantity: item.quantity
                                        }
                                      });
                                      window.dispatchEvent(cartEvent);
                                    });
                                  }}
                                  className="flex-1 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-slate-800 transition-all shadow-md active:scale-95"
                                >
                                  Reorder
                                </button>
                              </div>
                            </div>

                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* MY WISHLIST TAB */}
              {activeTab === "wishlist" && (
                <div>
                  <h2 className="text-lg font-black text-slate-850 uppercase tracking-wider border-b border-slate-200/60 pb-6 mb-8">
                    My Saved Items
                  </h2>

                  {wishlist.length === 0 ? (
                    <div className="text-center py-16">
                      <Heart size={40} className="text-slate-350 mx-auto mb-4" />
                      <p className="text-xs font-black text-slate-400 uppercase tracking-wider font-extrabold">Wishlist is Empty</p>
                      <button
                        onClick={() => router.push("/products")}
                        className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-850 transition-all"
                      >
                        Explore Chairs
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {wishlist.map((item) => (
                        <div key={item.id} className="border border-slate-200/60 rounded-2xl p-3 sm:p-5 bg-slate-50/10 relative flex flex-col justify-between hover:border-slate-350 transition-all group hover:shadow-md">
                          
                          {/* Trash button */}
                          <button
                            onClick={() => handleRemoveWishlist(item.id)}
                            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200/50 transition-all md:opacity-0 md:group-hover:opacity-100"
                          >
                            <Trash2 size={10} className="sm:hidden" />
                            <Trash2 size={12} className="hidden sm:block" />
                          </button>

                          {/* Image */}
                          <div className="relative w-full aspect-square bg-white rounded-xl overflow-hidden flex items-center justify-center border border-slate-100 mb-3 sm:mb-4 shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-contain p-2 sm:p-3 mix-blend-multiply"
                            />
                          </div>

                          {/* Details */}
                          <div>
                            <div className="flex items-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-2">
                              <span className="bg-slate-100 text-slate-700 font-extrabold text-[8px] sm:text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-md border border-slate-200">
                                -{item.discount}
                              </span>
                              <div className="flex items-center text-amber-500 text-[10px] sm:text-xs font-bold">
                                <Star size={8} fill="currentColor" className="mr-0.5 text-amber-400 sm:w-2.5 sm:h-2.5" />
                                {item.rating}
                              </div>
                            </div>
                            
                            <h4 className="font-extrabold text-slate-800 text-[11px] sm:text-xs mb-1 sm:mb-1.5 truncate">{item.name}</h4>
                            
                            <div className="flex items-baseline gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                              <span className="text-xs sm:text-sm font-black text-slate-900 font-extrabold">₹{item.price.toLocaleString()}</span>
                              <span className="text-[9px] sm:text-[10px] text-slate-400 line-through">₹{item.originalPrice.toLocaleString()}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="w-full py-2 sm:py-2.5 bg-slate-900 text-white rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-slate-800 transition-all active:scale-[0.98] shadow-md shadow-slate-900/5"
                          >
                            <ShoppingCart size={10} className="sm:hidden" />
                            <ShoppingCart size={12} className="hidden sm:block" />
                            Add To Cart
                          </button>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
