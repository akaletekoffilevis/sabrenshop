import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

type Db = Prisma.TransactionClient | typeof prisma;

export async function recomputeRating(productId: string, db: Db = prisma) {
  const reviews = await db.review.findMany({ where: { productId, isApproved: true }, select: { rating: true } });
  const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
  await db.product.update({ where: { id: productId }, data: { rating: Math.round(avg * 10) / 10 } });
}