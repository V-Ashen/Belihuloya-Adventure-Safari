"use server";

import { adminDb, adminAuth, Booking, BookingStatus, getMonthlyAvailability } from "@belihuloya/core";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createBooking(data: {
  tourId: string;
  tourName: string;
  tourType: 'private' | 'group';
  includesMeals: boolean;
  pricingBasis: 'full_tour' | 'per_person';
  dateStr: string; // YYYY-MM-DD format
  pax: number;
  totalPrice: number;
  paymentOption?: 'advance_30' | 'full';
  amountPaid?: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createAccount?: boolean;
  password?: string;
  notes?: string;
}) {
  try {
    let accountCreated = false;
    
    // Optional User Registration
    if (data.createAccount && data.password && data.customerEmail) {
      try {
        const userRecord = await adminAuth.createUser({
          email: data.customerEmail,
          password: data.password,
          displayName: data.customerName,
          phoneNumber: data.customerPhone.startsWith('+') ? data.customerPhone : undefined,
        });

        await adminDb.collection("users").doc(userRecord.uid).set({
          uid: userRecord.uid,
          email: data.customerEmail,
          name: data.customerName,
          phone: data.customerPhone,
          role: "customer",
          createdAt: new Date(),
        }, { merge: true });

        accountCreated = true;
      } catch (authError: any) {
        console.warn("Account Creation Warning (proceeding with booking):", authError.message);
      }
    }

    const bookingRef = adminDb.collection("bookings").doc(); // Create new ref
    
    // Check global fleet availability for private tours
    if (data.tourType === 'private') {
      const [year, month] = data.dateStr.split('-').map(Number);
      const availabilityMap = await getMonthlyAvailability(year, month);
      const dayAvail = availabilityMap[data.dateStr];
      
      if (!dayAvail) {
        throw new Error("Unable to fetch availability for this date.");
      }
      
      const jeepsNeeded = Math.ceil(data.pax / dayAvail.maxPaxPerJeep);
      
      if (dayAvail.remainingJeeps < jeepsNeeded) {
        throw new Error(`Sorry, we don't have enough jeeps available on ${data.dateStr}. We need ${jeepsNeeded} jeeps for ${data.pax} passengers, but only ${dayAvail.remainingJeeps} are left.`);
      }
    }

    // Execute Firestore Transaction
    await adminDb.runTransaction(async (transaction) => {
      
      if (data.tourType === 'group') {
        const tourRef = adminDb.collection("tours").doc(data.tourId);
        const tourDoc = await transaction.get(tourRef);
        
        if (!tourDoc.exists) throw new Error("Tour not found.");
        
        const tourData = tourDoc.data();
        const totalSeats = Math.max(tourData?.totalSeats || 0, 8);
        const bookedSeats = tourData?.bookedSeats || 0;
        
        if (bookedSeats + data.pax > totalSeats) {
          throw new Error(`Sorry, only ${totalSeats - bookedSeats} seats are available for this tour.`);
        }

        // 1. Create the booking document
        const newBooking: Booking = {
          id: bookingRef.id,
          tourId: data.tourId,
          tourName: data.tourName,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          date: new Date(data.dateStr), // Using JS Date for admin SDK
          pax: data.pax,
          tourType: data.tourType,
          includesMeals: data.includesMeals,
          pricingBasis: data.pricingBasis,
          totalPrice: data.totalPrice,
          paymentOption: data.paymentOption || 'advance_30',
          amountPaid: data.amountPaid || Math.round(data.totalPrice * 0.3),
          createdAccount: accountCreated,
          status: "pending" as BookingStatus,
          createdAt: new Date(),
          notes: data.notes || "",
        };

        transaction.set(bookingRef, newBooking);

        // 2. Update tour bookedSeats
        transaction.update(tourRef, {
          bookedSeats: bookedSeats + data.pax
        });

      } else {
        // 1. Create the booking document for private tour
        const newBooking: Booking = {
          id: bookingRef.id,
          tourId: data.tourId,
          tourName: data.tourName,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          date: new Date(data.dateStr),
          pax: data.pax,
          tourType: data.tourType,
          includesMeals: data.includesMeals,
          pricingBasis: data.pricingBasis,
          totalPrice: data.totalPrice,
          paymentOption: data.paymentOption || 'advance_30',
          amountPaid: data.amountPaid || Math.round(data.totalPrice * 0.3),
          createdAccount: accountCreated,
          status: "pending" as BookingStatus,
          createdAt: new Date(),
          notes: data.notes || "",
        };

        transaction.set(bookingRef, newBooking);
      }
    });

    // Send confirmation email via Resend
    if (process.env.RESEND_API_KEY) {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'Belihuloya Safari <onboarding@resend.dev>';
      try {
        const emailResult = await resend.emails.send({
          from: fromEmail,
          to: [data.customerEmail],
          subject: `Booking Request Received: ${data.tourName}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
              <h2 style="color: #ea580c;">Hello ${data.customerName},</h2>
              <p>Your reservation request for <strong>${data.tourName}</strong> on <strong>${data.dateStr}</strong> has been received.</p>
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
                 <strong>Tour:</strong> ${data.tourName}<br/>
                 <strong>Date:</strong> ${data.dateStr}<br/>
                 <strong>Passengers:</strong> ${data.pax}<br/>
                 <strong>Total Estimate:</strong> LKR ${data.totalPrice.toLocaleString()}<br/>
                 <strong>Amount Paid (${data.paymentOption === 'full' ? 'Full' : '30% Advance'}):</strong> LKR ${(data.amountPaid || Math.round(data.totalPrice * 0.3)).toLocaleString()}<br/>
                 <strong>Balance Due on Arrival:</strong> LKR ${(data.totalPrice - (data.amountPaid || Math.round(data.totalPrice * 0.3))).toLocaleString()}
              </div>
              <p>Our team will review your booking and reach out via WhatsApp/email shortly.</p>
            </div>
          `
        });
        console.log("Resend Email Sent Successfully:", emailResult);
      } catch (err: any) {
        console.error("Resend Email Send Error:", err?.message || err);
      }
    }

    return { success: true, bookingId: bookingRef.id };
  } catch (error: any) {
    console.error("Booking Error:", error);
    return { success: false, error: error.message || "Failed to create booking." };
  }
}
