import { Star } from "lucide-react";

const vipCustomers = [
  { name: "Fatima Store", type: "B2B Wholesale", spent: 1250000, orders: 24 },
  { name: "Zain Ahmed", type: "Retail", spent: 450000, orders: 12 },
  { name: "Ayesha Khan", type: "Retail", spent: 110000, orders: 8 },
];

export default function CustomerInsightsTab() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-amber-50/30">
          <h2 className="text-lg font-bold text-amber-700 flex items-center gap-2">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" /> VIP Customers (Highest LTV)
          </h2>
          <p className="text-sm text-slate-500">Your most valuable customers based on lifetime spend.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Customer Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Total Orders</th>
                <th className="px-6 py-4 font-medium">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vipCustomers.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-900">{c.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">{c.type}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{c.orders}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">Rs. {c.spent.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}