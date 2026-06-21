"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Testimonials() {
  const { testimonials, isLoaded } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);

  const count = testimonials.length;

  const nextSlide = () => {
    if (count === 0) return;
    setActiveIndex((prev) => (prev === count - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (count === 0) return;
    setActiveIndex((prev) => (prev === 0 ? count - 1 : prev - 1));
  };

  // Auto play carousel every 7 seconds
  useEffect(() => {
    if (count === 0) return;
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [activeIndex, count]);

  const getOffset = (index: number) => {
    let offset = index - activeIndex;
    if (offset < -1) offset += count;
    if (offset > 1) offset -= count;
    return offset;
  };

  if (!isLoaded) return null;
  if (count === 0) return null;

  return (
    <section 
      id="testimonials" 
      className="py-20 sm:py-28 relative overflow-hidden bg-gradient-to-b from-white from-50% to-[#DBEAFE] to-50%"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading - Sincere and Warm */}
        <div className="text-center mb-12 sm:mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
            Qəlblərdən Süzülən <span className="text-primary font-black">Səmimi Rəylər</span>
          </h2>
          <p className="text-slate-500 font-semibold text-sm max-w-2xl mx-auto leading-relaxed">
            Bizə inanan, Tovuzda və ətraf bölgələrdə müalicə alaraq sağlamlığına qovuşan dəyərli pasiyentlərimizin ürək sözləri və geri dönüşləri.
          </p>
        </div>

        {/* 3D Stack Carousel Container */}
        <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center">
          
          {/* Card Stack */}
          <div className="relative w-full h-[380px] sm:h-[350px] flex items-center justify-center">
            {testimonials.map((item, index) => {
              const offset = getOffset(index);
              const isActive = offset === 0;
              const isLeft = offset === -1;
              const isRight = offset === 1;

              return (
                <div
                  key={item.id}
                  className={`absolute w-[92%] sm:w-[500px] bg-white rounded-3xl p-6 sm:p-8 border transition-all duration-500 ease-in-out text-center flex flex-col justify-center items-center ${
                    isActive
                      ? "z-20 opacity-100 scale-100 translate-x-0 shadow-xl border-slate-200/50"
                      : isLeft
                      ? "z-10 opacity-40 scale-85 -translate-x-[35%] sm:-translate-x-[48%] pointer-events-none border-slate-100 shadow-sm"
                      : isRight
                      ? "z-10 opacity-40 scale-85 translate-x-[35%] sm:translate-x-[48%] pointer-events-none border-slate-100 shadow-sm"
                      : "opacity-0 scale-50 pointer-events-none absolute"
                  }`}
                  style={{
                    transform: isActive 
                      ? "none" 
                      : isLeft 
                      ? "translateX(-32%) scale(0.85)" 
                      : isRight 
                      ? "translateX(32%) scale(0.85)" 
                      : "scale(0.5)"
                  }}
                >
                  {/* Avatar with blue ring */}
                  <div className="w-20 h-20 rounded-full border-4 border-primary p-0.5 mx-auto mb-4 overflow-hidden bg-slate-100 flex-shrink-0 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.sender}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${item.sender}`;
                      }}
                    />
                  </div>

                  {/* Sender Name */}
                  <h4 className="text-lg sm:text-xl font-bold text-slate-800 leading-none mb-1">
                    {item.sender}
                  </h4>
                  
                  {/* Location/Tag */}
                  <span className="text-xs text-slate-400 font-extrabold tracking-wide mb-5 block uppercase truncate max-w-full px-4">
                    {item.location}
                  </span>

                  {/* Feedback Message */}
                  <p className="text-sm text-slate-600 font-semibold leading-relaxed max-w-sm px-2 italic">
                    "{item.message}"
                  </p>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows positioned on active card edges */}
          {count > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 sm:left-[12%] md:left-[18%] lg:left-[22%] top-1/2 -translate-y-1/2 z-30 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary hover:bg-primary-hover text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all focus:outline-none"
                aria-label="Previous review"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-2 sm:right-[12%] md:right-[18%] lg:right-[22%] top-1/2 -translate-y-1/2 z-30 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary hover:bg-primary-hover text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all focus:outline-none"
                aria-label="Next review"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </>
          )}

        </div>

        {/* Indicator dots */}
        {count > 1 && (
          <div className="flex justify-center gap-2 mt-8 relative z-30">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === activeIndex ? "w-6 bg-primary" : "w-2.5 bg-slate-300"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
