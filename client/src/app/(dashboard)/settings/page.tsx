"use client";

import { useState } from "react";
import SettingsNav from "@/components/settings/SettingsNav";
import ProfileTab from "@/components/settings/ProfileTab";
import GeneralTab from "@/components/settings/GeneralTab";
import TeamTab from "@/components/settings/TeamTab";
import PortalTab from "@/components/settings/PortalTab";
import NotificationsTab from "@/components/settings/NotificationsTab";
import FloatingSaveBar from "@/components/settings/FloatingSaveBar";

// --- MOCK RBAC ROLE ---
const currentUserRole: "OWNER" | "STAFF" = "OWNER";

// --- MOCK DATA ---
const mockUser = {
  name: "Ali Khan",
  personalPhone: "0321 9876543",
  email: "ali@alfatah.pk",
};

const mockBusiness = {
  name: "Al-Fatah Electronics",
  phone: "0300 1234567", // Notice business phone is different!
  email: "support@alfatah.pk",
  address: "Main Boulevard, DHA Phase 6, Lahore",
  currency: "PKR",
  slug: "al-fatah",
};

const mockTeam = [ /* same as before */ ];

export default function SettingsPage() {
  // If OWNER, default to general. If STAFF, default to profile.
  const [activeTab, setActiveTab] = useState(currentUserRole === "OWNER" ? "general" : "profile");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="flex w-full flex-col animate-in fade-in duration-500 pb-24 mt-2 max-w-4xl mx-auto">
      
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings & Workspace</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your profile, preferences, and workspace.</p>
        </div>
        
        {/* Role Badge Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
          <span className="text-xs text-slate-500 font-medium">Role:</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${currentUserRole === 'OWNER' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'}`}>
            {currentUserRole}
          </span>
        </div>
      </div>

      <SettingsNav activeTab={activeTab} setActiveTab={setActiveTab} role={currentUserRole} />

      <div className="w-full flex flex-col gap-8">
        {activeTab === "profile" && <ProfileTab user={mockUser} />}
        {activeTab === "general" && currentUserRole === "OWNER" && <GeneralTab business={mockBusiness} />}
        {activeTab === "team" && currentUserRole === "OWNER" && <TeamTab team={mockTeam} />}
        {activeTab === "portal" && currentUserRole === "OWNER" && <PortalTab business={mockBusiness} />}
        {activeTab === "notifications" && <NotificationsTab />}
      </div>

      <FloatingSaveBar isSaving={isSaving} handleSave={handleSave} />
    </div>
  );
}