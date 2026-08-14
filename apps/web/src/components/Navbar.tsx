"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Tours", href: "/tours" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

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
          {navLinks.map((link) => {
            const isHashLink = link.href.includes('#');
            const isActive = link.href === "/" 
              ? pathname === "/" 
              : isHashLink 
                ? false 
                : pathname.startsWith(link.href);
            return (
              <Link key={link.name} href={link.href} className={`${isActive ? "text-orange-500 hover:text-orange-400" : "text-[#a3b3a5] hover:text-white"} font-mono transition-colors`}>
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          <Link href={user ? "/profile" : "/login"} className="text-[#a3b3a5] hover:text-orange-500 transition-colors flex items-center gap-2 group">
            <div className="bg-[#18261a] p-2 rounded-full group-hover:bg-orange-500/10 transition-colors">
              <User className="w-5 h-5 group-hover:text-orange-500" />
            </div>
            {user && <span className="text-xs font-mono font-bold tracking-wider hidden lg:block uppercase">{user.displayName?.split(' ')[0] || 'Profile'}</span>}
          </Link>
          
          <Link
            href="/tours"
            className="inline-flex items-center bg-[#f97316] hover:bg-[#ea580c] text-black text-xs font-black tracking-[0.15em] uppercase px-7 py-3.5 rounded-none font-mono transition-colors"
          >
            BOOK YOUR ADVENTURE
          </Link>
        </div>

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
            {navLinks.map((link) => {
              const isHashLink = link.href.includes('#');
              const isActive = link.href === "/" 
                ? pathname === "/" 
                : isHashLink 
                  ? false
                  : pathname.startsWith(link.href);
              return (
                <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className={`${isActive ? "text-orange-500 hover:text-orange-400" : "text-white hover:text-orange-500"} transition-colors border-b border-[#18261a] pb-6`}>
                  {link.name}
                </Link>
              );
            })}
          </nav>
          
          <Link
            href={user ? "/profile" : "/login"}
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-8 flex items-center justify-center gap-3 border border-slate-700 hover:border-orange-500 hover:text-orange-500 text-slate-300 text-sm font-black tracking-[0.15em] uppercase px-7 py-5 rounded-none font-mono transition-colors"
          >
            <User className="w-5 h-5" />
            {user ? "MY PROFILE" : "SIGN IN"}
          </Link>

          <Link
            href="/tours"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 flex justify-center bg-[#f97316] hover:bg-[#ea580c] text-black text-sm font-black tracking-[0.15em] uppercase px-7 py-5 rounded-none font-mono transition-colors"
          >
            BOOK YOUR ADVENTURE
          </Link>
        </div>
      )}
    </header>
  );
}
