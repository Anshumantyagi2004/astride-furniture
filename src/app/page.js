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
import Newletter from '@/components/Home/Newletter';
import Marquee4_New from '@/components/Home/Marquee4_New';
import Header5_New from '@/components/Home/Header5_New';
import Header6_New from '@/components/Home/Header6_New';
import StatsSection_New from '@/components/Home/WhyUs_New';
import Reviews_New from '@/components/Home/Reviews_New';
import Enquiry_New from '@/components/Home/Enquiry_new';
import AboutSection_New from '@/components/Home/About_New';
import BestSellersSection_New from '@/components/Home/BestSellers_New';
import RealSetup_New from '@/components/Home/RealSetup_New';
import AstrideOffers from '@/components/Home/AstrideOffers';
import CompeteTheVibe from '@/components/Home/Compete_the_vibe';
import Navbar from '@/components/Main/Navbar/Navbar';
import CertificationsBento from '@/components/Home/Certification_bento';
import Marquee5_New from '@/components/Home/Marquee5_New';
import Marquee6_New from '@/components/Home/Marquee6_New/Index';
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
    
       {/* <Header3 /> */}
       
         <Header6_New/>  
        <BestSeller/>
       
      
     
     
       
    
      
      <Category />
     
     
      <Marquee4_New/>
       <FavouriteCategories />
        <Marquee2Hover />
      <Chair_split/>
      <AstrideOffers/>
      <Marquee5_New/>
     
      <BentoCategories/>
      
     
      <PreloadModelViewer/>
      {/* <BrandAboutSection /> */}
       <BestSellersSection_New/>
     
     <CertificationsBento/>
      <ChairSection />
      <Header2 />
     
      <AboutSection_New/>
      <CompeteTheVibe/>
      
     
     
      
     
       
      
     
      <WhyUs />
      
      
      <StatsSection_New/> 
      
      {/* <BrandTrustSection /> */}
      {/* <BestSellerSection/> */}
      
      {/* <ClientLogoSlider /> */}
      <Reviews_New/>
      {/* <Reviews /> */}
      <RealSetup_New/>
      <Marquee6_New/>
      
      
      <VideoTestimonials />
      <Enquiry_New/>
      
      
      {/* <BulkQueryForm /> */}
      <Newletter/>
      <FAQ/>
    </main>
  );
}
