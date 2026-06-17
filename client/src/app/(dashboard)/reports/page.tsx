"use client";

import { useState } from "react";
import { BarChart3, Calendar, Download } from "lucide-react";

// Import our new components
import ReportsNav from "@/components/reports/ReportsNav";
import FinancialOverviewTab from "@/components/reports/FinancialOverviewTab";
import InventoryInsightsTab from "@/components/reports/InventoryInsightsTab";
import StaffPerformanceTab from "@/components/reports/StaffPerformanceTab";
import CustomerInsightsTab from "@/components/reports/CustomerInsightsTab";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("last-7-days");

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-20 mt-2 max-w-6xl mx-auto">
      
      {/* 🟢 HEADER & EXPORT ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Reports & Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1">Track your revenue, profit margins, and business growth.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="last-7-days">Last 7 Days</option>
              <option value="this-month">This Month (June)</option>
              <option value="ytd">Year to Date</option>
            </select>
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </div>
          
          <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* 🟢 NAVIGATION TABS */}
      <ReportsNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 🟢 DYNAMIC CONTENT */}
      <div className="w-full">
        {activeTab === "overview" && <FinancialOverviewTab />}
        {activeTab === "inventory" && <InventoryInsightsTab />}
        {activeTab === "staff" && <StaffPerformanceTab />}
        {activeTab === "customers" && <CustomerInsightsTab />}
      </div>

    </div>
  );
}