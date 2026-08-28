import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function saveFile(file: File, baseName: string = "produit"): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const safe = baseName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60) || "produit";
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${safe}-${Date.now()}${ext}`;

  // Prod: Vercel Blob
  const token = process.env.SABREN_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
  if (token) {
    const blob = await put(filename, buffer, { access: "public", token });
    return blob.url;
  }

  // Dev: local filesystem
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);
  return `/uploads/${filename}`;
}
