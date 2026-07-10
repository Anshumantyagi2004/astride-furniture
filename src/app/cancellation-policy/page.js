import dynamic from 'next/dynamic';

const CancellationPolicyPage = dynamic(() => import('@/components/pages/cancellationPolicy'), {
  loading: () => (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
    </div>
  )
});

export const metadata = {
  title: "ASTRIDE® Cancellation Policy | Order Cancellation & Refund Information",
  description: "Read the ASTRIDE® Cancellation Policy to understand order cancellation terms, eligibility, refund processing, modifications, and important guidelines for office chairs, gaming chairs, bar stools, and office furniture purchases.",
};

export default function CancellationPolicy() {
  return <CancellationPolicyPage />;
}
