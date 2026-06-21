"use server";

import { sanityClient } from "@/lib/sanity";
import { revalidatePath } from "next/cache";

interface BlogInput {
  id?: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  readTime: string;
}

export async function getBlogs() {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "blog"] | order(date desc) {
        "id": _id,
        title,
        summary,
        content,
        date,
        author,
        readTime
      }`
    );
    return data;
  } catch (error) {
    console.error("Error fetching blogs from Sanity:", error);
    return [];
  }
}

export async function saveBlog(blog: BlogInput) {
  const { id, title, summary, content, date, author, readTime } = blog;

  try {
    const docData: any = {
      _type: "blog",
      title,
      summary,
      content,
      date,
      author,
      readTime,
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
        summary: savedDoc.summary,
        content: savedDoc.content,
        date: savedDoc.date,
        author: savedDoc.author,
        readTime: savedDoc.readTime,
      }
    };
  } catch (error: any) {
    console.error("Error saving blog to Sanity:", error);
    return {
      success: false,
      error: error.message || String(error),
    };
  }
}

export async function deleteBlogAction(id: string) {
  try {
    await sanityClient.delete(id);
    
    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting blog from Sanity:", error);
    return {
      success: false,
      error: error.message || String(error),
    };
  }
}
