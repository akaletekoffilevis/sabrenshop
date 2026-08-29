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

  // Prod : Vercel Blob
  const token = process.env.SABREN_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
  if (token) {
    try {
      const blob = await put(filename, buffer, { access: "public", token });
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

  // Fallback universel : data URL (s'affiche partout, aucun stockage requis)
  const mime = ALLOWED_MIME.includes(file.type) ? file.type : "image/jpeg";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}