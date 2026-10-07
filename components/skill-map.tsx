"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LockKeyhole, Map as MapIcon, RotateCcw } from "lucide-react";
import { CURRICULUM_NODES, MODULES, type ModuleId } from "@/lib/curriculum";

type ProgressNode = { id: string; state: string; score: number; observations: number; unlocked: boolean };
type Progress = { nodes: ProgressNode[]; reviews: { nodeId: string }[]; mastered: number; total: number; attemptCount: number; profile: { displayName: string } };

const moduleOrder = Object.keys(MODULES) as ModuleId[];

export function SkillMap() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState("");
  const [selectedModule, setSelectedModule] = useState<ModuleId | "all">("all");
  useEffect(() => { fetch("/api/progress").then(async (res) => { const data = await res.json(); if (!res.ok) throw new Error(data.error); setProgress(data); }).catch((err) => setError(err.message)); }, []);
  const progressById = useMemo(() => new Map(progress?.nodes.map((node) => [node.id, node]) ?? []), [progress]);
  const next = CURRICULUM_NODES.find((node) => {
    const state = progressById.get(node.id);
    return (state?.unlocked ?? node.prerequisites.length === 0) && state?.state !== "mastered";
  }) ?? CURRICULUM_NODES[0];
  const percentage = progress ? Math.round((progress.mastered / progress.total) * 100) : 0;

  return (
    <div className="dashboard">
      <header className="page-head">
        <div><p className="route-kicker">Dein B2-Netz</p><h1>Wo steigst du heute ein?</h1><p>{progress?.profile.displayName ?? "Lokales Lernprofil"} · 132 Stationen · sieben Linien</p></div>
        <Link className="primary-action" href={`/lernen/${next.id}`}>Nächste Station</Link>
      </header>

      <section className="status-strip" aria-label="Lernstatus">
        <div><strong>{progress?.mastered ?? 0}</strong><span>gemeistert</span></div>
        <div><strong>{progress?.reviews.length ?? 0}</strong><span>heute fällig</span></div>
        <div><strong>{progress?.attemptCount ?? 0}</strong><span>Versuche</span></div>
        <div className="line-progress"><span><strong>{percentage}%</strong> des Netzes</span><div><i style={{ width: `${percentage}%` }} /></div></div>
      </section>

      {error && <div className="notice error"><strong>Lokale Datenbank noch nicht bereit</strong><span>{error}</span></div>}

      <section className="map-panel">
        <div className="panel-title"><div><MapIcon size={20} /><h2>Lernnetz</h2></div><div className="module-filters"><button className={selectedModule === "all" ? "selected" : ""} onClick={() => setSelectedModule("all")}>Alle</button>{moduleOrder.map((module) => <button key={module} className={selectedModule === module ? "selected" : ""} onClick={() => setSelectedModule(module)}>{MODULES[module].short}</button>)}</div></div>
        <div className="transit-map">
          {moduleOrder.filter((module) => selectedModule === "all" || selectedModule === module).map((module) => {
            const moduleNodes = CURRICULUM_NODES.filter((node) => node.module === module);
            return <div className="transit-line" key={module} style={{ "--line": MODULES[module].color } as React.CSSProperties}>
              <div className="line-label"><span className="line-dot" /><div><strong>{MODULES[module].label}</strong><small>{MODULES[module].description}</small></div></div>
              <div className="stations" role="list">
                {moduleNodes.map((node) => {
                  const status = progressById.get(node.id);
                  const unlocked = status?.unlocked ?? node.prerequisites.length === 0;
                  const state = status?.state ?? "unseen";
                  const due = progress?.reviews.some((item) => item.nodeId === node.id);
                  const className = `station ${state} ${!unlocked ? "locked" : ""} ${due ? "due" : ""}`;
                  return unlocked ? <Link role="listitem" key={node.id} href={`/lernen/${node.id}`} className={className} title={node.title}><span className="station-node">{due ? <RotateCcw size={13} /> : node.sequence}</span><span>{node.title}</span></Link> : <div role="listitem" key={node.id} className={className} title={`Voraussetzungen: ${node.prerequisites.join(", ")}`}><span className="station-node"><LockKeyhole size={12} /></span><span>{node.title}</span></div>;
                })}
              </div>
            </div>;
          })}
        </div>
      </section>
    </div>
  );
}
