"use server";

import { getMonthlyAvailability, DailyAvailability } from "@belihuloya/core";

export async function fetchMonthlyAvailability(year: number, month: number): Promise<Record<string, DailyAvailability>> {
  return await getMonthlyAvailability(year, month);
}
