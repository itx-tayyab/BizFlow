export default function OrderMetrics({ orders, activeTab }: { orders: any[], activeTab: string }) {
  const totalValue = orders.reduce((sum, order) => sum + order.total, 0);
  const unpaidValue = orders
    .filter(o => o.payment !== "PAID")
    .reduce((sum, order) => sum + order.total, 0); // Simplified for mock data

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3 px-4 mb-4">
      <div className="text-sm text-slate-600 font-medium">
        Showing <strong>{orders.length}</strong> {activeTab.replace("-", " ")}
      </div>
      
      <div className="flex items-center gap-4 text-sm mt-2 sm:mt-0">
        <span className="text-slate-600">
          Total Value: <strong className="text-slate-900">Rs. {totalValue.toLocaleString()}</strong>
        </span>
        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
        <span className={`${unpaidValue > 0 ? 'text-rose-600' : 'text-emerald-600'} font-medium`}>
          Outstanding: Rs. {unpaidValue.toLocaleString()}
        </span>
      </div>
    </div>
  );
}