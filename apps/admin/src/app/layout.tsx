import { Manrope, Source_Serif_4 } from "next/font/google";
import AdminAuthProvider from "@/components/AdminAuthProvider";
import AdminSidebar from "@/components/AdminSidebar";
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
        <AdminAuthProvider>
          <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
            {/* Sidebar Component with Role & Permission Guards */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
              {/* Page Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950">
                {children}
              </div>
            </main>
          </div>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
