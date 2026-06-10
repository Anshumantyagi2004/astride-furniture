"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
} from "lucide-react";

import { motion } from "framer-motion";

export default function Page() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && (!name || !phone))) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const payload = isLogin ? { email, password } : { name, email, phone, password };
      
      const { data } = await axios.post(endpoint, payload);

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        if (isLogin) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setTimeout(() => {
            router.push("/account");
          }, 1000);
        } else {
          setTimeout(() => {
            setIsLogin(true);
            setMessage({ type: "success", text: "Account created! Please log in." });
            setName("");
            setPhone("");
            setPassword("");
          }, 1200);
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "An error occurred";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f5f8] via-[#e7ecf2] to-[#dfebf6] flex items-center justify-center px-4 py-10 relative overflow-hidden select-none">
      {/* Background Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/50 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-300/40 rounded-full blur-[110px] pointer-events-none" />

      {/* Main Glassmorphic Card */}
      <div className="w-full max-w-5xl bg-white/35 backdrop-blur-2xl border border-white/60 rounded-[35px] overflow-hidden shadow-[0_25px_60px_rgba(15,23,42,0.06)] grid lg:grid-cols-2 relative z-10">
        
        {/* LEFT SIDE (Brand Intro - Very Dark Blue-Greyish) */}
        <div className="hidden lg:flex relative bg-gradient-to-br from-[#1b2530] to-[#0f172a] p-12 flex-col justify-between text-white overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/[0.03] rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <Image
              src="/logo.webp"
              alt="logo"
              width={180}
              height={180}
              className="object-contain filter invert brightness-200"
            />
          </div>

          <div className="relative z-10 my-auto py-10">
            <h1 
              className="text-5xl font-extrabold leading-none uppercase tracking-tight"
            >
              Welcome to
              <br />
              <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.7)]">Astride</span>
              <br />
              Furniture
            </h1>

            <p className="mt-6 text-slate-400 text-base leading-relaxed font-light max-w-md">
              Discover premium furniture crafted for comfort,
              elegance, and modern living.
            </p>
          </div>

          <div className="relative z-10 text-xs text-slate-500 font-medium tracking-widest uppercase">
            © {new Date().getFullYear()} Astride Furniture
          </div>
        </div>

        {/* RIGHT SIDE (Auth Forms - Light Greyish) */}
        <div className="p-8 lg:p-14 flex flex-col justify-center bg-white/20">

          {/* MOBILE LOGO */}
          <div className="lg:hidden flex justify-center mb-8">
            <Image
              src="/logo.webp"
              alt="logo"
              width={110}
              height={110}
              className="filter"
            />
          </div>

          {/* SWITCH TOGGLE */}
          <div className="flex items-center bg-slate-200/50 border border-slate-300/20 rounded-2xl p-1 mb-8 relative">

            <motion.div
              animate={{
                x: isLogin ? 0 : "100%",
              }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 28,
              }}
              className="absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-[#1b2530] rounded-xl shadow-[0_4px_12px_rgba(27,37,48,0.2)]"
            />

            <button
              onClick={() => setIsLogin(true)}
              className={`relative z-10 w-1/2 py-3 font-bold tracking-wider uppercase text-xs transition-all duration-300 ${
                isLogin ? "text-white" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`relative z-10 w-1/2 py-3 font-bold tracking-wider uppercase text-xs transition-all duration-300 ${
                !isLogin ? "text-white" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Signup
            </button>
          </div>

          {/* TITLE */}
          <div className="mb-8 text-center">
            <h2 
              className="text-4xl sm:text-5xl font-extrabold text-[#1b2530] uppercase tracking-tight"
            >
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>

            <p className="text-slate-500 mt-2 text-sm font-medium tracking-wide">
              {isLogin
                ? "Login to continue shopping"
                : "Signup and start your journey"}
            </p>
          </div>

          {/* MESSAGE ALERT */}
          {message.text && (
            <div className={`p-4 mb-6 rounded-2xl text-xs font-semibold uppercase tracking-wider text-center ${
              message.type === "success" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
            }`}>
              {message.text}
            </div>
          )}

          {/* FORM */}
          <form className="space-y-5" onSubmit={handleSubmit}>

            {!isLogin && (
              <>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />

                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200/80 bg-white/60 text-slate-800 placeholder-slate-400 outline-none focus:border-[#1b2530]/50 focus:ring-1 focus:ring-[#1b2530]/10 transition-all duration-300"
                  />
                </div>

                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200/80 bg-white/60 text-slate-800 placeholder-slate-400 outline-none focus:border-[#1b2530]/50 focus:ring-1 focus:ring-[#1b2530]/10 transition-all duration-300"
                  />
                </div>
              </>
            )}

            {/* EMAIL */}
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200/80 bg-white/60 text-slate-800 placeholder-slate-400 outline-none focus:border-[#1b2530]/50 focus:ring-1 focus:ring-[#1b2530]/10 transition-all duration-300"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 pl-12 pr-12 rounded-2xl border border-slate-200/80 bg-white/60 text-slate-800 placeholder-slate-400 outline-none focus:border-[#1b2530]/50 focus:ring-1 focus:ring-[#1b2530]/10 transition-all duration-300"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
                  className="text-xs text-slate-500 hover:text-slate-800 hover:underline tracking-wider font-semibold uppercase"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* BUTTON */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full h-14 rounded-2xl bg-[#1b2530] hover:bg-[#233140] disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold tracking-wider uppercase text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(27,37,48,0.15)] hover:shadow-[0_4px_25px_rgba(27,37,48,0.25)] border border-[#1b2530]/20"
            >
              {loading ? "Processing..." : (isLogin ? "Login" : "Create Account")}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}