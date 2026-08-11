"use client";

import { useState } from "react";
import { Info, Loader2, Users, CarFront } from "lucide-react";
import { createBooking } from "@/actions/booking";
import { Tour } from "@belihuloya/core";

interface BookingWidgetProps {
  tour: Tour;
}

export default function BookingWidget({ tour }: BookingWidgetProps) {
  const [includesMeals, setIncludesMeals] = useState<boolean>(true);

  // Default to the scheduled date if it's a group tour, otherwise empty
  const [date, setDate] = useState(tour.tourType === 'group' && tour.scheduledDate ? tour.scheduledDate.split('T')[0] : "");
  const [pax, setPax] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Calculate Price Logic
  let totalPrice = 0;
  let pricingBasis: 'full_tour' | 'per_person' = 'per_person';

  let cabsNeeded = 1;
  if (tour.tourType === 'private') {
    cabsNeeded = Math.ceil(pax / 8);
    let pricePerCab = 0;
    if (includesMeals && tour.pricing.fullTourPriceWithMeals) {
      pricePerCab = tour.pricing.fullTourPriceWithMeals;
    } else {
      pricePerCab = tour.pricing.fullTourPrice || (tour.pricing.perPersonFee * 8);
    }
    totalPrice = pricePerCab * cabsNeeded;
    pricingBasis = 'full_tour';
  } else {
    // Group Tour
    totalPrice = (includesMeals && tour.pricing.perPersonWithMeals)
      ? tour.pricing.perPersonWithMeals * pax 
      : tour.pricing.perPersonFee * pax;
    pricingBasis = 'per_person';
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !name || !email || !phone) {
      setError("Please fill out all required fields.");
      return;
    }
    
    setError("");
    setIsSubmitting(true);

    const result = await createBooking({
      tourId: tour.id || tour.slug,
      tourName: tour.title,
      tourType: tour.tourType,
      includesMeals: !!tour.pricing.perPersonWithMeals ? includesMeals : false,
      pricingBasis,
      dateStr: date,
      pax,
      totalPrice,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
    });

    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "An error occurred.");
    }
  };

  if (success) {
    return (
      <div className="sticky top-28 glass-panel p-8 rounded-3xl border border-green-500/30 bg-green-500/5 text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Booking Requested!</h3>
        <p className="text-slate-300 text-sm mb-6">
          We have received your reservation for {tour.title} on {date}. An email confirmation has been sent.
        </p>
        <p className="text-orange-400 font-semibold mb-2">Total to pay on arrival: {totalPrice.toLocaleString()} LKR</p>
        <button 
          onClick={() => setSuccess(false)}
          className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold transition-colors"
        >
          Book Another Date
        </button>
      </div>
    );
  }

  return (
    <div className="sticky top-28 glass-panel p-8 rounded-3xl border border-orange-500/20 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-2">Book Your Adventure</h3>
      <p className="text-slate-400 text-sm mb-6">Secure your spot today.</p>
      
      {/* Tour Options Selector */}
      <div className="space-y-4 mb-6">
        {!!tour.pricing.perPersonWithMeals && (
          <div>
            <label className="text-xs text-slate-400 font-semibold uppercase mb-2 block">Meal Options</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                type="button"
                onClick={() => setIncludesMeals(true)}
                className={`p-2 rounded-lg border text-sm transition-colors ${includesMeals ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                With Meals
              </button>
              <button 
                type="button"
                onClick={() => setIncludesMeals(false)}
                className={`p-2 rounded-lg border text-sm transition-colors ${!includesMeals ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                Without Meals
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-950/50 p-6 rounded-2xl mb-8 border border-slate-800">
        <div className="flex justify-between items-end mb-2">
          <div className="flex flex-col">
            <span className="text-slate-400 text-sm">Total Estimate</span>
            {tour.tourType === 'private' && cabsNeeded > 1 && (
              <span className="text-xs text-orange-400 font-medium mt-1">Requires {cabsNeeded} Cabs (Max 8 per cab)</span>
            )}
          </div>
          <span className="text-3xl font-black text-white">{totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-end">
          <span className="text-orange-500 font-bold">LKR</span>
        </div>
      </div>

      <form onSubmit={handleBooking} className="space-y-4 mb-6">
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}
        
        <div className={`bg-slate-900 p-2 rounded-xl border border-slate-700 relative transition-colors ${tour.tourType === 'private' ? 'focus-within:border-orange-500' : 'opacity-70'}`}>
          <label className="text-xs text-slate-500 absolute top-2 left-4 font-semibold uppercase">
            {tour.tourType === 'group' ? 'Scheduled Date' : 'Select Date'}
          </label>
          <input 
            type="date" 
            min={new Date().toISOString().split("T")[0]}
            required
            readOnly={tour.tourType === 'group'}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-transparent text-white pt-6 pb-2 px-4 focus:outline-none placeholder-slate-600 font-medium" 
          />
        </div>
        
        <div className="bg-slate-900 p-2 rounded-xl border border-slate-700 relative focus-within:border-orange-500 transition-colors">
           <label className="text-xs text-slate-500 absolute top-2 left-4 font-semibold uppercase">Passengers</label>
           <input 
            type="number" 
            min="1"
            max="100"
            required
            value={pax}
            onChange={(e) => setPax(parseInt(e.target.value) || 1)}
            className="w-full bg-transparent text-white pt-6 pb-2 px-4 focus:outline-none font-medium" 
          />
        </div>

        <div className="bg-slate-900 p-2 rounded-xl border border-slate-700 relative focus-within:border-orange-500 transition-colors">
           <label className="text-xs text-slate-500 absolute top-2 left-4 font-semibold uppercase">Full Name</label>
           <input 
            type="text" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full bg-transparent text-white pt-6 pb-2 px-4 focus:outline-none font-medium" 
          />
        </div>

        <div className="bg-slate-900 p-2 rounded-xl border border-slate-700 relative focus-within:border-orange-500 transition-colors">
           <label className="text-xs text-slate-500 absolute top-2 left-4 font-semibold uppercase">Email Address</label>
           <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="w-full bg-transparent text-white pt-6 pb-2 px-4 focus:outline-none font-medium" 
          />
        </div>

        <div className="bg-slate-900 p-2 rounded-xl border border-slate-700 relative focus-within:border-orange-500 transition-colors">
           <label className="text-xs text-slate-500 absolute top-2 left-4 font-semibold uppercase">WhatsApp / Phone</label>
           <input 
            type="tel" 
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+94 7X XXX XXXX"
            className="w-full bg-transparent text-white pt-6 pb-2 px-4 focus:outline-none font-medium" 
          />
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] flex justify-center items-center gap-2"
        >
          {isSubmitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
          ) : (
            "Complete Reservation"
          )}
        </button>
      </form>
      
      <div className="mt-4 flex items-start gap-3 bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-200 leading-relaxed">
          No payment required right now. Secure your date and pay in cash upon arrival.
        </p>
      </div>
    </div>
  );
}
