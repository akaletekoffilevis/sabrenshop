import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ids = (url.searchParams.get("ids") || "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 100);
  if (!ids.length) return Response.json({ products: [] });
  const products = await prisma.product.findMany({ where: { id: { in: ids }, isActive: true } });
  const byId = new Map(products.map((p) => [p.id, p]));
  const ordered = ids.map((id) => byId.get(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  return Response.json({ products: ordered });
}