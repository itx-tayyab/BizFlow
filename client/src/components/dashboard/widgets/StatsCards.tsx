import { TrendingUp, Wallet, ShoppingCart, ArrowUpRight } from "lucide-react";

type StatsCardsProps = {
  kpis?: {
    todayRevenue?: number;
    pendingPayments?: number;
    activeOrders?: number;
    pendingOrderCount?: number;
  };
};

export default function StatsCards({ kpis }: StatsCardsProps) {
  const todayRevenue = Number(kpis?.todayRevenue || 0);
  const pendingPayments = Number(kpis?.pendingPayments || 0);
  const activeOrders = Number(kpis?.activeOrders || 0);
  const pendingOrderCount = Number(kpis?.pendingOrderCount || 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Today's Revenue</p>
            <h3 className="text-2xl font-bold text-slate-900">Rs. {todayRevenue.toLocaleString()}</h3>
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

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Pending Payments</p>
            <h3 className="text-2xl font-bold text-rose-600">Rs. {pendingPayments.toLocaleString()}</h3>
          </div>
          <div className="p-2 bg-rose-50 rounded-lg">
            <Wallet className="w-5 h-5 text-rose-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-slate-500">Across {pendingOrderCount || 0} unsettled orders</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Active Orders</p>
            <h3 className="text-2xl font-bold text-slate-900">{activeOrders}</h3>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-slate-500">{pendingOrderCount || 0} waiting for settlement</span>
        </div>
      </div>
    </div>
  );
}
