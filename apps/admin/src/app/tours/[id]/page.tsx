import { getTourById } from "@/actions/tours";
import { notFound } from "next/navigation";
import EditTourForm from "@/components/EditTourForm";

export const dynamic = 'force-dynamic';

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tour = await getTourById(id);

  if (!tour) {
    notFound();
  }

  return <EditTourForm tour={tour} />;
}
