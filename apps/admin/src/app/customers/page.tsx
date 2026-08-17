"use client";

import { useState, useEffect } from "react";
import { getAllCustomers, CustomerProfile } from "@/actions/customers";
import { Loader2, Users, UserCheck, UserMinus, Search, Mail, Phone, Calendar, ArrowUpDown } from "lucide-react";
import Pagination from "@/components/Pagination";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters and Search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'registered' | 'unregistered'>('all');

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      const res = await getAllCustomers();
      if (res.success && res.customers) {
        setCustomers(res.customers);
      } else {
        console.error("Failed to fetch customers:", res.error);
      }
      setLoading(false);
    };

    fetchCustomers();
  }, []);

  // Calculate Metrics
  const totalCustomers = customers.length;
  const registeredCount = customers.filter(c => c.isRegistered).length;
  const unregisteredCount = totalCustomers - registeredCount;

  // Filter customers based on search and tab
  const filteredCustomers = customers.filter(c => {
    // Tab Filter
    if (activeTab === 'registered' && !c.isRegistered) return false;
    if (activeTab === 'unregistered' && c.isRegistered) return false;

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q))
      );
    }
    return true;
  });

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase font-display tracking-tight">Customers</h1>
          <p className="text-slate-400 text-sm">Manage and view all customer profiles and lifetime value.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Total Customers</p>
            <p className="text-3xl font-black text-white">{loading ? "-" : totalCustomers}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Registered</p>
            <p className="text-3xl font-black text-white">{loading ? "-" : registeredCount}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-emerald-500" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Unregistered (Guests)</p>
            <p className="text-3xl font-black text-white">{loading ? "-" : unregisteredCount}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-500/10 flex items-center justify-center">
            <UserMinus className="w-6 h-6 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Data Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        
        {/* Controls */}
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between gap-4">
          
          {/* Tabs */}
          <div className="flex items-center p-1 bg-slate-950 rounded-lg w-fit border border-slate-800">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveTab('registered')}
              className={`px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'registered' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Registered
            </button>
            <button 
              onClick={() => setActiveTab('unregistered')}
              className={`px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'unregistered' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Guests
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase font-bold tracking-wider border-b border-slate-800">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    Bookings <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    Total Spent <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 text-orange-500 animate-spin mx-auto mb-2" />
                    <span className="text-slate-500 text-sm">Loading customers...</span>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-slate-500" />
                    </div>
                    <span className="text-slate-400 font-bold block mb-1">No customers found</span>
                    <span className="text-slate-500 text-sm">Try adjusting your filters or search query.</span>
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((customer) => (
                  <tr key={customer.email} className="hover:bg-slate-800/30 transition-colors">
                    
                    {/* Name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold font-display uppercase">
                          {customer.name.charAt(0)}
                        </div>
                        <span className="font-bold text-white">{customer.name}</span>
                      </div>
                    </td>
                    
                    {/* Contact */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-slate-500" /> {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-slate-400">
                            <Phone className="w-3.5 h-3.5 text-slate-500" /> {customer.phone}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.isRegistered ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                          <UserCheck className="w-3 h-3" /> Registered
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-400 text-[10px] font-bold uppercase tracking-wider border border-slate-500/20">
                          <UserMinus className="w-3 h-3" /> Guest
                        </span>
                      )}
                    </td>

                    {/* Bookings */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-block px-3 py-1 bg-slate-950 border border-slate-800 rounded-md font-mono text-sm font-bold text-slate-300">
                        {customer.totalBookings}
                      </span>
                    </td>

                    {/* Total Spent */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="font-mono font-bold text-orange-400">
                        {customer.totalSpent.toLocaleString()} LKR
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-slate-400 text-sm">
                      <div className="flex items-center justify-end gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(customer.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>
      </div>
    </div>
  );
}
