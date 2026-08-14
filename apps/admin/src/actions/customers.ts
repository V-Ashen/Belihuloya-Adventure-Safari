"use server";

import { adminDb } from "@belihuloya/core";

export interface CustomerProfile {
  email: string;
  name: string;
  phone?: string;
  isRegistered: boolean;
  totalBookings: number;
  totalSpent: number;
  createdAt: string; // ISO String
}

export async function getAllCustomers() {
  try {
    // 1. Fetch registered customers
    const usersSnapshot = await adminDb
      .collection("users")
      .where("role", "==", "customer")
      .get();
      
    const customersMap = new Map<string, CustomerProfile>();

    usersSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const email = data.email?.toLowerCase();
      if (email) {
        customersMap.set(email, {
          email,
          name: data.name || "Unknown",
          phone: data.phone || "",
          isRegistered: true,
          totalBookings: 0,
          totalSpent: 0,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        });
      }
    });

    // 2. Fetch all bookings to calculate spend, counts, and find unregistered customers
    const bookingsSnapshot = await adminDb.collection("bookings").get();

    bookingsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const email = data.customerEmail?.toLowerCase();
      const name = data.customerName || "Unknown";
      const phone = data.customerPhone || "";
      const price = data.totalPrice || 0;
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString();

      if (email) {
        if (customersMap.has(email)) {
          // Existing customer (registered or already seen unregistered)
          const customer = customersMap.get(email)!;
          customer.totalBookings += 1;
          customer.totalSpent += price;
          // In case phone wasn't set, update it from booking
          if (!customer.phone && phone) {
            customer.phone = phone;
          }
        } else {
          // Unregistered customer
          customersMap.set(email, {
            email,
            name,
            phone,
            isRegistered: false,
            totalBookings: 1,
            totalSpent: price,
            createdAt: createdAt, // Use their first booking date as their "creation" date
          });
        }
      }
    });

    const customersList = Array.from(customersMap.values());
    
    // Sort primarily by total spent (descending), then by total bookings
    customersList.sort((a, b) => b.totalSpent - a.totalSpent || b.totalBookings - a.totalBookings);

    return { success: true, customers: customersList };
  } catch (error: any) {
    console.error("Error fetching customers:", error);
    return { success: false, error: error.message || "Failed to fetch customers" };
  }
}
