"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CURRICULUM_NODES, MODULES, type ModuleId } from "@/lib/curriculum";
import { apiFetch } from "@/lib/api-client";

type Progress = { nodes: { id: string; state: string; score: number; unlocked: boolean }[]; mastered: number; total: number; attemptCount: number };

export function ProgressView({ mode = "progress" }: { mode?: "progress" | "review" | "readiness" }) {
  const [data, setData] = useState<Progress | null>(null);
  useEffect(() => { apiFetch("/api/progress").then((res) => res.json()).then((value) => setData(value as Progress)).catch(() => undefined); }, []);
  const map = useMemo(() => new Map(data?.nodes.map((node) => [node.id, node]) ?? []), [data]);
  const modules = (Object.keys(MODULES) as ModuleId[]).map((module) => {
    const nodes = CURRICULUM_NODES.filter((node) => node.module === module);
    const observed = nodes.map((node) => map.get(node.id)).filter(Boolean);
    const score = observed.length ? observed.reduce((sum, row) => sum + (row?.score ?? 0), 0) / nodes.length : 0;
    return { module, nodes, score, mastered: nodes.filter((node) => map.get(node.id)?.state === "mastered").length };
  });
  if (mode === "review") {
    const due = data?.nodes.filter((node) => node.state === "review_due" || (node.state === "learning" && node.unlocked)).slice(0, 12) ?? [];
    return <div className="review-grid">{due.length ? due.map((item) => { const node = CURRICULUM_NODES.find((entry) => entry.id === item.id)!; return <Link href={`/lernen/${node.id}`} key={node.id} className="review-item"><span style={{ background: MODULES[node.module].color }}>{node.id}</span><div><strong>{node.title}</strong><small>{item.state === "review_due" ? "Wiederholung fällig" : "Reparatur empfohlen"}</small></div></Link>; }) : <div className="empty-state"><strong>Noch keine Wiederholung fällig</strong><p>Bearbeite eine Lernstation. Fehler werden morgen, richtige Transferaufgaben nach drei Tagen wiederholt.</p><Link className="secondary-action" href="/lernen/FND-001">Erste Station öffnen</Link></div>}</div>;
  }
  if (mode === "readiness") {
    const writtenModules = modules.filter((item) => ["reading", "language_elements", "listening", "writing"].includes(item.module));
    const written = writtenModules.reduce((sum, item) => sum + item.score, 0) / writtenModules.length;
    const oral = modules.find((item) => item.module === "speaking")?.score ?? 0;
    return <div className="readiness-board"><ReadinessDial label="Schriftlich" value={written} detail="Lesen 75 · Sprache 30 · Hören 75 · Schreiben 45" /><ReadinessDial label="Mündlich" value={oral} detail="Ausdruck · Aufgabenbewältigung · Korrektheit · Aussprache" /><div className="threshold-note"><strong>Sicherheitsmarge: 65 %</strong><p>Die offizielle Mindesthürde liegt bei 60 %. Project-B2 zeigt „bereit“ erst ab geschätzten 65 %, einem aktuellen Voll-Mock und keinem kritischen Modul unter 60 %.</p></div></div>;
  }
  return <div className="progress-board"><div className="progress-summary"><strong>{data?.mastered ?? 0}<small>/ {data?.total ?? 132}</small></strong><span>Stationen gemeistert</span><p>{data?.attemptCount ?? 0} gespeicherte Versuche</p></div><div className="module-progress">{modules.map((item) => <div key={item.module}><header><span style={{ background: MODULES[item.module].color }} /><strong>{MODULES[item.module].label}</strong><small>{item.mastered}/{item.nodes.length}</small></header><div><i style={{ width: `${Math.round(item.score * 100)}%`, background: MODULES[item.module].color }} /></div><p>{Math.round(item.score * 100)} % Übungsevidenz</p></div>)}</div></div>;
}

function ReadinessDial({ label, value, detail }: { label: string; value: number; detail: string }) {
  const percent = Math.round(value * 100);
  return <div className="readiness-dial"><div style={{ "--value": `${percent * 3.6}deg` } as React.CSSProperties}><span><strong>{percent}%</strong><small>Schätzung</small></span></div><h2>{label}</h2><p>{detail}</p><strong className={percent >= 65 ? "ready" : "not-ready"}>{percent >= 65 ? "Sicherheitsmarge erreicht" : "Noch Evidenz sammeln"}</strong></div>;
}
