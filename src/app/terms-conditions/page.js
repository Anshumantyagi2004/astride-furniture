import dynamic from 'next/dynamic';

const TermsConditionsPage = dynamic(() => import('@/components/pages/termsCondition'), {
  loading: () => (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
    </div>
  )
});

export const metadata = {
  title: 'Terms & Conditions — Astride Furniture',
  description: 'Terms and conditions governing the use of Astride Furniture website and purchases.',
};

export default function TermsConditions() {
  return <TermsConditionsPage />;
}
