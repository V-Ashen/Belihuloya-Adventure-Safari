import { getTourById, getUniqueDestinations } from "@/actions/tours";
import { notFound } from "next/navigation";
import EditTourForm from "@/components/EditTourForm";

export const dynamic = 'force-dynamic';

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tour = await getTourById(id);

  if (!tour) {
    notFound();
  }

  const presetsRes = await getUniqueDestinations();
  const presetDestinations = presetsRes.success ? presetsRes.destinations || [] : [];

  return <EditTourForm tour={tour} presetDestinations={presetDestinations} />;
}
