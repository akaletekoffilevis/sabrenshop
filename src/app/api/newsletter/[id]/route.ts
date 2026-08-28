import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await prisma.newsletterSubscriber.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Abonné introuvable" }, { status: 404 });
  }
}