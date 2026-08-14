"use client";

import { useState, useEffect } from "react";
import { Info, Loader2, Users, Calendar as CalendarIcon, X, ArrowRight } from "lucide-react";
import { fetchMonthlyAvailability } from "@/actions/availability";
import { Tour, DailyAvailability } from "@belihuloya/core";
import { format, getMonth, getYear, isBefore, startOfToday, parseISO } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useRouter } from "next/navigation";

interface BookingWidgetProps {
  tour: Tour;
}

export default function BookingWidget({ tour }: BookingWidgetProps) {
  const router = useRouter();
  const [includesMeals, setIncludesMeals] = useState<boolean>(true);

  const [date, setDate] = useState(tour.tourType === 'group' && tour.scheduledDate ? tour.scheduledDate.split('T')[0] : "");
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [availability, setAvailability] = useState<Record<string, DailyAvailability>>({});
  const [isLoadingAvail, setIsLoadingAvail] = useState(false);

  const [pax, setPax] = useState(1);
  const [error, setError] = useState("");

  // Fetch availability for the current calendar month
  useEffect(() => {
    if (tour.tourType === 'group') return;
    
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

  const advancePayment30 = Math.round(totalPrice * 0.3);

  const isGroup = tour.tourType === 'group';
  const availableSeats = isGroup ? (tour.totalSeats ?? 8) - (tour.bookedSeats || 0) : null;
  const isSoldOut = availableSeats !== null && availableSeats <= 0;
  const isExceedingSeats = availableSeats !== null && pax > availableSeats;

  const handleProceedToCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setError("Please select a date for your expedition.");
      return;
    }

    // Group tour seat capacity check
    if (tour.tourType === 'group') {
      const totalSeats = tour.totalSeats ?? 8;
      const bookedSeats = tour.bookedSeats || 0;
      const seatsLeft = totalSeats - bookedSeats;

      if (seatsLeft <= 0) {
        setError("Sorry, this group tour is fully booked.");
        return;
      }

      if (pax > seatsLeft) {
        setError(`Only ${seatsLeft} seat${seatsLeft === 1 ? '' : 's'} available.`);
        return;
      }
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

    const queryParams = new URLSearchParams({
      tourSlug: tour.slug,
      date: date,
      pax: pax.toString(),
      includesMeals: includesMeals.toString(),
    });

    router.push(`/checkout?${queryParams.toString()}`);
  };

  return (
    <div className="bg-[#0e1710] border border-[#18261a] p-7 rounded-sm shadow-2xl relative font-sans">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-black text-white uppercase font-display tracking-tight">Book Your Expedition</h3>
          <p className="text-[#809483] text-xs font-mono tracking-wider uppercase mt-1">Instant Online Reservation</p>
        </div>
        {isSoldOut && (
          <span className="text-red-400 font-mono text-[10px] font-bold bg-red-500/10 px-2 py-1 border border-red-500/30 uppercase">Fully Booked</span>
        )}
      </div>
      
      {/* Tour Options Selector */}
      {!!tour.pricing.perPersonWithMeals && (
        <div className="mb-6">
          <label className="text-[10px] text-[#647466] font-mono font-bold uppercase tracking-widest mb-2 block">Meal Plan</label>
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            <button 
              type="button"
              onClick={() => setIncludesMeals(true)}
              className={`py-2.5 px-3 rounded-sm border uppercase transition-colors font-bold ${includesMeals ? 'bg-[#f97316]/10 border-[#f97316] text-[#f97316]' : 'bg-[#080d09] border-[#18261a] text-[#809483] hover:text-white'}`}
            >
              With Meals
            </button>
            <button 
              type="button"
              onClick={() => setIncludesMeals(false)}
              className={`py-2.5 px-3 rounded-sm border uppercase transition-colors font-bold ${!includesMeals ? 'bg-[#f97316]/10 border-[#f97316] text-[#f97316]' : 'bg-[#080d09] border-[#18261a] text-[#809483] hover:text-white'}`}
            >
              Without Meals
            </button>
          </div>
        </div>
      )}

      {/* Total Estimate Display */}
      <div className="bg-[#080d09] p-5 rounded-sm mb-6 border border-[#18261a]">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-[#647466] text-xs font-mono uppercase tracking-wider font-bold">Total Estimate</span>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">{totalPrice.toLocaleString()}</span>
            <span className="text-[#f97316] font-mono font-bold ml-1 text-xs">LKR</span>
          </div>
        </div>
        {tour.tourType === 'private' && cabsNeeded > 1 && (
          <p className="text-[11px] text-[#f97316] font-mono mt-1">Requires {cabsNeeded} Cabs (Max 8 pax per cab)</p>
        )}
        <div className="pt-2 border-t border-[#18261a] mt-3 flex justify-between items-center text-[11px] font-mono text-[#809483]">
          <span>30% Advance to Lock Date:</span>
          <span className="text-white font-bold">LKR {advancePayment30.toLocaleString()}</span>
        </div>
      </div>

      <form onSubmit={handleProceedToCheckout} className="space-y-4 mb-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-sm text-red-300 text-xs font-mono">
            {error}
          </div>
        )}
        
        {/* Date Selector */}
        <div className="bg-[#080d09] p-3 rounded-sm border border-[#18261a] relative focus-within:border-[#f97316] transition-colors">
          <label className="text-[10px] text-[#647466] font-mono font-bold uppercase tracking-widest block mb-1">
            {tour.tourType === 'group' ? 'Scheduled Date' : 'Select Date'}
          </label>
          <div 
            onClick={() => { if (tour.tourType === 'private') setShowCalendar(true); }}
            className={`w-full bg-transparent text-white font-mono text-sm focus:outline-none flex items-center justify-between ${tour.tourType === 'private' ? 'cursor-pointer' : ''}`}
          >
            <span>{date ? format(parseISO(date), "MMMM do, yyyy") : <span className="text-[#647466]">Choose Expedition Date</span>}</span>
            {tour.tourType === 'private' && <CalendarIcon className="w-4 h-4 text-[#f97316]" />}
          </div>
        </div>

        {/* Custom Calendar Inline Popover */}
        {showCalendar && tour.tourType === 'private' && (
          <div className="bg-[#080d09] border border-[#18261a] rounded-sm p-4 relative shadow-2xl z-50">
            <button 
              type="button"
              onClick={() => setShowCalendar(false)}
              className="absolute top-4 right-4 text-[#647466] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <style dangerouslySetInnerHTML={{
              __html: `
                .rdp { --rdp-cell-size: 35px; margin: 0; }
                .rdp-day_selected { background-color: #f97316 !important; font-weight: bold; color: #0b120c !important; }
                .rdp-nav_button { color: #f97316; }
                .rdp-caption_label { font-size: 0.9rem; font-weight: bold; color: white; text-transform: uppercase; font-family: var(--font-mono); }
                .rdp-head_cell { font-size: 0.7rem; color: #647466; font-family: var(--font-mono); }
                .rdp-day { color: white; border-radius: 2px; }
                .rdp-day_disabled { color: #334155; opacity: 0.4; }
              `
            }} />
            
            {isLoadingAvail && (
              <div className="absolute inset-0 bg-[#0b120c]/80 z-10 flex flex-col items-center justify-center rounded-sm">
                <Loader2 className="w-6 h-6 text-[#f97316] animate-spin mb-2" />
                <span className="text-xs text-[#809483] font-mono">Checking availability...</span>
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
            />
          </div>
        )}
        
        {/* Passengers Selector */}
        <div className="bg-[#080d09] p-3 rounded-sm border border-[#18261a] relative focus-within:border-[#f97316] transition-colors">
          <label className="text-[10px] text-[#647466] font-mono font-bold uppercase tracking-widest block mb-1">
            Passengers (Pax)
          </label>
          <div className="flex items-center justify-between">
            <input 
              type="number" 
              min="1"
              max={availableSeats !== null ? availableSeats : 100}
              required
              disabled={isSoldOut}
              value={pax}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                setPax(val);
                if (availableSeats !== null && val > availableSeats) {
                  setError(`Only ${availableSeats} seat${availableSeats === 1 ? '' : 's'} available.`);
                } else {
                  setError("");
                }
              }}
              className="bg-transparent text-white font-mono text-sm focus:outline-none w-full" 
            />
            <Users className="w-4 h-4 text-[#f97316] shrink-0" />
          </div>
        </div>

        {/* Proceed to Checkout Button */}
        <button 
          type="submit"
          disabled={isSoldOut || isExceedingSeats}
          className={`w-full mt-4 py-4 px-6 rounded-sm font-mono font-bold text-xs tracking-[0.15em] uppercase transition-all flex justify-center items-center gap-2 ${
            isSoldOut || isExceedingSeats
              ? 'bg-[#18261a] text-[#647466] cursor-not-allowed border border-[#18261a]' 
              : 'bg-[#f97316] hover:bg-[#ea580c] text-[#0b120c] shadow-lg font-black'
          }`}
        >
          {isSoldOut ? (
            "Sold Out"
          ) : isExceedingSeats ? (
            `Only ${availableSeats} Seats Available`
          ) : (
            <>
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
      
      {/* 30% advance payment notice text under button */}
      <div className="mt-4 p-3 bg-[#121f14] border border-[#1e3323] rounded-sm text-center">
        <p className="text-[11px] font-mono text-[#a3b3a5] leading-relaxed">
          <strong className="text-[#f97316] font-bold">30% advance payment</strong> only for booking or you can pay full payment.
        </p>
      </div>
    </div>
  );
}
