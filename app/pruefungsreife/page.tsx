import type { Metadata } from "next";
import Link from "next/link";
import { ProgressView } from "@/components/progress-view";
export const metadata: Metadata = { title: "Prüfungsreife" };
export default function ReadinessPage() { return <div className="content-page"><header className="page-head"><div><p className="route-kicker">Schriftlich und mündlich getrennt</p><h1>Bist du stabil über der Hürde?</h1><p>Die Anzeige ist eine Übungsschätzung, kein offizielles telc-Ergebnis.</p></div><Link className="primary-action" href="/checkpoint/voll-mock">Voll-Mock starten</Link></header><ProgressView mode="readiness" /></div>; }
