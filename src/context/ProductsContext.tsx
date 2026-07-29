"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ProductsContextType {
  products: any[];
  loading: boolean;
}

const ProductsContext = createContext<ProductsContextType>({
  products: [],
  loading: true,
});

export function ProductsProvider({ children, initialProducts }: { children: ReactNode, initialProducts?: any[] }) {
  const [products, setProducts] = useState<any[]>(initialProducts || []);
  const [loading, setLoading] = useState<boolean>(!initialProducts);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("astride_nav_products_cache", JSON.stringify(initialProducts));
        } catch (e) {}
      }
      return;
    }

    let hasCache = false;
    try {
      const cached = sessionStorage.getItem("astride_nav_products_cache");
      if (cached) {
        setProducts(JSON.parse(cached));
        setLoading(false);
        hasCache = true;
      }
    } catch (e) {}

    async function fetchProducts() {
      try {
        const res = await fetch("/api/product");
        const data = await res.json();
        if (data?.success && data.products) {
          setProducts(data.products);
          if (typeof window !== "undefined") {
            try {
              sessionStorage.setItem("astride_nav_products_cache", JSON.stringify(data.products));
            } catch (e) {}
          }
        }
      } catch (err) {
        console.error("ProductsContext: Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    }

    if (!hasCache) {
      fetchProducts();
    }
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
