"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Package, LogOut, ShieldCheck } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Hide sidebar on login page
  if (pathname === "/admin/login") {
    return null;
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Products", href: "/admin/products", icon: Package },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col shadow-xl flex-shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-amber-500/20 p-2 rounded-xl text-amber-500">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-bold text-lg tracking-tight">Kirubai Foods</h2>
          <p className="text-xs text-slate-400">Admin Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
          Menu
        </div>
        
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-amber-500/10 text-amber-500 font-medium" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-amber-500" : "text-slate-500"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer & Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5 opacity-70" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
