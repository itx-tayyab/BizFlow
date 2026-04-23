import Sidebar from "@/components/dashboard/Sidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import Header from "@/components/dashboard/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* 1. Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      {/* Note the md:pl-64 class - this pushes the content to the right so it doesn't hide behind the desktop sidebar! */}
      <div className="flex flex-col md:pl-64 min-h-screen pb-16 md:pb-0">
        
        {/* 2. Top Header */}
        <Header />

        {/* 3. The Page Content (e.g., Orders, Customers, Home) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        
      </div>

      {/* 4. Mobile Bottom Nav */}
      <MobileNav />
      
    </div>
  );
}