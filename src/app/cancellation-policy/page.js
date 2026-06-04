import dynamic from 'next/dynamic';

const CancellationPolicyPage = dynamic(() => import('@/components/pages/cancellationPolicy'), {
  loading: () => (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
    </div>
  )
});

export const metadata = {
  title: 'Cancellation Policy — Astride Furniture',
  description: 'Policy outlining the 24-hour order cancellation window and procedures.',
};

export default function CancellationPolicy() {
  return <CancellationPolicyPage />;
}
