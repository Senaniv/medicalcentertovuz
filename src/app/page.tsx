import React from "react";
import Header from "@/components/Header";
import WelcomePopup from "@/components/WelcomePopup";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Doctors from "@/components/Doctors";
import Testimonials from "@/components/Testimonials";
import InsurancePartners from "@/components/InsurancePartners";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      {/* Expiration-checked pop-up system */}
      <WelcomePopup />

      {/* Main navigation header */}
      <Header />

      {/* Main page content sections */}
      <main className="flex-grow">
        <Hero />
        <Services />
        <Doctors />
        <Testimonials />
        <Blog />
        <InsurancePartners />
      </main>

      {/* Main contact details & Map footer */}
      <Footer />

      {/* Floating interactive chat button */}
      <WhatsAppButton />
    </>
  );
}
