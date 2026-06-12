"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, User, Phone, MapPin, Mail, 
  Plus, MessageCircle, ShoppingBag, Wallet, 
  Calendar, CheckCircle2, AlertCircle, Clock,
  QrCode, ShieldAlert, CreditCard, UserX
} from "lucide-react";

// --- MOCK CUSTOMER DATA ---
const mockCustomer = {
  id: "CUST-882",
  name: "Zain Ahmed",
  phone: "0300 1234567",
  address: "House 42, Street 5, DHA Phase 6, Lahore",
  email: "zain.ahmed@example.com",
  cnic: "35202-1234567-8",
  guarantorPhone: "0321 7654321",
  joined: "March 2026",
  metrics: {
    totalOrders: 12,
    lifetimeValue: 450000,
    outstandingBalance: 25000
  },
  orderHistory:[
    { id: "ORD-1045", date: "Jun 12, 2026", total: 45000, status: "COMPLETED", payment: "PARTIAL", balance: 25000 },
    { id: "ORD-1020", date: "May 15, 2026", total: 12000, status: "COMPLETED", payment: "PAID", balance: 0 },
    { id: "ORD-0988", date: "Apr 02, 2026", total: 85000, status: "COMPLETED", payment: "PAID", balance: 0 },
  ]
};

export default function CustomerProfilePage() {
  // Interactive States for the Demo
  const [isDefaulter, setIsDefaulter] = useState(false);
  const [creditLimit, setCreditLimit] = useState(50000);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10 mt-2">
      
      {/* 🟢 TOP ACTION BAR */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border shadow-sm transition-colors ${isDefaulter ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-4">
          <Link href="/customers" className="p-2 text-slate-400 hover:text-slate-900 bg-white rounded-lg border border-slate-200 transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">{mockCustomer.name}</h1>
              
              {/* Dynamic Badges */}
              {isDefaulter && (
                <span className="bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm uppercase tracking-wide">
                  <UserX className="w-3.5 h-3.5" /> Defaulter
                </span>
              )}
              {!isDefaulter && mockCustomer.metrics.outstandingBalance > 0 && (
                <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-md border border-rose-200">
                  Owes Rs. {mockCustomer.metrics.outstandingBalance.toLocaleString()}
                </span>
              )}
              {!isDefaulter && mockCustomer.metrics.outstandingBalance === 0 && (
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
            LEFT COLUMN: INFO & RISK MANAGEMENT
        ========================================== */}
        <div className="w-full lg:w-[350px] flex flex-col gap-6">
          
          {/* 🔴 NEW: CREDIT & RISK MANAGEMENT */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Risk & Credit Rules
            </h3>
            
            <div className="space-y-5">
              {/* Credit Limit Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Udhaar / Credit Limit
                </label>
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                  <span className="px-3 text-slate-500 text-sm font-medium border-r border-slate-300">Rs.</span>
                  <input 
                    type="number" 
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(Number(e.target.value))}
                    className="w-full py-2 px-3 text-sm outline-none bg-transparent font-bold text-slate-900" 
                  />
                </div>
                <div className="flex justify-between mt-1 text-[10px] font-medium">
                  <span className="text-slate-500">Currently used: Rs. {mockCustomer.metrics.outstandingBalance.toLocaleString()}</span>
                  <span className={`${creditLimit - mockCustomer.metrics.outstandingBalance < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    Available: Rs. {(creditLimit - mockCustomer.metrics.outstandingBalance).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Defaulter Toggle */}
              <div className="flex items-center justify-between p-3 border border-rose-100 bg-rose-50/50 rounded-lg">
                <div>
                  <p className="font-bold text-rose-900 text-sm">Mark as Defaulter</p>
                  <p className="text-[10px] text-rose-700/80 leading-tight mt-0.5">Blocks staff from giving udhaar.</p>
                </div>
                <div 
                  onClick={() => setIsDefaulter(!isDefaulter)}
                  className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors ${isDefaulter ? 'bg-rose-600' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${isDefaulter ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTACT & KYC DETAILS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact & KYC</h3>
              <button className="text-xs font-semibold text-blue-600 hover:underline">Edit</button>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 text-slate-700">
                <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-medium">{mockCustomer.phone}</p>
                  <p className="text-xs text-slate-500">Mobile</p>
                </div>
              </div>

              {/* 🟢 NEW: CNIC & SCANNER UI */}
              <div className="flex items-start gap-3 text-slate-700">
                <QrCode className="w-4 h-4 text-slate-400 mt-0.5" />
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <p className="font-mono font-medium text-slate-900">{mockCustomer.cnic || "Not provided"}</p>
                    <button className="flex items-center gap-1 text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200 hover:bg-blue-100 transition-colors">
                      <QrCode className="w-3 h-3" /> SCAN QR
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">CNIC Number</p>
                </div>
              </div>

              {/* 🟢 NEW: GUARANTOR (ZAMANAT) */}
              <div className="flex items-start gap-3 text-slate-700">
                <User className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-medium">{mockCustomer.guarantorPhone || "Not provided"}</p>
                  <p className="text-xs text-slate-500">Guarantor Phone (Zamanat)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-slate-700 pt-2 border-t border-slate-100">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-medium leading-relaxed">{mockCustomer.address}</p>
                  <p className="text-xs text-slate-500">Shipping Address</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lifetime Metrics Card (Moved down) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Financial Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Total Orders</span>
                <span className="text-base font-bold text-slate-900">{mockCustomer.metrics.totalOrders}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Lifetime Spend</span>
                <span className="text-base font-bold text-slate-900">Rs. {mockCustomer.metrics.lifetimeValue.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ==========================================
            RIGHT COLUMN: ORDER HISTORY
        ========================================== */}
        <div className="flex-1 w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-400" /> Order History
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
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