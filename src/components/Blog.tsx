"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Calendar, User, Clock, ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Blog() {
  const { blogs } = useApp();
  const [activeBlogId, setActiveBlogId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  // Dynamic visible cards based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setVisibleCards(1);
      else if (window.innerWidth < 1024) setVisibleCards(2);
      else setVisibleCards(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const count = blogs.length;
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

  const activeBlog = blogs.find((b) => b.id === activeBlogId);

  return (
    <section id="blog" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-sm font-bold text-[#2B4C9B] uppercase tracking-widest">
            MAQALƏLƏR
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] tracking-tight">
            Tibb Mərkəzimizin Bloq Yazıları
          </h2>
          <div className="w-16 h-1 bg-[#E3232A] mx-auto rounded-full" />
          <p className="text-slate-500 font-medium">
            Sağlamlığınız üçün faydalı məlumatlar, tövsiyələr və tibbi yeniliklərlə yaxından tanış olun.
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
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="px-3 flex-shrink-0 transition-all duration-300"
                  style={{ width: `${100 / visibleCards}%` }}
                >
                  <article
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl active:shadow-xl transition-all duration-300 flex flex-col justify-between h-full"
                  >
                    {/* Blog Header Color Accent */}
                    <div className="h-2 bg-gradient-to-r from-[#2B4C9B] to-[#E3232A]" />

                    <div className="p-6 sm:p-8 space-y-4 flex-grow flex flex-col justify-between">
                      <div className="space-y-3">
                        {/* Meta data row */}
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-slate-400 text-xs font-semibold">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {blog.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {blog.readTime}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-[#2B4C9B] group-active:text-[#2B4C9B] transition-colors leading-snug line-clamp-2">
                          {blog.title}
                        </h3>

                        <p className="text-slate-600 text-sm font-medium line-clamp-3 leading-relaxed">
                          {blog.summary}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                          <User className="h-3.5 w-3.5 text-[#2B4C9B]" />
                          <span className="truncate max-w-[80px] sm:max-w-none">{blog.author}</span>
                        </div>
                        
                        <button
                          onClick={() => setActiveBlogId(blog.id)}
                          className="inline-flex items-center gap-1 text-xs font-extrabold text-secondary hover:text-[#c4181e] active:text-[#c4181e] transition-colors group/btn cursor-pointer"
                        >
                          Ətraflı Oxu
                          <ArrowRight className="h-3.5 w-3.5 transform group-hover/btn:translate-x-1 group-active/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Arrows */}
          {isCarousel && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-[-10px] sm:left-[-20px] top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white text-slate-600 hover:text-primary shadow-lg border border-slate-100 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 transition-opacity hover:scale-110 active:scale-95 duration-200 cursor-pointer"
                aria-label="Previous articles"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-[-10px] sm:right-[-20px] top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white text-slate-600 hover:text-primary shadow-lg border border-slate-100 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 transition-opacity hover:scale-110 active:scale-95 duration-200 cursor-pointer"
                aria-label="Next articles"
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

        {/* Detailed Blog Modal */}
        {activeBlog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setActiveBlogId(null)}
            />

            {/* Modal Body */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden transform transition-all duration-300 scale-100 border border-slate-100 flex flex-col">
              
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-[#F8FAFC]">
                <div>
                  <span className="text-[10px] font-bold text-[#2B4C9B] tracking-widest uppercase">
                    Bloq Məqaləsi
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight mt-1">
                    {activeBlog.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveBlogId(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-[#E3232A] hover:bg-slate-100 transition-colors flex-shrink-0 ml-4 focus:outline-none"
                  aria-label="Close article"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-grow space-y-6">
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 font-bold border-b border-slate-100 pb-4">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4 text-[#2B4C9B]" />
                    Müəllif: {activeBlog.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    Tarix: {activeBlog.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-slate-400" />
                    Oxuma vaxtı: {activeBlog.readTime}
                  </span>
                </div>

                {/* Article Body */}
                <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 font-medium whitespace-pre-wrap">
                  {activeBlog.content}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 flex justify-end bg-[#F8FAFC]">
                <button
                  onClick={() => setActiveBlogId(null)}
                  className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                >
                  Bağla
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
