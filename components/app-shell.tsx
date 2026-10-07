"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CircleGauge, Compass, GraduationCap, RotateCcw, Settings2, ShieldCheck } from "lucide-react";

const nav = [
  { href: "/", label: "Lernnetz", icon: Compass },
  { href: "/diagnose", label: "Diagnose", icon: CircleGauge },
  { href: "/wiederholen", label: "Wiederholen", icon: RotateCcw },
  { href: "/fortschritt", label: "Fortschritt", icon: BarChart3 },
  { href: "/pruefungsreife", label: "Prüfungsreife", icon: ShieldCheck },
  { href: "/einstellungen", label: "Daten & KI", icon: Settings2 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="app-frame">
      <aside className="rail-nav">
        <Link className="brand" href="/" aria-label="Project-B2 Startseite">
          <span className="brand-mark"><GraduationCap size={21} /></span>
          <span><strong>Project-B2</strong><small>Deutschprüfung</small></span>
        </Link>
        <nav aria-label="Hauptnavigation">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return <Link key={href} href={href} className={active ? "active" : ""}><Icon size={18} /><span>{label}</span></Link>;
          })}
        </nav>
        <div className="independent-note"><strong>Unabhängig lernen</strong><span>Nicht mit telc gGmbH verbunden.</span></div>
      </aside>
      <div className="mobile-bar">
        <Link className="brand" href="/"><span className="brand-mark"><GraduationCap size={19} /></span><strong>Project-B2</strong></Link>
        <nav aria-label="Mobile Navigation">{nav.slice(0, 5).map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-label={label}><Icon size={20} /></Link>)}</nav>
      </div>
      <main className="workspace">{children}</main>
    </div>
  );
}
