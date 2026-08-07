"use client";
import React from "react";
import { IoLogoWhatsapp } from "react-icons/io";

export default function WhatsWrapper() {
  return (
    <a
      href="https://wa.link/mo8y1e" 
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 md:hidden"
    >
      <div className="relative flex items-center justify-center">
        
        {/* Pulse Animation */}
        <span className="absolute inline-flex h-10 w-10 rounded-full bg-green-500 opacity-75 animate-ping"></span>

        {/* Icon Button */}
        <div className="relative bg-green-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform duration-300">
          <IoLogoWhatsapp size={40} />
        </div>

      </div>
    </a>
  );
}