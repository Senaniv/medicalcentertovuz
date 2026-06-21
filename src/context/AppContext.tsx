"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getPopupSettings } from "@/app/actions/popup";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  experience?: string;
  education?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  details: string[];
  iconName: string;
}

export interface BlogItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  readTime: string;
}

export interface Testimonial {
  id: string;
  sender: string;
  location: string;
  message: string;
  image: string;
}

export interface PopupSettings {
  imageUrl: string;
  expirationDate: string;
  active: boolean;
  imageRef?: string;
}

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  serviceId: string;
  doctorId?: string;
  date: string;
  notes?: string;
  submitType: "whatsapp" | "call";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface TelegramSettings {
  botToken: string;
  chatId: string;
  active: boolean;
}

interface AppContextType {
  doctors: Doctor[];
  services: ServiceItem[];
  blogs: BlogItem[];
  testimonials: Testimonial[];
  popupSettings: PopupSettings;
  appointments: Appointment[];
  heroBgImage: string;
  telegramSettings: TelegramSettings;
  isLoaded: boolean;
  
  // Pop-up Settings
  updatePopupSettings: (settings: Partial<PopupSettings>) => void;
  updateHeroBgImage: (url: string) => void;
  updateTelegramSettings: (settings: Partial<TelegramSettings>) => void;
  sendTelegramNotification: (
    appId: string,
    name: string,
    phone: string,
    date: string,
    submitType: "whatsapp" | "call",
    serviceId: string
  ) => Promise<void>;
  
  // Appointments CRUD
  addAppointment: (app: Omit<Appointment, "status" | "createdAt">) => void;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;
  deleteAppointment: (id: string) => void;

  // Doctors CRUD
  addDoctor: (doctor: Omit<Doctor, "id">) => void;
  updateDoctor: (id: string, doctor: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  
  // Services CRUD
  addService: (service: Omit<ServiceItem, "id">) => void;
  updateService: (id: string, service: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  
  // Blogs CRUD
  addBlog: (blog: Omit<BlogItem, "id">) => void;
  updateBlog: (id: string, blog: Partial<BlogItem>) => void;
  deleteBlog: (id: string) => void;

  // Testimonials CRUD
  addTestimonial: (testimonial: Omit<Testimonial, "id">) => void;
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
}

const defaultDoctors: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Elçin Müseyibov",
    specialty: "Həkim-Laborant",
    image: "/images/doctor_male_elcin.png",
    experience: "15 il",
    education: "Azərbaycan Tibb Universiteti",
  },
  {
    id: "doc-2",
    name: "Dr. Aynur Qarayeva",
    specialty: "Fizioterapevt-Reabilitoloq",
    image: "/images/doctor_female_aynur.png",
    experience: "12 il",
    education: "Hacettepe Üniversitesi (Türkiyə)",
  },
  {
    id: "doc-3",
    name: "Dr. Reyhan Əhmədova",
    specialty: "Terapevt",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop",
    experience: "18 il",
    education: "Azərbaycan Tibb Universiteti",
  },
  {
    id: "doc-4",
    name: "Dr. Aqil Cəfərov",
    specialty: "Radioloq",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop",
    experience: "10 il",
    education: "İstanbul Üniversitesi Cerrahpaşa Tibb Fakültəsi",
  },
  {
    id: "doc-5",
    name: "Dr. Şəhla Həsənova",
    specialty: "USM mütəxəssisi",
    image: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?q=80&w=400&auto=format&fit=crop",
    experience: "14 il",
    education: "Azərbaycan Tibb Universiteti",
  },
];

