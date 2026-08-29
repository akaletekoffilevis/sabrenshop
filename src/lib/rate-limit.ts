const buckets = new Map<string, number[]>();

type RateLimitOptions = { key: string; limit: number; seconds: number };

export async function rateLimit(req: Request, { key, limit, seconds }: RateLimitOptions): Promise<Response | null> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local";
  const bucketKey = `${key}:${ip}`;
  const now = Date.now();
  const window = now - seconds * 1000;

  const hits = (buckets.get(bucketKey) ?? []).filter((t) => t > window);
  if (hits.length >= limit) {
    return Response.json({ error: "Trop de requêtes. Réessayez plus tard." }, { status: 429 });
  }
  hits.push(now);
  buckets.set(bucketKey, hits);

  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v[v.length - 1] < window) buckets.delete(k);
    }
  }
  return null;
}