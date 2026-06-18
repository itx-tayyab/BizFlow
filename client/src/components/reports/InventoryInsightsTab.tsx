import { AlertTriangle } from "lucide-react";

const topProducts = [
  { name: "Samsung Galaxy S23", sold: 14, revenue: 2940000, stock: 12 },
  { name: "AirPods Pro (2nd Gen)", sold: 28, revenue: 1820000, stock: 3 },
  { name: "iPhone 15 Clear Case", sold: 45, revenue: 112500, stock: 45 },
];

const deadStock = [
  { name: "Wired Earphones (MicroUSB)", daysUnsold: 45, stock: 30, tiedValue: 15000 },
  { name: "iPhone 11 Battery Case", daysUnsold: 60, stock: 15, tiedValue: 22500 },
];

export default function InventoryInsightsTab() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Selling Products */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Top Performing Products</h2>
            <p className="text-sm text-slate-500">Items generating the most revenue.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Sold</th>
                  <th className="px-6 py-4 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topProducts.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-900">{p.name}</td>
                    <td className="px-6 py-4 text-slate-600">{p.sold}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">Rs. {(p.revenue/1000).toFixed(0)}k</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🟢 NEW: Dead Stock / Slow Movers */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-rose-50/30">
            <div>
              <h2 className="text-lg font-bold text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Dead Stock Alerts
              </h2>
              <p className="text-sm text-slate-500">Items with 0 sales in the last 30 days.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Stock Stuck</th>
                  <th className="px-6 py-4 font-medium">Capital Tied Up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deadStock.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{p.name}</p>
                      <p className="text-xs text-rose-500">{p.daysUnsold} days unsold</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{p.stock} units</td>
                    <td className="px-6 py-4 font-bold text-rose-600">Rs. {p.tiedValue.toLocaleString()}</td>
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