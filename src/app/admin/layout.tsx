import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar, AdminMobileTop } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen bg-sabren-cream">
      <AdminSidebar />
      <AdminMobileTop />
      <main className="md:ml-64 min-h-screen">
        <div className="px-4 md:px-8 py-6 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}