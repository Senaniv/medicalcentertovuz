"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show tooltip after 3 seconds for visual attention, then hide it after 8 seconds
    const showTimer = setTimeout(() => setShowTooltip(true), 3000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 9000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group">
      {/* Tooltip text */}
      <a
        href="https://wa.me/994513150500"
        target="_blank"
        rel="noopener noreferrer"
        className={`mr-3 bg-white text-slate-800 text-xs font-bold py-2 px-3 rounded-lg shadow-lg border border-emerald-100 transition-all duration-500 ease-in-out whitespace-nowrap hidden md:block hover:bg-slate-50 ${
          showTooltip
            ? "opacity-100 translate-x-0 scale-100"
            : "opacity-0 translate-x-4 scale-90 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100"
        }`}
      >
        WhatsApp ilə Əlaqə
        <span className="block text-[10px] text-emerald-600 font-normal">
          Online Randevu & Sual-Cavab
        </span>
      </a>

      {/* Button Body */}
      <a
        href="https://wa.me/994513150500"
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none"
        aria-label="Contact us on WhatsApp"
      >
        {/* Pulsing Ripple Effect */}
        <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-40 animate-ping"></span>
        
        {/* Core Icon */}
        <MessageCircle className="h-7 w-7 relative z-10 animate-pulse" />
      </a>
    </div>
  );
}
