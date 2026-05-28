"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Calendar, MessageCircle, Package, LayoutList, KanbanSquare, Download } from "lucide-react";
import OrderMetrics from "@/components/orders/OrderMetrics";
import OrderTable from "@/components/orders/OrderTable";
import OrderPagination from "@/components/orders/OrderPagination";

// --- MOCK DATA ---
const mockOrders =[
  { id: "ORD-1045", customer: "Zain Ahmed", phone: "03001234567", items: 3, total: 45000, status: "PENDING", payment: "PARTIAL", dispatch: "TCS", date: "Today, 10:30 AM" },
  { id: "ORD-1044", customer: "Waqas Ali", phone: "03219876543", items: 1, total: 12000, status: "COMPLETED", payment: "UNPAID", dispatch: "Bykea", date: "Yesterday" },
  { id: "ORD-1043", customer: "Fatima Store", phone: "03334567890", items: 12, total: 125000, status: "COMPLETED", payment: "PAID", dispatch: "Self-Pickup", date: "2 days ago" },
  { id: "ORD-1042", customer: "Hassan Raza", phone: "03111122334", items: 2, total: 8500, status: "PENDING", payment: "UNPAID", dispatch: "Leopards", date: "3 days ago" },
  { id: "ORD-1041", customer: "Ayesha Khan", phone: "03455566778", items: 1, total: 5000, status: "COMPLETED", payment: "PAID", dispatch: "InDrive", date: "Last Week" },
];

export default function OrdersHubPage() {
  const [activeTab, setActiveTab] = useState("needs-attention");
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // 🟢 SMART FILTER LOGIC
  const filteredOrders = mockOrders.filter(order => {
    if (activeTab === "pending") return order.status === "PENDING";
    if (activeTab === "completed") return order.status === "COMPLETED";
    if (activeTab === "needs-attention") return order.status === "COMPLETED" && order.payment !== "PAID";
    return true; // "all-orders"
  });

  const toggleSelection = (id: string) => {
    setSelectedOrders(prev => prev.includes(id) ? prev.filter(orderId => orderId !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedOrders.length === filteredOrders.length) setSelectedOrders([]);
    else setSelectedOrders(filteredOrders.map(o => o.id));
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col space-y-4 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Orders Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage lifecycle, payments, and dispatch tracking.</p>
        </div>
        <Link href="/orders/new" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Create Order
        </Link>
      </div>

      {/* TABS & VIEW TOGGLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex overflow-x-auto hide-scrollbar gap-2">
          {["All Orders", "Pending", "Needs Attention", "Completed"].map((tab) => {
            const id = tab.toLowerCase().replace(" ", "-");
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${activeTab === id ? (id === "needs-attention" ? "bg-rose-100 text-rose-700" : "bg-slate-900 text-white") : "bg-transparent text-slate-600 hover:bg-slate-100"}`}
              >
                {tab} {id === "needs-attention" && <span className="ml-2 inline-flex items-center justify-center bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full">2</span>}
              </button>
            );
          })}
        </div>
        
        <div className="flex items-center bg-slate-100 p-1 rounded-lg shrink-0">
          <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-slate-500"}`}><LayoutList className="w-4 h-4" /></button>
          <button onClick={() => setViewMode("board")} className={`p-1.5 rounded-md ${viewMode === "board" ? "bg-white shadow-sm text-blue-600" : "text-slate-500"}`}><KanbanSquare className="w-4 h-4" /></button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="w-4 h-4 text-slate-400" /></div>
          <input type="text" placeholder="Search by Order ID, Customer, or Phone..." className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium bg-white hover:bg-slate-50"><Calendar className="w-4 h-4" /> Last 7 Days</button>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium bg-white hover:bg-slate-50"><Filter className="w-4 h-4" /> Filters</button>
      </div>

      {/* 🟢 NEW METRICS WIDGET */}
      <OrderMetrics orders={filteredOrders} activeTab={activeTab} />

      {/* 🟢 DATA TABLE & PAGINATION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
        <OrderTable 
          orders={filteredOrders} 
          selectedOrders={selectedOrders} 
          toggleSelection={toggleSelection} 
          toggleAll={toggleAll} 
        />
        <OrderPagination totalItems={filteredOrders.length} />
      </div>

      {/* FLOATING BULK ACTION BAR */}
      {selectedOrders.length > 0 && (
        <div className="fixed bottom-20 md:bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 z-40 animate-in slide-in-from-bottom-5">
          <span className="text-sm font-medium border-r border-slate-700 pr-4">{selectedOrders.length} orders selected</span>
          <button className="text-sm hover:text-blue-400 flex items-center gap-1.5"><MessageCircle className="w-4 h-4" /> Remind</button>
          <button className="text-sm hover:text-emerald-400 flex items-center gap-1.5"><Download className="w-4 h-4" /> Export</button>
        </div>
      )}
    </div>
  );
}