import Link from "next/link";
import { 
  TrendingUp, 
  Wallet, 
  ShoppingCart, 
  Plus, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function DashboardHomePage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 🟢 PAGE HEADER & QUICK ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Here's what's happening with your business today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/orders/new" 
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Order
          </Link>
        </div>
      </div>

      {/* 🟢 TOP METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* Metric 1: Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Today's Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900">Rs. 45,000</h3>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-600 font-medium flex items-center">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +12%
            </span>
            <span className="text-slate-400 ml-2">from yesterday</span>
          </div>
        </div>

        {/* Metric 2: Pending Payments (Pain Point Resolver) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Pending Payments</p>
              <h3 className="text-2xl font-bold text-slate-900 text-rose-600">Rs. 12,500</h3>
            </div>
            <div className="p-2 bg-rose-50 rounded-lg">
              <Wallet className="w-5 h-5 text-rose-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-500">Across 4 un-settled orders</span>
          </div>
        </div>

        {/* Metric 3: Active Orders */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Active Orders</p>
              <h3 className="text-2xl font-bold text-slate-900">18</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-500">6 pending delivery</span>
          </div>
        </div>
      </div>

      {/* 🟢 RECENT ORDERS SECTION */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
          <Link href="/orders" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View All
          </Link>
        </div>
        
        {/* Table for Desktop, List for Mobile */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Payment Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              
              {/* Mock Order 1: Paid */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">#ORD-1042</td>
                <td className="px-6 py-4">Zain Ahmed</td>
                <td className="px-6 py-4">Rs. 8,500</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Paid
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">10 mins ago</td>
              </tr>

              {/* Mock Order 2: Unpaid */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">#ORD-1041</td>
                <td className="px-6 py-4">Waqas Ali</td>
                <td className="px-6 py-4">Rs. 12,000</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Unpaid
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">2 hours ago</td>
              </tr>

              {/* Mock Order 3: Partial */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">#ORD-1040</td>
                <td className="px-6 py-4">Fatima Store</td>
                <td className="px-6 py-4">Rs. 45,000</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                    <Clock className="w-3.5 h-3.5" />
                    Partial
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">Yesterday</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}