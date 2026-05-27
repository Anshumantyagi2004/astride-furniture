"use client";

import Image from "next/image";
import Link from "next/link";

import {
    FaFacebookF,
    FaInstagram,
    FaYoutube,
    FaLinkedinIn,
    FaXTwitter,
} from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className="bg-[#161316] text-[#BABABA] border-t border-[#453027] font-[Barlow]">

            <div className="lg:px-15 md:px-10 px-4 py-14">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* LOGO + ABOUT */}
                    <div>
                        <Link href="/" className="inline-block">
                            <Image
                                src="/logo.webp"
                                alt="Logo"
                                width={180}
                                height={80}
                                className="w-auto h-16 object-contain brightness-0 invert opacity-95"
                            />
                        </Link>

                        <p className="mt-4 text-[#BABABA] leading-relaxed text-sm sm:text-base">
                            We create premium ergonomic furniture designed for
                            comfort, productivity, and modern living. Elevate
                            your workspace with style and functionality.
                        </p>

                        {/* SOCIAL ICONS */}
                        <div className="flex items-center gap-4 mt-6">

                            {[
                                FaInstagram,
                                FaYoutube,
                                FaFacebookF,
                                FaLinkedinIn,
                                FaXTwitter,
                            ].map((Icon, index) => (
                                <Link
                                    key={index}
                                    href="/"
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-[#FF6D29] hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm hover:scale-110"
                                >
                                    <Icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* COMPANY */}
                    <div>
                        <h3 className="text-2xl font-bold mb-6 relative inline-block text-white">
                            Company

                            <span className="absolute left-0 -bottom-2 w-14 h-[3px] bg-[#FF6D29] rounded-full"></span>
                        </h3>

                        <div className="flex flex-col gap-4 w-fit">

                            {[
                                { name: "Home", link: "/" },
                                { name: "Our Story", link: "/our-story" },
                                { name: "Newsletter", link: "/newsletter" },
                                { name: "Contact Us", link: "/contact-us" },
                                { name: "Bulk Queries", link: "/bulk-queries" },
                            ].map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.link}
                                    className="hover:text-[#FF6D29] transition-all duration-300"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* USEFUL LINKS */}
                    <div>
                        <h3 className="text-2xl font-bold mb-6 relative inline-block text-white">
                            Useful Links

                            <span className="absolute left-0 -bottom-2 w-14 h-[3px] bg-[#FF6D29] rounded-full"></span>
                        </h3>

                        <div className="flex flex-col gap-4 w-fit">

                            {[
                                "Refund Policy",
                                "Cancellation Policy",
                                "Return Policy",
                                "Shipping Policy",
                                "Privacy Policy",
                                "Terms & Conditions",
                            ].map((item, index) => (
                                <Link
                                    key={index}
                                    href="/"
                                    className="hover:text-[#FF6D29] transition-all duration-300"
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* TRUST */}
                    <div>
                        <h3 className="text-2xl font-bold mb-6 relative inline-block text-white">
                            Trust Elite

                            <span className="absolute left-0 -bottom-2 w-14 h-[3px] bg-[#FF6D29] rounded-full"></span>
                        </h3>

                        <p className="text-[#BABABA] text-sm leading-relaxed">
                            Trusted by thousands of customers for quality,
                            durability, and premium ergonomic solutions.
                        </p>

                        <div className="mt-4">
                            <Image
                                alt="Trust Seal"
                                className="w-auto h-24 object-contain"
                                height={120}
                                width={120}
                                src="/trustseal.webp"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM BAR */}
            <div className="border-t border-[#453027] bg-[#120F12]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">

                    <p className="text-sm text-[#8E8E8E] text-center sm:text-left">
                        © {new Date().getFullYear()} Astrides Pvt Ltd. All rights reserved.
                    </p>

                    <p className="text-sm text-[#8E8E8E] text-center">
                        Website Designed By{" "}
                        <Link
                            href="/"
                            className="font-semibold hover:text-[#FF6D29] hover:underline transition-all"
                        >
                            Promozione Branding Pvt Ltd.
                        </Link>
                    </p>

                </div>
            </div>
        </footer>
    );
}