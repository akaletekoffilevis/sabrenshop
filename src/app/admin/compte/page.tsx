import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/admin/ui";
import { AdminAccount } from "@/components/admin/AdminAccount";

export const dynamic = "force-dynamic";

export default async function AdminComptePage() {
  const session = await auth();
  const user = await prisma.user.findUnique({ where: { email: session?.user?.email ?? "" } });
  if (!user) redirect("/connexion");

  return (
    <div>
      <PageHeader title="Mon compte admin" subtitle="Modifiez l’email de connexion ou le mot de passe de votre compte administrateur." />
      <AdminAccount email={user.email} name={user.name || ""} />
    </div>
  );
}