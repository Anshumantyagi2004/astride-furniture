import dynamic from 'next/dynamic';

const RefundPolicyPage = dynamic(() => import('@/components/pages/refundPolicy'), {
  loading: () => (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
    </div>
  )
});

export const metadata = {
  title: 'Refund Policy — Astride Furniture',
  description: 'Policy detailing our strict replacements-only guidelines for damaged or incorrect purchases.',
};

export default function RefundPolicy() {
  return <RefundPolicyPage />;
}
