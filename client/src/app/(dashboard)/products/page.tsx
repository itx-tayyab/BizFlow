import { 
  Plus, 
  Search, 
  MoreVertical, 
  Package, 
  AlertCircle, 
  CheckCircle2, 
  Filter
} from "lucide-react";

// Mock Data (Based on your Prisma Schema)
const products =[
  { id: "1", name: "Samsung Galaxy S23", price: 210000, stock: 12, status: "in-stock" },
  { id: "2", name: "AirPods Pro (2nd Gen)", price: 65000, stock: 3, status: "low-stock" },
  { id: "3", name: "Dell XPS 13 Laptop", price: 350000, stock: 0, status: "out-of-stock" },
  { id: "4", name: "Logitech MX Master 3", price: 25000, stock: 24, status: "in-stock" },
  { id: "5", name: "Sony WH-1000XM5", price: 95000, stock: 4, status: "low-stock" },
];

export default function ProductsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 🟢 PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Products & Inventory
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage your catalog, pricing, and stock levels.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* 🟢 SEARCH & FILTERS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search products by name..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
          />
        </div>
        {/* Filter Button */}
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors w-full sm:w-auto">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* 🟢 INVENTORY LIST (Desktop Table / Mobile Cards) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Desktop View (Hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Product Name</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Stock Level</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">Rs. {product.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {product.stock > 5 ? (
                      <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {product.stock} in stock
                      </span>
                    ) : product.stock > 0 ? (
                      <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Only {product.stock} left
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Out of stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Hidden on desktop) */}
        <div className="md:hidden divide-y divide-slate-100">
          {products.map((product) => (
            <div key={product.id} className="p-4 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-slate-900">{product.name}</span>
                <span className="text-sm font-medium text-slate-600">Rs. {product.price.toLocaleString()}</span>
                <div className="mt-1">
                  {product.stock > 5 ? (
                    <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {product.stock} in stock
                    </span>
                  ) : product.stock > 0 ? (
                    <span className="text-xs font-medium text-yellow-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Only {product.stock} left
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Out of stock
                    </span>
                  )}
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-lg border border-slate-100">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}