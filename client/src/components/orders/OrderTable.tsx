"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckSquare, Square, ChevronDown, CheckCircle2, Clock, AlertCircle, Truck } from "lucide-react";

export default function OrderTable({ 
  orders, selectedOrders, toggleSelection, toggleAll 
}: { 
  orders: any[], selectedOrders: string[], toggleSelection: (id: string) => void, toggleAll: () => void 
}) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 w-10">
              <button onClick={toggleAll} className="text-slate-400 hover:text-blue-600">
                {selectedOrders.length === orders.length && orders.length > 0 ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5" />}
              </button>
            </th>
            <th className="px-4 py-3 font-semibold">Order ID</th>
            <th className="px-4 py-3 font-semibold">Customer</th>
            <th className="px-4 py-3 font-semibold">Total</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Payment</th>
            <th className="px-4 py-3 font-semibold">Dispatch</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => (
            <tr 
              key={order.id} 
              className={`hover:bg-slate-50 cursor-pointer transition-colors ${selectedOrders.includes(order.id) ? "bg-blue-50/50" : ""}`}
              onClick={() => router.push(`/orders/${order.id}`)} 
            >
              <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => toggleSelection(order.id)} className="text-slate-400 hover:text-blue-600">
                  {selectedOrders.includes(order.id) ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5" />}
                </button>
              </td>
              
              <td className="px-4 py-4 font-semibold text-blue-600 hover:underline">{order.id}</td>
              
              <td className="px-4 py-4">
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900">{order.customer}</span>
                  <span className="text-xs text-slate-500">{order.date}</span>
                </div>
              </td>
              
              <td className="px-4 py-4 font-medium">Rs. {order.total.toLocaleString()}</td>
              
              {/* 🟢 POLISHED SAAS DROPDOWN */}
              <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                <div className="relative inline-block">
                  <select 
                    defaultValue={order.status}
                    className={`appearance-none border py-1 pl-3 pr-8 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 cursor-pointer transition-colors ${
                      order.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500' : 
                      order.status === 'PENDING' ? 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-500' :
                      'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <ChevronDown className={`w-3 h-3 absolute right-2.5 top-2 pointer-events-none ${order.status === 'COMPLETED' ? 'text-emerald-500' : 'text-blue-500'}`} />
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
  );
}