import { saveFile } from "@/lib/storage";
import { prisma } from "@/lib/prisma";
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
  const url = await saveFile(file);
  try {
    await prisma.media.create({ data: { url, filename: file.name, size: file.size, type: file.type } });
  } catch {}
  return Response.json({ url });
}

export async function GET() {
  if (!(await guard())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return Response.json({ media });
}

export async function DELETE(req: Request) {
  if (!(await guard())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const { url } = await req.json().catch(() => ({ url: "" }));
  if (!url) return Response.json({ error: "URL manquante" }, { status: 400 });
  try {
    await prisma.media.deleteMany({ where: { url } });
  } catch {}
  return Response.json({ ok: true });
}