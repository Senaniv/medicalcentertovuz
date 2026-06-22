"use server";

import { sanityClient } from "@/lib/sanity";
import { revalidatePath } from "next/cache";

interface DoctorInput {
  id?: string;
  name: string;
  specialty: string;
  image: string;
  experience?: string;
  education?: string;
  imageRef?: string;
}

export async function getDoctors() {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "doctor"] | order(_createdAt asc) {
        "id": _id,
        name,
        specialty,
        experience,
        education,
        "image": image.asset->url,
        "imageRef": image.asset->_ref
      }`,
      {},
      { cache: "no-store", next: { revalidate: 0 } }
    );
    return data;
  } catch (error) {
    console.error("Error fetching doctors from Sanity:", error);
    return [];
  }
}

export async function saveDoctor(doctor: DoctorInput) {
  const { id, name, specialty, image, experience, education, imageRef } = doctor;

  try {
    let finalImageRef = imageRef;

    // Check if the image is a base64 string
    if (image.startsWith("data:image/")) {
      // 1. Extract base64 content and type
      const mimeTypeMatch = image.match(/^data:([^;]+);base64,/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/png";
      const base64Data = image.replace(/^data:[^;]+;base64,/, "");
      
      // 2. Convert base64 to Buffer
      const buffer = Buffer.from(base64Data, "base64");

      // 3. Upload to Sanity
      const asset = await sanityClient.assets.upload("image", buffer, {
        contentType: mimeType,
        filename: `doctor-${Date.now()}.${mimeType.split("/")[1] || "png"}`,
      });

      finalImageRef = asset._id;
    }

    // Prepare document data
    const docData: any = {
      _type: "doctor",
      name,
      specialty,
      experience,
      education,
    };

    if (finalImageRef) {
      docData.image = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: finalImageRef,
        },
      };
    } else if (image) {
      // If we don't have a finalImageRef but we have a url or path,
      // wait, Sanity's image field needs a reference. However, if the client sends
      // a static image path (e.g. "/images/doctor_male_elcin.png"), we don't have a Sanity asset reference.
      // But wait! If it's a static image like `/images/doctor_male_elcin.png`, it's not a Sanity asset.
      // If the admin didn't upload a new base64 image but we want to store it in Sanity, we can check:
      // Does Sanity store it? If we don't have a Sanity asset for default doctors, they won't render unless we fallback to the string or upload it.
      // Let's see: if it's a local static image, we can fetch it, convert to buffer, and upload it!
      // This is a brilliant idea! It ensures that all doctors (even default ones saved to Sanity) will have proper Sanity image assets.
      // Let's write an asset-uploader that fetches the local/external image if it doesn't have a Sanity asset ref.
      // Wait, is it running on the server? Yes, Server Actions run on the server!
      // So if `image` starts with `/images/` (local public folder asset) or `http` (external Unsplash image) and `finalImageRef` is not present, we can load it:
      // - For `/images/`: read file from the disk! In next.js, the public folder is in `public/`.
      //   So path is `process.cwd() + "/public" + image`. We can read it using `fs.promises.readFile`.
      // - For `http`: we can fetch it using `fetch(image)` and get arrayBuffer.
      // Let's write a robust loader for this:
      try {
        if (image.startsWith("/images/")) {
          const fs = require("fs");
          const path = require("path");
          const filePath = path.join(process.cwd(), "public", image);
          if (fs.existsSync(filePath)) {
            const buffer = fs.readFileSync(filePath);
            const ext = path.extname(image).substring(1) || "png";
            const mimeType = `image/${ext === "jpg" ? "jpeg" : ext}`;
            const asset = await sanityClient.assets.upload("image", buffer, {
              contentType: mimeType,
              filename: `doctor-static-${Date.now()}.${ext}`,
            });
            finalImageRef = asset._id;
            docData.image = {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: finalImageRef,
              },
            };
          }
        } else if (image.startsWith("http")) {
          const response = await fetch(image);
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const contentType = response.headers.get("content-type") || "image/jpeg";
            const ext = contentType.split("/")[1] || "jpeg";
            const asset = await sanityClient.assets.upload("image", buffer, {
              contentType: contentType,
              filename: `doctor-external-${Date.now()}.${ext}`,
            });
            finalImageRef = asset._id;
            docData.image = {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: finalImageRef,
              },
            };
          }
        }
      } catch (uploadErr) {
        console.error("Failed to upload fallback static/external image to Sanity:", uploadErr);
      }
    }

    let savedDoc;
    if (id) {
      // If we are editing, patch or createOrReplace
      // To preserve fields, we can do createOrReplace but we need _id
      savedDoc = await sanityClient.createOrReplace({
        _id: id,
        ...docData,
      });
    } else {
      // If we are adding new
      savedDoc = await sanityClient.create(docData);
    }

    // Fetch final image URL to return to client
    let finalImageUrl = image;
    if (finalImageRef) {
      const assetData = await sanityClient.fetch(
        `*[_id == $ref][0].url`,
        { ref: finalImageRef },
        { cache: "no-store", next: { revalidate: 0 } }
      );
      if (assetData) {
        finalImageUrl = assetData;
      }
    }

    // Revalidate root layout cache
    revalidatePath("/", "layout");

    return {
      success: true,
      data: {
        id: savedDoc._id,
        name: savedDoc.name,
        specialty: savedDoc.specialty,
        experience: savedDoc.experience,
        education: savedDoc.education,
        image: finalImageUrl,
        imageRef: finalImageRef,
      }
    };
  } catch (error: any) {
    console.error("Error saving doctor to Sanity:", error);
    return {
      success: false,
      error: error.message || String(error),
    };
  }
}

export async function deleteDoctorAction(id: string) {
  try {
    await sanityClient.delete(id);
    
    // Revalidate root layout cache
    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting doctor from Sanity:", error);
    return {
      success: false,
      error: error.message || String(error),
    };
  }
}
