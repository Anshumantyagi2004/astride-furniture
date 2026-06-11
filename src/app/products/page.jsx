import React from 'react'
import dynamic from 'next/dynamic'
import Loader from "@/components/ui/loader";

const ProductPageHome = dynamic(() => import('@/components/prodcutPage/ProductPageHome'), {
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
