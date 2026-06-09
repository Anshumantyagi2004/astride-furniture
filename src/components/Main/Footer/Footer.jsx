"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    FaFacebookF,
    FaInstagram,
    FaYoutube,
    FaLinkedinIn,
    FaXTwitter,
} from "react-icons/fa6";

export default function Footer() {
    const pathname = usePathname();

    const adminLayout = pathname.startsWith("/admin");
    if (adminLayout) return null;
    return (
        <footer className="bg-[#0b0b0b] text-[#BABABA] border-t border-zinc-800/60 font-[Barlow] relative overflow-hidden">
            {/* Elegant glowing pure grey/white flares */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-zinc-200/[0.06] rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-white/[0.08] rounded-full blur-[130px] pointer-events-none" />

            <div className="max-w-7xl mx-auto lg:px-15 md:px-10 px-4 py-4 md:py-10 relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-20">
                    {/* LOGO + ABOUT */}
                    <div className="flex flex-col items-start text-left max-w-xl">
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
                        <div className="flex items-center gap-4 mt-6 justify-start">
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
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white hover:text-[#0b0b0b] transition-all duration-300 flex items-center justify-center shadow-sm hover:scale-110"
                                >
                                    <Icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* LINKS CONTAINER */}
                    <div className="grid grid-cols-2 gap-8 sm:gap-12 lg:gap-10">
                        {/* COMPANY */}
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold mb-6 relative inline-block text-white">
                                Company
                                <span className="absolute left-0 -bottom-2 w-10 md:w-14 h-[3px] bg-zinc-500 rounded-full"></span>
                            </h3>

                            <div className="flex flex-col gap-3 md:gap-4 text-sm md:text-base">
                                {[
                                    { name: "Home", link: "/" },
                                    { name: "Our Story", link: "/our-story" },
                                    { name: "Newsletter", link: "/newsletter" },
                                    { name: "Contact Us", link: "/contact" },
                                    { name: "Bulk Queries", link: "/bulk-queries" },
                                    { name: "Blogs", link: "/blogs" },
                                ].map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.link}
                                        className="hover:text-white transition-all duration-300"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* USEFUL LINKS */}
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold mb-6 relative inline-block text-white">
                                Useful Links
                                <span className="absolute left-0 -bottom-2 w-10 md:w-14 h-[3px] bg-zinc-500 rounded-full"></span>
                            </h3>

                            <div className="flex flex-col gap-3 md:gap-4 text-sm md:text-base">
                                {[
                                    { name: "Refund Policy", link: "/refund-policy" },
                                    { name: "Cancellation Policy", link: "/cancellation-policy" },
                                    { name: "Return Policy", link: "/return-policy" },
                                    { name: "Shipping Policy", link: "/shipping-policy" },
                                    { name: "Privacy Policy", link: "/privacy-policy" },
                                    { name: "Terms & Conditions", link: "/terms-conditions" },
                                ].map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.link}
                                        className="hover:text-white transition-all duration-300"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM BAR */}
            <div className="border-t border-zinc-900 bg-[#070707]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-center gap-3">

                    <p className="text-sm text-[#8E8E8E] text-center">
                        © {new Date().getFullYear()} Astrides Pvt Ltd. All rights reserved.
                    </p>

                </div>
            </div>
        </footer>
    );
}