import { MapPin, Calendar, Users, ChevronRight, Mountain, Flame, TreePine } from "lucide-react";

export default function Home() {
  const routes = [
    { name: "Ohiya Camping Expedition", icon: <TreePine className="w-6 h-6 text-green-400" />, level: "Moderate", duration: "1 Night" },
    { name: "Hirikatu Oya River Camping", icon: <TreePine className="w-6 h-6 text-blue-400" />, level: "Easy", duration: "1 Night" },
    { name: "Devil's Staircase Hike", icon: <Flame className="w-6 h-6 text-red-500" />, level: "Extreme", duration: "Full Day" },
    { name: "Hawagala Hiking & Camping", icon: <Mountain className="w-6 h-6 text-purple-400" />, level: "Hard", duration: "1 Night" },
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
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] flex items-center gap-2">
              Book Your Adventure <ChevronRight className="w-5 h-5" />
            </button>
            <button className="glass-panel text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800/80 transition-all">
              View All Routes
            </button>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {routes.map((route, idx) => (
              <div key={idx} className="group glass-panel rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all cursor-pointer">
                <div className="h-48 bg-slate-800 relative">
                  {/* Placeholder for route image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
                </div>
                <div className="p-6 relative z-20">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4 border border-slate-700 group-hover:scale-110 transition-transform">
                    {route.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{route.name}</h3>
                  <div className="flex flex-col gap-2 text-sm text-slate-400 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-400" /> {route.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mountain className="w-4 h-4 text-orange-400" /> {route.level} Difficulty
                    </div>
                  </div>
                  <button className="w-full py-2.5 rounded-lg bg-slate-800 text-white font-semibold group-hover:bg-orange-500 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
