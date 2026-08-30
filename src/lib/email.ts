import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;

export const SITE_URL = "https://sabreenshop.vercel.app";

export function mailConfigured() {
  return Boolean(SMTP_USER && SMTP_PASS);
}

export function appUrl() {
  return (process.env.NEXT_PUBLIC_BASE_URL || SITE_URL).replace(/\/$/, "");
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

// Styles 100 % inline : indispensables pour Gmail / Outlook / Apple Mail (qui ignorent <style>).
const S = {
  body: "margin:0;padding:0;background:#f5f0e6;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;",
  wrap: "max-width:600px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e9e1cf;",
  strip: "height:6px;background:linear-gradient(90deg,#D4AF37,#f2d489,#D4AF37);",
  hero: "background:#111111;padding:26px 24px 22px;text-align:center;",
  logoBox: "width:62px;height:62px;margin:0 auto 10px;background:#ffffff;border-radius:16px;padding:5px;",
  logo: "width:52px;height:52px;object-fit:cover;border-radius:12px;display:block;margin:0 auto;",
  brand: "color:#D4AF37;font-size:24px;font-weight:900;letter-spacing:0.09em;line-height:1.1;margin:0;",
  tagline: "color:#e9e2d0;font-size:11px;font-weight:700;letter-spacing:0.24em;text-transform:uppercase;margin:6px 0 0;",
  panel: "padding:26px 28px;color:#2b2b2b;font-size:15px;line-height:1.65;",
  title: "color:#111111;font-size:20px;font-weight:800;margin:0 0 12px;",
  p: "margin:0 0 12px;",
  h3: "color:#111111;font-weight:800;margin:18px 0 10px;font-size:15px;",
  btn: "display:inline-block;background:#D4AF37;color:#111111;font-weight:800;text-decoration:none;padding:12px 26px;border-radius:999px;margin:14px 0 4px;",
  muted: "color:#8a8578;font-size:12.5px;line-height:1.5;",
  thumb: "width:100%;max-height:320px;object-fit:cover;border-radius:14px;display:block;",
  link: "color:#a87f1f;font-weight:700;",
  ul: "margin:8px 0 12px;padding-left:20px;",
  li: "margin:4px 0;",
  usp: "margin:18px 0 0;padding-top:14px;border-top:1px solid #f0e9d8;text-align:center;font-size:12px;color:#7a7468;line-height:1.8;",
  uspDot: "color:#D4AF37;font-weight:900;",
  foot: "background:#111111;color:#9c968a;padding:22px 24px;text-align:center;font-size:12px;line-height:1.9;",
  footBrand: "color:#D4AF37;font-weight:800;letter-spacing:0.08em;font-size:15px;",
  footLink: "color:#c9c4b8;text-decoration:none;",
  madeby: "border-top:1px solid #2a2a2a;margin-top:14px;padding-top:12px;color:#c9c4b8;font-size:11px;font-weight:700;letter-spacing:0.06em;",
  card: "border:1px solid #efe6d0;border-radius:16px;padding:14px;margin-bottom:14px;display:flex;gap:14px;align-items:center;",
  chip: "display:inline-block;background:#111;color:#f2d489;font-weight:800;padding:8px 14px;border-radius:999px;margin:4px 4px 0 0;",
};

export function wrapMail(title: string, bodyHtml: string): string {
  const url = appUrl();
  return `<!doctype html><html lang="fr"><body style="${S.body}">
    <div style="${S.wrap}">
      <div style="${S.strip}"></div>
      <div style="${S.hero}">
        <div style="${S.logoBox}"><img src="${url}/logosabrenshop.jpeg" alt="Logo SABREEN’SHOP" width="52" height="52" style="${S.logo}" /></div>
        <div style="${S.brand}">SABREEN’SHOP</div>
        <div style="${S.tagline}">Style &amp; tendances au Niger</div>
      </div>
      <div style="${S.panel}">
        <h1 style="${S.title}">${title}</h1>
        ${bodyHtml}
        <div style="${S.usp}">
          Livraison partout au Niger <span style="${S.uspDot}">·</span> Paiement à la livraison <span style="${S.uspDot}">·</span> Commande 100&nbsp;% via WhatsApp
        </div>
      </div>
      <div style="${S.foot}">
        <div style="${S.footBrand}">SABREEN’SHOP</div>
        <div>Commande rapide sur WhatsApp : +227 89 14 84 54<br /><a href="${url}" style="${S.footLink}">${url.replace(/^https?:\/\//, "")}</a></div>
        <div style="${S.madeby}">Fait par OptiGrowth</div>
      </div>
    </div>
  </body></html>`;
}

export function productNewsletterHtml({ name, price, image, slug }: { name: string; price: string; image?: string | null; slug: string }): string {
  const url = `${appUrl()}/produit/${slug}`;
  return wrapMail(
    "Nouveauté",
    `
    <p style="${S.p}">Bonjour,</p>
    <p style="${S.p}"><strong>${name}</strong> vient d'arriver dans la boutique !</p>
    ${image ? `<p style="${S.p}"><img src="${image}" alt="${name}" style="${S.thumb}" /></p>` : ""}
    <p style="${S.p}">Prix : <strong style="font-size:18px;color:#a87f1f;">${price}</strong></p>
    <p style="${S.p}"><a href="${url}" style="${S.btn}">Voir le produit</a></p>
    <p style="${S.p}${S.muted}">Livraison partout au Niger · Commande 100 % via WhatsApp.</p>
    `
  );
}

export function welcomeEmailHtml({ name, shopName }: { name?: string | null; shopName: string }): string {
  return wrapMail(
    "Bienvenue 👋",
    `
    <p style="${S.p}">Bonjour ${name || "et bienvenue"},</p>
    <p style="${S.p}">Votre compte <strong>${shopName}</strong> a bien été créé. Vous pouvez dès maintenant :</p>
    <ul style="${S.ul}">
      <li style="${S.li}">retrouver vos favoris et <a href="${appUrl()}/compte" style="${S.link}">gérer votre espace client</a>,</li>
      <li style="${S.li}">être alerté(e) des nouveautés et des promos grâce à la newsletter.</li>
    </ul>
    <p style="${S.p}"><a href="${appUrl()}/boutique" style="${S.btn}">Découvrir la boutique</a></p>
    <p style="${S.p}${S.muted}">Livraison partout au Niger · Commande 100 % via WhatsApp.</p>
    `
  );
}

export function digestEmailHtml({ products, promos, shopName }: { products: DigestProduct[]; promos: DigestPromo[]; shopName: string }): string {
  const productCards = products
    .map(
      (p) => `
      <div style="${S.card}">
        ${p.image ? `<img src="${p.image}" alt="${p.name}" style="width:84px;height:84px;object-fit:cover;border-radius:12px;flex-shrink:0;" />` : `<div style="width:84px;height:84px;background:#f5f0e6;border-radius:12px;flex-shrink:0;"></div>`}
        <div style="flex:1;min-width:0;">
          <p style="margin:0;font-weight:800;color:#111;">${p.name}</p>
          <p style="margin:6px 0 0;font-size:17px;font-weight:800;color:#a87f1f;">${p.price}</p>
          <a href="${appUrl()}/produit/${p.slug}" style="${S.btn};margin:10px 0 0;font-size:13px;padding:9px 16px;">Voir le produit</a>
        </div>
      </div>`
    )
    .join("");

  const promoChips = promos.map((p) => `<span style="${S.chip}">${p.code} — ${p.valueLabel}</span>`).join("");

  const hasProducts = products.length > 0;
  const hasPromos = promos.length > 0;

  return wrapMail(
    "Vos nouveautés du jour",
    `
    <p style="${S.p}">Bonjour,</p>
    <p style="${S.p}">Voici ce qui est arrivé chez ${shopName} :</p>
    ${hasProducts ? `<h3 style="${S.h3}">🛍️ Nouveaux produits</h3>${productCards}` : ""}
    ${hasPromos ? `<h3 style="${S.h3};margin-top:${hasProducts ? "10px" : "18px"};">🎁 Codes promo actifs</h3><p style="${S.p}">${promoChips}</p>` : ""}
    <p style="${S.p}"><a href="${appUrl()}/boutique" style="${S.btn}">Voir tout dans la boutique</a></p>
    <p style="${S.p}${S.muted}">Recevez cet email une seule fois par jour. Vous pouvez vous désabonner à tout moment.</p>
    `
  );
}

type DigestProduct = { name: string; slug: string; price: string; image?: string | null };
type DigestPromo = { code: string; valueLabel: string };

export function passwordResetHtml({ link, shopName }: { link: string; shopName: string }): string {
  return wrapMail(
    "Réinitialisation de votre mot de passe",
    `
    <p style="${S.p}">Bonjour,</p>
    <p style="${S.p}">Vous avez demandé la réinitialisation de votre mot de passe <strong>${shopName}</strong>.</p>
    <p style="${S.p}">Ce lien est valable <strong>1 heure</strong> :</p>
    <p style="${S.p}"><a href="${link}" style="${S.btn}">Réinitialiser mon mot de passe</a></p>
    <p style="${S.p}${S.muted}">Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.</p>
    `
  );
}