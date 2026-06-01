import React from 'react';
import DetailPageCard from './deatilPageCard';

export default function DetailPage({ productId }: { productId?: string }) {
  return (
    <div className="w-full bg-white">
      <DetailPageCard productId={productId} />
    </div>
  );
}
