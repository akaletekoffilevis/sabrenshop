import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  orderNumber: z.string().min(1, "Entrez votre numéro de commande"),
  phone: z.string().min(6, "Entrez le téléphone utilisé à la commande"),
});

const norm = (s: string) => s.replace(/[\s.\-]/g, "");

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });

  const code = parsed.data.orderNumber.trim().toUpperCase();
  const phone = norm(parsed.data.phone);

  const orders = await prisma.order.findMany({
    where: { orderNumber: code },
    include: { items: true },
    take: 5,
  });

  const match = orders.find((o) => norm(o.phone) === phone) ?? orders[0];
  if (!match) return Response.json({ error: "Aucune commande trouvée avec ce numéro. Vérifiez que le téléphone correspond à celui utilisé lors de la commande." }, { status: 404 });

  return Response.json({
    order: {
      orderNumber: match.orderNumber,
      status: match.status,
      paymentMethod: match.paymentMethod,
      isPickup: match.isPickup,
      deliveryFee: match.deliveryFee,
      total: match.total,
      customerName: match.customerName,
      createdAt: match.createdAt.toISOString(),
      address: match.address,
      quartier: match.quartier,
      ville: match.ville,
      items: match.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
    },
  });
}