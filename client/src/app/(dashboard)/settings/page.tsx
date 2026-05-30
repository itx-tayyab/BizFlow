"use client";

import { useState } from "react";
import SettingsNav from "@/components/settings/SettingsNav";
import GeneralTab from "@/components/settings/GeneralTab";
import TeamTab from "@/components/settings/TeamTab";
import PortalTab from "@/components/settings/PortalTab";
import NotificationsTab from "@/components/settings/NotificationsTab";
import FloatingSaveBar from "@/components/settings/FloatingSaveBar";

// --- MOCK DATA ---
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
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="flex w-full flex-col animate-in fade-in duration-500 pb-24 mt-2">
      
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings & Workspace</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your business profile, team access, and public portal.</p>
      </div>

      {/* NAVIGATION TABS */}
      <SettingsNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* DYNAMIC CONTENT AREA */}
      <div className="w-full flex flex-col gap-8">
        {activeTab === "general" && <GeneralTab business={mockBusiness} />}
        {activeTab === "team" && <TeamTab team={mockTeam} />}
        {activeTab === "portal" && <PortalTab business={mockBusiness} />}
        {activeTab === "notifications" && <NotificationsTab />}
      </div>

      {/* FLOATING ACTION BAR */}
      <FloatingSaveBar isSaving={isSaving} handleSave={handleSave} />

    </div>
  );
}