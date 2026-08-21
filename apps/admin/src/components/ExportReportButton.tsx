"use client";

import { Download } from "lucide-react";

interface ExportReportButtonProps {
  bookings: any[];
}

export default function ExportReportButton({ bookings }: ExportReportButtonProps) {
  const handleExport = () => {
    if (!bookings || bookings.length === 0) {
      alert("No bookings available to export.");
      return;
    }

    // Define CSV headers
    const headers = [
      "ID",
      "Customer Name",
      "Customer Phone",
      "Customer Email",
      "Tour Name",
      "Date",
      "Pax",
      "Total Price (LKR)",
      "Status",
      "Created At"
    ];

    // Format row data
    const rows = bookings.map(b => [
      b.id || "",
      `"${(b.customerName || "").replace(/"/g, '""')}"`,
      `"${(b.customerPhone || "").replace(/"/g, '""')}"`,
      `"${(b.customerEmail || "").replace(/"/g, '""')}"`,
      `"${(b.tourName || "").replace(/"/g, '""')}"`,
      new Date(b.date).toLocaleDateString(),
      b.pax || 0,
      b.totalPrice || 0,
      b.status || "",
      b.createdAt ? new Date(b.createdAt).toLocaleString() : ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Create and download the blob
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={handleExport}
      className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      Export Report
    </button>
  );
}
