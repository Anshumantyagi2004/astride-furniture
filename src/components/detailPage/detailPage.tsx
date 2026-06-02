import React from 'react';
import DetailPageCard from './deatilPageCard';
import Reviews from '../Home/Reviews';

export default function DetailPage({ productId }: { productId?: string }) {
  return (
    <div className="w-full bg-white">
      <DetailPageCard productId={productId} />
      <Reviews/>
    </div>
  );
}
