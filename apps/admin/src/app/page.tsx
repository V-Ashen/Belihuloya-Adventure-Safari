import { getBookings } from "@/actions/admin";
import { DollarSign, Users, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const result = await getBookings();
  const bookings = result.success ? result.bookings : [];
  
  // Calculate some basic stats
  const pendingBookings = bookings?.filter((b: any) => b.status === "pending").length || 0;
  const totalRevenue = bookings?.reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0) || 0;
  const totalPassengers = bookings?.reduce((sum: number, b: any) => sum + (b.pax || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard Overview</h1>
          <p className="text-slate-400">Welcome back, Admin. Here is what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-500" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-green-500/20 text-green-400 rounded-lg">+12%</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{bookings?.length || 0}</h3>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Bookings</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-red-500/20 text-red-400 rounded-lg">Action Needed</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{pendingBookings}</h3>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Pending Approvals</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-green-500/20 text-green-400 rounded-lg">+24%</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{totalRevenue.toLocaleString()} <span className="text-lg text-slate-500">LKR</span></h3>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Value (Est)</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{totalPassengers}</h3>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Passengers</p>
        </div>
      </div>

      {/* Recent Bookings Preview */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-orange-500 hover:text-orange-400 text-sm font-medium">View All →</Link>
        </div>
        
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          {bookings && bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold">Tour</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Pax</th>
                    <th className="p-4 font-semibold">Total</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-sm">
                  {bookings.slice(0, 5).map((b: any) => (
                    <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 text-white font-medium">
                        {b.customerName}
                        <div className="text-xs text-slate-500">{b.customerPhone}</div>
                      </td>
                      <td className="p-4 text-slate-300">{b.tourName}</td>
                      <td className="p-4 text-slate-300">{new Date(b.date).toLocaleDateString()}</td>
                      <td className="p-4 text-slate-300">{b.pax}</td>
                      <td className="p-4 text-slate-300 font-medium">{b.totalPrice.toLocaleString()} LKR</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${b.status === 'pending' ? 'bg-blue-500/20 text-blue-400' :
                            b.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                            b.status === 'completed' ? 'bg-slate-500/20 text-slate-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              No bookings found yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ClockIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
