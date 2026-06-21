import React from "react";
import { ShieldCheck } from "lucide-react";

export default function InsurancePartners() {
  return (
    <section className="py-6 md:py-10 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
          
          {/* Label */}
          <div className="flex items-center gap-2.5 md:w-1/3 text-center md:text-left justify-center md:justify-start">
            <div className="p-1.5 bg-primary/10 text-primary rounded-lg hidden sm:block">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                Sığorta Partnyorlarımız
              </h4>
              <p className="text-slate-500 text-[10px] sm:text-xs font-semibold mt-0.5 hidden md:block">
                Aşağıdakı sığorta paketləri ilə tibbi xidmətlərdən yararlana bilərsiniz.
              </p>
            </div>
          </div>

          {/* Logo Bar */}
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 md:gap-12 md:w-2/3">
            
            {/* Qala Sığorta */}
            <div className="flex items-center gap-1.5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-105 active:grayscale-0 active:opacity-100 active:scale-105 transition-all duration-300 select-none cursor-pointer">
              <svg className="h-6 w-6 sm:h-8 sm:w-8" viewBox="0 0 100 100" fill="none">
                <path d="M50 15 L80 30 L80 65 L50 85 L20 65 L20 30 Z" fill="#2B4C9B" />
                <path d="M50 25 L70 35 L70 60 L50 75 L30 60 L30 35 Z" fill="#ffffff" />
                <path d="M50 35 L60 42 L60 55 L50 65 L40 55 L40 42 Z" fill="#E3232A" />
              </svg>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-black text-slate-800 tracking-tight leading-none uppercase">QALA</span>
                <span className="text-[8px] sm:text-[10px] font-bold text-slate-500 tracking-widest leading-none mt-0.5 sm:mt-1">SIĞORTA</span>
              </div>
            </div>

            {/* İcbari Tibbi Sığorta */}
            <div className="flex items-center gap-2 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-105 active:grayscale-0 active:opacity-100 active:scale-105 transition-all duration-300 select-none cursor-pointer">
              <svg className="h-6 w-6 sm:h-8 sm:w-8" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="35" stroke="#2B4C9B" strokeWidth="8" />
                <circle cx="50" cy="50" r="20" stroke="#E3232A" strokeWidth="6" />
                <path d="M50 20 L50 80 M20 50 L80 50" stroke="#2B4C9B" strokeWidth="4" />
              </svg>
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs font-black text-slate-800 tracking-tight leading-none uppercase">İCBRAİ TİBBİ</span>
                <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 tracking-widest leading-none mt-0.5 sm:mt-1 uppercase">Sığorta Agentliyi</span>
              </div>
            </div>

            {/* Q Group */}
            <div className="flex items-center gap-1.5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-105 active:grayscale-0 active:opacity-100 active:scale-105 transition-all duration-300 select-none cursor-pointer">
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-slate-800 flex items-center justify-center font-black text-white text-sm sm:text-lg tracking-tighter">
                Q
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-black text-slate-800 tracking-tight leading-none uppercase">Q GROUP</span>
                <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 tracking-widest leading-none mt-0.5 sm:mt-1 uppercase">Holdinq</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
