"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar3 from "@/components/Home/Navbar3";
import Footer from "@/components/Main/Footer/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // Silently strip Google Merchant auto-tagging query parameter (?srsltid=...) from URL bar
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.has("srsltid")) {
          url.searchParams.delete("srsltid");
          const newSearch = url.searchParams.toString();
          const cleanURL = url.pathname + (newSearch ? `?${newSearch}` : "");
          window.history.replaceState(window.history.state, "", cleanURL);
        }
      } catch (e) {
        console.error("Error cleaning URL parameter:", e);
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (isAdmin) return;

    // Restore scroll position
    const savedScroll = sessionStorage.getItem("scrollPosition_" + pathname);
    if (savedScroll) {
      const y = parseInt(savedScroll, 10);
      window.scrollTo(0, y);
      
      // Perform delayed scroll restoration to account for dynamic layout height adjustments
      const t1 = setTimeout(() => window.scrollTo(0, y), 100);
      const t2 = setTimeout(() => window.scrollTo(0, y), 350);
      const t3 = setTimeout(() => window.scrollTo(0, y), 700);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, isAdmin]);

  useEffect(() => {
    if (isAdmin) return;

    const handleScroll = () => {
      sessionStorage.setItem("scrollPosition_" + pathname, window.scrollY.toString());
    };

    window.addEventListener("scroll", handleScroll);
    
    // Save position before route changes / component unmounts
    return () => {
      sessionStorage.setItem("scrollPosition_" + pathname, window.scrollY.toString());
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, isAdmin]);

  return (
    <>
      {!isAdmin && <Navbar3 />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}
