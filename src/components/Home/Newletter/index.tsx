"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

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
    <div className="w-full h-[60vh] min-h-[400px] max-h-[60vh] p-[clamp(1rem,3vw,2rem)] flex items-center justify-center bg-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />

      <div className="w-[90%] min-w-[300px] max-w-[1300px] p-[clamp(1rem,4vw,40px)] gap-[clamp(1rem,4vw,60px)] display flex flex-col md:flex-row items-center justify-between bg-[#f8f8f8] rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-zinc-100 relative z-10">
        
        {/* Image Section */}
        <motion.div 
          className="w-[clamp(200px,40vw,400px)] h-[clamp(200px,40vh,350px)] relative"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-slate-200/20 blur-[80px] rounded-full" />
          <img
            src="https://framerusercontent.com/images/2frXBLhel5XqUp9GEzD2H6UrBNs.png?scale-down-to=1024"
            alt="Newsletter chair image"
            className="w-full h-full object-contain relative z-10 animate-pulse duration-3000"
          />
        </motion.div>

        {/* Content Section */}
        <motion.div 
          className="flex-1 flex flex-col justify-center text-center md:text-left"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-[clamp(1.2rem,3vw,32px)] md:text-[clamp(1.5rem,3.5vw,40px)] font-black uppercase tracking-tight text-slate-900 mb-[10px] max-w-[500px]">
            Subscribe and get <span className="text-zinc-500">10% off</span>
          </h2>
          
          <p className="text-[#717171] text-sm md:text-base mb-[20px] max-w-[500px] font-light leading-relaxed">
            Stay in the loop with the latest updates, exclusive offers, and exciting product launches by subscribing to our email newsletter.
          </p>
          
          <form onSubmit={handleSubscribe} className="flex gap-[10px] w-full max-w-[600px] flex-col sm:flex-row items-center">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email" 
              className="py-[12px] px-[15px] rounded-[12px] border border-zinc-200 bg-white text-slate-800 placeholder-zinc-400 placeholder:text-sm placeholder:font-normal outline-none w-full sm:w-[500px] max-w-full focus:border-slate-900 transition-colors"
            />
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-[12px] rounded-[12px] bg-slate-900 text-white font-bold whitespace-nowrap shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-colors w-full sm:w-auto"
            >
              {status === "subscribed" ? "Subscribed!" : "Subscribe"}
            </motion.button>
          </form>
        </motion.div>

      </div>
    </div>
  );
}
