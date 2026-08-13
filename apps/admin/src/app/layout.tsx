import Link from "next/link";
import { LayoutDashboard, CalendarDays, Car, Package, Users, Settings, LogOut, Map, MessageSquare } from "lucide-react";
import { Manrope, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: "--font-manrope", 
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif-4",
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${sourceSerif4.variable} font-sans bg-slate-950 text-slate-100`}>
        <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="text-xl font-bold text-white tracking-tighter">
            Belihuloya<span className="text-orange-500">Admin</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-medium">
            <LayoutDashboard className="w-5 h-5 text-orange-500" /> Dashboard
          </Link>
          <Link href="/bookings" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-medium">
            <CalendarDays className="w-5 h-5 text-blue-500" /> Bookings
          </Link>
          <Link href="/messages" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-medium">
            <MessageSquare className="w-5 h-5 text-[#FF9138]" /> Messages & Inquiries
          </Link>
          <Link href="/tours" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-medium">
            <Package className="w-5 h-5 text-purple-500" /> Tour CMS
          </Link>
          <Link href="/fleet" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-medium">
            <Car className="w-5 h-5 text-emerald-500" /> Fleet Management
          </Link>
          <Link href="/customers" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-medium opacity-50 cursor-not-allowed">
            <Users className="w-5 h-5 text-pink-500" /> Customers
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-medium">
            <Settings className="w-5 h-5 text-gray-400" /> Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 w-full rounded-xl transition-colors font-medium">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 md:hidden bg-slate-900 border-b border-slate-800 flex items-center px-4">
          <div className="text-lg font-bold text-white tracking-tighter">
            Belihuloya<span className="text-orange-500">Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950">
          {children}
        </div>
      </main>
    </div>
    </body>
    </html>
  );
}
