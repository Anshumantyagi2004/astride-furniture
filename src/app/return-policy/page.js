import dynamic from 'next/dynamic';

const ReturnPolicyPage = dynamic(() => import('@/components/pages/ReturnPolicy'), {
  loading: () => (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
    </div>
  )
});

export const metadata = {
  title: 'Return Policy — Astride Furniture',
  description: 'Guidelines on product return eligibility and replacement request timeline (48 hours).',
};

export default function ReturnPolicy() {
  return <ReturnPolicyPage />;
}
