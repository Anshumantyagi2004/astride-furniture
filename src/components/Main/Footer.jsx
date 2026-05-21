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
        <footer className="bg-gray-200 text-black">
            <div className="lg:px-15 md:px-10 px-4 py-14">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    <div>
                        <Link href="/" className="inline-block">
                            <Image
                                src="/logo.webp"
                                alt="Logo"
                                width={180}
                                height={80}
                                className="w-auto h-16 object-contain"
                            />
                        </Link>

                        <p className="mt-2 text-gray-600 leading-relaxed text-sm sm:text-base">
                            We create premium ergonomic furniture designed for
                            comfort, productivity, and modern living. Elevate
                            your workspace with style and functionality.
                        </p>

                        {/* SOCIAL ICONS */}
                        <div className="flex items-center gap-4 mt-4">
                            <Link
                                href="/"
                                className="w-10 h-10 rounded-full bg-white border border-gray-300 hover:bg-[#00badb] hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm"
                            >
                                <FaInstagram size={18} />
                            </Link>

                            <Link
                                href="/"
                                className="w-10 h-10 rounded-full bg-white border border-gray-300 hover:bg-[#00badb] hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm"
                            >
                                <FaYoutube size={18} />
                            </Link>

                            <Link
                                href="/"
                                className="w-10 h-10 rounded-full bg-white border border-gray-300 hover:bg-[#00badb] hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm"
                            >
                                <FaFacebookF size={16} />
                            </Link>

                            <Link
                                href="/"
                                className="w-10 h-10 rounded-full bg-white border border-gray-300 hover:bg-[#00badb] hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm"
                            >
                                <FaLinkedinIn size={16} />
                            </Link>

                            <Link
                                href="/"
                                className="w-10 h-10 rounded-full bg-white border border-gray-300 hover:bg-[#00badb] hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm"
                            >
                                <FaXTwitter size={16} />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold mb-6 relative inline-block text-[#243447]">
                            Company

                            <span className="absolute left-0 -bottom-2 w-14 h-[3px] bg-[#00badb] rounded-full"></span>
                        </h3>

                        <div className="flex flex-col gap-4 text-gray-700 w-fit">

                            <Link
                                href="/"
                                className="hover:text-[#00badb] transition-all duration-300 "
                            >
                                Home
                            </Link>

                            <Link
                                href="/our-story"
                                className="hover:text-[#00badb] transition-all duration-300"
                            >
                                Our Story
                            </Link>

                            <Link
                                href="/newsletter"
                                className="hover:text-[#00badb] transition-all duration-300"
                            >
                                Newsletter
                            </Link>

                            <Link
                                href="/contact-us"
                                className="hover:text-[#00badb] transition-all duration-300"
                            >
                                Contact Us
                            </Link>

                            <Link
                                href="/bulk-queries"
                                className="hover:text-[#00badb] transition-all duration-300"
                            >
                                Bulk Queries
                            </Link>

                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold mb-6 relative inline-block text-[#243447]">
                            Useful Links

                            <span className="absolute left-0 -bottom-2 w-14 h-[3px] bg-[#00badb] rounded-full"></span>
                        </h3>

                        <div className="flex flex-col gap-4 text-gray-700 w-fit">
                            <Link
                                href="/refund-policy"
                                className="hover:text-[#00badb] transition-all duration-300"
                            >
                                Refund Policy
                            </Link>

                            <Link
                                href="/cancellation-policy"
                                className="hover:text-[#00badb] transition-all duration-300"
                            >
                                Cancellation Policy
                            </Link>

                            <Link
                                href="/return-policy"
                                className="hover:text-[#00badb] transition-all duration-300"
                            >
                                Return Policy
                            </Link>

                            <Link
                                href="/shipping-policy"
                                className="hover:text-[#00badb] transition-all duration-300"
                            >
                                Shipping Policy
                            </Link>

                            <Link
                                href="/privacy-policy"
                                className="hover:text-[#00badb] transition-all duration-300"
                            >
                                Privacy Policy
                            </Link>

                            <Link
                                href="/terms-condition"
                                className="hover:text-[#00badb] transition-all duration-300"
                            >
                                Terms & Conditions
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold mb-6 relative inline-block text-[#243447]">
                            Trust Elite

                            <span className="absolute left-0 -bottom-2 w-14 h-[3px] bg-[#00badb] rounded-full"></span>
                        </h3>

                        <p className="text-gray-700 text-sm leading-relaxed">
                            Trusted by thousands of customers for quality,
                            durability, and premium ergonomic solutions.
                        </p>

                        <div className="">
                            <Image
                                alt="Trust Seal"
                                className="w-auto h-25 object-contain"
                                height={120}
                                width={120}
                                src="/trustseal.webp"
                            />
                        </div>
                    </div>
                </div>
            </div>


            <div className="border-t border-gray-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">

                    <p className="text-sm text-gray-600 text-center sm:text-left">
                        © {new Date().getFullYear()} Astrides Pvt Ltd. All rights reserved.
                    </p>

                    <p className="text-sm text-gray-600 text-center">
                        Website Designed By{" "}
                        <Link
                            href="/"
                            className="font-semibold hover:text-[#00badb] hover:underline transition-all"
                        >
                            Promozione Branding Pvt Ltd.
                        </Link>
                    </p>

                </div>
            </div>

        </footer>
    );
}