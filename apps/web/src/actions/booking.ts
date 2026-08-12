"use server";

import { adminDb, Booking, BookingStatus, getMonthlyAvailability } from "@belihuloya/core";
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
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}) {
  try {
    const bookingRef = adminDb.collection("bookings").doc(); // Create new ref
    
    // Check global fleet availability first
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

    // Execute Firestore Transaction
    await adminDb.runTransaction(async (transaction) => {
      
      if (data.tourType === 'group') {
        const tourRef = adminDb.collection("tours").doc(data.tourId);
        const tourDoc = await transaction.get(tourRef);
        
        if (!tourDoc.exists) throw new Error("Tour not found.");
        
        const tourData = tourDoc.data();
        const totalSeats = tourData?.totalSeats || 0;
        const bookedSeats = tourData?.bookedSeats || 0;
        
        if (totalSeats > 0 && (bookedSeats + data.pax > totalSeats)) {
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
          status: "pending" as BookingStatus,
          createdAt: new Date(),
          notes: data.notes || "",
        };

        transaction.set(bookingRef, newBooking);
      }
    });

    // Send confirmation email via Resend
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Belihuloya Safari <bookings@belihuloyasafari.com>', // MUST BE verified domain or use placeholder 'onboarding@resend.dev' for test
        to: [data.customerEmail],
        subject: `Booking Request Received: ${data.tourName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Hello ${data.customerName},</h2>
            <p>Your booking request for <strong>${data.tourName}</strong> on <strong>${data.dateStr}</strong> has been received.</p>
            <p>Our team will review the availability and confirm your booking via WhatsApp or email shortly.</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
               <strong>Total Price:</strong> ${data.totalPrice.toLocaleString()} LKR<br/>
               <strong>Passengers:</strong> ${data.pax}<br/>
               <strong>Payment:</strong> Cash on Arrival
            </div>
            <p>For urgent inquiries, please reply to this email or call us.</p>
          </div>
        `
      }).catch(err => console.error("Resend Email Error:", err));
    }

    return { success: true, bookingId: bookingRef.id };
  } catch (error: any) {
    console.error("Booking Error:", error);
    return { success: false, error: error.message || "Failed to create booking." };
  }
}
