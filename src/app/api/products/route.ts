import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ids = (url.searchParams.get("ids") || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!ids.length) return Response.json({ products: [] });
  const products = await prisma.product.findMany({ where: { id: { in: ids }, isActive: true } });
  return Response.json({ products });
}