"use client";

import { useState } from "react";
import { X, Barcode } from "lucide-react";

type ProductFormValues = {
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
};

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: ProductFormValues) => void | Promise<void>;
  categories: string[];
}

export default function AddProductModal({ isOpen, onClose, onAdd, categories }: AddProductModalProps) {
  // 🟢 Form state lives inside the modal now!
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category) return;
    
    // Create the new product payload
    const newProduct = {
      name,
      sku: sku || `SKU-${Math.floor(Math.random() * 10000)}`, 
      category,
      price: Number(price),
      stock: Number(stock) || 0,
    };
    
    // Send it back to the parent page
    void onAdd(newProduct);
    
    // Reset inputs
    setName(""); setSku(""); setPrice(""); setStock(""); setCategory("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Add New Product</h2>
            <p className="text-xs text-slate-500 mt-0.5">Fill in the details to add to inventory.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Product Name *</label>
            <input 
              type="text" required autoFocus
              value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Samsung Galaxy S23" 
              className="w-full border border-slate-300 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">SKU / Barcode</label>
              <div className="relative">
                <Barcode className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="text" 
                  value={sku} onChange={(e) => setSku(e.target.value)}
                  placeholder="Scan or leave empty" 
                  className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category *</label>
              <select 
                required
                value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-slate-300 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
              >
                <option value="" disabled>Select category...</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Selling Price (Rs) *</label>
              <input 
                type="number" required min="0"
                value={price} onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00" 
                className="w-full border border-slate-300 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Initial Stock</label>
              <input 
                type="number" min="0"
                value={stock} onChange={(e) => setStock(e.target.value)}
                placeholder="0" 
                className="w-full border border-slate-300 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              Save Product
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}