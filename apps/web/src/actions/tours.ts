import { adminDb, Tour } from "@belihuloya/core";

export async function getTours(): Promise<Tour[]> {
  try {
    const snapshot = await adminDb.collection("tours").orderBy("createdAt", "desc").get();
    
    const tours: Tour[] = [];
    const today = new Date();
    today.setHours(0,0,0,0);

    snapshot.forEach((doc) => {
      const data = doc.data();

      // Ensure tour is active
      if (data.isActive === false) return;

      // Auto-expire group tours
      if (data.tourType === 'group' && data.scheduledDate) {
        if (new Date(data.scheduledDate) < today) {
          return; // Skip expired group tour
        }
      }

      tours.push({
        id: doc.id,
        title: data.title,
        slug: data.slug,
        tourType: data.tourType,
        scheduledDate: data.scheduledDate,
        category: data.category,
        description: data.description,
        durationHours: data.durationHours,
        durationDays: data.durationDays,
        startTime: data.startTime,
        startingPoint: data.startingPoint,
        imageUrl: data.imageUrl,
        pricing: data.pricing,
        features: data.features,
        providedItems: data.providedItems,
        routeProgram: data.routeProgram,
        optionalAddons: data.optionalAddons,
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

    if (data.isActive === false) return null;

    if (data.tourType === 'group' && data.scheduledDate) {
      const today = new Date();
      today.setHours(0,0,0,0);
      if (new Date(data.scheduledDate) < today) {
        return null;
      }
    }
    
    return {
      id: doc.id,
      title: data.title,
      slug: data.slug,
      tourType: data.tourType,
      scheduledDate: data.scheduledDate,
      category: data.category,
      description: data.description,
      durationHours: data.durationHours,
      durationDays: data.durationDays,
      startTime: data.startTime,
      startingPoint: data.startingPoint,
      imageUrl: data.imageUrl,
      pricing: data.pricing,
      features: data.features,
      providedItems: data.providedItems,
      routeProgram: data.routeProgram,
      optionalAddons: data.optionalAddons,
    } as Tour;
  } catch (error) {
    console.error("Error fetching tour by slug:", error);
    return null;
  }
}
