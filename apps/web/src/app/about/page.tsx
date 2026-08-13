import Metadata from "next";
import Link from "next/link";
import { 
  ShieldCheck, HeartPulse, CheckCircle2, Radio, ArrowRight, 
  Car, Users, Wrench, Anchor
} from "lucide-react";

export const metadata = {
  title: "About & Safety | Belihuloya Adventure Safari",
  description: "Built by people who drive the trail every day. Learn about our modified 4x4 fleet, certified local guides, and extreme safety compliance in Belihuloya.",
};

export default function AboutPage() {
  const safetyItems = [
    {
      title: "Roll cage & harness",
      desc: "Every jeep is fitted with a welded roll cage and 4-point harnesses on all extreme routes.",
      icon: <ShieldCheck className="w-5 h-5 text-[#f97316]" />,
    },
    {
      title: "First-aid trained crew",
      desc: "All guides carry a stocked first-aid kit and hold current wilderness first-aid certification.",
      icon: <HeartPulse className="w-5 h-5 text-[#f97316]" />,
    },
    {
      title: "Pre-trip vehicle checks",
      desc: "Brakes, tyres, and recovery gear inspected before every single departure, logged daily.",
      icon: <CheckCircle2 className="w-5 h-5 text-[#f97316]" />,
    },
    {
      title: "Fleet-wide radio comms",
      desc: "Jeeps on extreme trails stay in constant radio contact in case terrain changes mid-tour.",
      icon: <Radio className="w-5 h-5 text-[#f97316]" />,
    },
  ];

  const fleetSpecs = [
    {
      unit: "UNITS 01–05",
      title: "Modified 4×4 Chassis",
      badge: "EXTREME SPECS",
      desc: "Custom high-clearance suspension, off-road mud tyres, and heavy-duty welded internal roll cages for extreme climbs.",
      icon: <Car className="w-6 h-6 text-[#f97316]" />,
    },
    {
      unit: "8 PAX / JEEP",
      title: "4-Point Safety Harnesses",
      badge: "MAX SAFETY",
      desc: "Every passenger seat is equipped with a 4-point safety harness to keep riders secure on 35-degree mountain inclines.",
      icon: <Users className="w-6 h-6 text-[#f97316]" />,
    },
    {
      unit: "DAILY INSPECTION",
      title: "14-Point Pre-Tour Check",
      badge: "VERIFIED DAILY",
      desc: "Rigorous daily maintenance checks covering brakes, steering linkage, fluid levels, and winch systems before departure.",
      icon: <Wrench className="w-6 h-6 text-[#f97316]" />,
    },
    {
      unit: "RADIO LINK",
      title: "Fleet Comms Network",
      badge: "REAL-TIME LINK",
      desc: "Jeeps on extreme routes maintain active VHF radio contact for instant weather, trail condition, and line clearance updates.",
      icon: <Radio className="w-6 h-6 text-[#f97316]" />,
    },
    {
      unit: "RECOVERY GEAR",
      title: "Winch & Heavy Tow System",
      badge: "SELF-RECOVERY",
      desc: "12,000 lb electric recovery winches, tree-trunk protectors, snatch blocks, and steel traction ladders on all vehicles.",
      icon: <Anchor className="w-6 h-6 text-[#f97316]" />,
    },
  ];

  return (
    <div className="flex flex-col w-full bg-[#0b120c]">
      {/* Page Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden border-b border-[#18261a]">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('https://picsum.photos/seed/about-fleet-hero/1600/900')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b120c]/60 via-[#0b120c]/90 to-[#0b120c]" />

        <div className="relative z-10 container mx-auto px-6 max-w-6xl">
          <div className="text-[#f97316] text-xs tracking-[0.2em] uppercase font-bold mb-4 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm bg-[#f97316] rotate-45" />
            ABOUT & SAFETY
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight font-display max-w-3xl leading-[1.08] mb-6">
            BUILT BY PEOPLE WHO DRIVE THE TRAIL EVERY DAY.
          </h1>
          <p className="text-[#a3b3a5] text-base md:text-lg max-w-2xl leading-relaxed font-sans">
            Belihuloya Adventure Safari started with one jeep and a route nobody else would run. Six years on, it&apos;s still a small, local operation — which is exactly why we know every rock on Devil&apos;s Staircase by name.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 border-b border-[#18261a]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story Image */}
            <div className="lg:col-span-5">
              <div 
                className="aspect-[4/5] bg-cover bg-center rounded-sm border border-[#18261a] shadow-2xl relative"
                style={{ backgroundImage: "url('/about.jpg')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b120c]/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 font-mono text-xs text-[#a3b3a5] uppercase tracking-wider border-l-2 border-[#f97316] pl-3">
                  SABARAGAMUWA HILL COUNTRY, SRI LANKA
                </div>
              </div>
            </div>

            {/* Story Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="text-[#f97316] text-xs tracking-[0.2em] uppercase font-bold font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm bg-[#f97316] rotate-45" />
                OUR STORY
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-display">
                LOCAL GUIDES, REAL TERRAIN, NO EXAGGERATION.
              </h2>
              <div className="space-y-4 text-[#809483] text-base leading-relaxed font-sans">
                <p>
                  We&apos;re based in Belihuloya, in Sri Lanka&apos;s Sabaragamuwa hill country — not a tour agency reselling someone else&apos;s route. Every trail we run, our drivers have taken thousands of times, in every season and every weather condition.
                </p>
                <p>
                  What started as word-of-mouth weekend trips for local off-road enthusiasts turned into a full operation once footage of our jeeps climbing Devil&apos;s Staircase started circulating online. The terrain hasn&apos;t changed — we&apos;ve just gotten better at getting people to it safely.
                </p>
                <p>
                  Today we run a fleet of five modified 4×4 jeeps across four route categories, with a small team of licensed local guides who each specialize in specific trails.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Fleet Section */}
      <section className="py-24 border-b border-[#18261a] bg-[#080d09] relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#f97316]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="text-[#f97316] text-xs tracking-[0.25em] uppercase font-bold mb-3 font-mono flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#f97316] rotate-45" />
                THE FLEET & SPECIFICATIONS
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight font-display">
                FIVE 4×4 JEEPS.<br className="hidden sm:inline" /> DAILY CAPACITY CAP.
              </h2>
            </div>
            <p className="text-[#a3b3a5] text-sm md:text-base font-sans max-w-md leading-relaxed border-l-2 border-[#f97316] pl-4">
              We deliberately cap our operations to our 5-jeep fleet. It guarantees zero double-bookings, meticulous daily servicing, and uncompromised safety.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {fleetSpecs.map((spec, idx) => (
              <div 
                key={idx} 
                className="bg-[#0e1710] border border-[#1e3323] p-7 rounded-sm relative group hover:border-[#f97316]/60 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-sm bg-[#122215] border border-[#1e3323] flex items-center justify-center group-hover:border-[#f97316]/40 transition-colors">
                      {spec.icon}
                    </div>
                    <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20 rounded-sm font-bold">
                      {spec.badge}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono font-bold tracking-widest text-[#f97316] block uppercase mb-1">
                    {spec.unit}
                  </span>
                  <h3 className="text-xl font-bold text-white font-display uppercase tracking-tight mb-3">
                    {spec.title}
                  </h3>
                  <p className="text-[#809483] text-sm leading-relaxed font-sans">
                    {spec.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#18261a] flex items-center justify-between font-mono text-[10px] text-[#647466]">
                  <span>STANDARD FEATURE</span>
                  <span className="text-[#f97316] font-bold">✓ VERIFIED</span>
                </div>
              </div>
            ))}
          </div>

          {/* Live Fleet Status Ribbon */}
          <div className="bg-[#121f14] border border-[#1e3323] p-6 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#a3b3a5]">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-white font-bold tracking-wider uppercase">FLEET OPERATIONAL · 5/5 JEEPS ACTIVE TODAY</span>
            </div>
            <div className="flex items-center gap-6 text-[11px] tracking-wider text-[#647466] uppercase">
              <span>SABARAGAMUWA DEPLOYMENT</span>
              <span className="text-[#f97316] font-bold">100% PREPARED</span>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Compliance Section */}
      <section className="py-20 border-b border-[#18261a] bg-[#080d09]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="max-w-2xl mb-12">
            <div className="text-[#f97316] text-xs tracking-[0.2em] uppercase font-bold mb-3 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-sm bg-[#f97316] rotate-45" />
              SAFETY COMPLIANCE
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-display">
              WHAT&apos;S STANDARD ON EVERY JEEP.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safetyItems.map((item, idx) => (
              <div key={idx} className="bg-[#0e1710] border border-[#18261a] p-6 rounded-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#f97316]/10 border border-[#f97316]/30 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display uppercase mb-1.5">{item.title}</h3>
                  <p className="text-[#809483] text-sm leading-relaxed font-sans">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-20 bg-gradient-to-r from-[#8b3a1f] to-[#f97316] text-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0b120c] uppercase font-display tracking-tight mb-4">
            READY TO RIDE WITH PEOPLE WHO KNOW THE ROAD?
          </h2>
          <p className="text-[#0b120c]/80 text-base md:text-lg mb-8 font-sans max-w-xl mx-auto">
            Browse the full route catalog or message us directly with questions about safety or fitness level.
          </p>
          <Link
            href="/tours"
            className="inline-flex items-center gap-3 bg-[#0b120c] hover:bg-black text-white text-xs font-black tracking-[0.2em] uppercase px-10 py-4 font-mono transition-colors shadow-2xl"
          >
            <span>VIEW ALL ROUTES</span>
            <ArrowRight className="w-4 h-4 text-[#f97316]" />
          </Link>
        </div>
      </section>
    </div>
  );
}
