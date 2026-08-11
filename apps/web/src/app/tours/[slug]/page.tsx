import { getTourBySlug } from "@/actions/tours";
import { notFound } from "next/navigation";
import { Calendar, CheckCircle2, ChevronRight, CarFront, Users } from "lucide-react";
import Link from "next/link";
import BookingWidget from "@/components/BookingWidget";

export const dynamic = 'force-dynamic';

export default async function TourDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    notFound();
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
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
               <span className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider bg-orange-500 text-white">
                 {tour.category === "camping_hiking" ? "Camping & Hiking" : "Day Tour"}
               </span>
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
                  <p className="text-lg font-bold text-white">{tour.durationHours} Hours</p>
                </div>
              </div>
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
                    {(!tour.tourType || tour.tourType === 'private')
                      ? `LKR ${(tour.pricing.fullTourPrice || (tour.pricing.perPersonFee * 8))?.toLocaleString()} (Full Cab)` 
                      : `From LKR ${tour.pricing.perPersonFee?.toLocaleString()} (Per Pax)`}
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

            {/* Features */}
            <section>
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
