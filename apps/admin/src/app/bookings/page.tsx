"use client";

import { useEffect, useState } from "react";
import { getBookings, updateBookingStatus } from "@/actions/admin";
import { Loader2, Search, Filter, Calendar } from "lucide-react";
import Pagination from "@/components/Pagination";

export default function BookingsManager() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = bookings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const result = await getBookings();
    if (result.success) {
      setBookings(result.bookings || []);
    } else {
      setError(result.error || "Failed to load bookings");
    }
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(id);
    const result = await updateBookingStatus(id, newStatus);
    if (result.success) {
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } else {
      alert(result.error || "Failed to update status");
    }
    setUpdating(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-orange-500 animate-spin" /></div>;
  }

  if (error) {
    return <div className="p-4 bg-red-500/20 text-red-400 rounded-lg">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Bookings Manager</h1>
          <p className="text-slate-400">Review and manage all incoming tour reservations.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              className="w-full bg-slate-900 border border-slate-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>
          <button className="bg-slate-900 border border-slate-800 text-slate-300 px-3 py-2 rounded-lg flex items-center justify-center">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        {bookings.length > 0 ? (
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Customer Details</th>
                <th className="p-4 font-semibold">Tour & Date</th>
                <th className="p-4 font-semibold">Pax</th>
                <th className="p-4 font-semibold">Total Price</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {paginatedBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="p-4">
                    <div className="text-white font-semibold">{b.customerName}</div>
                    <div className="text-xs text-slate-400">{b.customerEmail}</div>
                    <div className="text-xs text-slate-400">{b.customerPhone}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-200 font-medium">{b.tourName}</div>
                    <div className="text-xs text-orange-400 font-semibold mb-1">{new Date(b.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</div>
                    <div className="flex gap-2">
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 uppercase tracking-wider">{b.tourType}</span>
                      {b.tourType === 'group' && (
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 uppercase tracking-wider">
                          {b.includesMeals ? 'With Meals' : 'No Meals'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">{b.pax}</td>
                  <td className="p-4 text-slate-200 font-bold">{b.totalPrice.toLocaleString()} LKR</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                      ${b.status === 'pending' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        b.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        b.status === 'completed' ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                      {b.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <select 
                      disabled={updating === b.id}
                      value={b.status}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-orange-500 disabled:opacity-50"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirm (Assign Jeep)</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancel</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </>
        ) : (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Bookings Yet</h3>
            <p className="text-slate-400 text-sm max-w-sm">When customers book tours on your website, they will appear here for you to manage.</p>
          </div>
        )}
      </div>
    </div>
  );
}
