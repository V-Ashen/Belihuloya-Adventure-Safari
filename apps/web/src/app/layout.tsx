import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
import TrackingPixels from "@/components/TrackingPixels";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import "./globals.css";
import { getSettings } from "@/actions/settings";
import { AuthProvider } from "@/components/AuthProvider";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-[#0b120c]">
        <AuthProvider>
          <Navbar />

          <main className="flex-1">
            {children}
          </main>

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
        </AuthProvider>
      </body>
    </html>
  );
}
