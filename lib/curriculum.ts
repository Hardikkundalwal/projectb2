import nodeDefinitions from "@/content/node-definitions.json";
import skillGraph from "@/content/skill-graph.json";

export const CONTENT_VERSION = "project-b2-2026.10.07";

export type ModuleId =
  | "foundation"
  | "reading"
  | "language_elements"
  | "listening"
  | "writing"
  | "speaking"
  | "integration";

export type CurriculumNode = {
  id: string;
  module: ModuleId;
  sequence: number;
  title: string;
  learner_outcome: string;
  exam_alignment: string;
  lesson_minutes: number;
  prerequisites: string[];
  mastery: { threshold: number; minimum_attempts: number; transfer_required: boolean };
  remediation: string;
};

export type LessonExercise = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  errorCode: string;
};

export type Lesson = {
  node: CurriculumNode;
  goal: string;
  englishHelp: string;
  principle: string;
  explanation: string;
  examples: { label: string; text: string }[];
  exercises: LessonExercise[];
  repair: string;
  recap: string[];
  listeningScript?: string;
  speakingPrompt?: string;
  writingPrompt?: string;
};

export const MODULES: Record<ModuleId, { label: string; short: string; color: string; description: string }> = {
  foundation: { label: "Grundlagen", short: "Basis", color: "#315ea8", description: "Grammatik, Register und Prüfungsroutine" },
  reading: { label: "Leseverstehen", short: "Lesen", color: "#df4d3f", description: "Texte schnell, präzise und belegt verstehen" },
  language_elements: { label: "Sprachbausteine", short: "Sprache", color: "#8a57a5", description: "Grammatik und Wortschatz im Kontext" },
  listening: { label: "Hörverstehen", short: "Hören", color: "#1687a7", description: "Kernaussagen und Details sicher hören" },
  writing: { label: "Schriftlicher Ausdruck", short: "Schreiben", color: "#d28220", description: "Klare, passende und korrekte E-Mails" },
  speaking: { label: "Mündlicher Ausdruck", short: "Sprechen", color: "#27906d", description: "Strukturiert sprechen und gemeinsam handeln" },
  integration: { label: "Simulation & Transfer", short: "Prüfung", color: "#24354f", description: "Module verbinden und Prüfungsreife prüfen" },
};

const nodes = nodeDefinitions.nodes as CurriculumNode[];
export const CURRICULUM_NODES = nodes;
export const SKILL_EDGES = skillGraph.edges as { from: string; to: string; type: string }[];

type Guide = {
  principle: string;
  explanation: string;
  example: string;
  contrast: string;
  check: string;
  english: string;
};

