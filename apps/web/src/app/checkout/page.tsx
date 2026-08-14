import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { getTourBySlug } from "@/actions/tours";
import CheckoutForm from "@/components/CheckoutForm";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    tourSlug?: string;
    date?: string;
    pax?: string;
    includesMeals?: string;
  }>;
}

async function CheckoutWrapper({ searchParams }: PageProps) {
  const params = await searchParams;
  const tourSlug = params.tourSlug || "";
  const dateStr = params.date || "";
  const paxParam = parseInt(params.pax || "1") || 1;
  const includesMealsParam = params.includesMeals !== "false";

  const tour = tourSlug ? await getTourBySlug(tourSlug) : null;

  return (
    <CheckoutForm 
      tour={tour}
      dateStr={dateStr}
      paxParam={paxParam}
      includesMealsParam={includesMealsParam}
    />
  );
}

export default function CheckoutPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-mono text-xs text-[#809483] bg-[#0b120c]">
        <Loader2 className="w-8 h-8 text-[#f97316] animate-spin mb-3" />
        <span>PREPARING CHECKOUT...</span>
      </div>
    }>
      <CheckoutWrapper searchParams={searchParams} />
    </Suspense>
  );
}
