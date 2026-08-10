import Link from "next/link";
import { LayoutDashboard, CalendarDays, Car, Package, Users, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="text-xl font-bold text-white tracking-tighter">
            Belihuloya<span className="text-orange-500">Admin</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-medium">
            <LayoutDashboard className="w-5 h-5 text-orange-500" /> Dashboard
          </Link>
          <Link href="/admin/bookings" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-medium">
            <CalendarDays className="w-5 h-5 text-blue-500" /> Bookings
          </Link>
          <Link href="/admin/fleet" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-medium opacity-50 cursor-not-allowed">
            <Car className="w-5 h-5 text-green-500" /> Fleet Manager
          </Link>
          <Link href="/admin/tours" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-medium opacity-50 cursor-not-allowed">
            <Package className="w-5 h-5 text-purple-500" /> Tour CMS
          </Link>
          <Link href="/admin/customers" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-medium opacity-50 cursor-not-allowed">
            <Users className="w-5 h-5 text-pink-500" /> Customers
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
  );
}
