"use server";

import { sanityClient } from "@/lib/sanity";
import { revalidatePath } from "next/cache";

interface SavePopupParams {
  active: boolean;
  expirationDate: string;
  imageUrl: string;
  imageRef?: string;
}

export async function getPopupSettings() {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "popupSettings"][0] {
        active,
        expirationDate,
        "imageUrl": image.asset->url,
        "imageRef": image.asset->_ref
      }`,
      {},
      { cache: "no-store", next: { revalidate: 0 } }
    );
    return data;
  } catch (error) {
    console.error("Error fetching popup settings from Sanity:", error);
    return null;
  }
}

export async function savePopupSettings(params: SavePopupParams) {
  const { active, expirationDate, imageUrl, imageRef } = params;

  try {
    let finalImageRef = imageRef;

    // Check if the imageUrl is a base64 string
    if (imageUrl.startsWith("data:image/")) {
      // 1. Extract base64 content and type
      const mimeTypeMatch = imageUrl.match(/^data:([^;]+);base64,/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/png";
      const base64Data = imageUrl.replace(/^data:[^;]+;base64,/, "");
      
      // 2. Convert base64 to Buffer
      const buffer = Buffer.from(base64Data, "base64");

      // 3. Upload to Sanity
      const asset = await sanityClient.assets.upload("image", buffer, {
        contentType: mimeType,
        filename: `popup-banner-${Date.now()}.${mimeType.split("/")[1] || "png"}`,
      });

      finalImageRef = asset._id;
    }

    // Prepare document data
    const docData: any = {
      _id: "popupSettings",
      _type: "popupSettings",
      active,
      expirationDate,
    };

    if (finalImageRef) {
      docData.image = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: finalImageRef,
        },
      };
    }

    // 4. Create or replace the document in Sanity
    const updatedDoc = await sanityClient.createOrReplace(docData);

    // Revalidate the cache for the entire site to reflect the changes immediately
    revalidatePath("/", "layout");
    
    // Fetch the uploaded image URL to return it
    let finalImageUrl = imageUrl;
    if (finalImageRef && finalImageRef !== imageRef) {
      const assetData = await sanityClient.fetch(
        `*[_id == $ref][0].url`,
        { ref: finalImageRef },
        { cache: "no-store", next: { revalidate: 0 } }
      );
      if (assetData) {
        finalImageUrl = assetData;
      }
    }

    return {
      success: true,
      data: {
        active: updatedDoc.active,
        expirationDate: updatedDoc.expirationDate,
        imageUrl: finalImageUrl,
        imageRef: finalImageRef,
      }
    };
  } catch (error: any) {
    console.error("Error saving popup settings to Sanity:", error);
    return {
      success: false,
      error: error.message || String(error),
    };
  }
}
