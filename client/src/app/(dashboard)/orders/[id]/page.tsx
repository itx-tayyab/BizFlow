"use client";

import Link from "next/link";
import { 
  ArrowLeft, Receipt, Wallet, MessageCircle, 
  History, FileText, Printer, ChevronDown, 
  CheckCircle2, RefreshCcw, Banknote, CreditCard,
  User
} from "lucide-react";

// --- DEEP MOCK DATA ---
const mockOrder = {
  id: "ORD-1045",
  status: "COMPLETED",
  paymentStatus: "PARTIAL",
  date: "Oct 24, 2026 - 10:30 AM",
  customer: {
    name: "Zain Ahmed",
    phone: "923001234567",
    type: "Loyal Customer"
  },
  items:[
    { id: "1", name: "Samsung Galaxy S23", price: 210000, qty: 1, total: 210000 },
    { id: "2", name: "Screen Protector", price: 1500, qty: 2, total: 3000 },
  ],
  financials: {
    subtotal: 213000,
    discount: 3000,
    total: 210000,
    paid: 150000,
    balance: 60000
  },
  // Split Payments Array
  payments:[
    { id: "PAY-1", amount: 100000, method: "Bank Transfer", date: "Oct 24, 10:35 AM", receivedBy: "Ali (Owner)" },
    { id: "PAY-2", amount: 50000, method: "Cash", date: "Oct 24, 11:00 AM", receivedBy: "Waqas (Staff)" }
  ],
  // Audit Trail
  timeline:[
    { time: "11:00 AM", event: "Payment of Rs. 50,000 (Cash) recorded by Waqas", type: "payment" },
    { time: "10:35 AM", event: "Payment of Rs. 100,000 (Bank) recorded by Ali", type: "payment" },
    { time: "10:32 AM", event: "Order marked as COMPLETED by Ali", type: "status" },
    { time: "10:30 AM", event: "Order created by Ali", type: "create" }
  ],
  notes: "Customer promised to pay the remaining Rs. 60,000 balance next Friday after salary."
};

export default function OrderDetailsLedger() {
  // Pre-filled WhatsApp Message
  const waMessage = encodeURIComponent(`Hello ${mockOrder.customer.name}, your order ${mockOrder.id} is confirmed. Total: Rs. ${mockOrder.financials.total.toLocaleString()}. View receipt: bizflow.com/p/shop/${mockOrder.id}`);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      
      {/* 🟢 TOP ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/orders" className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-lg border border-slate-200 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">{mockOrder.id}</h1>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {mockOrder.status}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">{mockOrder.date}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            <Printer className="w-4 h-4" /> Print
          </button>
          <a 
            href={`https://wa.me/${mockOrder.customer.phone}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-xl text-sm font-medium hover:bg-[#20bd5a] transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4" /> Send Invoice
          </a>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* ==========================================
            LEFT COLUMN: FINANCIAL LEDGER
        ========================================== */}
        <div className="w-full lg:flex-1 space-y-6">
          
          {/* 1. Order Items */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-slate-400" /> Items Ordered
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {mockOrder.items.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">Rs. {item.price.toLocaleString()} x {item.qty}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-900">Rs. {item.total.toLocaleString()}</span>
                    {/* Refund Action (SaaS Feature) */}
                    <button className="text-slate-400 hover:text-rose-500 p-1.5 rounded-md hover:bg-rose-50 transition-colors tooltip-trigger" title="Process Return/Refund">
                      <RefreshCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Ledger Math */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>Rs. {mockOrder.financials.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-rose-600">
                <span>Discount</span>
                <span>- Rs. {mockOrder.financials.discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200 mt-2">
                <span>Grand Total</span>
                <span>Rs. {mockOrder.financials.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 2. Split Payments Logic */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-600" /> Payment History
              </h2>
              {mockOrder.financials.balance > 0 && (
                <button className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                  Record Payment
                </button>
              )}
            </div>
            
            {/* List of Payments */}
            <div className="p-4 space-y-3">
              {mockOrder.payments.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                      {payment.method === "Cash" ? <Banknote className="w-4 h-4 text-emerald-600" /> : <CreditCard className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Rs. {payment.amount.toLocaleString()} <span className="text-slate-500 font-normal">via {payment.method}</span></p>
                      <p className="text-xs text-slate-500">{payment.date} • by {payment.receivedBy}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-900"><ChevronDown className="w-4 h-4" /></button>
                </div>
              ))}
            </div>

            {/* Remaining Balance Tracker */}
            <div className="p-4 bg-rose-50 border-t border-rose-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-rose-700">Remaining Balance</p>
                <p className="text-xs text-rose-600/80 mt-0.5">Customer owes this amount</p>
              </div>
              <span className="text-2xl font-black text-rose-700">Rs. {mockOrder.financials.balance.toLocaleString()}</span>
            </div>
          </div>

        </div>

        {/* ==========================================
            RIGHT COLUMN: CONTEXT & AUDIT
        ========================================== */}
        <div className="w-full lg:w-[380px] space-y-6">
          
          {/* Customer CRM Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> Customer
            </h3>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-slate-900 text-lg">{mockOrder.customer.name}</p>
                <p className="text-sm text-slate-500 mt-1">{mockOrder.customer.phone}</p>
              </div>
              <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-md">
                {mockOrder.customer.type}
              </span>
            </div>
          </div>

          {/* Internal Notes (Hidden from public invoice) */}
          <div className="bg-[#fffdf0] p-5 rounded-2xl border border-yellow-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400" />
            <h3 className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Internal Staff Notes
            </h3>
            <p className="text-sm text-yellow-900/80 leading-relaxed italic">
              "{mockOrder.notes}"
            </p>
            <button className="text-xs font-medium text-yellow-700 mt-3 hover:underline">
              Edit Note
            </button>
          </div>

          {/* The Audit Trail */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
              <History className="w-4 h-4" /> Audit Trail
            </h3>
            <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
              {mockOrder.timeline.map((log, index) => (
                <div key={index} className="relative pl-5">
                  {/* Timeline Node Dot */}
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                    log.type === "payment" ? "bg-emerald-500" : log.type === "status" ? "bg-blue-500" : "bg-slate-300"
                  }`} />
                  <p className="text-sm font-medium text-slate-800 leading-tight mb-1">{log.event}</p>
                  <p className="text-xs text-slate-500">{log.time}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}