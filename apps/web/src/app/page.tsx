import { MapPin, Droplet, Mountain, Flame, TreePine, Map } from "lucide-react";
import Link from "next/link";
import DestinationsCarousel from "@/components/DestinationsCarousel";
import AnimatedStats from "@/components/AnimatedStats";

export default function Home() {
  const places = [
    { title: "Bambarakanda Falls", description: "Sri Lanka's tallest waterfall (263 meters).", image: "2.jpg", type: "Waterfall", icon: <Droplet className="w-3.5 h-3.5" /> },
    { title: "Devil's Staircase", description: "A notoriously steep and rugged zigzagging mountain trail.", image: "8.jpg", type: "Trail", icon: <Flame className="w-3.5 h-3.5" /> },
    { title: "Horton Plains", description: "A misty, high-altitude grassland plateau.", image: "3.jpg", type: "Plateau", icon: <Mountain className="w-3.5 h-3.5" /> },
    { title: "Lipton's Seat", description: "A panoramic viewpoint overlooking vast tea estates.", image: "4.webp", type: "Viewpoint", icon: <Map className="w-3.5 h-3.5" /> },
    { title: "Pahanthudawa", description: "A beautiful waterfall shaped like a traditional clay lamp.", image: "9.jpg", type: "Waterfall", icon: <Droplet className="w-3.5 h-3.5" /> },
    { title: "Baker's Bend", description: "A spectacular horseshoe-shaped mountain viewpoint.", image: "1.jpg", type: "Viewpoint", icon: <Mountain className="w-3.5 h-3.5" /> },
    { title: "Nonpareil", description: "A breathtakingly scenic mountain valley and tea estate.", image: "5.jpg", type: "Valley", icon: <TreePine className="w-3.5 h-3.5" /> },
    { title: "Hunugal Pokuna", description: "A natural limestone pool hidden in the forest.", image: "6.jpg", type: "Nature", icon: <TreePine className="w-3.5 h-3.5" /> },
    { title: "Ohiya", description: "A quiet, misty highland railway village.", image: "7.jpg", type: "Village", icon: <MapPin className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col w-full bg-[#0b120c]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-950 pt-28">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
          {/* Subtle vignette gradient so video is clearly visible */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/20 to-[#0b120c] z-10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-6 py-16 max-w-6xl">
          {/* GPS coordinate line */}
          <p className="text-[#f97316] text-xs tracking-[0.25em] uppercase font-bold mb-6 flex items-center gap-2 font-mono drop-shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse inline-block" />
            6.8137° N, 80.8188° E — SABARAGAMUWA HILL COUNTRY
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[1.05] tracking-tight mb-6 font-display drop-shadow-lg">
            <span className="text-white block">CHASE THE</span>
            <span className="text-[#f97316] block">DEVIL&apos;S STAIRCASE.</span>
          </h1>

          <p className="text-slate-200 text-base md:text-lg max-w-xl leading-relaxed mb-8 font-sans drop-shadow">
            Extreme 4×4 off-road safaris through Belihuloya&apos;s misty highlands — Devil&apos;s Staircase, Baker&apos;s Bend, and the trails between. Real jeeps, real terrain, zero exaggeration.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/tours"
              className="inline-flex items-center justify-center bg-[#f97316] hover:bg-[#ea580c] text-black text-xs font-black tracking-[0.2em] uppercase px-8 py-4 rounded-none font-mono transition-colors shadow-lg"
            >
              BOOK YOUR ADVENTURE
            </Link>
            <a
              href="https://www.tiktok.com/@b.a.s_2940?_r=1&_t=ZS-98gJ8mPjJCh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-black/60 hover:bg-black/80 border border-white/20 text-white text-xs font-bold tracking-[0.2em] uppercase px-8 py-4 rounded-none font-mono transition-colors backdrop-blur-sm shadow-lg"
            >
              WATCH ON TIKTOK
            </a>
          </div>
        </div>
      </section>

      {/* Animated Stats & Feature Highlights */}
      <AnimatedStats />

      {/* Featured Routes Section */}
      <section id="tours" className="py-24 bg-[#080d09] relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <p className="text-[#f97316] text-[10px] tracking-[0.3em] uppercase font-bold mb-3 font-mono">DESTINATIONS</p>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight font-display">OUR TOP EXPEDITIONS</h2>
            </div>
            <Link href="/tours" className="text-[#647466] hover:text-white text-xs tracking-widest uppercase font-bold transition-colors mt-4 md:mt-0 flex items-center gap-2 font-mono">
              VIEW ALL ROUTES →
            </Link>
          </div>
          <DestinationsCarousel places={places} />
        </div>
      </section>

      {/* Tour Packages Section */}
      <section className="py-24 bg-[#0b120c]" id="about">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <p className="text-[#f97316] text-[10px] tracking-[0.3em] uppercase font-bold mb-3 font-mono">HOW IT WORKS</p>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight max-w-xl font-display">CHOOSE YOUR EXPERIENCE</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[#1a281c]">
            {/* Private Tour */}
            <div className="p-10 md:p-12 border-b md:border-b-0 md:border-r border-[#1a281c] bg-[#0d160e] group hover:bg-[#121f14] transition-colors">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-10 h-10 flex items-center justify-center bg-[#f97316]/15 text-[#f97316] font-bold text-xl font-mono">01</span>
                <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight font-display">PRIVATE TOUR</h3>
              </div>
              <p className="text-[#809483] text-sm mb-8 leading-relaxed font-sans">The ultimate VIP experience. Your cab, your schedule, your pace.</p>
              <ul className="space-y-3 mb-10">
                {[
                  "Private safari cab only for you and your group",
                  "Maximum 8 persons per cab",
                  "Visit all attractions at your own pace",
                  "Spend as much time as you like at each location",
                  "More flexible and comfortable experience",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300 text-sm font-sans">
                    <span className="text-[#f97316] mt-0.5 shrink-0 font-mono">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/tours" className="inline-flex items-center gap-3 bg-[#f97316] hover:bg-[#ea580c] text-black text-xs font-bold tracking-[0.2em] uppercase px-8 py-4 transition-colors font-mono">
                BROWSE PRIVATE TOURS
              </Link>
            </div>

            {/* Group Tour */}
            <div className="p-10 md:p-12 bg-[#0d160e] group hover:bg-[#121f14] transition-colors">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-10 h-10 flex items-center justify-center bg-blue-500/15 text-blue-400 font-bold text-xl font-mono">02</span>
                <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight font-display">GROUP TOUR</h3>
              </div>
              <p className="text-[#809483] text-sm mb-8 leading-relaxed font-sans">The smart, budget-friendly way to experience the trails with fellow adventurers.</p>
              <ul className="space-y-3 mb-10">
                {[
                  "Join an already scheduled tour",
                  "Share the tour with other customers",
                  "No minimum or maximum participants from your side",
                  "More budget-friendly option",
                  "Approximately 20 minutes at each attraction",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300 text-sm font-sans">
                    <span className="text-blue-400 mt-0.5 shrink-0 font-mono">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/tours" className="inline-flex items-center gap-3 border border-[#243326] hover:border-blue-400 text-white text-xs font-bold tracking-[0.2em] uppercase px-8 py-4 transition-colors font-mono">
                VIEW SCHEDULED TOURS
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
