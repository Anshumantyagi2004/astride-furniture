import dynamic from 'next/dynamic';

const PrivacyPolicyPage = dynamic(() => import('@/components/pages/PrivacyPolicy'), {
  loading: () => (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
    </div>
  )
});

export const metadata = {
  title: 'Privacy Policy — Astride Furniture',
  description: 'Privacy Policy of Astride Furniture detailing how we collect, store, and safeguard your personal data.',
};

export default function PrivacyPolicy() {
  return <PrivacyPolicyPage />;
}
