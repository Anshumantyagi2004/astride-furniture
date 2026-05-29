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
import Navbar from "@/components/Main/Navbar/Navbar";
import Header2 from "@/components/Header2/Index";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <Category />
      {/* <CategorySlider /> */}
      <FavouriteCategories />
      <BrandAboutSection />
      <ChairSection />
      <Header2 />
      <ShopTheLook />
      <WhyUs />
      <BrandTrustSection />
      <ComparisonSection />
      <BestSellerSection />
      <ClientLogoSlider />
      <VideoTestimonials />
      <BulkQueryForm />
      <Footer />
    </main>
  );
}
