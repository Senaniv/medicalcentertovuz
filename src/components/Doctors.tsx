"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Award, GraduationCap, CalendarDays, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function Doctors() {
  const { doctors } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);

  // Dynamic visible cards based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setVisibleCards(2);
      else if (window.innerWidth < 1280) setVisibleCards(3);
      else setVisibleCards(4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const count = doctors.length;
  const isCarousel = count > visibleCards;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= count - visibleCards ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? count - visibleCards : prev - 1));
  };

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (!isCarousel) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, visibleCards, isCarousel, count]);

  // Touch Swipe handlers for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <section id="doctors" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-sm font-bold text-primary uppercase tracking-widest">
            HƏKİMLƏRİMİZ
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] tracking-tight">
            Peşəkar Həkim Heyətimiz
          </h2>
          <div className="w-16 h-1 bg-[#E3232A] mx-auto rounded-full" />
          <p className="text-slate-500 font-medium">
            Sizin sağlamlığınız üçün öz sahəsində geniş təcrübəyə malik, yüksək ixtisaslı tibb mütəxəssislərimiz xidmətinizdədir.
          </p>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative group/carousel px-1">
          {/* Slider Viewport */}
          <div 
            className="overflow-hidden -mx-3 touch-pan-y cursor-grab active:cursor-grabbing select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
              }}
            >
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="px-3 flex-shrink-0 transition-all duration-300"
                  style={{ width: `${100 / visibleCards}%` }}
                >
                  <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl active:shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
                    {/* Doctor Image Container */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105 active:scale-105 group-hover:scale-105 group-active:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${doctor.name}`;
                        }}
                      />
                      
                      {/* Specialty tag overlay */}
                      <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg p-2 border border-slate-100 text-center">
                        <p className="text-[#2B4C9B] text-xs font-extrabold tracking-wide uppercase truncate">
                          {doctor.specialty}
                        </p>
                      </div>
                    </div>

                    {/* Doctor Details */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-base font-extrabold text-slate-800 leading-snug group-hover:text-[#2B4C9B] group-active:text-[#2B4C9B] transition-colors line-clamp-1">
                          {doctor.name}
                        </h3>
                        
                        {/* Experience and Education */}
                        <div className="space-y-1">
                          {doctor.experience && (
                            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                              <Award className="h-3.5 w-3.5 text-[#E3232A] flex-shrink-0" />
                              <span className="font-semibold">Təcrübə: {doctor.experience}</span>
                            </div>
                          )}
                          {doctor.education && (
                            <div className="flex items-start gap-1.5 text-slate-500 text-xs">
                              <GraduationCap className="h-3.5 w-3.5 text-[#2B4C9B] flex-shrink-0 mt-0.5" />
                              <span className="font-medium line-clamp-2 leading-tight">
                                {doctor.education}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Booking Trigger Action */}
                      <a
                        href="#appointment"
                        className="w-full py-2.5 px-3 bg-[#2B4C9B]/5 hover:bg-[#2B4C9B] active:bg-[#2B4C9B] text-[#2B4C9B] hover:text-white active:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 group/btn"
                      >
                        <CalendarDays className="h-3.5 w-3.5" />
                        Randevu Al
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover/btn:opacity-100 group-active/btn:opacity-100 transform translate-x-[-4px] group-hover/btn:translate-x-0 group-active/btn:translate-x-0 transition-all" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Arrows (only if count > visibleCards) */}
          {isCarousel && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-[-10px] sm:left-[-20px] top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white text-slate-600 hover:text-primary shadow-lg border border-slate-100 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 transition-opacity hover:scale-110 active:scale-95 duration-200 cursor-pointer"
                aria-label="Previous doctors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-[-10px] sm:right-[-20px] top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white text-slate-600 hover:text-primary shadow-lg border border-slate-100 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 transition-opacity hover:scale-110 active:scale-95 duration-200 cursor-pointer"
                aria-label="Next doctors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Indicator dots */}
        {isCarousel && (
          <div className="flex justify-center items-center gap-1 mt-8">
            {Array.from({ length: count - visibleCards + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className="p-2 -mx-1 focus:outline-none cursor-pointer"
                aria-label={`Go to slide ${idx + 1}`}
              >
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? "w-6 bg-primary" : "w-2 bg-slate-300"
                  }`}
                />
              </button>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
