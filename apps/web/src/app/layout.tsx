import type { Metadata } from "next";
import { Manrope, Source_Serif_4 } from "next/font/google";
import TrackingPixels from "@/components/TrackingPixels";
import Link from "next/link";
import "./globals.css";

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: "--font-manrope", 
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif-4",
});

export const metadata: Metadata = {
  title: "Belihuloya Adventure Safari | Extreme Off-Road & Camping",
  description: "Experience the thrill of 4x4 off-road jeep safaris, Devil's Staircase hikes, and eco-camping in the pristine mountains of Belihuloya, Sri Lanka.",
  openGraph: {
    title: "Belihuloya Adventure Safari",
    description: "Experience the thrill of extreme 4x4 trails, pristine river camping, and breathtaking hikes. Your adventure starts here.",
    url: "https://belihuloyasafari.com",
    siteName: "Belihuloya Adventure Safari",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Belihuloya Adventure Safari",
    description: "Book your extreme 4x4 off-road jeep safari today.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${manrope.variable} ${sourceSerif4.variable} font-sans min-h-screen flex flex-col`}>
        <header className="fixed top-0 w-full z-50 glass-panel border-b-0">
          <div className="container mx-auto px-4 h-20 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white tracking-tighter hover:opacity-90 transition-opacity">
              Belihuloya<span className="text-orange-500">Safari</span>
            </Link>
            <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
              <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
              <Link href="/tours" className="hover:text-orange-400 transition-colors">Tours</Link>
              <Link href="/#about" className="hover:text-orange-400 transition-colors">About</Link>
            </nav>
            <Link href="/tours" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)]">
              Book Now
            </Link>
          </div>
        </header>
        
        <main className="flex-1">
          {children}
        </main>

        <footer className="bg-slate-950 py-12 border-t border-slate-800">
          <div className="container mx-auto px-4 text-center text-slate-400">
            <p>© {new Date().getFullYear()} Belihuloya Adventure Safari. All rights reserved.</p>
          </div>
        </footer>
        <TrackingPixels />
      </body>
    </html>
  );
}
