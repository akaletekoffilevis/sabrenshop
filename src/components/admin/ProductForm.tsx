"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, inputCls, Btn, Toggle } from "./ui";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { slugify } from "@/lib/utils";
import { resizeImage } from "@/lib/image";

type Cat = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  images: string[];
  colors: string[];
  sizes: string[];
  categoryId?: string | null;
  isFeatured: boolean;
  isNew: boolean;
  isActive: boolean;
};

export function ProductForm({ product, categories }: { product?: Product | null; categories: Cat[] }) {
  const router = useRouter();
  const isEdit = Boolean(product);
  const [form, setForm] = useState<Omit<Product, "id">>({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price ?? 0,
    compareAtPrice: product?.compareAtPrice ?? null,
    stock: product?.stock ?? 10,
    images: product?.images ?? [],
    colors: product?.colors ?? [],
    sizes: product?.sizes ?? [],
    categoryId: product?.categoryId ?? "",
    isFeatured: product?.isFeatured ?? false,
    isNew: product?.isNew ?? true,
    isActive: product?.isActive ?? true,
  });
  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const [slugEdited, setSlugEdited] = useState(Boolean(product?.slug));

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const setName = (name: string) => {
    setForm((f) => ({ ...f, name, slug: slugEdited ? f.slug : slugify(name) }));
  };

  const addChip = (list: "colors" | "sizes") => {
    const v = (list === "colors" ? colorInput : sizeInput).trim();
    if (!v) return;
    const key = list === "colors" ? "colors" : "sizes";
    if (!form[key].includes(v)) set(key, [...form[key], v]);
    list === "colors" ? setColorInput("") : setSizeInput("");
  };

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", await resizeImage(file));
        fd.append("name", form.name.trim() || "produit");
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json().catch(() => null);
        if (res.ok && data?.url) {
          urls.push(data.url);
        } else {
          throw new Error(data?.error || "Upload impossible");
        }
      }
      if (urls.length > 0) setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'upload d'une image.");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      slug: form.slug.trim() || undefined,
      price: Number(form.price) || 0,
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      stock: Number(form.stock) || 0,
      categoryId: form.categoryId || null,
      images: form.images,
      colors: form.colors,
      sizes: form.sizes,
    };
    const url = isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products";
    try {
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error || "Erreur lors de l'enregistrement.");
        return;
      }
      router.push("/admin/produits");
      router.refresh();
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4 md:col-span-2">
          <Field label="Nom du produit">
            <input className={inputCls} value={form.name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Slug (URL)" hint="Généré automatiquement d’après le titre. Modifiez-le si besoin.">
            <input className={inputCls} value={form.slug} onChange={(e) => { set("slug", slugify(e.target.value) || e.target.value); setSlugEdited(true); }} placeholder="tshirt-sabreen-noir" />
          </Field>
        </div>

        <Field label="Prix (FCFA)">
          <input className={inputCls} type="number" min={0} value={form.price} onChange={(e) => set("price", Number(e.target.value))} required />
        </Field>
        <Field label="Ancien prix barré (FCFA)" hint="Laisser vide si pas de promo">
          <input className={inputCls} type="number" min={0} value={form.compareAtPrice ?? ""} onChange={(e) => set("compareAtPrice", e.target.value ? Number(e.target.value) : null)} />
        </Field>
        <Field label="Stock">
          <input className={inputCls} type="number" min={0} value={form.stock} onChange={(e) => set("stock", Number(e.target.value))} />
        </Field>
        <Field label="Catégorie">
          <select className={inputCls} value={form.categoryId ?? ""} onChange={(e) => set("categoryId", e.target.value || null)}>
            <option value="">Non classé</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>

        <Field label="Description">
          <textarea className={inputCls} rows={4} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} placeholder="Description courte du produit..." />
        </Field>

        <div className="space-y-4">
          <Field label="Images" hint="Plusieurs photos acceptées — renommées d'après le nom du produit.">
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-2">
                {form.images.map((img, i) => (
                  <div key={img} className="relative aspect-square rounded-xl overflow-hidden border border-sabren-gray bg-sabren-cream group">
                    {!imageError[img] ? (
                      <img src={img} alt="" className="w-full h-full object-cover" onError={() => setImageError((m) => ({ ...m, [img]: true }))} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-sabren-black/40 px-1 text-center">Image introuvable</div>
                    )}
                    <button type="button" onClick={() => set("images", form.images.filter((_, j) => j !== i))} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition" aria-label="Retirer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {i === 0 && <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-sabren-gold text-sabren-black rounded-full px-1.5 py-0.5">Principale</span>}
                  </div>
                ))}
                <label className="aspect-square rounded-xl border-2 border-dashed border-sabren-gold/40 hover:border-sabren-gold bg-sabren-cream/50 flex flex-col items-center justify-center gap-1 cursor-pointer text-sabren-gold">
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}
                  <span className="text-[10px] font-bold">{uploading ? "Upload..." : "Ajouter"}</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
                </label>
              </div>
            </div>
          </Field>

          <Field label="Couleurs" hint="Entrez une couleur puis Entrée">
            <div className="flex flex-wrap gap-1.5 bg-sabren-gray rounded-xl p-2 mb-1.5">
              {form.colors.map((c) => (
                <span key={c} className="inline-flex items-center gap-1 bg-white rounded-full pl-3 pr-1.5 py-1 text-xs font-semibold capitalize">
                  {c}
                  <button type="button" onClick={() => set("colors", form.colors.filter((x) => x !== c))} className="text-sabren-black/40 hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              ))}
              <input value={colorInput} onChange={(e) => setColorInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addChip("colors"); } }} onBlur={() => colorInput.trim() && addChip("colors")} placeholder="+ couleur" className="flex-1 min-w-24 bg-transparent text-sm outline-none px-1" />
            </div>
          </Field>

          <Field label="Tailles" hint="XS, S, M, L, XL, 38, 40... Entrée pour ajouter">
            <div className="flex flex-wrap gap-1.5 bg-sabren-gray rounded-xl p-2 mb-1.5">
              {form.sizes.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 bg-white rounded-full pl-3 pr-1.5 py-1 text-xs font-semibold">
                  {s}
                  <button type="button" onClick={() => set("sizes", form.sizes.filter((x) => x !== s))} className="text-sabren-black/40 hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              ))}
              <input value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addChip("sizes"); } }} onBlur={() => sizeInput.trim() && addChip("sizes")} placeholder="+ taille" className="flex-1 min-w-24 bg-transparent text-sm outline-none px-1" />
            </div>
          </Field>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 p-5 bg-sabren-cream rounded-2xl border border-sabren-gold/20">
        <Toggle checked={form.isActive} onChange={(v) => set("isActive", v)} label="Visible sur la boutique" />
        <Toggle checked={form.isFeatured} onChange={(v) => set("isFeatured", v)} label="Meilleure vente (accueil)" />
        <Toggle checked={form.isNew} onChange={(v) => set("isNew", v)} label="Nouveauté" />
      </div>

      {error && <p className="text-xs font-semibold text-red-500 bg-red-50 rounded-xl px-4 py-2.5">{error}</p>}

      <div className="flex items-center gap-3">
        <Btn type="submit" variant="gold" disabled={saving}>
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEdit ? "Enregistrer les modifications" : "Créer le produit"}
        </Btn>
        <Btn type="button" variant="ghost" onClick={() => router.back()}>Annuler</Btn>
      </div>
    </form>
  );
}