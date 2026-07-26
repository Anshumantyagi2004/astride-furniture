import dynamic from 'next/dynamic';
import { ProductsProvider } from '@/context/ProductsContext';

import Header0 from '@/components/Home/Header0';
import Header6_New from '@/components/Home/Header6_New';
import BestSeller from "@/components/Home/BestSeller";
import Category from "@/components/Home/Category";
import Marquee4_New from '@/components/Home/Marquee4_New';
import FavouriteCategories from '@/components/Home/FavouriteCategories';
import Marquee2Hover from '@/components/Home/marquee2_hover';
import Chair_split from '@/components/Home/Chair_split';
import AstrideOffers from '@/components/Home/AstrideOffers';
import Marquee5_New from '@/components/Home/Marquee5_New';
import BentoCategories from '@/components/Home/bentoCategoreis';
import BestSellersSection_New from '@/components/Home/BestSellers_New';
import CertificationsBento from '@/components/Home/Certification_bento';
import ChairSection from '@/components/Home/ChairSection';
import Header2 from '@/components/Header2/Index';
import AboutSection_New from '@/components/Home/About_New';
import CompeteTheVibe from '@/components/Home/Compete_the_vibe';
import WhyUs from '@/components/Home/WhyUs';
import StatsSection_New from '@/components/Home/WhyUs_New';
import Marquee6_New from '@/components/Home/Marquee6_New/Index';
import Enquiry_New from '@/components/Home/Enquiry_new';
import Newletter from '@/components/Home/Newletter';
import FAQ from '@/components/Home/FAQ';

// Only dynamic loading heavy client components that contain heavy browser APIs or 3D canvas
// const PreloadModelViewer = dynamic(() => import('@/components/Home/PreloadModelViewer')); // Disabled: THREE.js WebGL context crash
const Reviews_New = dynamic(() => import('@/components/Home/Reviews_New'));
const RealSetup_New = dynamic(() => import('@/components/Home/RealSetup_New'));
const VideoTestimonials = dynamic(() => import('@/components/Home/VideoTestimonials'));

export default function Home() {
  return (
    <ProductsProvider>
      <main className="min-h-screen">
        <Header0 />
        <Header6_New />
        <BestSeller />
        <Category />
        <Marquee4_New />
        <FavouriteCategories />
        <Marquee2Hover />
        <Chair_split />
        <AstrideOffers />
        <Marquee5_New />
        <BentoCategories />
        {/* <PreloadModelViewer /> */} {/* Disabled: THREE.js WebGL context crash */}
        <BestSellersSection_New />
        <CertificationsBento />
        <ChairSection />
        <Header2 />
        <AboutSection_New />
        <CompeteTheVibe />
        <WhyUs />
        <StatsSection_New />
        <Reviews_New />
        <RealSetup_New />
        <Marquee6_New />
        <VideoTestimonials />
        <Enquiry_New />
        <Newletter />
        <FAQ />
      </main>
    </ProductsProvider>
  );
}
