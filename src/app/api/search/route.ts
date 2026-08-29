import { prisma } from "@/lib/prisma";

function firstImage(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr[0] ?? null : null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim();
  if (q.length < 2) return Response.json({ results: [] });

  try {
    const select = { slug: true, name: true, price: true, images: true, stock: true };
    const [byDb, byHead] = await Promise.all([
      prisma.product.findMany({ where: { isActive: true, name: { contains: q } }, take: 6, orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }], select }),
      prisma.product.findMany({ where: { isActive: true }, take: 60, orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }], select }),
    ]);

    const needle = q.toLowerCase();
    const head = byHead.filter((p) => p.name.toLowerCase().includes(needle));
    const seen = new Set<string>();
    const merged = [...byDb, ...head].filter((p) => (seen.has(p.slug) ? false : (seen.add(p.slug), true)));

    const results = merged.slice(0, 8).map((p) => ({ slug: p.slug, name: p.name, price: p.price, stock: p.stock, image: firstImage(p.images) }));
    return Response.json({ results });
  } catch (err) {
    console.error("[search] erreur :", err);
    return Response.json({ results: [] });
  }
}