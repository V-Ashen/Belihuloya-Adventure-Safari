"use server";

import { adminDb } from "@belihuloya/core";

export async function submitInquiry(data: {
  name: string;
  phone: string;
  email: string;
  date?: string;
  groupSize?: string;
  route: string;
  message: string;
}) {
  try {
    const inquiryRef = adminDb.collection("inquiries").doc();
    await inquiryRef.set({
      id: inquiryRef.id,
      name: data.name,
      phone: data.phone,
      email: data.email,
      date: data.date || "",
      groupSize: data.groupSize || "",
      route: data.route,
      message: data.message,
      status: "new",
      createdAt: new Date(),
    });

    return { success: true, id: inquiryRef.id };
  } catch (error: any) {
    console.error("Error submitting inquiry:", error);
    return { success: false, error: error.message || "Failed to send message." };
  }
}
