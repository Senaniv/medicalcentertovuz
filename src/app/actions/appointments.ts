"use server";

import { sanityClient } from "@/lib/sanity";
import { revalidatePath } from "next/cache";

interface AppointmentInput {
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

export async function getAppointments() {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "appointment"] | order(createdAt desc) {
        "id": _id,
        name,
        phone,
        serviceId,
        doctorId,
        date,
        notes,
        submitType,
        status,
        createdAt
      }`,
      {},
      { cache: "no-store", next: { revalidate: 0 } }
    );
    return data || [];
  } catch (error) {
    console.error("Error fetching appointments from Sanity:", error);
    return [];
  }
}

export async function saveAppointment(app: AppointmentInput) {
  const { id, name, phone, serviceId, doctorId, date, notes, submitType, status, createdAt } = app;

  try {
    const docData = {
      _id: id,
      _type: "appointment",
      name,
      phone,
      serviceId,
      doctorId: doctorId || "",
      date,
      notes: notes || "",
      submitType,
      status,
      createdAt,
    };

    const savedDoc = await sanityClient.createOrReplace(docData);

    revalidatePath("/", "layout");

    return {
      success: true,
      data: {
        id: savedDoc._id,
        name: savedDoc.name,
        phone: savedDoc.phone,
        serviceId: savedDoc.serviceId,
        doctorId: savedDoc.doctorId,
        date: savedDoc.date,
        notes: savedDoc.notes,
        submitType: savedDoc.submitType,
        status: savedDoc.status,
        createdAt: savedDoc.createdAt,
      }
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Error saving appointment to Sanity:", error);
    return {
      success: false,
      error: errorMsg,
    };
  }
}

export async function deleteAppointmentAction(id: string) {
  try {
    await sanityClient.delete(id);
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Error deleting appointment from Sanity:", error);
    return {
      success: false,
      error: errorMsg,
    };
  }
}
