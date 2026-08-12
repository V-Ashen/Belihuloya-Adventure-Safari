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
    <div className="bg-slate-950 min-h-screen pb-24">
      {/* Hero Header */}
      <div className="relative h-[60vh] min-h-[500px] w-full bg-slate-900 overflow-hidden">
        {tour.imageUrl ? (
           <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${tour.imageUrl})` }} />
        ) : (
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />
        
        <div className="absolute bottom-0 left-0 w-full z-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/tours" className="text-slate-400 hover:text-orange-400 transition-colors text-sm font-medium">Tours</Link>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <span className="text-orange-500 text-sm font-semibold">{tour.title}</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
               <span className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                 {tour.category === "camping_hiking" ? "Camping & Hiking" : "Day Tour"}
               </span>
               {isGroup && daysLeft !== null && daysLeft > 0 && (
                 <span className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider bg-white text-slate-950 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                   {daysLeft} Days Left
                 </span>
               )}
               {seatsAvailable !== null && (
                 <span className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider bg-black/60 border border-orange-500/50 text-orange-400 backdrop-blur-sm">
                   {seatsAvailable} Seats Available
                 </span>
               )}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight max-w-4xl">
              {tour.title}
            </h1>
            
            <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
              {tour.description}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Quick Info Bar */}
            <div className="glass-panel p-6 rounded-2xl flex flex-wrap gap-8 items-center justify-between relative z-30 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Duration</p>
                  <p className="text-lg font-bold text-white">
                    {tour.category === "camping_hiking" ? tour.durationDays : `${tour.durationHours} Hours`}
                  </p>
                </div>
              </div>
              {tour.startTime && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Start Time</p>
                    <p className="text-lg font-bold text-white">{tour.startTime}</p>
                  </div>
                </div>
              )}
              {tour.startingPoint && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Starting Point</p>
                    <p className="text-lg font-bold text-white">{tour.startingPoint}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <CarFront className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Tour Type</p>
                  <p className="text-lg font-bold text-white capitalize">{tour.tourType || 'Private'} Tour</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Pricing</p>
                  <p className="text-lg font-bold text-white">
                    From LKR {tour.pricing.perPersonFee?.toLocaleString()} (Per Person)
                  </p>
                </div>
              </div>
              {tour.tourType === 'group' && tour.scheduledDate && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Scheduled Date</p>
                    <p className="text-lg font-bold text-white">{new Date(tour.scheduledDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Route Program (For Both Day Tours & Camping) */}
            {tour.routeProgram && tour.routeProgram.length > 0 && (
              <section className="pt-6 border-t border-slate-800">
                <div className="flex items-center gap-3 mb-8">
                  <MapPin className="w-6 h-6 text-orange-500" />
                  <h2 className="text-3xl font-bold text-white">Route / Program</h2>
                </div>
                <div className="relative border-l-2 border-orange-500/30 ml-4 space-y-6">
                  {tour.routeProgram.map((item, index) => (
                    <div key={index} className="relative pl-8 group">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[9px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-orange-500 ring-4 ring-slate-950 group-hover:scale-125 transition-transform duration-300" />
                      <div className="glass-panel p-4 rounded-xl border border-slate-800/60 group-hover:border-orange-500/30 transition-colors">
                        <span className="text-slate-200 font-bold tracking-wide block">{item}</span>
                        <span className="text-xs text-orange-500/80 font-mono mt-1 block">Stop {index + 1}</span>
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
                  <section className="pt-6 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-6">
                      <Tent className="w-6 h-6 text-orange-500" />
                      <h2 className="text-3xl font-bold text-white">We Provide</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {tour.providedItems.map((item, index) => (
                        <div key={index} className="glass-panel p-4 rounded-xl flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-orange-500" />
                          <span className="text-slate-300 font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Optional Add-ons */}
                {tour.optionalAddons && tour.optionalAddons.length > 0 && (
                  <section className="pt-6 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-6">
                      <Plus className="w-6 h-6 text-orange-500" />
                      <h2 className="text-3xl font-bold text-white">Optional Add-ons</h2>
                    </div>
                    <div className="space-y-4">
                      {tour.optionalAddons.map((addon, index) => (
                        <div key={index} className="glass-panel p-5 rounded-xl flex items-center justify-between gap-4">
                          <span className="text-slate-300 font-bold uppercase tracking-wide">{addon.name}</span>
                          <span className="text-orange-500 font-mono font-bold">{addon.priceLKR.toLocaleString()} LKR</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {/* General Features */}
            <section className={tour.category === "camping_hiking" ? "pt-6 border-t border-slate-800" : ""}>
              <h2 className="text-3xl font-bold text-white mb-6">What to Expect</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tour.features.map((item, index) => (
                  <div key={index} className="glass-panel p-4 rounded-xl flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-slate-300 font-medium">{item}</span>
                  </div>
                ))}
                {tour.features.length === 0 && (
                   <p className="text-slate-500 italic">No features listed.</p>
                )}
              </div>
            </section>

          </div>

          {/* Sticky Booking Widget (Right) */}
          <div className="lg:col-span-1">
            <BookingWidget tour={tour} />
          </div>

        </div>
      </div>
    </div>
  );
}
