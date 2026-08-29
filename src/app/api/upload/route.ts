import { saveFile, isUploadAllowed, MAX_UPLOAD_BYTES } from "@/lib/storage";
import { auth } from "@/lib/auth";

async function guard() {
  const session = await auth();
  return session?.user && (session.user as { role?: string }).role === "ADMIN";
}

export async function POST(req: Request) {
  if (!(await guard())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return Response.json({ error: "Aucun fichier" }, { status: 400 });
  if (file.size <= 0) return Response.json({ error: "Fichier vide" }, { status: 400 });
  if (file.size > MAX_UPLOAD_BYTES) return Response.json({ error: "Image trop lourde (maximum 3 Mo)." }, { status: 400 });
  if (!isUploadAllowed(file)) return Response.json({ error: "Format d'image non accepté (JPG, PNG, WebP, GIF ou AVIF)." }, { status: 400 });
  const name = (form.get("name") as string | null) || "produit";
  const url = await saveFile(file, name);
  return Response.json({ url });
}