"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getPopupSettings } from "@/app/actions/popup";
import { getDoctors, saveDoctor, deleteDoctorAction } from "@/app/actions/doctors";
import { getTelegramSettings, saveTelegramSettings } from "@/app/actions/telegram";
import { getServices, saveService, deleteServiceAction } from "@/app/actions/services";
import { getBlogs, saveBlog, deleteBlogAction } from "@/app/actions/blogs";
import { getAppointments, saveAppointment, deleteAppointmentAction } from "@/app/actions/appointments";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  experience?: string;
  education?: string;
  imageRef?: string;
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
  updateTelegramSettings: (settings: Partial<TelegramSettings>) => Promise<{ success: boolean; data?: TelegramSettings; error?: string }>;
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
  addDoctor: (doctor: Omit<Doctor, "id">) => Promise<{ success: boolean; data?: Doctor; error?: string }>;
  updateDoctor: (id: string, doctor: Partial<Doctor>) => Promise<{ success: boolean; data?: Doctor; error?: string }>;
  deleteDoctor: (id: string) => Promise<{ success: boolean; error?: string }>;
  
  // Services CRUD
  addService: (service: Omit<ServiceItem, "id">) => Promise<{ success: boolean; data?: ServiceItem; error?: string }>;
  updateService: (id: string, service: Partial<ServiceItem>) => Promise<{ success: boolean; data?: ServiceItem; error?: string }>;
  deleteService: (id: string) => Promise<{ success: boolean; error?: string }>;
  
  // Blogs CRUD
  addBlog: (blog: Omit<BlogItem, "id">) => Promise<{ success: boolean; data?: BlogItem; error?: string }>;
  updateBlog: (id: string, blog: Partial<BlogItem>) => Promise<{ success: boolean; data?: BlogItem; error?: string }>;
  deleteBlog: (id: string) => Promise<{ success: boolean; error?: string }>;

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
        // Load doctors from Sanity first
        try {
          const sanityDoctors = await getDoctors();
          if (sanityDoctors && sanityDoctors.length > 0) {
            setDoctors(sanityDoctors);
            localStorage.setItem("mc_doctors", JSON.stringify(sanityDoctors));
          } else {
            // If Sanity is empty, try local storage fallback
            const storedDoctors = localStorage.getItem("mc_doctors");
            if (storedDoctors) {
              setDoctors(JSON.parse(storedDoctors));
            } else {
              setDoctors(defaultDoctors);
              // Save defaults to Sanity so database has initial data
              for (const doc of defaultDoctors) {
                await saveDoctor({
                  name: doc.name,
                  specialty: doc.specialty,
                  image: doc.image,
                  experience: doc.experience,
                  education: doc.education
                });
              }
              // Fetch again to get Sanity IDs
              const reloadedDoctors = await getDoctors();
              if (reloadedDoctors && reloadedDoctors.length > 0) {
                setDoctors(reloadedDoctors);
              }
            }
          }
        } catch (docError) {
          console.error("Failed to load doctors from Sanity:", docError);
          const storedDoctors = localStorage.getItem("mc_doctors");
          if (storedDoctors) setDoctors(JSON.parse(storedDoctors));
          else setDoctors(defaultDoctors);
        }

        // Load services from Sanity
        try {
          const sanityServices = await getServices();
          if (sanityServices && sanityServices.length > 0) {
            setServices(sanityServices);
            localStorage.setItem("mc_services", JSON.stringify(sanityServices));
          } else {
            const storedServices = localStorage.getItem("mc_services");
            if (storedServices) {
              setServices(JSON.parse(storedServices));
            } else {
              setServices(defaultServices);
              // Seed to Sanity
              for (const srv of defaultServices) {
                await saveService({
                  title: srv.title,
                  description: srv.description,
                  details: srv.details,
                  iconName: srv.iconName,
                });
              }
              const reloadedServices = await getServices();
              if (reloadedServices && reloadedServices.length > 0) {
                setServices(reloadedServices);
              }
            }
          }
        } catch (srvError) {
          console.error("Failed to load services from Sanity:", srvError);
          const storedServices = localStorage.getItem("mc_services");
          if (storedServices) setServices(JSON.parse(storedServices));
          else setServices(defaultServices);
        }

        // Load blogs from Sanity
        try {
          const sanityBlogs = await getBlogs();
          if (sanityBlogs && sanityBlogs.length > 0) {
            setBlogs(sanityBlogs);
            localStorage.setItem("mc_blogs", JSON.stringify(sanityBlogs));
          } else {
            const storedBlogs = localStorage.getItem("mc_blogs");
            if (storedBlogs) {
              setBlogs(JSON.parse(storedBlogs));
            } else {
              setBlogs(defaultBlogs);
              // Seed to Sanity
              for (const blg of defaultBlogs) {
                await saveBlog({
                  title: blg.title,
                  summary: blg.summary,
                  content: blg.content,
                  date: blg.date,
                  author: blg.author,
                  readTime: blg.readTime,
                });
              }
              const reloadedBlogs = await getBlogs();
              if (reloadedBlogs && reloadedBlogs.length > 0) {
                setBlogs(reloadedBlogs);
              }
            }
          }
        } catch (blogError) {
          console.error("Failed to load blogs from Sanity:", blogError);
          const storedBlogs = localStorage.getItem("mc_blogs");
          if (storedBlogs) setBlogs(JSON.parse(storedBlogs));
          else setBlogs(defaultBlogs);
        }

        const storedTestimonials = localStorage.getItem("mc_testimonials");
        if (storedTestimonials) setTestimonials(JSON.parse(storedTestimonials));
        else setTestimonials(defaultTestimonials);

        // Load popup settings from Sanity first
        try {
          const sanityPopup = await getPopupSettings();
          if (sanityPopup) {
            const popupData = {
              active: sanityPopup.active ?? defaultPopup.active,
              expirationDate: sanityPopup.expirationDate ?? defaultPopup.expirationDate,
              imageUrl: sanityPopup.imageUrl ?? defaultPopup.imageUrl,
              imageRef: sanityPopup.imageRef,
            };
            setPopupSettings(popupData);
            localStorage.setItem("mc_popup", JSON.stringify(popupData));
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

        // Load appointments from Sanity
        try {
          const sanityApps = await getAppointments();
          if (sanityApps && sanityApps.length > 0) {
            setAppointments(sanityApps as Appointment[]);
          } else {
            const storedAppointments = localStorage.getItem("mc_appointments");
            if (storedAppointments) {
              const parsed = JSON.parse(storedAppointments);
              setAppointments(parsed);
              // Seed existing local storage appointments to Sanity
              for (const app of parsed) {
                await saveAppointment(app);
              }
            } else {
              setAppointments(defaultAppointments);
            }
          }
        } catch (sanityAppError) {
          console.error("Failed to load appointments from Sanity:", sanityAppError);
          const storedAppointments = localStorage.getItem("mc_appointments");
          if (storedAppointments) setAppointments(JSON.parse(storedAppointments));
          else setAppointments(defaultAppointments);
        }

        const storedHeroBg = localStorage.getItem("mc_hero_bg");
        if (storedHeroBg) setHeroBgImage(storedHeroBg);
        else localStorage.setItem("mc_hero_bg", "/images/hero-bg.png");

        // Load telegram settings from Sanity
        try {
          const sanityTelegram = await getTelegramSettings();
          if (sanityTelegram) {
            const telegramData = {
              botToken: sanityTelegram.botToken ?? defaultTelegram.botToken,
              chatId: sanityTelegram.chatId ?? defaultTelegram.chatId,
              active: sanityTelegram.active ?? defaultTelegram.active,
            };
            setTelegramSettings(telegramData);
            localStorage.setItem("mc_telegram", JSON.stringify(telegramData));
          } else {
            const storedTelegram = localStorage.getItem("mc_telegram");
            if (storedTelegram) setTelegramSettings(JSON.parse(storedTelegram));
            else setTelegramSettings(defaultTelegram);
          }
        } catch (sanityTelegramErr) {
          console.error("Failed to load telegram settings from Sanity:", sanityTelegramErr);
          const storedTelegram = localStorage.getItem("mc_telegram");
          if (storedTelegram) setTelegramSettings(JSON.parse(storedTelegram));
          else setTelegramSettings(defaultTelegram);
        }
      } catch (e) {
        console.error("Error accessing localStorage:", e);
      }
      setIsLoaded(true);
    };

    loadInitialData();
  }, []);

  // Update localStorage helper
  const syncToStorage = (key: string, data: unknown) => {
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
  const addDoctor = async (doc: Omit<Doctor, "id">) => {
    const res = await saveDoctor({
      name: doc.name,
      specialty: doc.specialty,
      image: doc.image,
      experience: doc.experience,
      education: doc.education,
    });
    if (res.success && res.data) {
      setDoctors((prev) => {
        const updated = [...prev, res.data as Doctor];
        syncToStorage("mc_doctors", updated);
        return updated;
      });
      return { success: true, data: res.data as Doctor };
    } else {
      return { success: false, error: res.error };
    }
  };

  const updateDoctor = async (id: string, updatedFields: Partial<Doctor>) => {
    const existingDoc = doctors.find((d) => d.id === id);
    
    const res = await saveDoctor({
      id,
      name: updatedFields.name ?? existingDoc?.name ?? "",
      specialty: updatedFields.specialty ?? existingDoc?.specialty ?? "",
      image: updatedFields.image ?? existingDoc?.image ?? "",
      experience: updatedFields.experience ?? existingDoc?.experience,
      education: updatedFields.education ?? existingDoc?.education,
      imageRef: updatedFields.imageRef ?? existingDoc?.imageRef,
    });

    if (res.success && res.data) {
      setDoctors((prev) => {
        const updated = prev.map((doc) =>
          doc.id === id ? (res.data as Doctor) : doc
        );
        syncToStorage("mc_doctors", updated);
        return updated;
      });
      return { success: true, data: res.data as Doctor };
    } else {
      return { success: false, error: res.error };
    }
  };

  const deleteDoctor = async (id: string) => {
    const res = await deleteDoctorAction(id);
    if (res.success) {
      setDoctors((prev) => {
        const updated = prev.filter((doc) => doc.id !== id);
        syncToStorage("mc_doctors", updated);
        return updated;
      });
      return { success: true };
    } else {
      return { success: false, error: res.error };
    }
  };

  // Services CRUD
  const addService = async (srv: Omit<ServiceItem, "id">) => {
    const res = await saveService({
      title: srv.title,
      description: srv.description,
      details: srv.details,
      iconName: srv.iconName,
    });
    if (res.success && res.data) {
      setServices((prev) => {
        const updated = [...prev, res.data as ServiceItem];
        syncToStorage("mc_services", updated);
        return updated;
      });
      return { success: true, data: res.data as ServiceItem };
    } else {
      return { success: false, error: res.error };
    }
  };

  const updateService = async (id: string, updatedFields: Partial<ServiceItem>) => {
    const existingSrv = services.find((s) => s.id === id);
    
    const res = await saveService({
      id,
      title: updatedFields.title ?? existingSrv?.title ?? "",
      description: updatedFields.description ?? existingSrv?.description ?? "",
      details: updatedFields.details ?? existingSrv?.details ?? [],
      iconName: updatedFields.iconName ?? existingSrv?.iconName ?? "Activity",
    });

    if (res.success && res.data) {
      setServices((prev) => {
        const updated = prev.map((srv) =>
          srv.id === id ? (res.data as ServiceItem) : srv
        );
        syncToStorage("mc_services", updated);
        return updated;
      });
      return { success: true, data: res.data as ServiceItem };
    } else {
      return { success: false, error: res.error };
    }
  };

  const deleteService = async (id: string) => {
    const res = await deleteServiceAction(id);
    if (res.success) {
      setServices((prev) => {
        const updated = prev.filter((srv) => srv.id !== id);
        syncToStorage("mc_services", updated);
        return updated;
      });
      return { success: true };
    } else {
      return { success: false, error: res.error };
    }
  };

  // Blogs CRUD
  const addBlog = async (blg: Omit<BlogItem, "id">) => {
    const res = await saveBlog({
      title: blg.title,
      summary: blg.summary,
      content: blg.content,
      date: blg.date,
      author: blg.author,
      readTime: blg.readTime,
    });
    if (res.success && res.data) {
      setBlogs((prev) => {
        const updated = [...prev, res.data as BlogItem];
        syncToStorage("mc_blogs", updated);
        return updated;
      });
      return { success: true, data: res.data as BlogItem };
    } else {
      return { success: false, error: res.error };
    }
  };

  const updateBlog = async (id: string, updatedFields: Partial<BlogItem>) => {
    const existingBlg = blogs.find((b) => b.id === id);
    
    const res = await saveBlog({
      id,
      title: updatedFields.title ?? existingBlg?.title ?? "",
      summary: updatedFields.summary ?? existingBlg?.summary ?? "",
      content: updatedFields.content ?? existingBlg?.content ?? "",
      date: updatedFields.date ?? existingBlg?.date ?? "",
      author: updatedFields.author ?? existingBlg?.author ?? "",
      readTime: updatedFields.readTime ?? existingBlg?.readTime ?? "",
    });

    if (res.success && res.data) {
      setBlogs((prev) => {
        const updated = prev.map((blg) =>
          blg.id === id ? (res.data as BlogItem) : blg
        );
        syncToStorage("mc_blogs", updated);
        return updated;
      });
      return { success: true, data: res.data as BlogItem };
    } else {
      return { success: false, error: res.error };
    }
  };

  const deleteBlog = async (id: string) => {
    const res = await deleteBlogAction(id);
    if (res.success) {
      setBlogs((prev) => {
        const updated = prev.filter((blg) => blg.id !== id);
        syncToStorage("mc_blogs", updated);
        return updated;
      });
      return { success: true };
    } else {
      return { success: false, error: res.error };
    }
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
  const addAppointment = async (app: Omit<Appointment, "status" | "createdAt">) => {
    const newApp: Appointment = {
      ...app,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      await saveAppointment(newApp);
    } catch (err) {
      console.error("Failed to save appointment to Sanity:", err);
    }

    setAppointments((prev) => {
      const updated = [newApp, ...prev]; // newer appointments first
      syncToStorage("mc_appointments", updated);
      return updated;
    });
  };

  const updateAppointmentStatus = async (id: string, status: Appointment["status"]) => {
    let updatedApp: Appointment | undefined;

    setAppointments((prev) => {
      const updated = prev.map((app) => {
        if (app.id === id) {
          updatedApp = { ...app, status };
          return updatedApp;
        }
        return app;
      });
      syncToStorage("mc_appointments", updated);
      return updated;
    });

    if (updatedApp) {
      try {
        await saveAppointment(updatedApp);
      } catch (err) {
        console.error("Failed to update appointment status in Sanity:", err);
      }
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      await deleteAppointmentAction(id);
    } catch (err) {
      console.error("Failed to delete appointment from Sanity:", err);
    }

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

  const updateTelegramSettings = async (settings: Partial<TelegramSettings>) => {
    const updatedFields = {
      botToken: settings.botToken ?? telegramSettings.botToken,
      chatId: settings.chatId ?? telegramSettings.chatId,
      active: settings.active ?? telegramSettings.active,
    };

    const res = await saveTelegramSettings(updatedFields);
    if (res.success && res.data) {
      setTelegramSettings(res.data);
      syncToStorage("mc_telegram", res.data);
      return { success: true, data: res.data };
    } else {
      return { success: false, error: res.error };
    }
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

      const origin = typeof window !== "undefined" ? window.location.origin : "https://medicalcentertovuz.vercel.app";
      const adminLink = `${origin}/admin?code=${appId}`;

      const textMessage = `🔔 *YENİ RANDEVU!*\n\n👤 *Pasiyent:* ${name}\n📞 *Telefon:* ${phone}\n🏷️ *Xidmət:* ${serviceName}\n📅 *Tarix:* ${date}\n💬 *Təsdiq vasitəsi:* ${submitText}\n🔑 *Kod:* ${appId}\n\n🔗 [Randevunu İdarə Et](${adminLink})`;

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
