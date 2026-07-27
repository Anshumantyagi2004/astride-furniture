import { Suspense } from 'react';
import TrackOrderPage from '@/components/TrackOrderPage';

export const metadata = {
  title: 'Track Order | Astride Furniture',
  description: 'Track your Astride Furniture orders easily using your phone number.',
};

export default function TrackOrder() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <TrackOrderPage />
    </Suspense>
  );
}