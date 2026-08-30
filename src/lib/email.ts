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
  body { margin:0; padding:0; background:#f5f0e6; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; }
  .wrap { max-width:600px; margin:0 auto; background:#ffffff; border-radius:18px; overflow:hidden; border:1px solid #e9e1cf; }
  .hero-strip { height:6px; background:linear-gradient(90deg,#D4AF37,#f2d489,#D4AF37); }
  .hero { background:#111111; padding:26px 24px 22px; text-align:center; }
  .logochip { width:62px; height:62px; margin:0 auto 10px; background:#ffffff; border-radius:16px; padding:5px; }
  img.logo { width:100%; height:100%; object-fit:cover; border-radius:12px; display:block; }
  .brand { color:#D4AF37; font-size:24px; font-weight:900; letter-spacing:0.09em; line-height:1.1; }
  .brand-sub { color:#e9e2d0; font-size:11px; font-weight:700; letter-spacing:0.24em; text-transform:uppercase; margin-top:6px; }
  .body { padding:26px 28px; color:#2b2b2b; font-size:15px; line-height:1.65; }
  h1.t { color:#111111; font-size:20px; font-weight:800; margin:0 0 12px; }
  h3.h { color:#111111; font-weight:800; margin:20px 0 10px; font-size:15px; }
  .btn { display:inline-block; background:#D4AF37; color:#111111; font-weight:800; text-decoration:none; padding:12px 26px; border-radius:999px; margin:14px 0 4px; box-shadow:0 2px 8px rgba(0,0,0,0.14); }
  .btn.dark { background:#111111; color:#ffffff; }
  .card { border:1px solid #efe6d0; border-radius:16px; padding:14px; margin-bottom:14px; }
  .muted { color:#8a8578; font-size:12.5px; }
  img.thumb { width:100%; max-height:320px; object-fit:cover; border-radius:14px; display:block; }
  ul { margin:8px 0; padding-left:20px; } li { margin:4px 0; }
  .usp { margin:16px 0 0; text-align:center; font-size:12px; color:#7a7468; line-height:1.8; }
  .usp .dot { color:#D4AF37; font-weight:900; }
  .foot { background:#111111; color:#9c968a; padding:22px 24px; text-align:center; font-size:12px; line-height:1.9; }
  .foot .fb { color:#D4AF37; font-weight:800; letter-spacing:0.08em; font-size:15px; }
  .foot a { color:#c9c4b8; text-decoration:none; }
  .madeby { border-top:1px solid #2a2a2a; margin-top:14px; padding-top:12px; color:#c9c4b8; font-size:11px; font-weight:700; letter-spacing:0.06em; }
`;

export function wrapMail(title: string, bodyHtml: string): string {
  const url = appUrl();
  return `<!doctype html><html lang="fr"><body>
    <div class="wrap">
      <div class="hero-strip"></div>
      <div class="hero">
        <div class="logochip"><img class="logo" src="${url}/logosabrenshop.jpeg" alt="Logo SABREEN’SHOP" width="62" height="62" /></div>
        <div class="brand">SABREEN’SHOP</div>
        <div class="brand-sub">Style &amp; tendances au Niger</div>
      </div>
      <div class="body">
        <h1 class="t">${title}</h1>
        ${bodyHtml}
        <div class="usp">
          <span>Livraison partout au Niger <span class="dot">·</span> Paiement à la livraison <span class="dot">·</span> Commande 100 % via WhatsApp</span>
        </div>
      </div>
      <div class="foot">
        <div class="fb">SABREEN’SHOP</div>
        <div>Commande rapide sur WhatsApp : +227 89 14 84 54<br /><a href="${url}">${url.replace(/^https?:\/\//, "")}</a></div>
        <div class="madeby">Fait par OptiGrowth</div>
      </div>
    </div>
    <style>${baseStyles}</style>
  </body></html>`;
}

export function productNewsletterHtml({ name, price, image, slug }: { name: string; price: string; image?: string | null; slug: string }): string {
  const url = `${appUrl()}/produit/${slug}`;
  return wrapMail(
    "Nouveauté",
    `
    <p>Bonjour,</p>
    <p><strong>${name}</strong> vient d'arriver dans la boutique !</p>
    ${image ? `<p><img class="thumb" src="${image}" alt="${name}" /></p>` : ""}
    <p>Prix : <strong style="font-size:18px;color:#a87f1f;">${price}</strong></p>
    <p><a class="btn" href="${url}">Voir le produit</a></p>
    <p class="muted">Livraison partout au Niger · Commande 100 % via WhatsApp.</p>
    `
  );
}

export function welcomeEmailHtml({ name, shopName }: { name?: string | null; shopName: string }): string {
  return wrapMail(
    "Bienvenue 👋",
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
      <div class="card" style="display:flex;gap:14px;align-items:center;">
        ${p.image ? `<img src="${p.image}" alt="${p.name}" style="width:84px;height:84px;object-fit:cover;border-radius:12px;flex-shrink:0;" />` : `<div style="width:84px;height:84px;background:#f5f0e6;border-radius:12px;flex-shrink:0;"></div>`}
        <div style="flex:1;min-width:0;">
          <p style="margin:0;font-weight:800;color:#111;">${p.name}</p>
          <p style="margin:6px 0 0;font-size:17px;font-weight:800;color:#a87f1f;">${p.price}</p>
          <a class="btn" style="margin:10px 0 0;font-size:13px;padding:9px 16px;" href="${appUrl()}/produit/${p.slug}">Voir le produit</a>
        </div>
      </div>`
    )
    .join("");

  const promoChips = promos
    .map((p) => `<span style="display:inline-block;background:#111;color:#f2d489;font-weight:800;padding:8px 14px;border-radius:999px;margin:4px 4px 0 0;">${p.code} — ${p.valueLabel}</span>`)
    .join("");

  const hasProducts = products.length > 0;
  const hasPromos = promos.length > 0;

  return wrapMail(
    "Vos nouveautés du jour",
    `
    <p>Bonjour,</p>
    <p>Voici ce qui est arrivé chez ${shopName} :</p>
    ${hasProducts ? `<h3 class="h">🛍️ Nouveaux produits</h3>${productCards}` : ""}
    ${hasPromos ? `<h3 class="h" style="margin-top:${hasProducts ? "10px" : "20px"};">🎁 Codes promo actifs</h3><p>${promoChips}</p>` : ""}
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