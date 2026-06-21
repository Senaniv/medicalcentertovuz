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
      }`
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
