import dynamic from 'next/dynamic';

const RefundPolicyPage = dynamic(() => import('@/components/pages/refundPolicy'), {
  loading: () => (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
    </div>
  )
});

export const metadata = {
  title: "ASTRIDE® Refund Policy | Returns, Refunds & Replacement Guidelines",
  description: "Read the ASTRIDE® Refund Policy for information on returns, refunds, replacements, eligibility, processing timelines, and customer support for office chairs, gaming chairs, bar stools, and office furniture purchases.",
};

export default function RefundPolicy() {
  return <RefundPolicyPage />;
}
