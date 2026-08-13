"use client";

import { useState, useEffect } from "react";
import { Info, Loader2, Users, CarFront, Calendar as CalendarIcon, X } from "lucide-react";
import { createBooking } from "@/actions/booking";
import { fetchMonthlyAvailability } from "@/actions/availability";
import { Tour, DailyAvailability } from "@belihuloya/core";
import { format, getMonth, getYear, isBefore, startOfToday, parseISO } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface BookingWidgetProps {
  tour: Tour;
}

export default function BookingWidget({ tour }: BookingWidgetProps) {
  const [includesMeals, setIncludesMeals] = useState<boolean>(true);

  const [date, setDate] = useState(tour.tourType === 'group' && tour.scheduledDate ? tour.scheduledDate.split('T')[0] : "");
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [availability, setAvailability] = useState<Record<string, DailyAvailability>>({});
  const [isLoadingAvail, setIsLoadingAvail] = useState(false);

  const [pax, setPax] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch availability for the current calendar month
  useEffect(() => {
    if (tour.tourType === 'group') return; // Group tours have fixed dates, no need to fetch full month
    
    const loadAvailability = async () => {
      setIsLoadingAvail(true);
      try {
        const year = getYear(calendarMonth);
        const month = getMonth(calendarMonth) + 1;
        const data = await fetchMonthlyAvailability(year, month);
        setAvailability(data);
      } catch (err) {
        console.error("Failed to fetch availability", err);
      } finally {
        setIsLoadingAvail(false);
      }
    };
    
    loadAvailability();
  }, [calendarMonth, tour.tourType]);

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
      pricePerCab = tour.pricing.fullTourPrice || ((tour.pricing.perPersonFee || 0) * 8);
    }
    totalPrice = pricePerCab * cabsNeeded;
    pricingBasis = 'full_tour';
  } else {
    // Group Tour
    totalPrice = (includesMeals && tour.pricing.perPersonWithMeals)
      ? tour.pricing.perPersonWithMeals * pax 
      : (tour.pricing.perPersonFee || 0) * pax;
    pricingBasis = 'per_person';
  }

  const isGroup = tour.tourType === 'group';
  const availableSeats = isGroup && tour.totalSeats ? tour.totalSeats - (tour.bookedSeats || 0) : null;
  const isSoldOut = availableSeats !== null && availableSeats <= 0;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !name || !email || !phone) {
      setError("Please fill out all required fields.");
      return;
    }
    
    setError("");
    
    // Client-side availability verification for private tours
    if (tour.tourType === 'private') {
       const dayAvail = availability[date];
       if (dayAvail) {
         const jeepsNeeded = Math.ceil(pax / dayAvail.maxPaxPerJeep);
         if (jeepsNeeded > dayAvail.remainingJeeps) {
           setError(`Not enough jeeps available on this date. We need ${jeepsNeeded} jeeps for ${pax} passengers, but only ${dayAvail.remainingJeeps} are left.`);
           return;
         }
       }
    }

    setIsSubmitting(true);

    const result = await createBooking({
      tourId: tour.id || tour.slug,
      tourName: tour.title,
      tourType: tour.tourType || 'private',
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
      <p className="text-slate-400 text-sm mb-6">
        {isSoldOut ? (
          <span className="text-red-400 font-bold bg-red-500/10 px-2 py-1 rounded">Fully Booked</span>
        ) : availableSeats !== null ? (
          <span className="text-orange-400 font-medium bg-orange-500/10 px-2 py-1 rounded">Only {availableSeats} seats left! Secure your spot.</span>
        ) : (
          "Secure your spot today."
        )}
      </p>
      
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
          <div 
            onClick={() => { if (tour.tourType === 'private') setShowCalendar(true); }}
            className={`w-full bg-transparent text-white pt-6 pb-2 px-4 focus:outline-none font-medium flex items-center justify-between ${tour.tourType === 'private' ? 'cursor-pointer' : ''}`}
          >
            <span>{date ? format(parseISO(date), "MMM do, yyyy") : <span className="text-slate-600">Select Date</span>}</span>
            {tour.tourType === 'private' && <CalendarIcon className="w-5 h-5 text-slate-500" />}
          </div>
        </div>

        {/* Custom Calendar Inline Popover */}
        {showCalendar && tour.tourType === 'private' && (
          <div className="bg-slate-950 border border-slate-700 rounded-xl p-4 relative shadow-2xl">
            <button 
              type="button"
              onClick={() => setShowCalendar(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <style dangerouslySetInnerHTML={{
              __html: `
                .rdp { --rdp-cell-size: 35px; margin: 0; }
                .rdp-day_selected { background-color: #f97316 !important; font-weight: bold; }
                .rdp-nav_button { color: #f97316; }
                .rdp-caption_label { font-size: 1rem; font-weight: bold; color: white; }
                .rdp-head_cell { font-size: 0.7rem; color: #94a3b8; }
                .rdp-day { color: white; border-radius: 8px; }
                .rdp-day_disabled { color: #475569; opacity: 0.5; }
              `
            }} />
            
            {isLoadingAvail && (
              <div className="absolute inset-0 bg-slate-950/80 z-10 flex flex-col items-center justify-center rounded-xl">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
                <span className="text-xs text-slate-400">Loading availability...</span>
              </div>
            )}

            <DayPicker
              mode="single"
              selected={date ? parseISO(date) : undefined}
              onSelect={(d) => {
                if (d) {
                  setDate(format(d, "yyyy-MM-dd"));
                  setShowCalendar(false);
                }
              }}
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              disabled={(day) => {
                if (isBefore(day, startOfToday())) return true;
                const dStr = format(day, "yyyy-MM-dd");
                const dayAvail = availability[dStr];
                if (!dayAvail) return false;
                
                const jeepsNeeded = Math.ceil(pax / dayAvail.maxPaxPerJeep);
                return dayAvail.remainingJeeps < jeepsNeeded;
              }}
              modifiers={{
                low: (day) => {
                  const dStr = format(day, "yyyy-MM-dd");
                  const dayAvail = availability[dStr];
                  if (!dayAvail) return false;
                  return dayAvail.remainingJeeps === 1;
                }
              }}
              modifiersStyles={{
                low: { border: '1px solid #f97316', color: '#f97316' }
              }}
            />
            <div className="text-[10px] text-slate-500 text-center mt-2">Dates with low capacity are outlined in orange.</div>
          </div>
        )}
        
        <div className="bg-slate-900 p-2 rounded-xl border border-slate-700 relative focus-within:border-orange-500 transition-colors">
           <label className="text-xs text-slate-500 absolute top-2 left-4 font-semibold uppercase">Passengers</label>
           <input 
            type="number" 
            min="1"
            max={availableSeats !== null ? availableSeats : 100}
            required
            disabled={isSoldOut}
            value={pax}
            onChange={(e) => {
              let val = parseInt(e.target.value) || 1;
              if (availableSeats !== null && val > availableSeats) {
                val = availableSeats;
              }
              setPax(val);
            }}
            className="w-full bg-transparent text-white pt-6 pb-2 px-4 focus:outline-none font-medium disabled:opacity-50" 
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
          disabled={isSubmitting || isSoldOut}
          className={`w-full mt-4 py-4 rounded-xl font-bold text-lg transition-all flex justify-center items-center gap-2 ${
            isSoldOut 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] disabled:opacity-50'
          }`}
        >
          {isSubmitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
          ) : isSoldOut ? (
            "Sold Out"
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
