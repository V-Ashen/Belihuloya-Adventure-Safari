"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#0b120c] border-b border-[#18261a]">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none z-50">
          <span className="text-white font-extrabold text-2xl tracking-wider uppercase font-display">BELIHULOYA</span>
          <span className="text-[10px] tracking-[0.25em] text-[#647466] uppercase font-bold font-mono mt-1">ADVENTURE SAFARI · SRI LANKA</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex gap-10 text-sm font-semibold tracking-wide">
          <Link href="/" className="text-orange-500 hover:text-orange-400 font-mono transition-colors">Home</Link>
          <Link href="/tours" className="text-[#a3b3a5] hover:text-white font-mono transition-colors">Tours</Link>
          <Link href="/#about" className="text-[#a3b3a5] hover:text-white font-mono transition-colors">About</Link>
          <Link href="/#contact" className="text-[#a3b3a5] hover:text-white font-mono transition-colors">Contact</Link>
        </nav>

        {/* Desktop CTA Button */}
        <Link
          href="/tours"
          className="hidden md:inline-flex items-center bg-[#f97316] hover:bg-[#ea580c] text-black text-xs font-black tracking-[0.15em] uppercase px-7 py-3.5 rounded-none font-mono transition-colors"
        >
          BOOK YOUR ADVENTURE
        </Link>

        {/* Mobile menu toggle */}
        <button 
          className="md:hidden text-black p-2 z-50 bg-[#f97316] rounded-md shadow-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <Menu className="w-7 h-7" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0b120c] pt-24 px-6 flex flex-col md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-6 text-2xl font-black font-display tracking-widest uppercase">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-orange-500 hover:text-orange-400 transition-colors border-b border-[#18261a] pb-6">Home</Link>
            <Link href="/tours" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-orange-500 transition-colors border-b border-[#18261a] pb-6">Tours</Link>
            <Link href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-orange-500 transition-colors border-b border-[#18261a] pb-6">About</Link>
            <Link href="/#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-orange-500 transition-colors border-b border-[#18261a] pb-6">Contact</Link>
          </nav>
          
          <Link
            href="/tours"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-8 flex justify-center bg-[#f97316] hover:bg-[#ea580c] text-black text-sm font-black tracking-[0.15em] uppercase px-7 py-5 rounded-none font-mono transition-colors"
          >
            BOOK YOUR ADVENTURE
          </Link>
        </div>
      )}
    </header>
  );
}
