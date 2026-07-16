"use client";

// Intercept fetch to deduplicate parallel API calls and cache results for 5 minutes
if (typeof window !== "undefined" && !window.fetch.__deduped) {
  const originalFetch = window.fetch;
  const pendingRequests = new Map();
  const resolvedCache = new Map();

  window.fetch = function (input, init) {
    const method = (init && init.method) || "GET";
    if (method.toUpperCase() !== "GET") {
      return originalFetch.apply(this, arguments);
    }

    let urlString = "";
    if (typeof input === "string") {
      urlString = input;
    } else if (input instanceof URL) {
      urlString = input.href;
    } else if (input && typeof input === "object" && input.url) {
      urlString = input.url;
    }

    const isProductApi = urlString.includes("/api/product");
    const isCategoryApi = urlString.includes("/api/category");

    if (isProductApi || isCategoryApi) {
      const cleanUrl = urlString.split("?")[0];

      if (resolvedCache.has(cleanUrl)) {
        return Promise.resolve(resolvedCache.get(cleanUrl).clone());
      }

      if (pendingRequests.has(cleanUrl)) {
        return pendingRequests.get(cleanUrl).then((res) => res.clone());
      }

      const promise = originalFetch.apply(this, arguments)
        .then((response) => {
          pendingRequests.delete(cleanUrl);
          if (response.ok) {
            const responseClone = response.clone();
            resolvedCache.set(cleanUrl, responseClone);
            setTimeout(() => {
              resolvedCache.delete(cleanUrl);
            }, 300000); // cache for 5 minutes
          }
          return response;
        })
        .catch((err) => {
          pendingRequests.delete(cleanUrl);
          throw err;
        });

      pendingRequests.set(cleanUrl, promise);
      return promise.then((res) => res.clone());
    }

    return originalFetch.apply(this, arguments);
  };
  window.fetch.__deduped = true;
}

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

  // iOS overscroll bounce background fix — page-specific
  // Sets the html element background to match each page's top color
  // so iOS Safari shows the correct color during rubber-band bounce at top
  useEffect(() => {
    if (pathname === "/") {
      document.documentElement.style.backgroundColor = "#080808";
    } else {
      document.documentElement.style.backgroundColor = "#ffffff";
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

    let timeoutId;

    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        sessionStorage.setItem("scrollPosition_" + pathname, window.scrollY.toString());
      }, 150); // 150ms debounce
    };

    window.addEventListener("scroll", handleScroll);
    
    // Save position before route changes / component unmounts
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
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
