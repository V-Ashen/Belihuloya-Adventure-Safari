import { getTours, deleteTour, toggleTourStatus } from "@/actions/tours";
import { Plus, Map, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import NewTourButton from "@/components/NewTourButton";

export default async function ToursPage() {
  const result = await getTours();
  const tours = result.success ? result.tours : [];

  const campingTours = tours?.filter(t => t.category === "camping_hiking") || [];
  const dayTours = tours?.filter(t => t.category === "day_tour") || [];

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-100">Tour Packages</h2>
          <p className="text-slate-400">Manage all your hiking and camping experiences.</p>
        </div>
        <div className="flex items-center space-x-2">
          <NewTourButton />
        </div>
      </div>

      {/* Camping & Hiking Section */}
      {campingTours.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-bold text-slate-200 mb-6 border-b border-slate-800 pb-2">Camping & Hiking</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campingTours.map((tour) => (
              <AdminTourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      )}

      {/* Day Tours Section */}
      {dayTours.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-bold text-slate-200 mb-6 border-b border-slate-800 pb-2">Tours</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dayTours.map((tour) => (
              <AdminTourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      )}

      {tours?.length === 0 && (
        <div className="col-span-full py-12 text-center rounded-xl border border-dashed border-slate-700 bg-slate-900/50">
          <Map className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-lg font-medium text-slate-300">No tours found</h3>
          <p className="text-sm text-slate-500 mt-1">Get started by creating your first tour package.</p>
        </div>
      )}
    </div>
  );
}

function AdminTourCard({ tour }: { tour: any }) {
  const isGroup = tour.tourType === 'group';
  const isExpired = isGroup && tour.scheduledDate && new Date(tour.scheduledDate) < new Date(new Date().setHours(0,0,0,0));
  const isActive = tour.isActive !== false; // Default true

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-sm flex flex-col relative">
      {isExpired && (
        <div className="absolute inset-0 bg-slate-950/70 z-20 flex flex-col items-center justify-center backdrop-blur-[2px] rounded-xl pointer-events-none">
          <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg font-bold tracking-widest uppercase">Expired</span>
        </div>
      )}

      <div className="relative h-48 w-full bg-slate-800">
        {tour.imageUrl ? (
          <Image src={tour.imageUrl} alt={tour.title} fill className={`object-cover ${isExpired || !isActive ? 'grayscale opacity-50' : ''}`} />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-600">
            <Map className="h-10 w-10 opacity-50" />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-xs font-medium text-white px-2 py-1 rounded-full z-10">
          {tour.tourType === "group" ? "Group" : "Private"}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg text-slate-100 line-clamp-1">{tour.title}</h3>
        <p className="text-slate-400 text-sm mt-1 mb-4 line-clamp-2">{tour.description}</p>
        
        <div className="mt-auto space-y-2 text-sm">
          {isGroup && tour.scheduledDate && (
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-500">Scheduled</span>
              <span className={`font-medium ${isExpired ? 'text-red-400' : 'text-slate-300'}`}>{new Date(tour.scheduledDate).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex justify-between border-b border-slate-800 pb-1">
            <span className="text-slate-500">Per Person (Base)</span>
            <span className="font-medium text-slate-300">LKR {tour.pricing.perPersonFee?.toLocaleString()}</span>
          </div>
          {tour.pricing.perPersonWithMeals ? (
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-500">Per Person (Meals)</span>
              <span className="font-medium text-slate-300">LKR {tour.pricing.perPersonWithMeals?.toLocaleString()}</span>
            </div>
          ) : null}
        </div>
      </div>
      
      <div className="bg-slate-800/50 p-3 border-t border-slate-800 flex justify-between items-center z-10 relative">
        <form action={async () => {
          "use server";
          if(tour.id) await toggleTourStatus(tour.id, isActive);
        }}>
          <button type="submit" className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${isActive ? 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/30 hover:bg-slate-500/20'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </button>
        </form>

        <div className="flex gap-2">
          <Link href={`/tours/${tour.id}`} className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors">
            <Edit className="h-4 w-4" />
          </Link>
          <form action={async () => {
            "use server";
            if(tour.id) await deleteTour(tour.id);
          }}>
            <button type="submit" className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
