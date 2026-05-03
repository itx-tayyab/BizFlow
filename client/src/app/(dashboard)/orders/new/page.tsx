"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Search, User, UserPlus, Plus, 
  Minus, Trash2, Tag, CheckCircle2, Wallet, 
  Receipt
} from "lucide-react";

// --- MOCK INVENTORY ---
const mockProducts =[
  { id: "P1", name: "Samsung Galaxy S23", price: 210000 },
  { id: "P2", name: "AirPods Pro", price: 65000 },
  { id: "P3", name: "USB-C Cable (Fast Charge)", price: 1500 },
  { id: "P4", name: "Screen Protector", price: 800 },
];

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export default function CreateOrderPOS() {
  // State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerMode, setCustomerMode] = useState<"walk-in" | "existing">("walk-in");
  const [discount, setDiscount] = useState<number>(0);
  const [isPaidNow, setIsPaidNow] = useState<boolean>(true);

  // Cart Functions
  const addToCart = (product: { id: string; name: string; price: number }) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return[...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => prev.map((item) => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => setCart((prev) => prev.filter((item) => item.id !== id));

  // Math
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal - discount;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden animate-in fade-in duration-500">
      
      {/* 🟢 TOP BAR */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/orders" className="p-2 text-slate-400 hover:text-slate-900 bg-white rounded-lg border border-slate-200">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Create Order</h1>
            <p className="text-xs text-slate-500 hidden sm:block">Point of Sale (POS)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md hidden sm:block">
            Auto-saving Draft...
          </span>
        </div>
      </div>

      {/* 🟢 SPLIT SCREEN LAYOUT */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden mt-4 gap-6">
        
        {/* ==========================================
            LEFT SIDE: CATALOG & SEARCH
        ========================================== */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm">
          {/* Search Bar */}
          <div className="p-4 border-b border-slate-100 flex gap-2 shrink-0">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button className="whitespace-nowrap px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors hidden sm:block">
              + Custom Item
            </button>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {mockProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="flex flex-col text-left bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all active:scale-95"
                >
                  <span className="font-semibold text-slate-900 text-sm line-clamp-2 mb-2">{product.name}</span>
                  <span className="text-blue-600 font-bold mt-auto">Rs. {product.price.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>


        {/* ==========================================
            RIGHT SIDE: CART & CHECKOUT LEDGER
        ========================================== */}
        <div className="w-full lg:w-[400px] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden shrink-0 h-full">
          
          {/* 1. Customer Selection */}
          <div className="p-4 border-b border-slate-100 bg-slate-50 shrink-0">
            <div className="flex bg-white rounded-lg p-1 border border-slate-200">
              <button 
                onClick={() => setCustomerMode("walk-in")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${customerMode === "walk-in" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"}`}
              >
                Walk-in Customer
              </button>
              <button 
                onClick={() => setCustomerMode("existing")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${customerMode === "existing" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"}`}
              >
                Existing / Search
              </button>
            </div>
            {customerMode === "existing" && (
              <div className="mt-3 relative">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input type="text" placeholder="Search by name or phone..." className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
              </div>
            )}
          </div>

          {/* 2. Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                <Receipt className="w-12 h-12 opacity-20" />
                <p className="text-sm font-medium">Cart is empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">Rs. {item.price.toLocaleString()}</p>
                  </div>
                  
                  {/* Qty Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-100 rounded-lg border border-slate-200">
                      <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-slate-200 rounded-l-lg"><Minus className="w-4 h-4 text-slate-600" /></button>
                      <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-slate-200 rounded-r-lg"><Plus className="w-4 h-4 text-slate-600" /></button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-1 text-slate-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 3. Totals & Checkout Panel */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0">
            
            {/* Discount Row */}
            <div className="flex items-center justify-between mb-3">
              <button className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline">
                <Tag className="w-3.5 h-3.5" /> Add Discount
              </button>
              {discount > 0 && <span className="text-sm text-rose-600 font-medium">- Rs. {discount}</span>}
            </div>

            {/* Total Row */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-600 font-medium">Grand Total</span>
              <span className="text-2xl font-bold text-slate-900">Rs. {total.toLocaleString()}</span>
            </div>

            {/* Payment Toggle (Instant Capture) */}
            <div className="mb-4 bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between cursor-pointer" onClick={() => setIsPaidNow(!isPaidNow)}>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-md ${isPaidNow ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Payment Received</p>
                  <p className="text-xs text-slate-500">Auto-record payment now</p>
                </div>
              </div>
              <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isPaidNow ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${isPaidNow ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </div>

            {/* Save Button */}
            <button 
              disabled={cart.length === 0}
              className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
            >
              Complete Order <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}