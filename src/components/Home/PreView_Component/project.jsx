import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Project({ index, title, category, src, setModal }) {
    return (
        <div
            onMouseEnter={() => setModal({ active: true, index })}
            onMouseLeave={() => setModal({ active: false, index })}
            className="group w-full flex flex-col md:flex-row md:justify-between md:items-center px-6 lg:px-20 py-8 md:py-11 border-t border-zinc-200/50 cursor-pointer transition-all duration-500 md:hover:opacity-30 first:border-t-0 last:border-b last:border-zinc-200/50"
        >
            <div className="flex flex-col gap-1 md:gap-2">
                <h2 className="text-2xl md:text-3xl lg:text-[46px] font-semibold tracking-tight m-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:-translate-x-4 text-zinc-900">
                    {title}
                </h2>
                <p className="text-[11px] md:text-[13px] lg:text-sm font-semibold uppercase tracking-widest text-zinc-400 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:translate-x-4">
                    {category}
                </p>
            </div>

            {/* Premium animated inline preview card for mobile/touch viewports */}
            <motion.div 
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
                className="mt-5 md:hidden w-full h-[200px] bg-white rounded-2xl overflow-hidden border border-zinc-100 flex items-center justify-center p-4 shadow-[0_10px_35px_rgba(0,0,0,0.03)]"
            >
                <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ 
                        repeat: Infinity, 
                        duration: 3.5, 
                        ease: "easeInOut",
                        delay: index * 0.3 
                    }}
                    className="w-full h-full flex items-center justify-center"
                >
                    <Image
                        src={src}
                        width={160}
                        height={160}
                        alt={title}
                        className="object-contain max-h-full w-auto"
                    />
                </motion.div>
            </motion.div>
        </div>
    );
}