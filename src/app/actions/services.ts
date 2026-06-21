"use server";

import { sanityClient } from "@/lib/sanity";
import { revalidatePath } from "next/cache";

interface ServiceInput {
  id?: string;
  title: string;
  description: string;
  details: string[];
  iconName: string;
}

export async function getServices() {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "service"] | order(_createdAt asc) {
        "id": _id,
        title,
        description,
        details,
        iconName
      }`
    );
    return data;
  } catch (error) {
    console.error("Error fetching services from Sanity:", error);
    return [];
  }
}

export async function saveService(service: ServiceInput) {
  const { id, title, description, details, iconName } = service;

  try {
    const docData: any = {
      _type: "service",
      title,
      description,
      details,
      iconName,
    };

    if (id) {
      docData._id = id;
    }

    const savedDoc = id 
      ? await sanityClient.createOrReplace({ _id: id, ...docData })
      : await sanityClient.create(docData);

    revalidatePath("/", "layout");

    return {
      success: true,
      data: {
        id: savedDoc._id,
        title: savedDoc.title,
        description: savedDoc.description,
        details: savedDoc.details,
        iconName: savedDoc.iconName,
      }
    };
  } catch (error: any) {
    console.error("Error saving service to Sanity:", error);
    return {
      success: false,
      error: error.message || String(error),
    };
  }
}

export async function deleteServiceAction(id: string) {
  try {
    await sanityClient.delete(id);
    
    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting service from Sanity:", error);
    return {
      success: false,
      error: error.message || String(error),
    };
  }
}
