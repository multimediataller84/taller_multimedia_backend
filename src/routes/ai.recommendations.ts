import { Router } from "express";

const router = Router();

/**
 * Body esperado:
 * {
 *   fecha: "YYYY-MM-DD",
 *   products: [{ id: number, name: string }],
 *   sales_today: [{ product_id: number, name: string, qty_today: number }]
 * }
 */

router.post("/", async (req, res) => {
  try {
    const { fecha, products, sales_today } = req.body || {};
    if (
      typeof fecha !== "string" ||
      !Array.isArray(products) ||
      !Array.isArray(sales_today)
    ) {
      return res.status(400).json({ recomendaciones: [], error: "bad_request" });
    }

    const qtyByProduct = new Map<number, number>();
    for (const p of products) qtyByProduct.set(p.id, 0);
    for (const s of sales_today) {
      qtyByProduct.set(s.product_id, (qtyByProduct.get(s.product_id) || 0) + (s.qty_today || 0));
    }

    const ranked = products
      .map((p) => ({ ...p, qty: qtyByProduct.get(p.id) || 0 }))
      .sort((a, b) => b.qty - a.qty);

    const top = ranked.slice(0, 3);
    const low = ranked.filter((r) => r.qty > 0).slice(-3);
    const zero = ranked.filter((r) => r.qty === 0).slice(0, 3);

    const fallbackRecs = () => {
      const recs: any[] = [];

      if (top.length > 0) {
        recs.push({
          titulo: "Reforzar top vendidos",
          accion:
            `Aumenta visibilidad y stock de ${top.map(t => t.name).join(", ")} (top del día). ` +
            `Destácalos en el mostrador y repite en redes.`,
          razon: "Se vendieron más que el resto hoy.",
          confianza: 0.8,
          product_id: top[0]?.id ?? null,
        });
      }

      if (zero.length > 0) {
        recs.push({
          titulo: "Impulso a productos sin ventas",
          accion:
            `Haz combo o descuento con ${zero.map(z => z.name).join(", ")} para activar rotación. ` +
            `Prueba 2x1 limitado o bundle con un top vendido.`,
          razon: "No registraron ventas hoy.",
          confianza: 0.6,
          product_id: zero[0]?.id ?? null,
        });
      } else if (low.length > 0) {
        recs.push({
          titulo: "Mejorar productos de baja salida",
          accion:
            `Ofrece promoción cruzada: ${low.map(l => l.name).join(", ")} junto a un top vendido. ` +
            `Usa señalización y mención del vendedor.`,
          razon: "Tuvieron pocas unidades vendidas.",
          confianza: 0.55,
          product_id: low[0]?.id ?? null,
        });
      }

      if (recs.length === 0) {
        recs.push({
          titulo: "Sin datos suficientes hoy",
          accion:
            "Asegura registrar al menos una venta para generar recomendaciones. " +
            "Mientras tanto, promueve tu producto estrella y prueba un combo simple.",
          razon: "No hay ventas registradas para analizar.",
          confianza: 0.4,
          product_id: null,
        });
      }
      return recs;
    };

    const system = `
Eres un analista de negocio. Devuelve SOLO un JSON con el formato:
{
 "recomendaciones": [
   { "titulo": string, "accion": string, "razon": string, "confianza": number, "product_id": number|null }
 ]
}
- No inventes productos: usa solo los IDs/nombres provistos.
- Sé breve, accionable y claro (máx. 2-3 recomendaciones).
`.trim();

    const user = `
Fecha: ${fecha}
Productos: ${JSON.stringify(products)}
Ventas del día: ${JSON.stringify(sales_today)}
Objetivo:
1) Explica brevemente por qué los top vendidos pudieron rendir mejor (razón corta).
2) Da 2–3 consejos concretos para mejorar ventas de los que no vendieron o vendieron poco.
3) Relaciona consejos con product_id cuando aplique (o null si es general).
`.trim();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ recomendaciones: [], error: "api_key_missing" });
    }
    const model = process.env.OPENAI_MODEL || "gpt-5-mini";
    const baseUrl =
      process.env.OPENAI_BASE_URL || "https://api.openai.com/v1/chat/completions";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const r = await fetch(baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        max_tokens: 400,
        response_format: { type: "json_object" },
        // temperature: 1,
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    let recomendaciones: any[] = [];
    if (r.ok) {
      const data = (await r.json().catch(() => ({}))) as any;
      try {
        const content = data?.choices?.[0]?.message?.content ?? "{}";
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed?.recomendaciones)) {
          recomendaciones = parsed.recomendaciones;
        }
      } catch {
      }
    } else {
    }

    if (!Array.isArray(recomendaciones) || recomendaciones.length === 0) {
      recomendaciones = fallbackRecs();
    }

    return res.json({ recomendaciones });
  } catch (e: any) {
    const isAbort = e?.name === "AbortError";
    return res
      .status(502)
      .json({ recomendaciones: [], error: isAbort ? "ai_timeout" : "ai_unavailable" });
  }
});

export default router;
