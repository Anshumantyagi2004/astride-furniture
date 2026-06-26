"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import {
    FaInstagram,
    FaFacebookF,
    FaLinkedinIn,
    FaPhone,
    FaEnvelope,
    FaRegClock,
    FaYoutube,
} from "react-icons/fa6";

export default function Footer() {
    const pathname = usePathname();
    const [subscribed, setSubscribed] = useState(false);

    const adminLayout = pathname.startsWith("/admin");
    if (adminLayout) return null;

    const handleSubscribe = (e) => {
        e.preventDefault();
        setSubscribed(true);
    };

    return (
        <footer className="bg-[#131313] text-white pt-[40px] font-sans">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.4fr] gap-x-6 gap-y-10 pb-[28px]">
                    
                    {/* Brand Section */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" aria-label="Astride home" className="inline-flex items-center hover:opacity-90 transition-opacity">
                            <Image
                                src="/logo.webp"
                                alt="Astride"
                                width={170}
                                height={80}
                                className="h-10 md:h-14 w-auto object-contain brightness-0 invert"
                            />
                        </Link>
                        <p className="text-[#9c9c9c] text-[14px] mt-[16px] max-w-[300px] leading-relaxed font-sans">
                            Premium ergonomic furniture for comfort, productivity, and modern living. Your space, your vibe.
                        </p>
                        <div className="flex gap-[12px] mt-[22px]">
                            {[
                                { 
                                    Icon: FaInstagram, 
                                    label: "Instagram", 
                                    href: "https://www.instagram.com/astride.furniture" 
                                },
                                { 
                                    Icon: FaFacebookF, 
                                    label: "Facebook", 
                                    href: "https://www.facebook.com/Astride.furniture" 
                                },
                                { 
                                    Icon: FaLinkedinIn, 
                                    label: "LinkedIn", 
                                    href: "https://www.linkedin.com/company/astride-furniture"
                                },
                                { 
                                    Icon: FaYoutube, 
                                    label: "YouTube", 
                                    href: "https://www.youtube.com/channel/UC1_lDDANHKxaPZgz8aLp5IA" 
                                },
                            ].map(({ Icon, label, href }, index) => (
                                <a
                                    key={index}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-[40px] h-[40px] rounded-full border-[1.5px] border-[#3c3c3c] flex items-center justify-center transition-all duration-200 hover:bg-[#8B5CF6] hover:border-[#8B5CF6] hover:-translate-y-1"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>
 
                    {/* Shop Links */}
                    <div className="col-span-1">
                        <h4 className="font-sans text-[14px] uppercase tracking-[0.08em] mb-[18px] text-[#DCF351] font-black">
                            Shop
                        </h4>
                        {[
                            { name: "Gaming Chairs", link: "/products?category=Gaming%20Chair" },
                            { name: "Office Chairs", link: "/products?category=Office%20Chair" },
                            { name: "Study Chairs", link: "/products?category=Study%20Chair" },
                            { name: "Bar Stools & Cafe Chair", link: "/products?category=Bar%20Stools%20%26%20Cafe%20Chair" },
                            { name: "All Products", link: "/products" },
                        ].map((item, index) => (
                            <Link
                                key={index}
                                href={item.link}
                                className="block text-[#bdbdbd] text-[14px] py-[5px] transition-all duration-200 hover:text-white hover:translate-x-1 font-sans font-medium"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
 
                    {/* Company Links (with Left Border) */}
                    <div className="col-span-1 lg:border-l lg:border-[#2c2c2c] lg:pl-8">
                        <h4 className="font-sans text-[14px] uppercase tracking-[0.08em] mb-[18px] text-[#DCF351] font-black">
                            Company
                        </h4>
                        {[
                            { name: "About Us", link: "/about" },
                            { name: "Blog", link: "/blogs" },
                            { name: "Contact Us", link: "/contact" },
                            { name: "FAQs", link: "/#faq" },
                            { name: "Track Order", link: "/account/orders" },
                        ].map((item, index) => (
                            <Link
                                key={index}
                                href={item.link}
                                className="block text-[#bdbdbd] text-[14px] py-[5px] transition-all duration-200 hover:text-white hover:translate-x-1 font-sans font-medium"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
 
                    {/* Help Links (with Left Border) */}
                    <div className="col-span-1 lg:border-l lg:border-[#2c2c2c] lg:pl-8">
                        <h4 className="font-sans text-[14px] uppercase tracking-[0.08em] mb-[18px] text-[#DCF351] font-black">
                            Help
                        </h4>
                        {[
                            { name: "Cancellation Policy", link: "/cancellation-policy" },
                            { name: "Privacy Policy", link: "/privacy-policy" },
                            { name: "Refund Policy", link: "/refund-policy" },
                            { name: "Return Policy", link: "/return-policy" },
                            { name: "Shipping Policy", link: "/shipping-policy" },
                            { name: "Terms & Conditions", link: "/terms-conditions" },
                        ].map((item, index) => (
                            <Link
                                key={index}
                                href={item.link}
                                className="block text-[#bdbdbd] text-[14px] py-[5px] transition-all duration-200 hover:text-white hover:translate-x-1 font-sans font-medium"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
 
                    {/* Support Section with Left Border */}
                    <div className="col-span-1 lg:border-l lg:border-[#2c2c2c] lg:pl-8">
                        <h4 className="font-sans text-[14px] uppercase tracking-[0.08em] mb-[18px] text-[#DCF351] font-black">
                            Support
                        </h4>
                        <div className="space-y-[14px] text-[#bdbdbd] text-[14px]">
                            <div className="flex items-center gap-[10px]">
                                <FaPhone className="text-white shrink-0" size={14} />
                                <a href="tel:+917311164111" className="hover:text-white transition-colors font-sans">
                                    +91-7311164111
                                </a>
                            </div>
                            <div className="flex items-start gap-[10px]">
                                <FaEnvelope className="text-white shrink-0 mt-1" size={14} />
                                <div className="flex flex-col">
                                    <a href="mailto:support@astride.in" className="hover:text-white transition-colors font-sans">
                                        support@astride.in
                                    </a>
                                    <a href="mailto:sales@astride.in" className="hover:text-white transition-colors font-sans mt-0.5">
                                        sales@astride.in
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-[10px]">
                                <FaRegClock className="text-white shrink-0" size={14} />
                                <span className="font-sans">Mon - Sat: 10AM - 7PM</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-[8px] mt-[28px]">
                            {/* Visa */}
                            <div className="bg-white px-[10px] py-[4px] rounded-[4px] h-[24px] flex items-center justify-center shadow-sm select-none">
                                <span className="font-black italic text-[#1A1F71] text-[11px] tracking-tighter font-sans">
                                    V<span className="text-[#F7B600]">I</span>SA
                                </span>
                            </div>
                            {/* Mastercard */}
                            <div className="bg-white px-[10px] py-[4px] rounded-[4px] h-[24px] flex items-center justify-center shadow-sm select-none">
                                <svg className="w-8 h-4" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="11" cy="10" r="9" fill="#EB001B" />
                                    <circle cx="21" cy="10" r="9" fill="#F79E1B" fillOpacity="0.85" />
                                </svg>
                            </div>
                            {/* UPI */}
                            <div className="bg-white px-[10px] py-[4px] rounded-[4px] h-[24px] flex items-center justify-center shadow-sm select-none">
                                <span className="italic font-black text-[10px] text-[#0A2540] tracking-tighter flex items-center gap-[1px] font-sans">
                                    UPI<span className="text-[#3c8c40] font-bold">/</span>
                                </span>
                            </div>
                            {/* Paytm */}
                            <div className="bg-white px-[10px] py-[4px] rounded-[4px] h-[24px] flex items-center justify-center shadow-sm select-none">
                                <span className="font-black text-[10px] tracking-tight font-sans">
                                    <span className="text-[#00baf2]">pay</span>
                                    <span className="text-[#002970]">tm</span>
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t-[1.5px] border-[#2c2c2c] py-[12px] flex flex-wrap justify-between items-center gap-[14px] text-[13px] text-[#8b8b8b]">
                    <span>ASTRIDE [MBTC INTRAFURNISH PRIVATE LIMITED] © {new Date().getFullYear()} </span>
                    <span className="text-[#DCF351] font-medium tracking-wide">Good Chair. Good Mood. Good Day.</span>
                </div>
            </div>
        </footer>
    );
}