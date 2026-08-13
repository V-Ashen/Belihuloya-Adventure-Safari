"use server";

import { adminDb, Inquiry } from "@belihuloya/core";

export async function fetchInquiries(): Promise<Inquiry[]> {
  try {
    const snapshot = await adminDb.collection("inquiries").orderBy("createdAt", "desc").get();
    const inquiries: Inquiry[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now());
      inquiries.push({
        id: doc.id,
        name: data.name || "",
        phone: data.phone || "",
        email: data.email || "",
        date: data.date || "",
        groupSize: data.groupSize || "",
        route: data.route || "",
        message: data.message || "",
        status: data.status || "new",
        createdAt,
      });
    });

    return inquiries;
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return [];
  }
}

export async function updateInquiryStatus(id: string, status: "new" | "read" | "replied") {
  try {
    await adminDb.collection("inquiries").doc(id).update({ status });
    return { success: true };
  } catch (error: any) {
    console.error("Error updating inquiry status:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteInquiry(id: string) {
  try {
    await adminDb.collection("inquiries").doc(id).delete();
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting inquiry:", error);
    return { success: false, error: error.message };
  }
}
