import { getTours } from "@/actions/tours";
import { Calendar, Mountain, Users } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function ToursCatalog() {
  const allTours = await getTours();

  const campingTours = allTours.filter(t => t.category === "camping_hiking");
  const dayTours = allTours.filter(t => t.category === "day_tour");

  return (
    <div className="pt-24 pb-20 bg-slate-950 min-h-screen">
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
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-slate-800 pb-2">Camping & Hiking</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campingTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </div>
        )}

        {dayTours.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-slate-800 pb-2">Day Tours</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dayTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </div>
        )}
        
        {allTours.length === 0 && (
          <div className="py-20 text-center glass-panel rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Check back soon!</h3>
            <p className="text-slate-400">Our expeditions are currently being updated.</p>
          </div>
        )}

      </div>
    </div>
  );
}

function TourCard({ tour }: { tour: any }) {
  return (
    <Link href={`/tours/${tour.slug}`} className="group glass-panel rounded-2xl overflow-hidden hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all flex flex-col">
      {/* Image Header */}
      <div className="h-56 bg-slate-800 relative overflow-hidden">
        {tour.imageUrl ? (
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${tour.imageUrl})` }} />
        ) : (
          <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10" />
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
          {tour.title}
        </h2>
        <p className="text-slate-400 text-sm mb-6 line-clamp-2">
          {tour.description}
        </p>
        
        <div className="mt-auto grid grid-cols-2 gap-y-3 text-sm text-slate-300 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>{tour.durationHours} Hours</span>
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

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              {tour.tourType === 'private' ? 'Full Cab From' : 'Per Pax From'}
            </span>
            <span className="text-xl font-bold text-white">
              LKR {tour.tourType === 'private' 
                ? (tour.pricing.fullTourPrice || (tour.pricing.perPersonFee * 8))?.toLocaleString()
                : tour.pricing.perPersonFee?.toLocaleString()}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
            <svg className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
