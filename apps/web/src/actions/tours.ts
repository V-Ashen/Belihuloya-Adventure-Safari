"use server";

import { adminDb, Tour } from "@belihuloya/core";

async function getEffectiveGroupSeats(tourId?: string, slug?: string, docTotalSeats?: number, docBookedSeats?: number) {
  // Group tours always have a standard jeep capacity of 8 seats per jeep
  let totalSeats = Math.max(docTotalSeats || 0, 8);
  let bookedSeats = docBookedSeats || 0;

  try {
    const bookingsSnapshot = await adminDb.collection("bookings").get();

    let activePax = 0;
    bookingsSnapshot.forEach(bDoc => {
      const b = bDoc.data();
      // Count all active bookings (pending, confirmed, completed - excluding cancelled or rejected)
      if (b.status !== "cancelled" && b.status !== "rejected") {
        if ((tourId && b.tourId === tourId) || (slug && b.tourId === slug) || (slug && b.tourSlug === slug)) {
          activePax += (b.pax || 0);
        }
      }
    });

    bookedSeats = Math.max(bookedSeats, activePax);
  } catch (err) {
    console.error("Error querying group bookings:", err);
  }

  return { totalSeats, bookedSeats };
}

export async function getTours(): Promise<Tour[]> {
  try {
    const snapshot = await adminDb.collection("tours").orderBy("createdAt", "desc").get();
    
    const tours: Tour[] = [];
    const today = new Date();
    today.setHours(0,0,0,0);

    for (const doc of snapshot.docs) {
      const data = doc.data();

      // Ensure tour is active
      if (data.isActive === false) continue;

      // Auto-expire group tours
      if (data.tourType === 'group' && data.scheduledDate) {
        if (new Date(data.scheduledDate) < today) {
          continue; // Skip expired group tour
        }
      }

      let totalSeats = data.totalSeats ?? 8;
      let bookedSeats = data.bookedSeats || 0;

      if (data.tourType === 'group') {
        const seatsInfo = await getEffectiveGroupSeats(doc.id, data.slug, data.totalSeats, data.bookedSeats);
        totalSeats = seatsInfo.totalSeats;
        bookedSeats = seatsInfo.bookedSeats;
      }

      tours.push({
        id: doc.id,
        title: data.title,
        slug: data.slug,
        tourType: data.tourType,
        scheduledDate: data.scheduledDate,
        totalSeats,
        bookedSeats,
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
    }

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

    let totalSeats = data.totalSeats ?? 8;
    let bookedSeats = data.bookedSeats || 0;

    if (data.tourType === 'group') {
      const seatsInfo = await getEffectiveGroupSeats(doc.id, data.slug, data.totalSeats, data.bookedSeats);
      totalSeats = seatsInfo.totalSeats;
      bookedSeats = seatsInfo.bookedSeats;
    }
    
    return {
      id: doc.id,
      title: data.title,
      slug: data.slug,
      tourType: data.tourType,
      scheduledDate: data.scheduledDate,
      totalSeats,
      bookedSeats,
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
