import { UploadCloud, AlertCircle } from "lucide-react";

export default function GeneralTab({ business }: { business: any }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
      
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900">Brand Identity</h2>
          <p className="text-sm text-slate-500">Your logo and business name will appear on digital receipts.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row gap-8 items-start">
          
          {/* Business Logo */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-xl bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer group shadow-sm">
              <UploadCloud className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xs font-medium text-slate-500">Upload Logo</span>
          </div>

          <div className="flex-1 w-full space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Business / Shop Name</label>
              <input type="text" defaultValue={business.name} className="w-full border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-sm" />
            </div>
          </div>
        </div>
      </section>

      <hr className="border-slate-200" />

      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900">Public Contact & Region</h2>
          <p className="text-sm text-slate-500">This is how your customers will contact your shop.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Business Phone (WhatsApp)</label>
              <input type="text" defaultValue={business.phone} className="w-full border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Support Email</label>
              <input type="email" defaultValue={business.email} className="w-full border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Base Currency</label>
              <select defaultValue={business.currency} className="w-full border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-sm bg-white cursor-pointer">
                <option value="PKR">PKR (Pakistani Rupee)</option>
                <option value="USD">USD (US Dollar)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Physical Shop Address</label>
            <textarea rows={3} defaultValue={business.address} className="w-full border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-sm resize-none" />
          </div>
        </div>
      </section>
      
      {/* Danger Zone remains exactly the same here... */}
    </div>
  );
}