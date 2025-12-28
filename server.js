import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Ajusta este prompt cuando quieras
const SYSTEM_PROMPT = `
Eres "Gator Assistant" de THE GATOR ROUTE SHOP.
Tu trabajo: ayudar a vender TENIS (Nike/Adidas/Puma/Jordan) y cerrar la compra por WhatsApp.
Reglas:
- Responde en el idioma del cliente (ES/EN).
- Respuestas cortas, claras, enfocadas en vender.
- Si falta talla, ciudad o presupuesto, haz 1 pregunta corta.
- Si el cliente ya eligió producto, pregunta: "¿Seguimos con la compra?"
- Si te dan marca+talla, recomienda hasta 5 opciones usando el catálogo recibido.
- No inventes productos que no estén en el catálogo.
`;

function clipHistory(history, maxItems = 10) {
  if (!Array.isArray(history)) return [];
  return history.slice(-maxItems).map(m => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content || "").slice(0, 2000)
  }));
}

app.get("/", (_req, res) => res.send("OK"));

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, catalog } = req.body || {};
    const userMsg = String(message || "").trim().slice(0, 4000);

    if (!userMsg) return res.json({ reply: "Escribe tu marca y talla. Ej: Nike talla 9." });

    const input = [
      { role: "system", content: SYSTEM_PROMPT.trim() },
      ...(catalog ? [{ role: "system", content: `CATALOGO (NO INVENTAR):\n${String(catalog).slice(0, 12000)}` }] : []),
      ...clipHistory(history, 12),
      { role: "user", content: userMsg }
    ];

   const completion = await client.chat.completions.create({
  model: process.env.OPENAI_MODEL || "gpt-4o-mini",
  messages: input,
  temperature: 0.4
});

const reply = completion?.choices?.[0]?.message?.content || "";
res.json({ reply: reply.trim() || "¿Qué marca y talla buscas?" });


if (typeof response.output_text === "string" && response.output_text.trim()) {
  reply = response.output_text;
} else if (Array.isArray(response.output)) {
  // Recorre outputs y junta cualquier texto encontrado
  for (const item of response.output) {
    if (!item || !Array.isArray(item.content)) continue;
    for (const c of item.content) {
      if (c?.type === "output_text" && typeof c.text === "string") reply += c.text;
      if (c?.type === "text" && typeof c.text === "string") reply += c.text;
    }
  }
}

reply = (reply || "").trim();
res.json({ reply: reply || "¿Qué marca y talla buscas?" });

    res.status(500).json({
      reply: "Error del asistente. Intenta de nuevo.",
      error: String(err?.message || err)
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Gator AI backend on port", port));
