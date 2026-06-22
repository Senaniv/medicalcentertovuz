---
name: telegram_appointment_system
description: Implementation blueprint for a database-backed, Telegram-integrated appointment booking and admin notification system with deep-linking support.
---

# Telegram-Integrated Appointment System

This skill provides a complete blueprint for implementing an interactive appointment booking system that stores appointments locally or in a database, allows administrators to configure Telegram bot settings via an Admin Panel, sends instant notifications to a Telegram chat, and supports deep-linking to manage specific appointments.

## System Architecture

The system consists of three main parts:
1. **Global App State/Context (`AppContext.tsx`)**: Manages the state of appointments, configuration of Telegram settings, and triggers Telegram alerts.
2. **Server Actions (`telegram.ts` / `popup.ts` / etc.)**: Persists configurations to Sanity CMS (or any custom DB) and invalidates layouts or page caches.
3. **Deep-Linked Admin Dashboard (`admin/page.tsx`)**: Displays appointments, lets users filter by status or search terms, and automatically filters the list to a single item if a `?code=MC-XXXX` query parameter is present.

---

## 1. Data Structures & Types

```typescript
export interface Appointment {
  id: string; // E.g., "MC-8291"
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
```

---

## 2. Server Action (Database Persistence)

Keep Telegram settings secure and dynamic by editing/saving them via Server Actions.

```typescript
"use server";

import { sanityClient } from "@/lib/sanity";
import { revalidatePath } from "next/cache";

interface TelegramSettingsInput {
  botToken: string;
  chatId: string;
  active: boolean;
}

export async function getTelegramSettings() {
  try {
    return await sanityClient.fetch(`*[_type == "telegramSettings"][0] { botToken, chatId, active }`);
  } catch (error) {
    console.error("Error fetching telegram settings:", error);
    return null;
  }
}

export async function saveTelegramSettings(settings: TelegramSettingsInput) {
  try {
    const docData = {
      _id: "telegramSettings",
      _type: "telegramSettings",
      ...settings,
    };
    const updatedDoc = await sanityClient.createOrReplace(docData);
    revalidatePath("/", "layout");
    return { success: true, data: updatedDoc };
  } catch (error: any) {
    return { success: false, error: error.message || String(error) };
  }
}
```

---

## 3. Telegram Notification Logic (Client / Context)

Inside `AppContext.tsx`, format the Telegram notification with Markdown, include an admin deep link, and call the Telegram Bot API:

```typescript
const sendTelegramNotification = async (
  appId: string,
  name: string,
  phone: string,
  date: string,
  submitType: "whatsapp" | "call",
  serviceId: string
) => {
  try {
    // 1. Verify if active
    if (!telegramSettings.active || !telegramSettings.botToken || !telegramSettings.chatId) return;

    // 2. Resolve service names & metadata
    const serviceName = services.find((s) => s.id === serviceId)?.title || "Şöbə seçilməyib";
    const submitText = submitType === "whatsapp" ? "WhatsApp WITH confirmation" : "Zənglə təsdiq";

    // 3. Build deep link for admin filtering
    const origin = typeof window !== "undefined" ? window.location.origin : "https://yourdomain.com";
    const adminLink = `${origin}/admin?code=${appId}`;

    // 4. Format Message with Markdown
    const textMessage = `🔔 *YENİ RANDEVU!*\n\n` +
      `👤 *Pasiyent:* ${name}\n` +
      `📞 *Telefon:* ${phone}\n` +
      `🏷️ *Xidmət:* ${serviceName}\n` +
      `📅 *Tarix:* ${date}\n` +
      `💬 *Təsdiq vasitəsi:* ${submitText}\n` +
      `🔑 *Kod:* ${appId}\n\n` +
      `🔗 [Randevunu İdarə Et](${adminLink})`;

    // 5. Send HTTP POST to Telegram Bot API
    const url = `https://api.telegram.org/bot${telegramSettings.botToken}/sendMessage`;
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
```

---

## 4. Admin Dashboard Filtering & Deep Linking

To allow administrators to easily locate the specific appointment clicked in Telegram, implement query parameter filtering:

```typescript
import { useSearchParams } from "next/navigation";

// Inside Admin Page Component:
const searchParams = useSearchParams();
const [searchQuery, setSearchQuery] = useState("");
const [activeTab, setActiveTab] = useState<ActiveTab>("popup");

useEffect(() => {
  const codeParam = searchParams.get("code");
  if (codeParam) {
    // 1. Set the search filter to the specific appointment code
    setSearchQuery(codeParam);
    // 2. Set the active section tab to the appointments management tab
    setActiveTab("appointments");
  }
}, [searchParams]);

// When rendering appointments:
const filteredAppointments = appointments.filter(app => {
  // If search query is populated (e.g. from the deep-link code), match it exactly:
  if (searchQuery) {
    return app.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
           app.name.toLowerCase().includes(searchQuery.toLowerCase());
  }
  return true;
});
```
