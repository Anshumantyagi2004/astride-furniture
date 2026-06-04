"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const DetailPage = dynamic(() => import('@/components/detailPage/detailPage'), {
  loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
    </div>
  )
});

export default function ProductDetailPage({ params }) {
  const unwrappedParams = React.use ? React.use(params) : params;
  const productId = unwrappedParams?.id;

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <DetailPage productId={productId} />
    </div>
  );
}