const defaultServices: ServiceItem[] = [
  {
    id: "srv-1",
    title: "Laboratoriya",
    description: "Tam avtomatlaşdırılmış müasir cihazlarla yüksək dəqiqlikli analizlər.",
    details: ["Avtomatlaşdırılmış cihazlar", "1-2 saat ərzində nəticələr", "Klinik, biokimyəvi, hormonal və mikrobioloji testlər"],
    iconName: "FlaskConical",
  },
  {
    id: "srv-2",
    title: "Ultrasəs Müayinəsi (USM)",
    description: "Müasir avadanlıqlarla daxili orqanların vizuallaşdırılması.",
    details: ["4D Doppler müayinəsi", "Dölün 4D ultrasəs müayinəsi", "Rəngli doppleroqrafiya"],
    iconName: "Activity",
  },
  {
    id: "srv-3",
    title: "Radiologiya",
    description: "Kompüter Tomoqrafiyası və rəqəmsal Rentgen xidmətləri.",
    details: ["KT (Kompüter Tomoqrafiyası)", "Rəqəmsal Rentgen (X-Ray)", "Minimal şüalanma ilə dəqiq diaqnoz"],
    iconName: "Radio",
  },
  {
    id: "srv-4",
    title: "Fizioterapiya & Reabilitasiya",
    description: "Dayaq-hərəkət sistemi xəstəliklərinin müasir bərpa metodları.",
    details: ["Naftalan vannaları", "Lazer terapiyası", "Ozon terapiyası", "Elektroterapiya və masaj"],
    iconName: "Accessibility",
  },
  {
    id: "srv-5",
    title: "Ginekologiya",
    description: "Qadın sağlamlığı, hamiləliyin təqibi və ginekoloji xəstəliklərin müalicəsi.",
    details: ["Ginekoloq müayinəsi", "Hamiləliyin monitorinqi", "Kolposkopiya və ginekoloji müalicələr"],
    iconName: "HeartHandshake",
  },
  {
    id: "srv-6",
    title: "Kardiologiya",
    description: "Ürək-damar sistemi xəstəliklərinin diaqnostikası və müalicəsi.",
    details: ["EKQ (Elektrokardioqrafiya)", "Exo-KQ (Exokardioqrafiya)", "Təzyiqin 24 saatlıq monitorinqi (Holter)"],
    iconName: "HeartPulse",
  },
  {
    id: "srv-7",
    title: "Nevrologiya",
    description: "Mərkəzi və periferik sinir sistemi xəstəliklərinin müalicəsi.",
    details: ["EEQ (Elektroensefaloqrafiya)", "Baş ağrıları və miqren müalicəsi", "Yuxu pozğunluqlarının aradan qaldırılması"],
    iconName: "Brain",
  },
  {
    id: "srv-8",
    title: "Urologiya & Andrologiya",
    description: "Kişi və qadın sidik-cinsiyyət sistemi xəstəliklərinin diaqnostikası.",
    details: ["Uroloq-Androloq müayinəsi", "Böyrək və sidik kisəsi xəstəlikləri", "Kişi sonsuzluğu və androloji problemlər"],
    iconName: "ShieldAlert",
  },
  {
    id: "srv-9",
    title: "Ortopedik İçliklər Şöbəsi",
    description: "Fərdi olaraq ayaq ölçülməsi və xüsusi ortopedik içliklərin hazırlanması.",
    details: ["Ayaq pəncəsinin 2D/3D skan edilməsi", "Düzdabanlıq (yastıpəncəlik) müalicəsi", "Fərdi ortopedik içliklərin (supinator) hazırlanması"],
    iconName: "Footprints",
  },
];

const defaultBlogs: BlogItem[] = [
  {
    id: "blog-1",
    title: "Düzgün USM müayinəsinin əhəmiyyəti",
    summary: "Ultrasəs müayinəsi (USM) nə üçün vacibdir və müayinəyə necə hazırlaşmalı?",
    content: "Ultrasəs müayinəsi daxili orqanların vəziyyətini öyrənmək üçün ən təhlükəsiz və geniş yayılmış üsullardan biridir. Diaqnozun dəqiq olması üçün həkimin peşəkarlığı ilə yanaşı, cihazın keyfiyyəti də mühüm rol oynayır. Medical Center-də 4D Doppler funksiyalı ən müasir USM cihazları fəaliyyət göstərir. Hamiləlik dövründə dölün inkişafını izləmək, eləcə də daxili orqanların patologiyalarını vaxtında aşkarlamaq üçün USM müayinəsindən keçmək tövsiyə olunur.",
    date: "2026-06-18",
    author: "Dr. Şəhla Həsənova",
    readTime: "3 dəq",
  },
  {
    id: "blog-2",
    title: "Naftalan vannaları və Fizioterapiyanın faydaları",
    summary: "Dayaq-hərəkət sistemi və oynaq ağrılarında Naftalan neftinin möcüzəvi təsirləri.",
    content: "Naftalan nefti oynaq, əzələ və sinir sistemi xəstəliklərinin müalicəsində əvəzolunmaz təbii vasitədir. Medical Center Tibb Mərkəzində təqdim olunan Naftalan vannaları, oynaq iltihabını azaldır, qan dövranını yaxşılaşdırır və ağrıları aradan qaldırır. Lazer və ozon terapiyası ilə birlikdə tətbiq edildikdə, fizioterapevtik prosedurlar xəstələrin qısa zamanda normal aktiv həyata qayıtmasına kömək edir.",
    date: "2026-06-15",
    author: "Dr. Aynur Qarayeva",
    readTime: "4 dəq",
  },
  {
    id: "blog-3",
    title: "Uşaqlarda və böyüklərdə düzdabanlıq problemi",
    summary: "Fərdi ortopedik içliklər vasitəsilə duruş və yeriş pozuntularının bərpası.",
    content: "Düzdabanlıq (yastıpəncəlik) yalnız ayaq ağrılarına deyil, həm də onurğa, çanaq və diz oynaqlarında ciddi fəsadlara yol aça bilər. Xüsusi aparat vasitəsilə ayaq pəncəsinin ölçüləri götürülür və tam fərdi ortopedik içliklər hazırlanır. Bu içliklər bədən çəkisinin ayağa bərabər paylanmasını təmin edərək onurğanı qoruyur, yorğunluğu azaldır və duruşu korreksiya edir.",
    date: "2026-06-10",
    author: "Dr. Reyhan Əhmədova",
    readTime: "3 dəq",
  },
];

