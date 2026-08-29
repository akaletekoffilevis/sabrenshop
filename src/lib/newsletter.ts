import { prisma } from "./prisma";
import { sendMail, digestEmailHtml } from "./email";
import { formatPrice } from "./utils";

const DIGEST_ID = "singleton";
const SEND_CHUNK = 20;

export type DigestResult = { sent: boolean; recipients: number; products: number; promos: number };

let inflight: Promise<DigestResult> | null = null;

export function runNewsletterDigest(): Promise<DigestResult> {
  if (inflight) return inflight;
  inflight = runNewsletterDigestInner().finally(() => {
    inflight = null;
  });
  return inflight;
}

async function runNewsletterDigestInner(): Promise<DigestResult> {
  const now = new Date();
  const meta = await prisma.newsletterDigest.findUnique({ where: { id: DIGEST_ID } });

  // Premier lancement : on initialise le curseur sans spammer.
  if (!meta) {
    await prisma.newsletterDigest.create({ data: { id: DIGEST_ID, lastRunAt: now } });
    return { sent: false, recipients: 0, products: 0, promos: 0 };
  }

  const products = await prisma.product.findMany({
    where: { isActive: true, createdAt: { gt: meta.lastRunAt } },
    orderBy: { createdAt: "desc" },
    take: 12,
  });
  const promos = await prisma.promoCode.findMany({
    where: { createdAt: { gt: meta.lastRunAt } },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  if (products.length === 0 && promos.length === 0) {
    await prisma.newsletterDigest.update({ where: { id: DIGEST_ID }, data: { lastRunAt: now } });
    return { sent: false, recipients: 0, products: 0, promos: 0 };
  }

  const settings = await prisma.settings.findUnique({ where: { id: "default" } });
  const subscribers = await prisma.newsletterSubscriber.findMany({ where: { active: true }, select: { email: true } });

  let recipients = 0;
  if (subscribers.length > 0) {
    const subjects = `Vos nouveautés du jour — ${settings?.shopName || "SABREEN’SHOP"}`;
    const html = digestEmailHtml({
      shopName: settings?.shopName || "SABREEN’SHOP",
      products: products.map((p) => ({
        name: p.name,
        slug: p.slug,
        price: formatPrice(p.price),
        image: (Array.isArray(p.images) ? p.images[0] : undefined) as string | undefined,
      })),
      promos: promos.map((p) => ({
        code: p.code,
        valueLabel: p.type === "FIXED" ? formatPrice(p.value) : `${p.value}%`,
      })),
    });
    for (let i = 0; i < subscribers.length; i += SEND_CHUNK) {
      const chunk = subscribers.slice(i, i + SEND_CHUNK);
      const results = await Promise.allSettled(chunk.map((s) => sendMail({ to: s.email, subject: subjects, html })));
      recipients += results.filter((r) => r.status === "fulfilled" && r.value === true).length;
    }
  }

  await prisma.newsletterDigest.update({ where: { id: DIGEST_ID }, data: { lastRunAt: now } });
  return { sent: recipients > 0, recipients, products: products.length, promos: promos.length };
}