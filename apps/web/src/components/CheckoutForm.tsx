"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, CreditCard, CheckCircle2, Loader2, 
  User, Mail, Phone, ChevronRight, Info, AlertCircle, Lock 
} from "lucide-react";
import { createBooking } from "@/actions/booking";
import { Tour } from "@belihuloya/core";

interface CheckoutFormProps {
  tour: Tour | null;
  dateStr: string;
  paxParam: number;
  includesMealsParam: boolean;
}

export default function CheckoutForm({ tour, dateStr, paxParam, includesMealsParam }: CheckoutFormProps) {
  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState("");

  const [paymentOption, setPaymentOption] = useState<'advance_30' | 'full'>('advance_30');

  // Dummy Card Details
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState<{
    bookingId: string;
    tourTitle: string;
    totalPrice: number;
    amountPaid: number;
    paymentOption: 'advance_30' | 'full';
  } | null>(null);

  if (!tour || !dateStr) {
    return (
      <div className="container mx-auto px-6 py-32 max-w-xl text-center font-sans">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-white uppercase font-display mb-3">Invalid Checkout Details</h1>
        <p className="text-[#a3b3a5] text-sm mb-6">
          Please select an expedition date and passenger count first before proceeding to checkout.
        </p>
        <Link 
          href="/tours" 
          className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-[#0b120c] font-mono text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-sm"
        >
          BROWSE ALL TOURS
        </Link>
      </div>
    );
  }

  // Calculate pricing
  let totalPrice = 0;
  let pricingBasis: 'full_tour' | 'per_person' = 'per_person';
  let cabsNeeded = 1;

  if (tour.tourType === 'private') {
    cabsNeeded = Math.ceil(paxParam / 8);
    let pricePerCab = 0;
    if (includesMealsParam && tour.pricing.fullTourPriceWithMeals) {
      pricePerCab = tour.pricing.fullTourPriceWithMeals;
    } else {
      pricePerCab = tour.pricing.fullTourPrice || ((tour.pricing.perPersonFee || 0) * 8);
    }
    totalPrice = pricePerCab * cabsNeeded;
    pricingBasis = 'full_tour';
  } else {
    totalPrice = (includesMealsParam && tour.pricing.perPersonWithMeals)
      ? tour.pricing.perPersonWithMeals * paxParam 
      : (tour.pricing.perPersonFee || 0) * paxParam;
    pricingBasis = 'per_person';
  }

  const advance30Amount = Math.round(totalPrice * 0.3);
  const amountToPayNow = paymentOption === 'advance_30' ? advance30Amount : totalPrice;
  const remainingBalance = totalPrice - amountToPayNow;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !phone || !email) {
      setErrorMsg("Please fill in your name, mobile/WhatsApp number, and email.");
      return;
    }

    if (createAccount && (!password || password.length < 6)) {
      setErrorMsg("Password must be at least 6 characters long to create an account.");
      return;
    }

    setIsSubmitting(true);

    const res = await createBooking({
      tourId: tour.id || tour.slug,
      tourName: tour.title,
      tourType: tour.tourType || 'private',
      includesMeals: includesMealsParam,
      pricingBasis,
      dateStr: dateStr,
      pax: paxParam,
      totalPrice: totalPrice,
      paymentOption: paymentOption,
      amountPaid: amountToPayNow,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      createAccount: createAccount,
      password: createAccount ? password : undefined,
    });

    setIsSubmitting(false);

    if (res.success && res.bookingId) {
      setBookingSuccess({
        bookingId: res.bookingId,
        tourTitle: tour.title,
        totalPrice: totalPrice,
        amountPaid: amountToPayNow,
        paymentOption: paymentOption,
      });
    } else {
      setErrorMsg(res.error || "Failed to complete reservation. Please try again.");
    }
  };

  // Receipt / Confirmation Screen
  if (bookingSuccess) {
    return (
      <div className="container mx-auto px-6 py-28 max-w-3xl font-sans">
        <div className="bg-[#0e1710] border border-[#1e3323] p-8 sm:p-12 rounded-sm shadow-2xl relative text-center">
          <div className="w-20 h-20 rounded-full bg-[#f97316]/10 border border-[#f97316] flex items-center justify-center text-[#f97316] mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-mono tracking-widest text-[#f97316] uppercase font-bold bg-[#121f14] px-3 py-1 border border-[#1e3323] rounded-sm mb-3 inline-block">
            RESERVATION CONFIRMED
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-tight mb-2">
            Reservation Received!
          </h1>
          <p className="text-[#a3b3a5] text-sm max-w-md mx-auto mb-8 font-sans">
            Thank you, <strong className="text-white">{name}</strong>! Your expedition for <strong className="text-white">{bookingSuccess.tourTitle}</strong> on <strong className="text-white">{dateStr}</strong> is locked.
          </p>

          <div className="bg-[#080d09] border border-[#18261a] p-6 rounded-sm text-left font-mono text-xs space-y-3 mb-8">
            <div className="flex justify-between border-b border-[#18261a] pb-2">
              <span className="text-[#647466]">BOOKING REFERENCE:</span>
              <span className="text-[#f97316] font-bold">{bookingSuccess.bookingId.toUpperCase()}</span>
            </div>
            <div className="flex justify-between border-b border-[#18261a] pb-2">
              <span className="text-[#647466]">TOTAL ESTIMATE:</span>
              <span className="text-white font-bold">LKR {bookingSuccess.totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-[#18261a] pb-2">
              <span className="text-[#647466]">AMOUNT CHARGED ({bookingSuccess.paymentOption === 'advance_30' ? '30% Advance' : 'Full Payment'}):</span>
              <span className="text-emerald-400 font-bold">LKR {bookingSuccess.amountPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-[#647466]">BALANCE DUE ON ARRIVAL:</span>
              <span className="text-white font-bold">LKR {(bookingSuccess.totalPrice - bookingSuccess.amountPaid).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-[#f97316] hover:bg-[#ea580c] text-[#0b120c] font-mono text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-sm transition-colors"
            >
              RETURN TO HOMEPAGE
            </Link>
            <Link
              href="/tours"
              className="inline-flex items-center justify-center bg-[#121f14] hover:bg-[#18261a] border border-[#1e3323] text-white font-mono text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-sm transition-colors"
            >
              VIEW MORE TOURS
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-28 max-w-6xl font-sans">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 mb-6 font-mono text-xs tracking-wider uppercase text-[#809483]">
        <Link href="/tours" className="hover:text-[#f97316] transition-colors font-bold">TOURS</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#f97316]" />
        <Link href={`/tours/${tour.slug}`} className="hover:text-[#f97316] transition-colors font-bold">{tour.title}</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#f97316]" />
        <span className="text-white font-bold">CHECKOUT</span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-black text-white uppercase font-display tracking-tight mb-2">
        Complete Your Reservation
      </h1>
      <p className="text-[#a3b3a5] text-sm md:text-base mb-10 max-w-2xl">
        Review your expedition details, enter customer information, choose your payment option, and complete your booking.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Form Details */}
        <div className="lg:col-span-7 space-y-8">
          <form onSubmit={handleCheckoutSubmit} className="space-y-8">
            
            {errorMsg && (
              <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-sm text-red-300 font-mono text-xs">
                {errorMsg}
              </div>
            )}

            {/* Step 1: Customer Details */}
            <div className="bg-[#0e1710] border border-[#18261a] p-7 rounded-sm space-y-5 shadow-xl">
              <div className="flex items-center gap-3 border-b border-[#18261a] pb-4">
                <span className="w-7 h-7 rounded-sm bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] font-mono font-bold text-xs flex items-center justify-center">01</span>
                <h2 className="text-xl font-bold text-white uppercase font-display tracking-tight">Customer Information</h2>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-[10px] text-[#647466] font-mono font-bold uppercase tracking-widest block mb-1.5">
                  Full Name <span className="text-[#f97316]">*</span>
                </label>
                <div className="bg-[#080d09] border border-[#18261a] rounded-sm p-3 flex items-center gap-3 focus-within:border-[#f97316]">
                  <User className="w-4 h-4 text-[#f97316] shrink-0" />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alexander Wright"
                    className="bg-transparent text-white font-sans text-sm focus:outline-none w-full placeholder-[#647466]"
                  />
                </div>
              </div>

              {/* Mobile / WhatsApp Number */}
              <div>
                <label className="text-[10px] text-[#647466] font-mono font-bold uppercase tracking-widest block mb-1.5">
                  Mobile / WhatsApp Number <span className="text-[#f97316]">*</span>
                </label>
                <div className="bg-[#080d09] border border-[#18261a] rounded-sm p-3 flex items-center gap-3 focus-within:border-[#f97316]">
                  <Phone className="w-4 h-4 text-[#f97316] shrink-0" />
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="bg-transparent text-white font-sans text-sm focus:outline-none w-full placeholder-[#647466]"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="text-[10px] text-[#647466] font-mono font-bold uppercase tracking-widest block mb-1.5">
                  Email Address <span className="text-[#f97316]">*</span>
                </label>
                <div className="bg-[#080d09] border border-[#18261a] rounded-sm p-3 flex items-center gap-3 focus-within:border-[#f97316]">
                  <Mail className="w-4 h-4 text-[#f97316] shrink-0" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="bg-transparent text-white font-sans text-sm focus:outline-none w-full placeholder-[#647466]"
                  />
                </div>
              </div>

              {/* Create Account Checkbox */}
              <div className="pt-2 border-t border-[#18261a]">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={createAccount}
                    onChange={(e) => setCreateAccount(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-[#18261a] text-[#f97316] focus:ring-0 accent-[#f97316]"
                  />
                  <div>
                    <span className="text-white font-bold text-sm block group-hover:text-[#f97316] transition-colors">
                      Create an account
                    </span>
                    <span className="text-[11px] text-[#f97316] font-mono block mt-0.5">
                      * Registered users can get offers
                    </span>
                  </div>
                </label>

                {/* Password field if Create Account is checked */}
                {createAccount && (
                  <div className="mt-4 pt-4 border-t border-[#18261a]/60 animate-in fade-in slide-in-from-top-2 duration-200">
                    <label className="text-[10px] text-[#647466] font-mono font-bold uppercase tracking-widest block mb-1.5">
                      Create Password <span className="text-[#f97316]">*</span>
                    </label>
                    <div className="bg-[#080d09] border border-[#18261a] rounded-sm p-3 flex items-center gap-3 focus-within:border-[#f97316]">
                      <Lock className="w-4 h-4 text-[#f97316] shrink-0" />
                      <input 
                        type="password"
                        required={createAccount}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-transparent text-white font-mono text-sm focus:outline-none w-full placeholder-[#647466]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Payment Option Selector */}
            <div className="bg-[#0e1710] border border-[#18261a] p-7 rounded-sm space-y-5 shadow-xl">
              <div className="flex items-center gap-3 border-b border-[#18261a] pb-4">
                <span className="w-7 h-7 rounded-sm bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] font-mono font-bold text-xs flex items-center justify-center">02</span>
                <h2 className="text-xl font-bold text-white uppercase font-display tracking-tight">Payment Selection</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 30% Advance Option */}
                <div 
                  onClick={() => setPaymentOption('advance_30')}
                  className={`p-5 rounded-sm border cursor-pointer transition-all ${paymentOption === 'advance_30' ? 'bg-[#f97316]/10 border-[#f97316] ring-1 ring-[#f97316]' : 'bg-[#080d09] border-[#18261a] hover:border-[#f97316]/40'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold uppercase text-[#f97316]">30% Advance Payment</span>
                    <input 
                      type="radio" 
                      name="paymentOption" 
                      checked={paymentOption === 'advance_30'} 
                      onChange={() => setPaymentOption('advance_30')}
                      className="accent-[#f97316]"
                    />
                  </div>
                  <div className="text-2xl font-black text-white font-mono mb-1">
                    LKR {advance30Amount.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-[#809483] font-mono">
                    Lock date now. Remaining LKR {remainingBalance.toLocaleString()} paid on arrival.
                  </p>
                </div>

                {/* Full Payment Option */}
                <div 
                  onClick={() => setPaymentOption('full')}
                  className={`p-5 rounded-sm border cursor-pointer transition-all ${paymentOption === 'full' ? 'bg-[#f97316]/10 border-[#f97316] ring-1 ring-[#f97316]' : 'bg-[#080d09] border-[#18261a] hover:border-[#f97316]/40'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold uppercase text-white">Full Payment</span>
                    <input 
                      type="radio" 
                      name="paymentOption" 
                      checked={paymentOption === 'full'} 
                      onChange={() => setPaymentOption('full')}
                      className="accent-[#f97316]"
                    />
                  </div>
                  <div className="text-2xl font-black text-white font-mono mb-1">
                    LKR {totalPrice.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-[#809483] font-mono">
                    Pay 100% upfront. Zero balance due on arrival.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Card Payment Details (Dummy) */}
            <div className="bg-[#0e1710] border border-[#18261a] p-7 rounded-sm space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#18261a] pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-sm bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] font-mono font-bold text-xs flex items-center justify-center">03</span>
                  <h2 className="text-xl font-bold text-white uppercase font-display tracking-tight">Credit / Debit Card</h2>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#f97316]" />
                  <span className="text-[10px] font-mono text-[#647466] uppercase">SSL SECURED</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#647466] font-mono font-bold uppercase tracking-widest block mb-1.5">
                  Cardholder Name
                </label>
                <div className="bg-[#080d09] border border-[#18261a] rounded-sm p-3 focus-within:border-[#f97316]">
                  <input 
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Name on card"
                    className="bg-transparent text-white font-sans text-sm focus:outline-none w-full placeholder-[#647466]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#647466] font-mono font-bold uppercase tracking-widest block mb-1.5">
                  Card Number
                </label>
                <div className="bg-[#080d09] border border-[#18261a] rounded-sm p-3 flex items-center justify-between focus-within:border-[#f97316]">
                  <input 
                    type="text"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 •••• •••• 8892"
                    className="bg-transparent text-white font-mono text-sm focus:outline-none w-full placeholder-[#647466]"
                  />
                  <CreditCard className="w-4 h-4 text-[#647466]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-[#647466] font-mono font-bold uppercase tracking-widest block mb-1.5">
                    Expiry Date
                  </label>
                  <div className="bg-[#080d09] border border-[#18261a] rounded-sm p-3 focus-within:border-[#f97316]">
                    <input 
                      type="text"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM / YY"
                      className="bg-transparent text-white font-mono text-sm focus:outline-none w-full placeholder-[#647466]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-[#647466] font-mono font-bold uppercase tracking-widest block mb-1.5">
                    CVC / CVV
                  </label>
                  <div className="bg-[#080d09] border border-[#18261a] rounded-sm p-3 focus-within:border-[#f97316]">
                    <input 
                      type="password"
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="•••"
                      className="bg-transparent text-white font-mono text-sm focus:outline-none w-full placeholder-[#647466]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Complete Reservation Button */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 px-8 rounded-sm bg-[#f97316] hover:bg-[#ea580c] text-[#0b120c] font-mono font-black text-sm tracking-[0.2em] uppercase transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing Reservation...</>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>COMPLETE RESERVATION (LKR {amountToPayNow.toLocaleString()})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-[#0e1710] border border-[#18261a] p-7 rounded-sm shadow-2xl sticky top-28 space-y-6">
            <h2 className="text-xl font-bold text-white uppercase font-display tracking-tight border-b border-[#18261a] pb-4">
              Expedition Summary
            </h2>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <span className="text-[#647466] uppercase text-[10px] font-bold block mb-1">TOUR TITLE</span>
                <span className="text-white font-bold text-sm uppercase block font-display">{tour.title}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#18261a]">
                <div>
                  <span className="text-[#647466] uppercase text-[10px] font-bold block mb-1">DATE</span>
                  <span className="text-white font-bold">{dateStr}</span>
                </div>
                <div>
                  <span className="text-[#647466] uppercase text-[10px] font-bold block mb-1">PASSENGERS</span>
                  <span className="text-white font-bold">{paxParam} Pax</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#18261a]">
                <span className="text-[#647466] uppercase text-[10px] font-bold block mb-1">MEAL PLAN</span>
                <span className="text-[#f97316] font-bold uppercase">{includesMealsParam ? "Included With Meals" : "Without Meals"}</span>
              </div>

              <div className="pt-4 border-t border-[#18261a] space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#a3b3a5]">Total Estimate:</span>
                  <span className="text-white font-bold">LKR {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-[#f97316]">
                  <span>30% Advance (Minimum):</span>
                  <span className="font-bold">LKR {advance30Amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-[#809483] pt-1">
                  <span>Selected Payment:</span>
                  <span className="text-white font-bold uppercase">
                    {paymentOption === 'advance_30' ? '30% Advance' : 'Full Payment'}
                  </span>
                </div>
              </div>

              <div className="bg-[#080d09] border border-[#18261a] p-4 rounded-sm pt-4 mt-4">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[#647466] font-bold uppercase text-[10px]">DUE NOW</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    LKR {amountToPayNow.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[#647466]">
                  <span>DUE ON ARRIVAL</span>
                  <span className="text-white font-bold font-mono">LKR {remainingBalance.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] font-mono text-[#809483] leading-relaxed flex items-start gap-2 border-t border-[#18261a]">
              <Info className="w-4 h-4 text-[#f97316] shrink-0 mt-0.5" />
              <span>
                30% advance payment locks your jeep slot. Remainder paid upon arrival.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
