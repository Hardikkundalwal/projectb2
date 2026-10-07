import type { Metadata } from "next";
import { Diagnostic } from "@/components/diagnostic";
export const metadata: Metadata = { title: "Diagnose" };
export default function DiagnosePage() { return <div className="content-page narrow"><header className="page-head"><div><p className="route-kicker">Sechs kurze Signale</p><h1>Dein Startpunkt</h1><p>Die Diagnose setzt Prioritäten. Sie überspringt keine Checkpoints und ersetzt keine Prüfung.</p></div></header><Diagnostic /></div>; }
