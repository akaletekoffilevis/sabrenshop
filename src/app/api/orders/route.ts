import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { validatePromo } from "@/lib/promo";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const itemSchema = z.object({
  id: z.string().min(1, "Article invalide"),
  quantity: z.number().int().min(1, "Quantité invalide").max(99, "Quantité trop grande"),
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

class OrderValidationError extends Error {}

export async function POST(req: Request) {
  const session = await auth();
  const parsed = orderSchema.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });

  const year = new Date().getFullYear();

  try {
    const order = await prisma.$transaction(async (tx) => {
      const ids = [...new Set(parsed.data.items.map((i) => i.id))];

      let products = await tx.product.findMany({ where: { id: { in: ids } } });
      if (products.length < ids.length) {
        const missing = ids.filter((id) => !products.some((p) => p.id === id));
        const bySlug = await tx.product.findMany({ where: { slug: { in: missing } } });
        products = [...products, ...bySlug];
      }

      const qtyByProduct = new Map<string, number>();
      const orderItems: Array<{
        productId: string;
        name: string;
        price: number;
        quantity: number;
        color: string | null;
        size: string | null;
        image: string | null;
      }> = [];

      for (const line of parsed.data.items) {
        const product = products.find((p) => p.id === line.id || p.slug === line.id);
        if (!product || !product.isActive) {
          throw new OrderValidationError("Certains articles de votre panier ne sont plus disponibles. Vérifiez votre panier.");
        }
        if (product.stock < line.quantity) {
          throw new OrderValidationError(`Stock insuffisant pour "${product.name}".`);
        }
        qtyByProduct.set(product.id, (qtyByProduct.get(product.id) ?? 0) + line.quantity);
        orderItems.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: line.quantity,
          color: line.color ?? null,
          size: line.size ?? null,
          image: line.image ?? null,
        });
      }

      for (const [productId, qty] of qtyByProduct) {
        const product = products.find((p) => p.id === productId);
        if (product && product.stock < qty) {
          throw new OrderValidationError(`Stock insuffisant pour "${product.name}".`);
        }
      }

      const subTotal = orderItems.reduce((a, i) => a + i.price * i.quantity, 0);

      const settings = await tx.settings.findUnique({ where: { id: "default" } });
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

      const orderData = {
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
        items: { create: orderItems },
      };

      let order: Awaited<ReturnType<typeof tx.order.create>> | null = null;
      for (let attempt = 0; attempt < 5; attempt++) {
        const count = await tx.order.count();
        const orderNumber = `SAB-${year}-${String(count + 1).padStart(4, "0")}`;
        try {
          order = await tx.order.create({ data: { ...orderData, orderNumber }, include: { items: true } });
          break;
        } catch (e) {
          if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002" && attempt < 4) continue;
          throw e;
        }
      }
      if (!order) throw new Error("Impossible de générer un numéro de commande.");

      for (const [productId, qty] of qtyByProduct) {
        const result = await tx.product.updateMany({
          where: { id: productId, stock: { gte: qty } },
          data: { stock: { decrement: qty } },
        });
        if (result.count === 0) {
          throw new OrderValidationError("Le stock n'a pas pu être réservé. Réessayez.");
        }
      }

      if (promoApplied) {
        await tx.promoCode.update({ where: { code: promoApplied }, data: { usedCount: { increment: 1 } } });
      }

      return order;
    });

    return Response.json({ ok: true, order });
  } catch (e) {
    if (e instanceof OrderValidationError) {
      return Response.json({ error: e.message }, { status: 409 });
    }
    console.error("[orders] create failed:", e);
    return Response.json({ error: "Erreur serveur, réessayez." }, { status: 500 });
  }
}