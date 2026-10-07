import type { Metadata } from "next";
import { Checkpoint } from "@/components/checkpoint";
export const metadata: Metadata = { title: "Checkpoint" };
export default async function CheckpointPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <div className="content-page narrow"><header className="page-head"><div><p className="route-kicker">Form A · 12 Minuten</p><h1>{id === "voll-mock" ? "Vollständige Simulation" : "Modul-Checkpoint"}</h1><p>Antworten werden erst beim Abschluss bewertet. Unter 80 % folgt ein gezielter Reparaturweg.</p></div></header><Checkpoint id={id} /></div>; }
