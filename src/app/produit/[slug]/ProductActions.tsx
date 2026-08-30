"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { whatsappLink, whatsappShareLink, productWhatsappMessage } from "@/lib/whatsapp";
import { useShopConfig } from "@/lib/useShopConfig";
import { ShoppingBag, Zap, MessageCircle, Check, Minus, Plus, Share2 } from "lucide-react";

export function ProductActions({ product }: { product: any }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(product.colors?.[0] || "");
  const [size, setSize] = useState(product.sizes?.[0] || "");
  const [added, setAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const { whatsapp } = useShopConfig();

  const handleAdd = () => {
    addItem({ id: product.id || product.slug, slug: product.slug, name: product.name, price: product.price, compareAtPrice: product.compareAtPrice, image: product.images?.[0], quantity: qty, color, size });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    handleAdd();
    router.push("/panier");
  };

  const disabled = product.inStock === false;
  const waLink = whatsappLink(productWhatsappMessage({ name: product.name, price: product.price, quantity: qty, color, size }), whatsapp);

  const shareToWhatsapp = async () => {
    const url = `${window.location.origin}/produit/${product.slug}`;
    const msg = `Bonjour, je partage avec vous ce produit :\n*${product.name}* — ${product.price.toLocaleString("fr-FR")} FCFA\n${url}\nDisponible chez SABREEN’SHOP !`;
    const image = (product.images?.[0] as string | undefined) || null;

    if (image && typeof navigator.share === "function" && typeof navigator.canShare === "function") {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 8000);
        const res = await fetch(image);
        clearTimeout(timer);
        if (res.ok) {
          const blob = await res.blob();
          const ext = (image.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
          const file = new File([blob], `sabrenshop-${product.slug}.${ext}`, { type: blob.type || "image/jpeg" });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], text: msg, url });
            return;
          }
        }
      } catch (err) {
        if (err instanceof DOMException && (err.name === "AbortError" || err.name === "SecurityError")) return;
      }
    }

    window.open(whatsappShareLink(msg), "_blank");
  };

  return (
    <div className="mt-5 space-y-4">
      {product.colors?.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-sabren-black/50 mb-1.5">Couleur : <span className="text-sabren-black">{color}</span></p>
          <div className="flex flex-wrap gap-2">{product.colors.map((c: string) => (
            <button key={c} onClick={() => setColor(c)} className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${color === c ? "bg-sabren-black text-white border-sabren-black" : "bg-white border-sabren-gray hover:border-sabren-gold"}`}>{c}</button>
          ))}</div>
        </div>
      )}
      {product.sizes?.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-sabren-black/50 mb-1.5">Taille : <span className="text-sabren-black">{size}</span></p>
          <div className="flex flex-wrap gap-2">{product.sizes.map((s: string) => (
            <button key={s} onClick={() => setSize(s)} className={`min-w-11 px-3 py-2 rounded-full border text-sm font-semibold transition ${size === s ? "bg-sabren-black text-white border-sabren-black" : "bg-white border-sabren-gray hover:border-sabren-gold"}`}>{s}</button>
          ))}</div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-wide text-sabren-black/50">Quantité</span>
        <div className="flex items-center border border-sabren-gray rounded-full overflow-hidden bg-white">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2.5 hover:bg-sabren-gray transition" aria-label="Diminuer"><Minus className="w-4 h-4" /></button>
          <span className="px-4 text-sm font-bold">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="p-2.5 hover:bg-sabren-gray transition" aria-label="Augmenter"><Plus className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="grid gap-2.5">
        <button
          onClick={handleAdd}
          disabled={disabled}
          className={`inline-flex items-center justify-center gap-2 rounded-full py-3.5 font-bold text-sm transition ${added ? "bg-whatsapp text-white" : "bg-sabren-black text-white hover:bg-black"} disabled:opacity-50`}
        >
          {added ? <><Check className="w-4 h-4" /> Ajouté au panier</> : <><ShoppingBag className="w-4 h-4" /> AJOUTER AU PANIER</>}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={disabled}
          className={`inline-flex items-center justify-center gap-2 rounded-full py-3.5 font-bold text-sm bg-sabren-gold text-sabren-black hover:bg-sabren-gold-hover transition shadow-gold ${disabled ? "pointer-events-none opacity-50" : ""}`}
        >
          <Zap className="w-4 h-4" /> ACHETER MAINTENANT
        </button>
        <a
          href={waLink}
          target="_blank"
          className={`inline-flex items-center justify-center gap-2 rounded-full py-3.5 font-bold text-sm bg-whatsapp text-white hover:bg-whatsapp-dark transition ${disabled ? "pointer-events-none opacity-50" : ""}`}
        >
          <MessageCircle className="w-4 h-4" /> COMMANDER SUR WHATSAPP
        </a>
        <button
          onClick={shareToWhatsapp}
          className="inline-flex items-center justify-center gap-2 rounded-full py-3 font-bold text-sm bg-white border-2 border-sabren-black/15 text-sabren-black hover:bg-sabren-black hover:text-white hover:border-sabren-black transition shadow-card"
        >
          <Share2 className="w-4 h-4" /> Partager sur WhatsApp
        </button>
      </div>
      <p className="text-center text-xs text-sabren-black/45">Paiement à la livraison possible, sans avance.</p>
    </div>
  );
}