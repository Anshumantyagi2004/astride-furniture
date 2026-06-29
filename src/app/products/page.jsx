import React from 'react'
import dynamicImport from 'next/dynamic'
import Loader from "@/components/ui/loader";

// Force dynamic rendering to always fetch fresh product data
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ADD METADATA FOR THE PRODUCTS PAGE:
export const metadata = {
    title: "Shop Premium Ergonomic Chairs | Astride",
    description: "Explore our full collection of premium ergonomic office chairs, gaming chairs, study chairs, and bar stools engineered for ultimate comfort.",
};



const ProductPageHome = dynamicImport(() => import('@/components/prodcutPage/ProductPageHome'), {
  loading: () => (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
      <Loader />
    </div>
  )
})

export default function page() {
    return (
        <ProductPageHome />
    )
}
