import { User } from "lucide-react";

export default function ProfileTab({ user }: { user: any }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
      
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900">Personal Information</h2>
          <p className="text-sm text-slate-500">Update your personal details and how you log in.</p>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row gap-8 items-start">
          
          {/* Personal Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-sm">
              {user.name.split(" ").map((n: string) => n[0]).join("")}
            </div>
            <button className="text-xs font-medium text-blue-600 hover:underline">Change Avatar</button>
          </div>

          <div className="flex-1 w-full space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input type="text" defaultValue={user.name} className="w-full border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Personal Phone</label>
                <input type="text" defaultValue={user.personalPhone} className="w-full border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-sm" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Login Email</label>
              <input type="email" defaultValue={user.email} disabled className="w-full border border-slate-200 rounded-lg py-2 px-3 outline-none text-sm bg-slate-100 text-slate-500 cursor-not-allowed" />
              <p className="text-xs text-slate-400 mt-1.5">Your email cannot be changed here. Contact support if needed.</p>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-slate-200" />

      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900">Change Password</h2>
          <p className="text-sm text-slate-500">Ensure your account stays secure.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
              <input type="password" placeholder="••••••••" className="w-full border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
              <input type="password" placeholder="••••••••" className="w-full border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-sm" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}