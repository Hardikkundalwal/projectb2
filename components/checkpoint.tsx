"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock3, Flag } from "lucide-react";
import { apiFetch } from "@/lib/api-client";

const items = [
  { prompt: "Wählen Sie die passende Verbindung: Der Termin wurde verschoben, ___ mehrere Teilnehmende krank waren.", options: ["weil", "trotzdem", "damit"], correct: 0 },
  { prompt: "Welche Aussage paraphrasiert „Die Teilnahme ist ausschließlich nach Anmeldung möglich“?", options: ["Man kann spontan teilnehmen.", "Ohne Anmeldung ist keine Teilnahme möglich.", "Die Anmeldung ist freiwillig."], correct: 1 },
  { prompt: "Welche Bitte passt in eine halbformelle E-Mail?", options: ["Sag mir den Termin.", "Könnten Sie mir den Termin bitte bestätigen?", "Termin jetzt!"], correct: 1 },
  { prompt: "Im Audio heißt es: „Nicht Mittwoch, sondern Donnerstag.“ Welcher Tag gilt?", options: ["Mittwoch", "Donnerstag", "Beide Tage"], correct: 1 },
  { prompt: "Welche Gesprächsreaktion entwickelt eine Lösung gemeinsam?", options: ["Das ist falsch.", "Ich spreche jetzt weiter.", "Dein Vorschlag passt. Wie wäre es zusätzlich mit einem späteren Start?"], correct: 2 },
];

export function Checkpoint({ id }: { id: string }) {
  const [session, setSession] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [seconds, setSeconds] = useState(12 * 60);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  useEffect(() => { apiFetch("/api/checkpoints/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: id }) }).then((res) => res.json()).then((data) => setSession((data as { sessionId: string }).sessionId)); }, [id]);
  useEffect(() => { if (result || seconds <= 0) return; const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000); return () => window.clearInterval(timer); }, [result, seconds]);
  async function submit() { const correct = items.filter((item, index) => answers[index] === item.correct).length; const response = await apiFetch("/api/checkpoints/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId: session, correct, total: items.length }) }); setResult(await response.json() as { score: number; passed: boolean }); }
  if (result) return <div className={`result-card ${result.passed ? "passed" : "repair"}`}><Flag size={40} /><p className="route-kicker">Checkpoint abgeschlossen</p><h2>{Math.round(result.score * 100)} %</h2><p>{result.passed ? "Die Sicherheitsgrenze dieses Checkpoints ist erreicht." : "Der Reparaturweg ist jetzt sinnvoller als ein sofortiger identischer Versuch."}</p><Link className="primary-action" href={result.passed ? "/pruefungsreife" : "/wiederholen"}>{result.passed ? "Prüfungsreife ansehen" : "Reparaturweg öffnen"}</Link></div>;
  return <div className="checkpoint"><div className="checkpoint-timer"><Clock3 size={18} /><strong>{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</strong><span>Antworten: {Object.keys(answers).length}/{items.length}</span></div>{items.map((item, index) => <fieldset className="diagnostic-question" key={item.prompt}><legend><span>{index + 1}</span>{item.prompt}</legend>{item.options.map((option, optionIndex) => <label key={option}><input type="radio" name={`cp-${index}`} checked={answers[index] === optionIndex} onChange={() => setAnswers((current) => ({ ...current, [index]: optionIndex }))} /><span>{option}</span></label>)}</fieldset>)}<button className="primary-action" disabled={!session || Object.keys(answers).length !== items.length} onClick={submit}>Checkpoint abgeben</button></div>;
}
