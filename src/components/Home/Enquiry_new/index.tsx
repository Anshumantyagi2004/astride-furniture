"use client";

import { useState, memo, useCallback } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { motion, Variants } from "framer-motion";

import Image from "next/image";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.02 },
  },
};

const headingVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const FEATURES = [
  {
    title: "Bulk pricing",
    desc: "Rates for 5+ units",
    color: "#DCF351",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 md:h-6 md:w-6">
        <path d="M12 2v20M7 7h7.5a3 3 0 0 1 0 6H8.5a3 3 0 0 0 0 6H17" strokeLinecap="round" />
      </svg>
    )
  },
  {
    title: "Dedicated manager",
    desc: "Account support",
    color: "#EC4899",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 md:h-6 md:w-6">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
      </svg>
    )
  },
  {
    title: "Priority delivery",
    desc: "White-glove install",
    color: "#A855F7",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 md:h-6 md:w-6">
        <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="1.8" />
        <circle cx="17" cy="18" r="1.8" />
      </svg>
    )
  }
];

const FeatureItem = memo(({ item }: { item: typeof FEATURES[0] }) => (
  <li className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-2 md:gap-4">
    <div 
      className="flex h-[42px] w-[40px] md:h-[46px] md:w-[46px] shrink-0 items-center justify-center rounded-xl border border-[#3A3A3A] bg-[#222]"
      style={{ color: item.color }}
    >
      {item.icon}
    </div>
    <div>
      <b className="block text-[12px] md:text-[15px] font-black text-white leading-tight">
        {item.title}
      </b>
      <span className="text-[10px] md:text-[13px] text-[#9C9C9C] block mt-0.5 leading-tight">
        {item.desc}
      </span>
    </div>
  </li>
));
FeatureItem.displayName = "FeatureItem";

