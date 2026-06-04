import dynamic from 'next/dynamic';

const ShippingPolicyPage = dynamic(() => import('@/components/pages/shippingPolicy'), {
  loading: () => (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
    </div>
  )
});

export const metadata = {
  title: 'Shipping Policy — Astride Furniture',
  description: 'Timeline estimates and guidelines regarding order shipping and delivery.',
};

export default function ShippingPolicy() {
  return <ShippingPolicyPage />;
}
