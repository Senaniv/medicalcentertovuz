"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp, ServiceItem } from "@/context/AppContext";
import * as Icons from "lucide-react";

export default function Services() {
  const { services, isLoaded } = useApp();
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [activeDot, setActiveDot] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  if (!isLoaded) return null;

  // Circle background color maps matching the design
  const circleColors = [
    "bg-[#0284C7]", // KT - Sky Blue
    "bg-[#0D9488]", // Laboratoriya - Teal
    "bg-[#3B82F6]", // USM - Blue
    "bg-[#8B5CF6]", // Radiologiya - Purple
    "bg-[#F97316]", // Fizioterapiya - Orange
    "bg-[#2563EB]", // Ginekologiya - Deep Blue
    "bg-[#EF4444]", // Kardiologiya - Red
    "bg-[#DB2777]", // Nevrologiya - Pink
    "bg-[#4F46E5]", // Urologiya - Indigo
    "bg-[#10B981]", // Ortopedik İçliklər - Emerald
  ];

  // Guarantee Kompüter Tomoqrafiyası (KT) is strictly the first card
  const allCards = [...services].sort((a, b) => {
    const isAKt = a.title.toLowerCase().includes("kompüter") || a.title.toLowerCase().includes("kt") || a.id === "srv-kt";
    const isBKt = b.title.toLowerCase().includes("kompüter") || b.title.toLowerCase().includes("kt") || b.id === "srv-kt";
    if (isAKt && !isBKt) return -1;
    if (!isAKt && isBKt) return 1;
    return 0;
  });

  // Dynamically group cards into chunks of 4 for mobile carousel
  const mobileChunks: ServiceItem[][] = [];
  for (let i = 0; i < allCards.length; i += 4) {
    mobileChunks.push(allCards.slice(i, i + 4) as ServiceItem[]);
  }

  // Scroll listener for mobile carousel dots
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollPosition = container.scrollLeft;
    const itemWidth = container.clientWidth;
    const index = Math.round(scrollPosition / itemWidth);
    setActiveDot(index);
  };

  // Scroll to slide when clicking dot
  const handleDotClick = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const itemWidth = container.clientWidth;
    container.scrollTo({
      left: index * itemWidth,
      behavior: "smooth",
    });
    setActiveDot(index);
  };

  const handleMobileScroll = () => {
    if (!mobileScrollRef.current) return;
    const container = mobileScrollRef.current;
    const index = Math.round(container.scrollLeft / container.clientWidth);
    setActiveSlide(index);
  };

  const handleCardClick = (card: ServiceItem) => {
    setSelectedService(card);
  };

  const scrollToAppointment = () => {
    setSelectedService(null);
    const element = document.getElementById("appointment");
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section 
      id="services" 
      className="py-20 sm:py-28 bg-gradient-to-b from-[#F0F7FF] via-[#F8FAFC] to-white border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
            Bizim Diaqnostik <span className="text-[#2B4C9B] font-black">Şöbələrimiz</span>
          </h2>
          <p className="text-slate-500 font-semibold text-sm max-w-xl mx-auto leading-relaxed">
            Geniş Diaqnostika Və Müalicə İmkanları
          </p>
        </div>

        {/* Carousel / Grid Container */}
        <div className="relative">
          {/* MOBILE VIEW: Swipable 2x2 Grid Carousel */}
          <div className="lg:hidden">
            <div
              ref={mobileScrollRef}
              onScroll={handleMobileScroll}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none pb-6"
            >
              {mobileChunks.map((chunk, slideIdx) => (
                <div key={slideIdx} className="w-full flex-shrink-0 snap-center px-1">
                  <div className="grid grid-cols-2 gap-4">
                    {chunk.map((card) => {
                      const cardIdx = allCards.findIndex(c => c.id === card.id);
                      const IconComponent = (Icons as any)[card.iconName] || Icons.Activity;
                      const circleColor = circleColors[cardIdx % circleColors.length];

                      return (
                        <div
                          key={card.id}
                          onClick={() => handleCardClick(card)}
                          className="group bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-2xl active:shadow-2xl transition-all duration-300 hover:-translate-y-1 active:-translate-y-1 cursor-pointer flex flex-col items-center justify-center text-center gap-4 aspect-square relative overflow-hidden hover:border-primary/20 hover:shadow-primary/5 active:border-primary/20 active:shadow-primary/5"
                        >
                          {/* Medical Plus Watermark */}
                          <div className="absolute top-3 right-3 text-slate-100 group-hover:text-primary/10 group-active:text-primary/10 transition-colors duration-300">
                            <Icons.Plus className="h-4 w-4" />
                          </div>

                          {/* Heartbeat EKG line watermark */}
                          <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none opacity-0 group-hover:opacity-10 group-active:opacity-10 transition-opacity duration-500 flex items-end">
                            <svg className="w-full h-8 text-primary" fill="none" viewBox="0 0 200 40" stroke="currentColor" strokeWidth="2.5" preserveAspectRatio="none">
                              <path d="M0,20 L50,20 L55,10 L60,30 L65,20 L75,20 L80,5 L85,35 L90,20 L100,20 L105,15 L110,25 L115,20 L200,20" />
                            </svg>
                          </div>

                          {/* Colored circular badge wrapping white icon */}
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${circleColor} shadow-md transition-all duration-300 group-hover:scale-105 group-active:scale-105`}>
                            <IconComponent className="h-5 w-5" />
                          </div>

                          {/* Centered Specialty/Service Name */}
                          <h3 className="text-xs font-extrabold tracking-tight leading-snug line-clamp-2 px-0.5 transition-colors duration-300 text-slate-800 group-hover:text-primary group-active:text-primary">
                            {card.title}
                          </h3>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Slide Pagination Dots */}
            {mobileChunks.length > 1 && (
              <div className="flex justify-center items-center gap-1.5 mt-4">
                {mobileChunks.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (mobileScrollRef.current) {
                        mobileScrollRef.current.scrollTo({
                          left: idx * mobileScrollRef.current.clientWidth,
                          behavior: "smooth"
                        });
                        setActiveSlide(idx);
                      }
                    }}
                    className="p-2 -mx-1 focus:outline-none cursor-pointer"
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    <div
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        activeSlide === idx ? "w-6 bg-primary" : "w-2.5 bg-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DESKTOP VIEW: Perfect 5-column static grid (10 cards = 5x2) */}
          <div className="hidden lg:grid lg:grid-cols-5 lg:gap-6">
            {allCards.map((card, idx) => {
              const IconComponent = (Icons as any)[card.iconName] || Icons.Activity;
              const circleColor = circleColors[idx % circleColors.length];

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  className="group bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col items-center justify-center text-center gap-5 aspect-[9/10] sm:aspect-square relative overflow-hidden hover:border-primary/20 hover:shadow-primary/5"
                >
                  {/* Medical Plus Watermark */}
                  <div className="absolute top-4 right-4 text-slate-100 group-hover:text-primary/10 transition-colors duration-300">
                    <Icons.Plus className="h-4.5 w-4.5" />
                  </div>

                  {/* Heartbeat EKG line watermark */}
                  <div className="absolute bottom-0 left-0 right-0 h-14 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-500 flex items-end">
                    <svg className="w-full h-10 text-primary" fill="none" viewBox="0 0 200 40" stroke="currentColor" strokeWidth="2.5" preserveAspectRatio="none">
                      <path d="M0,20 L50,20 L55,10 L60,30 L65,20 L75,20 L80,5 L85,35 L90,20 L100,20 L105,15 L110,25 L115,20 L200,20" />
                    </svg>
                  </div>

                  {/* Colored circular badge wrapping white icon */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${circleColor} shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                    <IconComponent className="h-7 w-7" />
                  </div>

                  {/* Centered Specialty/Service Name */}
                  <h3 className="text-base font-extrabold tracking-tight leading-snug line-clamp-2 px-1 transition-colors duration-300 text-slate-800 group-hover:text-primary">
                    {card.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Detailed Modal Dialog */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setSelectedService(null)}
          />

          {/* Modal Container */}
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all duration-300 border border-slate-100 flex flex-col max-h-[85vh] z-55">
            
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-[#F8FAFC]">
              <div className="flex items-center gap-2 text-primary">
                {React.createElement((Icons as any)[selectedService.iconName] || Icons.Activity, { className: "h-5 w-5" })}
                <span className="text-xs font-bold uppercase tracking-widest">Şöbə Məlumatı</span>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="p-1 rounded-full text-slate-400 hover:text-[#E3232A] hover:bg-slate-100 transition-colors focus:outline-none"
              >
                <Icons.X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-950">{selectedService.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">{selectedService.description}</p>
              </div>

              {/* Service Details checklist */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Əsas Xidmətlər:</h4>
                <ul className="space-y-2.5">
                  {selectedService.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start text-sm text-slate-700 font-bold">
                      <Icons.Check className="h-4.5 w-4.5 mr-2.5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="p-4 border-t border-slate-100 flex gap-3 bg-[#F8FAFC]">
              <button
                onClick={() => setSelectedService(null)}
                className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-colors"
              >
                Bağla
              </button>
              <button
                onClick={scrollToAppointment}
                className="flex-1 py-2.5 bg-secondary hover:bg-secondary-hover text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                Randevu Al
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
