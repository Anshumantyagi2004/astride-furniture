"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export default function Cart() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center"
      >
        {/* Icon */}
        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          className="w-24 h-24 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-6 border border-slate-200/60"
        >
          <ShoppingCart
            size={40}
            strokeWidth={1.8}
            className="text-slate-800"
          />
        </motion.div>

        {/* Title */}
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-3">
          Your Cart is Empty
        </h2>

        {/* Description */}
        <p className="text-slate-500 text-[13px] font-medium leading-relaxed mb-8">
          Looks like you haven’t added anything to your cart yet.
          Start shopping to fill it with amazing products.
        </p>

        {/* Button */}
        <Link href="/products">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-lg shadow-slate-900/10"
          >
            Continue Shopping
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}