"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { clientAuth } from "@/lib/firebaseClient";
import { signOut } from "firebase/auth";
import { 
  LayoutDashboard, CalendarDays, Car, Package, Users, Settings, 
  LogOut, MessageSquare, ShieldCheck, UserPlus, Shield, Crown, Menu, X
} from "lucide-react";

export default function AdminSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, roleName, roleCode, hasPermission } = useAdminAuthStore();

  // If on login page, don't show sidebar
  if (pathname === "/login") {
    return null;
  }

  const handleSignOut = async () => {
    await signOut(clientAuth);
  };

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, perm: "view dashboard", color: "text-orange-500" },
    { name: "Bookings", href: "/bookings", icon: CalendarDays, perm: "view bookings", color: "text-blue-500" },
    { name: "Messages & Inquiries", href: "/messages", icon: MessageSquare, perm: "view messages", color: "text-[#FF9138]" },
    { name: "Tour CMS", href: "/tours", icon: Package, perm: "view tour CMS", color: "text-purple-500" },
    { name: "Fleet Management", href: "/fleet", icon: Car, perm: "fleet management", color: "text-emerald-500" },
    { name: "Manage Staff", href: "/manage-staff", icon: UserPlus, perm: "manage staff", color: "text-amber-500" },
    { name: "Roles & Permissions", href: "/roles", icon: ShieldCheck, perm: "manage roles", color: "text-cyan-500" },
    { name: "Customers", href: "/customers", icon: Users, perm: "view customers", color: "text-pink-500" },
    { name: "Settings", href: "/settings", icon: Settings, perm: "view settings", color: "text-gray-400" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Desktop & Mobile) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 shrink-0`}>
        <div className="h-16 md:h-20 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
          <div className="text-xl font-bold text-white tracking-tighter flex items-center gap-1">
            Belihuloya<span className="text-orange-500">Admin</span>
          </div>
          <button 
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info Badge */}
        {user && (
          <div className="p-4 border-b border-slate-800 bg-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-white font-display uppercase shrink-0">
                {user.displayName ? user.displayName[0] : "A"}
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-white truncate flex items-center gap-1">
                  {user.displayName || "Admin User"}
                  {roleCode === 0 && <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 mt-0.5">
                  <Shield className="w-3 h-3 text-orange-500" />
                  <span className="truncate">{roleName || (roleCode === 0 ? "Master Admin" : "Staff")}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isAllowed = roleCode === 0 || roleName === "Master Admin" || hasPermission(item.perm);
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            if (!isAllowed) return null;

            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  isActive
                    ? "bg-slate-800 text-white font-bold shadow-md border border-slate-700/50"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 w-full rounded-xl transition-colors font-medium text-sm"
          >
            <LogOut className="w-4 h-4 text-red-500" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="h-16 md:hidden bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-slate-400 hover:text-white rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-lg font-bold text-white tracking-tighter">
            Belihuloya<span className="text-orange-500">Admin</span>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="p-2 -mr-2 text-slate-400 hover:text-red-400 rounded-lg"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>
    </>
  );
}
