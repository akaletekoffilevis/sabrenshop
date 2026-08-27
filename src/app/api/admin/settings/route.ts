import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const sSchema = z.object({
  shopName: z.string().min(2).optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  promoBarText: z.string().optional().nullable(),
  promoBarActive: z.boolean().optional(),
  deliveryFee: z.coerce.number().int().min(0).optional(),
  freeDeliveryThreshold: z.coerce.number().int().min(0).optional().nullable(),
  heroTitle: z.string().optional().nullable(),
  heroSubtitle: z.string().optional().nullable(),
  heroImage: z.string().optional().nullable(),
  heroCta1Text: z.string().optional().nullable(),
  heroCta2Text: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  tiktok: z.string().optional().nullable(),
});

async function guard() {
  const session = await auth();
  return session?.user && (session.user as { role?: string }).role === "ADMIN";
}

export async function GET() {
  if (!(await guard())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const settings = await prisma.settings.findUnique({ where: { id: "default" } });
  return Response.json({ settings });
}

export async function PUT(req: Request) {
  if (!(await guard())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const parsed = sSchema.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: "Données invalides" }, { status: 400 });
  const data = { ...parsed.data, email: parsed.data.email || null, address: parsed.data.address || null, promoBarText: parsed.data.promoBarText || null, freeDeliveryThreshold: parsed.data.freeDeliveryThreshold || null, promoBarActive: parsed.data.promoBarActive ?? true };
  const settings = await prisma.settings.upsert({ where: { id: "default" }, update: data, create: { id: "default", ...data } });
  return Response.json({ ok: true, settings });
}