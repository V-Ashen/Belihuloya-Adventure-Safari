"use server";

import { adminDb, SiteSettings } from "@belihuloya/core";
import { FieldValue } from "firebase-admin/firestore";

const SETTINGS_DOC_ID = "site_settings";

export async function getSettings(): Promise<SiteSettings> {
  try {
    const docRef = adminDb.collection("settings").doc(SETTINGS_DOC_ID);
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

export async function updateSettings(data: Partial<SiteSettings>) {
  try {
    const docRef = adminDb.collection("settings").doc(SETTINGS_DOC_ID);
    
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    await docRef.set(updateData, { merge: true });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating settings:", error);
    throw new Error("Failed to update settings");
  }
}
