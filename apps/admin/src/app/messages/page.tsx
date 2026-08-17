"use client";

import { useState, useEffect } from "react";
import { fetchInquiries, updateInquiryStatus, deleteInquiry } from "@/actions/messages";
import { Inquiry } from "@belihuloya/core";
import { format } from "date-fns";
import { 
  Mail, MessageSquare, Phone, Calendar, Users, MapPin, 
  Trash2, CheckCircle2, Clock, Search, RefreshCw, Loader2, Filter,
  ExternalLink
} from "lucide-react";
import Pagination from "@/components/Pagination";

const parseDate = (d: any) => {
  if (!d) return new Date();
  if (typeof d?.toDate === "function") return d.toDate();
  return new Date(d);
};

export default function MessagesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "read" | "replied">("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    const data = await fetchInquiries();
    setInquiries(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: "new" | "read" | "replied") => {
    // Optimistic update
    setInquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (selectedInquiry?.id === id) {
      setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    await updateInquiryStatus(id, newStatus);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    setInquiries((prev) => prev.filter((item) => item.id !== id));
    if (selectedInquiry?.id === id) setSelectedInquiry(null);
    await deleteInquiry(id);
  };

  // Filtering
  const filtered = inquiries.filter((item) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.phone.toLowerCase().includes(q) ||
      item.route.toLowerCase().includes(q) ||
      item.message.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const unreadCount = inquiries.filter((i) => i.status === "new").length;

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedInquiries = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold font-display tracking-tight text-white">Inquiries & Messages</h1>
            {unreadCount > 0 && (
              <span className="bg-orange-500 text-black font-extrabold text-xs px-2.5 py-1 rounded-full animate-pulse">
                {unreadCount} NEW
              </span>
            )}
          </div>
          <p className="text-slate-400 mt-1">Manage contact form inquiries and group trip requests from web visitors.</p>
        </div>
        <button
          onClick={loadData}
          disabled={isLoading}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by name, email, phone, route..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* Status Filters */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl gap-1">
          {(["all", "new", "read", "replied"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                statusFilter === st
                  ? "bg-orange-500 text-black shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout */}
      {isLoading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span>Loading messages...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500">
          <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-300 mb-1">No Inquiries Found</h3>
          <p className="text-xs text-slate-500">
            {search || statusFilter !== "all"
              ? "Try resetting your search filter."
              : "Messages submitted via the contact page will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Messages List (Left Col) */}
          <div className="lg:col-span-5 space-y-3">
            {paginatedInquiries.map((item) => {
              const isSelected = selectedInquiry?.id === item.id;
              const formattedDate = format(parseDate(item.createdAt), "MMM d, yyyy h:mm a");
              
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedInquiry(item);
                    if (item.status === "new" && item.id) {
                      handleStatusChange(item.id, "read");
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-800 border-orange-500/80 shadow-lg"
                      : item.status === "new"
                      ? "bg-slate-900 border-orange-500/30 hover:border-orange-500/60"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {item.status === "new" && (
                        <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                      )}
                      <h3 className="font-bold text-white text-sm line-clamp-1">{item.name || "Anonymous"}</h3>
                    </div>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">{format(parseDate(item.createdAt), "MMM d")}</span>
                  </div>

                  <div className="text-xs text-orange-400 font-medium mb-2 line-clamp-1">
                    {item.route}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {item.message || "No message content."}
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-800/80">
                    <span>{item.email || item.phone}</span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold uppercase ${
                        item.status === "new"
                          ? "bg-orange-500/20 text-orange-400"
                          : item.status === "replied"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })}
            
            <div className="mt-4 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
              />
            </div>
          </div>

          {/* Detailed View (Right Col) */}
          <div className="lg:col-span-7 sticky top-24">
            {selectedInquiry ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedInquiry.name}</h2>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Received {format(parseDate(selectedInquiry.createdAt), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => selectedInquiry.id && handleDelete(selectedInquiry.id)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Status:</span>
                  <div className="flex gap-2">
                    {(["new", "read", "replied"] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => selectedInquiry.id && handleStatusChange(selectedInquiry.id, st)}
                        className={`px-3 py-1 rounded-md font-bold uppercase text-[10px] transition-colors ${
                          selectedInquiry.status === st
                            ? st === "new"
                              ? "bg-orange-500 text-black"
                              : st === "replied"
                              ? "bg-emerald-500 text-black"
                              : "bg-slate-700 text-white"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact & Meta Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Phone className="w-3 h-3 text-orange-500" /> Phone / WhatsApp
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{selectedInquiry.phone || "N/A"}</span>
                      {selectedInquiry.phone && (
                        <a
                          href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                        >
                          WhatsApp <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Mail className="w-3 h-3 text-blue-500" /> Email Address
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white truncate max-w-[180px]">{selectedInquiry.email || "N/A"}</span>
                      {selectedInquiry.email && (
                        <a
                          href={`mailto:${selectedInquiry.email}`}
                          className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-bold"
                        >
                          Reply <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-500" /> Preferred Date
                    </span>
                    <span className="text-sm font-bold text-white">{selectedInquiry.date || "Flexible / Not specified"}</span>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Users className="w-3 h-3 text-purple-500" /> Group Size
                    </span>
                    <span className="text-sm font-bold text-white">{selectedInquiry.groupSize ? `${selectedInquiry.groupSize} Pax` : "Not specified"}</span>
                  </div>
                </div>

                {/* Route Selection */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Interested Route / Tour</span>
                  <span className="text-base font-bold text-orange-400">{selectedInquiry.route}</span>
                </div>

                {/* Message Content Box */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Message / Special Requests</span>
                  <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {selectedInquiry.message || "No message specified."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500">
                Select an inquiry from the left list to view full details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
