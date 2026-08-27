"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Trash2, Copy, Check, Image as ImageIcon } from "lucide-react";
import { Btn } from "./ui";

type Media = { id: string; url: string; filename: string; size?: number | null; type?: string | null };

export function MediaGallery({ initial }: { initial: Media[] }) {
  const router = useRouter();
  const [files, setFiles] = useState<Media[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState("");

  const upload = async (list: FileList | null) => {
    if (!list || list.length === 0) return;
    setUploading(true);
    const fd = new FormData();
    for (const f of Array.from(list)) fd.append("file", f);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    setUploading(false);
    if (res.ok) {
      const data = await res.json();
      if (data.url) {
        setFiles((f) => [{ id: `${Date.now()}`, url: data.url, filename: "upload" }, ...f]);
        router.refresh();
      }
    }
  };

  const del = async (m: Media) => {
    if (!confirm(`Supprimer « ${m.filename} » ? L'image sera retirée de la bibliothèque.`)) return;
    const res = await fetch("/api/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: m.url }) });
    if (res.ok) {
      setFiles((f) => f.filter((x) => x.url !== m.url));
      router.refresh();
    }
  };

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(""), 1500);
    } catch {}
  };

  return (
    <div>
      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-sabren-gold/40 hover:border-sabren-gold rounded-2xl py-10 bg-sabren-cream/40 cursor-pointer transition mb-6">
        {uploading ? <Loader2 className="w-7 h-7 text-sabren-gold animate-spin" /> : <ImagePlus className="w-7 h-7 text-sabren-gold" />}
        <span className="font-bold text-sm">Glissez-déposez ou cliquez pour ajouter des images</span>
        <span className="text-xs text-sabren-black/45">Stockage local en dev, Vercel Blob en production</span>
        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
      </label>

      {files.length === 0 ? (
        <div className="text-center py-16 text-sabren-black/45">
          <ImageIcon className="w-10 h-10 mx-auto mb-3 text-sabren-black/20" />
          <p className="text-sm">La bibliothèque est vide. Ajoutez vos premières images.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {files.map((m) => (
            <div key={m.id} className="group relative aspect-square rounded-xl overflow-hidden border border-sabren-gray bg-sabren-cream">
              <img src={m.url} alt={m.filename} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => copy(m.url)} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-sabren-gold transition" aria-label="Copier l'URL">
                  {copied === m.url ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <button onClick={() => del(m)} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-red-500 hover:text-white transition" aria-label="Supprimer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}