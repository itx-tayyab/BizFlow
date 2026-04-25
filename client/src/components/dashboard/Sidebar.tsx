"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Store, 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Package, 
  Settings 
} from "lucide-react";

const navItems =[
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/orders", icon: ShoppingCart }, 
  { name: "Products", href: "/products", icon: Package },   
  { name: "Customers", href: "/customers", icon: Users },   
  { name: "Settings", href: "/settings", icon: Settings },  
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 min-h-screen fixed left-0 top-0 z-20">
      {/* Brand Logo */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-200">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <Store className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">
          BizFlow
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-blue-700" : "text-slate-400"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Summary (Bottom of Sidebar) */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-900">Ali Khan</span>
            <span className="text-xs text-slate-500">Owner</span>
          </div>
        </div>
      </div>
    </aside>
  );
}