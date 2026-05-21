import BestSellerSection from "@/components/Home/BestSellerSection";
import CategorySlider from "@/components/Home/CategorySlider";
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
      <BestSellerSection />
      <VideoTestimonials />
      <Footer />
    </div>
  );
}
