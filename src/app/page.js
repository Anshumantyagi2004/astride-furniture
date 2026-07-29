import dynamic from 'next/dynamic';
import { ProductsProvider } from '@/context/ProductsContext';
import connectDB from "@/config/connectDB";
import Product from "@/models/Product";
import CategoryModel from "@/models/Category";

import Header0 from '@/components/Home/Header0';
import Header6_New from '@/components/Home/Header6_New';
import BestSeller from "@/components/Home/BestSeller";
import Category from "@/components/Home/Category";
import Marquee4_New from '@/components/Home/Marquee4_New';
import FavouriteCategories from '@/components/Home/FavouriteCategories';
import Marquee2Hover from '@/components/Home/marquee2_hover';
import AstrideOffers from '@/components/Home/AstrideOffers';
import Marquee5_New from '@/components/Home/Marquee5_New';
import BestSellersSection_New from '@/components/Home/BestSellers_New';
import ChairSection from '@/components/Home/ChairSection';
import Header2 from '@/components/Header2/Index';
import AboutSection_New from '@/components/Home/About_New';
import WhyUs from '@/components/Home/WhyUs';
import StatsSection_New from '@/components/Home/WhyUs_New';
import Marquee6_New from '@/components/Home/Marquee6_New/Index';
import Enquiry_New from '@/components/Home/Enquiry_new';
import Newletter from '@/components/Home/Newletter';
import FAQ from '@/components/Home/FAQ';

// Dynamic loading heavy scroll & bento client components
const Chair_split = dynamic(() => import('@/components/Home/Chair_split'));
const BentoCategories = dynamic(() => import('@/components/Home/bentoCategoreis'));
const CertificationsBento = dynamic(() => import('@/components/Home/Certification_bento'));
const CompeteTheVibe = dynamic(() => import('@/components/Home/Compete_the_vibe'));
const Reviews_New = dynamic(() => import('@/components/Home/Reviews_New'));
const RealSetup_New = dynamic(() => import('@/components/Home/RealSetup_New'));
const VideoTestimonials = dynamic(() => import('@/components/Home/VideoTestimonials'));

export const revalidate = 0; // Ensure fresh data

export default async function Home() {
  let initialProducts = [];
  let initialCategories = [];
  try {
    await connectDB();
    const [products, categories] = await Promise.all([
      Product.find(
        {}, 
        "productName slug category oldPrice realPrice backSupport height hours colors rating capacity colorVariants metaTitle metaDescription shortDescription"
      ).populate("category").sort({ createdAt: -1 }).lean(),
      CategoryModel.find().sort({ createdAt: -1 }).lean()
    ]);
    
    // Serialize to pass from Server Component to Client Component
    initialProducts = JSON.parse(JSON.stringify(products));
    initialCategories = JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Failed to fetch data on server", error);
  }

  return (
    <ProductsProvider initialProducts={initialProducts}>
      <main className="min-h-screen">
        <Header0 />
        <Header6_New />
        <BestSeller />
        <Category initialCategories={initialCategories} />
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
