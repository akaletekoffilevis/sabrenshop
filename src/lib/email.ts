import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;

export function mailConfigured() {
  return Boolean(SMTP_USER && SMTP_PASS);
}

export function appUrl() {
  return (process.env.NEXT_PUBLIC_BASE_URL || "https://sabrenshop-test-app.vercel.app").replace(/\/$/, "");
}

export async function sendMail({ to, subject, html }: { to: string | string[]; subject: string; html: string }): Promise<boolean> {
  if (!mailConfigured()) {
    console.warn("[email] SMTP_USER/SMTP_PASS absents — email non envoyé:", subject, to);
    return false;
  }
  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    const recipients = Array.isArray(to) ? to : [to];
    await transport.sendMail({
      from: SMTP_FROM || SMTP_USER,
      to: recipients,
      subject,
      html,
    });
    return true;
  } catch (e) {
    console.error("[email] envoi échoué:", e);
    return false;
  }
}

const baseStyles = `
  body { margin:0; padding:0; background:#f5f0e6; font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif; }
  .wrap { max-width:560px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; }
  .head { background:#111111; color:#fbbf24; padding:24px; text-align:center; font-size:20px; font-weight:800; letter-spacing:0.06em; }
  .body { padding:28px; color:#2b2b2b; font-size:15px; line-height:1.6; }
  .btn { display:inline-block; background:#fbbf24; color:#111111; font-weight:800; text-decoration:none; padding:12px 22px; border-radius:999px; margin:12px 0; }
  .muted { color:#7a7a7a; font-size:13px; }
  img.thumb { width:100%; max-height:280px; object-fit:cover; border-radius:12px; }
`;

export function wrapMail(title: string, bodyHtml: string): string {
  return `<!doctype html><html><body>
    <div class="wrap">
      <div class="head">${title}</div>
      <div class="body">${bodyHtml}</div>
    </div>
    <style>${baseStyles}</style>
  </body></html>`;
}

export function productNewsletterHtml({ name, price, image, slug }: { name: string; price: string; image?: string | null; slug: string }): string {
  const url = `${appUrl()}/produit/${slug}`;
  return wrapMail(
    "Nouveauté chez SABREEN’SHOP",
    `
    <p>Bonjour,</p>
    <p><strong>${name}</strong> vient d'arriver dans la boutique !</p>
    ${image ? `<p><img class="thumb" src="${image}" alt="${name}" /></p>` : ""}
    <p>Prix : <strong style="font-size:18px">${price}</strong></p>
    <p><a class="btn" href="${url}">Voir le produit</a></p>
    <p class="muted">Livraison partout au Niger · Commande 100 % via WhatsApp.</p>
    `
  );
}

export function welcomeEmailHtml({ name, shopName }: { name?: string | null; shopName: string }): string {
  return wrapMail(
    "Bienvenue chez SABREEN’SHOP 👋",
    `
    <p>Bonjour ${name || "et bienvenue"},</p>
    <p>Votre compte <strong>${shopName}</strong> a bien été créé. Vous pouvez dès maintenant :</p>
    <ul>
      <li>retrouver vos favoris et <a href="${appUrl()}/compte">gérer votre espace client</a>,</li>
      <li>être alerté(e) des nouveautés et des promos grâce à la newsletter.</li>
    </ul>
    <p><a class="btn" href="${appUrl()}/boutique">Découvrir la boutique</a></p>
    <p class="muted">Livraison partout au Niger · Commande 100 % via WhatsApp.</p>
    `
  );
}

export function digestEmailHtml({ products, promos, shopName }: { products: DigestProduct[]; promos: DigestPromo[]; shopName: string }): string {
  const productCards = products
    .map(
      (p) => `
      <div style="border:1px solid #eee;border-radius:14px;padding:14px;margin-bottom:14px;display:flex;gap:14px;align-items:center;">
        ${p.image ? `<img src="${p.image}" alt="${p.name}" style="width:84px;height:84px;object-fit:cover;border-radius:12px;" />` : `<div style="width:84px;height:84px;background:#f5f0e6;border-radius:12px;flex-shrink:0;"></div>`}
        <div style="flex:1;min-width:0;">
          <p style="margin:0;font-weight:800;color:#111;">${p.name}</p>
          <p style="margin:6px 0 0;font-size:17px;font-weight:800;color:#111;">${p.price}</p>
          <a class="btn" style="margin:10px 0 0;font-size:13px;padding:9px 16px;" href="${appUrl()}/produit/${p.slug}">Voir le produit</a>
        </div>
      </div>`
    )
    .join("");

  const promoChips = promos
    .map((p) => `<span style="display:inline-block;background:#111;color:#fbbf24;font-weight:800;padding:8px 14px;border-radius:999px;margin:4px 4px 0 0;">${p.code} — ${p.valueLabel}</span>`)
    .join("");

  const hasProducts = products.length > 0;
  const hasPromos = promos.length > 0;

  return wrapMail(
    "Vos nouveautés du jour — SABREEN’SHOP",
    `
    <p>Bonjour,</p>
    <p>Voici ce qui est arrivé chez ${shopName} :</p>
    ${hasProducts ? `<h3 style="margin:18px 0 8px;">🛍️ Nouveaux produits</h3>${productCards}` : ""}
    ${hasPromos ? `<h3 style="margin:${hasProducts ? "10px" : "18px"} 0 8px;">🎁 Codes promo actifs</h3><p>${promoChips}</p>` : ""}
    <p style="margin-top:20px;"><a class="btn" href="${appUrl()}/boutique">Voir tout dans la boutique</a></p>
    <p class="muted">Recevez cet email une seule fois par jour. Vous pouvez vous désabonner à tout moment.</p>
    `
  );
}

type DigestProduct = { name: string; slug: string; price: string; image?: string | null };
type DigestPromo = { code: string; valueLabel: string };

export function passwordResetHtml({ link, shopName }: { link: string; shopName: string }): string {
  return wrapMail(
    "Réinitialisation de votre mot de passe",
    `
    <p>Bonjour,</p>
    <p>Vous avez demandé la réinitialisation de votre mot de passe <strong>${shopName}</strong>.</p>
    <p>Ce lien est valable <strong>1 heure</strong> :</p>
    <p><a class="btn" href="${link}">Réinitialiser mon mot de passe</a></p>
    <p class="muted">Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.</p>
    `
  );
}