"use client";

import React, { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Briefcase, 
  MessageSquare,
  CheckCircle,
  ArrowRight
} from "lucide-react";

interface ContactFormData {
  fullName: string;
  email: string;
  companyName: string;
  phoneNumber: string;
  state: string;
  city: string;
  message: string;
}

const INITIAL_FORM_DATA: ContactFormData = {
  fullName: "",
  email: "",
  companyName: "",
  phoneNumber: "",
  state: "",
  city: "",
  message: "",
};

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Validation Error State
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    companyName: "",
    phoneNumber: "",
    state: "",
    city: "",
    message: "",
  });

  // Validation Rules
  const validateField = (name: string, value: string) => {
    if (name !== "companyName" && !value.trim()) return "Required field";

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Invalid email format";
    }
    if (name === "phoneNumber" && value.trim().length > 0 && value.length !== 10) {
      return "Requires exactly 10 digits";
    }
    if ((name === "fullName" || name === "state" || name === "city") && value.trim().length > 0 && value.trim().length < 2) {
      return "Too short";
    }
    if (name === "message" && value.trim().length > 0 && value.trim().length < 0) {
      return "Message required";
    }
    return "";
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // 1. STRICT TEXT: Prevent numbers and special characters
    if ((name === 'fullName' || name === 'state' || name === 'city' || name === 'companyName') && !/^[a-zA-Z\s]*$/.test(value)) {
      return; 
    }

    // 2. STRICT NUMBERS: Prevent letters in Phone
    if (name === 'phoneNumber' && !/^\d*$/.test(value)) {
      return;
    }
    
    // 3. MAX LENGTH: Restrict phone to 10 digits
    if (name === 'phoneNumber' && value.length > 10) return;

    setFormData(prev => ({ ...prev, [name]: value }));

    // Instant error clearing as user types
    setErrors(prev => {
      const fieldName = name as keyof typeof errors;
      if (prev[fieldName]) {
        return { ...prev, [fieldName]: validateField(name, value) };
      }
      return prev;
    });
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);

    // Force validate all fields on submit
    const newErrors = {
      fullName: validateField("fullName", formData.fullName),
      email: validateField("email", formData.email),
      companyName: validateField("companyName", formData.companyName),
      phoneNumber: validateField("phoneNumber", formData.phoneNumber),
      state: validateField("state", formData.state),
      city: validateField("city", formData.city),
      message: validateField("message", formData.message),
    };

    setErrors(newErrors);

    // Stop submission if ANY error exists
    if (Object.values(newErrors).some(err => err !== "")) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          companyName: formData.companyName,
          phone: formData.phoneNumber,
          state: formData.state,
          city: formData.city,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        setFormData(INITIAL_FORM_DATA);
      } else {
        toast.error(data.message || "Failed to submit form");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic sleek input styling based on error state
  const getInputClass = (error: string, baseClass: string = "w-full pl-4 pr-10 rounded-xl outline-none transition-all placeholder:text-sm placeholder:font-normal") => `
    ${baseClass} text-base font-semibold border
    ${error 
      ? 'border-red-300 bg-red-50/40 text-red-900 focus:border-red-500 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.2)] placeholder-red-300' 
      : 'border-slate-200 bg-slate-50/50 text-slate-800 focus:border-slate-900 focus:bg-white placeholder-slate-350'
    }
  `;

  // Mini Error Message UI
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
    <div className="min-h-screen bg-[#f1f3f5] text-slate-800 pt-6 md:pt-24 pb-8 md:pb-24 px-4 md:px-8 select-none relative overflow-hidden" style={{ fontFamily: '"Inter", sans-serif' }}>
      
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] rounded-full bg-slate-400/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-10%] w-[600px] h-[600px] rounded-full bg-slate-300/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 flex flex-col gap-3">
          <h1 className="text-slate-900 text-5xl sm:text-7xl lg:text-8xl font-extrabold uppercase leading-none tracking-tight">
            Contact Us
          </h1>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-500 font-semibold leading-relaxed">
            Have a question about our products or need assistance? Our team will be happy to help you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6 w-full">
            
            {/* Email Card */}
            <div className="bg-white border border-slate-200/60 rounded-[24px] p-6 flex items-start gap-4 shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:border-slate-350 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 shrink-0">
                <Mail size={20} strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1 leading-none">Email</h3>
                <a href="mailto:support@astride.in" className="block text-base md:text-lg font-extrabold text-slate-800 hover:text-slate-600 transition-colors">support@astride.in</a>
                <a href="mailto:sales@astride.in" className="block text-base md:text-lg font-extrabold text-slate-800 mt-1 hover:text-slate-600 transition-colors">sales@astride.in</a>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-white border border-slate-200/60 rounded-[24px] p-6 flex items-start gap-4 shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:border-slate-350 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 shrink-0">
                <Phone size={20} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1 leading-none">Phone</h3>
                {/* Clickable Phone Number */}
                <a href="tel:+917311164111" className="text-base md:text-lg font-extrabold text-slate-800 hover:text-slate-600 transition-colors">
                  +91-7311164111
                </a>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white border border-slate-200/60 rounded-[24px] p-6 flex items-start gap-4 shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:border-slate-350 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 shrink-0">
                <MapPin size={20} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1 leading-none">Location</h3>
                <p className="text-base md:text-lg font-extrabold text-slate-800 leading-relaxed">
                  J-113 & 114, DSIIDC Industrial Area, Sector 4, Bawana, New Delhi, Delhi-110039
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 w-full">
            
            {submitSuccess && (
              <div className="mb-6 p-5 bg-slate-900 border border-slate-800 text-white rounded-3xl flex items-center gap-4 shadow-lg animate-fade-in">
                <CheckCircle size={22} className="text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider mb-0.5">Message Sent!</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Thank you for contacting Astride. We will get back to you shortly.</p>
                </div>
              </div>
            )}

            <div className="bg-white border border-slate-200/60 rounded-[32px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-slate-400">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Name"
                        className={`h-12 ${getInputClass(errors.fullName, "w-full pl-4 pr-10 rounded-xl outline-none transition-all placeholder:text-sm placeholder:font-normal")}`}
                      />
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                    <ErrorMessage error={errors.fullName} />
                  </div>

                  {/* Email Address */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-slate-400">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Email"
                        className={`h-12 ${getInputClass(errors.email, "w-full pl-4 pr-10 rounded-xl outline-none transition-all placeholder:text-sm placeholder:font-normal")}`}
                      />
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                    <ErrorMessage error={errors.email} />
                  </div>

                  {/* Company Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-slate-400">Company Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Company (optional)"
                        className={`h-12 ${getInputClass(errors.companyName, "w-full pl-4 pr-10 rounded-xl outline-none transition-all placeholder:text-sm placeholder:font-normal")}`}
                      />
                      <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                    <ErrorMessage error={errors.companyName} />
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-slate-400">Phone Number</label>
                    <div className="relative flex">
                      <span className={`h-12 px-3 border border-r-0 flex items-center justify-center text-sm rounded-l-xl text-slate-500 transition-colors ${errors.phoneNumber ? 'border-red-300 bg-red-50/40' : 'border-slate-200 bg-slate-50'}`}>
                        🇮🇳
                      </span>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="10-digit Number"
                        className={`h-12 ${getInputClass(errors.phoneNumber, "w-full px-4 rounded-r-xl outline-none transition-all placeholder:text-sm placeholder:font-normal")}`}
                      />
                    </div>
                    <ErrorMessage error={errors.phoneNumber} />
                  </div>

                  {/* State */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-slate-400">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="State"
                      className={`h-12 ${getInputClass(errors.state, "w-full px-4 rounded-xl outline-none transition-all placeholder:text-sm placeholder:font-normal")}`}
                    />
                    <ErrorMessage error={errors.state} />
                  </div>
 
                  {/* City */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-slate-400">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="City"
                      className={`h-12 ${getInputClass(errors.city, "w-full px-4 rounded-xl outline-none transition-all placeholder:text-sm placeholder:font-normal")}`}
                    />
                    <ErrorMessage error={errors.city} />
                  </div>

                  {/* Your Message */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-slate-400">Your Message</label>
                    <div className="relative">
                      <textarea
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="How can we help you?"
                        className={`py-3 resize-none ${getInputClass(errors.message, "w-full pl-4 pr-10 rounded-xl outline-none transition-all placeholder:text-sm placeholder:font-normal")}`}
                      />
                      <MessageSquare className="absolute right-4 top-4 text-slate-400 pointer-events-none" size={16} />
                    </div>
                    <ErrorMessage error={errors.message} />
                  </div>

                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-850 disabled:bg-slate-300 text-white rounded-xl text-sm md:text-base font-black uppercase tracking-wider transition-all duration-300 shadow-md shadow-slate-900/5 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <ArrowRight size={14} />
                </button>

              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16 bg-white border border-slate-200/60 rounded-[32px] p-4 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
          <MapSection />
        </div>

      </div>
    </div>
  );
}