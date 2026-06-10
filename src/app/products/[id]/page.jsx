"use client";

import React from 'react';
import dynamic from 'next/dynamic';

import Loader from "@/components/ui/loader";

const DetailPage = dynamic(() => import('@/components/detailPage/detailPage'), {
  loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader />
    </div>
  )
});

export default function ProductDetailPage({ params }) {
  const unwrappedParams = React.use ? React.use(params) : params;
  const productId = unwrappedParams?.id;

  return (
    <div className="min-h-screen bg-white pt-0 pb-12">
      <DetailPage productId={productId} />
    </div>
  );
}
