import { UserPlus, Shield, Edit2, Trash2 } from "lucide-react";

export default function TeamTab({ team }: { team: any[] }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
      <div>
        <h2 className="text-base font-semibold text-slate-900">Team Management</h2>
        <p className="text-sm text-slate-500">Invite staff and manage their permissions.</p>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-medium text-slate-900">Active Members</h3>
          <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
            <UserPlus className="w-4 h-4" /> Invite Staff
          </button>
        </div>
        
        <div className="p-5">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-3 mb-5">
            <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              <strong>Role Definitions:</strong> Owners have full access including deleting records. Staff can only create orders, accept payments, and view inventory.
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 py-2.5 font-medium">User</th>
                  <th className="px-4 py-2.5 font-medium">Role</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {team.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{user.name}</span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${user.role === 'OWNER' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.status === "Active" ? (
                        <span className="text-emerald-600 font-medium text-xs">Active</span>
                      ) : (
                        <span className="text-yellow-600 font-medium text-xs">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right space-x-1">
                      {user.role !== "OWNER" && (
                        <>
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}