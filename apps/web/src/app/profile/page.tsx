"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { getUserBookings } from "@/actions/booking";
import { Loader2, Calendar, User, Mail, Phone, LogOut, MapPin, CreditCard } from "lucide-react";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchBookings = async (email: string) => {
      try {
        setFetching(true);
        const res = await getUserBookings(email);
        if (res.success && res.bookings) {
          setBookings(res.bookings);
        } else {
          console.error("Failed to fetch bookings:", res.error);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setFetching(false);
      }
    };

    if (user?.email) {
      fetchBookings(user.email);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (loading || (fetching && bookings.length === 0)) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-5xl">
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Sidebar - User Info */}
          <div className="w-full md:w-1/3 space-y-6">
            <div className="glass-panel p-8 rounded-3xl border border-slate-800">
              <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <User className="w-10 h-10 text-orange-500" />
              </div>
              <h2 className="text-xl font-bold text-white text-center mb-6">{user.displayName || "Customer"}</h2>
              
              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span>{user.email}</span>
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>{user.phoneNumber}</span>
                  </div>
                )}
              </div>

              <button 
                onClick={handleLogout}
                className="w-full mt-8 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-bold uppercase tracking-wider"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content - Bookings */}
          <div className="w-full md:w-2/3">
            <h1 className="text-2xl font-black text-white uppercase font-display tracking-wider mb-8">My Reservations</h1>

            {fetching && bookings.length === 0 ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div key={b.id} className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-orange-500/30 transition-colors">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{b.tourName}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          <span>{new Date(b.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                        ${b.status === 'pending' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          b.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          b.status === 'completed' ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30' :
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                        {b.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-slate-800/50 text-sm">
                      <div>
                        <span className="block text-slate-500 text-xs mb-1">Passengers</span>
                        <span className="text-slate-200 font-medium">{b.pax} Pax</span>
                      </div>
                      <div>
                        <span className="block text-slate-500 text-xs mb-1">Tour Type</span>
                        <span className="text-slate-200 font-medium capitalize">{b.tourType}</span>
                      </div>
                      <div>
                        <span className="block text-slate-500 text-xs mb-1">Total Price</span>
                        <span className="text-slate-200 font-medium">{b.totalPrice?.toLocaleString()} LKR</span>
                      </div>
                      <div>
                        <span className="block text-slate-500 text-xs mb-1">Payment</span>
                        {b.paymentOption === "advance_30" ? (
                          <span className="text-green-400 font-medium">30% Paid</span>
                        ) : b.paymentOption === "full" ? (
                          <span className="text-green-400 font-medium">Fully Paid</span>
                        ) : (
                          <span className="text-orange-400 font-medium flex items-center gap-1">
                            <CreditCard className="w-3 h-3" />
                            Pay on arrival
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Reservations Yet</h3>
                <p className="text-slate-400 text-sm max-w-sm">You haven't booked any adventures with us yet. Explore our tours and start your journey!</p>
                <button 
                  onClick={() => router.push("/tours")}
                  className="mt-6 bg-orange-600 hover:bg-orange-500 text-white font-bold uppercase tracking-widest py-3 px-8 rounded-xl transition-all"
                >
                  Explore Tours
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
