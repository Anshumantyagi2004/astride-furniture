import dynamic from 'next/dynamic';

const AboutPage = dynamic(() => import('@/components/pages/aboutPage'), {
  loading: () => (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
    </div>
  )
});

export const metadata = {
  title: 'About Us — Astride Furniture',
  description: 'Learn about Astride — our story, values, and the team behind India\'s most ergonomic seating brand.',
};

export default function About() {
  return <AboutPage />;
}

