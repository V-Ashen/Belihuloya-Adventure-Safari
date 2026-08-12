import { adminDb } from "../firebase/admin";
import { Booking, Tour, FleetSettings, DateOverride } from "../types";

export interface DailyAvailability {
  dateStr: string;
  totalCapacity: number;
  privateJeepsConsumed: number;
  groupJeepsConsumed: number;
  remainingJeeps: number;
  maxPaxPerJeep: number;
}

export async function getMonthlyAvailability(year: number, month: number): Promise<Record<string, DailyAvailability>> {
  // 1. Fetch Fleet Settings
  const settingsDoc = await adminDb.collection("settings").doc("site_settings").get();
  const settings = settingsDoc.exists 
    ? (settingsDoc.data()?.fleet as FleetSettings)
    : undefined;

  const default_daily_jeeps = settings?.default_daily_jeeps || 5;
  const max_pax_per_jeep = settings?.max_pax_per_jeep || 8;

  // 2. Fetch Date Overrides for this month
  // Construct start and end dates for the month
  const startDateStr = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 0); // last day of month
  const endDateStr = `${year}-${String(month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

  const overridesSnapshot = await adminDb.collection("date_overrides")
    .where("dateStr", ">=", startDateStr)
    .where("dateStr", "<=", endDateStr)
    .get();

  const overrides: Record<string, number> = {};
  overridesSnapshot.forEach(doc => {
    const data = doc.data() as DateOverride;
    overrides[data.dateStr] = data.maxJeeps;
  });

  // 3. Fetch Bookings for this month
  const bookingsSnapshot = await adminDb.collection("bookings")
    .where("date", ">=", new Date(`${startDateStr}T00:00:00Z`))
    .where("date", "<=", new Date(`${endDateStr}T23:59:59Z`))
    .get();

  const privateBookingsByDate: Record<string, number> = {}; // Tracks total pax for private tours
  
  bookingsSnapshot.forEach(doc => {
    const b = doc.data() as Booking;
    if (b.status === "cancelled" || b.status === "rejected") return;

    if (b.tourType === 'private') {
      // Date in Firestore could be Timestamp
      const d = (b.date as any).toDate ? (b.date as any).toDate() : new Date(b.date as any);
      
      const dStr = d.toISOString().split("T")[0];
      
      privateBookingsByDate[dStr] = (privateBookingsByDate[dStr] || 0) + b.pax;
    }
  });

  // 4. Fetch Group Tours for this month
  const groupToursSnapshot = await adminDb.collection("tours")
    .where("scheduledDate", ">=", startDateStr)
    .where("scheduledDate", "<=", endDateStr + "T23:59:59")
    .get();

  const groupJeepsByDate: Record<string, number> = {}; // Tracks total jeeps consumed by group tours

  groupToursSnapshot.forEach(doc => {
    const t = doc.data() as Tour;
    if (t.tourType !== "group") return;
    if (t.scheduledDate && t.totalSeats) {
      // scheduledDate is an ISO string or YYYY-MM-DD
      const dStr = t.scheduledDate.split("T")[0];
      const jeepsConsumed = Math.ceil(t.totalSeats / max_pax_per_jeep);
      groupJeepsByDate[dStr] = (groupJeepsByDate[dStr] || 0) + jeepsConsumed;
    }
  });

  // 5. Calculate Daily Availability Map
  const availabilityMap: Record<string, DailyAvailability> = {};
  
  for (let day = 1; day <= endDate.getDate(); day++) {
    const dStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const totalCapacity = overrides[dStr] !== undefined ? overrides[dStr] : default_daily_jeeps;
    
    const privatePax = privateBookingsByDate[dStr] || 0;
    const privateJeepsConsumed = Math.ceil(privatePax / max_pax_per_jeep);
    
    const groupJeepsConsumed = groupJeepsByDate[dStr] || 0;
    
    const remainingJeeps = Math.max(0, totalCapacity - (privateJeepsConsumed + groupJeepsConsumed));

    availabilityMap[dStr] = {
      dateStr: dStr,
      totalCapacity,
      privateJeepsConsumed,
      groupJeepsConsumed,
      remainingJeeps,
      maxPaxPerJeep: max_pax_per_jeep,
    };
  }

  return availabilityMap;
}