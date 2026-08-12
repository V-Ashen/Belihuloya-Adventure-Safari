"use server";

import { adminDb, DateOverride, getMonthlyAvailability, DailyAvailability } from "@belihuloya/core";

export async function fetchMonthlyAvailability(year: number, month: number): Promise<Record<string, DailyAvailability>> {
  return await getMonthlyAvailability(year, month);
}

export async function setDateOverride(dateStr: string, maxJeeps: number, reason: string = ""): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = adminDb.collection("date_overrides").doc(dateStr);
    
    if (maxJeeps === -1) {
      // Magic number to clear the override
      await docRef.delete();
      return { success: true };
    }

    const override: DateOverride = {
      id: dateStr,
      dateStr,
      maxJeeps,
      reason,
      updatedAt: new Date(),
    };

    await docRef.set(override);
    return { success: true };
  } catch (error) {
    console.error("Error setting date override:", error);
    return { success: false, error: "Failed to update date override" };
  }
}
