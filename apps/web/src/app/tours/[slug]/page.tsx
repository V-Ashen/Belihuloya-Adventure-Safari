import { tours } from "@belihuloya/core";
import { notFound } from "next/navigation";
import { Calendar, Clock, Mountain, MapPin, CheckCircle2, ChevronRight, Info } from "lucide-react";
import Link from "next/link";
import BookingWidget from "@/components/BookingWidget";

export default function TourDetailsPage({ params }: { params: { slug: string } }) {
  const tour = tours.find((t) => t.slug === params.slug);

  if (!tour) {
    notFound();
  }

  return (
    <div className="bg-slate-950 min-h-screen pb-24">
      {/* Hero Header */}
      <div className="relative h-[60vh] min-h-[500px] w-full bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0" />
        
        <div className="absolute bottom-0 left-0 w-full z-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/tours" className="text-slate-400 hover:text-orange-400 transition-colors text-sm font-medium">Tours</Link>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <span className="text-orange-500 text-sm font-semibold">{tour.title}</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
               <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider
                    ${tour.difficulty === 'Extreme' ? 'bg-red-500 text-white' : 
                      tour.difficulty === 'Hard' ? 'bg-orange-500 text-white' :
                      tour.difficulty === 'Moderate' ? 'bg-amber-500 text-white' : 
                      'bg-green-500 text-white'}`}>
                    {tour.difficulty} Difficulty
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
                  <p className="text-lg font-bold text-white">{tour.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Start Time</p>
                  <p className="text-lg font-bold text-white">{tour.startTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Mountain className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Base Price</p>
                  <p className="text-lg font-bold text-white">{tour.price.toLocaleString()} {tour.currency}</p>
                </div>
              </div>
            </div>

            {/* Route & Program */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <MapPin className="text-orange-500" /> Route & Program
              </h2>
              <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
                {/* Visual timeline line */}
                <div className="absolute left-[45px] top-12 bottom-12 w-0.5 bg-slate-800" />
                
                <div className="space-y-8 relative z-10">
                  {tour.routeProgram.map((stop, index) => (
                    <div key={index} className="flex items-center gap-6">
                      <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-orange-500 flex items-center justify-center font-bold text-orange-400 text-sm z-10 shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-200">{stop}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Inclusions */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-6">What We Provide</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tour.inclusions.map((item, index) => (
                  <div key={index} className="glass-panel p-4 rounded-xl flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-slate-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Optional Add-ons */}
            {tour.optionalAddons.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-white mb-6">Optional Add-ons</h2>
                <div className="space-y-4">
                  {tour.optionalAddons.map((addon, index) => (
                    <div key={index} className="glass-panel p-5 rounded-xl flex justify-between items-center border border-dashed border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                          <span className="text-orange-400 font-bold">+</span>
                        </div>
                        <span className="text-slate-200 font-semibold text-lg">{addon.name}</span>
                      </div>
                      {addon.price && (
                        <span className="text-orange-400 font-bold">{addon.price}</span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Sticky Booking Widget (Right) */}
          <div className="lg:col-span-1">
            <BookingWidget 
              tourId={tour.id} 
              tourName={tour.title}
              price={tour.price}
              currency={tour.currency}
              priceType={tour.priceType}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
