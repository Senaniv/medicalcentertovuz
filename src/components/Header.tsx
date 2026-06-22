"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Calendar } from "lucide-react";
import Logo from "./Logo";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Change background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Ana Səhifə", href: "/#home" },
    { name: "Xidmətlər", href: "/#services" },
    { name: "Həkimlərimiz", href: "/#doctors" },
    { name: "Bloq", href: "/#blog" },
    { name: "Əlaqə", href: "/#contact" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsOpen(false);
    
    // Smooth scroll if on the home page
    if (pathname === "/" && href.startsWith("/#")) {
      e.preventDefault();
      const id = href.replace("/#", "");
      const element = document.getElementById(id);
      if (element) {
        const offset = 80; // height of sticky header
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
  };

  const handleAppointmentClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    setIsOpen(false);
    if (pathname === "/") {
      e.preventDefault();
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
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-2"
          : "bg-white py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-slate-600 hover:text-primary font-semibold text-sm transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Appointment CTA */}
          <div className="hidden md:block">
            <Link
              href="/#appointment"
              onClick={handleAppointmentClick}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-hover text-white px-5 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm"
            >
              <Calendar className="h-4 w-4" />
              Randevu Al
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-primary p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-xl transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="block text-slate-700 hover:text-primary hover:bg-slate-50 px-3 py-2 rounded-md font-bold text-base transition-colors"
            >
              {link.name}
            </Link>
          ))}
          
          <Link
            href="/#appointment"
            onClick={handleAppointmentClick}
            className="flex w-full items-center justify-center gap-2 bg-secondary hover:bg-secondary-hover text-white px-4 py-3 rounded-xl font-bold shadow-md transition-all text-center mt-4"
          >
            <Calendar className="h-5 w-5" />
            Randevu Al
          </Link>
        </div>
      </div>
    </header>
  );
}
