"use client";

import { useState } from "react";
import Image from "next/image";

import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";

import { motion } from "framer-motion";
import Navbar from "@/components/Main/Navbar";
import Footer from "@/components/Main/Footer";

export default function Page() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (<>
    <Navbar />

    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-[35px] overflow-hidden shadow-2xl grid lg:grid-cols-2">
        <div className="hidden lg:flex relative bg-[#00badb] p-12 flex-col justify-between text-white overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full"></div>

          <div className="relative z-10">
            <Image
              src="/logo.webp"
              alt="logo"
              width={180}
              height={180}
              className="object-contain"
            />
          </div>

          <div className="relative z-10">
            <h1 className="text-5xl font-bold leading-tight">
              Welcome to
              <br />
              Astride Furniture
            </h1>

            <p className="mt-6 text-lg text-white/90 leading-relaxed">
              Discover premium furniture crafted for comfort,
              elegance, and modern living.
            </p>
          </div>

          <div className="relative z-10 text-sm text-white/80">
            © {new Date().getFullYear()} Astride Furniture
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-6 lg:p-12 flex flex-col justify-center">

          {/* MOBILE LOGO */}
          <div className="lg:hidden flex justify-center mb-8">
            <Image
              src="/logo.webp"
              alt="logo"
              width={110}
              height={110}
            />
          </div>

          {/* SWITCH */}
          <div className="flex items-center bg-[#f4f7fb] rounded-2xl p-1 mb-5 relative">

            <motion.div
              animate={{
                x: isLogin ? 0 : "100%",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              className="absolute top-1 left-1 w-1/2 h-[calc(100%-8px)] bg-[#00badb] rounded-xl"
            />

            <button
              onClick={() => setIsLogin(true)}
              className={`relative z-10 w-1/2 py-3 font-semibold transition-all duration-300 ${isLogin ? "text-white" : "text-gray-600"
                }`}
            >
              Login
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`relative z-10 w-1/2 py-3 font-semibold transition-all duration-300 ${!isLogin ? "text-white" : "text-gray-600"
                }`}
            >
              Signup
            </button>
          </div>

          {/* TITLE */}
          <div className="mb-6 flex justify-center items-center flex-col">
            <h2 className="text-4xl font-bold text-[#243447]">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>

            <p className="text-gray-500 mt-2">
              {isLogin
                ? "Login to continue shopping"
                : "Signup and start your journey"}
            </p>
          </div>

          {/* FORM */}
          <form className="space-y-5">

            {!isLogin && (
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />

                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-200 bg-[#f9fafb] outline-none focus:border-[#00badb] text-black"
                />
              </div>
            )}

            {/* EMAIL */}
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-200 bg-[#f9fafb] outline-none focus:border-[#00badb] text-black"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full h-14 pl-12 pr-12 rounded-2xl border border-gray-200 bg-[#f9fafb] outline-none focus:border-[#00badb] text-black"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {/* FORGOT */}
            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-[#00badb] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* BUTTON */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-14 rounded-2xl bg-[#00badb] hover:bg-cyan-500 text-white font-semibold text-lg transition-all duration-300 shadow-lg shadow-cyan-100"
            >
              {isLogin ? "Login" : "Create Account"}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
    
    <Footer />
  </>);
}