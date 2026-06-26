"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Building2, Mail, Phone, Armchair, MapPin,
    ArrowRight, CheckCircle2, Sparkles, Package, Headphones, Clock
} from "lucide-react";

const FIELD_CONFIG = [
    { id: "fullName",  label: "Full Name",       placeholder: "e.g. Rajesh Kumar",    type: "text",   icon: User,      required: true,  col: 1 },
    { id: "company",   label: "Company Name",     placeholder: "e.g. Infosys Ltd.",    type: "text",   icon: Building2, required: true,  col: 1 },
    { id: "chairs",    label: "No. of Chairs",    placeholder: "Estimated quantity",   type: "number", icon: Armchair,  required: true,  col: 1 },
    { id: "email",     label: "Official Email",   placeholder: "you@company.com",      type: "email",  icon: Mail,      required: true,  col: 1 },
    { id: "phone",     label: "Phone (optional)", placeholder: "+91 98765 43210",      type: "tel",    icon: Phone,     required: false, col: 1 },
    { id: "location",  label: "Your Location",    placeholder: "City or State",        type: "text",   icon: MapPin,    required: true,  col: 1 },
];

const PERKS = [
    { icon: Package,     title: "Bulk Pricing",       desc: "Exclusive rates for 5+ units" },
    { icon: Headphones,  title: "Dedicated Manager",  desc: "Personal account support" },
    { icon: Clock,       title: "Priority Delivery",  desc: "White-glove installation" },
];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } }
};
const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function BulkQueryForm() {
    const [submitted, setSubmitted] = useState(false);
    const [focused, setFocused] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <section className="w-full bg-[#F7F7F8] py-10 md:py-20 relative overflow-hidden">

            {/* Very subtle background blobs */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-slate-200/30 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-white border border-slate-200/80 rounded-full px-4 py-1.5 mb-5 shadow-sm">
                        <Sparkles size={12} className="text-slate-500" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Corporate Enquiry</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.05]">
                        Outfit Your Entire
                        <br />
                        <span className="bg-gradient-to-r from-slate-700 to-slate-500 bg-clip-text text-transparent font-light italic">
                            Workspace.
                        </span>
                    </h2>
                    <p className="max-w-xl mx-auto mt-4 text-slate-500 text-sm sm:text-[15px] leading-relaxed">
                        Unlock bulk pricing, white-glove delivery, and a dedicated account manager — tailored for offices of every scale.
                    </p>
                </motion.div>

                {/* ── Main Card ── */}
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-0 rounded-3xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.07),0_4px_20px_rgba(0,0,0,0.04)]"
                >
                    {/* ── Left: Form ── */}
                    <div className="bg-white p-8 sm:p-10 lg:p-12">
                        <AnimatePresence mode="wait">
                            {submitted ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="h-full flex flex-col items-center justify-center text-center gap-4 py-16"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 14 }}
                                    >
                                        <CheckCircle2 size={64} className="text-emerald-500 mx-auto" />
                                    </motion.div>
                                    <h3 className="text-2xl font-black text-slate-900">Enquiry Submitted!</h3>
                                    <p className="text-slate-500 text-sm max-w-xs">Our team will reach out within 24 hours with a tailored bulk pricing proposal.</p>
                                </motion.div>
                            ) : (
                                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    {/* Form header */}
                                    <div className="mb-8 pb-6 border-b border-slate-100">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Contact Details</h3>
                                        <p className="text-slate-400 text-sm mt-1">
                                            Fields marked <span className="text-slate-600 font-bold">*</span> are required.
                                        </p>
                                    </div>

                                    <form
                                        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                                        onSubmit={handleSubmit}
                                    >
                                            {FIELD_CONFIG.map(({ id, label, placeholder, type, icon: Icon, required: isRequired }, i) => (
                                                <motion.div
                                                    key={id}
                                                    initial={{ opacity: 0, y: 16 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                                                    className="flex flex-col gap-1.5"
                                                >
                                                    <label htmlFor={id} className="text-[11px] font-bold text-slate-500 tracking-widest uppercase flex items-center gap-1">
                                                        {label}
                                                        {isRequired && <span className="text-slate-700 text-[10px]">*</span>}
                                                    </label>
                                                    <div className="relative">
                                                        <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused === id ? 'text-slate-800' : 'text-slate-300'}`}>
                                                            <Icon size={15} strokeWidth={2} />
                                                        </div>
                                                        <input
                                                            id={id}
                                                            type={type}
                                                            required={isRequired}
                                                            placeholder={placeholder}
                                                            onFocus={() => setFocused(id)}
                                                            onBlur={() => setFocused(null)}
                                                            className={`
                                                                w-full h-12 rounded-xl pl-10 pr-4 text-sm text-slate-800
                                                                border bg-slate-50/80 placeholder:text-slate-300
                                                                outline-none transition-all duration-200
                                                                ${focused === id
                                                                    ? 'border-slate-800 bg-white shadow-[0_0_0_3px_rgba(15,23,42,0.06)]'
                                                                    : 'border-slate-200 hover:border-slate-300'
                                                                }
                                                            `}
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))}

                                        {/* Submit */}
                                        <div className="sm:col-span-2 mt-2">
                                            <motion.button
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.99 }}
                                                type="submit"
                                                className="group w-full h-14 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[15px] tracking-wide flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
                                            >
                                                Submit Enquiry
                                                <motion.div
                                                    className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center"
                                                    animate={{ x: [0, 3, 0] }}
                                                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                                                >
                                                    <ArrowRight size={14} />
                                                </motion.div>
                                            </motion.button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ── Right: Perks Panel ── */}
                    <div
                        className="hidden lg:flex flex-col justify-between p-8 sm:p-10"
                        style={{ background: "linear-gradient(160deg, #1C2B4A 0%, #0F1E38 100%)" }}
                    >
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400 mb-3">Why Choose Us</p>
                            <h3 className="text-2xl font-black text-white leading-tight">
                                Enterprise-grade<br />
                                <span className="text-slate-400 font-light">at every scale.</span>
                            </h3>

                            <div className="mt-8 flex flex-row lg:flex-row gap-4 items-center justify-between">
                                <div className="flex flex-col gap-5 flex-1">
                                    {PERKS.map((perk, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 16 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                                            className="flex items-start gap-3"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-white/[0.07] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                                                <perk.icon size={15} strokeWidth={1.5} className="text-slate-300" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-white leading-tight">{perk.title}</p>
                                                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{perk.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                    className="flex-shrink-0 w-24 bg-white/5 rounded-xl p-2 border border-white/10 flex items-center justify-center"
                                >
                                    <Image 
                                        src="/Png1/Gemologo3.webp" 
                                        alt="Partner Logo" 
                                        width={80} 
                                        height={80} 
                                        className="object-contain opacity-90 hover:opacity-100 transition-opacity drop-shadow-sm filter brightness-0 invert"
                                    />
                                </motion.div>
                            </div>
                        </div>

                        {/* Bottom trusted badge */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="mt-10 pt-6 border-t border-white/[0.08]"
                        >
                            <p className="text-[11px] text-slate-500 uppercase tracking-widest font-bold mb-3">Trusted by</p>
                            <p className="text-slate-300 text-sm font-semibold leading-relaxed">500+ companies across India rely on ASTRIDE® for their office furniture needs.</p>
                        </motion.div>
                    </div>

                </motion.div>
            </div>
        </section>
    );
}