const defaultTestimonials: Testimonial[] = [
  {
    id: "test-1",
    sender: "Elnur Məmmədov",
    location: "Diz Oynaq Ağrıları üzrə Pasiyent",
    message: "Salam Aynur həkim. Sayənizdə diz ağrılarım tamamilə keçdi. Tətbiq etdiyiniz Naftalan vannaları və lazer müalicəsi çox yaxşı kömək etdi. Çox sağ olun, sizə və kollektivinizə minnətdaram! Mənim kimi ağrı çəkən hər kəsə tövsiyə edirəm.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "test-2",
    sender: "Günel Həsənova",
    location: "Laboratoriya Xidməti üzrə Pasiyent",
    message: "Dünən laboratoriyanızda analizlər verdik. Dediyiniz kimi 1 saat yarıma cavablar hazır oldu və telefonumuza göndərildi. Operativliyiniz və gülərüzlüyünüz üçün təşəkkür edirəm! Avtomatlaşdırılmış cihazlarınız çox mükəmməldir.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "test-3",
    sender: "Rəşad Quliyev",
    location: "Doppler USM Müayinəsi üzrə Pasiyent",
    message: "Şəhla xanımın USM müayinəsindən çox razı qaldıq. Dölün 4D Doppler görüntülərini bizə çox ətraflı göstərdi və hər şeyi səbirlə izah etdi. Tovuzda belə yüksək səviyyəli mütəxəssisin və tibbi xidmətin olması böyük şansdır.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "test-4",
    sender: "Orxan Əliyev",
    location: "Fərdi Ortopedik İçlik Pasiyenti",
    message: "Ayaqlarımda yastıpəncəlik var idi, gəzəndə tez yorulurdum. Ortopedik içliklər şöbənizdə ayağımın ölçüsünü götürüb fərdi supinator hazırladılar. Artıq 2 aydır istifadə edirəm, ağrılarım bitdi. Hər kəsə məsləhət görürəm.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
  },
];

const defaultPopup: PopupSettings = {
  imageUrl: "/images/popup-banner.png",
  expirationDate: "2026-09-30",
  active: true,
};

const defaultAppointments: Appointment[] = [
  {
    id: "MC-8291",
    name: "Elnur Əliyev",
    phone: "0501234567",
    serviceId: "srv-1",
    doctorId: "doc-1",
    date: "2026-06-25",
    notes: "Qan analizi üçün gəlmək istəyirəm.",
    submitType: "whatsapp",
    status: "pending",
    createdAt: "2026-06-21T10:00:00.000Z",
  },
  {
    id: "MC-4921",
    name: "Aysel Məmmədova",
    phone: "0709876543",
    serviceId: "srv-2",
    doctorId: "doc-5",
    date: "2026-06-26",
    notes: "Doppler USM müayinəsi üçün yazılmaq istəyirəm.",
    submitType: "call",
    status: "confirmed",
    createdAt: "2026-06-20T15:30:00.000Z",
  }
];

