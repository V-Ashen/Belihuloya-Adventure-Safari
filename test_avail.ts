import fs from 'fs';
import path from 'path';

// Parse .env.local manually
const envPath = path.join(process.cwd(), 'apps', 'admin', '.env.local');
const envConfig = fs.readFileSync(envPath, 'utf8');
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2];
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1).replace(/\\n/g, '\n');
    }
    process.env[match[1]] = val;
  }
});

import { adminDb } from "./packages/core/src/firebase/admin";
import { Booking, Tour } from "./packages/core/src/types";

async function run() {
  console.log("Fetching private bookings for August...");
  const bookingsSnapshot = await adminDb.collection("bookings")
    .where("date", ">=", new Date(`2026-08-01T00:00:00Z`))
    .where("date", "<=", new Date(`2026-08-31T23:59:59Z`))
    .get();

  bookingsSnapshot.forEach(doc => {
    const b = doc.data() as Booking;
    const d = (b.date as any).toDate ? (b.date as any).toDate() : new Date(b.date as any);
    const dStr = d.toISOString().split("T")[0];
    console.log(`Booking ID: ${doc.id} | Date: ${dStr} | Type: ${b.tourType} | Status: ${b.status} | Pax: ${b.pax}`);
  });

  console.log("\nFetching group tours for August...");
  const groupToursSnapshot = await adminDb.collection("tours")
    .where("tourType", "==", "group")
    .where("scheduledDate", ">=", "2026-08-01")
    .where("scheduledDate", "<=", "2026-08-31T23:59:59")
    .get();

  groupToursSnapshot.forEach(doc => {
    const t = doc.data() as Tour;
    console.log(`Tour ID: ${doc.id} | Date: ${t.scheduledDate} | Seats: ${t.totalSeats}`);
  });
}
run();
