"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Plus, Search, Filter, Calendar, MessageCircle, 
  Truck, Package, CheckSquare, Square, LayoutList, 
  KanbanSquare, CheckCircle2, Clock, AlertCircle, 
  ChevronDown, Download 
} from "lucide-react";

// --- MOCK DATA ---
const mockOrders =[
  { id: "ORD-1045", customer: "Zain Ahmed", phone: "03001234567", items: 3, total: 45000, status: "PENDING", payment: "PARTIAL", dispatch: "TCS", date: "Today, 10:30 AM" },
  { id: "ORD-1044", customer: "Waqas Ali", phone: "03219876543", items: 1, total: 12000, status: "COMPLETED", payment: "UNPAID", dispatch: "Bykea", date: "Yesterday" },
  { id: "ORD-1043", customer: "Fatima Store", phone: "03334567890", items: 12, total: 125000, status: "COMPLETED", payment: "PAID", dispatch: "Self-Pickup", date: "2 days ago" },
  { id: "ORD-1042", customer: "Hassan Raza", phone: "03111122334", items: 2, total: 8500, status: "PENDING", payment: "UNPAID", dispatch: "Leopards", date: "3 days ago" },
  { id: "ORD-1041", customer: "Ayesha Khan", phone: "03455566778", items: 1, total: 5000, status: "COMPLETED", payment: "PAID", dispatch: "InDrive", date: "Last Week" },
];

export default function OrdersHubPage() {
  const router = useRouter(); // Next.js router for clean navigation
  const [activeTab, setActiveTab] = useState("needs-attention");
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // Toggle Checkboxes for Bulk Actions
  const toggleSelection = (id: string) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(orderId => orderId !== id) :[...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedOrders.length === mockOrders.length) setSelectedOrders([]);
    else setSelectedOrders(mockOrders.map(o => o.id));
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col space-y-4 animate-in fade-in duration-500 pb-20">
      
      {/* 🟢 1. HEADER & QUICK ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Orders Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage lifecycle, payments, and dispatch tracking.</p>
        </div>
        <Link 
          href="/orders/new" 
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
        >
          <Plus className="w-4 h-4" />
          Create Order
        </Link>
      </div>

      {/* 🟢 2. TABS & VIEW TOGGLE (List vs Board) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex overflow-x-auto hide-scrollbar gap-2">
          {["All Orders", "Pending", "Needs Attention", "Completed"].map((tab) => {
            const id = tab.toLowerCase().replace(" ", "-");
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                  isActive 
                    ? id === "needs-attention" 
                      ? "bg-rose-100 text-rose-700" 
                      : "bg-slate-900 text-white"
                    : "bg-transparent text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab}
                {id === "needs-attention" && (
                  <span className="ml-2 inline-flex items-center justify-center bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full">1</span>
                )}
              </button>
            );
          })}
        </div>
        
        {/* List / Kanban Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg shrink-0">
          <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-slate-500"}`}>
            <LayoutList className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode("board")} className={`p-1.5 rounded-md transition-colors ${viewMode === "board" ? "bg-white shadow-sm text-blue-600" : "text-slate-500"}`}>
            <KanbanSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 🟢 3. SEARCH & FILTERS */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Order ID, Customer, or Phone..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
            <Calendar className="w-4 h-4" /> Last 7 Days
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
            <Filter className="w-4 h-4" /> More Filters
          </button>
        </div>
      </div>

      {/* 🟢 4. THE DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-10">
                  <button onClick={toggleAll} className="text-slate-400 hover:text-blue-600">
                    {selectedOrders.length === mockOrders.length ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5" />}
                  </button>
                </th>
                <th className="px-4 py-3 font-semibold">Order ID</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Status (Editable)</th>
                <th className="px-4 py-3 font-semibold">Payment</th>
                <th className="px-4 py-3 font-semibold">Dispatch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className={`hover:bg-slate-50 cursor-pointer transition-colors ${selectedOrders.includes(order.id) ? "bg-blue-50/50" : ""}`}
                  // DIRECT ROUTING TO ORDER DETAILS LEDGER
                  onClick={() => router.push(`/orders/${order.id}`)} 
                >
                  {/* Stop Propagation here so checking the box doesn't open the page */}
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleSelection(order.id)} className="text-slate-400 hover:text-blue-600">
                      {selectedOrders.includes(order.id) ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5" />}
                    </button>
                  </td>
                  
                  <td className="px-4 py-4 font-semibold text-blue-600 hover:underline">
                    {order.id}
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{order.customer}</span>
                      <span className="text-xs text-slate-500">{order.date}</span>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 font-medium">Rs. {order.total.toLocaleString()}</td>
                  
                  {/* Inline Status Dropdown - Stop Propagation so dropdown doesn't open the page */}
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="relative inline-block">
                      <select className={`appearance-none border border-slate-200 text-slate-700 py-1 pl-3 pr-8 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${order.status === 'COMPLETED' ? 'bg-slate-100' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        <option value="PENDING">Pending</option>
                        <option value="COMPLETED" selected={order.status === 'COMPLETED'}>Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                      <ChevronDown className="w-3 h-3 absolute right-2.5 top-2 text-slate-400 pointer-events-none" />
                    </div>
                  </td>

                  <td className="px-4 py-4">
                     {order.payment === "PAID" && <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700"><CheckCircle2 className="w-3 h-3"/> PAID</span>}
                     {order.payment === "PARTIAL" && <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-md text-[11px] font-bold bg-yellow-50 text-yellow-700"><Clock className="w-3 h-3"/> PARTIAL</span>}
                     {order.payment === "UNPAID" && <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200"><AlertCircle className="w-3 h-3"/> UNPAID</span>}
                  </td>
                  
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-100 py-1 px-2 rounded-md border border-slate-200">
                      <Truck className="w-3 h-3" /> {order.dispatch}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🟢 5. FLOATING BULK ACTION BAR */}
      {selectedOrders.length > 0 && (
        <div className="fixed bottom-20 md:bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 z-40 animate-in slide-in-from-bottom-5">
          <span className="text-sm font-medium border-r border-slate-700 pr-4">
            {selectedOrders.length} orders selected
          </span>
          <button className="text-sm font-medium hover:text-blue-400 flex items-center gap-1.5 transition-colors">
            <MessageCircle className="w-4 h-4" /> Remind
          </button>
          <button className="text-sm font-medium hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      )}
    </div>
  );
}