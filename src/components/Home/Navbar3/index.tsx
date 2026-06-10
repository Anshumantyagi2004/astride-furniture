"use client";

import { useState, useEffect } from "react";
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
  "Bar Stools": {
    label: "Bar Stools",
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
        const fetchData = async () => {
            try {
                const catRes = await fetch("/api/category");
                const catData = await catRes.json();
                if (catData?.success) {
                    const mappedCats = catData.categories.map((cat: any) => {
                        if (cat.name === "Executive Chair") {
                            return { ...cat, name: "Office Chair" };
                        }
                        return cat;
                    });
                    setCategories(mappedCats);
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
    }, []);

    const navItems = [
        "Staff Chair",
        "Office Chair",
        "Gaming Chair",
        "Study Chair",
        "Bar Stools",
    ];

    // Find the category object that matches the hovered item (ignoring case)
    const activeCategoryObj = categories.find(
        (c) => c.name.toLowerCase().trim() === activeMenu?.toLowerCase().trim()
    );

    // Resolve which chairs to show: try dynamic API products first, fallback to static CHAIR_CATEGORIES
    let displayChairs: SeriesChair[] = [];
    if (activeMenu) {
        if (products.length > 0 && activeCategoryObj) {
            displayChairs = products
                .filter((p) => {
                    if (!p.category) return false;
                    const pCatId = typeof p.category === "object" ? p.category._id : p.category;
                    return pCatId === activeCategoryObj._id;
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

                    <nav className="hidden md:flex items-center gap-[22px]">
                        <Link href="#bulk" className="hover:text-lime-500 transition-colors">
                            Bulk orders
                        </Link>

                        <Link href="#faq" className="hover:text-lime-500 transition-colors">
                            Support
                        </Link>

                        <Link href="#about" className="hover:text-lime-500 transition-colors">
                            About
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
                        className="flex items-center gap-[10px] text-2xl tracking-[0.02em] font-bold text-slate-900"
                    >
                        <svg
                            viewBox="0 0 40 40"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.6}
                            strokeLinejoin="round"
                            className="w-[38px] h-[38px]"
                        >
                            <path d="M20 4 5 13v14l15 9 15-9V13L20 4z" />
                            <path d="M20 13l-7 4v7l7 4 7-4v-7l-7-4z" />
                        </svg>

                        <span>
                            ASTRIDE
                            <sup className="text-[10px] align-super">®</sup>
                        </span>
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

                        {/* Find Chair Button */}
                        <button
                            onClick={handleFindYourChair}
                            className="hidden md:inline-flex items-center rounded-full border border-slate-900 px-4 py-2 text-sm font-medium transition hover:bg-slate-900 hover:text-white cursor-pointer"
                        >
                            Find your chair
                        </button>

                        {/* Search */}
                        <Link
                            href="/products"
                            className="relative grid place-items-center text-slate-900 hover:text-slate-700 transition-colors"
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
                        </Link>

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
                {activeMenu && displayChairs.length > 0 && (
                  <div 
                    className="absolute left-0 top-full w-full bg-white border-b border-neutral-200 text-neutral-800 py-6 px-12 z-[900] shadow-xl animate-in fade-in slide-in-from-top-4 duration-300"
                    onMouseEnter={() => setActiveMenu(activeMenu)}
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                    <div className="max-w-4xl mx-auto">
                      <div className={`grid ${displayChairs.length === 2 ? 'grid-cols-2 max-w-2xl' : displayChairs.length === 1 ? 'grid-cols-1 max-w-xs' : 'grid-cols-3'} gap-8 mx-auto`}>
                        {displayChairs.map((chair, index) => (
                          <Link 
                            key={index}
                            href={chair.buyUrl}
                            onClick={() => setActiveMenu(null)}
                            className="flex flex-col items-center group relative cursor-pointer"
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
                                className="font-extrabold text-neutral-900 text-sm tracking-tight text-center group-hover:underline underline-offset-2 transition-all"
                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                              >
                                {chair.name}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
            </header>
        </>
    );
}