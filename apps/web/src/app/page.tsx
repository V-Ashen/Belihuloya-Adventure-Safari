import { MapPin, Droplet, Mountain, Flame, TreePine, Map } from "lucide-react";
import Link from "next/link";
import DestinationsCarousel from "@/components/DestinationsCarousel";
import AnimatedStats from "@/components/AnimatedStats";
import { getSettings } from "@/actions/settings";
import TikTokClips from "@/components/TikTokClips";

export default async function Home() {
  const settings = await getSettings();
  const tiktokLink = settings.socialLinks?.tiktok || "https://www.tiktok.com/@b.a.s_2940?_r=1&_t=ZS-98gJ8mPjJCh";
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

  const reviews = [
    {
      rating: "5.0",
      text: "Booked through Instagram the same week we arrived. The driver knew every rock on Devil's Staircase by name — genuinely felt safer than city traffic.",
      name: "LARS H.",
      location: "NORWAY",
    },
    {
      rating: "4.9",
      text: "Did Baker's Bend with my parents. Easy to book, guide spoke great English, and the viewpoint at the top was worth the whole trip.",
      name: "AMARA K.",
      location: "COLOMBO, LK",
    },
    {
      rating: "5.0",
      text: "Camped overnight on the ridge. No signal, no noise, just the jeep engine cooling down and a sky full of stars. Already rebooking for July.",
      name: "JAKE T.",
      location: "AUSTRALIA",
    },
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
          <div className="text-[#f97316] text-xs sm:text-sm tracking-wider md:tracking-[0.25em] uppercase font-bold mb-6 flex flex-wrap items-center gap-2 md:gap-3 font-mono drop-shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse shrink-0" />
            <span>6.8137° N, 80.8188° E <span className="hidden sm:inline">—</span><br className="sm:hidden" /> SABARAGAMUWA HILL COUNTRY</span>
          </div>

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
              href={tiktokLink}
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

      {/* Logbook / Reviews Section */}
      <section className="py-24 bg-[#080d09] border-t border-[#18261a] relative overflow-hidden">
        {/* Subtle ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f97316]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="mb-16">
            <p className="text-[#f97316] text-[10px] tracking-[0.3em] uppercase font-bold mb-3 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-sm bg-[#f97316] rotate-45" /> TRAIL LOG
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 font-display">
              FROM THE LOGBOOK.
            </h2>
            <p className="text-[#a3b3a5] text-base max-w-2xl font-sans">
              Unedited notes from riders who booked the exact routes above.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-[#0e1710] border border-[#1e3323] p-8 flex flex-col justify-between rounded-sm relative group hover:border-[#f97316]/60 transition-all duration-300 hover:-translate-y-1 shadow-xl"
              >
                <div>
                  {/* Top orange accent bar */}
                  <div className="w-8 h-1 bg-[#f97316] mb-6 rounded-full group-hover:w-16 transition-all duration-300" />

                  {/* Rating Stars & Score */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[#f97316] text-sm tracking-widest font-mono">★★★★★</span>
                    <span className="bg-[#f97316]/10 border border-[#f97316]/20 px-2 py-0.5 text-xs text-[#f97316] font-mono font-bold rounded-sm">
                      {rev.rating} / 5.0
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-[#a3b3a5] text-sm md:text-base leading-relaxed font-sans mb-8 group-hover:text-slate-100 transition-colors">
                    &ldquo;{rev.text}&rdquo;
                  </p>
                </div>

                {/* Footer line & author details */}
                <div className="pt-4 border-t border-[#18261a] flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-white uppercase tracking-wider">{rev.name}</span>
                  <span className="text-[#f97316] tracking-widest text-[10px] uppercase font-bold bg-[#121f14] px-2 py-1 border border-[#1e3323] rounded-sm">
                    {rev.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TikTok Clips Section */}
      <TikTokClips clips={settings.tiktokClips || []} />

      {/* CTA Banner */}
      <section className="bg-[#f97316] py-20 text-center px-4">
        <h2 className="text-4xl md:text-6xl font-black text-[#0b120c] uppercase tracking-tight leading-none mb-4 font-display">
          EVERY JEEP HAS A LIMIT.<br />
          YOURS MIGHT ALREADY BE BOOKED.
        </h2>
        <p className="text-[#3d1a00]/80 text-base mb-10 max-w-md mx-auto font-sans">
          Only 5 jeeps run per day across all routes. Lock your date before someone else does.
        </p>
        <a
          href="https://wa.me/94XXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-[#0b120c] hover:bg-[#050905] text-white text-xs font-bold tracking-[0.2em] uppercase px-10 py-4 rounded-none transition-colors font-mono"
        >
          MESSAGE US ON WHATSAPP
        </a>
      </section>
    </div>
  );
}
