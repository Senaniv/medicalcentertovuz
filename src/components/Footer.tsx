import React from "react";
import Link from "next/link";
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-[#0F172A] text-slate-400 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-slate-800">
          
          {/* Company Brief (4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="inline-block bg-white p-2 rounded-xl">
              <Logo size="sm" showText={true} />
            </div>
            
            <p className="text-sm leading-relaxed font-medium">
              Sağlamlığınız bizim ən böyük dəyərimizdir. Müasir tibb və peşəkar xidmət.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/MedicalTovuz/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 bg-slate-800 hover:bg-[#2B4C9B] hover:text-white rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label="Facebook page"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/medicalcenter_tovuz/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 bg-slate-800 hover:bg-[#E3232A] hover:text-white rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label="Instagram page"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a
                href="https://wa.me/994513150500"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label="WhatsApp"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact details (3 columns) */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="text-white text-base font-extrabold tracking-wider uppercase">
              Əlaqə Məlumatları
            </h4>
            
            <ul className="space-y-4 text-sm font-semibold">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#E3232A] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block font-bold">Ünvan:</span>
                  <span>Tovuz şəhəri, M. Şəhriyar küçəsi</span>
                </div>
              </li>
              
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-[#2B4C9B] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block font-bold">İş Saatları:</span>
                  <span>Hər gün: 09:00 - 17:00</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block font-bold">Telefon (WhatsApp):</span>
                  <a href="tel:+994513150500" className="hover:text-white transition-colors">
                    +994 (51) 315 05 00
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block font-bold">E-mail:</span>
                  <a href="mailto:info@medicalcentertovuz.az" className="hover:text-white transition-colors">
                    info@medicalcentertovuz.az
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Google Maps (5 columns) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-white text-base font-extrabold tracking-wider uppercase">
              Xəritədə Ünvanımız
            </h4>
            
            {/* Map wrapper for sizing */}
            <div className="map-container relative w-full h-56 rounded-xl overflow-hidden shadow-lg border border-slate-800">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1064.8043417585466!2d45.606586391201105!3d40.9875792028244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4040db726a098599%3A0xa387b6b9399a731d!2sMedical%20Center!5e0!3m2!1str!2saz!4v1781952700534!5m2!1str!2saz"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs font-semibold border-t border-slate-800/60 pb-4">
          <p>© {currentYear} MEDİCAL CENTER Tibb Mərkəzi. Bütün hüquqlar qorunur.</p>
          <span className="text-slate-500">Tovuz, Azərbaycan</span>
        </div>

        {/* Pixel Digital Services Special Attribution Bar */}
        <div className="mt-4 pt-2 text-center text-xs font-medium tracking-wide">
          <p className="inline-flex flex-wrap items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-slate-900/60 border border-slate-800/80 text-slate-400 shadow-inner">
            <span>Sayt</span>
            <a
              href="https://www.instagram.com/pixel_digital_services/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E3232A] hover:text-[#ff383e] font-extrabold underline transition-all duration-300 hover:scale-105 inline-flex items-center gap-1 uppercase tracking-wider"
            >
              Pixel Digital Services
            </a>
            <span>tərəfindən hazırlanmışdır.</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