export default function Enquiry_New() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    quantity: "",
    email: "",
    phone: "",
    location: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    companyName: "",
    quantity: "",
    email: "",
    phone: "",
    location: "",
  });

  const validateField = (name: string, value: string) => {
    if (name !== "phone" && !value.trim()) return "Required field";

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Invalid email format";
    }
    if (name === "phone" && value.trim().length > 0 && value.length !== 10) {
      return "Requires exactly 10 digits";
    }
    if ((name === "fullName" || name === "location" || name === "companyName") && value.trim().length > 0 && value.trim().length < 2) {
      return "Too short";
    }
    if (name === "quantity" && (isNaN(Number(value)) || Number(value) < 1)) {
      return "Must be at least 1";
    }
    return "";
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if ((name === 'fullName' || name === 'location') && !/^[a-zA-Z\s]*$/.test(value)) {
      return; 
    }
    if ((name === 'phone' || name === 'quantity') && !/^\d*$/.test(value)) {
      return;
    }
    if (name === 'phone' && value.length > 10) return;
    if (name === 'quantity' && value.length > 5) return;

    setFormData(prev => ({ ...prev, [name]: value }));

    setErrors(prev => {
      const fieldName = name as keyof typeof errors;
      if (prev[fieldName]) {
        return { ...prev, [fieldName]: validateField(name, value) };
      }
      return prev;
    });
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const newErrors = {
      fullName: validateField("fullName", formData.fullName),
      companyName: validateField("companyName", formData.companyName),
      quantity: validateField("quantity", formData.quantity),
      email: validateField("email", formData.email),
      phone: validateField("phone", formData.phone),
      location: validateField("location", formData.location),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(err => err !== "")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (error: string) => `w-full rounded-[10px] border-2 px-4 py-[11px] md:py-[13px] text-sm font-semibold outline-none transition duration-300 ${
    error 
      ? 'border-red-500 bg-red-50/50 text-red-900 focus:border-red-500 focus:shadow-[3px_3px_0_#ef4444]' 
      : 'border-[#131313] focus:border-[#8B5CF6] focus:shadow-[3px_3px_0_#8B5CF6]'
  }`;

  const ErrorMessage = ({ error }: { error: string }) => {
    if (!error) return null;
    return (
      <div className="flex items-center gap-1.5 mt-1.5 pl-1 animate-in fade-in slide-in-from-top-1 duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-red-500 shrink-0">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none mt-[1px]">
          {error}
        </span>
      </div>
    );
  };

  return (
    <section
      id="bulk"
      className="overflow-hidden bg-[#131313] py-[32px] md:py-[40px] lg:py-[48px] text-white"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-10 xl:gap-14 items-start">
          
          {/* LEFT COLUMN */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "200px" }}
            variants={containerVariants}
          >
            <span
              className={`inline-block rounded-md px-4 py-[6px] text-[11px] font-black uppercase tracking-[0.15em] text-white ${sans.className}`}
              style={{ background: "linear-gradient(90deg, #EC4899, #F97316)" }}
            >
              Corporate enquiry
            </span>

            <motion.h2 variants={headingVariants} className="mt-5 text-[40px] font-black uppercase leading-[1.0] tracking-[-0.02em] md:text-[54px] lg:text-[68px]">
              Outfit Your<br />Entire{" "}
              <span className={`${sans.className} bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent font-extrabold`}>
                Workspace.
              </span>
            </motion.h2>

            <p className={`mt-5 max-w-[460px] text-[16px] font-medium leading-7 text-[#BDBDBD] ${sans.className}`}>
              Bulk pricing, white-glove delivery, and a dedicated
              account manager — tailored for offices of every scale.
              500+ companies across India already rep the seat.
            </p>

            <div className="mt-8 md:mt-10 flex flex-col md:flex-row items-stretch gap-4 max-w-[460px]">
              
              {/* Features List: order-2 on mobile (moves bottom), md:order-1 on desktop (moves left) */}
              <div className="order-2 md:order-1 flex-[1.3] bg-white/[0.02] border border-white/5 rounded-[20px] p-4 md:p-5 flex flex-col justify-center">
                <ul className={`grid grid-cols-3 md:grid-cols-1 gap-2 md:gap-0 md:space-y-5 ${sans.className}`}>
                  {FEATURES.map((item) => (
                    <FeatureItem key={item.title} item={item} />
                  ))}
                </ul>
              </div>
              
              {/* GeM Logo Container: order-1 on mobile (moves top), md:order-2 on desktop (moves right) */}
              <div className="order-1 md:order-2 flex-1 flex items-center justify-center bg-white rounded-[20px] p-3 md:p-4 shadow-[4px_4px_0_#F97316] border border-white">
                <Image 
                  src="/Png1/Gemologo3.webp" 
                  alt="GeM Logo" 
                  width={180}
                  height={100}
                  className="object-contain w-full max-w-[130px] md:max-w-[150px] h-auto"
                />
              </div>

            </div>
          </motion.div>

          {/* RIGHT COLUMN */}
          <div className={`${sans.className} lg:mt-12`}>
            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="rotate-0 md:rotate-[0.8deg] rounded-[24px] md:rounded-[28px] bg-white p-6 md:p-10 text-[#131313] shadow-[6px_6px_0_#8B5CF6] md:shadow-[10px_10px_0_#8B5CF6]"
              >
                <h3 className="text-[24px] md:text-[26px] font-black uppercase tracking-tight font-forum">
                  Let&apos;s Talk Chairs
                </h3>

                <p className="mb-5 mt-1 text-xs text-[#888] font-medium">
                  Fields marked * are required.
                </p>

                {errorMsg && (
                  <p className="mb-4 text-xs font-bold text-red-500 uppercase tracking-wide">
                    ⚠️ {errorMsg}
                  </p>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col">
                    <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#131313]">
                      Full name*
                    </label>
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={getInputClass(errors.fullName)}
                    />
                    <ErrorMessage error={errors.fullName} />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#131313]">
                      Company*
                    </label>
                    <input
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={getInputClass(errors.companyName)}
                    />
                    <ErrorMessage error={errors.companyName} />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#131313]">
                      No. of chairs*
                    </label>
                    <input
                      type="text" 
                      name="quantity"
                      placeholder="e.g. 5"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={getInputClass(errors.quantity)}
                    />
                    <ErrorMessage error={errors.quantity} />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#131313]">
                      Official email*
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={getInputClass(errors.email)}
                    />
                    <ErrorMessage error={errors.email} />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#131313]">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="10-digit number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={getInputClass(errors.phone)}
                    />
                    <ErrorMessage error={errors.phone} />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#131313]">
                      Your location*
                    </label>
                    <input
                      name="location"
                      placeholder="City or State"
                      value={formData.location}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={getInputClass(errors.location)}
                    />
                    <ErrorMessage error={errors.location} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#131313] px-7 py-[14px] md:py-[15px] font-extrabold uppercase tracking-[0.1em] text-[13px] text-white transition duration-300 hover:bg-[#1F1F1F] active:scale-[0.98] cursor-pointer disabled:bg-neutral-500 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit Enquiry"}
                  <span className="text-base">→</span>
                </button>
              </form>
            ) : (
              <div className="rotate-0 md:rotate-[0.8deg] rounded-[24px] md:rounded-[28px] bg-white p-8 md:p-10 text-[#131313] shadow-[6px_6px_0_#8B5CF6] md:shadow-[10px_10px_0_#8B5CF6]">
                <h3 className="text-[26px] md:text-[28px] font-black uppercase font-forum">
                  Enquiry sent ✦
                </h3>
                <p className="mt-4 text-[#555] font-semibold">
                  Our team will reach out within one business day.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}