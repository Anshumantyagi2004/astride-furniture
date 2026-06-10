"use client";

import React, { useState } from "react";
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate network submission
    setTimeout(() => {
      // Print form content in console
      console.log("=== Astride Contact Form Submission ===");
      console.log("Full Name:   ", formData.fullName);
      console.log("Email:       ", formData.email);
      console.log("Company:     ", formData.companyName);
      console.log("Phone:       ", formData.phoneNumber);
      console.log("State:       ", formData.state);
      console.log("City:        ", formData.city);
      console.log("Message:     ", formData.message);
      console.log("======================================");

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData(INITIAL_FORM_DATA);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f1f3f5] text-slate-800 py-16 md:py-24 px-4 md:px-8 select-none relative overflow-hidden" style={{ fontFamily: '"Inter", sans-serif' }}>
      
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
                <p className="text-base md:text-lg font-extrabold text-slate-800 truncate">support@astridefurniture.com</p>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-white border border-slate-200/60 rounded-[24px] p-6 flex items-start gap-4 shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:border-slate-350 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 shrink-0">
                <Phone size={20} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1 leading-none">Phone</h3>
                <p className="text-base md:text-lg font-extrabold text-slate-800">+91-8810540823</p>
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
                  I-237, Sec-3, Bawana Industrial Area, Delhi-110039
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
                  <div className="flex flex-col gap-2">
                    <label className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-slate-400">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-base font-semibold outline-none focus:border-slate-900 focus:bg-white transition-all placeholder-slate-350"
                      />
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-slate-400">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="johndoe@email.com"
                        className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-base font-semibold outline-none focus:border-slate-900 focus:bg-white transition-all placeholder-slate-350"
                      />
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-slate-400">Company Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Company Ltd"
                        className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-base font-semibold outline-none focus:border-slate-900 focus:bg-white transition-all placeholder-slate-350"
                      />
                      <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-slate-400">Phone Number</label>
                    <div className="relative flex">
                      <span className="h-12 px-3 border border-r-0 border-slate-200 bg-slate-50 flex items-center justify-center text-sm rounded-l-xl text-slate-500">
                        🇮🇳
                      </span>
                      <input
                        type="tel"
                        name="phoneNumber"
                        required
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="9876543210"
                        className="w-full h-12 px-4 rounded-r-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-base font-semibold outline-none focus:border-slate-900 focus:bg-white transition-all placeholder-slate-350"
                      />
                    </div>
                  </div>

                  {/* State */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-slate-400">State</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Delhi"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-base font-semibold outline-none focus:border-slate-900 focus:bg-white transition-all placeholder-slate-350"
                    />
                  </div>
 
                  {/* City */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-slate-400">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New Delhi"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-base font-semibold outline-none focus:border-slate-900 focus:bg-white transition-all placeholder-slate-350"
                    />
                  </div>

                  {/* Your Message */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-slate-400">Your Message</label>
                    <div className="relative">
                      <textarea
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Write your query here..."
                        className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-base font-semibold outline-none focus:border-slate-900 focus:bg-white transition-all placeholder-slate-350 resize-none"
                      />
                      <MessageSquare className="absolute right-4 top-4 text-slate-400 pointer-events-none" size={16} />
                    </div>
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

      </div>
    </div>
  );
}