const baseGuides: Record<ModuleId, Guide> = {
  foundation: {
    principle: "Erkenne zuerst das sprachliche Signal, entscheide danach und kontrolliere den ganzen Satz.",
    explanation: "B2-Aufgaben prüfen selten nur eine isolierte Regel. Form, Bedeutung und Register müssen zusammenpassen. Arbeite deshalb in drei Schritten: Signal markieren, Regel anwenden, Satz im Kontext gegenlesen.",
    example: "Im Satz „Obwohl die Lieferung verspätet war, blieb die Kundin ruhig“ zeigt obwohl einen Gegensatz und schickt das finite Verb ans Ende.",
    contrast: "Nicht nur das bekannte Wort wählen; die grammatische Funktion im vollständigen Satz entscheidet.",
    check: "Passen Form, Bedeutung und Register gleichzeitig?",
    english: "Identify the signal first, apply the rule, then reread the complete sentence.",
  },
  reading: {
    principle: "Formuliere aus der Aufgabe einen Suchauftrag und belege jede Entscheidung mit einer Textstelle.",
    explanation: "Gutes Lesen unter Zeitdruck bedeutet nicht, jedes Wort zu übersetzen. Bestimme Textsorte und Leseziel, suche gezielt nach Paraphrasen und prüfe besonders Negationen, Einschränkungen und Kontraste.",
    example: "Aussage: „Der Kurs ist nur am Wochenende möglich.“ Beleg: „Unter der Woche finden keine Termine statt.“ Die Formulierung ist anders, die Bedeutung gleich.",
    contrast: "Ein thematisch ähnlicher Satz ist noch kein Beleg. Entscheidend ist, ob die Aussage vollständig gedeckt ist.",
    check: "Kannst du die genaue Belegstelle zeigen und einen Ablenker ausschließen?",
    english: "Turn the question into a search task and support every answer with exact textual evidence.",
  },
  language_elements: {
    principle: "Lies über die Lücke hinaus: Satzbau, Bedeutung und feste Verbindung bestimmen gemeinsam die Lösung.",
    explanation: "Bei Sprachbausteinen reichen Wortkenntnisse allein nicht. Prüfe zuerst die Satzgrenze, dann Kasus oder Verbvalenz und zuletzt Kollokation sowie Register. Streiche Optionen, die auf einer Ebene nicht passen.",
    example: "„Sie interessiert sich ___ nachhaltige Mobilität.“ Das reflexive Verb verlangt für + Akkusativ: „für nachhaltige Mobilität“.",
    contrast: "Eine grammatisch mögliche Form kann im Kontext unidiomatisch oder semantisch falsch sein.",
    check: "Sind Satzbau, Rektion, Bedeutung und natürliche Wortverbindung stimmig?",
    english: "Read beyond the gap: grammar, meaning and collocation must all fit.",
  },
  listening: {
    principle: "Lies die Aussage voraus, notiere nur Schlüsselkontraste und entscheide erst nach dem vollständigen Hörsignal.",
    explanation: "Im Hörverstehen werden Antworten oft korrigiert oder eingeschränkt. Prognostiziere mögliche Informationen, höre auf Signalwörter und bleibe nach einer verpassten Stelle beim laufenden Text.",
    example: "„Wir treffen uns nicht am Dienstag, sondern erst am Donnerstag.“ Die erste Zeitangabe ist ein Ablenker; die Korrektur entscheidet.",
    contrast: "Das erste bekannte Wort ist nicht automatisch die Antwort. Warte auf Negation, Korrektur oder Einschränkung.",
    check: "Hast du die endgültige Aussage und nicht nur das erste Stichwort notiert?",
    english: "Predict the information, listen for contrasts and base the answer on the speaker's final meaning.",
  },
  writing: {
    principle: "Plane Empfänger, Ziel und drei Inhaltspunkte, bevor du vollständige Sätze schreibst.",
    explanation: "Ein guter B2-Text erfüllt die Aufgabe sichtbar, führt logisch durch Absätze und hält sein Register. Reserviere am Ende Zeit für Verbposition, Kasus, Endungen und Zeichensetzung.",
    example: "„Sehr geehrte Frau Neumann, ich wende mich an Sie, weil … Daher möchte ich Sie bitten, … Mit freundlichen Grüßen“ verbindet Anlass, Begründung und gewünschte Lösung.",
    contrast: "Viele Konnektoren ersetzen keine klare Absatzfunktion. Jeder Absatz braucht eine erkennbare Aufgabe.",
    check: "Sind Empfänger, Anlass, drei Punkte, Zusatzidee und gewünschte Reaktion klar?",
    english: "Plan the recipient, purpose and three content points before drafting complete sentences.",
  },
  speaking: {
    principle: "Sprich mit Stichpunkten, entwickle jeden Beitrag mit Grund und Beispiel und beziehe deinen Partner ein.",
    explanation: "Die mündliche Prüfung bewertet nicht nur korrekte Einzelsätze. Struktur, Reaktion, Verständlichkeit und gemeinsames Weiterentwickeln zählen. Nutze kurze Gliederungssignale und kläre Missverständnisse aktiv.",
    example: "„Ich sehe das ähnlich, besonders weil … Ein Beispiel dafür ist … Wie beurteilst du diesen Punkt?“ verbindet Position, Begründung und Interaktion.",
    contrast: "Ein auswendig gelernter Monolog reagiert nicht auf den Partner und wirkt schnell unflexibel.",
    check: "Hast du Position, Grund, Beispiel und eine echte Reaktion auf den Partner gezeigt?",
    english: "Use notes, develop each point with a reason and example, and actively involve your partner.",
  },
  integration: {
    principle: "Nutze Simulationsergebnisse als Skill-Daten: analysieren, gezielt reparieren, später erneut prüfen.",
    explanation: "Prüfungsreife entsteht nicht durch einen einzigen Gesamtscore. Schriftlich und mündlich müssen getrennt stabil sein; kritische Module brauchen aktuelle Belege und eine vollständige Simulation.",
    example: "Ein Gesamtergebnis von 68 % reicht nicht, wenn der mündliche Teil unter 60 % liegt. Der Lernpfad priorisiert dann Sprechen statt weiterer leichter Leseaufgaben.",
    contrast: "Viele Wiederholungen derselben Aufgabe überschätzen Sicherheit. Transfer und zeitversetzter Abruf liefern stärkere Evidenz.",
    check: "Sind beide Prüfungsteile stabil, aktuell simuliert und ohne kritischen Teil unter 60 %?",
    english: "Treat simulations as skill evidence: analyse, repair the weak skill, then retest later.",
  },
};

