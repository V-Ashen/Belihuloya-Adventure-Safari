import { tours } from "@belihuloya/core";
import { Calendar, Mountain, Clock } from "lucide-react";
import Link from "next/link";

export default function ToursCatalog() {
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

        {/* Filter/Sort (Placeholder for future functionality) */}
        <div className="flex gap-4 mb-8">
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium text-sm">All Expeditions</button>
          <button className="glass-panel text-slate-300 hover:text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">Extreme 4x4</button>
          <button className="glass-panel text-slate-300 hover:text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">Camping</button>
          <button className="glass-panel text-slate-300 hover:text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">Hiking</button>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <Link href={`/tours/${tour.slug}`} key={tour.id} className="group glass-panel rounded-2xl overflow-hidden hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all flex flex-col">
              
              {/* Image Header */}
              <div className="h-56 bg-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10" />
                <div className="absolute top-4 left-4 z-20">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                    ${tour.difficulty === 'Extreme' ? 'bg-red-500/90 text-white' : 
                      tour.difficulty === 'Hard' ? 'bg-orange-500/90 text-white' :
                      tour.difficulty === 'Moderate' ? 'bg-amber-500/90 text-white' : 
                      'bg-green-500/90 text-white'}`}>
                    {tour.difficulty}
                  </span>
                </div>
                {/* Fallback pattern for images */}
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />
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
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>{tour.startTime}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Mountain className="w-4 h-4 text-orange-500" />
                    <span className="truncate">{tour.routeProgram.length} Checkpoints</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Starting From</span>
                    <span className="text-xl font-bold text-white">{tour.price.toLocaleString()} {tour.currency}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                    <svg className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
