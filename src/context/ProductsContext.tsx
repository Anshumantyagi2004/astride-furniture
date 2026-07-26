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

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/product");
        const data = await res.json();
        if (data?.success && data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("ProductsContext: Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
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
