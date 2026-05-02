"use client";

import { 
  Plus, Search, Users, Phone, ArrowRight, Filter 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- MOCK DATA ---
const mockCustomers =[
  { id: "CUST-882", name: "Zain Ahmed", phone: "0300 1234567", totalOrders: 12, lifetimeValue: 450000, balance: 15000 },
  { id: "CUST-883", name: "Waqas Ali", phone: "0321 9876543", totalOrders: 5, lifetimeValue: 85000, balance: 12000 },
  { id: "CUST-884", name: "Fatima Store", phone: "0333 4567890", totalOrders: 24, lifetimeValue: 1250000, balance: 45000 },
  { id: "CUST-885", name: "Hassan Raza", phone: "0311 1122334", totalOrders: 1, lifetimeValue: 15000, balance: 0 },
  { id: "CUST-886", name: "Ayesha Khan", phone: "0345 5566778", totalOrders: 8, lifetimeValue: 110000, balance: 0 },
];

export default function CustomersPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* 🟢 PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Customers
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage your clients, view their order history, and track balances.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* 🟢 SEARCH & FILTERS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search customers by name or phone..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors w-full sm:w-auto">
          <Filter className="w-4 h-4" />
          Unpaid Only
        </button>
      </div>

      {/* 🟢 CUSTOMERS LIST (Desktop Table / Mobile Cards) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* =======================
            DESKTOP VIEW (TABLE)
        ======================= */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Customer Details</th>
                <th className="px-6 py-4 font-semibold">Orders</th>
                <th className="px-6 py-4 font-semibold">Lifetime Spend</th>
                <th className="px-6 py-4 font-semibold">Outstanding Balance</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {mockCustomers.map((customer) => (
                <tr 
                  key={customer.id} 
                  className="hover:bg-slate-50 transition-colors group cursor-pointer"
                  onClick={() => router.push(`/customers/${customer.id}`)} // Route to Customer Profile
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{customer.name}</span>
                      <span className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{customer.totalOrders}</td>
                  <td className="px-6 py-4 font-medium text-slate-600">Rs. {customer.lifetimeValue.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {customer.balance > 0 ? (
                      <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Owes Rs. {customer.balance.toLocaleString()}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        Settled
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 group-hover:text-blue-600 rounded-lg group-hover:bg-blue-50 transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* =======================
            MOBILE VIEW (CARDS)
        ======================= */}
        <div className="md:hidden divide-y divide-slate-100">
          {mockCustomers.map((customer) => (
            <div 
              key={customer.id} 
              className="p-4 flex flex-col gap-3 active:bg-slate-50 transition-colors"
              onClick={() => router.push(`/customers/${customer.id}`)} // Route to Customer Profile
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 text-base">{customer.name}</span>
                  <a 
                    href={`tel:${customer.phone}`} 
                    className="text-blue-600 text-sm font-medium flex items-center gap-1 mt-0.5"
                    onClick={(e) => e.stopPropagation()} // Prevent row click when clicking phone number
                  >
                    <Phone className="w-3 h-3" />
                    {customer.phone}
                  </a>
                </div>
                {customer.balance > 0 && (
                  <span className="inline-flex items-center gap-1 py-1 px-2 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    OWES RS. {customer.balance.toLocaleString()}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs">Total Orders</span>
                  <span className="font-semibold text-slate-700">{customer.totalOrders}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-slate-500 text-xs">Lifetime Spend</span>
                  <span className="font-semibold text-slate-700">Rs. {customer.lifetimeValue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}