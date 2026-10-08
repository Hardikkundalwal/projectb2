import { getLearnerIdentity } from "@/lib/identity";
import { ensureProfile } from "@/lib/progress";
import { countTodayFeedback, getPreferences, saveFeedback } from "@/lib/firebase-store";

type Feedback = {
  mode: "deterministic" | "ai";
  scores: { taskFulfilment: number; organisation: number; vocabulary: number; grammar: number; register: number };
  strengths: string[];
  corrections: { original: string; suggestion: string; reason: string }[];
  nextSteps: string[];
  summary: string;
};

function deterministicFeedback(text: string): Feedback {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const paragraphs = text.split(/\n\s*\n/).filter((part) => part.trim());
  const hasGreeting = /(Sehr geehrte|Hallo|Liebe[rn]?)/i.test(text);
  const hasClosing = /(Mit freundlichen Grüßen|Viele Grüße|Liebe Grüße)/i.test(text);
  const connectors = text.match(/\b(weil|obwohl|deshalb|daher|außerdem|jedoch|wenn|damit)\b/gi)?.length ?? 0;
  const longEnough = words.length >= 150;
  const scores = {
    taskFulfilment: Math.min(5, 2 + Number(longEnough) * 2 + Number(hasGreeting && hasClosing)),
    organisation: Math.min(5, 2 + Math.min(2, paragraphs.length) + Number(connectors >= 2)),
    vocabulary: Math.min(5, 2 + Number(words.length >= 110) + Number(new Set(words.map((word) => word.toLowerCase())).size / Math.max(words.length, 1) > 0.55) * 2),
    grammar: Math.min(5, 3 + Number(/[.!?]\s+[A-ZÄÖÜ]/.test(text)) + Number(connectors >= 2)),
    register: Math.min(5, 2 + Number(hasGreeting) + Number(hasClosing) + Number(/bitte|möchte|könnten/i.test(text))),
  };
  const nextSteps = [
    !longEnough ? `Erweitere den Text von ${words.length} auf mindestens 150 Wörter.` : "Prüfe jeden Inhaltspunkt noch einmal gegen die Aufgabe.",
    paragraphs.length < 3 ? "Teile den Text in mindestens drei funktionale Absätze." : "Markiere pro Absatz seine Funktion: Anlass, Entwicklung oder Lösung.",
    connectors < 2 ? "Verbinde mindestens zwei Gedanken mit passenden Konnektoren." : "Kontrolliere die Verbposition nach jedem Konnektor.",
  ];
  return {
    mode: "deterministic",
    scores,
    strengths: [hasGreeting ? "Die Anrede macht den Empfänger sichtbar." : "Der Text beginnt direkt mit dem Anliegen.", hasClosing ? "Der Schluss ist klar erkennbar." : "Das Kommunikationsziel bleibt im Blick."],
    corrections: [],
    nextSteps,
    summary: `Lokale Rubrikprüfung: ${words.length} Wörter, ${paragraphs.length} Absätze und ${connectors} erkennbare Verknüpfungen. Diese Einschätzung ist Übungsfeedback, keine offizielle telc-Bewertung.`,
  };
}

async function aiFeedback(text: string, task: string): Promise<Feedback | null> {
  if (!process.env.OPENAI_API_KEY) return null;
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-6-luna",
      store: false,
      input: [{ role: "system", content: "Du bewertest einen selbst erstellten telc-B2-nahen Übungstext. Gib knappes, konstruktives Deutschfeedback. Behaupte nie, es sei eine offizielle telc-Bewertung." }, { role: "user", content: `Aufgabe: ${task}\n\nText:\n${text}` }],
      text: { format: { type: "json_schema", name: "writing_feedback", strict: true, schema: {
        type: "object", additionalProperties: false,
        properties: {
          scores: { type: "object", additionalProperties: false, properties: { taskFulfilment: { type: "integer", minimum: 1, maximum: 5 }, organisation: { type: "integer", minimum: 1, maximum: 5 }, vocabulary: { type: "integer", minimum: 1, maximum: 5 }, grammar: { type: "integer", minimum: 1, maximum: 5 }, register: { type: "integer", minimum: 1, maximum: 5 } }, required: ["taskFulfilment", "organisation", "vocabulary", "grammar", "register"] },
          strengths: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 3 },
          corrections: { type: "array", items: { type: "object", additionalProperties: false, properties: { original: { type: "string" }, suggestion: { type: "string" }, reason: { type: "string" } }, required: ["original", "suggestion", "reason"] }, maxItems: 5 },
          nextSteps: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 3 },
          summary: { type: "string" },
        }, required: ["scores", "strengths", "corrections", "nextSteps", "summary"],
      } } },
    }),
  });
  if (!response.ok) return null;
  const data = await response.json() as { output_text?: string };
  if (!data.output_text) return null;
  const parsed = JSON.parse(data.output_text) as Omit<Feedback, "mode">;
  return { mode: "ai", ...parsed };
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { text?: string; task?: string; nodeId?: string; useAi?: boolean };
    const text = body.text?.trim() ?? "";
    if (text.length < 40 || !body.nodeId) return Response.json({ error: "Schreibe zuerst mindestens 40 Zeichen." }, { status: 400 });
    const identity = await getLearnerIdentity();
    await ensureProfile(identity);
    const profile = await getPreferences(identity);
    let feedback = deterministicFeedback(text);
    if (body.useAi && profile.aiWritingEnabled) {
      if (await countTodayFeedback(identity) < 3) feedback = await aiFeedback(text, body.task ?? "B2-E-Mail") ?? feedback;
    }
    await saveFeedback(identity, body.nodeId, { mode: feedback.mode, scores: feedback.scores });
    return Response.json(feedback);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Feedback ist gerade nicht verfügbar." }, { status: 500 });
  }
}
