import { getTours } from "@/actions/tours";
import { Calendar, Mountain, Users } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function ToursCatalog() {
  const allTours = await getTours();

  const campingTours = allTours.filter(t => t.category === "camping_hiking");
  const dayTours = allTours.filter(t => t.category === "day_tour");

  return (
    <div className="pt-24 pb-20 bg-[#0b120c] min-h-screen">
      <div className="container mx-auto px-4">
        
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Expeditions & <span className="text-orange-500">Trails</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Browse our carefully curated selection of extreme 4x4 safaris, scenic camping trips, and waterfall hikes.
          </p>
        </div>

        {campingTours.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-[#18261a] pb-2">Camping & Hiking</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campingTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </div>
        )}

        {dayTours.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-[#18261a] pb-2">Day Tours</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dayTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </div>
        )}
        
        {allTours.length === 0 && (
          <div className="py-20 text-center rounded-2xl bg-[#18261a]/30 border border-[#18261a]">
            <h3 className="text-xl font-bold text-white mb-2">Check back soon!</h3>
            <p className="text-[#a3b3a5]">Our expeditions are currently being updated.</p>
          </div>
        )}

      </div>
    </div>
  );
}

function TourCard({ tour }: { tour: any }) {
  const isGroup = tour.tourType === "group";
  
  let daysLeft = null;
  let seatsAvailable = null;
  
  if (isGroup && tour.scheduledDate) {
    const timeDiff = new Date(tour.scheduledDate).getTime() - new Date().getTime();
    daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (tour.totalSeats) {
      seatsAvailable = tour.totalSeats - (tour.bookedSeats || 0);
    }
  }

  return (
    <Link href={`/tours/${tour.slug}`} className="group bg-[#0b120c] border border-[#18261a] rounded-2xl overflow-hidden hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all flex flex-col">
      {/* Image Header */}
      <div className="h-56 bg-[#18261a] relative overflow-hidden">
        {tour.imageUrl ? (
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${tour.imageUrl})` }} />
        ) : (
          <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b120c] via-[#0b120c]/40 to-transparent z-10" />

        {isGroup && daysLeft !== null && daysLeft > 0 && (
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <div className="bg-orange-500 text-slate-950 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
              {daysLeft} Days Left
            </div>
            {seatsAvailable !== null && (
              <div className="bg-black/60 backdrop-blur-md text-orange-400 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg border border-orange-500/30">
                {seatsAvailable} Seats Left
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
          {tour.title}
        </h2>
        <p className="text-slate-400 text-sm mb-6 line-clamp-2">
          {tour.description}
        </p>
        
        <div className="mt-auto grid grid-cols-2 gap-y-3 text-sm text-[#a3b3a5] mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>{tour.category === "camping_hiking" ? tour.durationDays : `${tour.durationHours} Hours`}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-500" />
            <span className="capitalize">{tour.tourType || 'Private'} Tour</span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <Mountain className="w-4 h-4 text-orange-500" />
            <span className="truncate">{tour.features.length} Highlights</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#18261a]">
          <div className="flex flex-col">
            <span className="text-xs text-[#a3b3a5] uppercase tracking-wider font-semibold">
              Per Person From
            </span>
            <span className="text-xl font-bold text-white">
              LKR {tour.pricing.perPersonFee?.toLocaleString()}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#18261a] flex items-center justify-center group-hover:bg-orange-500 transition-colors">
            <svg className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
