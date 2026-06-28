"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export default function Newletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("subscribed");
    // Print email in console
    console.log("Newsletter Subscription:", email);
    setEmail("");
    setTimeout(() => {
      setStatus("");
    }, 3000);
  };

  return (
    <div id="newsletter" className="w-full h-auto pt-8 pb-2 p-[clamp(1rem,3vw,2rem)] flex items-center justify-center bg-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />

      <div className="w-[92%] min-w-[300px] max-w-[1300px] p-[clamp(1.5rem,4vw,50px)] gap-[clamp(1.5rem,4vw,60px)] flex flex-col md:flex-row items-center justify-between bg-white rounded-[32px] border-[2.5px] border-[#131313] shadow-[8px_8px_0_#8B5CF6] relative z-10">
        
        {/* Image Section */}
        <motion.div 
          // Added "hidden md:block" right here:
          className="hidden md:block w-[clamp(180px,35vw,350px)] h-[clamp(180px,35vh,300px)] relative"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ 
            opacity: 1,
            scale: [0.96, 1.04, 0.96]
          }}
          viewport={{ once: true, margin: "200px" }}
          transition={{
            opacity: { duration: 0.6 },
            scale: {
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut"
            }
          }}
        >
          {/* Vibrant colorful glow behind the illustration */}
          <div className="absolute inset-2 bg-gradient-to-tr from-[#8B5CF6]/35 via-[#EC4899]/25 to-[#DCF351]/35 blur-[35px] rounded-full" />
          <img
            src="https://framerusercontent.com/images/2frXBLhel5XqUp9GEzD2H6UrBNs.png?scale-down-to=1024"
            alt="Newsletter chair image"
            className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] drop-shadow-[0_4px_10px_rgba(139,92,246,0.3)]"
          />
        </motion.div>

        {/* Content Section */}
        <motion.div 
          className="flex-1 flex flex-col justify-center text-center md:text-left"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "200px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className={`text-[clamp(1.5rem,3.2vw,36px)] md:text-[clamp(1.8rem,3.8vw,44px)] font-black uppercase leading-[1.05] tracking-tight text-[#131313] mb-[12px] max-w-[550px] ${sans.className}`}>
            Subscribe to our{" "}
            <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent font-extrabold">
              newsletter.
            </span>
          </h2>
          
          <p className={`text-[#444444] text-[15px] leading-relaxed mb-[24px] max-w-[500px] font-medium ${sans.className}`}>
            Stay in the loop with the latest updates, exclusive offers, and exciting product launches by subscribing to our email newsletter.
          </p>
          
          <form onSubmit={handleSubscribe} className={`flex gap-[12px] w-full max-w-[600px] flex-col sm:flex-row items-center ${sans.className}`}>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" 
              className="py-[13px] px-[16px] rounded-[12px] border-2 border-[#131313] bg-white text-[#131313] font-semibold placeholder-zinc-400 placeholder:text-sm placeholder:font-medium outline-none w-full sm:w-[320px] md:w-[360px] max-w-full focus:border-[#8B5CF6] focus:shadow-[3px_3px_0_#8B5CF6] transition-all"
            />
            <button 
              type="submit"
              className="px-8 py-[14px] rounded-full bg-[#131313] text-white border-2 border-[#131313] font-extrabold uppercase tracking-[0.08em] text-[13px] whitespace-nowrap shadow-[4px_4px_0_#DCF351] hover:-translate-y-1 hover:bg-[#1F1F1F] hover:shadow-xl hover:shadow-[#DCF351]/10 transition-all w-full sm:w-auto cursor-pointer"
            >
              {status === "subscribed" ? "Subscribed!" : "Subscribe →"}
            </button>
          </form>
        </motion.div>

      </div>
    </div>
  );
}