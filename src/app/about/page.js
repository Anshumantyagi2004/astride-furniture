import dynamic from 'next/dynamic';

const AboutPage = dynamic(() => import('@/components/pages/aboutPage'), {
  loading: () => (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
    </div>
  )
});

export const metadata = {
  title: "About ASTRIDE® | Leading Office Chair & Office Furniture Manufacturer in India",
  description: "Learn about ASTRIDE®, a trusted office furniture and ergonomic chair manufacturer in India. We specialize in premium office chairs, gaming chairs, executive seating, bar stools, and workspace solutions designed for comfort, quality, and long-lasting performance.",
};


export default function About() {
  return <AboutPage />;
}

