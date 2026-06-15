"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

interface SeriesChair {
  name: string;
  image: string;
  tag?: string;
  buyUrl: string;
}

interface ChairCategory {
  label: string;
  chairs: SeriesChair[];
}

const CHAIR_CATEGORIES: Record<string, ChairCategory> = {
  "Staff Chair": {
    label: "Staff Chair",
    chairs: [
      { name: "Delton Staff", image: "/Png1/Chair7_Delton.webp", tag: "Comfort", buyUrl: "/products/chair7-delton" },
      { name: "AIRSENSE Task", image: "/Png1/chair5_AIRSENSE.webp", tag: "Aero Mesh", buyUrl: "/products/chair5-airsense" },
      { name: "Amica Black", image: "/Png1/Chair6a_Amica Black .webp", tag: "Classic", buyUrl: "/products/chair6a-amica-black" }
    ]
  },
  "Office Chair": {
    label: "Office Chair",
    chairs: [
      { name: "AlphaGrey", image: "/Png1/chair6_AlphaGrey.webp", tag: "Premium Mesh", buyUrl: "/products/chair6-alphagrey" },
      { name: "ErgoFit Executive", image: "/Png1/chair12_ErgoFit.webp", tag: "High Back", buyUrl: "/products/chair12-ergofit" },
      { name: "ACE Pro", image: "/Png1/chair4_ACE.webp", tag: "Bestseller", buyUrl: "/products/chair4-ace" }
    ]
  },
  "Gaming Chair": {
    label: "Gaming Chair",
    chairs: [
      { name: "ACE Pro Gaming", image: "/Png1/chair4_ACE.webp", tag: "Bestseller", buyUrl: "/products/chair4-ace" },
      { name: "Apex Gaming", image: "/Png1/chair9_FitWell.webp", tag: "Pro", buyUrl: "/products/chair9-fitwell" },
      { name: "Zenith Stool", image: "/Png1/chair10_FitWell.webp", tag: "Premium", buyUrl: "/products/chair10-fitwell" }
    ]
  },
  "Study Chair": {
    label: "Study Chair",
    chairs: [
      { name: "AIRSENSE Task", image: "/Png1/chair5_AIRSENSE.webp", tag: "Aero Mesh", buyUrl: "/products/chair5-airsense" },
      { name: "Delton Staff", image: "/Png1/Chair7_Delton.webp", tag: "Comfort", buyUrl: "/products/chair7-delton" },
      { name: "ErgoFit Executive", image: "/Png1/chair12_ErgoFit.webp", tag: "Premium", buyUrl: "/products/chair12-ergofit" }
    ]
  },
  "Bar Stools & Cafe Chair": {
    label: "Bar Stools & Cafe Chair",
    chairs: [
      { name: "Zenith Stool", image: "/Png1/chair10_FitWell.webp", tag: "Counter Stool", buyUrl: "/products/chair10-fitwell" },
      { name: "Apex Stool", image: "/Png1/chair9_FitWell.webp", tag: "Bestseller", buyUrl: "/products/chair9-fitwell" }
    ]
  }
};