const defaultTelegram: TelegramSettings = {
  botToken: "",
  chatId: "",
  active: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [doctors, setDoctors] = useState<Doctor[]>(defaultDoctors);
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  const [blogs, setBlogs] = useState<BlogItem[]>(defaultBlogs);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [popupSettings, setPopupSettings] = useState<PopupSettings>(defaultPopup);
  const [appointments, setAppointments] = useState<Appointment[]>(defaultAppointments);
  const [heroBgImage, setHeroBgImage] = useState<string>("/images/hero-bg.png");
  const [telegramSettings, setTelegramSettings] = useState<TelegramSettings>(defaultTelegram);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client-side
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const storedDoctors = localStorage.getItem("mc_doctors");
        const storedServices = localStorage.getItem("mc_services");
        const storedBlogs = localStorage.getItem("mc_blogs");
        const storedTestimonials = localStorage.getItem("mc_testimonials");

        if (storedDoctors) {
          let parsed = JSON.parse(storedDoctors) as Doctor[];
          let migrated = false;
          parsed = parsed.map((doc) => {
            if (doc.id === "doc-1" && doc.image.includes("unsplash.com")) {
              migrated = true;
              return { ...doc, image: "/images/doctor_male_elcin.png" };
            }
            if (doc.id === "doc-2" && doc.image.includes("unsplash.com")) {
              migrated = true;
              return { ...doc, image: "/images/doctor_female_aynur.png" };
            }
            return doc;
          });
          setDoctors(parsed);
          if (migrated) {
            localStorage.setItem("mc_doctors", JSON.stringify(parsed));
          }
        } else {
          localStorage.setItem("mc_doctors", JSON.stringify(defaultDoctors));
        }

        if (storedServices) setServices(JSON.parse(storedServices));
        else localStorage.setItem("mc_services", JSON.stringify(defaultServices));

        if (storedBlogs) setBlogs(JSON.parse(storedBlogs));
        else localStorage.setItem("mc_blogs", JSON.stringify(defaultBlogs));

        if (storedTestimonials) setTestimonials(JSON.parse(storedTestimonials));
        else localStorage.setItem("mc_testimonials", JSON.stringify(defaultTestimonials));

        // Load popup settings from Sanity first
        try {
          const sanityPopup = await getPopupSettings();
          if (sanityPopup) {
            setPopupSettings({
              active: sanityPopup.active ?? defaultPopup.active,
              expirationDate: sanityPopup.expirationDate ?? defaultPopup.expirationDate,
              imageUrl: sanityPopup.imageUrl ?? defaultPopup.imageUrl,
              imageRef: sanityPopup.imageRef,
            });
          } else {
            const storedPopup = localStorage.getItem("mc_popup");
            if (storedPopup) setPopupSettings(JSON.parse(storedPopup));
            else setPopupSettings(defaultPopup);
          }
        } catch (sanityError) {
          console.error("Failed to load popup settings from Sanity:", sanityError);
          const storedPopup = localStorage.getItem("mc_popup");
          if (storedPopup) setPopupSettings(JSON.parse(storedPopup));
          else setPopupSettings(defaultPopup);
        }

        const storedAppointments = localStorage.getItem("mc_appointments");
        if (storedAppointments) setAppointments(JSON.parse(storedAppointments));
        else localStorage.setItem("mc_appointments", JSON.stringify(defaultAppointments));

        const storedHeroBg = localStorage.getItem("mc_hero_bg");
        if (storedHeroBg) setHeroBgImage(storedHeroBg);
        else localStorage.setItem("mc_hero_bg", "/images/hero-bg.png");

        const storedTelegram = localStorage.getItem("mc_telegram");
        if (storedTelegram) setTelegramSettings(JSON.parse(storedTelegram));
        else localStorage.setItem("mc_telegram", JSON.stringify(defaultTelegram));
      } catch (e) {
        console.error("Error accessing localStorage:", e);
      }
      setIsLoaded(true);
    };

    loadInitialData();
  }, []);

  // Update localStorage helper
  const syncToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error("Error writing to localStorage:", e);
    }
  };

  // Pop-up Settings
  const updatePopupSettings = (settings: Partial<PopupSettings>) => {
    setPopupSettings((prev) => {
      const updated = { ...prev, ...settings };
      syncToStorage("mc_popup", updated);
      return updated;
    });
  };

  // Doctors CRUD
  const addDoctor = (doc: Omit<Doctor, "id">) => {
    setDoctors((prev) => {
      const newDoc = { ...doc, id: `doc-${Date.now()}` };
      const updated = [...prev, newDoc];
      syncToStorage("mc_doctors", updated);
      return updated;
    });
  };

  const updateDoctor = (id: string, updatedFields: Partial<Doctor>) => {
    setDoctors((prev) => {
      const updated = prev.map((doc) =>
        doc.id === id ? { ...doc, ...updatedFields } : doc
      );
      syncToStorage("mc_doctors", updated);
      return updated;
    });
  };

  const deleteDoctor = (id: string) => {
    setDoctors((prev) => {
      const updated = prev.filter((doc) => doc.id !== id);
      syncToStorage("mc_doctors", updated);
      return updated;
    });
  };

  // Services CRUD
  const addService = (srv: Omit<ServiceItem, "id">) => {
    setServices((prev) => {
      const newSrv = { ...srv, id: `srv-${Date.now()}` };
      const updated = [...prev, newSrv];
      syncToStorage("mc_services", updated);
      return updated;
    });
  };

  const updateService = (id: string, updatedFields: Partial<ServiceItem>) => {
    setServices((prev) => {
      const updated = prev.map((srv) =>
        srv.id === id ? { ...srv, ...updatedFields } : srv
      );
      syncToStorage("mc_services", updated);
      return updated;
    });
  };

  const deleteService = (id: string) => {
    setServices((prev) => {
      const updated = prev.filter((srv) => srv.id !== id);
      syncToStorage("mc_services", updated);
      return updated;
    });
  };

  // Blogs CRUD
  const addBlog = (blg: Omit<BlogItem, "id">) => {
    setBlogs((prev) => {
      const newBlg = { ...blg, id: `blog-${Date.now()}` };
      const updated = [...prev, newBlg];
      syncToStorage("mc_blogs", updated);
      return updated;
    });
  };

  const updateBlog = (id: string, updatedFields: Partial<BlogItem>) => {
    setBlogs((prev) => {
      const updated = prev.map((blg) =>
        blg.id === id ? { ...blg, ...updatedFields } : blg
      );
      syncToStorage("mc_blogs", updated);
      return updated;
    });
  };

  const deleteBlog = (id: string) => {
    setBlogs((prev) => {
      const updated = prev.filter((blg) => blg.id !== id);
      syncToStorage("mc_blogs", updated);
      return updated;
    });
  };

  // Testimonials CRUD
  const addTestimonial = (test: Omit<Testimonial, "id">) => {
    setTestimonials((prev) => {
      const newTest = { ...test, id: `test-${Date.now()}` };
      const updated = [...prev, newTest];
      syncToStorage("mc_testimonials", updated);
      return updated;
    });
  };

  const updateTestimonial = (id: string, updatedFields: Partial<Testimonial>) => {
    setTestimonials((prev) => {
      const updated = prev.map((test) =>
        test.id === id ? { ...test, ...updatedFields } : test
      );
      syncToStorage("mc_testimonials", updated);
      return updated;
    });
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => {
      const updated = prev.filter((test) => test.id !== id);
      syncToStorage("mc_testimonials", updated);
      return updated;
    });
  };

  // Appointments CRUD
  const addAppointment = (app: Omit<Appointment, "status" | "createdAt">) => {
    setAppointments((prev) => {
      const newApp: Appointment = {
        ...app,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      const updated = [newApp, ...prev]; // newer appointments first
      syncToStorage("mc_appointments", updated);
      return updated;
    });
  };

  const updateAppointmentStatus = (id: string, status: Appointment["status"]) => {
    setAppointments((prev) => {
      const updated = prev.map((app) =>
        app.id === id ? { ...app, status } : app
      );
      syncToStorage("mc_appointments", updated);
      return updated;
    });
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => {
      const updated = prev.filter((app) => app.id !== id);
      syncToStorage("mc_appointments", updated);
      return updated;
    });
  };

  const updateHeroBgImage = (url: string) => {
    setHeroBgImage(url);
    syncToStorage("mc_hero_bg", url);
  };

  const updateTelegramSettings = (settings: Partial<TelegramSettings>) => {
    setTelegramSettings((prev) => {
      const updated = { ...prev, ...settings };
      syncToStorage("mc_telegram", updated);
      return updated;
    });
  };

  const sendTelegramNotification = async (
    appId: string,
    name: string,
    phone: string,
    date: string,
    submitType: "whatsapp" | "call",
    serviceId: string
  ) => {
    try {
      if (!telegramSettings.active || !telegramSettings.botToken || !telegramSettings.chatId) return;

      const serviceName = services.find((s) => s.id === serviceId)?.title || "Şöbə seçilməyib";
      const submitText = submitType === "whatsapp" ? "WhatsApp ilə təsdiq" : "Zənglə təsdiq";

      const textMessage = `🔔 *YENİ RANDEVU!*\n\n👤 *Pasiyent:* ${name}\n📞 *Telefon:* ${phone}\n🏷️ *Xidmət:* ${serviceName}\n📅 *Tarix:* ${date}\n💬 *Təsdiq vasitəsi:* ${submitText}\n🔑 *Kod:* ${appId}`;

      const url = `https://api.telegram.org/bot${telegramSettings.botToken}/sendMessage`;
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: telegramSettings.chatId,
          text: textMessage,
          parse_mode: "Markdown",
        }),
      });
    } catch (err) {
      console.error("Error sending Telegram message:", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
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
        updateHeroBgImage,
        updateTelegramSettings,
        sendTelegramNotification,
        addAppointment,
        updateAppointmentStatus,
        deleteAppointment,
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
        deleteTestimonial,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
