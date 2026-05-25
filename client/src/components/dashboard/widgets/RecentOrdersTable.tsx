import Link from "next/link";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default function RecentOrdersTable() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
        <Link href="/orders" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          View All Orders
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Payment Status</th>
              <th className="px-6 py-4 font-medium text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            <tr className="hover:bg-slate-50 transition-colors group cursor-pointer">
              <td className="px-6 py-4 font-semibold text-blue-600 group-hover:underline">#ORD-1045</td>
              <td className="px-6 py-4 font-medium text-slate-900">Zain Ahmed</td>
              <td className="px-6 py-4 font-medium">Rs. 45,000</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-[11px] font-bold bg-yellow-50 text-yellow-700">
                  <Clock className="w-3.5 h-3.5" /> PARTIAL
                </span>
              </td>
              <td className="px-6 py-4 text-slate-500 text-right">10 mins ago</td>
            </tr>

            <tr className="hover:bg-slate-50 transition-colors group cursor-pointer">
              <td className="px-6 py-4 font-semibold text-blue-600 group-hover:underline">#ORD-1044</td>
              <td className="px-6 py-4 font-medium text-slate-900">Waqas Ali</td>
              <td className="px-6 py-4 font-medium">Rs. 12,000</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  <AlertCircle className="w-3.5 h-3.5" /> UNPAID
                </span>
              </td>
              <td className="px-6 py-4 text-slate-500 text-right">2 hours ago</td>
            </tr>

            <tr className="hover:bg-slate-50 transition-colors group cursor-pointer">
              <td className="px-6 py-4 font-semibold text-blue-600 group-hover:underline">#ORD-1043</td>
              <td className="px-6 py-4 font-medium text-slate-900">Fatima Store</td>
              <td className="px-6 py-4 font-medium">Rs. 125,000</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PAID
                </span>
              </td>
              <td className="px-6 py-4 text-slate-500 text-right">Yesterday</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
