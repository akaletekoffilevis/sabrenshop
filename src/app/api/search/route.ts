import { prisma } from "@/lib/prisma";

function firstImage(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr[0] ?? null;
  } catch {
    return null;
  }
  return null;
}

export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim();
  if (q.length < 2) return Response.json({ results: [] });

  try {
    const found = await prisma.product.findMany({
      where: { isActive: true, name: { contains: q } },
      take: 6,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      select: { slug: true, name: true, price: true, images: true, stock: true },
    });
    const results = found.map((p) => ({ slug: p.slug, name: p.name, price: p.price, stock: p.stock, image: firstImage(p.images) }));
    return Response.json({ results });
  } catch (err) {
    console.error("[search] erreur :", err);
    return Response.json({ results: [] });
  }
}