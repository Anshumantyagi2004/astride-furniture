"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: "Delivered" | "Shipped" | "Processing" | "Cancelled";
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
  name: "Arnav",
  email: "arnav@gmail.com",
  phone: "+90-123456789",
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
          status: o.orderStatus || "Processing",
          items: (o.products || []).map((p: any) => ({
            id: p._id || p.productId,
            name: p.productName,
            price: p.price,
            image: p.image,
            quantity: p.quantity,
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
    const storedProfile = localStorage.getItem("astride_profile");
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id) {
          fetchMyOrders(parsedUser.id);
        }
      } catch (e) {
        console.error(e);
      }
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

  return (
    <div className="min-h-screen bg-[#f1f3f5] text-slate-800 py-16 md:py-24 px-4 md:px-8 select-none relative overflow-hidden" style={{ fontFamily: '"Inter", sans-serif' }}>
      
      {/* Subtle monochrome ambient glow */}
      <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] rounded-full bg-slate-400/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-10%] w-[600px] h-[600px] rounded-full bg-slate-300/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[1300px] mx-auto relative z-10">
        
        {/* Dashboard Title Header with Slate Lettering */}
        <div className="flex flex-col gap-1.5 mb-12">
          <p className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">Dashboard</p>
          <h1 className="text-slate-900 text-5xl sm:text-7xl lg:text-8xl font-black uppercase leading-none tracking-tighter" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>
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
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-6 mb-8">
                    <h2 className="text-lg font-black text-slate-850 uppercase tracking-wider">Personal Settings</h2>
                    <button
                      type="button"
                      onClick={handleEditToggle}
                      className="flex items-center gap-2 text-xs font-extrabold text-slate-600 uppercase tracking-wider hover:text-slate-900 hover:brightness-90 transition-all"
                    >
                      <Edit size={12} />
                      {isEditing ? "Cancel" : "Edit Details"}
                    </button>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-8">
                    
                    {/* Avatar row with premium slate user placeholder */}
                    <div className="flex justify-start">
                      <div className="relative w-24 h-24 rounded-full border-4 border-slate-100 shadow-md bg-slate-50 flex items-center justify-center text-slate-500 relative overflow-hidden group">
                        <User size={36} strokeWidth={1.8} />
                      </div>
                    </div>

                    {/* Inputs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      
                      {/* Name */}
                      <div className="flex flex-col gap-2.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-450">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          disabled={!isEditing}
                          value={isEditing ? editForm.name : profile.name}
                          onChange={handleInputChange}
                          className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 disabled:opacity-65 disabled:cursor-not-allowed text-slate-800 text-sm font-semibold outline-none focus:border-slate-850 focus:bg-white transition-all"
                        />
                      </div>

                      {/* Phone */}
                      <div className="flex flex-col gap-2.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-450">Phone Number</label>
                        <div className="relative flex">
                          <span className="h-12 px-3.5 border border-r-0 border-slate-200 bg-slate-50 flex items-center justify-center text-sm rounded-l-xl text-slate-550">
                            🇮🇳
                          </span>
                          <input
                            type="text"
                            name="phone"
                            disabled={!isEditing}
                            value={isEditing ? editForm.phone : profile.phone}
                            onChange={handleInputChange}
                            className="w-full h-12 px-4 rounded-r-xl border border-slate-200 bg-slate-50/50 disabled:opacity-65 disabled:cursor-not-allowed text-slate-800 text-sm font-semibold outline-none focus:border-slate-850 focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-2.5 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-450">Email Address</label>
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            disabled={!isEditing}
                            value={isEditing ? editForm.email : profile.email}
                            onChange={handleInputChange}
                            className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 disabled:opacity-65 disabled:cursor-not-allowed text-slate-800 text-sm font-semibold outline-none focus:border-slate-850 focus:bg-white transition-all"
                          />
                          <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>
                      </div>

                    </div>

                    {/* Action buttons */}
                    {isEditing && (
                      <div className="flex items-center gap-4 pt-6 border-t border-slate-200/60">
                        <button
                          type="submit"
                          className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-slate-850 active:scale-[0.98] transition-all shadow-md shadow-slate-900/5"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={handleEditToggle}
                          className="px-6 py-3 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-slate-200 transition-all"
                        >
                          Cancel
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
                          <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200/60 flex flex-wrap justify-between items-center gap-4">
                            <div className="flex items-center gap-6">
                              <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                                <p className="text-xs font-bold text-slate-600">{order.date}</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                                <p className="text-xs font-black text-slate-850 font-extrabold">₹{order.total.toLocaleString()}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 text-right">Order Ref</p>
                              <p className="text-xs font-mono font-bold text-slate-650">{order.id}</p>
                            </div>
                          </div>

                          {/* Order Card Items & Status */}
                          <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            
                            <div className="space-y-4 flex-1">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center">
                                  <div className="relative w-14 h-14 bg-white rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-slate-100">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      fill
                                      className="object-contain p-1.5 mix-blend-multiply"
                                    />
                                  </div>
                                  <div>
                                    <h4 className="font-extrabold text-slate-800 text-xs leading-snug">{item.name}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1">QTY: {item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Status badge and actions */}
                            <div className="flex flex-col md:items-end gap-3.5 shrink-0">
                              <div className="flex items-center gap-2">
                                {order.status === "Delivered" && (
                                  <>
                                    <CheckCircle size={14} className="text-emerald-500" />
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">Delivered</span>
                                  </>
                                )}
                                {order.status === "Shipped" && (
                                  <>
                                    <Truck size={14} className="text-slate-600" />
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Shipped</span>
                                  </>
                                )}
                                {order.status === "Processing" && (
                                  <>
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-450 animate-pulse" />
                                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider">Processing</span>
                                  </>
                                )}
                              </div>

                              <div className="flex items-center gap-2.5">
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
                                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-slate-800 transition-all"
                                >
                                  Reorder
                                </button>
                                <button
                                  onClick={() => alert(`Tracking updates for ${order.id} will be sent to your device.`)}
                                  className="px-4 py-2 bg-slate-100 border border-slate-200 text-slate-650 rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-slate-200 transition-all"
                                >
                                  Track
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlist.map((item) => (
                        <div key={item.id} className="border border-slate-200/60 rounded-2xl p-5 bg-slate-50/10 relative flex flex-col justify-between hover:border-slate-350 transition-all group hover:shadow-md">
                          
                          {/* Trash button */}
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
              )}

            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
