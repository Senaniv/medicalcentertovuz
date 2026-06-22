import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== "tovuz123") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const telegramSettings = await sanityClient.fetch(
      `*[_type == "telegramSettings"][0]`,
      {},
      { cache: "no-store", next: { revalidate: 0 } }
    );

    const popupSettings = await sanityClient.fetch(
      `*[_type == "popupSettings"][0] {
        active,
        expirationDate,
        "imageUrl": image.asset->url,
        "imageRef": image.asset->_ref
      }`,
      {},
      { cache: "no-store", next: { revalidate: 0 } }
    );

    const docCount = await sanityClient.fetch(
      `count(*[])`,
      {},
      { cache: "no-store", next: { revalidate: 0 } }
    );

    return NextResponse.json({
      env: {
        NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
        hasWriteToken: !!process.env.SANITY_WRITE_TOKEN,
      },
      telegramSettings,
      popupSettings,
      docCount,
    });
  } catch (err: any) {
    return NextResponse.json({
      error: err.message || String(err),
      env: {
        NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
        hasWriteToken: !!process.env.SANITY_WRITE_TOKEN,
      }
    });
  }
}
