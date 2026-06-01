"use client";

import { motion } from "framer-motion";
import {
    User,
    Building2,
    Mail,
    Phone,
    Armchair,
    MapPin,
    ArrowRight,
} from "lucide-react";

const FIELD_CONFIG = [
    { id: "fullName", label: "Full Name", placeholder: "e.g. Rajesh Kumar", type: "text", icon: User, required: true },
    { id: "company", label: "Company Name", placeholder: "e.g. Infosys Ltd.", type: "text", icon: Building2, required: true },
    { id: "chairs", label: "No. of Chairs", placeholder: "Estimated quantity", type: "number", icon: Armchair, required: true },
    { id: "email", label: "Official Email", placeholder: "you@company.com", type: "email", icon: Mail, required: true },
    { id: "phone", label: "Phone (optional)", placeholder: "+91 98765 43210", type: "tel", icon: Phone, required: false },
    { id: "location", label: "Your Location", placeholder: "City or State", type: "text", icon: MapPin, required: true },
];

export default function BulkQueryForm() {
    return (
        <section className="w-full pt-24 pb-12 bg-gradient-to-b from-white via-[#F9F9FB] to-white relative overflow-hidden">

            {/* Neutral subtle background texture */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-slate-100/60 rounded-full blur-[160px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-zinc-100/50 rounded-full blur-[140px]" />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-14"
                >

                    <h2 className="text-5xl sm:text-6xl font-black text-[#1C1A17] tracking-tight leading-[1.05]">
                        Outfit Your Entire
                        <br />
                        <span className="relative inline-block">
                            <span className="bg-gradient-to-r from-[#C94A28] via-[#E25C37] to-[#C9622A] bg-clip-text text-transparent">
                                Workspace.
                            </span>
                            <svg className="absolute -bottom-1 left-0 w-full h-2 opacity-30" viewBox="0 0 300 8" preserveAspectRatio="none">
                                <path d="M0,4 Q75,0 150,4 Q225,8 300,4" stroke="#E25C37" strokeWidth="2" fill="none" />
                            </svg>
                        </span>
                    </h2>
                    <p className="max-w-xl mx-auto mt-5 text-[#7A736E] text-sm sm:text-base leading-relaxed">
                        Unlock bulk pricing, white-glove delivery, and a dedicated account manager — tailored for offices of every scale.
                    </p>
                </motion.div>



                {/* Main Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="relative"
                >
                    {/* Outer Glow Ring */}
                    <div className="absolute -inset-px rounded-[44px] bg-gradient-to-br from-white via-[#E25C37]/10 to-white pointer-events-none" />

                    <div className="relative bg-white/40 backdrop-blur-3xl border border-white/70 rounded-[44px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(226,92,55,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]">

                        {/* Top accent stripe */}
                        <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#E25C37]/40 to-transparent" />

                        <div>

                            {/* LEFT: Form */}
                            <div className="p-8 sm:p-10 lg:p-14">
                                <div className="mb-10">
                                    <h3 className="text-2xl font-black text-[#1C1A17] tracking-tight">Contact Details</h3>
                                    <p className="text-[#9C948E] text-sm mt-1.5">Fields marked <span className="text-[#E25C37]">*</span> are required.</p>
                                </div>

                                <form className="grid grid-cols-1 sm:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                                    {FIELD_CONFIG.map(({ id, label, placeholder, type, icon: Icon, required: isRequired }) => (
                                        <div key={id} className="flex flex-col gap-2">
                                            <label htmlFor={id} className="text-xs font-bold text-[#4A4540] tracking-wider uppercase flex items-center gap-1">
                                                {label}
                                                {isRequired && <span className="text-[#E25C37] text-[10px] ml-0.5">*</span>}
                                            </label>
                                            <div className="relative group">
                                                <div className="
                                                    absolute left-0 top-0 bottom-0 w-12
                                                    flex items-center justify-center
                                                    text-[#B0A8A2]
                                                    group-focus-within:text-[#E25C37]
                                                    transition-colors duration-300
                                                ">
                                                    <Icon size={17} />
                                                </div>
                                                <input
                                                    id={id}
                                                    type={type}
                                                    required={isRequired}
                                                    placeholder={placeholder}
                                                    className="
                                                        w-full h-[52px]
                                                        rounded-2xl
                                                        border border-[#E4DDD6]
                                                        bg-white/60
                                                        backdrop-blur-sm
                                                        pl-12 pr-4
                                                        text-sm text-[#1C1A17]
                                                        placeholder:text-[#C0B8B2] placeholder:font-light
                                                        outline-none
                                                        focus:border-[#E25C37]
                                                        focus:bg-white
                                                        focus:shadow-[0_0_0_4px_rgba(226,92,55,0.06),0_2px_12px_rgba(226,92,55,0.04)]
                                                        hover:border-[#D0C8C2]
                                                        transition-all duration-300
                                                        shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]
                                                    "
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    {/* Submit Button — spans both columns */}
                                    <div className="sm:col-span-2 mt-6 relative">
                                        {/* Pulsing outer glow ring */}
                                        <div className="absolute -inset-[3px] rounded-[20px] bg-gradient-to-r from-[#E25C37] via-[#F0884A] to-[#E8A028] opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 pointer-events-none" />

                                        <motion.button
                                            whileHover={{ scale: 1.012, y: -3 }}
                                            whileTap={{ scale: 0.990, y: 0 }}
                                            type="submit"
                                            className="
                                                group
                                                relative
                                                w-full h-[58px]
                                                rounded-2xl
                                                bg-gradient-to-r from-[#D94F25] via-[#E25C37] to-[#E8842A]
                                                hover:from-[#C94420] hover:via-[#D95232] hover:to-[#E07820]
                                                text-white
                                                font-bold
                                                text-base tracking-wide
                                                overflow-hidden
                                                flex items-center justify-center gap-3
                                                shadow-[0_12px_35px_rgba(226,92,55,0.30),0_4px_12px_rgba(226,92,55,0.15)]
                                                hover:shadow-[0_20px_50px_rgba(226,92,55,0.45),0_8px_20px_rgba(226,92,55,0.25)]
                                                transition-all duration-400
                                                border border-white/10
                                            "
                                        >
                                            {/* Animated shimmer sweep */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600 ease-in-out" />

                                            {/* Subtle top highlight */}
                                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                                            <span className="relative z-10 drop-shadow-sm">Submit Enquiry</span>

                                            {/* Animated arrow icon */}
                                            <motion.div
                                                className="relative z-10 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shadow-inner group-hover:bg-white/30 transition-colors duration-300"
                                                animate={{ x: [0, 3, 0] }}
                                                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                                            >
                                                <ArrowRight size={16} className="text-white" />
                                            </motion.div>
                                        </motion.button>
                                    </div>
                                </form>
                            </div>



                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}