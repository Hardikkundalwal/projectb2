import type { Metadata } from "next";
import { SettingsPanel } from "@/components/settings-panel";
export const metadata: Metadata = { title: "Daten & KI" };
export default function SettingsPage() { return <div className="content-page narrow"><header className="page-head"><div><p className="route-kicker">Du behältst die Kontrolle</p><h1>Daten & KI</h1><p>Project-B2 speichert nur Lernfortschritt. KI-Feedback bleibt optional.</p></div></header><SettingsPanel /></div>; }
