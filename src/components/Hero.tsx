"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Calendar, User, Phone, CheckCircle2, ChevronRight, Clock } from "lucide-react";
import confetti from "canvas-confetti";
import DatePicker from "./DatePicker";
import { sendAppointmentNotification } from "@/app/actions/telegram";

export default function Hero() {
  const { services, addAppointment, heroBgImage } = useApp();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    serviceId: "",
    date: "",
    notes: "",
    submitType: "whatsapp" as "whatsapp" | "call",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastCode, setLastCode] = useState("");
  const [lastSubmitType, setLastSubmitType] = useState<"whatsapp" | "call">("whatsapp");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date) {
      alert("Zəhmət olmasa Ad, Telefon və Tarix sahələrini doldurun.");
      return;
    }

    setIsSubmitting(true);
    const randCode = `MC-${Math.floor(1000 + Math.random() * 9000)}`;

    // Save to local context state
    addAppointment({
      id: randCode,
      name: formData.name,
      phone: formData.phone,
      serviceId: formData.serviceId,
      date: formData.date,
      notes: formData.notes,
      submitType: formData.submitType,
    });

    // Send Telegram Notification to Admin via Server Action
    // (reads settings directly from Sanity — works on mobile even before client state loads)
    const serviceName = services.find((s) => s.id === formData.serviceId)?.title || "Şöbə seçilməyib";
    const origin = typeof window !== "undefined" ? window.location.origin : "https://medicalcentertovuz.vercel.app";
    
    try {
      await sendAppointmentNotification({
        appId: randCode,
        name: formData.name,
        phone: formData.phone,
        date: formData.date,
        submitType: formData.submitType,
        serviceName,
        origin,
      });
    } catch (err) {
      console.error("Telegram notification error:", err);
    }

    setLastCode(randCode);
    setLastSubmitType(formData.submitType);
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Trigger confetti celebration
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#2B4C9B", "#E3232A", "#F8FAFC", "#10B981"]
    });

    // WhatsApp redirect if chosen
    if (formData.submitType === "whatsapp") {
      const serviceName = services.find(s => s.id === formData.serviceId)?.title || "Seçilməyib";
      const message = `🏥 *Yeni Randevu Müraciəti (Kod: ${randCode})*

👤 Ad Soyad: ${formData.name}
📞 Telefon: ${formData.phone}
🏷️ Xidmət: ${serviceName}
📅 Tarix: ${formData.date}
📝 Qeyd: ${formData.notes || "Yoxdur"}`;

      window.open(`https://wa.me/994513150500?text=${encodeURIComponent(message)}`, "_blank");
    }

    // Reset form
    setFormData({
      name: "",
      phone: "",
      serviceId: "",
      date: "",
      notes: "",
      submitType: "whatsapp",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section 
      id="home" 
      className="relative overflow-hidden py-12 lg:py-20 border-b border-slate-100 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroBgImage})` }}
    >
      {/* Premium Backdrop Overlay */}
      <div className="absolute inset-0 bg-white/70 pointer-events-none" />

      {/* Background Decorative Circles */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#2B4C9B]/5 -mr-48 -mt-48 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#E3232A]/5 -ml-32 -mb-32 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Slogan & Banner Text (5 columns) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2B4C9B]/10 text-primary text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Tovuzun Ən Müasir Tibb Mərkəzi
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1E293B] tracking-tight leading-tight">
              Sağlamlığınız <br className="hidden sm:inline" />
              <span className="text-[#2B4C9B]">Bizim</span>{" "}
              <span className="text-[#E3232A]">Dəyərimizdir</span>
            </h1>
            
            <p className="text-slate-600 text-lg max-w-xl mx-auto lg:mx-0 font-medium">
              Medical Center Tibb Mərkəzi ən son model texnoloji avadanlıqları və peşəkar həkim heyəti ilə Tovuzda sizin və ailənizin xidmətindədir.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
                <span className="text-emerald-500 font-bold">100%</span>
                <span className="text-slate-500 text-xs font-medium">Dəqiq Diaqnoz</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
                <span className="text-emerald-500 font-bold">1-2 saat</span>
                <span className="text-slate-500 text-xs font-medium">Laboratoriya Nəticəsi</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
                <span className="text-[#2B4C9B] font-bold">4D</span>
                <span className="text-slate-500 text-xs font-medium">Doppler USM</span>
              </div>
            </div>

            <div className="flex justify-center lg:justify-start pt-4">
              <a
                href="#services"
                className="inline-flex items-center gap-2 text-slate-800 hover:text-primary font-bold text-sm transition-colors group"
              >
                Xidmətlərimizlə tanış olun
                <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Shortcut Appointment Form (5 columns) */}
          <div id="appointment" className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />
              
              <h3 className="text-2xl font-extrabold text-[#1E293B] mb-2 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-[#2B4C9B]" />
                Sürətli Randevu
              </h3>
              <p className="text-slate-500 text-xs font-medium mb-6">
                Müayinə vaxtını indi seçin, sizə zəng edib təsdiqləyək.
              </p>

              {isSuccess ? (
                <div className="text-center py-6 space-y-4 animate-fade-in">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 mb-2">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Müraciətiniz Qəbul Edildi!</h4>
                  
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 inline-block">
                    <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider mb-0.5">Randevu Kodunuz</span>
                    <span className="text-lg font-extrabold text-[#2B4C9B] tracking-widest">{lastCode}</span>
                  </div>

                  <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                    {lastSubmitType === "whatsapp" ? (
                      <>
                        Məlumatlar klinikanın WhatsApp nömrəsinə göndərildi. Qeydiyyat şöbəmiz qısa müddətdə sizinlə əlaqə saxlayacaqdır.
                      </>
                    ) : (
                      <>
                        Təşəkkür edirik. Operatorumuz təsdiqləmə üçün ən qısa zamanda qeyd etdiyiniz telefon nömrəsinə zəng edəcəkdir.
                      </>
                    )}
                  </p>

                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="text-xs font-bold text-[#2B4C9B] hover:text-[#1f3770] hover:underline pt-2 block mx-auto transition-colors"
                  >
                    Yeni Randevu Al
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Input */}
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Adınız, Soyadınız *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <User className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Məs. Elnur Əliyev"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 text-sm transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Telefon Nömrəniz *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <Phone className="h-4 w-4" />
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Məs. 050 123 45 67"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 text-sm transition-all"
                      />
                    </div>
                  </div>

                  {/* Service Select */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Müayinə/Şöbə</label>
                    <select
                      name="serviceId"
                      value={formData.serviceId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 text-sm bg-white transition-all"
                    >
                      <option value="">Şöbə seçin (İstəyə bağlı)</option>
                      {services.map((srv) => (
                        <option key={srv.id} value={srv.id}>
                          {srv.title}
                        </option>
                      ))}
                    </select>
                  </div>



                  {/* Date Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Randevu Tarixi *</label>
                    <DatePicker
                      value={formData.date}
                      onChange={(dateStr) => setFormData(prev => ({ ...prev, date: dateStr }))}
                      required={true}
                    />
                  </div>

                  {/* Submit Type Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Təsdiq (Əlaqə vasitəsi) *</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, submitType: "whatsapp" }))}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all text-left ${
                          formData.submitType === "whatsapp" 
                            ? "border-emerald-500 bg-emerald-50/50 text-emerald-700" 
                            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-xs font-bold">WhatsApp ilə</span>
                        <span className="text-[10px] opacity-75 font-medium mt-0.5 text-center leading-none text-slate-500">Daha sürətli təsdiq</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, submitType: "call" }))}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all text-left ${
                          formData.submitType === "call" 
                            ? "border-primary bg-primary/5 text-primary" 
                            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-xs font-bold font-sans">Telefon Zəngi</span>
                        <span className="text-[10px] opacity-75 font-medium mt-0.5 text-center leading-none text-slate-500">WhatsApp yoxdursa</span>
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Qeyd (İstəyə bağlı)</label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Şikayətiniz və ya əlavə qeydlər"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 text-sm transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 bg-secondary hover:bg-secondary-hover text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-secondary/20 transform hover:-translate-y-0.5 active:translate-y-0 disabled:bg-slate-400 disabled:shadow-none disabled:transform-none transition-all duration-150 flex items-center justify-center gap-2 mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="h-5 w-5 animate-spin" />
                        Göndərilir...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        Müraciəti Tamamla
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
