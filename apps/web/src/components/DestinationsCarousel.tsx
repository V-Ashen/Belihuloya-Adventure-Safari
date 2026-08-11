"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Place {
  title: string;
  description: string;
  image: string;
  type: string;
  icon: React.ReactNode;
}

interface DestinationsCarouselProps {
  places: Place[];
}

export default function DestinationsCarousel({ places }: DestinationsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group/carousel">
      {/* Scroll Arrows */}
      <button 
        onClick={scrollLeft}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-orange-500 backdrop-blur text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none -ml-4 shadow-xl border border-white/10"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button 
        onClick={scrollRight}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-orange-500 backdrop-blur text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none -mr-4 shadow-xl border border-white/10"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Carousel Track */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
      >
        {places.map((place, idx) => (
          <div key={idx} className="group relative rounded-2xl overflow-hidden h-80 min-w-[85vw] sm:min-w-[320px] md:min-w-[380px] shrink-0 snap-center cursor-pointer shadow-xl border border-slate-800">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
              style={{ backgroundImage: `url('/${place.image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 z-10 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="absolute inset-x-0 bottom-0 p-6 z-20 flex flex-col justify-end h-full">
              <div className="mb-3 transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0 opacity-80 group-hover:opacity-100">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 text-[11px] font-bold text-green-400 font-mono tracking-wider uppercase">
                  {place.icon} {place.type}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 transform transition-transform duration-500 group-hover:-translate-y-1 font-display tracking-tight uppercase">{place.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed transform transition-all duration-500 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 font-sans">
                {place.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
