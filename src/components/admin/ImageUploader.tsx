"use client";
import { useState } from "react";
import { inputCls } from "./ui";
import { CloudUpload, ImagePlus, Loader2 } from "lucide-react";
import { resizeImage } from "@/lib/image";

export function ImageUploader({ value, onChange, name }: { value: string; onChange: (url: string) => void; name: string }) {
  const [uploading, setUploading] = useState(false);
  const [broken, setBroken] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const upload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    setBroken(false);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", await resizeImage(file));
      fd.append("name", name);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.url) {
        onChange(data.url);
        setBroken(false);
      } else {
        setUploadError(data?.error || "Upload impossible");
      }
    } catch {
      setUploadError("Erreur réseau. Réessayez.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-start gap-3">
      <div className="w-20 h-20 rounded-xl border border-sabren-gray bg-sabren-cream overflow-hidden shrink-0 relative">
        {value ? (
          <>
            {!broken ? (
              <img src={value} alt="" className="w-full h-full object-cover" onError={() => setBroken(true)} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-sabren-black/40 px-1 text-center">Image introuvable</div>
            )}
            <button type="button" onClick={() => { onChange(""); setBroken(false); }} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center" aria-label="Retirer l'image">
              ×
            </button>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sabren-black/25"><ImagePlus className="w-6 h-6" /></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} placeholder="/uploads/....jpg ou https://..." />
        <label className="mt-2 inline-flex items-center gap-1.5 bg-sabren-gray hover:bg-sabren-cream rounded-full px-3.5 py-2 text-xs font-bold cursor-pointer transition">
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CloudUpload className="w-3.5 h-3.5" />}
          {uploading ? "Upload..." : "Importer un fichier"}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files)} />
        </label>
        {uploadError && <p className="text-[11px] font-semibold text-red-500 mt-1">{uploadError}</p>}
      </div>
    </div>
  );
}