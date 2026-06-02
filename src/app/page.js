import BestSellerSection from "@/components/Home/BestSellerSection";
import BrandTrustSection from "@/components/Home/BrandTrustSection";
import BulkQueryForm from "@/components/Home/BulkQueryForm";
import Category from "@/components/Home/Category";
import CategorySlider from "@/components/Home/CategorySlider";
import ChairSection from "@/components/Home/ChairSection";
import ClientLogoSlider from "@/components/Home/ClientLogoSlider";
import ComparisonSection from "@/components/Home/ComparisonSection";
import FavouriteCategories from "@/components/Home/FavouriteCategories";
import HeroSection from "@/components/Home/Hero";
import BrandAboutSection from "@/components/Home/Intro";
import ShopTheLook from "@/components/Home/ProductGrid";
import VideoTestimonials from "@/components/Home/VideoTestimonials";
import Reviews from "@/components/Home/Reviews";
import WhyUs from "@/components/Home/WhyUs";
import Footer from "@/components/Main/Footer/Footer";

import Header2 from "@/components/Header2/Index";
import Marquee1 from "@/components/Home/marquee1";
import Marquee2Hover from "@/components/Home/marquee2_hover";
import Navbar2 from "@/components/Home/Navbar2";
import CircularChairs from "@/components/Home/CircularChairs";
import ProductPageHome from "@/components/prodcutPage/ProductPageHome";
import DetailPage from "@/components/detailPage/detailPage";
import Navbar from "@/components/Main/Navbar/Navbar";
import BentoCategories from "@/components/Home/bentoCategoreis";
import FAQ from "@/components/Home/FAQ";
import ModelViewer from "@/components/Home/3d_Viewer_glb";
import Chair_split from "@/components/Home/Chair_split";
import BestSeller from "@/components/Home/BestSeller";
import AstrideOffers from "@/components/Home/AstrideOffers";




export default function Home() {
  return (
    <main className="min-h-screen">
     
      <CircularChairs/>
      {/* <HeroSection/> */}
      <Category />
       <Marquee1 />
      
      <BentoCategories/>
      {/* <CategorySlider /> */}
      <FavouriteCategories />
      <BrandAboutSection />
       <Marquee2Hover />
      <ChairSection />
      <Header2 />
     
      <BestSeller/>
      <WhyUs />
      <Chair_split/>
      {/* <ShopTheLook /> */}

      <BrandTrustSection />
      {/* <ComparisonSection /> */}
      {/* <BestSellerSection /> */}
      <BestSellerSection/>
      <ClientLogoSlider />
      {/* <AstrideOffers/> */}
      <Reviews />
      <VideoTestimonials />
      <ModelViewer/>
      <BulkQueryForm />
      <FAQ/>
      
      
     
      
    </main>
  );
}
