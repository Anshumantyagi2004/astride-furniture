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

// --- STATIC CHAIR DATA (Moved up so the search can use it as a fallback) ---
const CHAIR_CATEGORIES = {
  'Gaming Chair': {
    label: 'Gaming Chair',
    chairs: [
      { name: 'ACE Pro Gaming', image: '/Png1/chair4_ACE.webp', tag: 'Bestseller', buyUrl: '#buy' },
      { name: 'Apex Gaming', image: '/Png1/chair9_FitWell.webp', tag: 'Pro', buyUrl: '#buy' },
      { name: 'RGB Gaming Chair', image: '/Product/InfographicDesign-1.webp', tag: 'Premium', buyUrl: '#buy' }
    ]
  },
  'Office Chair': {
    label: 'Office Chair',
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
  'Bar Stools & Cafe Chair': {
    label: 'Bar Stools & Cafe Chair',
    chairs: [
      { name: 'Zenith Stool', image: '/Png1/chair10_FitWell.webp', tag: 'Counter Stool', buyUrl: '#buy' },
      { name: 'Apex Stool', image: '/Png1/chair9_FitWell.webp', tag: 'Bestseller', buyUrl: '#buy' },
      { name: 'Luxury Bar Stool', image: '/Product/AlphaBrown_8.webp', tag: 'Premium', buyUrl: '#buy' }
    ]
  }
};

// --- HELPER TO EXTRACT PRODUCT IMAGE ---
const getProductImage = (p) => {
  if (p.colorVariants?.[0]?.images?.[0]?.url) return p.colorVariants[0].images[0].url;
  if (p.images?.[0]) {
    const firstImg = p.images[0];
    return typeof firstImg === 'string' ? firstImg : (firstImg.url || firstImg);
  }
  return '/placeholder.png';
};

// --- ENHANCED FUZZY SEARCH ALGORITHM ---
const getSuggestions = (query, allProducts) => {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  const queryWords = q.split(/\s+/).filter(Boolean);
  
  let itemsToSearch = allProducts;
  if (!allProducts || allProducts.length === 0) {
    itemsToSearch = Object.values(CHAIR_CATEGORIES).flatMap(cat => cat.chairs).map(chair => ({
      _id: chair.name, 
      productName: chair.name,
      realPrice: "See price in cart",
      images: [{ url: chair.image }],
      category: { name: chair.tag }
    }));
  }
  
  const results = itemsToSearch.map(p => {
    if (!p) return null;
    const name = (p.productName || p.name || p.title || "").toLowerCase();
    let score = 0;
    
    if (name.includes(q)) score += 100;
    
    let wordMatchCount = 0;
    queryWords.forEach(word => {
      if (name.includes(word)) {
        score += 10;
        wordMatchCount++;
      }
    });
    if (wordMatchCount === queryWords.length && queryWords.length > 1) score += 50;

    let qIdx = 0;
    let nq = q.replace(/\s+/g, '');
    for (let i = 0; i < name.length && qIdx < nq.length; i++) {
      if (name[i] === nq[qIdx]) qIdx++;
    }
    if (qIdx === nq.length) score += 20; 

    const cat = typeof p.category === 'object' ? (p.category?.name || "").toLowerCase() : (p.category || "").toLowerCase();
    if (cat.includes(q)) score += 15;

    return { ...p, _matchScore: score };
  })
  .filter(p => p && p._matchScore > 0)
  .sort((a, b) => b._matchScore - a._matchScore)
  .slice(0, 6);

  console.log("getSuggestions query:", query, "allProducts size:", allProducts?.length, "matches found:", results.map(r => r.productName));
  return results;
};

export default function Navbar() {
  const [hideTopBar, setHideTopBar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  // Ensure client‑only rendering for suggestion dropdowns to avoid SSR hydration mismatches
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Dynamic Data Fetching
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // Calculate dynamic suggestions
  const suggestions = getSuggestions(searchQuery, products);

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
        const [catRes, prodRes] = await Promise.all([
          fetch("/api/category"),
          fetch("/api/product")
        ]);
        const [catData, prodData] = await Promise.all([
          catRes.json(),
          prodRes.json()
        ]);

        if (catData?.success) {
          const mappedCats = catData.categories.map(cat => {
            if (cat.name === "Executive Chair") {
              return { ...cat, name: "Office Chair" };
            }
            if (cat.name === "Bar Stool" || cat.name === "Bar Stools") {
              return { ...cat, name: "Bar Stools & Cafe Chair" };
            }
            return cat;
          });
          setCategories(mappedCats);
        }
        
        if (prodData?.success) {
          setProducts(prodData.products);
          sessionStorage.setItem("astride_nav_products_cache", JSON.stringify(prodData.products));
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

  const fallbackCategories = [
    { _id: 'gaming-chair', name: 'Gaming Chair' },
    { _id: 'executive-chair', name: 'Office Chair' },
    { _id: 'staff-chair', name: 'Staff Chair' },
    { _id: 'study-chair', name: 'Study Chair' },
    { _id: 'bar-stool', name: 'Bar Stools & Cafe Chair' },
  ];

  const categoryList = categories.length > 0 ? categories : fallbackCategories;
  
  const getNormalizedCategoryName = (p) => {
    if (!p.category) return "";
    const dbCategory = typeof p.category === 'object' && p.category.name ? p.category.name.toUpperCase() : "";
    if (dbCategory.includes("GAMING") || dbCategory.includes("GAME")) return "Gaming Chair";
    if (dbCategory.includes("EXECUTIVE")) return "Office Chair";
    if (dbCategory.includes("STAFF")) return "Staff Chair";
    if (dbCategory.includes("STUDY")) return "Study Chair";
    if (dbCategory.includes("BAR") || dbCategory.includes("STOOL") || dbCategory.includes("CAFE")) return "Bar Stools & Cafe Chair";
    if (dbCategory.includes("OFFICE") || dbCategory.includes("TASK") || dbCategory.includes("ERGO")) return "Office Chair";
    return "";
  };

  // Retrieve display products
  let displayChairs = [];
  if (activeMenu) {
    if (products.length > 0) {
      displayChairs = products
        .filter(p => {
          const normalizedCat = getNormalizedCategoryName(p);
          return normalizedCat === activeMenu;
        })
        .map(p => ({
          name: p.productName || p.name || p.title,
          image: p.colorVariants?.[0]?.images?.[0]?.url || '/placeholder.png',
          buyUrl: `/products/${p.slug || p._id}`,
          tag: p.whychoose || '',
        }));
    }
    
    if (displayChairs.length === 0) {
      displayChairs = CHAIR_CATEGORIES[activeMenu]?.chairs || [];
    }
  }

  if (adminLayout) return null;

  return (
    <header className="w-full font-[Barlow] sticky -top-1 z-[1000] relative select-none" onMouseLeave={() => setActiveMenu(null)}>
      {/* TOP CONTACT BAR */}
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
        <div className="lg:px-15 px-4 h-11 flex items-center justify-between">
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

          <p className="hidden lg:block text-sm font-medium tracking-wide text-[#BABABA]">
            Tollfree Number 7311164111{" "}
            <span className="underline cursor-pointer ml-1 hover:text-[#FF6D29] transition-all duration-300">
              Call Now!
            </span>
          </p>

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

      {/* MAIN NAVBAR ROW */}
      <div className="relative z-20 bg-[#161316]/90 backdrop-blur-xl border-b border-[#453027] shadow-[0_0_40px_rgba(255,109,41,0.08)]">
        <div className="max-w-[1920px] mx-auto lg:px-15 px-4 flex items-center h-[72px] relative justify-between">
          
          {/* Hamburger Menu for Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-[#BABABA] hover:text-white p-1 transition-colors z-10"
          >
            <Menu size={24} />
          </button>

          {/* LEFT: DESKTOP SEARCH BAR (Pill Shaped) */}
          <div className="hidden md:flex relative items-center bg-[#F1F5F9] rounded-full px-4 py-2 w-[220px] lg:w-[280px] border border-transparent focus-within:border-slate-300 transition-all duration-300 z-[60]">
            <input
              type="text"
              placeholder="Search chairs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                }
              }}
              className="bg-transparent outline-none w-full text-slate-800 placeholder:text-slate-500 font-medium text-[15px] pr-6"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors bg-white rounded-full p-0.5 shadow-sm">
                <X size={14} strokeWidth={2.5} />
              </button>
            )}
            {isMounted && (
              <pre style={{position:"absolute",background:"rgba(0,0,0,0.8)",color:"white",padding:"4px",zIndex:60}}>{JSON.stringify(suggestions.slice(0,5),null,2)}</pre>
            )}
            
            {/* Desktop Suggestions Dropdown */}
            {isMounted && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] max-h-[300px] overflow-y-auto py-1 block z-50">
                {suggestions.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => {
                      setSearchQuery("");
                      router.push(String(p._id).includes(' ') ? `/products` : `/products/${p.slug || p._id}`);
                    }}
                    className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-slate-50 border-b border-slate-100 last:border-b-0 text-left transition-colors cursor-pointer group"
                  >
                    <div className="relative w-10 h-10 bg-[#F1F5F9] rounded-lg flex items-center justify-center shrink-0 border border-slate-200/60 group-hover:border-slate-300 transition-colors">
                      <Image
                        src={getProductImage(p)}
                        alt={p.productName || p.name || 'Chair'}
                        fill
                        className="object-contain p-1 drop-shadow-sm mix-blend-multiply"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-slate-800 truncate leading-tight group-hover:text-[#FF6D29] transition-colors">
                        {p.productName || p.name || p.title}
                      </p>
                      <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                        {typeof p.realPrice === 'number' ? `₹${p.realPrice.toLocaleString()}` : p.realPrice}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CENTER: LOGO */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center z-0">
            <Image
              src="/logo.webp"
              alt="logo"
              width={160}
              height={70}
              className="h-10 md:h-[60px] w-auto object-contain brightness-0 invert opacity-95"
              priority
            />
          </Link>

          {/* RIGHT: ACTION ICONS */}
          <div className="flex items-center justify-end gap-5 lg:gap-6 text-[#BABABA] z-[60]">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden hover:text-[#FF6D29] transition-all duration-300 hover:scale-110"
            >
              <Search size={22} strokeWidth={2} />
            </button>
            
            <button
              onClick={() => {
                if(searchQuery) router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
              }}
              className="hidden md:block hover:text-[#FF6D29] transition-all duration-300 hover:scale-110"
            >
              <Search size={22} strokeWidth={2.2} />
            </button>

            <Link href="/wishlist" className="hidden md:block hover:text-[#FF6D29] transition-all duration-300 hover:scale-110">
              <Heart size={22} strokeWidth={2.2} />
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setIsCartOpen(true)}
              onMouseLeave={() => setIsCartOpen(false)}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('open-cart-sidebar'));
                }}
                className="relative hover:text-[#FF6D29] transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer"
              >
                <ShoppingCart size={22} strokeWidth={2.2} />
                {cartItems.reduce((acc, item) => acc + item.quantity, 0) > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-[#FF6D29] text-white text-[10px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-extrabold shadow-sm border-2 border-[#161316]">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </button>

              {/* Cart Popover */}
              {isCartOpen && (
                <div className="absolute right-0 top-full pt-4 w-[320px] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-white border border-neutral-200 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] p-6 text-center text-neutral-800">
                    {cartItems.length === 0 ? (
                      <>
                        <p className="text-neutral-500 text-sm font-bold mb-4">Cart is empty.</p>
                        <Link 
                          href="/products" 
                          className="block w-full py-3 text-xs font-extrabold text-white bg-[#161316] hover:bg-[#FF6D29] rounded-lg transition-colors shadow-sm uppercase tracking-wider"
                        >
                          Shop Now
                        </Link>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-2">
                          <p className="text-neutral-800 text-[11px] font-black uppercase tracking-wider">
                            {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items
                          </p>
                          <Link href="/cart" className="text-[10px] font-bold text-[#FF6D29] hover:underline uppercase">View Full Cart</Link>
                        </div>
                        <div className="max-h-48 overflow-y-auto mb-4 space-y-3 pr-1 text-left custom-scrollbar">
                          {cartItems.map((item, idx) => (
                            <div key={idx} className="flex gap-3 items-center border-b border-neutral-50 pb-3 relative group/item">
                              <div className="relative w-12 h-12 bg-[#F1F5F9] rounded-lg flex items-center justify-center shrink-0 border border-neutral-200/50">
                                <Image src={item.image} alt={item.name} fill className="object-contain p-1 mix-blend-multiply" />
                              </div>
                              <div className="flex-1 min-w-0 pt-1">
                                <p className="text-[12px] font-bold text-neutral-800 truncate leading-tight mb-1">{item.name}</p>
                                <p className="text-[11px] text-neutral-500 font-semibold">{item.quantity} x ₹{item.price.toLocaleString()}</p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const updated = cartItems.filter((_, i) => i !== idx);
                                  localStorage.setItem('astride_cart', JSON.stringify(updated));
                                  window.dispatchEvent(new Event('astride_cart_updated'));
                                }}
                                className="w-6 h-6 rounded-md hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-red-500 transition-colors shrink-0"
                              >
                                <X size={12} strokeWidth={2.5} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-baseline mb-5 pt-2 border-t border-neutral-100">
                          <span className="text-[12px] font-bold text-neutral-500">Subtotal</span>
                          <span className="text-[16px] font-black text-neutral-900">₹{cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString()}</span>
                        </div>
                        <button 
                          onClick={() => {
                            setIsCartOpen(false);
                            router.push('/checkout');
                          }}
                          className="block w-full py-3.5 text-[12px] font-extrabold text-white bg-[#161316] hover:bg-[#FF6D29] rounded-lg transition-colors shadow-md uppercase tracking-wider"
                        >
                          Checkout Now
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              href={isLoggedIn ? "/account" : "/login"}
              className="hover:text-[#FF6D29] transition-all duration-300 hover:scale-110 hidden sm:block"
            >
              <User size={22} strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </div>

      {/* CATEGORY NAV BAR */}
      <div className="bg-[#161316] border-b border-[#453027] shadow-sm hidden md:block relative z-10">
        <div className="lg:px-15 px-4 relative flex items-center justify-center">
          <nav className="hidden md:flex items-center justify-center gap-10 pt-3 pb-4 overflow-x-auto whitespace-nowrap text-[17px] font-bold text-[#BABABA] scrollbar-hide">
            {categoryList.map((category) => (
              <button
                key={category._id || category.name}
                onMouseEnter={() => setActiveMenu(category.name)}
                onClick={() => router.push(`/products?category=${encodeURIComponent(category.name)}`)}
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

          <div className="absolute right-4 lg:right-15 top-1/2 -translate-y-1/2 flex items-center">
            <button
              onClick={handleFindYourChair}
              className="bg-[#F4F5F7] border border-slate-300 text-[#0F172A] hover:bg-white hover:border-slate-400 rounded-full px-6 py-2.5 text-sm font-black uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-md"
            >
              FIND YOUR CHAIR
            </button>
          </div>
        </div>
      </div>

      {/* MEGA MENU DROPDOWN */}
      {activeMenu && displayChairs.length > 0 && (
        <div 
          className="absolute left-0 top-full w-full bg-[#f8fafc] border-b border-gray-200 text-gray-900 py-10 px-12 z-[90] shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
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
              className="w-full pb-4"
            >
              {displayChairs.map((chair, index) => (
                <SwiperSlide key={index}>
                  <Link 
                    href={chair.buyUrl || '#'} 
                    onClick={() => setActiveMenu(null)}
                    className="flex flex-col items-center group relative cursor-pointer w-full"
                  >
                    <div className="relative w-full aspect-square bg-white border border-gray-100 rounded-[28px] flex flex-col items-center justify-center p-2 hover:bg-slate-50 group-hover:border-slate-300 group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)] transition-all duration-500 shadow-sm overflow-hidden">
                      <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out flex items-center justify-center">
                        {chair.image && chair.image !== '/placeholder.png' ? (
                          <Image
                            src={chair.image}
                            alt={chair.name}
                            fill
                            className="object-contain drop-shadow-[0_10px_16px_rgba(0,0,0,0.12)] p-3 mix-blend-multiply"
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-2 opacity-50">
                            <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Loading...</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 px-3 pb-3 z-10 flex justify-center">
                        <span className="bg-white/95 backdrop-blur-md text-slate-800 px-3 py-2 rounded-xl shadow-md border border-slate-100 text-[10px] font-black uppercase tracking-wide text-center w-[90%] truncate">
                          {chair.name}
                        </span>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>

            {displayChairs.length > 4 && (
              <>
                <button className="swiper-button-prev-custom absolute -left-2 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-md hover:bg-slate-50 hover:border-slate-400 transition-all text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronLeft size={22} />
                </button>
                <button className="swiper-button-next-custom absolute -right-2 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-md hover:bg-slate-50 hover:border-slate-400 transition-all text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* MOBILE MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[2000] md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-[80%] max-w-[340px] bg-[#121212] border-r border-zinc-800/80 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-300">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
                <Image
                  src="/logo.webp"
                  alt="logo"
                  width={120}
                  height={50}
                  className="h-8 w-auto object-contain brightness-0 invert opacity-95"
                />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-zinc-400 hover:text-white transition-colors bg-white/5 p-1.5 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Search Box */}
              <div className="mt-6 relative z-[9999]">
                <div className="flex items-center bg-[#1a1a1a] border border-zinc-700/50 rounded-xl hover:border-zinc-500 focus-within:border-zinc-400 transition-all duration-300 px-3">
                  <div className="text-zinc-400 py-3">
                    <Search size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setIsMobileMenuOpen(false);
                        router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                      }
                    }}
                    className="bg-transparent w-full py-3 px-2 outline-none text-sm placeholder:text-zinc-500 text-white"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="text-zinc-500 py-3">
                      <X size={16} />
                    </button>
                  )}
                </div>
                
                {/* Mobile Suggestions */}
                {isMounted && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-[#1a1a1a] border border-zinc-700/50 rounded-xl shadow-2xl max-h-[250px] overflow-y-auto z-50">
                    {suggestions.map((p) => (
                      <button
                        key={p._id}
                        onClick={() => {
                          setSearchQuery("");
                          setIsMobileMenuOpen(false);
                          router.push(String(p._id).includes(' ') ? `/products` : `/products/${p.slug || p._id}`);
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 border-b border-zinc-800/50 last:border-b-0 text-left transition-colors cursor-pointer"
                      >
                        <div className="relative w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                          <Image
                            src={getProductImage(p)}
                            alt={p.productName || p.name || 'Chair'}
                            fill
                            className="object-contain p-1"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-white truncate">{p.productName || p.name || p.title}</p>
                          <p className="text-[11px] text-zinc-400 font-semibold mt-0.5">
                            {typeof p.realPrice === 'number' ? `₹${p.realPrice.toLocaleString()}` : p.realPrice}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-sm font-bold text-zinc-300 hover:text-white uppercase tracking-wider py-3 px-4 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/80 rounded-xl transition-all duration-300 shadow-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span>Home</span>
                </Link>

                <Link
                  href="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-sm font-bold text-zinc-300 hover:text-white uppercase tracking-wider py-3 px-4 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/80 rounded-xl transition-all duration-300 mb-6 shadow-sm"
                >
                  <Heart size={18} className="text-zinc-300" />
                  <span>My Wishlist</span>
                </Link>
                
                <Link
                  href={isLoggedIn ? "/account" : "/login"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-sm font-bold text-zinc-300 hover:text-white uppercase tracking-wider py-3 px-4 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/80 rounded-xl transition-all duration-300 mb-6 shadow-sm"
                >
                  <User size={18} className="text-zinc-300" />
                  <span>{isLoggedIn ? "My Account" : "Login"}</span>
                </Link>
              </div>

              <div className="mt-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 px-4">
                  Categories
                </h3>
                <nav className="flex flex-col gap-1.5">
                  {categoryList.map((category) => (
                    <Link
                      key={category._id || category.name}
                      href={`/products?category=${encodeURIComponent(category.name)}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between text-[14px] font-bold text-zinc-300 hover:text-white uppercase tracking-widest py-3 px-4 rounded-xl hover:bg-zinc-900/50 transition-all duration-300 border-l-2 border-transparent hover:border-zinc-400"
                    >
                      <span>{category.name}</span>
                      <ChevronRight size={14} className="text-zinc-500 hover:text-white transition-colors" />
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-zinc-800 flex flex-col gap-4">
              <div className="flex flex-col gap-3 text-xs font-semibold tracking-wider text-zinc-400">
                <a href="tel:7311164111" className="hover:text-white transition-colors flex items-center gap-2 px-2">
                  <Phone size={14} className="text-zinc-500" />
                  <span>Support: 7311164111</span>
                </a>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors py-1 flex items-center gap-2 px-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                  <span>About Astrides</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}