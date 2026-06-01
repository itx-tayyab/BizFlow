import { Link as LinkIcon } from "lucide-react";

export default function PortalTab({ business }: { business: any }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
      <div>
        <h2 className="text-base font-semibold text-slate-900">Customer Portal</h2>
        <p className="text-sm text-slate-500">Control your public-facing catalog and digital invoice links.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-8">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1.5">Your Unique Shop Link</label>
          <p className="text-sm text-slate-500 mb-3">Share this link with customers so they can view your products and their receipts.</p>
          
          <div className="flex rounded-lg shadow-sm border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <span className="inline-flex items-center px-3 bg-slate-50 text-slate-500 text-sm border-r border-slate-300 font-medium">
              bizflow.com/p/
            </span>
            <input type="text" defaultValue={business.slug} className="flex-1 block w-full py-2 px-3 outline-none text-slate-900 font-medium text-sm" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:underline">
              <LinkIcon className="w-4 h-4" /> Copy public link
            </button>
          </div>
        </div>

        <hr className="border-slate-100" />

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">Portal Features</h3>
          
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
            <div>
              <p className="font-medium text-slate-900 text-sm">Public Catalog</p>
              <p className="text-xs text-slate-500">Allow customers to see your inventory online.</p>
            </div>
            <div className="w-10 h-5 bg-blue-600 rounded-full p-0.5 cursor-pointer flex items-center justify-end">
              <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
            <div>
              <p className="font-medium text-slate-900 text-sm">Self-Service Ordering</p>
              <p className="text-xs text-slate-500">Allow customers to place orders directly from the link.</p>
            </div>
            <div className="w-10 h-5 bg-slate-200 rounded-full p-0.5 cursor-pointer flex items-center justify-start">
              <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}