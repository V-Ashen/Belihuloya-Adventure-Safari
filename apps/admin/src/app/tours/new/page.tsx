import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { getUniqueDestinations } from "@/actions/tours";
import NewTourClient from "./NewTourClient";

export default async function NewTourPage() {
  const presetsRes = await getUniqueDestinations();
  const presetDestinations = presetsRes.success ? presetsRes.destinations || [] : [];

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>}>
      <NewTourClient presetDestinations={presetDestinations} />
    </Suspense>
  );
}
