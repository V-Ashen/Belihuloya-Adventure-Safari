"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedStats() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Animated state counters
  const [jeeps, setJeeps] = useState(0);
  const [tours, setTours] = useState(0);
  const [rating, setRating] = useState(0);
  const [years, setYears] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Animate Jeeps (0 -> 5)
    let jCount = 0;
    const jTimer = setInterval(() => {
      jCount += 1;
      if (jCount >= 5) {
        setJeeps(5);
        clearInterval(jTimer);
      } else {
        setJeeps(jCount);
      }
    }, 150);

    // Animate Tours (0 -> 1200)
    let tCount = 0;
    const tStep = 30;
    const tTimer = setInterval(() => {
      tCount += tStep;
      if (tCount >= 1200) {
        setTours(1200);
        clearInterval(tTimer);
      } else {
        setTours(tCount);
      }
    }, 20);

    // Animate Rating (0 -> 4.9)
    let rCount = 0;
    const rTimer = setInterval(() => {
      rCount += 0.1;
      if (rCount >= 4.9) {
        setRating(4.9);
        clearInterval(rTimer);
      } else {
        setRating(parseFloat(rCount.toFixed(1)));
      }
    }, 30);

    // Animate Years (0 -> 6)
    let yCount = 0;
    const yTimer = setInterval(() => {
      yCount += 1;
      if (yCount >= 6) {
        setYears(6);
        clearInterval(yTimer);
      } else {
        setYears(yCount);
      }
    }, 150);

    return () => {
      clearInterval(jTimer);
      clearInterval(tTimer);
      clearInterval(rTimer);
      clearInterval(yTimer);
    };
  }, [isVisible]);

  return (
    <div ref={sectionRef} className="bg-[#0b120c] border-t border-[#1a281c]">
      {/* Stats row */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#1a281c]">
          <div className="py-10 px-6 border-r border-[#1a281c]">
            <p className="text-white font-black text-5xl font-mono tracking-tight">
              {jeeps}
            </p>
            <p className="text-[#647466] text-[10px] tracking-[0.25em] uppercase mt-2 font-bold font-mono">
              JEEPS IN FLEET
            </p>
          </div>

          <div className="py-10 px-6 md:border-r border-[#1a281c]">
            <p className="text-white font-black text-5xl font-mono tracking-tight">
              {tours.toLocaleString()}+
            </p>
            <p className="text-[#647466] text-[10px] tracking-[0.25em] uppercase mt-2 font-bold font-mono">
              TOURS RUN
            </p>
          </div>

          <div className="py-10 px-6 border-r border-[#1a281c]">
            <p className="text-white font-black text-5xl font-mono tracking-tight">
              {rating.toFixed(1)}
            </p>
            <p className="text-[#647466] text-[10px] tracking-[0.25em] uppercase mt-2 font-bold font-mono">
              AVG. RATING
            </p>
          </div>

          <div className="py-10 px-6">
            <p className="text-white font-black text-5xl font-mono tracking-tight">
              {years < 10 ? `0${years}` : years}
            </p>
            <p className="text-[#647466] text-[10px] tracking-[0.25em] uppercase mt-2 font-bold font-mono">
              YEARS ON TRAIL
            </p>
          </div>
        </div>
      </div>

      {/* Feature highlights row */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-[#f97316] font-extrabold text-2xl font-display tracking-wide uppercase mb-1">
              Pay on Arrival
            </h4>
            <p className="text-[#647466] text-[11px] font-mono tracking-widest uppercase">
              NO CARD NEEDED TO BOOK
            </p>
          </div>

          <div>
            <h4 className="text-[#f97316] font-extrabold text-2xl font-display tracking-wide uppercase mb-1">
              Licensed Guides
            </h4>
            <p className="text-[#647466] text-[11px] font-mono tracking-widest uppercase">
              LOCAL, ENGLISH-SPEAKING
            </p>
          </div>

          <div>
            <h4 className="text-[#f97316] font-extrabold text-2xl font-display tracking-wide uppercase mb-1">
              Instant Confirm
            </h4>
            <p className="text-[#647466] text-[11px] font-mono tracking-widest uppercase">
              REAL-TIME JEEP AVAILABILITY
            </p>
          </div>

          <div>
            <h4 className="text-[#f97316] font-extrabold text-2xl font-display tracking-wide uppercase mb-1">
              Full Safety Kit
            </h4>
            <p className="text-[#647466] text-[11px] font-mono tracking-widest uppercase">
              ROLL CAGE · HARNESS · FIRST AID
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
