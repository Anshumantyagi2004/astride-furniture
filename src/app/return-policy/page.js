import dynamic from 'next/dynamic';

const ReturnPolicyPage = dynamic(() => import('@/components/pages/ReturnPolicy'), {
  loading: () => (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
    </div>
  )
});

export const metadata = {
  title: "ASTRIDE® Return Policy | Easy Returns for Office Chairs & Furniture",
  description: "Read the ASTRIDE® Return Policy to understand return eligibility, conditions, timelines, replacement options, and customer support for office chairs, gaming chairs, bar stools, and office furniture purchases.",
};

export default function ReturnPolicy() {
  return <ReturnPolicyPage />;
}
