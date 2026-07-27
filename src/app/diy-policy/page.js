import dynamic from 'next/dynamic';

const DiyPolicyPage = dynamic(() => import('@/components/pages/diyPolicy'), {
  loading: () => (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
    </div>
  )
});

export const metadata = {
  title: "ASTRIDE® DIY Policy | Self-Assembly & Installation Guidelines",
  description: "Read the ASTRIDE® DIY Policy. Learn about our self-assembly guidelines, onsite service availability, and how to request installation manuals.",
};

export default function DiyPolicy() {
  return <DiyPolicyPage />;
}
