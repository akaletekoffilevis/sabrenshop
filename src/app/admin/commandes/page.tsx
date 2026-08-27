import { prisma } from "@/lib/prisma";
import { Card } from "@/components/admin/ui";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { ShoppingCart } from "lucide-react";

export default async function AdminCommandes() {
  const orders = await prisma.order.findMany({ include: { items: true, user: { select: { email: true } } }, orderBy: { createdAt: "desc" } });

  const counts = {
    NEW: orders.filter((o) => o.status === "NEW").length,
    inProgress: orders.filter((o) => ["CONFIRMED", "PREPARING", "SHIPPED"].includes(o.status)).length,
    DELIVERED: orders.filter((o) => o.status === "DELIVERED").length,
    CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display font-black text-2xl">Commandes</h1>
          <p className="text-sm text-sabren-black/50 mt-0.5">{orders.length} commande{orders.length > 1 ? "s" : ""} au total</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          ["Nouvelles", counts.NEW, "bg-sabren-gold", "NEW"],
          ["En cours", counts.inProgress, "bg-blue-500", "CONFIRMED"],
          ["Livrées", counts.DELIVERED, "bg-green-500", "DELIVERED"],
          ["Annulées", counts.CANCELLED, "bg-red-400", "CANCELLED"],
        ].map(([label, val, dot]) => (
          <Card key={label as string} className="p-4 flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${dot} ${val as number === 0 ? "opacity-30" : ""}`} />
            <div>
              <p className="text-xs font-bold uppercase text-sabren-black/45">{label}</p>
              <p className="font-black text-lg">{val as number}</p>
            </div>
          </Card>
        ))}
      </div>

      {orders.length === 0 ? (
        <Card className="p-10 text-center">
          <ShoppingCart className="w-10 h-10 mx-auto text-sabren-gold mb-3" />
          <p className="font-bold">Aucune commande</p>
          <p className="text-sm text-sabren-black/50 mt-1">Les commandes WhatsApp et livraison apparaîtront ici.</p>
        </Card>
      ) : (
        <OrdersTable orders={orders.map((o) => ({ ...o, createdAt: o.createdAt.toISOString(), items: o.items as any[] }))} />
      )}
    </div>
  );
}