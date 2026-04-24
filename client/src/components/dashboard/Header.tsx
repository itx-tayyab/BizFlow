import { Bell, Search, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      
      {/* Mobile Brand (Hidden on Desktop because Sidebar has it) */}
      <div className="md:hidden font-bold text-lg text-slate-900 tracking-tight">
        BizFlow
      </div>

      {/* Search Bar (Desktop only) */}
      <div className="hidden md:flex flex-1 max-w-md ml-4">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders, customers..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4 ml-auto">
        <button className="p-2 text-slate-400 hover:text-slate-500 relative">
          <Bell className="w-5 h-5" />
          {/* Notification Dot */}
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
        
        <button className="flex items-center gap-2">
          <UserCircle className="w-8 h-8 text-slate-300 md:hidden" />
        </button>
      </div>
    </header>
  );
}