"use server";

import { adminDb, Tour } from "@belihuloya/core";
import { revalidatePath } from "next/cache";

export async function getTours() {
  try {
    const snapshot = await adminDb.collection("tours").orderBy("createdAt", "desc").get();
    
    const tours: Tour[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      tours.push({
        id: doc.id,
        title: data.title,
        slug: data.slug,
        tourType: data.tourType,
        scheduledDate: data.scheduledDate,
        category: data.category,
        description: data.description,
        durationHours: data.durationHours,
        imageUrl: data.imageUrl,
        pricing: data.pricing,
        features: data.features,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Tour);
    });

    return { success: true, tours };
  } catch (error) {
    console.error("Error fetching tours:", error);
    return { success: false, error: "Failed to fetch tours" };
  }
}

export async function createTour(tourData: Omit<Tour, "id" | "createdAt">) {
  try {
    const docRef = await adminDb.collection("tours").add({
      ...tourData,
      createdAt: new Date(),
    });
    
    revalidatePath("/tours");
    return { success: true, tourId: docRef.id };
  } catch (error) {
    console.error("Error creating tour:", error);
    return { success: false, error: "Failed to create tour" };
  }
}

export async function deleteTour(tourId: string) {
  try {
    await adminDb.collection("tours").doc(tourId).delete();
    revalidatePath("/tours");
    return { success: true };
  } catch (error) {
    console.error("Error deleting tour:", error);
    return { success: false, error: "Failed to delete tour" };
  }
}

export async function getTourById(id: string) {
  try {
    const doc = await adminDb.collection("tours").doc(id).get();
    if (!doc.exists) return null;
    
    const data = doc.data()!;
    return {
      id: doc.id,
      title: data.title,
      slug: data.slug,
      tourType: data.tourType,
      scheduledDate: data.scheduledDate,
      category: data.category,
      description: data.description,
      durationHours: data.durationHours,
      imageUrl: data.imageUrl,
      pricing: data.pricing,
      features: data.features,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Tour;
  } catch (error) {
    console.error("Error fetching tour:", error);
    return null;
  }
}

export async function updateTour(id: string, tourData: Partial<Omit<Tour, "id" | "createdAt">>) {
  try {
    await adminDb.collection("tours").doc(id).update(tourData);
    revalidatePath("/tours");
    return { success: true };
  } catch (error) {
    console.error("Error updating tour:", error);
    return { success: false, error: "Failed to update tour" };
  }
}
