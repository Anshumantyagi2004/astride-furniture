import React from 'react'
import dynamic from 'next/dynamic'

const ProductPageHome = dynamic(() => import('@/components/prodcutPage/ProductPageHome'), {
  loading: () => (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
    </div>
  )
})

export default function page() {
    return (
        <ProductPageHome />
    )
}
