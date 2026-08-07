import AboutSection_New from "@/components/Home/About_New";
import CertificationsBento from "@/components/Home/Certification_bento";
import FavouriteCategories from "@/components/Home/FavouriteCategories";
import BrandAboutSection from "@/components/Home/Intro";
import Marquee2Hover from "@/components/Home/marquee2_hover";
import Reviews_New from "@/components/Home/Reviews_New";
import VideoTestimonials from "@/components/Home/VideoTestimonials";
import WhyUs from "@/components/Home/WhyUs";
import StatsSection_New from "@/components/Home/WhyUs_New";
import BestSeller2 from "@/components/inquiry/BestSeller2";
import HeroMob from "@/components/inquiry/HeroMob";
import React from "react";
import FAQ from "../faq/page";
import Marquee5_New from "@/components/Home/Marquee5_New";
import Marquee6_New from "@/components/Home/Marquee6_New/Index";
import AstrideOffers from "@/components/inquiry/AstrideOffers2";

export default function Inquiry() {
  return (
    <>
      <HeroMob />
      <AstrideOffers />
      
      <BestSeller2 />
      <Marquee6_New />

      <StatsSection_New />
      <FavouriteCategories />
      <Marquee2Hover />
      <CertificationsBento />
      <AboutSection_New />
      <Marquee5_New />
      <WhyUs />
      <Reviews_New />
      <VideoTestimonials />
      <FAQ />
    </>
  );
}
