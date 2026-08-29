import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

type RateLimitOptions = { key: string; limit: number; seconds: number };

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;
if (redisUrl && redisToken) {
  redis = new Redis({ url: redisUrl, token: redisToken });
}

const clients = new Map<string, Ratelimit>();

function getRatelimit(key: string, limit: number, seconds: number): Ratelimit | null {
  if (!redis) return null;
  const id = `${key}:${limit}:${seconds}`;
  let rl = clients.get(id);
  if (!rl) {
    rl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${seconds} s`),
      prefix: `sabren:${key}`,
    });
    clients.set(id, rl);
  }
  return rl;
}

const buckets = new Map<string, number[]>();

export async function rateLimit(req: Request, { key, limit, seconds }: RateLimitOptions): Promise<Response | null> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local";
  const bucketKey = `${key}:${ip}`;

  const rl = getRatelimit(key, limit, seconds);
  if (rl) {
    try {
      const res = await rl.limit(bucketKey);
      if (!res.success) {
        return Response.json({ error: "Trop de requêtes. Réessayez plus tard." }, { status: 429 });
      }
      return null;
    } catch {
      return null;
    }
  }

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