import AdminSidebar from "@/components/AdminSidebar";

export const metadata = {
  title: "Admin Portal - Kirubai Foods",
  description: "Admin Management Dashboard",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 max-w-full overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
}