const specialGuides: { pattern: RegExp; patch: Partial<Guide> }[] = [
  { pattern: /Prüfungsformat und Zeitplan/, patch: { principle: "Trenne schriftliche und mündliche Prüfung, ordne jedem Modul seine Aufgabe zu und plane feste Zeitmarken statt Bauchgefühl.", explanation: "Die schriftliche Prüfung bündelt Leseverstehen, Sprachbausteine, Hörverstehen und Schreiben; die mündliche Prüfung bewertet die kommunikative Leistung separat. Notiere vor einer Simulation Start, Wechselpunkte und Kontrollzeit.", example: "Für eine 30-minütige Schreibphase planst du 4 Minuten, schreibst etwa 20 Minuten und reservierst 6 Minuten für die Kontrolle.", contrast: "Ein starker schriftlicher Teil gleicht eine nicht bestandene mündliche Teilprüfung nicht automatisch aus.", check: "Kennst du für jeden Teil Aufgabe, Reihenfolge, Zeitbudget und getrennte Bestehenshürde?", english: "Separate the written and oral exams and assign a clear task and time budget to every module." } },
  { pattern: /Diagnostik und persönliches Zielprofil/, patch: { principle: "Nutze die Diagnose zum Priorisieren, nicht zum Etikettieren: Stärke, Lücke und nächster überprüfbarer Schritt.", example: "Lesen 78 %, Hören 52 % und Schreiben 61 % führt zuerst zu Hördetails und Schreibstruktur, nicht zu mehr leichten Lesetexten.", check: "Ist dein nächstes Ziel an einem Skill, einer Übung und einem Termin erkennbar?" } },
  { pattern: /Selbstkorrektur mit Fehlercodes/, patch: { principle: "Markiere die Fehlerart vor der Korrektur, damit du die Regel statt nur dieses eine Wort reparierst.", example: "VF = Verbform, VP = Verbposition, K = Kasus, R = Register. Bei „weil ich komme später“ markierst du VP und verschiebst komme ans Ende.", check: "Kannst du den Fehlercode und die zugrunde liegende Regel benennen?" } },
  { pattern: /Zeitmanagement unter Prüfungsdruck/, patch: { principle: "Arbeite mit Zwischenzeiten und einer Abbruchregel: markieren, weitergehen, am Ende gezielt zurückkehren.", example: "Nach 90 Sekunden ohne Beleg setzt du ein Fragezeichen, wechselst zur nächsten Aufgabe und nutzt die Schlussreserve.", check: "Hast du Wechselpunkt, Schlussreserve und Abbruchregel vor dem Start festgelegt?" } },
  { pattern: /Lernstrategie und Review-Routine/, patch: { principle: "Wechsle unmittelbare Reparatur mit zeitversetztem Abruf nach 1, 3, 7 und 21 Tagen ab.", example: "Heute Kontrastübung, morgen neue Variante, nach drei Tagen Transfer in einem anderen Kontext.", check: "Ist die nächste Wiederholung terminiert und enthält sie eine neue Situation?" } },
  { pattern: /Prüfungsablauf und Partnerformat/, patch: { principle: "Behandle die mündliche Prüfung als gemeinsames Gespräch: eigenen Beitrag strukturieren, zuhören, aufgreifen und weiterführen.", example: "Nach deinem 90-Sekunden-Beitrag stellst du eine passende Rückfrage und reagierst konkret auf die Antwort.", check: "Hast du neben deinem Inhalt mindestens eine echte Partnerreaktion gezeigt?" } },
  { pattern: /Satzklammer/, patch: { principle: "Markiere finites Verb und zweiten Verbteil; alles dazwischen gehört in die Satzklammer.", example: "„Die Technikerin hat den Fehler gestern schnell behoben.“ hat bildet mit behoben die Klammer.", check: "Stehen finites Verb und Verbzusatz beziehungsweise Partizip an den erwarteten Positionen?" } },
  { pattern: /Verbposition im Hauptsatz/, patch: { principle: "Im Aussagesatz steht das finite Verb auf Position zwei; ein vorangestelltes Element zählt als Position eins.", example: "„Morgen beginnt der Kurs.“ Nicht: „Morgen der Kurs beginnt.“" } },
  { pattern: /Verbposition im Nebensatz/, patch: { principle: "Nach einer unterordnenden Konjunktion steht das finite Verb am Ende des Nebensatzes.", example: "„Ich komme später, weil der Zug Verspätung hat.“" } },
  { pattern: /Kasus|Deklination|Relativpronomen/, patch: { principle: "Suche das Kasussignal bei Verb oder Präposition und gleiche danach Artikel, Pronomen und Endung ab.", example: "„mit dem neuen Kollegen“: mit fordert Dativ; Artikel und Adjektiv zeigen denselben Kasus." } },
  { pattern: /Zeitformen|Vergangenheit/, patch: { principle: "Wähle die Zeitform nach Textfunktion: Ereignis erzählen, Vorzeitigkeit markieren oder aktuellen Zustand beschreiben.", example: "„Nachdem ich die Unterlagen geprüft hatte, schickte ich die Antwort.“ markiert die frühere Handlung eindeutig." } },
  { pattern: /Konnektoren|Ursache und Folge/, patch: { principle: "Ordne zuerst die logische Beziehung zu und kontrolliere dann die passende Verbposition.", example: "„Da der Bus ausfiel, kam ich später. Deshalb informierte ich das Büro.“ Ursache und Folge sind klar getrennt." } },
  { pattern: /Konzessive|adversative|Kontrast/, patch: { principle: "Unterscheide unerwarteten Gegensatz von einfachem Kontrast und beachte die Satzstruktur des Markers.", example: "„Obwohl es regnete, gingen wir los; mein Bruder blieb jedoch zu Hause.“" } },
  { pattern: /Paraphrasen|Synonyme|Umschreibungen/, patch: { principle: "Vergleiche Bedeutungen und Beziehungen, nicht identische Wörter.", example: "„Die Nachfrage ging zurück“ paraphrasiert „Weniger Menschen interessierten sich dafür“.", check: "Bleiben Akteur, Richtung, Stärke und Einschränkung in der Paraphrase erhalten?" } },
  { pattern: /Negation|Einschränkung|Quantoren/, patch: { principle: "Kreise Wörter wie nicht, kaum, nur, höchstens, einige und alle ein; sie verändern den Wahrheitswert.", example: "„Nicht alle nahmen teil“ bedeutet: Einige fehlten. Es bedeutet nicht: Niemand nahm teil." } },
  { pattern: /Zahlen|Daten|Orte|Termine/, patch: { principle: "Notiere Zahl und Einheit gemeinsam und kontrolliere Korrekturen sofort.", example: "„Nicht um 14.15 Uhr, sondern um 14.50 Uhr“ – entscheidend ist 14.50 Uhr." } },
  { pattern: /Register|Anrede|Schlussformel|Höflichkeit/, patch: { principle: "Bestimme Nähe und Rolle des Empfängers und halte Anrede, Wortwahl und Schlussformel im selben Register.", example: "„Sehr geehrte Damen und Herren … Mit freundlichen Grüßen“ passt zu einer unbekannten Institution." } },
  { pattern: /Leseziel|Suchaufträge|Belegstellen/, patch: { principle: "Übersetze die Frage in zwei bis drei Suchbegriffe und stoppe erst bei einer eindeutigen Belegstelle.", example: "Aus „Warum wechselte sie den Arbeitsplatz?“ wird der Suchauftrag: Grund + Wechsel + frühere Stelle." } },
  { pattern: /Überschriften|Kernaussage|Globales Thema/, patch: { principle: "Formuliere den gemeinsamen Nenner des ganzen Textes, nicht ein auffälliges Detail.", example: "Mehrere Beispiele zu Bus, Rad und Bahn ergeben als Kernaussage „Alternativen zum Auto im Alltag“.", check: "Deckt deine Formulierung den gesamten Abschnitt statt nur einen Satz?" } },
  { pattern: /Ablenker|Antwortoptionen|Optionen ausschließen/, patch: { principle: "Prüfe jede Option gegen den Text und benenne den konkreten Fehler des stärksten Ablenkers.", example: "Der Text sagt „ab Mai“, die Option behauptet „nur im Mai“ – das zusätzliche nur macht sie falsch." } },
  { pattern: /Präposition|Verbvalenz|Ergänzungen/, patch: { principle: "Lerne Verb oder Nomen zusammen mit seiner festen Ergänzung und dem geforderten Kasus.", example: "„teilnehmen an + Dativ“: Sie nimmt an der Besprechung teil." } },
  { pattern: /Passiv/, patch: { principle: "Nutze Passiv, wenn Vorgang oder Ergebnis wichtiger ist als die handelnde Person.", example: "„Die Straße wird repariert.“ betont den Vorgang; „Die Firma repariert die Straße.“ betont den Akteur." } },
  { pattern: /Konjunktiv II|Irrealität/, patch: { principle: "Nutze würde, könnte, hätte oder wäre für höfliche Distanz, Wünsche und irreale Bedingungen.", example: "„Könnten Sie mir bitte bestätigen, ob …?“ formuliert eine höfliche Bitte." } },
  { pattern: /Infinitiv mit zu/, patch: { principle: "Prüfe, ob das Bezugsverb eine Infinitivgruppe verlangt und setze zu an die richtige Stelle.", example: "„Ich plane, früher anzureisen.“ Bei trennbaren Verben: „teilzunehmen“." } },
  { pattern: /Kollokationen|Verb-Nomen|Adjektiv-Präposition|Nomen-Präposition/, patch: { principle: "Lerne die Wortgruppe als feste Einheit und prüfe sie im ganzen Satz.", example: "Man „trifft eine Entscheidung“ und ist „zufrieden mit“ einem Ergebnis." } },
  { pattern: /einmaliges Hören|verpasster Information/, patch: { principle: "Akzeptiere eine Lücke, markiere sie knapp und höre sofort beim aktuellen Satz weiter.", example: "Wenn ein Preis fehlt, notiere „€?“ und folge weiter dem Ort und Termin, statt innerlich zurückzuspulen." } },
  { pattern: /Korrekturen|Selbstverbesserungen/, patch: { principle: "Überschreibe die erste Information, sobald der Sprecher sie ausdrücklich korrigiert.", example: "„Am Freitag – entschuldigen Sie, ich meine Samstag – bleibt das Büro geschlossen.“ Richtig ist Samstag." } },
  { pattern: /Schreibanlass|Empfänger|Aufgabe A oder B/, patch: { principle: "Wähle die Aufgabe, bei der du Empfänger, Ziel und Inhaltspunkte am schnellsten konkretisieren kannst.", example: "Bei einer Beschwerde an einen Kursanbieter sind Anlass, Problem und gewünschte Lösung sofort planbar." } },
  { pattern: /Inhaltspunkte|Zusatzidee/, patch: { principle: "Wähle drei ergiebige Punkte und ergänze eine eigene Idee, die direkt zum Kommunikationsziel beiträgt.", example: "Problem schildern, Folgen erklären, Lösung vorschlagen; Zusatzidee: Ersatztermin anbieten." } },
  { pattern: /Betreff|Einstieg|Situation klar/, patch: { principle: "Nenne Anlass und Ziel früh, damit der Empfänger den Text sofort einordnen kann.", example: "Betreff: „Rückfrage zu meiner Kursanmeldung“ – Einstieg: „Ich habe mich am Montag online angemeldet, aber noch keine Bestätigung erhalten.“" } },
  { pattern: /Beschwerde|gewünschte Lösung|Erwartung/, patch: { principle: "Trenne überprüfbare Fakten von Bewertung und formuliere anschließend eine konkrete, realistische Lösung.", example: "„Der Kurs begann an drei Tagen 20 Minuten später. Daher bitte ich um eine anteilige Erstattung.“" } },
  { pattern: /Absätze|Kohäsion/, patch: { principle: "Gib jedem Absatz genau eine Funktion und verknüpfe Gedanken semantisch statt mit Konnektoren-Ketten.", example: "Absatz 1 Anlass, Absatz 2 Problem und Folgen, Absatz 3 Lösung und Abschluss." } },
  { pattern: /150 Wörter|30-Minuten/, patch: { principle: "Plane kurz, schreibe zügig und reserviere mindestens fünf Minuten für eine gezielte Korrekturrunde.", example: "4 Minuten planen, 20 Minuten schreiben, 6 Minuten prüfen ergibt einen kontrollierbaren 30-Minuten-Prozess." } },
  { pattern: /Stichpunkte|90 Sekunden|strukturieren/, patch: { principle: "Nutze drei bis fünf Stichpunkte und eine klare Reihenfolge; formuliere erst beim Sprechen vollständige Sätze.", example: "Situation – wichtigstes Ereignis – Ergebnis – persönliche Bewertung ergibt einen stabilen 90-Sekunden-Beitrag." } },
  { pattern: /Zustimmen|widersprechen|Position/, patch: { principle: "Nenne deine Position klar, beziehe dich auf den Partner und begründe die Nuance.", example: "„Im Grundsatz stimme ich dir zu. Bei den Kosten sehe ich es jedoch anders, weil …“" } },
  { pattern: /Vorschläge|Alternativen|Kompromiss|Einigung/, patch: { principle: "Formuliere einen konkreten Vorschlag, prüfe Kriterien und entwickle bei Einwänden eine echte Alternative.", example: "„Wir könnten vormittags starten. Falls das zu früh ist, wäre 13 Uhr ein guter Kompromiss.“" } },
  { pattern: /Aussprache|Intonation|Flüssigkeit/, patch: { principle: "Sprich in Sinnabschnitten, betone Schlüsselwörter und nutze kurze Denkpausen statt Fülllaute.", example: "„Für mich sind DREI Punkte wichtig: die Kosten | die Zeit | und die Erreichbarkeit.“" } },
  { pattern: /60-Prozent|Prüfungsreife/, patch: { principle: "Prüfe schriftliche und mündliche Leistung getrennt; ein starker Teil gleicht eine nicht bestandene Teilprüfung nicht aus.", example: "Schriftlich 67 % und mündlich 58 % bedeutet noch nicht bereit, obwohl der kombinierte Eindruck positiv wirkt." } },
];

