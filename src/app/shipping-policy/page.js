import dynamic from 'next/dynamic';

const ShippingPolicyPage = dynamic(() => import('@/components/pages/shippingPolicy'), {
  loading: () => (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
    </div>
  )
});

export const metadata = {
  title: "ASTRIDE® Shipping Policy | Delivery Information for Office Furniture",
  description: "Read the ASTRIDE® Shipping Policy for details on order processing, shipping timelines, delivery methods, tracking, service areas, and important information for office chairs, gaming chairs, bar stools, and office furniture orders.",
};


export default function ShippingPolicy() {
  return <ShippingPolicyPage />;
}
