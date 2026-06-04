import dynamic from 'next/dynamic';

// Static imports — loaded normally
import CircularChairs from "@/components/Home/CircularChairs";
import Category from "@/components/Home/Category";
import Marquee1 from "@/components/Home/marquee1";
import BentoCategories from "@/components/Home/bentoCategoreis";
import FavouriteCategories from "@/components/Home/FavouriteCategories";
import BrandAboutSection from "@/components/Home/Intro";
import Marquee2Hover from "@/components/Home/marquee2_hover";
import ChairSection from "@/components/Home/ChairSection";
import Header2 from "@/components/Header2/Index";
import BestSeller from "@/components/Home/BestSeller";
import WhyUs from "@/components/Home/WhyUs";
import Chair_split from "@/components/Home/Chair_split";
import BrandTrustSection from "@/components/Home/BrandTrustSection";
import BestSellerSection from "@/components/Home/BestSellerSection";
import ClientLogoSlider from "@/components/Home/ClientLogoSlider";
import BulkQueryForm from "@/components/Home/BulkQueryForm";
import FAQ from "@/components/Home/FAQ";
import HeroSection from '@/components/Home/Hero';
import Header3 from '@/components/Home/Header3';
import Header0 from '@/components/Home/Header0';
// Lazy loaded — only the 3 heaviest components
// Reviews: uses GSAP + ScrollTrigger (large bundle)
const Reviews = dynamic(() => import('@/components/Home/Reviews'));
// VideoTestimonials: loads 4 external thumbnails + embeds
const VideoTestimonials = dynamic(() => import('@/components/Home/VideoTestimonials'));
// ModelViewer: Three.js WebGL — preloads while user is on VideoTestimonials
const PreloadModelViewer = dynamic(() => import('@/components/Home/PreloadModelViewer'));

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header0/>
       <Header3 />
      
       <HeroSection/>
      
      <Category />
     
      <Marquee1 />
      <BentoCategories/>
      <FavouriteCategories />
      <BrandAboutSection />
      <Marquee2Hover />
      <ChairSection />
      <Header2 />
      <BestSeller/>
      <WhyUs />
      <Chair_split/>
      <BrandTrustSection />
      <BestSellerSection/>
      <ClientLogoSlider />
      <Reviews />
      <VideoTestimonials />
      <PreloadModelViewer/>
      <BulkQueryForm />
      <FAQ/>
    </main>
  );
}
