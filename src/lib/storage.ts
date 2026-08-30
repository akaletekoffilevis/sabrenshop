import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
export const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
export const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;

function extOf(name: string): string {
  const ext = name.includes(".") ? "." + name.split(".").pop()!.toLowerCase() : "";
  return ALLOWED_EXT.includes(ext) ? ext : "";
}

export function isUploadAllowed(file: File): boolean {
  if (!ALLOWED_MIME.includes(file.type)) return false;
  if (!file.name.includes(".")) return true;
  return ALLOWED_EXT.includes("." + file.name.split(".").pop()!.toLowerCase());
}

export async function saveFile(file: File, baseName: string = "produit"): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const safe = baseName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60) || "produit";
  const ext = extOf(file.name) || ".jpg";
  const filename = `${safe}-${Date.now()}${ext}`;

  // Prod : Vercel Blob (store v2 — token et/ou storeId)
  const token = process.env.SABREN_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
  const storeId = process.env.SABREN_STORE_ID || process.env.BLOB_STORE_ID;
  if (token || storeId) {
    try {
      const blob = await put(filename, buffer, {
        access: "public",
        token: token || undefined,
        storeId: storeId || undefined,
        addRandomSuffix: true,
        contentType: file.type || undefined,
      });
      return blob.url;
    } catch (e) {
      console.error("[upload] Vercel Blob échoué:", e);
    }
  }

  // Dev : système de fichiers local
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);
    return `/uploads/${filename}`;
  } catch (e) {
    console.error("[upload] écriture locale échouée:", e);
  }

  // Fallback : on REFUSE d'écrire en base64 (images non crawlables, base alourdie).
  // En production Vercel Blob EST requis : sans token, l'upload échoue clairement.
  throw new Error("[upload] Stockage impossible : configurez la variable BLOB_READ_WRITE_TOKEN (Vercel Blob) — les images ne sont jamais stockées en base64.");
}