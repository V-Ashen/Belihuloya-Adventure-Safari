import type { Metadata } from "next";
import { Oswald, Inter, JetBrains_Mono } from "next/font/google";
import TrackingPixels from "@/components/TrackingPixels";
import Link from "next/link";
import "./globals.css";
import { getSettings } from "@/actions/settings";

const oswald = Oswald({ 
  subsets: ["latin"],
  variable: "--font-oswald", 
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", 
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  
  const fbLink = settings.socialLinks?.facebook || "https://www.facebook.com/share/1QKUp8zJvH/";
  const instaLink = settings.socialLinks?.instagram || "https://www.instagram.com/belihuloya_adventure_safari?igsh=MWx5azl3aThzanNteg==";
  const tiktokLink = settings.socialLinks?.tiktok || "https://www.tiktok.com/@b.a.s_2940?_r=1&_t=ZS-98gJ8mPjJCh";
  const ytLink = settings.socialLinks?.youtube || "http://www.youtube.com/@Belihuloyaadventuresafari";
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${oswald.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans min-h-screen flex flex-col bg-[#0b120c]`}>
        {/* Navbar */}
        <header className="fixed top-0 w-full z-50 bg-[#0b120c]/95 backdrop-blur-md border-b border-[#18261a]">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex flex-col leading-none">
              <span className="text-white font-extrabold text-2xl tracking-wider uppercase font-display">BELIHULOYA</span>
              <span className="text-[10px] tracking-[0.25em] text-[#647466] uppercase font-bold font-mono mt-1">ADVENTURE SAFARI · SRI LANKA</span>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex gap-10 text-sm font-semibold tracking-wide">
              <Link href="/" className="text-orange-500 border-b-2 border-orange-500 pb-1 font-mono transition-colors">Home</Link>
              <Link href="/tours" className="text-[#a3b3a5] hover:text-white font-mono transition-colors">Tours</Link>
              <Link href="/#about" className="text-[#a3b3a5] hover:text-white font-mono transition-colors">About</Link>
              <Link href="/#contact" className="text-[#a3b3a5] hover:text-white font-mono transition-colors">Contact</Link>
            </nav>

            {/* CTA Button */}
            <Link
              href="/tours"
              className="hidden md:inline-flex items-center bg-[#f97316] hover:bg-[#ea580c] text-black text-xs font-black tracking-[0.15em] uppercase px-7 py-3.5 rounded-none font-mono transition-colors"
            >
              BOOK YOUR ADVENTURE
            </Link>

            {/* Mobile menu icon */}
            <button className="md:hidden text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        {/* CTA Banner */}
        <section className="bg-[#f97316] py-20 text-center px-4">
          <h2 className="text-4xl md:text-6xl font-black text-[#0b120c] uppercase tracking-tight leading-none mb-4 font-display">
            EVERY JEEP HAS A LIMIT.<br />
            YOURS MIGHT ALREADY BE BOOKED.
          </h2>
          <p className="text-[#3d1a00]/80 text-base mb-10 max-w-md mx-auto font-sans">
            Only 5 jeeps run per day across all routes. Lock your date before someone else does.
          </p>
          <a
            href="https://wa.me/94XXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#0b120c] hover:bg-[#050905] text-white text-xs font-bold tracking-[0.2em] uppercase px-10 py-4 rounded-none transition-colors font-mono"
          >
            MESSAGE US ON WHATSAPP
          </a>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-[#070c08] pt-16 pb-0 border-t border-[#18261a]">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-16">
              {/* Col 1 — Brand */}
              <div>
                <div className="flex flex-col leading-none mb-5">
                  <span className="text-white font-black text-xl tracking-wider uppercase font-display">BELIHULOYA</span>
                  <span className="text-[10px] tracking-[0.25em] text-[#647466] uppercase font-mono mt-1">ADVENTURE SAFARI · SRI LANKA</span>
                </div>
                <p className="text-[#809483] text-sm leading-relaxed max-w-xs font-sans">
                  Extreme and scenic 4×4 off-road safaris through the Sabaragamuwa hill country. Bookings confirmed instantly, payment on arrival.
                </p>
              </div>

              {/* Col 2 — Explore */}
              <div>
                <h4 className="text-[10px] tracking-[0.3em] text-[#647466] uppercase font-bold mb-6 font-mono">EXPLORE</h4>
                <ul className="space-y-3 text-sm text-[#a3b3a5] font-mono">
                  <li><Link href="/tours" className="hover:text-orange-500 transition-colors">Off-Road Safaris</Link></li>
                  <li><Link href="/tours" className="hover:text-orange-500 transition-colors">Camping & Hiking</Link></li>
                  <li><Link href="/tours" className="hover:text-orange-500 transition-colors">Group Tours</Link></li>
                  <li><Link href="/tours" className="hover:text-orange-500 transition-colors">Private Tours</Link></li>
                </ul>
              </div>

              {/* Col 3 — Contact & Socials */}
              <div>
                <h4 className="text-[10px] tracking-[0.3em] text-[#647466] uppercase font-bold mb-6 font-mono">CONTACT & SOCIALS</h4>
                <ul className="space-y-3 text-sm text-[#a3b3a5] font-mono">
                  <li><a href="https://wa.me/94XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">WhatsApp Booking</a></li>
                  <li><a href={fbLink} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">Facebook</a></li>
                  <li><a href={instaLink} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">Instagram</a></li>
                  <li><a href={tiktokLink} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">TikTok</a></li>
                  <li><a href={ytLink} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">YouTube</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-[#18261a] py-6 flex flex-col md:flex-row justify-between items-center gap-2">
              <p className="text-[#647466] text-xs tracking-wider uppercase font-mono">© {new Date().getFullYear()} BELIHULOYA ADVENTURE SAFARI</p>
              <p className="text-[#647466] text-xs tracking-wider uppercase font-mono">SABARAGAMUWA PROVINCE · SRI LANKA</p>
            </div>
          </div>
        </footer>

        <TrackingPixels />
      </body>
    </html>
  );
}
