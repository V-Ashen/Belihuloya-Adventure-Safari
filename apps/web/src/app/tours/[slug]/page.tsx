import { getTourBySlug } from "@/actions/tours";
import { notFound } from "next/navigation";
import { Calendar, CheckCircle2, ChevronRight, CarFront, Users, Clock, MapPin, Tent, Plus } from "lucide-react";
import Link from "next/link";
import BookingWidget from "@/components/BookingWidget";

export const dynamic = 'force-dynamic';

export default async function TourDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

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
    <div className="bg-[#0b120c] text-[#EDE6D3] min-h-screen pb-24 font-sans">
      {/* Hero Header */}
      <section className="relative pt-28 pb-16 min-h-[480px] w-full bg-[#080d09] border-b border-[#18261a] overflow-hidden flex items-end">
        {tour.imageUrl ? (
           <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${tour.imageUrl})` }} />
        ) : (
           <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('/about.jpg')" }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b120c] via-[#0b120c]/70 to-[#0b120c]/30 z-10" />
        
        <div className="relative z-20 container mx-auto px-6 max-w-6xl">
          <div className="flex items-center gap-2 mb-4 font-mono text-xs tracking-wider uppercase text-[#809483]">
            <Link href="/tours" className="hover:text-[#f97316] transition-colors font-bold">TOURS</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#f97316]" />
            <span className="text-white font-bold">{tour.title}</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
             <span className="px-3.5 py-1 rounded-sm text-xs font-mono font-bold uppercase tracking-wider bg-[#f97316] text-[#0b120c] shadow-lg">
               {tour.category === "camping_hiking" ? "Camping & Hiking" : "Day Safari"}
             </span>
             <span className="px-3.5 py-1 rounded-sm text-xs font-mono font-bold uppercase tracking-wider bg-[#121f14] border border-[#1e3323] text-white">
               {tour.tourType === "group" ? "Group Tour" : "Private Tour"}
             </span>
             {isGroup && daysLeft !== null && daysLeft > 0 && (
               <span className="px-3.5 py-1 rounded-sm text-xs font-mono font-bold uppercase tracking-wider bg-white text-[#0b120c]">
                 {daysLeft} Days Left
               </span>
             )}
             {seatsAvailable !== null && (
               <span className="px-3.5 py-1 rounded-sm text-xs font-mono font-bold uppercase tracking-wider bg-[#f97316]/10 border border-[#f97316]/40 text-[#f97316]">
                 {seatsAvailable} Seats Available
               </span>
             )}
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight font-display mb-4 leading-[1.05] max-w-4xl">
            {tour.title}
          </h1>
          
          <p className="text-[#a3b3a5] text-base md:text-lg max-w-2xl leading-relaxed font-sans">
            {tour.description}
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="container mx-auto px-6 max-w-6xl pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Quick Info Bar */}
            <div className="bg-[#0e1710] border border-[#18261a] p-6 rounded-sm grid grid-cols-2 sm:grid-cols-3 gap-6 shadow-xl relative z-30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-[#f97316]/10 border border-[#f97316]/30 flex items-center justify-center text-[#f97316] shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-[#647466] uppercase font-mono tracking-widest font-bold">Duration</p>
                  <p className="text-base font-bold text-white uppercase font-display">
                    {tour.category === "camping_hiking" ? `${tour.durationDays} Days` : `${tour.durationHours} Hours`}
                  </p>
                </div>
              </div>

              {tour.startTime && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-[#f97316]/10 border border-[#f97316]/30 flex items-center justify-center text-[#f97316] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#647466] uppercase font-mono tracking-widest font-bold">Start Time</p>
                    <p className="text-base font-bold text-white uppercase font-display">{tour.startTime}</p>
                  </div>
                </div>
              )}

              {tour.startingPoint && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-[#f97316]/10 border border-[#f97316]/30 flex items-center justify-center text-[#f97316] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#647466] uppercase font-mono tracking-widest font-bold">Start Point</p>
                    <p className="text-base font-bold text-white uppercase font-display truncate max-w-[120px]" title={tour.startingPoint}>{tour.startingPoint}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-[#f97316]/10 border border-[#f97316]/30 flex items-center justify-center text-[#f97316] shrink-0">
                  <CarFront className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-[#647466] uppercase font-mono tracking-widest font-bold">Tour Type</p>
                  <p className="text-base font-bold text-white uppercase font-display">{tour.tourType || 'Private'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-[#f97316]/10 border border-[#f97316]/30 flex items-center justify-center text-[#f97316] shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-[#647466] uppercase font-mono tracking-widest font-bold">Starting Price</p>
                  <p className="text-base font-bold text-white font-mono">
                    LKR {tour.pricing.perPersonFee?.toLocaleString()}
                  </p>
                </div>
              </div>

              {tour.tourType === 'group' && tour.scheduledDate && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-[#f97316]/10 border border-[#f97316]/30 flex items-center justify-center text-[#f97316] shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#647466] uppercase font-mono tracking-widest font-bold">Scheduled</p>
                    <p className="text-base font-bold text-white font-mono">{new Date(tour.scheduledDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Route Program (Timeline) */}
            {tour.routeProgram && tour.routeProgram.length > 0 && (
              <section className="pt-8 border-t border-[#18261a]">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#f97316] rotate-45" />
                  <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight">Route & Expeditions</h2>
                </div>
                <div className="relative border-l-2 border-[#1e3323] ml-3 space-y-4">
                  {tour.routeProgram.map((item, index) => (
                    <div key={index} className="relative pl-6 group">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-[#f97316] ring-4 ring-[#0b120c] group-hover:scale-125 transition-transform" />
                      <div className="bg-[#0e1710] border border-[#18261a] p-4 rounded-sm group-hover:border-[#f97316]/40 transition-colors">
                        <span className="text-white font-bold text-base block font-sans">{item}</span>
                        <span className="text-[10px] text-[#f97316] font-mono tracking-widest uppercase mt-1 block font-bold">Waypoint {index + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Camping & Hiking Specific Sections */}
            {tour.category === "camping_hiking" && (
              <>
                {/* We Provide */}
                {tour.providedItems && tour.providedItems.length > 0 && (
                  <section className="pt-8 border-t border-[#18261a]">
                    <div className="flex items-center gap-3 mb-6">
                      <Tent className="w-5 h-5 text-[#f97316]" />
                      <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight">Included Gear & Provision</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {tour.providedItems.map((item, index) => (
                        <div key={index} className="bg-[#0e1710] border border-[#18261a] p-4 rounded-sm flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-[#f97316] shrink-0" />
                          <span className="text-[#a3b3a5] font-medium text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Optional Add-ons */}
                {tour.optionalAddons && tour.optionalAddons.length > 0 && (
                  <section className="pt-8 border-t border-[#18261a]">
                    <div className="flex items-center gap-3 mb-6">
                      <Plus className="w-5 h-5 text-[#f97316]" />
                      <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight">Optional Add-ons</h2>
                    </div>
                    <div className="space-y-3">
                      {tour.optionalAddons.map((addon, index) => (
                        <div key={index} className="bg-[#0e1710] border border-[#18261a] p-4 rounded-sm flex items-center justify-between gap-4">
                          <span className="text-white font-bold uppercase tracking-wider text-sm font-mono">{addon.name}</span>
                          <span className="text-[#f97316] font-mono font-bold text-sm">+ LKR {addon.priceLKR.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {/* What to Expect / Features */}
            <section className="pt-8 border-t border-[#18261a]">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#f97316] rotate-45" />
                <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight">What To Expect</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tour.features.map((item, index) => (
                  <div key={index} className="bg-[#0e1710] border border-[#18261a] p-4 rounded-sm flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#f97316] shrink-0" />
                    <span className="text-[#a3b3a5] font-medium text-sm">{item}</span>
                  </div>
                ))}
                {tour.features.length === 0 && (
                   <p className="text-[#647466] italic text-sm font-mono">No specific features listed for this route.</p>
                )}
              </div>
            </section>

          </div>

          {/* Sticky Booking Widget (Right Column) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <BookingWidget tour={tour} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
