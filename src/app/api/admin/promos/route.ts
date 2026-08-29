import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

async function guard() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") return false;
  return true;
}

const schema = z.object({
  code: z.string().min(1, "Code requis").transform((s) => s.toUpperCase().trim()),
  description: z.string().optional().nullable(),
  type: z.enum(["PERCENT", "FIXED"]).default("PERCENT"),
  value: z.number().int().min(1, "Valeur invalide"),
  minSubtotal: z.number().int().min(0).optional().nullable(),
  maxUses: z.number().int().min(0).optional().nullable(),
  isActive: z.boolean().default(true),
  expiresAt: z.string().optional().nullable().transform((s) => (s ? new Date(`${s}T23:59:59.999Z`) : null)),
});

export async function GET() {
  if (!(await guard())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const promos = await prisma.promoCode.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json({ promos });
}

export async function POST(req: Request) {
  if (!(await guard())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });
  if (parsed.data.type === "PERCENT" && parsed.data.value > 100) return Response.json({ error: "Une remise % ne peut pas dépasser 100." }, { status: 400 });
  if (parsed.data.expiresAt && parsed.data.expiresAt < new Date()) return Response.json({ error: "La date d'expiration doit être dans le futur." }, { status: 400 });

  const existing = await prisma.promoCode.findUnique({ where: { code: parsed.data.code } });
  if (existing) return Response.json({ error: "Ce code existe déjà." }, { status: 409 });

  const promo = await prisma.promoCode.create({ data: { ...parsed.data, expiresAt: parsed.data.expiresAt } as any });
  return Response.json({ ok: true, promo });
}