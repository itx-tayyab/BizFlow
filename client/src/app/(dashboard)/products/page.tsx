"use client";

import { useState } from "react";
import { 
  Search, Package, AlertCircle, CheckCircle2, 
  Filter, Plus, Minus, Trash2, ArrowRight
} from "lucide-react";

// --- MOCK INVENTORY DATA ---
const initialProducts =[
  { id: "1", name: "Samsung Galaxy S23", price: 210000, stock: 12 },
  { id: "2", name: "AirPods Pro (2nd Gen)", price: 65000, stock: 3 },
  { id: "3", name: "Dell XPS 13 Laptop", price: 350000, stock: 0 },
  { id: "4", name: "Logitech MX Master 3", price: 25000, stock: 24 },
  { id: "5", name: "Sony WH-1000XM5", price: 95000, stock: 4 },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Quick Add State
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");

  // --- ACTIONS ---
  const handleAddProduct = () => {
    if (!newName || !newPrice) return;
    const newProduct = {
      id: Math.random().toString(),
      name: newName,
      price: Number(newPrice),
      stock: Number(newStock) || 0,
    };
    setProducts([newProduct, ...products]); // Add to top of list
    setNewName(""); setNewPrice(""); setNewStock(""); // Reset inputs
  };

  const updateStock = (id: string, delta: number) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const updatedStock = p.stock + delta;
        return { ...p, stock: updatedStock < 0 ? 0 : updatedStock };
      }
      return p;
    }));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // --- MATH METRICS ---
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* 🟢 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Products & Inventory
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage catalog, adjust stock instantly, and track inventory value.</p>
        </div>
      </div>

      {/* 🟢 2. DYNAMIC METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Products</p>
            <p className="text-2xl font-bold text-slate-900">{products.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Inventory Value</p>
            <p className="text-2xl font-bold text-slate-900 text-emerald-600">Rs. {totalInventoryValue.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-rose-600">Needs Restock</p>
            <p className="text-2xl font-bold text-rose-700">{lowStockCount + outOfStockCount} items</p>
          </div>
          <AlertCircle className="w-8 h-8 text-rose-200" />
        </div>
      </div>

      {/* 🟢 3. SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors w-full sm:w-auto">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* 🟢 4. INLINE SPREADSHEET TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Product Name</th>
                <th className="px-6 py-4 font-semibold w-40">Price (Rs)</th>
                <th className="px-6 py-4 font-semibold w-48">Stock Level</th>
                <th className="px-6 py-4 font-semibold w-32 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {/* --- ⚡ INLINE QUICK-ADD ROW (Replaces the need for a Modal/Page) --- */}
              <tr className="bg-blue-50/30">
                <td className="px-6 py-3">
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                    placeholder="+ Add new product name..." 
                    className="w-full bg-white border border-blue-200 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-300 font-medium"
                  />
                </td>
                <td className="px-6 py-3">
                  <input 
                    type="number" 
                    value={newPrice} 
                    onChange={(e) => setNewPrice(e.target.value)} 
                    placeholder="Price" 
                    className="w-full bg-white border border-blue-200 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-3">
                  <input 
                    type="number" 
                    value={newStock} 
                    onChange={(e) => setNewStock(e.target.value)} 
                    placeholder="Stock Qty" 
                    className="w-full bg-white border border-blue-200 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-3 text-right">
                  <button 
                    onClick={handleAddProduct}
                    disabled={!newName || !newPrice}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1 ml-auto"
                  >
                    Save <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>

              {/* --- ACTUAL DATA ROWS --- */}
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-slate-900">{product.name}</td>
                  
                  <td className="px-6 py-4 font-medium text-slate-600">
                    Rs. {product.price.toLocaleString()}
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Stock Badge */}
                      <div className="w-28">
                        {product.stock > 5 ? (
                          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> {product.stock} in stock
                          </span>
                        ) : product.stock > 0 ? (
                          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-[11px] font-bold bg-yellow-50 text-yellow-700 border border-yellow-200">
                            <AlertCircle className="w-3 h-3" /> Only {product.stock} left
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertCircle className="w-3 h-3" /> Out of stock
                          </span>
                        )}
                      </div>
                      
                      {/* Inline Stock Adjustment Buttons */}
                      <div className="hidden group-hover:flex items-center bg-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                        <button onClick={() => updateStock(product.id, -1)} className="px-2 py-1 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"><Minus className="w-3 h-3" /></button>
                        <button onClick={() => updateStock(product.id, 1)} className="px-2 py-1 text-slate-500 hover:bg-slate-200 hover:text-slate-900 border-l border-slate-200 transition-colors"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </td>

                  {/* Actions Column (Directly visible, no 3 dots) */}
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteProduct(product.id)}
                      className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}