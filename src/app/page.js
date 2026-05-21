import BestSellerSection from "@/components/Home/BestSellerSection";
import BrandTrustSection from "@/components/Home/BrandTrustSection";
import BulkQueryForm from "@/components/Home/BulkQueryForm";
import CategorySlider from "@/components/Home/CategorySlider";
import ClientLogoSlider from "@/components/Home/ClientLogoSlider";
import ComparisonSection from "@/components/Home/ComparisonSection";
import FavouriteCategories from "@/components/Home/FavouriteCategories";
import HeroSection from "@/components/Home/Hero";
import VideoTestimonials from "@/components/Home/VideoTestimonials";
import Footer from "@/components/Main/Footer";
import Navbar from "@/components/Main/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Navbar />
      <HeroSection />
      <CategorySlider />
      <FavouriteCategories />
      <ComparisonSection />
      <BrandTrustSection />
      <BestSellerSection />
      <ClientLogoSlider />
      <VideoTestimonials />
      <BulkQueryForm />
      <Footer />
    </div>
  );
}
