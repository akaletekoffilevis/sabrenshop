import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { validatePromo } from "@/lib/promo";
import { z } from "zod";

const itemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().int().min(0),
  quantity: z.number().int().min(1),
  color: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

const orderSchema = z.object({
  customerName: z.string().min(2, "Votre nom est requis"),
  phone: z.string().min(4, "Numéro de téléphone requis"),
  whatsapp: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  ville: z.string().min(2, "Ville requise"),
  quartier: z.string().min(2, "Quartier requis"),
  address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  isPickup: z.boolean().optional().default(false),
  paymentMethod: z.enum(["WHATSAPP", "COD"]).optional().default("COD"),
  promoCode: z.string().optional().nullable(),
  items: z.array(itemSchema).min(1, "Panier vide"),
});

export async function POST(req: Request) {
  const session = await auth();
  const parsed = orderSchema.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });

  const settings = await prisma.settings.findUnique({ where: { id: "default" } });
  const subTotal = parsed.data.items.reduce((a, i) => a + i.price * i.quantity, 0);
  const freeThreshold = settings?.freeDeliveryThreshold ?? null;
  const baseFee = settings?.deliveryFee ?? 100;
  const deliveryFee = parsed.data.isPickup ? 0 : freeThreshold && subTotal >= freeThreshold ? 0 : baseFee;

  let discount = 0;
  let promoApplied: string | null = null;
  if (parsed.data.promoCode) {
    const v = await validatePromo(parsed.data.promoCode, subTotal);
    if (v.valid) {
      discount = v.discount;
      promoApplied = v.code;
    }
  }
  const total = subTotal - discount + deliveryFee;

  const year = new Date().getFullYear();
  const count = await prisma.order.count();
  const orderNumber = `SAB-${year}-${String(count + 1).padStart(4, "0")}`;

  try {
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: parsed.data.customerName,
        phone: parsed.data.phone,
        whatsapp: parsed.data.whatsapp || null,
        email: parsed.data.email || null,
        ville: parsed.data.ville,
        quartier: parsed.data.quartier,
        address: parsed.data.address || null,
        notes: parsed.data.notes || null,
        isPickup: parsed.data.isPickup,
        paymentMethod: parsed.data.paymentMethod,
        deliveryFee,
        discount,
        promoCode: promoApplied,
        total,
        userId: (session?.user as { id?: string } | undefined)?.id ?? null,
        items: { create: parsed.data.items.map((i) => ({ productId: i.id, name: i.name, price: i.price, quantity: i.quantity, color: i.color ?? null, size: i.size ?? null, image: i.image ?? null })) },
      },
      include: { items: true },
    });

    for (const i of parsed.data.items) {
      await prisma.$executeRaw`UPDATE Product SET stock = MAX(0, stock - ${i.quantity}) WHERE id = ${i.id}`;
    }

    if (promoApplied) {
      await prisma.promoCode.update({ where: { code: promoApplied }, data: { usedCount: { increment: 1 } } });
    }

    return Response.json({ ok: true, order });
  } catch (e) {
    return Response.json({ error: "Erreur serveur, réessayez." }, { status: 500 });
  }
}