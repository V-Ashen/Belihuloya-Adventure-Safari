"use server";

import { adminDb, SiteSettings } from "@belihuloya/core";

export async function getSettings(): Promise<SiteSettings> {
  try {
    const docRef = adminDb.collection("settings").doc("site_settings");
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      return { id: docSnap.id, ...docSnap.data() } as SiteSettings;
    }

    // Default settings if none exist
    return {
      socialLinks: {
        facebook: "",
        tiktok: "",
        youtube: "",
        instagram: "",
      },
      pixelIds: {
        meta: "",
        tiktok: "",
      },
      tiktokClips: [],
    };
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw new Error("Failed to fetch settings");
  }
}
