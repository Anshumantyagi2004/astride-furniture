import { Suspense } from 'react';
import CheckoutPage from '../../components/CheckoutPage';

export const metadata = {
  title: 'Checkout | Astride Furniture',
  description: 'Complete your purchase securely.',
};

export default function Checkout() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-sans font-bold text-neutral-500 uppercase tracking-widest">Loading checkout...</div>}>
      <CheckoutPage />
    </Suspense>
  );
}
