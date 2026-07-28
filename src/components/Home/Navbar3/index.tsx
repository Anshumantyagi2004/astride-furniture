"use client";

import { useState, useEffect, useRef, useMemo, MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

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
        chairs: []
    }
};

const NAV_ITEMS = [
    "Staff Chair",
    "Office Chair",
    "Gaming Chair",
    "Study Chair",
    "Bar Stools & Cafe Chair",
];

// Helper outside component scope to prevent re-allocating memory during renders
const getNormalizedCategoryName = (p: any) => {
    if (!p?.category) return "";
    const rawName = typeof p.category === "object" && p.category.name ? p.category.name : "";
    const dbCategory = rawName.replace(/\s+/g, ' ').trim().toUpperCase();
    
    if (dbCategory.includes("GAMING") || dbCategory.includes("GAME")) return "Gaming Chair";
    if (dbCategory.includes("EXECUTIVE")) return "Office Chair";
    if (dbCategory.includes("STAFF")) return "Staff Chair";
    if (dbCategory.includes("STUDY")) return "Study Chair";
    if (dbCategory.includes("BAR") || dbCategory.includes("STOOL") || dbCategory.includes("CAFE")) return "Bar Stools & Cafe Chair";
    if (dbCategory.includes("OFFICE") || dbCategory.includes("TASK") || dbCategory.includes("ERGO")) return "Office Chair";
    return "";
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

    const handleFindYourChair = (e: MouseEvent) => {
        e.preventDefault();
        if (pathname === "/") {
            const el = document.getElementById("circular-chairs");
            if (el) el.scrollIntoView({ behavior: "smooth" });
            window.dispatchEvent(new Event("open-chair-finder"));
        } else {
            router.push("/?finder=true");
        }
    };

    // 1. Optimized Cart Syncer
    useEffect(() => {
        const updateCartCount = () => {
            const savedCart = localStorage.getItem('astride_cart');
            if (!savedCart) {
                setCartCount(0);
                return;
            }
            try {
                const items = JSON.parse(savedCart);
                let count = 0;
                for (let i = 0; i < items.length; i++) {
                    count += items[i].quantity || 1;
                }
                setCartCount(count);
            } catch (e) {
                console.error('Error parsing cart items in Navbar:', e);
            }
        };
        updateCartCount();
        window.addEventListener('astride_cart_updated', updateCartCount);
        return () => window.removeEventListener('astride_cart_updated', updateCartCount);
    }, []);

    // 2. Fetch Data with Session Storage Instantly
    useEffect(() => {
        try {
            const cachedCats = sessionStorage.getItem("astride_nav_categories_cache");
            const cachedProds = sessionStorage.getItem("astride_nav_products_cache");
            if (cachedCats) setCategories(JSON.parse(cachedCats));
            if (cachedProds) setProducts(JSON.parse(cachedProds));
        } catch (e) {
            console.error("Error loading navbar cache:", e);
        }

        let isMounted = true;
        const fetchData = async () => {
            try {
                const timestamp = Date.now();
                const [catRes, prodRes] = await Promise.all([
                    fetch(`/api/category?t=${timestamp}`, { cache: "no-store", headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }),
                    fetch(`/api/product?t=${timestamp}`, { cache: "no-store", headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
                ]);
                const [catData, prodData] = await Promise.all([
                    catRes.json(),
                    prodRes.json()
                ]);

                if (!isMounted) return;

                if (catData?.success) {
                    const mappedCats = catData.categories.map((cat: any) => {
                        // Normalize whitespace first
                        const cleanName = cat.name.replace(/\s+/g, ' ').trim();
                        const upperName = cleanName.toUpperCase();
                        
                        // Map to standard display names
                        if (upperName.includes("EXECUTIVE")) return { ...cat, name: "Office Chair" };
                        if (upperName.includes("BAR") || upperName.includes("STOOL") || upperName.includes("CAFE")) {
                            return { ...cat, name: "Bar Stools & Cafe Chair" };
                        }
                        return { ...cat, name: cleanName };
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
        
        return () => { 
            isMounted = false;
        };
    }, []);

    // 2. Memoized Dynamic Navigation Items (Uses categories from state)
    const navItems = useMemo(() => {
        if (categories.length > 0) {
            return categories.map((cat: any) => cat.name);
        }
        // Fallback to hardcoded items if categories not loaded
        return [
            "Staff Chair",
            "Office Chair",
            "Gaming Chair",
            "Study Chair",
            "Bar Stools & Cafe Chair",
        ];
    }, [categories]);

    // 3. Memoized Dynamic Mega Dropdown Chairs (Reduces heavy computations on hover)
    const displayChairs = useMemo<SeriesChair[]>(() => {
        if (!activeMenu) return [];

        if (products.length > 0) {
            const filtered = products
                .filter((p) => getNormalizedCategoryName(p) === activeMenu)
                .map((p) => ({
                    name: p.productName,
                    image: p.colorVariants?.[0]?.images?.[0]?.url || "/placeholder.png",
                    buyUrl: `/products/${p.slug}`,
                    tag: p.whychoose || "",
                }));
            if (filtered.length > 0) return filtered;
        }

        const staticKey = Object.keys(CHAIR_CATEGORIES).find(
            (k) => k.toLowerCase().replace("s", "") === activeMenu.toLowerCase().replace("s", "")
        );
        return staticKey ? CHAIR_CATEGORIES[staticKey].chairs : [];
    }, [activeMenu, products]);

    // 4. Highly Optimized Memoized Suggestion Filter (No execution lag when typing)
    const suggestions = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return [];

        let itemsToSearch = products;
        if (!products || products.length === 0) {
            itemsToSearch = Object.values(CHAIR_CATEGORIES).flatMap(cat => cat.chairs).map(chair => ({
                _id: chair.name,
                productName: chair.name,
                realPrice: "See price in cart",
                image: chair.image,
                slug: chair.buyUrl.replace("/products/", "")
            }));
        }

        const result: any[] = [];
        for (let i = 0; i < itemsToSearch.length; i++) {
            const p = itemsToSearch[i];
            if (!p) continue;
            const name = (p.productName || p.name || "").toLowerCase();
            if (name.includes(query)) {
                result.push(p);
                if (result.length >= 6) break; // Early termination out of loop if maximum items matched
            }
        }
        return result;
    }, [searchQuery, products]);

    const handleSuggestionClick = (p: any) => {
        setSearchQuery("");
        setIsSearchExpanded(false);
        const targetSlug = p.slug || p._id;
        if (targetSlug) {
            router.push(`/products/${targetSlug}`);
        } else {
            router.push(`/products`);
        }
    };

    return (
        <>
            {/* Top Bar */}
            <div className="bg-slate-900 text-white text-[13px] font-medium py-[9px] font-sans">
                <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 flex items-center justify-between gap-4">
                    <a
                        href="tel:+917311164111"
                        className="block cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        {"Tollfree "}<span className="text-lime-500 font-bold">7311164111</span>{" — Call now!"}
                    </a>



                    <nav className="flex items-center gap-[16px] md:gap-[22px]">
                        <Link href="/bulk-orders" className="hidden sm:inline hover:text-lime-500 transition-colors">
                            Bulk orders
                        </Link>
                        <Link href="/contact" className="hidden sm:inline hover:text-lime-500 transition-colors">
                            Support
                        </Link>
                        <button
                            onClick={handleFindYourChair}
                            className="hover:text-lime-500 transition-colors cursor-pointer bg-transparent border-0 text-[13px] font-medium text-white p-0"
                        >
                            Find chair
                        </button>
                        <Link href="/account" className="hover:text-lime-500 transition-colors">
                            Profile
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Header */}
            <header
                className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-2 border-slate-900 font-sans"
                onMouseLeave={() => setActiveMenu(null)}
            >
                <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 py-[14px] flex items-center justify-between gap-6 relative">

                    {/* Logo */}
                    <Link href="/" aria-label="Astride home" className="flex items-center shrink-0">
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
                                className="relative py-[6px] text-[15.5px] font-semibold tracking-[0.04em] text-slate-800 hover:text-slate-950 transition-colors after:absolute after:left-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-gradient-to-r after:from-[#8B5CF6] after:to-[#FF7A1A] after:transition-all after:duration-300 after:w-0 hover:after:w-full"
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
                                if (searchQuery === "") setIsSearchExpanded(false);
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
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-[22px] h-[22px]">
                                    <circle cx="11" cy="11" r="7" />
                                    <path d="m20 20-3.5-3.5" />
                                </svg>
                            </button>

                            {/* Suggestions Dropdown */}
                            {searchQuery.trim() !== "" && isSearchExpanded && (
                                <div className="absolute top-full right-0 mt-2 w-64 md:w-72 bg-white border border-slate-200 rounded-xl shadow-xl max-h-[300px] overflow-y-auto py-1 z-50">
                                    {suggestions.length > 0 ? (
                                        suggestions.map((p: any) => (
                                            <button
                                                key={p.slug || p._id || p.productName}
                                                onClick={() => handleSuggestionClick(p)}
                                                className="w-full px-3 py-2 flex items-center gap-3 hover:bg-slate-50 border-b border-slate-100 last:border-b-0 text-left transition-colors cursor-pointer group"
                                            >
                                                <div className="relative w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center shrink-0 border border-slate-200/60 overflow-hidden">
                                                    <Image
                                                        src={p.image || p.colorVariants?.[0]?.images?.[0]?.url || "/placeholder.png"}
                                                        alt={p.productName}
                                                        fill
                                                        className="object-contain p-0.5"
                                                        unoptimized
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[12px] font-bold text-slate-800 truncate leading-tight group-hover:text-orange-500 transition-colors">
                                                        {p.productName}
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                                                        {typeof p.realPrice === 'number' ? `₹${p.realPrice.toLocaleString()}` : p.realPrice}
                                                    </p>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-xs text-slate-500 text-center font-medium">
                                            No products found
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Wishlist */}
                        <Link href="/wishlist" className="relative grid place-items-center text-slate-900 hover:text-slate-700 transition-colors" aria-label="Wishlist">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-[22px] h-[22px]">
                                <path d="M12 21s-7.5-4.8-9.5-9C1 8.5 3 5 6.5 5c2 0 3.5 1 4.5 2.5C12 6 13.5 5 15.5 5 19 5 21 8.5 20.5 12c-2 4.2-8.5 9-8.5 9z" />
                            </svg>
                        </Link>

                        {/* Cart */}
                        <button
                            onClick={() => window.dispatchEvent(new Event('open-cart-sidebar'))}
                            className="relative grid place-items-center text-slate-900 hover:text-slate-700 transition-colors cursor-pointer"
                            aria-label={`Cart, ${cartCount} items`}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-[22px] h-[22px]">
                                <circle cx="9" cy="20" r="1.6" />
                                <circle cx="17" cy="20" r="1.6" />
                                <path d="M3 4h2l2.4 11h10.2L20 7H6" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-2 flex h-[17px] w-[17px] items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Button */}
                        <button className="lg:hidden" aria-label="Menu" onClick={() => setIsOpen(!isOpen)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} className="w-[26px] h-[26px]">
                                <path d="M4 7h16M4 12h16M4 17h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isOpen && (
                        <nav className="absolute left-0 right-0 top-full flex flex-col gap-4 border-b-2 border-slate-900 bg-white px-5 py-5 lg:hidden shadow-xl">
                            {navItems.map((item) => (
                                <Link
                                    key={item}
                                    href={`/products?category=${encodeURIComponent(item)}`}
                                    className="font-semibold text-slate-800 hover:text-black"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item}
                                </Link>
                            ))}

                            {/* Contact & Inquiry Buttons inside Mobile Menu */}
                            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 mt-1">
                                <Link
                                    href="/contact"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center py-2.5 px-3 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 text-center transition-colors"
                                >
                                    Contact Us
                                </Link>
                                <Link
                                    href="/inquiry"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center py-2.5 px-3 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 text-center transition-colors"
                                >
                                    Bulk Inquiries
                                </Link>
                            </div>
                        </nav>
                    )}
                </div>

                {/* Dropdown Mega Menus */}
                {activeMenu && displayChairs.length > 0 && (
                    <div
                        className="absolute left-0 top-full w-full bg-white border-b border-neutral-200 text-neutral-800 py-6 px-12 z-[900] shadow-xl"
                        onMouseEnter={() => setActiveMenu(activeMenu)}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <div className="max-w-5xl mx-auto relative px-12">
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

                                        <div className="mt-3 flex flex-col items-center gap-1 w-full">
                                            <span className="font-extrabold text-[#131313] text-sm tracking-tight text-center group-hover:underline underline-offset-2 transition-all">
                                                {chair.name}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>

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