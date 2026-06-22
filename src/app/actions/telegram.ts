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
    const data = await sanityClient.fetch(
      `*[_type == "telegramSettings"][0] {
        botToken,
        chatId,
        active
      }`,
      {},
      { cache: "no-store", next: { revalidate: 0 } }
    );
    return data;
  } catch (error) {
    console.error("Error fetching telegram settings from Sanity:", error);
    return null;
  }
}

export async function saveTelegramSettings(settings: TelegramSettingsInput) {
  const { botToken, chatId, active } = settings;

  try {
    const docData = {
      _id: "telegramSettings",
      _type: "telegramSettings",
      botToken,
      chatId,
      active,
    };

    const updatedDoc = await sanityClient.createOrReplace(docData);

    revalidatePath("/", "layout");

    return {
      success: true,
      data: {
        botToken: updatedDoc.botToken,
        chatId: updatedDoc.chatId,
        active: updatedDoc.active,
      }
    };
  } catch (error: any) {
    console.error("Error saving telegram settings to Sanity:", error);
    return {
      success: false,
      error: error.message || String(error),
    };
  }
}

interface AppointmentNotificationParams {
  appId: string;
  name: string;
  phone: string;
  date: string;
  submitType: "whatsapp" | "call";
  serviceName: string;
  origin: string;
}

/**
 * Server-side Telegram notification sender.
 * Reads bot token + chat ID directly from Sanity so it always has
 * up-to-date settings regardless of client-side state hydration timing.
 * This fixes the mobile race condition where client state may not have
 * loaded by the time the form is submitted.
 */
export async function sendAppointmentNotification(params: AppointmentNotificationParams) {
  const { appId, name, phone, date, submitType, serviceName, origin } = params;

  try {
    // Always read fresh from Sanity — never rely on client state
    const settings = await sanityClient.fetch(
      `*[_type == "telegramSettings"][0] { botToken, chatId, active }`,
      {},
      { cache: "no-store", next: { revalidate: 0 } }
    );

    if (!settings?.active || !settings?.botToken || !settings?.chatId) {
      return { success: false, reason: "Telegram deaktivdir və ya konfiqurasiya edilməyib." };
    }

    const submitText = submitType === "whatsapp" ? "WhatsApp ilə təsdiq" : "Zənglə təsdiq";
    const adminLink = `${origin}/admin?code=${appId}`;

    const textMessage =
      `🔔 *YENİ RANDEVU!*\n\n` +
      `👤 *Pasiyent:* ${name}\n` +
      `📞 *Telefon:* ${phone}\n` +
      `🏷️ *Xidmət:* ${serviceName}\n` +
      `📅 *Tarix:* ${date}\n` +
      `💬 *Təsdiq vasitəsi:* ${submitText}\n` +
      `🔑 *Kod:* ${appId}\n\n` +
      `🔗 [Randevunu İdarə Et](${adminLink})`;

    const url = `https://api.telegram.org/bot${settings.botToken}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: settings.chatId,
        text: textMessage,
        parse_mode: "Markdown",
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Telegram API error:", errorBody);
      return { success: false, reason: errorBody };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Error sending Telegram notification:", err);
    return { success: false, reason: err.message || String(err) };
  }
}

