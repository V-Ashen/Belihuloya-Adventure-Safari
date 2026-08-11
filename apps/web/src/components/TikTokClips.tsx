"use client";

import { Play } from "lucide-react";
import { TikTokClip } from "@belihuloya/core";

export default function TikTokClips({ clips }: { clips: TikTokClip[] }) {
  if (!clips || clips.length === 0) return null;

  return (
    <section className="py-24 bg-[#0b120c] border-t border-[#1a281c]">
      <div className="container mx-auto px-6">
        <div className="mb-14">
          <p className="text-[#f97316] text-[10px] tracking-[0.3em] uppercase font-bold mb-3 font-mono flex items-center gap-2">
            <span className="text-[#f97316]">◆</span> LATEST FOOTAGE
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 font-display">
            ACTION CLIPS.
          </h2>
        </div>
        
        <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory pb-6 -mx-6 px-6 md:overflow-visible md:snap-none md:pb-0 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {clips.slice(0, 4).map((clip) => (
            <div key={clip.id} className="relative group bg-black rounded-none border border-[#1a281c] overflow-hidden aspect-[9/16] cursor-pointer w-[200px] sm:w-[240px] md:w-auto shrink-0 snap-center">
              <video 
                src={clip.url} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                muted 
                loop 
                playsInline
                onMouseEnter={e => e.currentTarget.play()}
                onMouseLeave={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-[#f97316] flex items-center justify-center">
                  <Play className="w-5 h-5 text-white ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
