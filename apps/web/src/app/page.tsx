import { MapPin, Calendar, Users, ChevronRight, Mountain, Flame, TreePine, Droplet, Map } from "lucide-react";
import Link from "next/link";
import DestinationsCarousel from "@/components/DestinationsCarousel";

export default function Home() {
  const places = [
    { title: "Bambarakanda Falls", description: "Sri Lanka's tallest waterfall (263 meters).", image: "2.jpg", type: "Waterfall", icon: <Droplet className="w-3.5 h-3.5" /> },
    { title: "Devil’s Staircase", description: "A notoriously steep and rugged zigzagging mountain trail.", image: "8.jpg", type: "Trail", icon: <Flame className="w-3.5 h-3.5" /> },
    { title: "Horton Plains", description: "A misty, high-altitude grassland plateau.", image: "3.jpg", type: "Plateau", icon: <Mountain className="w-3.5 h-3.5" /> },
    { title: "Lipton’s Seat", description: "A panoramic viewpoint overlooking vast tea estates.", image: "4.webp", type: "Viewpoint", icon: <Map className="w-3.5 h-3.5" /> },
    { title: "Pahanthudawa", description: "A beautiful waterfall shaped like a traditional clay lamp.", image: "9.jpg", type: "Waterfall", icon: <Droplet className="w-3.5 h-3.5" /> },
    { title: "Baker’s Bend", description: "A spectacular horseshoe-shaped mountain viewpoint.", image: "1.jpg", type: "Viewpoint", icon: <Mountain className="w-3.5 h-3.5" /> },
    { title: "Nonpareil", description: "A breathtakingly scenic mountain valley and tea estate.", image: "5.jpg", type: "Valley", icon: <TreePine className="w-3.5 h-3.5" /> },
    { title: "Hunugal Pokuna", description: "A natural limestone pool hidden in the forest.", image: "6.jpg", type: "Nature", icon: <TreePine className="w-3.5 h-3.5" /> },
    { title: "Ohiya", description: "A quiet, misty highland railway village.", image: "7.jpg", type: "Village", icon: <MapPin className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-slate-950">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/20 to-slate-950 z-10" />
        </div>

        <div className="relative z-20 container mx-auto px-4 text-center mt-20">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 backdrop-blur-md text-orange-400 text-sm font-semibold tracking-wide uppercase">
            The Ultimate Off-Road Experience
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Conquer the wild with <br />
            <span className="text-gradient">Belihuloya Safari</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience the thrill of extreme 4x4 trails, pristine river camping, and breathtaking hikes. Your adventure starts here.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/tours" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] flex items-center gap-2">
              Book Your Adventure <ChevronRight className="w-5 h-5" />
            </Link>
            <Link href="/tours" className="glass-panel text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800/80 transition-all flex items-center justify-center">
              View All Routes
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Routes Section */}
      <section id="tours" className="py-24 bg-slate-950 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Our Top Expeditions</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">From scenic family camping to extreme 4x4 trails, we have the perfect adventure for you.</p>
          </div>

          <DestinationsCarousel places={places} />
        </div>
      </section>
    </div>
  );
}
