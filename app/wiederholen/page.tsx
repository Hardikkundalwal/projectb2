import type { Metadata } from "next";
import { ProgressView } from "@/components/progress-view";
export const metadata: Metadata = { title: "Wiederholen" };
export default function ReviewPage() { return <div className="content-page"><header className="page-head"><div><p className="route-kicker">1 · 3 · 7 · 21 Tage</p><h1>Wiederholen, bevor es verblasst</h1><p>Fehler kommen früher zurück. Sichere Transferleistungen erhalten mehr Abstand.</p></div></header><ProgressView mode="review" /></div>; }