function guideFor(node: CurriculumNode): Guide {
  const base = baseGuides[node.module];
  const special = specialGuides.find((entry) => entry.pattern.test(node.title));
  return { ...base, ...(special?.patch ?? {}) };
}

function rotateOptions(correct: string, wrong: string[], seed: number) {
  const options = [correct, ...wrong];
  const offset = seed % options.length;
  const rotated = options.slice(offset).concat(options.slice(0, offset));
  return { options: rotated, correctIndex: rotated.indexOf(correct) };
}

function makeExercise(node: CurriculumNode, index: number, prompt: string, correct: string, wrong: string[], explanation: string): LessonExercise {
  const arranged = rotateOptions(correct, wrong, node.sequence + index);
  return {
    id: `${node.id}-EX-${index + 1}`,
    prompt,
    options: arranged.options,
    correctIndex: arranged.correctIndex,
    explanation,
    errorCode: `${node.module.toUpperCase()}_${index === 0 ? "PRINCIPLE" : index === 1 ? "TRANSFER" : "CHECK"}`,
  };
}

export function getLesson(nodeId: string): Lesson | null {
  const node = nodes.find((item) => item.id === nodeId);
  if (!node) return null;
  const guide = guideFor(node);
  const exercises = [
    makeExercise(
      node,
      0,
      `Welche Strategie passt am besten zu „${node.title}“?`,
      guide.principle,
      ["Zuerst jedes unbekannte Wort übersetzen und erst danach die Aufgabe lesen.", "Die erste plausible Lösung wählen und den Kontext nicht mehr prüfen.", "Nur auf einzelne Schlüsselwörter reagieren, auch wenn der Gesamtsatz widerspricht."],
      `Richtig: ${guide.principle}`,
    ),
    makeExercise(
      node,
      1,
      "Welches Beispiel zeigt die Strategie korrekt?",
      guide.example,
      ["Eine Entscheidung wird nur nach einem bekannten Einzelwort getroffen.", "Die Aufgabe wird ohne Empfänger, Kontext oder Textbeleg beantwortet.", "Nach einem Fehler wird exakt dieselbe Antwort ohne neue Prüfung wiederholt."],
      `Das Beispiel verbindet die Station mit einem konkreten B2-Kontext: ${guide.example}`,
    ),
    makeExercise(
      node,
      2,
      "Welche Kontrollfrage gehört an das Ende?",
      guide.check,
      ["Habe ich möglichst viele schwierige Wörter benutzt?", "Klingt meine Antwort spontan genug, auch ohne Beleg?", "Kann ich die Lösung allein an der Länge erkennen?"],
      `Die Kontrollfrage verhindert einen typischen Schnellfehler: ${guide.check}`,
    ),
  ];

  const lesson: Lesson = {
    node,
    goal: node.learner_outcome,
    englishHelp: `${guide.english} This station focuses on “${node.title}”.`,
    principle: guide.principle,
    explanation: `${guide.explanation} In dieser Station liegt der Fokus auf „${node.title}“. Die Technik wird zuerst an einem Modell gezeigt und danach in drei neuen Situationen geprüft.`,
    examples: [
      { label: "Beispiel", text: guide.example },
      { label: "Kontrast", text: guide.contrast },
    ],
    exercises,
    repair: `Wenn du unsicher bist, reduziere die Aufgabe auf das Signal hinter „${node.title}“. Vergleiche danach das richtige Beispiel mit dem Kontrast und bearbeite eine neue Variante, ohne die alte Antwort zu kopieren.`,
    recap: [guide.principle, guide.check, `Prüfungsbezug: ${node.exam_alignment}`],
  };

  if (node.module === "listening") {
    lesson.listeningScript = `Guten Tag. Hier ist eine kurze Mitteilung für das Training „${node.title}“. Der ursprünglich genannte Termin am Dienstag gilt nicht mehr. Die Veranstaltung findet am Donnerstag um siebzehn Uhr im Raum zweihundertvier statt. Bitte bringen Sie Ihre Anmeldebestätigung mit. Bei Fragen melden Sie sich bis Mittwochmittag im Kursbüro.`;
  }
  if (node.module === "speaking") {
    lesson.speakingPrompt = `Sprechen Sie etwa 90 Sekunden über „${node.title}“. Nennen Sie Ihre Position, einen Grund und ein konkretes Beispiel. Reagieren Sie anschließend mit einer Rückfrage an Ihre Gesprächspartnerin oder Ihren Gesprächspartner.`;
  }
  if (node.module === "writing") {
    lesson.writingPrompt = `Sie besuchen einen berufsbegleitenden Deutschkurs. Schreiben Sie an die Kursleitung. Bearbeiten Sie „${node.title}“ sichtbar, erklären Sie den Anlass und formulieren Sie eine konkrete Bitte oder Lösung. Schreiben Sie mindestens 150 Wörter in einem passenden halbformellen Register.`;
  }
  return lesson;
}

