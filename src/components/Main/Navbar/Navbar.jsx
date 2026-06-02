"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Phone,
  ChevronDown,
  X,
  Menu,
} from "lucide-react";

import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Navbar() {
  const [hideTopBar, setHideTopBar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHideTopBar(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const router = useRouter();
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

  useEffect(() => {
    loadCart();

    const handleStorageChange = () => {
      loadCart();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('add-to-cart', handleStorageChange);
    window.addEventListener('astride_cart_updated', handleStorageChange);

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
        { name: 'ACE Pro Gaming', image: '/Png1/chair4_ACE.png', tag: 'Bestseller', buyUrl: '#buy', learnUrl: '#learn' },
        { name: 'Apex Gaming', image: '/Png1/chair9_FitWell.png', tag: 'Pro', buyUrl: '#buy', learnUrl: '#learn' },
        { name: 'RGB Gaming Chair', image: '/Product/InfographicDesign-1.webp', tag: 'Premium', buyUrl: '#buy', learnUrl: '#learn' }
      ]
    },
    'Executive Chair': {
      label: 'Executive Chair',
      chairs: [
        { name: 'AlphaGrey', image: '/Png1/chair6_AlphaGrey.png', tag: 'Premium Mesh', buyUrl: '#buy', learnUrl: '#learn' },
        { name: 'ErgoFit Executive', image: '/Png1/chair12_ErgoFit.png', tag: 'High Back', buyUrl: '#buy', learnUrl: '#learn' },
        { name: 'Executive Mesh Chair', image: '/Product/AlphaBrown_8.webp', tag: 'Bestseller', buyUrl: '#buy', learnUrl: '#learn' }
      ]
    },
    'Staff Chair': {
      label: 'Staff Chair',
      chairs: [
        { name: 'Delton Staff', image: '/Png1/Chair7_Delton.png', tag: 'Comfort', buyUrl: '#buy', learnUrl: '#learn' },
        { name: 'AIRSENSE Task', image: '/Png1/chair5_AIRSENSE.png', tag: 'Aero Mesh', buyUrl: '#buy', learnUrl: '#learn' },
        { name: 'Amica Black', image: '/Png1/Chair6a_Amica Black .png', tag: 'Classic', buyUrl: '#buy', learnUrl: '#learn' }
      ]
    },
    'Study Chair': {
      label: 'Study Chair',
      chairs: [
        { name: 'ErgoFit Pro', image: '/Product/1.webp', tag: 'Students', buyUrl: '#buy', learnUrl: '#learn' },
        { name: 'Comfort Office', image: '/Product/Infographic-6.webp', tag: 'Comfort', buyUrl: '#buy', learnUrl: '#learn' },
        { name: 'Modern Workspace', image: '/Product/InfographicDesign-1.webp', tag: 'Compact', buyUrl: '#buy', learnUrl: '#learn' }
      ]
    },
    'Bar Stool': {
      label: 'Bar Stool',
      chairs: [
        { name: 'Zenith Stool', image: '/Png1/chair10_FitWell.png', tag: 'Counter Stool', buyUrl: '#buy', learnUrl: '#learn' },
        { name: 'Apex Stool', image: '/Png1/chair9_FitWell.png', tag: 'Bestseller', buyUrl: '#buy', learnUrl: '#learn' },
        { name: 'Luxury Bar Stool', image: '/Product/AlphaBrown_8.webp', tag: 'Premium', buyUrl: '#buy', learnUrl: '#learn' }
      ]
    }
  };

  const CATEGORY_KEYS = ['Gaming Chair', 'Executive Chair', 'Staff Chair', 'Study Chair', 'Bar Stool'];
  const activeCategory = activeMenu ? CHAIR_CATEGORIES[activeMenu] : null;

  return (
    <header className="w-full font-[Barlow] sticky -top-1 z-[100] relative select-none" onMouseLeave={() => setActiveMenu(null)}>
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
            Tollfree Number 7311164111

            <span className="underline cursor-pointer ml-1 hover:text-[#FF6D29] transition-all duration-300">
              Call Now!
            </span>
          </p>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6 text-sm font-medium text-[#BABABA]">

            <button className="flex items-center gap-2 hover:text-[#FF6D29] transition-all duration-300">
              <Phone size={16} />
              Support
            </button>

            <button className="hover:text-[#FF6D29] transition-all duration-300">
              Help
            </button>
          </div>
        </div>
      </motion.div>

      <div className="bg-[#161316]/90 backdrop-blur-xl border-b border-[#453027] shadow-[0_0_40px_rgba(255,109,41,0.08)]">
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
            <button className="text-[#BABABA] hover:text-[#FF6D29] transition-all duration-300 hover:scale-110">
              <Heart size={24} strokeWidth={1.8} />
            </button>

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
              href={"/login"}
              className="text-[#BABABA] hover:text-[#FF6D29] transition-all duration-300 hover:scale-110"
            >
              <User size={24} strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-[#161316] border-b border-[#453027] shadow-sm hidden md:block">
        <div className="lg:px-15 px-4">

          {/* NAVIGATION */}
          <nav className="hidden md:flex items-center justify-center gap-10 pt-3 pb-4 overflow-x-auto whitespace-nowrap text-[17px] font-bold text-[#BABABA] scrollbar-hide">
            {CATEGORY_KEYS.map((category) => (
              <button
                key={category}
                onMouseEnter={() => setActiveMenu(category)}
                className={`relative group transition-all duration-300 px-3 py-1 uppercase tracking-wider text-sm font-black ${
                  activeMenu === category ? 'text-white' : 'text-[#BABABA] hover:text-white'
                }`}
              >
                <span>{category}</span>
                <span className={`absolute left-0 -bottom-1 h-[2px] bg-zinc-500 transition-all duration-300 ${
                  activeMenu === category ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      

      {/* MEGA MENU DROPDOWN */}
      {activeCategory && (
        <div className="absolute left-0 top-full w-full bg-[#f3f4f6] border-b border-gray-300 text-gray-900 py-8 px-12 z-[90] shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
          onMouseEnter={() => setActiveMenu(activeMenu)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-6 justify-items-center">
              {activeCategory.chairs.map((chair, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center group relative cursor-pointer w-full max-w-[150px]"
                >
                  {/* Visual Container */}
                  <div className="relative w-full aspect-square bg-white border border-gray-200 rounded-2xl flex items-center justify-center p-3 hover:bg-gray-50 group-hover:border-zinc-500 transition-all duration-300 shadow-sm">
                    <div className="relative w-[85%] h-[85%] transform group-hover:scale-105 transition-transform duration-500 ease-out flex items-center justify-center">
                      <Image
                        src={chair.image}
                        alt={chair.name}
                        fill
                        className="object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.15)]"
                        sizes="15vw"
                      />
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-2 flex flex-col items-center gap-1 w-full">
                    <span className="font-extrabold text-gray-900 text-xs tracking-tight text-center group-hover:text-zinc-700 transition-all">
                      {chair.name}
                    </span>
                    <div className="mt-0.5">
                      <Link
                        href={chair.buyUrl}
                        className="text-[10px] font-black text-gray-500 hover:text-zinc-900 underline underline-offset-4 decoration-zinc-400 hover:decoration-zinc-900 transition-colors uppercase tracking-wider"
                      >
                        Buy
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}