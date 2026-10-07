import Link from "next/link";
export default function NotFound() { return <div className="content-page narrow"><div className="result-card"><p className="route-kicker">Station nicht gefunden</p><h1>Diese Verbindung gibt es nicht.</h1><p>Öffne das Lernnetz und wähle eine der 132 gültigen Stationen.</p><Link className="primary-action" href="/">Lernnetz öffnen</Link></div></div>; }
