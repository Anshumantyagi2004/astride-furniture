"use client";

import React from 'react';
import DetailPage from '@/components/detailPage/detailPage';

export default function ProductDetailPage({ params }) {
  const unwrappedParams = React.use ? React.use(params) : params;
  const productId = unwrappedParams?.id;

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <DetailPage productId={productId} />
    </div>
  );
}
