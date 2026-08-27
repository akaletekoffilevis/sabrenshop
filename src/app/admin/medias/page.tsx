import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { MediaGallery } from "@/components/admin/MediaGallery";

export default async function AdminMedias() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return (
    <div>
      <PageHeader title="Médias" subtitle="Bibliothèque d'images partagées : upload, copier une URL, supprimer." />
      <MediaGallery initial={media.map((m) => ({ ...m, size: m.size, type: m.type }))} />
    </div>
  );
}