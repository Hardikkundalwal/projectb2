import type { Metadata } from "next";
import { ProgressView } from "@/components/progress-view";
export const metadata: Metadata = { title: "Fortschritt" };
export default function ProgressPage() { return <div className="content-page"><header className="page-head"><div><p className="route-kicker">Evidenz statt Klicks</p><h1>Was wirklich sitzt</h1><p>Meisterschaft braucht mindestens drei Beobachtungen, 80 % Genauigkeit und einen Transferbeleg.</p></div></header><ProgressView /></div>; }
