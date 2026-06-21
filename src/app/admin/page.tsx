"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp, Doctor, ServiceItem, BlogItem, Testimonial, Appointment } from "@/context/AppContext";
import Logo from "@/components/Logo";
import { savePopupSettings } from "@/app/actions/popup";
import {
  Settings,
  Users,
  Briefcase,
  FileText,
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  ExternalLink,
  Calendar,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  Search,
  Check,
  PhoneCall,
  Clock
} from "lucide-react";

type ActiveTab = "popup" | "appointments" | "doctors" | "services" | "blogs" | "testimonials";

export default function AdminPanel() {
  const {
    doctors,
    services,
    blogs,
    testimonials,
    popupSettings,
    appointments,
    heroBgImage,
    telegramSettings,
    isLoaded,
    updatePopupSettings,
    updateAppointmentStatus,
    deleteAppointment,
    updateHeroBgImage,
    updateTelegramSettings,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    addService,
    updateService,
    deleteService,
    addBlog,
    updateBlog,
    deleteBlog,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial
  } = useApp();

  const [activeTab, setActiveTab] = useState<ActiveTab>("popup");

  // Editing States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form States - Doctor
  const [docForm, setDocForm] = useState<Omit<Doctor, "id">>({
    name: "",
    specialty: "",
    image: "",
    experience: "",
    education: ""
  });

  // Form States - Service
  const [srvForm, setSrvForm] = useState<Omit<ServiceItem, "id">>({
    title: "",
    description: "",
    details: [],
    iconName: "Activity"
  });
  const [srvDetailsInput, setSrvDetailsInput] = useState("");

  // Form States - Blog
  const [blogForm, setBlogForm] = useState<Omit<BlogItem, "id">>({
    title: "",
    summary: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
    author: "",
    readTime: ""
  });

  // Form States - Testimonials
  const [testForm, setTestForm] = useState<Omit<Testimonial, "id">>({
    sender: "",
    location: "",
    message: "",
    image: ""
  });

  // Pop-up form state (starts uninitialized to prevent layout flash)
  const [popupImageUrl, setPopupImageUrl] = useState("");
  const [popupExpDate, setPopupExpDate] = useState("");
  const [popupActive, setPopupActive] = useState(false);
  const [heroBgInput, setHeroBgInput] = useState(heroBgImage);
  const [isSavingPopup, setIsSavingPopup] = useState(false);

  // Sync form states only when settings data is fully present
  useEffect(() => {
    if (isLoaded && popupSettings && popupSettings.imageUrl) {
      setPopupImageUrl(popupSettings.imageUrl);
      setPopupExpDate(popupSettings.expirationDate);
      setPopupActive(popupSettings.active);
    }
  }, [isLoaded, popupSettings]);

  // Telegram Settings state
  const [botTokenInput, setBotTokenInput] = useState(telegramSettings.botToken);
  const [chatIdInput, setChatIdInput] = useState(telegramSettings.chatId);
  const [telegramActive, setTelegramActive] = useState(telegramSettings.active);

  // Appointments Search & Filter States
  const [appSearch, setAppSearch] = useState("");
  const [appFilterStatus, setAppFilterStatus] = useState<string>("all");

  // Helper: Read file as Base64 string
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setField: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setField(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isLoaded || !popupImageUrl) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-bold text-sm">Məlumatlar yüklənir...</p>
        </div>
      </div>
    );
  }

  // Check if popup expired
  const isPopupExpired = () => {
    const cur = new Date();
    const exp = new Date(popupSettings.expirationDate);
    exp.setHours(23, 59, 59, 999);
    return cur > exp;
  };

  // Popup Submit
  const handlePopupSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPopup(true);
    try {
      const res = await savePopupSettings({
        active: popupActive,
        expirationDate: popupExpDate,
        imageUrl: popupImageUrl,
        imageRef: popupSettings.imageRef,
      });

      if (res.success && res.data) {
        updatePopupSettings({
          imageUrl: res.data.imageUrl,
          expirationDate: res.data.expirationDate,
          active: res.data.active,
          imageRef: res.data.imageRef,
        });
        alert("Pop-up parametrləri uğurla yeniləndi!");
      } else {
        alert("Xəta baş verdi: " + res.error);
      }
    } catch (err: any) {
      alert("Xəta baş verdi: " + (err.message || String(err)));
    } finally {
      setIsSavingPopup(false);
    }
  };

  // Telegram Submit
  const handleTelegramSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTelegramSettings({
      botToken: botTokenInput,
      chatId: chatIdInput,
      active: telegramActive
    });
    alert("Telegram bildiriş parametrləri uğurla yeniləndi!");
  };

  // Doctor Action
  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    const docData = {
      ...docForm,
      image: docForm.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop"
    };

    if (editingId) {
      updateDoctor(editingId, docData);
      setEditingId(null);
    } else {
      addDoctor(docData);
      setIsAdding(false);
    }
    
    setDocForm({ name: "", specialty: "", image: "", experience: "", education: "" });
  };

  const handleEditDoctorClick = (doc: Doctor) => {
    setEditingId(doc.id);
    setDocForm({
      name: doc.name,
      specialty: doc.specialty,
      image: doc.image,
      experience: doc.experience || "",
      education: doc.education || ""
    });
    setIsAdding(true);
  };

  // Service Action
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    const detailsArr = srvDetailsInput
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    const srvData = {
      ...srvForm,
      details: detailsArr
    };

    if (editingId) {
      updateService(editingId, srvData);
      setEditingId(null);
    } else {
      addService(srvData);
      setIsAdding(false);
    }

    setSrvForm({ title: "", description: "", details: [], iconName: "Activity" });
    setSrvDetailsInput("");
  };

  const handleEditServiceClick = (srv: ServiceItem) => {
    setEditingId(srv.id);
    setSrvForm({
      title: srv.title,
      description: srv.description,
      details: srv.details,
      iconName: srv.iconName
    });
    setSrvDetailsInput(srv.details.join(", "));
    setIsAdding(true);
  };

  // Blog Action
  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Automatically calculate reading time (omitted from panel input form)
    const words = blogForm.content.trim().split(/\s+/).length;
    const computedReadTime = Math.max(1, Math.ceil(words / 150)) + " dəq";

    const blogData = {
      ...blogForm,
      readTime: computedReadTime
    };

    if (editingId) {
      updateBlog(editingId, blogData);
      setEditingId(null);
    } else {
      addBlog(blogData);
      setIsAdding(false);
    }

    setBlogForm({
      title: "",
      summary: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
      author: "",
      readTime: ""
    });
  };

  const handleEditBlogClick = (blog: BlogItem) => {
    setEditingId(blog.id);
    setBlogForm({
      title: blog.title,
      summary: blog.summary,
      content: blog.content,
      date: blog.date,
      author: blog.author,
      readTime: blog.readTime
    });
    setIsAdding(true);
  };

  // Testimonials Action
  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    const testData = {
      ...testForm,
      image: testForm.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
    };

    if (editingId) {
      updateTestimonial(editingId, testData);
      setEditingId(null);
    } else {
      addTestimonial(testData);
      setIsAdding(false);
    }

    setTestForm({ sender: "", location: "", message: "", image: "" });
  };

  const handleEditTestimonialClick = (test: Testimonial) => {
    setEditingId(test.id);
    setTestForm({
      sender: test.sender,
      location: test.location,
      message: test.message,
      image: test.image
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setDocForm({ name: "", specialty: "", image: "", experience: "", education: "" });
    setSrvForm({ title: "", description: "", details: [], iconName: "Activity" });
    setSrvDetailsInput("");
    setBlogForm({
      title: "",
      summary: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
      author: "",
      readTime: ""
    });
    setTestForm({ sender: "", location: "", message: "", image: "" });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <Logo size="sm" showText={true} />
          <span className="h-6 w-px bg-slate-200 hidden sm:block" />
          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest hidden sm:block">
            İdarəetmə Paneli
          </span>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold shadow-md transition-colors"
        >
          Saytı Göstər
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </header>

      {/* Main Grid */}
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-4 space-y-2 flex-shrink-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 mb-2">
            İdarəetmə Menyusu
          </p>

          <button
            onClick={() => { setActiveTab("popup"); handleCancel(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "popup"
                ? "bg-[#2B4C9B]/10 text-[#2B4C9B]"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Settings className="h-4 w-4" />
            Pop-up & Fon Ayarları
          </button>

          <button
            onClick={() => { setActiveTab("appointments"); handleCancel(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all relative ${
              activeTab === "appointments"
                ? "bg-[#2B4C9B]/10 text-[#2B4C9B]"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Randevular
            {appointments.filter(a => a.status === "pending").length > 0 && (
              <span className="absolute right-3 top-2.5 bg-secondary text-white text-[10px] px-1.5 py-0.5 rounded-full font-extrabold animate-pulse">
                {appointments.filter(a => a.status === "pending").length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab("doctors"); handleCancel(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "doctors"
                ? "bg-[#2B4C9B]/10 text-[#2B4C9B]"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Users className="h-4 w-4" />
            Həkimlər
          </button>

          <button
            onClick={() => { setActiveTab("services"); handleCancel(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "services"
                ? "bg-[#2B4C9B]/10 text-[#2B4C9B]"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            Xidmətlər
          </button>

          <button
            onClick={() => { setActiveTab("blogs"); handleCancel(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "blogs"
                ? "bg-[#2B4C9B]/10 text-[#2B4C9B]"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <FileText className="h-4 w-4" />
            Məqalələr (Bloq)
          </button>

          <button
            onClick={() => { setActiveTab("testimonials"); handleCancel(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "testimonials"
                ? "bg-[#2B4C9B]/10 text-[#2B4C9B]"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Rəylər (Testimonials)
          </button>
        </aside>

        {/* Dashboard Area */}
        <main className="flex-grow p-6 sm:p-8 overflow-y-auto">
          
          {/* TAB: APPOINTMENTS */}
          {activeTab === "appointments" && (
            <div className="space-y-6 animate-fade-in">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-primary" />
                    Randevu İdarəetmə Sistemi
                  </h2>
                  <p className="text-slate-500 text-xs font-semibold mt-1">
                    Pasiyentlərin müraciətlərini izləyin, statusunu dəyişin və WhatsApp/zəng ilə təsdiqləyin.
                  </p>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                {/* Search */}
                <div className="relative flex-grow max-w-md">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Ad, nömrə və ya kod ilə axtar..."
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-700 bg-slate-50 focus:bg-white transition-all animate-none"
                  />
                </div>

                {/* Status Tabs */}
                <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
                  {[
                    { id: "all", label: "Hamısı" },
                    { id: "pending", label: "Gözləyir" },
                    { id: "confirmed", label: "Təsdiqləndi" },
                    { id: "completed", label: "Tamamlandı" },
                    { id: "cancelled", label: "Ləğv edilib" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setAppFilterStatus(tab.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        appFilterStatus === tab.id
                          ? "bg-white text-slate-800 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {tab.label}
                      {tab.id !== "all" && appointments.filter(a => a.status === tab.id).length > 0 && (
                        <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                          tab.id === "pending" ? "bg-yellow-100 text-yellow-700" :
                          tab.id === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                          tab.id === "completed" ? "bg-slate-100 text-slate-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {appointments.filter(a => a.status === tab.id).length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* List Grid */}
              <div className="grid grid-cols-1 gap-4">
                {appointments
                  .filter((app) => {
                    const matchesSearch = 
                      app.name.toLowerCase().includes(appSearch.toLowerCase()) ||
                      app.phone.includes(appSearch) ||
                      app.id.toLowerCase().includes(appSearch.toLowerCase());
                      
                    const matchesStatus = appFilterStatus === "all" || app.status === appFilterStatus;
                    
                    return matchesSearch && matchesStatus;
                  })
                  .length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-bold text-sm">Heç bir randevu müraciəti tapılmadı.</p>
                  </div>
                ) : (
                  appointments
                    .filter((app) => {
                      const matchesSearch = 
                        app.name.toLowerCase().includes(appSearch.toLowerCase()) ||
                        app.phone.includes(appSearch) ||
                        app.id.toLowerCase().includes(appSearch.toLowerCase());
                        
                      const matchesStatus = appFilterStatus === "all" || app.status === appFilterStatus;
                      
                      return matchesSearch && matchesStatus;
                    })
                    .map((app) => {
                      const doc = doctors.find((d) => d.id === app.doctorId);
                      const srv = services.find((s) => s.id === app.serviceId);

                      return (
                        <div
                          key={app.id}
                          className={`bg-white rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${
                            app.status === "pending" ? "border-yellow-200 bg-yellow-50/5" :
                            app.status === "confirmed" ? "border-emerald-200" :
                            app.status === "completed" ? "border-slate-100" :
                            "border-red-200"
                          }`}
                        >
                          {/* Status bar */}
                          <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                            app.status === "pending" ? "bg-yellow-400" :
                            app.status === "confirmed" ? "bg-emerald-500" :
                            app.status === "completed" ? "bg-slate-300" :
                            "bg-red-500"
                          }`} />

                          {/* Patient info & Appointment Details */}
                          <div className="space-y-3 flex-grow md:pl-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold text-[#2B4C9B] bg-[#2B4C9B]/5 px-2 py-0.5 rounded-md font-sans">
                                {app.id}
                              </span>
                              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                app.status === "pending" ? "bg-yellow-50 text-yellow-700 border-yellow-100" :
                                app.status === "confirmed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                app.status === "completed" ? "bg-slate-50 text-slate-700 border-slate-100" :
                                "bg-red-50 text-red-700 border-red-100"
                              }`}>
                                {app.status === "pending" ? "Gözləyir" :
                                 app.status === "confirmed" ? "Təsdiqləndi" :
                                 app.status === "completed" ? "Tamamlandı" :
                                 "Ləğv edilib"}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium font-sans">
                                {new Date(app.createdAt).toLocaleString("az-AZ")}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 pt-1 text-slate-700">
                              <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">Pasiyent</span>
                                <span className="text-sm font-black">{app.name}</span>
                                <span className="text-xs text-slate-500 block font-sans">{app.phone}</span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">Xidmət / Həkim</span>
                                <span className="text-sm font-bold block">{srv?.title || "Şöbə seçilməyib"}</span>
                                <span className="text-xs text-slate-600 font-semibold">{doc?.name || "Həkim seçilməyib"}</span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">Tarix & Üsul</span>
                                <span className="text-sm font-bold block flex items-center gap-1 font-sans">
                                  <Calendar className="h-3.5 w-3.5 text-primary" />
                                  {app.date}
                                </span>
                                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                  {app.submitType === "whatsapp" ? (
                                    <span className="text-emerald-600 font-bold">WhatsApp müraciəti</span>
                                  ) : (
                                    <span className="text-[#2B4C9B] font-bold">Zəng müraciəti</span>
                                  )}
                                </span>
                              </div>
                            </div>

                            {app.notes && (
                              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-600 font-medium">
                                <span className="font-extrabold text-[10px] text-slate-400 uppercase block mb-1">Qeyd:</span>
                                {app.notes}
                              </div>
                            )}
                          </div>

                          {/* Actions block */}
                          <div className="flex flex-wrap gap-2 w-full md:w-auto items-stretch md:items-center justify-end self-stretch md:self-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                            {/* Quick WhatsApp or Call Template Təsdiqlə */}
                            {app.status === "pending" && (
                              app.submitType === "whatsapp" ? (
                                <button
                                  onClick={() => {
                                    const text = `Salam, ${app.name}. Tovuz Medical Center-dən yazırıq. Sizin ${app.date} tarixinə olan randevunuz təsdiqləndi. Randevu kodunuz: ${app.id}. Hər hansı sualınız olarsa, bu nömrəyə yaza bilərsiniz.`;
                                    const cleanPhone = app.phone.replace(/\D/g, "");
                                    let formattedPhone = cleanPhone;
                                    if (formattedPhone.startsWith("0")) {
                                      formattedPhone = "994" + formattedPhone.substring(1);
                                    } else if (!formattedPhone.startsWith("994")) {
                                      formattedPhone = "994" + formattedPhone;
                                    }
                                    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`, "_blank");
                                    updateAppointmentStatus(app.id, "confirmed");
                                  }}
                                  className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-emerald-500/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                >
                                  <MessageSquare className="h-3.5 w-3.5" />
                                  WhatsApp Təsdiq
                                </button>
                              ) : (
                                <a
                                  href={`tel:${app.phone}`}
                                  onClick={() => {
                                    updateAppointmentStatus(app.id, "confirmed");
                                  }}
                                  className="px-3 py-2 bg-[#2B4C9B] hover:bg-[#1f3770] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-primary/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                >
                                  <PhoneCall className="h-3.5 w-3.5" />
                                  Zəng ilə Təsdiqlə
                                </a>
                              )
                            )}

                            {/* Status selectors */}
                            <div className="flex gap-1">
                              {app.status !== "confirmed" && app.status !== "completed" && (
                                <button
                                  onClick={() => updateAppointmentStatus(app.id, "confirmed")}
                                  title="Təsdiqlə"
                                  className="p-2 border border-slate-200 rounded-xl hover:bg-emerald-50 text-emerald-600 hover:border-emerald-200 transition-colors"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              )}
                              {app.status !== "completed" && (
                                <button
                                  onClick={() => updateAppointmentStatus(app.id, "completed")}
                                  title="Tamamla"
                                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                              )}
                              {app.status !== "cancelled" && (
                                <button
                                  onClick={() => updateAppointmentStatus(app.id, "cancelled")}
                                  title="Ləğv et"
                                  className="p-2 border border-slate-200 rounded-xl hover:bg-red-50 text-red-600 hover:border-red-200 transition-colors"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                              {app.status !== "pending" && (
                                <button
                                  onClick={() => updateAppointmentStatus(app.id, "pending")}
                                  title="Yenidən aktiv et"
                                  className="p-2 border border-slate-200 rounded-xl hover:bg-yellow-50 text-yellow-600 hover:border-yellow-200 transition-colors"
                                >
                                  <Clock className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (confirm("Bu randevu müraciətini silmək istədiyinizdən əminsiniz?")) {
                                    deleteAppointment(app.id);
                                  }
                                }}
                                title="Sil"
                                className="p-2 border border-slate-200 rounded-xl hover:bg-red-50 text-red-600 hover:border-red-200 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          )}

          {/* TAB 1: POP-UP SETTINGS */}
          {activeTab === "popup" && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Pop-up Giriş Ekranı Nizamlamaları
                </h2>
                <p className="text-slate-500 text-xs font-semibold">
                  Bu bölmədən sayt ilk dəfə açılan zaman göstərilən reklam və ya elan bannerini idarə edə bilərsiniz.
                </p>

                {/* Expiration status check alert */}
                <div className="pt-2">
                  {popupSettings.active ? (
                    isPopupExpired() ? (
                      <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-200">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                        <span>Pop-up statusu: AKTİVDİR, lakin vaxtı bitib! Tarix keçdiyi üçün saytda göstərilmir.</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200">
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        <span>Pop-up statusu: AKTİVDİR VƏ GÖSTƏRİLİR. (Son tarixə qədər: {popupSettings.expirationDate})</span>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">
                      <X className="h-4 w-4 flex-shrink-0" />
                      <span>Pop-up statusu: DEAKTİVDİR. Saytda göstərilmir.</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handlePopupSave} className="space-y-4 pt-4 border-t border-slate-100">
                  {/* Image input from device */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                      Cihazdan Banner Şəkilini Seçin
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, setPopupImageUrl)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none text-slate-800 text-sm bg-white"
                    />
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                      Yüklənən şəkil avtomatik olaraq sayt yaddaşına yazılacaqdır.
                    </p>
                  </div>

                  {/* Expiration date */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                      Göstərilmənin Son Tarixi (Expiration Date)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <Calendar className="h-4 w-4" />
                      </span>
                      <input
                        type="date"
                        required
                        value={popupExpDate}
                        onChange={(e) => setPopupExpDate(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 text-sm bg-white"
                      />
                    </div>
                  </div>

                  {/* Active Switch */}
                  <div className="flex items-center gap-2 py-2">
                    <input
                      type="checkbox"
                      id="popupActive"
                      checked={popupActive}
                      onChange={(e) => setPopupActive(e.target.checked)}
                      className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary/20"
                    />
                    <label htmlFor="popupActive" className="text-sm font-bold text-slate-700 cursor-pointer">
                      Giriş pop-up ekranı aktiv olsun
                    </label>
                  </div>

                  {/* Save button */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSavingPopup}
                      className="inline-flex items-center gap-2 bg-[#2B4C9B] hover:bg-[#1f3770] disabled:bg-slate-400 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-md transition-colors"
                    >
                      {isSavingPopup ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {isSavingPopup ? "Yadda saxlanılır..." : "Dəyişiklikləri Yadda Saxla"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Preview Container */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-slate-800">Banner Ön Baxış</h3>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center">
                  <div className="max-w-md w-full aspect-[4/3] relative flex items-center justify-center border bg-white rounded-lg overflow-hidden shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={popupImageUrl}
                      alt="Banner Preview"
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "/images/popup-banner.png";
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Hero background image settings */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-[#2B4C9B]" />
                  Hero (Giriş) Bölməsinin Arxa Fonu
                </h2>
                <p className="text-slate-500 text-xs font-semibold">
                  Bu bölmədən saytın əsas giriş (Hero) bölməsinin arxa fon şəkilini cihazınızdan yükləyərək dəyişə bilərsiniz.
                </p>

                <div className="space-y-4 pt-2 border-t border-slate-100">
                  {/* File selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                      Yeni Fon Şəkili Seçin
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, (base64) => {
                        setHeroBgInput(base64);
                        updateHeroBgImage(base64);
                        alert("Hero arxa fon şəkili uğurla yeniləndi!");
                      })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none text-slate-800 text-sm bg-white"
                    />
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold font-sans">
                      Fon şəkili dərhal yenilənəcək və saytda tətbiq olunacaqdır.
                    </p>
                  </div>

                  {/* Preview of current/uploaded hero background */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-600 block">Mövcud Fon Şəkilinin Ön Baxışı</span>
                    <div 
                      className="w-full h-40 rounded-xl bg-cover bg-center border border-slate-200 relative overflow-hidden shadow-inner flex items-center justify-center font-sans"
                      style={{ backgroundImage: `url(${heroBgInput})` }}
                    >
                      <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center p-4">
                        <div className="text-center space-y-2">
                          <span className="text-[10px] font-black uppercase text-slate-400 block tracking-widest">Hero Mətni Oxunaqlıq Testi</span>
                          <h4 className="text-xl font-black text-[#1E293B]">
                            Sağlamlığınız <span className="text-[#2B4C9B]">Bizim</span> <span className="text-[#E3232A]">Dəyərimizdir</span>
                          </h4>
                          <span className="text-[10px] text-slate-500 font-bold block max-w-xs mx-auto">
                            (Fon şəkilinin üzərinə zərif ağ filtr tətbiq edilir ki, ön plandakı yazılar tam aydın oxunsun)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Telegram Notifications Settings */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                  <PhoneCall className="h-5 w-5 text-primary" />
                  Telegram Bildiriş Nizamlamaları
                </h2>
                <p className="text-slate-500 text-xs font-semibold">
                  Yeni müraciətlər gəldiyi zaman Telegram bot vasitəsilə telefonunuza dərhal səsli bildiriş almaq üçün bura Bot Token və Chat ID qeyd edin.
                </p>

                <form onSubmit={handleTelegramSave} className="space-y-4 pt-2 border-t border-slate-100">
                  {/* Bot Token */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 font-sans">
                      Telegram Bot Token
                    </label>
                    <input
                      type="text"
                      placeholder="Məs: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                      value={botTokenInput}
                      onChange={(e) => setBotTokenInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 text-sm bg-white"
                    />
                    <p className="text-[9px] text-slate-400 mt-1 font-semibold">
                      Telegram-da @BotFather vasitəsilə yaratdığınız botun tokenini bura daxil edin.
                    </p>
                  </div>

                  {/* Chat ID */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 font-sans">
                      Telegram Chat ID (və ya Qrup ID)
                    </label>
                    <input
                      type="text"
                      placeholder="Məs: 987654321 və ya -100123456789"
                      value={chatIdInput}
                      onChange={(e) => setChatIdInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 text-sm bg-white"
                    />
                    <p className="text-[9px] text-slate-400 mt-1 font-semibold">
                      Botdan bildiriş alacaq şəxsi hesabınızın və ya əlavə etdiyiniz qrupun ID nömrəsini daxil edin.
                    </p>
                  </div>

                  {/* Active Switch */}
                  <div className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      id="telegramActive"
                      checked={telegramActive}
                      onChange={(e) => setTelegramActive(e.target.checked)}
                      className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary/20 cursor-pointer"
                    />
                    <label htmlFor="telegramActive" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                      Telegram bildirişləri aktiv olsun
                    </label>
                  </div>

                  {/* Save button */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-[#2B4C9B] hover:bg-[#1f3770] text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-md transition-colors cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                      Nizamlamaları Yadda Saxla
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: DOCTORS CRUD */}
          {activeTab === "doctors" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-800">Həkimlər Məlumat Bazası</h2>
                  <p className="text-slate-500 text-xs font-semibold mt-1">
                    Saytda göstərilən həkimlərin siyahısını redaktə edin, silin və ya yenisini əlavə edin.
                  </p>
                </div>
                {!isAdding && (
                  <button
                    onClick={() => { setIsAdding(true); setEditingId(null); }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Yeni Həkim Əlavə Et
                  </button>
                )}
              </div>

              {/* Add / Edit Form */}
              {isAdding && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm max-w-2xl animate-fade-in">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                    <h3 className="text-base font-extrabold text-slate-800">
                      {editingId ? "Həkim Məlumatlarını Yenilə" : "Yeni Həkim Qeydiyyatı"}
                    </h3>
                    <button
                      onClick={handleCancel}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveDoctor} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Həkimin Adı, Soyadı *</label>
                        <input
                          type="text"
                          required
                          value={docForm.name}
                          onChange={(e) => setDocForm({ ...docForm, name: e.target.value })}
                          placeholder="Məs. Dr. Elnur Əliyev"
                          className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">İxtisası *</label>
                        <input
                          type="text"
                          required
                          value={docForm.specialty}
                          onChange={(e) => setDocForm({ ...docForm, specialty: e.target.value })}
                          placeholder="Məs. Fizioterapevt"
                          className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Təcrübə müddəti</label>
                        <input
                          type="text"
                          value={docForm.experience}
                          onChange={(e) => setDocForm({ ...docForm, experience: e.target.value })}
                          placeholder="Məs. 12 il"
                          className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Təhsili</label>
                        <input
                          type="text"
                          value={docForm.education}
                          onChange={(e) => setDocForm({ ...docForm, education: e.target.value })}
                          placeholder="Məs. Azərbaycan Tibb Universiteti"
                          className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 text-sm"
                        />
                      </div>
                    </div>

                    {/* File selector for doctor photo */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Cihazdan Həkim Şəkilini Seçin *</label>
                      <input
                        type="file"
                        accept="image/*"
                        required={!editingId && !docForm.image}
                        onChange={(e) => handleImageChange(e, (val) => setDocForm({ ...docForm, image: val }))}
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none text-slate-800 text-sm bg-white"
                      />
                      {docForm.image && (
                        <div className="mt-2 flex items-center gap-2.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={docForm.image} alt="Preview" className="w-12 h-16 object-cover rounded-lg border" />
                          <span className="text-[10px] text-slate-400 font-semibold">Şəkil uğurla seçildi.</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-xs font-bold hover:bg-slate-50"
                      >
                        Ləğv Et
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-colors"
                      >
                        <Save className="h-3.5 w-3.5" />
                        Yadda Saxla
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Data Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-400 uppercase">
                      <tr>
                        <th className="p-4">Həkim</th>
                        <th className="p-4">İxtisas</th>
                        <th className="p-4">Təcrübə</th>
                        <th className="p-4">Təhsil</th>
                        <th className="p-4 text-center">Əməliyyatlar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm font-semibold">
                      {doctors.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={doc.image}
                              alt={doc.name}
                              className="w-10 h-10 rounded-full object-cover object-top border border-slate-100 flex-shrink-0"
                              onError={(e) => {
                                e.currentTarget.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${doc.name}`;
                              }}
                            />
                            <span className="text-slate-800 font-extrabold">{doc.name}</span>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#2B4C9B]/5 text-primary">
                              {doc.specialty}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500 font-bold">{doc.experience || "-"}</td>
                          <td className="p-4 text-slate-500 max-w-xs truncate">{doc.education || "-"}</td>
                          <td className="p-4 text-center">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => handleEditDoctorClick(doc)}
                                className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-all"
                                title="Düzəliş Et"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`${doc.name} məlumatlarını silmək istədiyinizdən əminsiniz?`)) {
                                    deleteDoctor(doc.id);
                                  }
                                }}
                                className="p-2 text-slate-400 hover:text-secondary hover:bg-slate-100 rounded-lg transition-all"
                                title="Sil"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES CRUD */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-800">Tibbi Xidmətlər Şöbəsi</h2>
                  <p className="text-slate-500 text-xs font-semibold mt-1">
                    Göstərilən xidmət kartlarının məzmununu, ikonunu və detallarını idarə edin.
                  </p>
                </div>
                {!isAdding && (
                  <button
                    onClick={() => { setIsAdding(true); setEditingId(null); }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Yeni Xidmət Əlavə Et
                  </button>
                )}
              </div>

              {/* Add / Edit Form */}
              {isAdding && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm max-w-2xl animate-fade-in">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                    <h3 className="text-base font-extrabold text-slate-800">
                      {editingId ? "Xidmət Məlumatlarını Dəyiş" : "Yeni Tibbi Şöbə Əlavə Et"}
                    </h3>
                    <button
                      onClick={handleCancel}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveService} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Şöbə / Xidmət Adı *</label>
                        <input
                          type="text"
                          required
                          value={srvForm.title}
                          onChange={(e) => setSrvForm({ ...srvForm, title: e.target.value })}
                          placeholder="Məs. Laboratoriya"
                          className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">İkon Adı (Lucide) *</label>
                        <select
                          value={srvForm.iconName}
                          onChange={(e) => setSrvForm({ ...srvForm, iconName: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 text-sm bg-white"
                        >
                          <option value="Activity">Activity (USM)</option>
                          <option value="FlaskConical">FlaskConical (Laboratoriya)</option>
                          <option value="Radio">Radio (KT/Rentgen)</option>
                          <option value="Accessibility">Accessibility (Fizioterapiya)</option>
                          <option value="HeartHandshake">HeartHandshake (Ginekologiya)</option>
                          <option value="HeartPulse">HeartPulse (Kardiologiya)</option>
                          <option value="Brain">Brain (Nevrologiya)</option>
                          <option value="ShieldAlert">ShieldAlert (Urologiya)</option>
                          <option value="Footprints">Footprints (İçliklər)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Qısa Təsviri *</label>
                      <input
                        type="text"
                        required
                        value={srvForm.description}
                        onChange={(e) => setSrvForm({ ...srvForm, description: e.target.value })}
                        placeholder="Məs. Müasir cihazlarla yüksək dəqiqlikli analizlər."
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                        Xidmət Alt Detalları (Vergüllə ayırın)
                      </label>
                      <input
                        type="text"
                        value={srvDetailsInput}
                        onChange={(e) => setSrvDetailsInput(e.target.value)}
                        placeholder="Məs. 1-2 saat nəticələr, Avtomatlaşdırılmış cihazlar, Dəqiq analiz"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 text-sm"
                      />
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                        Göstərilən alt bəndlərin siyahısı üçün detalları vergüllə ayrılmış yazın.
                      </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-xs font-bold hover:bg-slate-50"
                      >
                        Ləğv Et
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-colors"
                      >
                        <Save className="h-3.5 w-3.5" />
                        Yadda Saxla
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Data Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-400 uppercase">
                      <tr>
                        <th className="p-4">İkon</th>
                        <th className="p-4">Xidmət Adı</th>
                        <th className="p-4">Qısa Təsvir</th>
                        <th className="p-4">Detallar</th>
                        <th className="p-4 text-center">Əməliyyatlar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm font-semibold">
                      {services.map((srv) => (
                        <tr key={srv.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 text-primary font-bold">{srv.iconName}</td>
                          <td className="p-4 text-slate-800 font-extrabold">{srv.title}</td>
                          <td className="p-4 text-slate-500 font-medium max-w-xs truncate">{srv.description}</td>
                          <td className="p-4 text-slate-400 text-xs">
                            <div className="flex flex-wrap gap-1">
                              {srv.details.map((d, i) => (
                                <span key={i} className="px-1.5 py-0.5 bg-slate-100 rounded border font-semibold">
                                  {d}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => handleEditServiceClick(srv)}
                                className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-all"
                                title="Düzəliş Et"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`${srv.title} xidmətini silmək istədiyinizdən əminsiniz?`)) {
                                    deleteService(srv.id);
                                  }
                                }}
                                className="p-2 text-slate-400 hover:text-secondary hover:bg-slate-100 rounded-lg transition-all"
                                title="Sil"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BLOGS CRUD (No readTime input field) */}
          {activeTab === "blogs" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-800">Məqalələr & Bloq Bölməsi</h2>
                  <p className="text-slate-500 text-xs font-semibold mt-1">
                    Saytda göstərilən məqalələri əlavə edin, redaktə edin və ya silin. (Oxuma müddəti mətnin uzunluğuna əsasən avtomatik hesablanır).
                  </p>
                </div>
                {!isAdding && (
                  <button
                    onClick={() => { setIsAdding(true); setEditingId(null); }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Yeni Məqalə Yaz
                  </button>
                )}
              </div>

              {/* Add / Edit Form */}
              {isAdding && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm max-w-3xl animate-fade-in">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                    <h3 className="text-base font-extrabold text-slate-800">
                      {editingId ? "Məqalədə Düzəliş Et" : "Yeni Bloq Məqaləsi Qələmə Al"}
                    </h3>
                    <button
                      onClick={handleCancel}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveBlog} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Məqalə Başlığı *</label>
                        <input
                          type="text"
                          required
                          value={blogForm.title}
                          onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                          placeholder="Məs. Düzgün USM müayinəsinin əhəmiyyəti"
                          className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Müəllif Həkim *</label>
                        <input
                          type="text"
                          required
                          value={blogForm.author}
                          onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                          placeholder="Məs. Dr. Şəhla Həsənova"
                          className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tarix *</label>
                        <input
                          type="date"
                          required
                          value={blogForm.date}
                          onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 text-sm bg-white"
                        />
                      </div>
                      <div className="hidden sm:block" />
                      <div className="hidden sm:block" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Qısa Xülasə *</label>
                      <input
                        type="text"
                        required
                        value={blogForm.summary}
                        onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                        placeholder="Məqalənin qısa bir-iki cümləlik xülasəsi."
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Məqalə Mətni (Tam) *</label>
                      <textarea
                        required
                        rows={6}
                        value={blogForm.content}
                        onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                        placeholder="Məqalə mətni bura daxil edin..."
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 text-sm resize-y"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-xs font-bold hover:bg-slate-50"
                      >
                        Ləğv Et
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-colors"
                      >
                        <Save className="h-3.5 w-3.5" />
                        Yadda Saxla
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Data Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-400 uppercase">
                      <tr>
                        <th className="p-4">Başlıq</th>
                        <th className="p-4">Müəllif</th>
                        <th className="p-4">Tarix</th>
                        <th className="p-4">Oxuma vaxtı (Hesablanmış)</th>
                        <th className="p-4 text-center">Əməliyyatlar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm font-semibold">
                      {blogs.map((blog) => (
                        <tr key={blog.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 text-slate-800 font-extrabold max-w-xs truncate">{blog.title}</td>
                          <td className="p-4 text-slate-600 font-bold">{blog.author}</td>
                          <td className="p-4 text-slate-500">{blog.date}</td>
                          <td className="p-4 text-slate-400 font-bold">{blog.readTime || "Hesablanır..."}</td>
                          <td className="p-4 text-center">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => handleEditBlogClick(blog)}
                                className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-all"
                                title="Düzəliş Et"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`${blog.title} məqaləsini silmək istədiyinizdən əminsiniz?`)) {
                                    deleteBlog(blog.id);
                                  }
                                }}
                                className="p-2 text-slate-400 hover:text-secondary hover:bg-slate-100 rounded-lg transition-all"
                                title="Sil"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TESTIMONIALS CRUD */}
          {activeTab === "testimonials" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-800">Rəylər (Pasiyent Geri Bildirişləri)</h2>
                  <p className="text-slate-500 text-xs font-semibold mt-1">
                    Saytın karuselində göstərilən pasiyent rəylərini idarə edin, əlavə edin və silin.
                  </p>
                </div>
                {!isAdding && (
                  <button
                    onClick={() => { setIsAdding(true); setEditingId(null); }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Yeni Rəy Əlavə Et
                  </button>
                )}
              </div>

              {/* Add / Edit Form */}
              {isAdding && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm max-w-2xl animate-fade-in">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                    <h3 className="text-base font-extrabold text-slate-800">
                      {editingId ? "Rəyi Yenilə" : "Yeni Pasiyent Rəyi Əlavə Et"}
                    </h3>
                    <button
                      onClick={handleCancel}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveTestimonial} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Pasiyentin Adı *</label>
                        <input
                          type="text"
                          required
                          value={testForm.sender}
                          onChange={(e) => setTestForm({ ...testForm, sender: e.target.value })}
                          placeholder="Məs. Elnur Məmmədov"
                          className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Müayinə növü / Mövzu *</label>
                        <input
                          type="text"
                          required
                          value={testForm.location}
                          onChange={(e) => setTestForm({ ...testForm, location: e.target.value })}
                          placeholder="Məs. Fizioterapiya üzrə Pasiyent"
                          className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Rəy Mətni *</label>
                      <textarea
                        required
                        rows={4}
                        value={testForm.message}
                        onChange={(e) => setTestForm({ ...testForm, message: e.target.value })}
                        placeholder="Pasiyentin səmimi rəyi..."
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 text-sm resize-y"
                      />
                    </div>

                    {/* File selector for review profile */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Cihazdan Pasiyent Şəkilini Seçin *</label>
                      <input
                        type="file"
                        accept="image/*"
                        required={!editingId && !testForm.image}
                        onChange={(e) => handleImageChange(e, (val) => setTestForm({ ...testForm, image: val }))}
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none text-slate-800 text-sm bg-white"
                      />
                      {testForm.image && (
                        <div className="mt-2 flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={testForm.image} alt="Preview" className="w-12 h-12 rounded-full object-cover border" />
                          <span className="text-[10px] text-slate-400 font-semibold">Şəkil seçildi.</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-xs font-bold hover:bg-slate-50"
                      >
                        Ləğv Et
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-colors"
                      >
                        <Save className="h-3.5 w-3.5" />
                        Yadda Saxla
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Data Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-400 uppercase">
                      <tr>
                        <th className="p-4">Pasiyent</th>
                        <th className="p-4">Mövzu / Qrup</th>
                        <th className="p-4">Rəy</th>
                        <th className="p-4 text-center">Əməliyyatlar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm font-semibold">
                      {testimonials.map((test) => (
                        <tr key={test.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={test.image}
                              alt={test.sender}
                              className="w-10 h-10 rounded-full object-cover border border-slate-100 flex-shrink-0"
                              onError={(e) => {
                                e.currentTarget.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${test.sender}`;
                              }}
                            />
                            <span className="text-slate-800 font-extrabold">{test.sender}</span>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              {test.location}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500 font-medium max-w-sm truncate italic">"{test.message}"</td>
                          <td className="p-4 text-center">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => handleEditTestimonialClick(test)}
                                className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-all"
                                title="Düzəliş Et"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`${test.sender} rəyini silmək istədiyinizdən əminsiniz?`)) {
                                    deleteTestimonial(test.id);
                                  }
                                }}
                                className="p-2 text-slate-400 hover:text-secondary hover:bg-slate-100 rounded-lg transition-all"
                                title="Sil"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
