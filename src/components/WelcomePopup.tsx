"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function WelcomePopup() {
  const { popupSettings, isLoaded } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (popupSettings.active) {
      // Expiration check
      const currentDate = new Date();
      const expirationDate = new Date(popupSettings.expirationDate);
      
      // We set expirationDate to end of day to be generous
      expirationDate.setHours(23, 59, 59, 999);

      if (currentDate <= expirationDate) {
        // Show after a minor delay (1 second) for smooth user entry
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoaded, popupSettings]);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden transform transition-all duration-300 scale-100 flex flex-col border border-slate-100 max-h-[85vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-[#F8FAFC]">
          <span className="text-sm font-bold text-[#2B4C9B] tracking-wider uppercase">
            Xüsusi Bildiriş
          </span>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-slate-400 hover:text-[#E3232A] hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Close welcome screen"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - Image wrapper with protected aspect ratio */}
        <div className="p-2 bg-slate-50 flex items-center justify-center overflow-y-auto flex-grow min-h-0">
          <div className="relative w-full aspect-[4/3] max-h-[60vh] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={popupSettings.imageUrl}
              src={popupSettings.imageUrl || "/images/popup-banner.png"}
              alt="Tovuz Medical Center Welcome Screen"
              className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
              onError={(e) => {
                // fallback image if admin set an invalid image URL
                e.currentTarget.src = "/images/popup-banner.png";
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-[#F8FAFC]">
          <button
            onClick={handleClose}
            className="px-5 py-2 rounded-lg bg-[#2B4C9B] hover:bg-[#1f3770] text-white font-bold text-sm shadow-md transition-colors"
          >
            Keçid et
          </button>
        </div>
      </div>
    </div>
  );
}
