"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/api-client";

const questions = [
  { prompt: "Welche Form ist korrekt?", options: ["Obwohl ich war müde, lernte ich.", "Obwohl ich müde war, lernte ich.", "Obwohl müde ich war, lernte ich."], correct: 1 },
  { prompt: "Was bedeutet „Nicht alle Kurse fallen aus“?", options: ["Kein Kurs findet statt.", "Einige Kurse finden statt.", "Alle Kurse finden statt."], correct: 1 },
  { prompt: "Welche Bitte passt zu einer Kursleitung?", options: ["Schick mir das heute!", "Könnten Sie mir den Termin bitte bestätigen?", "Du bestätigst jetzt den Termin."], correct: 1 },
  { prompt: "Welche Aussage ist eine passende Paraphrase für „Die Nachfrage sank“?", options: ["Weniger Menschen interessierten sich dafür.", "Das Angebot wurde größer.", "Die Preise blieben stabil."], correct: 0 },
  { prompt: "Welche Gliederung hilft bei einer B2-E-Mail?", options: ["Anlass – Punkte – Lösung – Abschluss", "Nur eine lange Liste", "Schluss – Anrede – zufällige Beispiele"], correct: 0 },
  { prompt: "Was ist beim Hören nach einer verpassten Zahl sinnvoll?", options: ["Innerlich zurückspulen", "Weiterhören und die Lücke kurz markieren", "Die Aufgabe abbrechen"], correct: 1 },
];

export function Diagnostic() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ score: number; recommendedNodeId: string } | null>(null);
  const [loading, setLoading] = useState(false);
  async function finish() {
    setLoading(true);
    const response = await apiFetch("/api/diagnostic/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers: questions.map((q, index) => answers[index] === q.correct) }) });
    const data = await response.json() as { score: number; recommendedNodeId: string }; setResult(data); setLoading(false);
  }
  if (result) return <div className="result-card"><CheckCircle2 size={40} /><p className="route-kicker">Diagnose abgeschlossen</p><h2>{Math.round(result.score * 100)} %</h2><p>Das ist eine Standortbestimmung, kein offizielles Prüfungsergebnis. Dein Lernnetz priorisiert jetzt die sinnvollste nächste Station.</p><Link className="primary-action" href={`/lernen/${result.recommendedNodeId}`}>Empfohlene Station öffnen</Link></div>;
  return <div className="diagnostic-list">{questions.map((question, index) => <fieldset key={question.prompt} className="diagnostic-question"><legend><span>{index + 1}</span>{question.prompt}</legend>{question.options.map((option, optionIndex) => <label key={option}><input type="radio" name={`q-${index}`} checked={answers[index] === optionIndex} onChange={() => setAnswers((current) => ({ ...current, [index]: optionIndex }))} /><span>{option}</span></label>)}</fieldset>)}<button className="primary-action" disabled={Object.keys(answers).length !== questions.length || loading} onClick={finish}>{loading ? "Wird ausgewertet …" : "Diagnose auswerten"}</button></div>;
}
