"use client";

import { useState } from "react";
import { Database, Languages, Sparkles, Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/api-client";

export function SettingsPanel() {
  const [englishHelp, setEnglishHelp] = useState(true);
  const [ai, setAi] = useState(false);
  const [status, setStatus] = useState("");
  async function save(nextEnglish = englishHelp, nextAi = ai) {
    const response = await apiFetch("/api/account-data", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ englishHelp: nextEnglish, aiWritingEnabled: nextAi }) });
    setStatus(response.ok ? "Gespeichert" : "Speichern fehlgeschlagen");
  }
  async function exportData() { const data = await apiFetch("/api/account-data").then((res) => res.json()); const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "project-b2-lerndaten.json"; link.click(); URL.revokeObjectURL(url); }
  async function deleteData() { if (!window.confirm("Alle Project-B2-Lerndaten dieses Profils wirklich löschen?")) return; const response = await apiFetch("/api/account-data", { method: "DELETE" }); setStatus(response.ok ? "Lerndaten gelöscht" : "Löschen fehlgeschlagen"); }
  return <div className="settings-list"><section><Languages /><div><h2>Englische Hilfe</h2><p>Kurze englische Erklärung in Lektionen einblendbar.</p></div><button className={`switch ${englishHelp ? "on" : ""}`} aria-pressed={englishHelp} onClick={() => { const value = !englishHelp; setEnglishHelp(value); void save(value, ai); }}><span /></button></section><section><Sparkles /><div><h2>Optionales KI-Schreibfeedback</h2><p>Dein Text wird nur nach deinem Klick zur Analyse gesendet. Ohne aktivierte Option bleibt die Prüfung regelbasiert.</p></div><button className={`switch ${ai ? "on" : ""}`} aria-pressed={ai} onClick={() => { const value = !ai; setAi(value); void save(englishHelp, value); }}><span /></button></section><section><Database /><div><h2>Lerndaten exportieren</h2><p>Fortschritt, Versuche und Wiederholungen als JSON herunterladen.</p></div><button className="secondary-action" onClick={exportData}>Exportieren</button></section><section className="danger-zone"><Trash2 /><div><h2>Lerndaten löschen</h2><p>Entfernt Profil, Versuche, Bewertungen und Wiederholungsplan dauerhaft.</p></div><button className="secondary-action danger" onClick={deleteData}>Alles löschen</button></section>{status && <output className="save-status">{status}</output>}<p className="privacy-copy">Project-B2 ist ein unabhängiges Übungsangebot und nicht mit telc gGmbH verbunden. Sprechaufnahmen werden nicht hochgeladen. Dein Lernfortschritt wird diesem Browserprofil zugeordnet.</p></div>;
}
