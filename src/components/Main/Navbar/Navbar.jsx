"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Phone,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
} from "lucide-react";

import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function Navbar() {
  const [hideTopBar, setHideTopBar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleFindYourChair = () => {
    if (pathname === "/") {
      const el = document.getElementById("circular-chairs");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      window.dispatchEvent(new Event("open-chair-finder"));
    } else {
      router.push("/?finder=true");
    }
  };

  const adminLayout = pathname.startsWith("/admin");
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setHideTopBar((prev) => {
        if (scrollY > 100) return true;
        if (scrollY < 10) return false;
        return prev;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const loadCart = () => {
    const savedCart = localStorage.getItem('astride_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    } else {
      setCartItems([]);
    }
  };
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Dynamic Data Fetching
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadCart();
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem("token"));
    }

    const handleStorageChange = () => {
      loadCart();
      if (typeof window !== "undefined") {
        setIsLoggedIn(!!localStorage.getItem("token"));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('add-to-cart', handleStorageChange);
    window.addEventListener('astride_cart_updated', handleStorageChange);

    // Fetch dynamic categories and products
    const fetchData = async () => {
      try {
        const catRes = await fetch("/api/category");
        const catData = await catRes.json();
        if (catData?.success) {
          setCategories(catData.categories);
        }
        
        const prodRes = await fetch("/api/product");
        const prodData = await prodRes.json();
        if (prodData?.success) {
          setProducts(prodData.products);
        }
      } catch (err) {
        console.error("Error fetching navbar data:", err);
      }
    };
    fetchData();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('add-to-cart', handleStorageChange);
      window.removeEventListener('astride_cart_updated', handleStorageChange);
    };
  }, []);

  const [activeMenu, setActiveMenu] = useState(null);

  const CHAIR_CATEGORIES = {
    'Gaming Chair': {
      label: 'Gaming Chair',
      chairs: [
        { name: 'ACE Pro Gaming', image: '/Png1/chair4_ACE.webp', tag: 'Bestseller', buyUrl: '#buy' },
        { name: 'Apex Gaming', image: '/Png1/chair9_FitWell.webp', tag: 'Pro', buyUrl: '#buy' },
        { name: 'RGB Gaming Chair', image: '/Product/InfographicDesign-1.webp', tag: 'Premium', buyUrl: '#buy' }
      ]
    },
    'Executive Chair': {
      label: 'Executive Chair',
      chairs: [
        { name: 'AlphaGrey', image: '/Png1/chair6_AlphaGrey.webp', tag: 'Premium Mesh', buyUrl: '#buy' },
        { name: 'ErgoFit Executive', image: '/Png1/chair12_ErgoFit.webp', tag: 'High Back', buyUrl: '#buy' },
        { name: 'Executive Mesh Chair', image: '/Product/AlphaBrown_8.webp', tag: 'Bestseller', buyUrl: '#buy' }
      ]
    },
    'Staff Chair': {
      label: 'Staff Chair',
      chairs: [
        { name: 'Delton Staff', image: '/Png1/Chair7_Delton.webp', tag: 'Comfort', buyUrl: '#buy' },
        { name: 'AIRSENSE Task', image: '/Png1/chair5_AIRSENSE.webp', tag: 'Aero Mesh', buyUrl: '#buy' },
        { name: 'Amica Black', image: '/Png1/Chair6a_Amica Black .webp', tag: 'Classic', buyUrl: '#buy' }
      ]
    },
    'Study Chair': {
      label: 'Study Chair',
      chairs: [
        { name: 'ErgoFit Pro', image: '/Product/1.webp', tag: 'Students', buyUrl: '#buy' },
        { name: 'Comfort Office', image: '/Product/Infographic-6.webp', tag: 'Comfort', buyUrl: '#buy' },
        { name: 'Modern Workspace', image: '/Product/InfographicDesign-1.webp', tag: 'Compact', buyUrl: '#buy' }
      ]
    },
    'Bar Stool': {
      label: 'Bar Stool',
      chairs: [
        { name: 'Zenith Stool', image: '/Png1/chair10_FitWell.webp', tag: 'Counter Stool', buyUrl: '#buy' },
        { name: 'Apex Stool', image: '/Png1/chair9_FitWell.webp', tag: 'Bestseller', buyUrl: '#buy' },
        { name: 'Luxury Bar Stool', image: '/Product/AlphaBrown_8.webp', tag: 'Premium', buyUrl: '#buy' }
      ]
    }
  };

  const fallbackCategories = [
    { _id: 'gaming-chair', name: 'Gaming Chair' },
    { _id: 'executive-chair', name: 'Executive Chair' },
    { _id: 'staff-chair', name: 'Staff Chair' },
    { _id: 'study-chair', name: 'Study Chair' },
    { _id: 'bar-stool', name: 'Bar Stool' },
  ];

  const categoryList = categories.length > 0 ? categories : fallbackCategories;
  
  // Find current active category
  const activeCategoryObj = categoryList.find(c => c.name.toLowerCase().trim() === activeMenu?.toLowerCase().trim());
  
  // Retrieve display products
  let displayChairs = [];
  if (activeMenu) {
    if (products.length > 0 && activeCategoryObj) {
      displayChairs = products
        .filter(p => {
          if (!p.category) return false;
          const pCatId = typeof p.category === 'object' ? p.category._id : p.category;
          return pCatId === activeCategoryObj._id;
        })
        .map(p => ({
          name: p.productName,
          image: p.colorVariants?.[0]?.images?.[0]?.url || '/placeholder.png',
          buyUrl: `/products/${p.slug}`,
          tag: p.whychoose || '',
        }));
    }
    
    // If no products found via database filter, check if static CHAIR_CATEGORIES has predefined items
    if (displayChairs.length === 0) {
      displayChairs = CHAIR_CATEGORIES[activeMenu]?.chairs || [];
    }
  }

  if (adminLayout) return null;

  return (
    <header className="w-full font-[Barlow] sticky -top-1 z-[1000] relative select-none" onMouseLeave={() => setActiveMenu(null)}>
      <motion.div
        animate={{
          height: hideTopBar ? 0 : 44,
          opacity: hideTopBar ? 0 : 1,
          y: hideTopBar ? -20 : 0,
        }}
        transition={{
          duration: 0.45,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="bg-[#161316]/95 backdrop-blur-xl text-white overflow-hidden border-b border-[#453027]"
      >
        <div className="max-w-7xl mx-auto px-4 h-11 flex items-center justify-between">
          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-[#FF6D29] transition-all duration-300 flex items-center justify-center hover:scale-110">
              <FaFacebookF size={14} />
            </button>
            <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-[#FF6D29] transition-all duration-300 flex items-center justify-center hover:scale-110">
              <FaInstagram size={15} />
            </button>
            <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-[#FF6D29] transition-all duration-300 flex items-center justify-center hover:scale-110">
              <FaYoutube size={15} />
            </button>
          </div>

          {/* CENTER TEXT */}
          <p className="hidden lg:block text-sm font-medium tracking-wide text-[#BABABA]">
            Tollfree Number 7311164111{" "}
            <span className="underline cursor-pointer ml-1 hover:text-[#FF6D29] transition-all duration-300">
              Call Now!
            </span>
          </p>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6 text-sm font-medium text-[#BABABA]">
            <Link href="/contact" className="flex items-center gap-2 hover:text-[#FF6D29] transition-all duration-300">
              <Phone size={16} />
              Support
            </Link>
            <Link href="/about" className="hover:text-[#FF6D29] transition-all duration-300">
              About
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="relative z-20 bg-[#161316]/90 backdrop-blur-xl border-b border-[#453027] shadow-[0_0_40px_rgba(255,109,41,0.08)]">
        <div className="lg:px-15 px-4 flex items-center justify-between gap-4 py-2 md:py-0">
          <div className="hidden md:flex items-center bg-white/5 border-b border-[#453027] overflow-hidden hover:border-[#FF6D29] focus-within:border-[#FF6D29] transition-all duration-300 shadow-lg backdrop-blur-xl">
            <div className="px-2 text-[#FF6D29]">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent w-full py-2 outline-none text-[16px] placeholder:text-[#BABABA] text-white"
            />
          </div>

          <Link href="/" className="shrink-0 md:pr-25 flex items-center">
            <Image
              src="/logo.webp"
              alt="logo"
              width={170}
              height={80}
              className="h-10 md:h-16 w-auto object-contain brightness-0 invert opacity-95"
            />
          </Link>

          <div className="flex items-center gap-4 md:gap-5 text-white">
            <Link href="/wishlist" className="text-[#BABABA] hover:text-[#FF6D29] transition-all duration-300 hover:scale-110">
              <Heart size={24} strokeWidth={1.8} />
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setIsCartOpen(true)}
              onMouseLeave={() => setIsCartOpen(false)}
            >
              <Link
                href={"/cart"}
                className="relative text-[#BABABA] hover:text-[#FF6D29] transition-all duration-300 hover:scale-110 flex items-center justify-center"
              >
                <ShoppingCart size={26} strokeWidth={1.8} />
                {cartItems.reduce((acc, item) => acc + item.quantity, 0) > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#FF6D29] to-[#ff8b55] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </Link>

              {/* Cart Popover */}
              {isCartOpen && (
                <div className="absolute right-0 top-full pt-3.5 w-80 z-[1100] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-white border border-neutral-200 rounded-xl shadow-xl p-6 text-center text-neutral-800">
                    {cartItems.length === 0 ? (
                      <>
                        <p className="text-neutral-500 text-sm font-bold mb-4">Cart is empty.</p>
                        <Link 
                          href="/products" 
                          className="block w-full py-3 text-xs font-extrabold text-white bg-black hover:bg-neutral-850 rounded-lg transition-colors shadow-sm uppercase tracking-wider"
                        >
                          Shop Now
                        </Link>
                      </>
                    ) : (
                      <>
                        <p className="text-neutral-800 text-xs font-black uppercase tracking-wider mb-3">
                          You have {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items
                        </p>
                        <div className="max-h-48 overflow-y-auto mb-4 space-y-3 pr-1 text-left">
                          {cartItems.map((item, idx) => (
                            <div key={idx} className="flex gap-3 items-center border-b border-neutral-100 pb-2 relative group/item">
                              <div className="relative w-10 h-10 bg-neutral-50 rounded border border-neutral-200/50 flex items-center justify-center shrink-0">
                                <Image src={item.image} alt={item.name} fill className="object-contain p-1 mix-blend-multiply" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold text-neutral-800 truncate">{item.name}</p>
                                <p className="text-[10px] text-neutral-500 font-semibold">{item.quantity} x ₹{item.price.toLocaleString()}</p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const updated = cartItems.filter((_, i) => i !== idx);
                                  localStorage.setItem('astride_cart', JSON.stringify(updated));
                                  window.dispatchEvent(new Event('astride_cart_updated'));
                                }}
                                className="w-5 h-5 rounded-md hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-red-500 transition-colors shrink-0"
                              >
                                <X size={10} strokeWidth={2.5} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-baseline mb-4">
                          <span className="text-[11px] font-bold text-neutral-400">Subtotal</span>
                          <span className="text-[15px] font-black text-neutral-900">₹{cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString()}</span>
                        </div>
                        <button 
                          onClick={() => {
                            setIsCartOpen(false);
                            router.push('/checkout');
                          }}
                          className="block w-full py-3 text-xs font-extrabold text-white bg-black hover:bg-neutral-850 rounded-lg transition-colors shadow-sm uppercase tracking-wider"
                        >
                          View Bag / Checkout
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              href={isLoggedIn ? "/account" : "/login"}
              className="text-[#BABABA] hover:text-[#FF6D29] transition-all duration-300 hover:scale-110"
            >
              <User size={24} strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-[#161316] border-b border-[#453027] shadow-sm hidden md:block">
        <div className="lg:px-15 px-4 relative flex items-center justify-center">
          {/* NAVIGATION */}
          <nav className="hidden md:flex items-center justify-center gap-10 pt-3 pb-4 overflow-x-auto whitespace-nowrap text-[17px] font-bold text-[#BABABA] scrollbar-hide">
            {categoryList.map((category) => (
              <button
                key={category._id || category.name}
                onMouseEnter={() => setActiveMenu(category.name)}
                className={`relative group transition-all duration-300 px-3 py-1 uppercase tracking-wider text-sm font-black ${
                  activeMenu === category.name ? 'text-white' : 'text-[#BABABA] hover:text-white'
                }`}
              >
                <span>{category.name}</span>
                <span className={`absolute left-0 -bottom-1 h-[2px] bg-zinc-500 transition-all duration-300 ${
                  activeMenu === category.name ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </button>
            ))}
          </nav>

          {/* FIND YOUR CHAIR BUTTON */}
          <div className="absolute right-4 lg:right-15 top-1/2 -translate-y-1/2 flex items-center">
            <button
              onClick={handleFindYourChair}
              className="bg-[#F4F5F7] border border-slate-300 text-[#0F172A] hover:bg-white hover:border-slate-400 rounded-full px-6 py-2.5 text-sm font-black uppercase tracking-widest transition-all duration-300 shadow-sm"
            >
              FIND YOUR CHAIR
            </button>
          </div>
        </div>
      </div>

      {/* MEGA MENU DROPDOWN */}
      {activeMenu && displayChairs.length > 0 && (
        <div 
          className="absolute left-0 top-full w-full bg-[#f3f4f6] border-b border-gray-300 text-gray-900 py-8 px-12 z-[90] shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
          onMouseEnter={() => setActiveMenu(activeMenu)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="max-w-7xl mx-auto relative px-10">
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              slidesPerView={1}
              spaceBetween={20}
              centerInsufficientSlides={true}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 24 },
                1024: { slidesPerView: 4, spaceBetween: 28 },
                1280: { slidesPerView: 5, spaceBetween: 32 },
              }}
              className="w-full"
            >
              {displayChairs.map((chair, index) => (
                <SwiperSlide key={index}>
                  <Link 
                    href={chair.buyUrl || '#'} 
                    onClick={() => setActiveMenu(null)}
                    className="flex flex-col items-center group relative cursor-pointer w-full"
                  >
                    {/* Visual Container */}
                    <div className="relative w-full aspect-square bg-white border border-gray-100 rounded-[28px] flex flex-col items-center justify-center p-2 hover:bg-gray-50 group-hover:border-gray-300 group-hover:shadow-xl transition-all duration-500 shadow-sm overflow-hidden">
                      <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out flex items-center justify-center">
                        {chair.image && chair.image !== '/placeholder.png' ? (
                          <Image
                            src={chair.image}
                            alt={chair.name}
                            fill
                            className="object-contain drop-shadow-[0_10px_16px_rgba(0,0,0,0.12)] p-2"
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-2 opacity-50">
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Loading...</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Name Overlay on Hover */}
                      <div className="absolute bottom-3 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 px-2 z-10">
                        <span className="bg-white/95 backdrop-blur-md text-[10px] font-extrabold text-gray-800 px-3 py-1.5 rounded-full shadow-sm inline-block line-clamp-1 max-w-[95%] border border-gray-100 uppercase tracking-wide">
                          {chair.name}
                        </span>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Arrows */}
            {displayChairs.length > 4 && (
              <>
                <button className="swiper-button-prev-custom absolute -left-2 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-md hover:bg-gray-50 hover:border-gray-400 transition-all text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronLeft size={20} />
                </button>
                <button className="swiper-button-next-custom absolute -right-2 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-md hover:bg-gray-50 hover:border-gray-400 transition-all text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}