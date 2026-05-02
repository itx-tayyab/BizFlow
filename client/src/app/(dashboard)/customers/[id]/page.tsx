"use client";

import Link from "next/link";
import { 
  ArrowLeft, User, Phone, MapPin, Mail, 
  Plus, MessageCircle, ShoppingBag, Wallet, 
  Calendar, CheckCircle2, AlertCircle, Clock
} from "lucide-react";

// --- MOCK CUSTOMER DATA ---
const mockCustomer = {
  id: "CUST-882",
  name: "Zain Ahmed",
  phone: "0300 1234567",
  address: "House 42, Street 5, DHA Phase 6, Lahore",
  email: "zain.ahmed@example.com",
  type: "Loyal Customer",
  joined: "March 2025",
  metrics: {
    totalOrders: 12,
    lifetimeValue: 450000,
    outstandingBalance: 15000
  },
  // Order History for this specific customer
  orderHistory:[
    { id: "ORD-1045", date: "Oct 24, 2026", total: 45000, status: "COMPLETED", payment: "PARTIAL", balance: 15000 },
    { id: "ORD-1020", date: "Sep 15, 2026", total: 12000, status: "COMPLETED", payment: "PAID", balance: 0 },
    { id: "ORD-0988", date: "Aug 02, 2026", total: 85000, status: "COMPLETED", payment: "PAID", balance: 0 },
  ]
};

export default function CustomerProfilePage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      
      {/* 🟢 TOP ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/customers" className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-lg border border-slate-200 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">{mockCustomer.name}</h1>
              {mockCustomer.metrics.outstandingBalance > 0 ? (
                <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-md border border-rose-200">
                  Owes Rs. {mockCustomer.metrics.outstandingBalance.toLocaleString()}
                </span>
              ) : (
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-200">
                  Account Settled
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-0.5">Customer since {mockCustomer.joined}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <a 
            href={`https://wa.me/92${mockCustomer.phone.replace(/[^0-9]/g, '').substring(1)}`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-[#25D366]/10 text-[#25D366] rounded-xl text-sm font-bold hover:bg-[#25D366]/20 transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
          <Link 
            href={`/orders/new?customerId=${mockCustomer.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Order
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* ==========================================
            LEFT COLUMN: CUSTOMER INFO & METRICS
        ========================================== */}
        <div className="w-full lg:w-[350px] flex flex-col gap-6">
          
          {/* Contact Info Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Details</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 text-slate-700">
                <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-medium">{mockCustomer.phone}</p>
                  <p className="text-xs text-slate-500">Mobile</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-slate-700">
                <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-medium">{mockCustomer.email}</p>
                  <p className="text-xs text-slate-500">Email</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-slate-700">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-medium leading-relaxed">{mockCustomer.address}</p>
                  <p className="text-xs text-slate-500">Shipping Address</p>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-5 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">
              Edit Details
            </button>
          </div>

          {/* Lifetime Metrics Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Financial Overview</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><ShoppingBag className="w-4 h-4" /></div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Total Orders</p>
                  <p className="text-lg font-bold text-slate-900">{mockCustomer.metrics.totalOrders}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="p-2 bg-slate-200 rounded-lg text-slate-600"><Wallet className="w-4 h-4" /></div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Lifetime Spend</p>
                  <p className="text-lg font-bold text-slate-900">Rs. {mockCustomer.metrics.lifetimeValue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ==========================================
            RIGHT COLUMN: ORDER HISTORY
        ========================================== */}
        <div className="flex-1 w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-400" /> Order History
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3 font-semibold">Order ID</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Total Amount</th>
                  <th className="px-5 py-3 font-semibold">Payment Status</th>
                  <th className="px-5 py-3 font-semibold">Pending Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockCustomer.orderHistory.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-5 py-4">
                      <Link href={`/orders/${order.id}`} className="font-semibold text-blue-600 hover:underline">
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{order.date}</td>
                    <td className="px-5 py-4 font-medium">Rs. {order.total.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      {order.payment === "PAID" && <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700"><CheckCircle2 className="w-3 h-3"/> PAID</span>}
                      {order.payment === "PARTIAL" && <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-md text-[11px] font-bold bg-yellow-50 text-yellow-700"><Clock className="w-3 h-3"/> PARTIAL</span>}
                      {order.payment === "UNPAID" && <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200"><AlertCircle className="w-3 h-3"/> UNPAID</span>}
                    </td>
                    <td className="px-5 py-4">
                      {order.balance > 0 ? (
                        <span className="font-bold text-rose-600">Rs. {order.balance.toLocaleString()}</span>
                      ) : (
                        <span className="text-slate-400 font-medium">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}