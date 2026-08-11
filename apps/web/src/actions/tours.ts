import { adminDb, Tour } from "@belihuloya/core";

export async function getTours(): Promise<Tour[]> {
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
      } as Tour);
    });

    return tours;
  } catch (error) {
    console.error("Error fetching tours:", error);
    return [];
  }
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  try {
    const snapshot = await adminDb.collection("tours").where("slug", "==", slug).limit(1).get();
    
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();
    
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
    } as Tour;
  } catch (error) {
    console.error("Error fetching tour by slug:", error);
    return null;
  }
}
