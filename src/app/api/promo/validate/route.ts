import { validatePromo } from "@/lib/promo";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const schema = z.object({
  code: z.string().min(1, "Entrez un code promo"),
  subTotal: z.number().int().min(0).default(0),
});

export async function POST(req: Request) {
  const limited = await rateLimit(req, { key: "promo-validate", limit: 60, seconds: 600 });
  if (limited) return limited;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });

  const result = await validatePromo(parsed.data.code, parsed.data.subTotal);
  if (!result.valid) return Response.json({ valid: false, message: result.message });

  return Response.json({
    valid: true,
    code: result.code,
    type: result.type,
    value: result.value,
    discount: result.discount,
  });
}