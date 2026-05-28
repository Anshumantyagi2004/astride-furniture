"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Phone,
  ChevronDown,
} from "lucide-react";

import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Navbar() {
  const [hideTopBar, setHideTopBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHideTopBar(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full font-[Barlow] sticky -top-1 z-50">
      <motion.div
        animate={{
          height: hideTopBar ? 0 : 44,
          opacity: hideTopBar ? 0 : 1,
          y: hideTopBar ? -20 : 0,
        }}
        transition={{
          duration: 0.45,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="bg-[#161316]/95 backdrop-blur-xl text-white overflow-hidden border-b border-[#453027]"
      >
        <div className="max-w-7xl mx-auto px-4 h-11 flex items-center justify-between">

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-3">

            <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-[#FF6D29] transition-all duration-300 flex items-center justify-center hover:scale-110">
              <FaFacebookF size={14} />
            </button>

            <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-[#FF6D29] transition-all duration-300 flex items-center justify-center hover:scale-110">
              <FaInstagram size={15} />
            </button>

            <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-[#FF6D29] transition-all duration-300 flex items-center justify-center hover:scale-110">
              <FaYoutube size={15} />
            </button>
          </div>

          {/* CENTER TEXT */}
          <p className="hidden lg:block text-sm font-medium tracking-wide text-[#BABABA]">
            Tollfree Number 7311164111

            <span className="underline cursor-pointer ml-1 hover:text-[#FF6D29] transition-all duration-300">
              Call Now!
            </span>
          </p>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6 text-sm font-medium text-[#BABABA]">

            <button className="flex items-center gap-2 hover:text-[#FF6D29] transition-all duration-300">
              <Phone size={16} />
              Support
            </button>

            <button className="hover:text-[#FF6D29] transition-all duration-300">
              Help
            </button>
          </div>
        </div>
      </motion.div>

      <div className="bg-[#161316]/90 backdrop-blur-xl border-b border-[#453027] shadow-[0_0_40px_rgba(255,109,41,0.08)]">
        <div className="lg:px-15 px-4 flex items-center justify-between gap-4">
          <div className="flex items-center bg-white/5 border-b border-[#453027] overflow-hidden hover:border-[#FF6D29] focus-within:border-[#FF6D29] transition-all duration-300 shadow-lg backdrop-blur-xl">
            <div className="px-2 text-[#FF6D29]">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent w-full py-2 outline-none text-[16px] placeholder:text-[#BABABA] text-white"
            />
          </div>

          <Link href="/" className="shrink-0 pr-25">
            <Image
              src="/logo.webp"
              alt="logo"
              width={170}
              height={80}
              className="h-16 w-auto object-contain brightness-0 invert opacity-95"
            />
          </Link>

          <div className="flex items-center gap-5 text-white">
            <button className="text-[#BABABA] hover:text-[#FF6D29] transition-all duration-300 hover:scale-110">
              <Heart size={25} strokeWidth={1.8} />
            </button>

            <Link
              href={"/cart"}
              className="relative text-[#BABABA] hover:text-[#FF6D29] transition-all duration-300 hover:scale-110"
            >
              <ShoppingCart size={27} strokeWidth={1.8} />

              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#FF6D29] to-[#ff8b55] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">
                0
              </span>
            </Link>

            <Link
              href={"/login"}
              className="text-[#BABABA] hover:text-[#FF6D29] transition-all duration-300 hover:scale-110"
            >
              <User size={25} strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-[#161316] border-b border-[#453027] shadow-sm">
        <div className="lg:px-15 px-4">

          {/* MOBILE SEARCH */}
          <div className="flex md:hidden mb-3 items-center bg-white/5 border border-[#453027] rounded-full overflow-hidden backdrop-blur-xl">

            <div className="relative border-r border-[#453027]">

              <select className="bg-transparent px-4 py-3 text-sm outline-none text-white">
                <option className="text-black">All</option>
                <option className="text-black">Chair</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 bg-transparent px-3 text-sm outline-none min-w-0 text-white placeholder:text-[#BABABA]"
            />

            <button className="bg-gradient-to-r from-[#FF6D29] to-[#ff8b55] text-white px-4 py-4">
              <Search size={18} />
            </button>
          </div>

          {/* NAVIGATION */}
          <nav className="hidden md:flex items-center justify-start gap-10 pt-3 pb-4 overflow-x-auto whitespace-nowrap text-[17px] font-medium text-[#BABABA] scrollbar-hide">

            {[
              { name: "Home", link: "/" },
              { name: "Our Product", link: "/products" },
              { name: "Category", link: "/categories" },
              { name: "About Us", link: "/about-us" },
              { name: "Contact Us", link: "/contact-us" },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="relative group transition-all duration-300"
              >
                <span className="group-hover:text-white transition-all duration-300">
                  {item.name}
                </span>

                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-[#FF6D29] to-[#ff8b55] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}