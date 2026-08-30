import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().max(80).optional(),
  phone: z.string().trim().max(30).optional(),
  city: z.string().trim().max(60).optional(),
  quartier: z.string().trim().max(80).optional(),
  address: z.string().trim().max(160).optional(),
  deliveryPreference: z.enum(["delivery", "pickup", "transport"]).optional(),
});

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return Response.json({ loggedIn: false, customer: null }, { status: 200 });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return Response.json({ loggedIn: false, customer: null }, { status: 200 });
  return Response.json({
    loggedIn: true,
    customer: {
      name: user.name,
      phone: user.phone,
      city: user.city,
      quartier: user.quartier,
      address: user.address,
      deliveryPreference: user.deliveryPreference || "delivery",
    },
  });
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return Response.json({ error: "Non connecté" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });

  const { name, phone, city, quartier, address, deliveryPreference } = parsed.data;
  await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name !== undefined ? { name: name || null } : {}),
      ...(phone !== undefined ? { phone: phone || null } : {}),
      ...(city !== undefined ? { city: city || null } : {}),
      ...(quartier !== undefined ? { quartier: quartier || null } : {}),
      ...(address !== undefined ? { address: address || null } : {}),
      ...(deliveryPreference !== undefined ? { deliveryPreference } : {}),
    },
  });
  return Response.json({ ok: true });
}