import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const reviewSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(2, "Votre nom est requis").max(60),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(1000).optional().default(""),
});

export async function POST(req: Request) {
  const session = await auth();
  const parsed = reviewSchema.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Avis invalide" }, { status: 400 });

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
  if (!product) return Response.json({ error: "Produit introuvable" }, { status: 404 });

  const review = await prisma.review.create({
    data: {
      productId: parsed.data.productId,
      name: parsed.data.name,
      rating: parsed.data.rating,
      comment: parsed.data.comment || null,
      userId: (session?.user as { id?: string } | undefined)?.id ?? null,
    },
  });

  return Response.json({ ok: true, review: { ...review, isApproved: false } });
}