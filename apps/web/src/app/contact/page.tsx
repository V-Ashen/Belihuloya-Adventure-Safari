"use client";

import { useState } from "react";
import { MessageSquare, Mail, MapPin, ChevronDown, CheckCircle2, Send, Loader2, Sparkles } from "lucide-react";

import { submitInquiry } from "@/actions/inquiry";

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    groupSize: "",
    route: "Devil's Staircase — Extreme",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const faqs = [
    {
      q: "How do I pay?",
      a: "Cash on arrival, in LKR or USD. We'll confirm your booking instantly online — no card or deposit needed ahead of time.",
    },
    {
      q: "What if it rains or the trail is unsafe?",
      a: "Guides make the final call the morning of your tour. If a route is closed for weather, we'll offer a reschedule or move you to a lower-risk trail at no extra cost.",
    },
    {
      q: "Is there a minimum or maximum group size?",
      a: "Each jeep seats up to 8 passengers. Solo travelers and couples are grouped with other bookings on the same slot; large groups can book multiple jeeps together.",
    },
    {
      q: "What should I bring?",
      a: "Closed-toe shoes, a light rain layer, water, and sun protection. Full packing guides by route are sent in your confirmation email.",
    },
    {
      q: "Can I cancel or reschedule?",
      a: "Yes — message us on WhatsApp at least 24 hours ahead. Since payment is on arrival, there's no refund process, just a new slot.",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    const res = await submitInquiry(formData);
    setIsSubmitting(false);
    if (res.success) {
      setSubmitted(true);
    } else {
      setErrorMsg(res.error || "Failed to send message.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b120c] text-[#EDE6D3] pt-28 pb-20">
      {/* Page Hero */}
      <section className="relative py-16 md:py-24 border-b border-[#EDE6D3]/10 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1600')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b120c]/60 via-[#0b120c]/80 to-[#0b120c]" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#E8720C]/10 border border-[#E8720C]/30 text-[#FF9138] text-xs font-mono tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Contact & FAQ
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-white uppercase max-w-3xl leading-none">
            Plan a group trip, or <span className="text-[#FF9138]">just ask first.</span>
          </h1>
          <p className="mt-6 text-slate-300 max-w-2xl text-base md:text-lg leading-relaxed">
            For standard bookings, use our route pages directly. For large groups, custom itineraries, or non-standard requests, send us an inquiry or reach out via WhatsApp.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Contact & FAQ */}
          <div className="lg:col-span-6 space-y-10">
            
            {/* Direct Contact Cards */}
            <div className="space-y-4">
              <h2 className="text-xs font-mono tracking-widest uppercase text-[#7C9478] mb-4">Direct Touchpoints</h2>
              
              <a 
                href="https://wa.me/94770000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl bg-[#152318] border border-[#EDE6D3]/10 hover:border-[#E8720C]/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-[#E8720C]/15 border border-[#E8720C]/40 flex items-center justify-center text-[#FF9138] shrink-0 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <b className="block text-white text-base font-display uppercase tracking-wide">WhatsApp — Fastest Response</b>
                  <span className="text-xs text-slate-400">Booking & quick questions, usually under 1 hour</span>
                </div>
              </a>

              <a 
                href="mailto:bookings@belihuloyaadventuresafari.lk" 
                className="flex items-center gap-4 p-5 rounded-2xl bg-[#152318] border border-[#EDE6D3]/10 hover:border-[#E8720C]/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-[#7C9478]/15 border border-[#7C9478]/40 flex items-center justify-center text-[#7C9478] shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <b className="block text-white text-base font-display uppercase tracking-wide">Email — For Group Quotes</b>
                  <span className="text-xs text-slate-400">bookings@belihuloyaadventuresafari.lk</span>
                </div>
              </a>

              <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#152318] border border-[#EDE6D3]/10">
                <div className="w-12 h-12 rounded-full bg-[#7C9478]/15 border border-[#7C9478]/40 flex items-center justify-center text-[#7C9478] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <b className="block text-white text-base font-display uppercase tracking-wide">Meeting Point</b>
                  <span className="text-xs text-slate-400">Belihuloya Town Center, Sabaragamuwa Province, Sri Lanka</span>
                </div>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4 pt-4">
              <div className="mb-4">
                <div className="text-xs font-mono tracking-widest uppercase text-[#FF9138] mb-1">Frequently Asked Questions</div>
                <h2 className="text-2xl font-bold font-display uppercase text-white">Before You Ask</h2>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div 
                      key={index} 
                      className="rounded-2xl bg-[#152318] border border-[#EDE6D3]/10 overflow-hidden transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full p-5 text-left flex items-center justify-between font-display text-lg uppercase font-medium text-white hover:text-[#FF9138] transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-5 h-5 text-[#E8720C] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {isOpen && (
                        <div className="px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-[#EDE6D3]/5 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Group & Custom Inquiries Form */}
          <div className="lg:col-span-6">
            <div className="p-8 md:p-10 rounded-3xl bg-[#152318] border border-[#EDE6D3]/15 shadow-2xl relative overflow-hidden">
              <div className="text-xs font-mono tracking-widest uppercase text-[#FF9138] mb-2">Group & Custom Inquiries</div>
              <h2 className="text-2xl md:text-3xl font-bold font-display uppercase text-white mb-6">Tell us what you&apos;re planning</h2>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#E8720C]/20 border border-[#E8720C] text-[#FF9138] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-display uppercase text-white">Inquiry Sent!</h3>
                  <p className="text-slate-300 text-sm max-w-sm mx-auto">
                    Thank you, {formData.name || 'Explorer'}! We have received your inquiry and will get back to you via WhatsApp/Email shortly.
                  </p>
                  <button 
                    onClick={() => { setSubmitted(false); setFormData({ name: "", phone: "", email: "", date: "", groupSize: "", route: "Devil's Staircase — Extreme", message: "" }); }}
                    className="mt-4 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs uppercase tracking-wider transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#7C9478] mb-1.5">Full Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#0F1B12] border border-[#EDE6D3]/15 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#E8720C] text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#7C9478] mb-1.5">Phone / WhatsApp</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="+94 71 234 5678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#0F1B12] border border-[#EDE6D3]/15 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#E8720C] text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#7C9478] mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#0F1B12] border border-[#EDE6D3]/15 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#E8720C] text-sm transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#7C9478] mb-1.5">Preferred Date</label>
                      <input 
                        type="date" 
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-[#0F1B12] border border-[#EDE6D3]/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8720C] text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#7C9478] mb-1.5">Group Size</label>
                      <input 
                        type="number" 
                        min="1"
                        placeholder="e.g. 8"
                        value={formData.groupSize}
                        onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                        className="w-full bg-[#0F1B12] border border-[#EDE6D3]/15 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#E8720C] text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#7C9478] mb-1.5">Interested Route</label>
                    <select 
                      value={formData.route}
                      onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                      className="w-full bg-[#0F1B12] border border-[#EDE6D3]/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8720C] text-sm transition-colors"
                    >
                      <option>Devil&apos;s Staircase — Extreme</option>
                      <option>Baker&apos;s Bend — Scenic</option>
                      <option>Ridge Camp Overnight</option>
                      <option>Forest Waterfall Trek</option>
                      <option>Not sure — recommend one</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#7C9478] mb-1.5">Message</label>
                    <textarea 
                      rows={4}
                      placeholder="Tell us about your group, fitness level, or any special requests..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#0F1B12] border border-[#EDE6D3]/15 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#E8720C] text-sm transition-colors"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-[#E8720C] hover:bg-[#FF9138] text-[#0F1B12] font-mono font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(232,114,12,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Inquiry</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