export default function Navbar3() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [cartCount, setCartCount] = useState(0);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownScrollRef = useRef<HTMLDivElement>(null);

    const scrollDropdown = (dir: "left" | "right") => {
        if (!dropdownScrollRef.current) return;
        dropdownScrollRef.current.scrollBy({
            left: dir === "right" ? 234 : -234,
            behavior: "smooth"
        });
    };

    const handleFindYourChair = (e: React.MouseEvent) => {
        e.preventDefault();
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

    useEffect(() => {
        const updateCartCount = () => {
            const savedCart = localStorage.getItem('astride_cart');
            if (savedCart) {
                try {
                    const items = JSON.parse(savedCart);
                    const count = items.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
                    setCartCount(count);
                } catch (e) {
                    console.error('Error parsing cart items in Navbar:', e);
                }
            } else {
                setCartCount(0);
            }
        };
        updateCartCount();
        window.addEventListener('astride_cart_updated', updateCartCount);
        return () => window.removeEventListener('astride_cart_updated', updateCartCount);
    }, []);

    useEffect(() => {
        // 1. Try loading categories and products from cache instantly
        try {
            const cachedCats = sessionStorage.getItem("astride_nav_categories_cache");
            const cachedProds = sessionStorage.getItem("astride_nav_products_cache");
            if (cachedCats) {
                setCategories(JSON.parse(cachedCats));
            }
            if (cachedProds) {
                setProducts(JSON.parse(cachedProds));
            }
        } catch (e) {
            console.error("Error loading navbar cache:", e);
        }

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
                    const mappedCats = catData.categories.map((cat: any) => {
                        if (cat.name === "Executive Chair") {
                            return { ...cat, name: "Office Chair" };
                        }
                        if (cat.name === "Bar Stool" || cat.name === "Bar Stools") {
                            return { ...cat, name: "Bar Stools & Cafe Chair" };
                        }
                        return cat;
                    });
                    setCategories(mappedCats);
                    sessionStorage.setItem("astride_nav_categories_cache", JSON.stringify(mappedCats));
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
    }, []);

    const navItems = [
        "Staff Chair",
        "Office Chair",
        "Gaming Chair",
        "Study Chair",
        "Bar Stools & Cafe Chair",
    ];

    const getNormalizedCategoryName = (p: any) => {
        if (!p.category) return "";
        const dbCategory = typeof p.category === "object" && p.category.name ? p.category.name.toUpperCase() : "";
        if (dbCategory.includes("GAMING") || dbCategory.includes("GAME")) {
            return "Gaming Chair";
        }
        if (dbCategory.includes("EXECUTIVE")) {
            return "Office Chair";
        }
        if (dbCategory.includes("STAFF")) {
            return "Staff Chair";
        }
        if (dbCategory.includes("STUDY")) {
            return "Study Chair";
        }
        if (dbCategory.includes("BAR") || dbCategory.includes("STOOL") || dbCategory.includes("CAFE")) {
            return "Bar Stools & Cafe Chair";
        }
        if (dbCategory.includes("OFFICE") || dbCategory.includes("TASK") || dbCategory.includes("ERGO")) {
            return "Office Chair";
        }
        return "";
    };

    // Resolve which chairs to show: try dynamic API products first, fallback to static CHAIR_CATEGORIES
    let displayChairs: SeriesChair[] = [];
    if (activeMenu) {
        if (products.length > 0) {
            displayChairs = products
                .filter((p) => {
                    const normalizedCat = getNormalizedCategoryName(p);
                    return normalizedCat === activeMenu;
                })
                .map((p) => ({
                    name: p.productName,
                    image: p.colorVariants?.[0]?.images?.[0]?.url || "/placeholder.png",
                    buyUrl: `/products/${p.slug}`,
                    tag: p.whychoose || "",
                }));
        }

        // Fallback to static lists if no matches are found in the dynamic list
        if (displayChairs.length === 0) {
            // Check for match (normalizing "Bar Stools" and "Bar Stool")
            const staticKey = Object.keys(CHAIR_CATEGORIES).find(
                (k) => k.toLowerCase().replace("s", "") === activeMenu.toLowerCase().replace("s", "")
            );
            if (staticKey) {
                displayChairs = CHAIR_CATEGORIES[staticKey].chairs;
            }
        }
    }

    return (
        <>
            {/* Top Bar */}
            <div className={`bg-slate-900 text-white text-[13px] font-medium py-[9px] ${sans.className}`}>
                <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 flex items-center justify-between gap-4">
                    <div>
                        Tollfree{" "}
                        <span className="text-lime-500 font-bold">
                            7311164111
                        </span>{" "}
                        — Call now!
                    </div>

                    <div className="hidden md:block text-slate-300 text-[12px] tracking-wider uppercase font-semibold">
                        GST: <span className="font-bold text-white">07AALCM4232E1ZN</span>
                    </div>

                    <nav className="flex items-center gap-[16px] md:gap-[22px]">
                        <Link href="/bulk-orders" className="hidden sm:inline hover:text-lime-500 transition-colors">
                            Bulk orders
                        </Link>

                        <Link href="/contact" className="hidden sm:inline hover:text-lime-500 transition-colors">
                            Support
                        </Link>

                        <Link href="/account" className="hover:text-lime-500 transition-colors">
                            Profile
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Header */}
            <header 
                className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-2 border-slate-900 ${sans.className}`}
                onMouseLeave={() => setActiveMenu(null)}
            >
                <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 py-[14px] flex items-center justify-between gap-6 relative">

                    {/* Logo */}
                    <Link
                        href="/"
                        aria-label="Astride home"
                        className="flex items-center shrink-0"
                    >
                        <Image
                            src="/logo.webp"
                            alt="Astride"
                            width={170}
                            height={80}
                            className="h-10 md:h-14 w-auto object-contain"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item}
                                href={`/products?category=${encodeURIComponent(item)}`}
                                onMouseEnter={() => setActiveMenu(item)}
                                className={`
                                    relative py-[6px] text-[15.5px] font-semibold tracking-[0.04em] text-slate-800 hover:text-slate-950 transition-colors
                                    after:absolute after:left-0 after:bottom-0
                                    after:h-[3px] after:rounded-full
                                    after:bg-gradient-to-r
                                    after:from-[#8B5CF6]
                                    after:to-[#FF7A1A]
                                    after:transition-all after:duration-300
                                    after:w-0 hover:after:w-full
                                `}
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side */}
                    <div className="flex items-center gap-[18px]">

                        {/* Search */}
                        <div 
                            className="relative flex items-center bg-transparent transition-all duration-300 rounded-full"
                            onMouseEnter={() => setIsSearchExpanded(true)}
                            onMouseLeave={() => {
                                if (searchQuery === "") {
                                    setIsSearchExpanded(false);
                                }
                            }}
                        >
                            <div className={`relative overflow-hidden transition-all duration-350 flex items-center ease-in-out ${isSearchExpanded ? 'w-36 md:w-44 pl-1.5 pr-0.5 opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                                        }
                                    }}
                                    className="w-full bg-slate-100 border border-slate-200 rounded-full pl-3 pr-7 py-1 text-xs outline-none text-slate-800 font-medium placeholder:text-slate-400"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setIsSearchExpanded(false);
                                        }}
                                        className="absolute right-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                        aria-label="Clear search"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
                                            <path d="M18 6L6 18M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    if (searchQuery.trim() !== "") {
                                        router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                                    } else {
                                        setIsSearchExpanded(!isSearchExpanded);
                                    }
                                }}
                                className="relative grid place-items-center text-slate-900 hover:text-slate-700 transition-colors shrink-0 cursor-pointer"
                                aria-label="Search"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2.2}
                                    className="w-[22px] h-[22px]"
                                >
                                    <circle cx="11" cy="11" r="7" />
                                    <path d="m20 20-3.5-3.5" />
                                </svg>
                            </button>
                        </div>

                        {/* Wishlist */}
                        <Link
                            href="/wishlist"
                            className="relative grid place-items-center text-slate-900 hover:text-slate-700 transition-colors"
                            aria-label="Wishlist"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.2}
                                className="w-[22px] h-[22px]"
                            >
                                <path d="M12 21s-7.5-4.8-9.5-9C1 8.5 3 5 6.5 5c2 0 3.5 1 4.5 2.5C12 6 13.5 5 15.5 5 19 5 21 8.5 20.5 12c-2 4.2-8.5 9-8.5 9z" />
                            </svg>
                        </Link>

                        {/* Cart */}
                        <button
                            onClick={() => window.dispatchEvent(new Event('open-cart-sidebar'))}
                            className="relative grid place-items-center text-slate-900 hover:text-slate-700 transition-colors cursor-pointer"
                            aria-label={`Cart, ${cartCount} items`}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.2}
                                className="w-[22px] h-[22px]"
                            >
                                <circle cx="9" cy="20" r="1.6" />
                                <circle cx="17" cy="20" r="1.6" />
                                <path d="M3 4h2l2.4 11h10.2L20 7H6" />
                            </svg>

                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-2 flex h-[17px] w-[17px] items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white animate-pulse">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden"
                            aria-label="Menu"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.4}
                                className="w-[26px] h-[26px]"
                            >
                                <path d="M4 7h16M4 12h16M4 17h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isOpen && (
                        <nav className="absolute left-0 right-0 top-full flex flex-col gap-4 border-b-2 border-slate-900 bg-white px-5 py-5 lg:hidden">
                            {navItems.map((item) => (
                                <Link
                                    key={item}
                                    href={`/products?category=${encodeURIComponent(item)}`}
                                    className="font-semibold"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item}
                                </Link>
                            ))}
                        </nav>
                    )}
                </div>

                {/* Dropdown Mega Menus (similar to Navbar2 but styled for Navbar3 and dynamic) */}
                {/* Dropdown Mega Menus (similar to Navbar2 but styled for Navbar3 and dynamic) */}
                {activeMenu && displayChairs.length > 0 && (
                  <div 
                    className="absolute left-0 top-full w-full bg-white border-b border-neutral-200 text-neutral-800 py-6 px-12 z-[900] shadow-xl animate-in fade-in slide-in-from-top-4 duration-300"
                    onMouseEnter={() => setActiveMenu(activeMenu)}
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                    <div className="max-w-5xl mx-auto relative px-12">
                      {/* Left Arrow Button */}
                      {displayChairs.length > 4 && (
                        <button
                          onClick={() => scrollDropdown("left")}
                          className="absolute -left-1 top-[108px] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border-[2px] border-[#131313] shadow-[2px_2px_0_#131313] flex items-center justify-center hover:bg-[#f0f0f0] transition-colors"
                          aria-label="Scroll left"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="#131313" strokeWidth="2.5" className="w-4 h-4">
                            <path d="M15 18l-6-6 6-6" />
                          </svg>
                        </button>
                      )}

                      <div 
                        ref={dropdownScrollRef}
                        className={`flex gap-6 overflow-x-auto scrollbar-none py-2 snap-x snap-mandatory ${displayChairs.length <= 4 ? 'justify-center' : 'justify-start'}`}
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                      >
                        {displayChairs.map((chair, index) => (
                          <Link 
                            key={index}
                            href={chair.buyUrl}
                            onClick={() => setActiveMenu(null)}
                            className="w-[210px] flex-shrink-0 flex flex-col items-center group relative cursor-pointer snap-start"
                          >
                            {/* Visual Container */}
                            <div className="relative w-full aspect-[4/3.2] bg-neutral-50 border border-neutral-200 rounded-2xl flex items-center justify-center p-4 group-hover:bg-neutral-100 group-hover:border-neutral-300 transition-all duration-300">
                              <div className="relative w-[90%] h-[90%] transform group-hover:scale-105 transition-transform duration-500 ease-out flex items-center justify-center">
                                <Image
                                  src={chair.image}
                                  alt={chair.name}
                                  fill
                                  className="object-contain drop-shadow-md"
                                  sizes="18vw"
                                />
                              </div>
                            </div>

                            {/* Metadata */}
                            <div className="mt-3 flex flex-col items-center gap-1 w-full">
                              <span 
                                className="font-extrabold text-[#131313] text-sm tracking-tight text-center group-hover:underline underline-offset-2 transition-all"
                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                              >
                                {chair.name}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* Right Arrow Button */}
                      {displayChairs.length > 4 && (
                        <button
                          onClick={() => scrollDropdown("right")}
                          className="absolute -right-1 top-[108px] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border-[2px] border-[#131313] shadow-[2px_2px_0_#131313] flex items-center justify-center hover:bg-[#f0f0f0] transition-colors"
                          aria-label="Scroll right"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="#131313" strokeWidth="2.5" className="w-4 h-4">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                )}
            </header>
        </>
    );
}