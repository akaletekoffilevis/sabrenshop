import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function guard() {
  const session = await auth();
  return session?.user && (session.user as { role?: string }).role === "ADMIN";
}

type Ctx = { params: Promise<{ id: string }> };

async function recomputeRating(productId: string) {
  const reviews = await prisma.review.findMany({ where: { productId, isApproved: true }, select: { rating: true } });
  const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
  await prisma.product.update({ where: { id: productId }, data: { rating: Math.round(avg * 10) / 10 } });
}

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await guard())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const { isApproved } = await req.json().catch(() => ({ isApproved: false }));

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) return Response.json({ error: "Avis introuvable" }, { status: 404 });

  await prisma.review.update({ where: { id }, data: { isApproved: Boolean(isApproved) } });
  await recomputeRating(review.productId);
  return Response.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await guard())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) return Response.json({ error: "Avis introuvable" }, { status: 404 });
  await prisma.review.delete({ where: { id } });
  await recomputeRating(review.productId);
  return Response.json({ ok: true });
}