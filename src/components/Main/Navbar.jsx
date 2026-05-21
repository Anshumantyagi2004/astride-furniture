"use client";

import Image from "next/image";
import Link from "next/link";

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
  return (
    <header className="w-full font-[Barlow] sticky top-0 z-50">
      <div className="bg-[#00badb] text-white">
        <div className="max-w-7xl mx-auto px-4 h-11 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white hover:text-[#00badb] transition-all duration-300 flex items-center justify-center">
              <FaFacebookF size={14} />
            </button>

            <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white hover:text-[#00badb] transition-all duration-300 flex items-center justify-center">
              <FaInstagram size={15} />
            </button>

            <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white hover:text-[#00badb] transition-all duration-300 flex items-center justify-center">
              <FaYoutube size={15} />
            </button>
          </div>

          <p className="hidden lg:block text-sm font-medium tracking-wide animate-pulse">
           Tollfree Number 7311164111
            <span className="underline cursor-pointer ml-1 hover:text-black transition-all">
              Call Now!
            </span>
          </p>

          <div className="flex items-center gap-6 text-sm font-medium">
            <button className="flex items-center gap-2 hover:text-black transition-all">
              <Phone size={16} />
              Support
            </button>

            <button className="hover:text-black transition-all">
              Help
            </button>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <div className="bg-white md:border-b border-gray-200">
        <div className="lg:px-15 px-4 py-2 flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.webp"
              alt="logo"
              width={170}
              height={80}
              className="h-16 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-5 text-[#243447]">
            <div className="lg:w-150 w-100 hidden md:flex">
              <div className="w-full flex items-center bg-[#f1f5f9] border border-gray-200 rounded-full overflow-hidden hover:border-[#00badb] focus-within:border-[#00badb] transition-all duration-300">
                <div className="relative border-r border-gray-300">
                  <select className="appearance-none bg-transparent px-5 py-3 pr-10 outline-none text-[15px] font-medium text-[#243447] cursor-pointer">
                    <option>All</option>
                    <option>Chair</option>
                    <option>Chair</option>
                  </select>

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  <ChevronDown />
                  </span>
                </div>

                <div className="px-4 text-gray-500">
                  <Search size={20} />
                </div>

                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent w-full outline-none text-[16px] placeholder:text-gray-500 text-black"
                />

                <button className="bg-[#00badb] hover:bg-cyan-500 text-white px-7 py-3 font-medium transition-all duration-300">
                  Search
                </button>
              </div>
            </div>
            <button className="hover:text-[#00badb] transition-all duration-300 hover:scale-110">
              <Heart size={25} strokeWidth={1.8} />
            </button>
            <button className="relative hover:text-[#00badb] transition-all duration-300 hover:scale-110">
              <ShoppingCart size={27} strokeWidth={1.8} />

              <span className="absolute -top-2 -right-2 bg-[#00badb] text-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow">
                2
              </span>
            </button>
            <button className="hover:text-[#00badb] transition-all duration-300 hover:scale-110">
              <User size={25} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="lg:px-15 px-4">
          <div className="flex md:hidden mb-2 items-center bg-[#f1f5f9] border border-gray-200 rounded-full overflow-hidden">
            <div className="relative border-r border-gray-300">
              <select className="bg-transparent px-4 py-3 text-sm outline-none text-black">
                <option>All</option>
                <option>Chair</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 bg-transparent px-3 text-sm outline-none min-w-0 text-black"
            />

            <button className="bg-[#00badb] text-white px-4 py-4">
              <Search size={18} />
            </button>
          </div>

          <nav className="hidden md:flex items-center justify-start gap-10 pt-3 pb-4 overflow-x-auto whitespace-nowrap text-[17px] font-semibold text-[#243447] scrollbar-hide">
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
                <span className="group-hover:text-[#00badb] transition-all duration-300 font-normal">
                  {item.name}
                </span>

                {/* ANIMATED UNDERLINE */}
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#00badb] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}