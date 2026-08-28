const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || "Sabreen’Shop <onboarding@resend.dev>";

export function appUrl() {
  return (process.env.NEXT_PUBLIC_BASE_URL || "https://sabrenshop-test-app.vercel.app").replace(/\/$/, "");
}

export async function sendMail({ to, subject, html }: { to: string | string[]; subject: string; html: string }): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY absent — email non envoyé:", subject, to);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: RESEND_FROM, to: Array.isArray(to) ? to : [to], subject, html }),
    });
    if (!res.ok) console.error("[email] envoi échoué:", res.status, await res.text());
    return res.ok;
  } catch (e) {
    console.error("[email] erreur réseau:", e);
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
    <p class="muted">Livraison partout au Niger · Paiement à la livraison sur WhatsApp.</p>
    `
  );
}

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