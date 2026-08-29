import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { recomputeRating } from "@/lib/reviews";
import { rateLimit } from "@/lib/rate-limit";
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

  const limited = await rateLimit(req, { key: "reviews", limit: 5, seconds: 3600 });
  if (limited) return limited;

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
  if (!product) return Response.json({ error: "Produit introuvable" }, { status: 404 });

  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  if (userId) {
    const existing = await prisma.review.findFirst({ where: { productId: parsed.data.productId, userId } });
    if (existing) return Response.json({ error: "Vous avez déjà donné votre avis sur ce produit." }, { status: 409 });
  }

  const review = await prisma.$transaction(async (tx) => {
    const r = await tx.review.create({
      data: {
        productId: parsed.data.productId,
        name: parsed.data.name,
        rating: parsed.data.rating,
        comment: parsed.data.comment || null,
        isApproved: true,
        userId,
      },
    });
    await recomputeRating(parsed.data.productId, tx);
    return r;
  });

  return Response.json({ ok: true, review: { ...review, isApproved: true } });
}