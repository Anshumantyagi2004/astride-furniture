import dynamic from 'next/dynamic';

const PrivacyPolicyPage = dynamic(() => import('@/components/pages/PrivacyPolicy'), {
  loading: () => (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
    </div>
  )
});

export const metadata = {
  title: "ASTRIDE® Privacy Policy | Data Protection & Customer Privacy",
  description: "Read the ASTRIDE® Privacy Policy to learn how we collect, use, store, and protect your personal information when you browse our website, purchase office furniture, or contact our customer support team.",
};

export default function PrivacyPolicy() {
  return <PrivacyPolicyPage />;
}
