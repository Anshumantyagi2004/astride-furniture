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
import WhyUs from "@/components/Home/WhyUs";
import Footer from "@/components/Main/Footer/Footer";

import Header2 from "@/components/Header2/Index";
import Navbar2 from "@/components/Home/Navbar2";
import CircularChairs from "@/components/Home/CircularChairs";
import ProductPageHome from "@/components/prodcutPage/ProductPageHome";




export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar2/>
      <CircularChairs/>
      <Category />
      {/* <CategorySlider /> */}
      <FavouriteCategories />
      <BrandAboutSection />
      <ChairSection />
      <Header2 />
      <WhyUs />
      <ShopTheLook />

      <BrandTrustSection />
      <ComparisonSection />
      {/* <BestSellerSection /> */}
      <BestSellerSection/>
      <ClientLogoSlider />
      <VideoTestimonials />
      <BulkQueryForm />
      <ProductPageHome/>
     
      <Footer />
    </main>
  );
}
