"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import {
  ArrowRight,
  BookOpen,
  Check,
  Headphones,
  LockKeyhole,
  Map as MapIcon,
  MessageCircle,
  PencilLine,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { CURRICULUM_NODES, MODULES, type ModuleId } from "@/lib/curriculum";

type ProgressNode = { id: string; state: string; score: number; observations: number; unlocked: boolean };
type Progress = { nodes: ProgressNode[]; reviews: { nodeId: string }[]; mastered: number; total: number; attemptCount: number };

const moduleOrder = Object.keys(MODULES) as ModuleId[];
const examModules: { module: ModuleId; icon: typeof BookOpen; task: string; sample: string }[] = [
  { module: "reading", icon: BookOpen, task: "Global, Detail & selektiv lesen", sample: "Beispiel: Welche Überschrift fasst den ganzen Abschnitt zusammen?" },
  { module: "language_elements", icon: Sparkles, task: "Grammatik & Wortschatz im Kontext", sample: "Beispiel: Obwohl der Zug verspätet war, …" },
  { module: "listening", icon: Headphones, task: "Einmal hören, Korrekturen erkennen", sample: "Beispiel: nicht Dienstag, sondern Donnerstag." },
  { module: "writing", icon: PencilLine, task: "Semi-formelle E-Mail ab 150 Wörtern", sample: "Beispiel: Anlass, drei Punkte, Lösung und passender Schluss." },
  { module: "speaking", icon: MessageCircle, task: "Erfahrung, Diskussion & gemeinsam planen", sample: "Beispiel: Position + Grund + Beispiel + Rückfrage." },
];

export function SkillMap() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState("");
  const [selectedModule, setSelectedModule] = useState<ModuleId | "all">("all");
  useEffect(() => { apiFetch("/api/progress").then(async (res) => { const data = await res.json() as Progress & { error?: string }; if (!res.ok) throw new Error(data.error); setProgress(data); }).catch((err) => setError(err.message)); }, []);
  const progressById = useMemo(() => new Map(progress?.nodes.map((node) => [node.id, node]) ?? []), [progress]);
  const next = CURRICULUM_NODES.find((node) => {
    const state = progressById.get(node.id);
    return (state?.unlocked ?? node.prerequisites.length === 0) && state?.state !== "mastered";
  }) ?? CURRICULUM_NODES[0];
  const percentage = progress ? Math.round((progress.mastered / progress.total) * 100) : 0;

  return (
    <div className="dashboard">
      <header className="quest-hero">
        <div className="quest-copy">
          <p className="route-kicker">DEINE B2-EXPEDITION</p>
          <h1>Vom ersten Level bis zur Prüfung.</h1>
          <p>Ein spielerischer Lernpfad mit 132 echten Lektionen. Öffne jedes Level, lerne mit Beispielen und meistere schriftliche und mündliche telc-B2-Aufgaben.</p>
          <div className="hero-actions">
            <a className="primary-action" href={`/lernen/${next.id}`}>Level starten <ArrowRight size={17} /></a>
            <a className="secondary-action" href="#pruefungskompass">Aufgaben ansehen</a>
          </div>
        </div>
        <div className="quest-token" aria-hidden="true">
          <Image src="/project-b2-mark.png" alt="" width={230} height={230} priority />
          <span>Nächstes Ziel</span>
          <strong>{MODULES[next.module].short} · Level {next.sequence}</strong>
        </div>
      </header>

      <section className="status-strip" aria-label="Lernstatus">
        <div><strong>{progress?.mastered ?? 0}</strong><span>Level gemeistert</span></div>
        <div><strong>{progress?.reviews.length ?? 0}</strong><span>heute wiederholen</span></div>
        <div><strong>{progress?.attemptCount ?? 0}</strong><span>Antworten geprüft</span></div>
        <div className="line-progress"><span><strong>{percentage}%</strong> der Reise</span><div><i style={{ width: `${percentage}%` }} /></div></div>
      </section>

      {error && <div className="notice error"><strong>Lokale Datenbank noch nicht bereit</strong><span>{error}</span></div>}

      <section className="map-panel quest-map-panel">
        <div className="panel-title">
          <div><MapIcon size={20} /><div><h2>Level-Karte</h2><p>Alle Level lassen sich öffnen. Das Schloss zeigt nur die empfohlene Reihenfolge.</p></div></div>
          <div className="module-filters"><button className={selectedModule === "all" ? "selected" : ""} onClick={() => setSelectedModule("all")}>Alle</button>{moduleOrder.map((module) => <button key={module} className={selectedModule === module ? "selected" : ""} onClick={() => setSelectedModule(module)}>{MODULES[module].short}</button>)}</div>
        </div>
        <div className="quest-worlds">
          {moduleOrder.filter((module) => selectedModule === "all" || selectedModule === module).map((module, moduleIndex) => {
            const moduleNodes = CURRICULUM_NODES.filter((node) => node.module === module);
            const completed = moduleNodes.filter((node) => progressById.get(node.id)?.state === "mastered").length;
            return <section id={`route-${module}`} className="quest-world" key={module} style={{ "--line": MODULES[module].color, "--world-index": moduleIndex } as React.CSSProperties}>
              <header className="world-head"><div className="world-number">{String(moduleIndex + 1).padStart(2, "0")}</div><div><span>Route {moduleIndex + 1}</span><h3>{MODULES[module].label}</h3><p>{MODULES[module].description}</p></div><strong>{completed}/{moduleNodes.length}</strong></header>
              <div className="level-trail" aria-label={`${MODULES[module].label}: ${moduleNodes.length} Level`}>
                {moduleNodes.map((node) => {
                  const status = progressById.get(node.id);
                  const unlocked = status?.unlocked ?? node.prerequisites.length === 0;
                  const state = status?.state ?? "unseen";
                  const due = progress?.reviews.some((item) => item.nodeId === node.id);
                  const className = `level-stop ${state} ${!unlocked ? "recommended-later" : ""} ${due ? "due" : ""}`;
                  return <a key={node.id} href={`/lernen/${node.id}`} className={className} title={`Level ${node.sequence}: ${node.title}`} aria-label={`${MODULES[module].label}, Level ${node.sequence}: ${node.title}${!unlocked ? ". Für später empfohlen, aber jetzt zugänglich." : ""}`}>
                    <span className="level-orb">{state === "mastered" ? <Check size={18} /> : due ? <RotateCcw size={16} /> : node.sequence}</span>
                    <span>Level {node.sequence}</span>
                    {!unlocked && <LockKeyhole className="level-lock" size={12} aria-hidden="true" />}
                  </a>;
                })}
              </div>
            </section>;
          })}
        </div>
      </section>

      <section className="exam-compass" id="pruefungskompass">
        <header><p className="route-kicker">PRÜFUNGSKOMPASS</p><h2>Genau das trainierst du</h2><p>Die Aufgaben folgen dem Aufbau der allgemeinen telc Deutsch B2-Prüfung. Alle Texte und Fragen hier sind eigens für Project-B2 erstellt.</p></header>
        <div className="exam-card-grid">
          {examModules.map(({ module, icon: Icon, task, sample }) => {
            const first = CURRICULUM_NODES.find((node) => node.module === module)!;
            return <a key={module} href={`/lernen/${first.id}`} className="exam-card" style={{ "--line": MODULES[module].color } as React.CSSProperties}>
              <div className="exam-icon"><Icon size={21} /></div><span>{MODULES[module].short}</span><h3>{task}</h3><p>{sample}</p><strong>Beispiel öffnen <ArrowRight size={15} /></strong>
            </a>;
          })}
        </div>
      </section>
    </div>
  );
}
