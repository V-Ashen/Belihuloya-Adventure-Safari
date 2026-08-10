"use server";

import { adminDb, Booking } from "@belihuloya/core";

export async function getBookings() {
  try {
    const snapshot = await adminDb.collection("bookings").orderBy("createdAt", "desc").get();
    const bookings = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        // Convert Firestore Timestamp to string for client component serialization
        date: data.date?.toDate ? data.date.toDate().toISOString() : data.date,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
      };
    });
    return { success: true, bookings };
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return { success: false, error: error.message };
  }
}

export async function updateBookingStatus(bookingId: string, status: string) {
  try {
    await adminDb.collection("bookings").doc(bookingId).update({ status });
    return { success: true };
  } catch (error: any) {
    console.error("Error updating booking:", error);
    return { success: false, error: error.message };
  }
}
