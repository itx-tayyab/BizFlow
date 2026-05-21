"use client";

import { useState } from "react";
import { 
  Store, Users, Globe, Bell, Shield, 
  Save, UserPlus, Trash2, Edit2, Link as LinkIcon
} from "lucide-react";

// --- MOCK SETTINGS DATA ---
const mockBusiness = {
  name: "Al-Fatah Electronics",
  phone: "0300 1234567",
  email: "contact@alfatah.pk",
  address: "Main Boulevard, DHA Phase 6, Lahore",
  currency: "PKR",
  slug: "al-fatah",
};

const mockTeam =[
  { id: "U1", name: "Ali Khan", email: "ali@alfatah.pk", role: "OWNER", status: "Active" },
  { id: "U2", name: "Waqas Ahmed", email: "waqas@alfatah.pk", role: "STAFF", status: "Active" },
  { id: "U3", name: "Zain Raza", email: "zain@alfatah.pk", role: "STAFF", status: "Pending Invite" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000); // Mock save delay
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10 max-w-6xl mx-auto">
      
      {/* 🟢 HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Store className="w-6 h-6 text-blue-600" />
          Settings & Workspace
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage your business profile, team access, and public portal.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start mt-2">
        
        {/* 🟢 LEFT SIDEBAR (TABS) */}
        <div className="w-full md:w-64 shrink-0 flex md:flex-col overflow-x-auto hide-scrollbar gap-2 bg-white md:bg-transparent p-2 md:p-0 rounded-2xl border border-slate-200 md:border-none shadow-sm md:shadow-none">
          
          <button 
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "general" ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <Store className="w-4 h-4" /> General Info
          </button>

          <button 
            onClick={() => setActiveTab("team")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "team" ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <Users className="w-4 h-4" /> Team & Roles
          </button>

          <button 
            onClick={() => setActiveTab("portal")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "portal" ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <Globe className="w-4 h-4" /> Customer Portal
          </button>

          <button 
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "notifications" ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <Bell className="w-4 h-4" /> Notifications
          </button>

        </div>

        {/* 🟢 RIGHT MAIN CONTENT AREA */}
        <div className="flex-1 w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
          
          {/* ====================================
              TAB 1: GENERAL SETTINGS
          ==================================== */}
          {activeTab === "general" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Business Profile</h2>
                <p className="text-sm text-slate-500">This information appears on your invoices and receipts.</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
                    <input type="text" defaultValue={mockBusiness.name} className="w-full border border-slate-300 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input type="text" defaultValue={mockBusiness.phone} className="w-full border border-slate-300 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input type="email" defaultValue={mockBusiness.email} className="w-full border border-slate-300 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Base Currency</label>
                    <select defaultValue={mockBusiness.currency} className="w-full border border-slate-300 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="PKR">PKR (Pakistani Rupee)</option>
                      <option value="USD">USD (US Dollar)</option>
                      <option value="AED">AED (Emirati Dirham)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Shop Address</label>
                  <textarea rows={3} defaultValue={mockBusiness.address} className="w-full border border-slate-300 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                </div>
              </div>
            </div>
          )}

          {/* ====================================
              TAB 2: TEAM & ROLES (RBAC)
          ==================================== */}
          {activeTab === "team" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Team Management</h2>
                  <p className="text-sm text-slate-500">Invite staff and manage their permissions.</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
                  <UserPlus className="w-4 h-4" /> Invite Staff
                </button>
              </div>

              {/* RBAC Info Notice */}
              <div className="p-6 pb-2">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    <strong>Role Definitions:</strong> Owners have full access including deleting records and viewing total revenue. Staff can only create orders, accept payments, and view inventory.
                  </p>
                </div>
              </div>

              {/* Team List */}
              <div className="p-6 pt-4">
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-semibold">User</th>
                        <th className="px-4 py-3 font-semibold">Role</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {mockTeam.map((user) => (
                        <tr key={user.id}>
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{user.name}</span>
                              <span className="text-xs text-slate-500">{user.email}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider ${user.role === 'OWNER' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {user.status === "Active" ? (
                              <span className="text-emerald-600 font-medium text-xs">Active</span>
                            ) : (
                              <span className="text-yellow-600 font-medium text-xs">Pending Invite</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right space-x-2">
                            {user.role !== "OWNER" && (
                              <>
                                <button className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-md transition-colors"><Edit2 className="w-4 h-4" /></button>
                                <button className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
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
          )}

          {/* ====================================
              TAB 3: CUSTOMER PORTAL
          ==================================== */}
          {activeTab === "portal" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Customer Portal</h2>
                <p className="text-sm text-slate-500">Control your public-facing catalog and digital invoice links.</p>
              </div>

              <div className="p-6 space-y-8">
                
                {/* Custom Link Setup */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Your Unique Shop Link</label>
                  <p className="text-sm text-slate-500 mb-3">Share this link with customers so they can view your products and their receipts.</p>
                  
                  <div className="flex rounded-xl shadow-sm border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                    <span className="inline-flex items-center px-4 bg-slate-50 text-slate-500 text-sm border-r border-slate-300 font-medium">
                      bizflow.com/p/
                    </span>
                    <input
                      type="text"
                      defaultValue={mockBusiness.slug}
                      className="flex-1 block w-full py-2.5 px-3 outline-none text-slate-900 font-medium"
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:underline">
                      <LinkIcon className="w-4 h-4" /> Copy public link
                    </button>
                  </div>
                </div>

                {/* Portal Features Toggles */}
                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">Portal Features</h3>
                  
                  {/* Toggle 1 */}
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Public Catalog</p>
                      <p className="text-xs text-slate-500">Allow customers to see your inventory online.</p>
                    </div>
                    {/* Switch UI */}
                    <div className="w-11 h-6 bg-blue-600 rounded-full p-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full translate-x-5 shadow-sm"></div>
                    </div>
                  </div>

                  {/* Toggle 2 */}
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Self-Service Ordering</p>
                      <p className="text-xs text-slate-500">Allow customers to place orders directly from the link.</p>
                    </div>
                    {/* Switch UI */}
                    <div className="w-11 h-6 bg-slate-200 rounded-full p-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ====================================
              SAVE BUTTON FOOTER
          ==================================== */}
          <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end mt-auto">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 disabled:opacity-70 w-full sm:w-auto justify-center"
            >
              {isSaving ? "Saving changes..." : "Save Changes"}
              {!isSaving && <Save className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}