import Link from "next/link";
import { Plus } from "lucide-react";
import StatsCards from "@/components/dashboard/widgets/StatsCards";
import RevenueChart from "@/components/dashboard/widgets/RevenueChart";
import PaymentHealth from "@/components/dashboard/widgets/PaymentHealth";
import RecentOrdersTable from "@/components/dashboard/widgets/RecentOrdersTable";

export default function DashboardHomePage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* 🟢 PAGE HEADER & QUICK ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500">Here's what's happening with your business today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/orders/new" 
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
          >
            <Plus className="w-4 h-4" />
            New Order
          </Link>
        </div>
      </div>

      {/* 🟢 ROW 1: TOP METRICS (StatsCards) */}
      <StatsCards />

      {/* 🟢 ROW 2: DATA VISUALIZATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Side: Main Revenue Chart (Spans 2 columns) */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        {/* Right Side: Payment Health Donut Chart (Spans 1 column) */}
        <div className="lg:col-span-1">
          <PaymentHealth />
        </div>
      </div>

      {/* 🟢 ROW 3: RECENT ORDERS */}
      <RecentOrdersTable />

    </div>
  );
}