export function getClientLesson(nodeId: string) {
  const lesson = getLesson(nodeId);
  if (!lesson) return null;
  return {
    ...lesson,
    exercises: lesson.exercises.map((exercise) => ({ id: exercise.id, prompt: exercise.prompt, options: exercise.options, explanation: exercise.explanation, errorCode: exercise.errorCode })),
  };
}

export function scoreExercise(nodeId: string, exerciseId: string, answerIndex: number) {
  const lesson = getLesson(nodeId);
  const exercise = lesson?.exercises.find((item) => item.id === exerciseId);
  if (!lesson || !exercise) return null;
  const correct = exercise.correctIndex === answerIndex;
  return {
    correct,
    correctIndex: exercise.correctIndex,
    explanation: exercise.explanation,
    errorCode: correct ? null : exercise.errorCode,
  };
}

export function getNode(nodeId: string) {
  return nodes.find((item) => item.id === nodeId) ?? null;
}

export function getNodesByModule(module: ModuleId) {
  return nodes.filter((item) => item.module === module);
}

export function getNextNode(nodeId: string) {
  const index = nodes.findIndex((item) => item.id === nodeId);
  return index >= 0 ? nodes[index + 1] ?? null : null;
}

export function assertCurriculumIntegrity() {
  const ids = new Set(nodes.map((node) => node.id));
  const missing = nodes.flatMap((node) => node.prerequisites.filter((id) => !ids.has(id)).map((id) => `${node.id}:${id}`));
  if (nodes.length !== 132 || ids.size !== 132 || missing.length) {
    throw new Error(`Curriculum integrity failed: ${nodes.length} nodes, ${ids.size} unique, missing ${missing.join(",")}`);
  }
  return { nodeCount: nodes.length, edgeCount: SKILL_EDGES.length, contentVersion: CONTENT_VERSION };
}

export const CURRICULUM_META = assertCurriculumIntegrity();
