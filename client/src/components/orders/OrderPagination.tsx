import { ChevronLeft, ChevronRight } from "lucide-react";

export default function OrderPagination({ totalItems }: { totalItems: number }) {
  return (
    <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-sm">
      <span className="text-slate-500">
        Showing <strong className="text-slate-900">1</strong> to <strong className="text-slate-900">{totalItems}</strong> of <strong className="text-slate-900">{totalItems}</strong> results
      </span>
      <div className="flex items-center gap-2">
        <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-50" disabled>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-slate-600 font-medium px-2">Page 1 of 1</span>
        <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-50" disabled>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}