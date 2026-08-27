import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const statusSchema = z.enum(["NEW", "CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"]);

async function guard() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") return false;
  return true;
}

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await guard())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => ({ status: "" }));
  const parsed = statusSchema.safeParse(body.status);
  if (!parsed.success) return Response.json({ error: "Statut invalide" }, { status: 400 });
  try {
    const order = await prisma.order.update({ where: { id }, data: { status: parsed.data } });
    return Response.json({ ok: true, order });
  } catch {
    return Response.json({ error: "Commande introuvable" }, { status: 404 });
  }
}