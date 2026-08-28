import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/");

  return <AdminShell>{children}</AdminShell>;
}