const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.join(__dirname, 'pack');
const write = (rel, content) => {
  const p = path.join(root, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content.trimEnd() + '\n', 'utf8');
};

const modules = [
  { key: 'foundation', prefix: 'FND', count: 18, exam: 'Cross-module prerequisite and diagnostic readiness' },
  { key: 'reading', prefix: 'RDG', count: 24, exam: 'Leseverstehen Teile 1–3' },
  { key: 'language_elements', prefix: 'LNG', count: 24, exam: 'Sprachbausteine Teile 1–2' },
  { key: 'listening', prefix: 'LST', count: 18, exam: 'Hörverstehen Teile 1–3' },
  { key: 'writing', prefix: 'WRT', count: 18, exam: 'Schriftlicher Ausdruck: halbformelle E-Mail' },
  { key: 'speaking', prefix: 'SPK', count: 18, exam: 'Mündlicher Ausdruck Teile 1–3' },
  { key: 'integration', prefix: 'INT', count: 12, exam: 'Module checkpoints, mock exams, repair and readiness' },
];

const titles = {
  foundation: [
    'Prüfungsformat und Zeitplan verstehen','Diagnostik und persönliches Zielprofil','Satzklammer sicher erkennen','Verbposition im Hauptsatz','Verbposition im Nebensatz','Kasus-Signale erkennen','Artikel- und Pronomenreferenz','Zeitformen für Alltag und Bericht','Modalität und Höflichkeit','Konnektoren nach Funktion ordnen','Wortbildung und Wortfamilien','Paraphrasen statt Wortgleichheit','Negation und Einschränkungen','Zahlen, Daten und Zeitangaben','Register: privat, neutral, halbformell','Selbstkorrektur mit Fehlercodes','Zeitmanagement unter Prüfungsdruck','Lernstrategie und Review-Routine'
  ],
  reading: [
    'Leseziel vor dem Lesen setzen','Textsorte und Kommunikationsziel erkennen','Globales Thema in einem Satz erfassen','Schlüsselwörter ohne Übersetzung markieren','Überschriften nach Kernaussage zuordnen','Teil 1: überzählige Optionen ausschließen','Teil 1: fünf Texte unter Zeitdruck','Detailfragen in Suchaufträge umwandeln','Belegstellen präzise lokalisieren','Synonyme und Umschreibungen verbinden','Kontrastmarker korrekt deuten','Negation und doppelte Negation prüfen','Quantoren und Einschränkungen beachten','Teil 2: drei Antwortoptionen vergleichen','Teil 2: plausible Ablenker entlarven','Teil 2: fünf Fragen unter Zeitdruck','Anzeigen und Kurztexte scannen','Bedürfnismerkmale in Kriterien zerlegen','Teil 3: eindeutige Matches belegen','Teil 3: kein passendes Angebot erkennen','Unbekannte Wörter aus Kontext erschließen','Lesefluss und Rücksprung begrenzen','Gemischtes Lesetraining 20 Aufgaben','Leseverstehen-Checkpoint 75 Punkte'
  ],
  language_elements: [
    'Lückenkontext: Satzgrenzen und Bezüge','Konjunktionen für Ursache und Folge','Konzessive und adversative Verknüpfung','Temporale und konditionale Verknüpfung','Relativpronomen nach Kasus','Pronomen und Pronominaladverbien','Präpositionen mit festem Kasus','Wechselpräpositionen im Kontext','Verbvalenz und Ergänzungen','Trennbare und untrennbare Verben','Passivformen im Gebrauch','Konjunktiv II für Irrealität und Höflichkeit','Infinitiv mit zu und Ersatzkonstruktionen','Adjektivdeklination mit Signalen','N-Deklination und Nominalgruppen','Teil 1: Grammatik-Cloze 10 Lücken','Verb-Nomen-Verbindungen','Adjektiv-Präposition-Verbindungen','Nomen-Präposition-Verbindungen','Kollokationen im Sachtext','Register und idiomatische Auswahl','Teil 2: Wortkasten strategisch reduzieren','Gemischte Sprachbausteine 20 Lücken','Sprachbausteine-Checkpoint 30 Punkte'
  ],
  listening: [
    'Aufgaben vor dem Hören prognostizieren','Einmaliges Hören strategisch akzeptieren','Globalthema einer Nachricht erkennen','Meldungswechsel akustisch markieren','Teil 1: fünf Aussagen entscheiden','Interviewstruktur und Rollen verfolgen','Details mit Kurznotation sichern','Korrekturen und Selbstverbesserungen hören','Negation, Einschränkung und Kontrast hören','Zahlen, Namen, Orte und Termine sichern','Paraphrasen zwischen Audio und Aussage','Teil 2: zehn Aussagen entscheiden','Ansagen nach Zweck klassifizieren','Relevante Einzelinformation extrahieren','Teil 3: fünf Kurztexte entscheiden','Nach verpasster Information weiterhören','Gemischtes Hörtraining 20 Aufgaben','Hörverstehen-Checkpoint 75 Punkte'
  ],
  writing: [
    'Schreibanlass und Empfänger analysieren','Aufgabe A oder B schnell wählen','Drei Inhaltspunkte strategisch auswählen','Eigene Zusatzidee passend entwickeln','Halbformelle Anrede und Schlussformel','Betreff und Einstieg funktional schreiben','Situation klar und knapp erklären','Informationen höflich erfragen','Beschwerde sachlich formulieren','Erwartung und gewünschte Lösung ausdrücken','Gründe und Beispiele ausbauen','Absätze nach Funktion strukturieren','Kohäsion ohne Konnektoren-Ketten','Register konsequent halten','Formale Richtigkeit gezielt prüfen','Mindestens 150 Wörter sinnvoll planen','30-Minuten-Schreibprozess trainieren','Vollständige E-Mail als Checkpoint'
  ],
  speaking: [
    'Prüfungsablauf und Partnerformat','Vorbereitung: Stichpunkte statt Manuskript','Erfahrung in 90 Sekunden strukturieren','Vergangenheit und Reihenfolge klar markieren','Persönliche Bewertung begründen','Rückfragen stellen und beantworten','Diskussionstext knapp zusammenfassen','Eigene Position klar eröffnen','Zustimmen, widersprechen und nuancieren','Argumente mit Beispiel und Folge entwickeln','Gesprächsbeiträge aufgreifen','Lösungen statt Monologe entwickeln','Planungsaufgabe in Kriterien zerlegen','Vorschläge machen und Alternativen anbieten','Priorisieren, Kompromiss und Einigung','Klärungs- und Reparaturstrategien','Aussprache, Intonation und Flüssigkeit','Vollständige mündliche Simulation'
  ],
  integration: [
    'Startdiagnostik über alle Module','Individuellen Lernpfad erzeugen','Rezeptiver Mini-Mock','Produktiver Mini-Mock','Schriftliche Prüfung vollständig simulieren','Mündliche Prüfung vollständig simulieren','Fehlermuster in Skill-Tags übersetzen','Sieben-Tage-Reparatursprint','Spaced Review vor der Prüfung','Zweiter Voll-Mock mit Vergleich','60-Prozent-Hürden getrennt prüfen','Finale Prüfungsreife-Entscheidung'
  ]
};

const foundationDeps = {
  reading: ['FND-002','FND-010','FND-012','FND-013'],
  language_elements: ['FND-003','FND-004','FND-005','FND-006','FND-010'],
  listening: ['FND-002','FND-012','FND-013','FND-014'],
  writing: ['FND-005','FND-009','FND-010','FND-015','FND-016'],
  speaking: ['FND-008','FND-009','FND-010','FND-015'],
  integration: ['RDG-024','LNG-024','LST-018','WRT-018','SPK-018']
};

const nodes = [];
for (const mod of modules) {
  titles[mod.key].forEach((title, i) => {
    const sequence = i + 1;
    const id = `${mod.prefix}-${String(sequence).padStart(3,'0')}`;
    let prerequisites = [];
    if (mod.key === 'foundation') {
      if (sequence > 2) prerequisites = [`FND-${String(sequence - 1).padStart(3,'0')}`];
    } else if (sequence === 1) {
      prerequisites = foundationDeps[mod.key] || [];
    } else {
      prerequisites = [`${mod.prefix}-${String(sequence - 1).padStart(3,'0')}`];
      if (sequence % 6 === 0 && sequence > 6) prerequisites.push(`${mod.prefix}-${String(sequence - 5).padStart(3,'0')}`);
    }
    const checkpoint = /Checkpoint|Simulation|Mock|Entscheidung|20 Aufgaben|20 Lücken/.test(title);
    const productive = ['writing','speaking'].includes(mod.key);
    nodes.push({
      id, module: mod.key, sequence, title,
      learner_outcome: `Lernende können „${title}“ in einer neuen, original erstellten telc-B2-nahen Aufgabe selbstständig anwenden.`,
      exam_alignment: mod.exam,
      lesson_minutes: checkpoint ? 25 : 8,
      prerequisites,
      practice_types: checkpoint ? ['timed_checkpoint','error_review'] : productive ? ['guided_production','micro_drill','self_check'] : ['worked_example','deterministic_drill','retrieval_review'],
      mastery: { threshold: checkpoint ? 0.70 : 0.80, minimum_attempts: checkpoint ? 1 : 3, transfer_required: true },
      remediation: `Bei Fehlern: Diagnose auf ${id}, kurze Kontrastübung, danach neuer Parallel-Item statt Wiederholung desselben Items.`,
      content_status: checkpoint ? 'blueprint_ready' : 'definition_ready',
      copyright: 'original_content_only'
    });
  });
}

if (nodes.length !== 132) throw new Error(`Expected 132 nodes, got ${nodes.length}`);
const edges = nodes.flatMap(n => n.prerequisites.map(p => ({ from: p, to: n.id, type: 'prerequisite' })));

const examSpec = `# Verified telc Deutsch B2 exam specification

Status: verified 2026-10-07 against official telc sources. Scope: **telc Deutsch B2 (general German)**, not B2+ Beruf, DTB B2, Medizin, or B2·C1 Beruf.

## Exam structure

| Section | Parts and task focus | Items / production | Time | Max points | Weight |
|---|---|---:|---:|---:|---:|
| Leseverstehen | 1 global matching; 2 detail multiple choice; 3 selective matching | 5 + 5 + 10 | shared 90 min with Sprachbausteine | 75 | 25% |
| Sprachbausteine | 1 grammar MC cloze; 2 lexical matching cloze | 10 + 10 | shared 90 min with reading | 30 | 10% |
| Hörverstehen | 1 global true/false; 2 detail true/false; 3 selective true/false | 5 + 10 + 5 | approx. 20 min | 75 | 25% |
| Schriftlicher Ausdruck | choose one of two prompts; semi-formal email, at least 150 words | 1 | 30 min | 45 | 15% |
| Mündlicher Ausdruck | 1 experience; 2 discussion; 3 joint planning | 3 | approx. 15 min for two candidates; 20 min preparation | 75 | 25% |

No break is scheduled inside the written examination. The oral exam is normally a pair exam; three candidates take approximately 25 minutes.

## Scoring and pass rule

- Total: 300 points. Written examination: 225; oral examination: 75.
- Passing requires **at least 60% in each part separately**: 135/225 written and 45/75 oral. A high written score cannot compensate for an oral fail, or vice versa.
- Overall grades after both thresholds are met: 270–300 very good; 240–269.5 good; 210–239.5 satisfactory; 180–209.5 sufficient.
- Writing is rated on task fulfilment, communicative design, and formal correctness. Each criterion is 5/3/1/0 before multiplication by three (45 maximum).
- Speaking is rated in every part for expression, task management, formal correctness, and pronunciation/intonation. Each speaking part contributes up to 25 points.

## Product implications

1. Track written and oral readiness separately and block a “ready” label unless both projected scores clear 60% with margin.
2. Train reading and language elements under a shared 90-minute budget.
3. All listening simulations default to one playback, while teaching mode may allow replay.
4. Writing tasks must enforce prompt choice, three covered content aspects, semi-formal register, minimum 150 words, and a 30-minute mode.
5. Speaking practice must be interactive; monologue-only practice is insufficient for Parts 2 and 3.
6. Practice content must be original. Official materials are used to verify format and rubrics, not copied into production.

## Sources

See \`sources/SOURCE_REGISTRY.csv\`. Primary evidence: official telc product page, official 2021 mock examination, official handbook, and official preparation tips.
`;

const projectSpec = `# Product specification

## Product

A self-paced, exam-centered learning platform for **telc Deutsch B2 general German**. It turns the verified exam model into a dependency-aware 132-node curriculum, short lessons, deterministic practice, checkpoints, targeted repair, and visible readiness.

## User and problem

The primary learner balances study or work, has uneven B1/B2 skills, and needs a concrete certificate outcome. Existing courses are often linear, generic, expensive, or fragmented across books, flashcards, chatbots, and notes.

## Product principles

- Backward-design from the verified exam tasks and rubrics.
- Curriculum intelligence before decorative gamification.
- Deterministic scoring for closed tasks; AI only for language that genuinely needs interpretation.
- Diagnose the failed skill, teach a tiny repair, then retry with a new parallel item.
- Permit diagnostic skipping without hiding critical gaps.
- Separate written and oral readiness because telc applies separate pass thresholds.
- Original production content only; references carry provenance and license notes.

## Core loop

Map → node lesson → retrieval cards → practice → mastery update → checkpoint → targeted review → next unlock.

## Functional requirements

1. Placement: sample all six learning domains and create an initial mastery vector.
2. Map: render 132 nodes from \`NODE_DEFINITIONS.json\` and prerequisites from \`SKILL_GRAPH.json\`.
3. Lesson: render concept, contrast, examples, micro-practice, recap, and next action.
4. Practice: support MC, matching, cloze, ordering, error correction, short response, writing, and speaking evidence.
5. Progress: event-sourced attempts plus computed per-skill mastery and review due dates.
6. Checkpoints: timed and untimed, with blueprint coverage and repair routing.
7. Readiness: projected written score, oral score, confidence band, and weakest critical nodes.
8. Content ops: schema validation, source provenance, linguistic QA, copyright QA, and release status.

## Non-goals for MVP

- Social feed, live tutoring marketplace, generative avatars, open-ended chatbot home screen, or full speech scoring.
- Reproducing commercial or official exam items.
- Claiming an official telc partnership or guaranteeing a pass.

## Success criteria

- A new learner completes placement and receives a usable path in under 12 minutes.
- The vertical slice persists attempts, updates mastery, unlocks the next node, and schedules review.
- Every released content item validates against schemas and has author/QA/provenance metadata.
- Readiness never reports “ready” when either projected written or oral result is below 60%.
`;

const learningEngine = `# Learning and mastery engine

## State model

The immutable unit is an attempt event. Derived state is rebuilt from attempts, checkpoint results, manual overrides, and content-version migrations. Store mastery per atomic skill, not per page visited.

## Evidence weights

| Evidence | Base weight |
|---|---:|
| first-try deterministic item | 1.00 |
| corrected retry | 0.45 |
| delayed retrieval (>=24h) | 1.20 |
| transfer item in new context | 1.35 |
| module checkpoint | 1.50 |
| full mock aligned to rubric | 2.00 |

Compute a decayed weighted accuracy over the last 12 meaningful observations. Apply recency half-life 30 days, cap repeated same-template evidence at 35%, and lower confidence when fewer than three observations exist.

## Mastery states

- unseen: no evidence
- learning: score <0.65 or confidence low
- practiced: score 0.65–0.79
- mastered: score >=0.80, at least three observations, and one transfer observation
- review_due: mastered but recency threshold exceeded or recent failure occurred

## Unlocking

A node unlocks when every hard prerequisite is mastered or explicitly waived by diagnostic evidence. Checkpoints cannot be waived. Optional enrichment edges influence recommendations but never block.

## Failure loop

1. Tag error to one or more skills and error codes.
2. Show a 2–4 minute repair with one contrast and one worked example.
3. Serve a fresh parallel item.
4. Update mastery with reduced weight for an immediate retry.
5. Schedule a delayed retrieval in 1, 3, 7, then 21 days.

## Readiness

Compute written readiness from reading, language elements, listening, and writing evidence using official point weights (75/30/75/45). Compute oral readiness separately from speaking. Display a confidence interval. “Ready” requires both projected parts >=65%, at least one recent full simulation in each part, and no critical module checkpoint below 60%.

## AI boundary

AI may propose feedback for free writing/speaking, but it does not directly mutate mastery. A deterministic rubric adapter converts accepted feedback into bounded evidence, stores model/version/prompt, and allows human review.
`;

const architecture = `# Technical architecture

## Suggested MVP stack

- Web: Next.js/React with accessible server-rendered lesson routes.
- API: typed application service; REST or tRPC are both acceptable.
- Data: PostgreSQL. Store canonical content in versioned JSON files, then import to relational read models.
- Auth: managed OAuth/email provider.
- Audio: object storage plus signed URLs; original scripts and recordings only.
- Validation: JSON Schema 2020-12 in CI and at import time.
- AI: provider adapter with structured outputs, rate limits, audit log, and deterministic fallback.

## Bounded contexts

1. Content registry: nodes, lessons, exercises, checkpoints, sources, versions.
2. Learning graph: prerequisites, unlock rules, placement waivers.
3. Attempt ledger: append-only answers and scoring traces.
4. Mastery projection: per-skill state and review schedule.
5. Assessment: checkpoint sessions, timers, rubric evidence, readiness.
6. AI feedback: isolated request/response records; no direct writes to mastery.

## Core tables

\`content_versions\`, \`nodes\`, \`edges\`, \`lessons\`, \`exercises\`, \`checkpoints\`, \`users\`, \`attempts\`, \`skill_mastery\`, \`review_queue\`, \`assessment_sessions\`, \`rubric_scores\`, \`ai_feedback_runs\`, \`source_records\`.

## Import contract

Validate → reject unknown IDs → topologically sort graph → reject cycles → check all prerequisites → verify released nodes have lesson and assessment evidence → atomically publish a content version.

## Security and privacy

Minimize learner PII; encrypt recordings; configurable deletion; do not send personal data to AI providers; redact prompts; log provider/model/cost without storing secrets; rate-limit uploads and generation.
`;

const contentModel = `# Content model

## Canonical hierarchy

Exam → module → node → atomic skills → lesson blocks → practice items → checkpoint blueprint → attempt evidence.

## Release statuses

\`draft\` → \`linguistic_review\` → \`assessment_review\` → \`copyright_review\` → \`ready\` → \`released\` → \`retired\`.

## Required guarantees

- IDs are stable and never reused.
- Every node has an outcome, exam alignment, prerequisites, practice types, mastery rule, remediation, and copyright flag.
- Every exercise has exactly one scoring strategy; deterministic items include an answer key and explanation.
- Free-form prompts include a rubric, reference constraints, and human-readable scoring disclaimer.
- Every external factual claim has a source record; production passages are original and have no copied source text.
- Any changed released item increments \`content_version\` and records migration impact.

## Localization

Learner-facing German is the default. Editorial notes may be English. Keep prompt text separate from UI labels; never embed UI behavior inside lesson prose.
`;

const assessment = `# Assessment, scoring, and readiness

## Formative assessment

Use deterministic item scoring for MC, matching, cloze, ordering, and tagged error correction. Award full evidence only on first try. Explanations identify why the right answer fits and why the strongest distractor fails.

## Productive assessment

Writing rubric mirrors the official dimensions at a high level: task fulfilment, communicative design, and formal correctness. Speaking uses expression, task management, formal correctness, and pronunciation/intonation. Platform scores are **practice estimates**, never official telc results.

## Checkpoint blueprint

Each checkpoint declares skills, item counts, time, scoring rules, parallel forms, pass threshold, and repair routing. A released form must have no orphan item, duplicate answer pattern, copied source passage, or unreviewed free-form rubric.

## Readiness gate

- Written: projected >=65%, official-style module simulations present, no critical checkpoint <60%.
- Oral: projected >=65%, complete recent pair-format simulation or coached substitute, no speaking part <60%.
- Overall: both gates true. Show 60% as the official minimum and 65% as the product safety margin.

## Calibration

Before claiming predictive accuracy, compare practice projections with voluntary real outcomes, stratify by module, monitor bias by device/accent/background where data is lawful, and publish uncertainty. Until calibrated, label readiness as an estimate.
`;

const mvp = `# MVP implementation plan

## Goal

Ship one coherent vertical slice, then expand content without reworking the data model.

## Milestones

| Milestone | Deliverable | Acceptance |
|---|---|---|
| M0 Content contracts | schemas, 132-node catalog, graph importer | all files validate; graph has 132 nodes, no missing prerequisite, no cycle |
| M1 Learning shell | auth, map, node route, lesson renderer | learner can resume and see locked/unlocked states |
| M2 Deterministic practice | MC/cloze/matching, attempt ledger, explanations | first-try vs retry evidence stored correctly |
| M3 Mastery loop | mastery projection, repair, spaced review | failed item creates repair and delayed review |
| M4 Vertical slice | WRT-005 plus LNG-002 path and checkpoint | end-to-end persistence and unlock verified |
| M5 Placement | 18–24 item diagnostic and waivers | path generated in <=12 minutes; checkpoints remain required |
| M6 Productive feedback | writing rubric workflow behind adapter | deterministic prechecks work without AI; AI output auditable |
| M7 Module beta | full writing + language-elements paths | content QA complete; accessibility and timer tests pass |
| M8 Readiness beta | mini-mocks, split readiness, exportable report | written/oral gates use correct official thresholds |

## First sprint backlog

1. Add schema validation and graph integrity tests.
2. Import \`NODE_DEFINITIONS.json\` and render the map.
3. Implement attempt ledger and mastery projection.
4. Author full content for WRT-005 and LNG-002.
5. Add one deterministic checkpoint and repair route.
6. Add CI checks for IDs, sources, copyright fields, and broken references.

## Definition of done

Code tested; content validated; keyboard and screen-reader path checked; German reviewed; sources recorded; no copyrighted third-party passage; analytics event documented; rollback possible.
`;

const qaPlan = `# QA and release checklist

## Automated

- JSON/YAML parses and validates against schemas.
- Exactly 132 curriculum nodes; unique IDs; counts 18/24/24/18/18/18/12.
- Every prerequisite exists; graph is acyclic; every module checkpoint is reachable.
- Released nodes reference available lesson and evidence assets.
- Deterministic items have valid keys, plausible distractors, and no duplicate options.
- Timers, word counts, attempt weights, and 60%/65% thresholds are unit tested.
- URLs in the source registry resolve during scheduled link checks.

## Human linguistic review

Grammar, idiom, collocation, punctuation, register, CEFR fit, clarity of explanations, distractor fairness, and audio transcript accuracy.

## Assessment review

Task-to-skill alignment, blueprint balance, answer-key independence, parallel-form equivalence, time feasibility, and rubric consistency.

## Copyright review

Search distinctive phrases; reject copied or lightly paraphrased passages/questions; verify audio ownership; record licenses; remove trademarks from branding claims; keep telc references nominative and factual.

## Release sign-off

Content editor, linguistic reviewer, assessment reviewer, and copyright reviewer are separate recorded roles where possible. Emergency fixes retain an audit trail and trigger retrospective review.
`;

const aiPolicy = `# AI policy

## Allowed

- Feedback suggestions on original learner writing or speaking.
- Error classification, personalized explanation, and generation of new original parallel practice.
- Internal editorial assistance followed by human review.

## Not allowed

- Scoring deterministic items, inventing exam rules, copying or reconstructing protected exam content, making official-pass guarantees, or directly changing mastery.
- Sending names, emails, raw identifiers, or unnecessary recordings to a provider.

## Controls

Provider abstraction; structured output schema; prompt/version log; temperature and token limits; redaction; consent for recordings; cost ceiling; retry/fallback; moderation; deletion policy; human appeal. AI feedback is labeled as automated and converted into bounded evidence only after rubric checks.
`;

const copyrightPolicy = `# Copyright and source policy

- Use official telc and Council of Europe materials to verify format, objectives, and rubrics.
- Do not reproduce official or publisher passages, item stems, options, audio, answer keys, or branded layouts in production.
- All learner tasks, scripts, recordings, examples, and explanations must be original or explicitly licensed.
- Facts receive a source ID, access date, authority level, URL, and usage note in the registry.
- Quotes are exceptional, short, attributed, and never used as production exercise content.
- “telc” is referenced descriptively. The platform must not imply endorsement, certification, or affiliation.
- Before release, run phrase-similarity review against materials available to the editorial team and record the reviewer and result.
`;

const editorialWorkflow = `# Editorial workflow

1. Researcher opens or updates a source record and extracts only format-level facts.
2. Curriculum designer maps the fact to exam tasks, skills, prerequisites, and evidence.
3. Author writes original lesson and items from a blank page.
4. Linguistic reviewer checks German, B2 fit, register, and explanations.
5. Assessment reviewer checks blueprint and scoring.
6. Copyright reviewer checks provenance and phrase similarity.
7. Release editor validates schemas, assigns content version, and publishes atomically.

No single reviewer should self-approve all stages for a high-stakes checkpoint. Corrections never silently overwrite released content; they create a new version and migration note.
`;

const audit = `# Completion audit and closure matrix

Audit date: 2026-10-07. The earlier Drive package contained a useful product direction but mostly skeleton artifacts. The promised external Deep Research report was not present in the referenced chat, so this audit closes the explicitly requested gaps using the preserved decisions and current official sources.

| Area | Before | Completed artifact | Status |
|---|---|---|---|
| Exam specification | short summary | docs/TELC_B2_EXAM_SPEC.md with format, points, thresholds, implications | closed |
| Curriculum | short module lists | 132-node definitions, catalog, maps, graph, coverage matrix | closed |
| Skill graph | absent | curriculum/SKILL_GRAPH.json and SKILL_GRAPH.md | closed |
| Node definitions | absent | curriculum/NODE_DEFINITIONS.json/.md | closed |
| Sources | placeholder README | verified registry, notes, usage/licensing fields | closed |
| Schemas | three example instances | eight JSON Schema contracts plus YAML authoring template | closed |
| MVP | absent | docs/MVP_IMPLEMENTATION_PLAN.md | closed |
| Prompts | three tiny prompts | seven production prompts with inputs, rules, output checks | closed |
| QA | implicit | docs/QA_AND_RELEASE.md and prompts/RELEASE_QA_PROMPT.md | closed |
| Manifest | skeleton list | complete manifest with hashes and counts | closed |

Known limit: node definitions are implementation-ready curriculum blueprints, not 132 fully authored lessons. “Complete curriculum design” and “complete lesson corpus” are different deliverables. The MVP plan deliberately authors and validates the vertical slice first, then expands through the editorial workflow.
`;

write('README.md', `# telc Deutsch B2 learning platform — implementation pack

This is the canonical implementation handoff for a self-paced, exam-centered platform for **telc Deutsch B2 general German**. It contains a verified exam specification, a 132-node dependency-aware curriculum, schemas, source registry, prompts, QA rules, MVP plan, and original sample content.

## Start here

1. \`START_HERE.md\`
2. \`docs/TELC_B2_EXAM_SPEC.md\`
3. \`docs/PROJECT_SPEC.md\`
4. \`curriculum/CURRICULUM_OVERVIEW.md\`
5. \`curriculum/NODE_CATALOG.csv\` and \`NODE_DEFINITIONS.json\`
6. \`curriculum/SKILL_GRAPH.json\`
7. \`schemas/\`
8. \`docs/MVP_IMPLEMENTATION_PLAN.md\`

## Canonical-source rule

Raw Markdown/JSON/CSV/YAML files in this folder are canonical. Older Google Docs copies at the root are preserved as legacy compatibility copies and are not the source of truth.

## Boundaries

All production learning content must be original. Official telc and CEFR materials are references for facts, format, and high-level assessment criteria only. This project is not affiliated with or endorsed by telc gGmbH.
`);

write('START_HERE.md', `# Start here

## What is complete

- Verified telc Deutsch B2 exam format and scoring.
- Exactly 132 curriculum nodes across foundation, reading, language elements, listening, writing, speaking, and integration.
- Machine-readable catalog, definitions, prerequisites, graph edges, and coverage matrix.
- Versionable contracts for nodes, lessons, exercises, checkpoints, attempts, progress, source records, and content bundles.
- MVP architecture, mastery engine, assessment policy, editorial workflow, QA, AI, copyright, and source policy.
- Original sample lesson, exercises, and checkpoint.

## Recommended build sequence

Validate content → import graph → render map → render one lesson → score deterministic exercise → persist attempt → update mastery → unlock next node → schedule review → run checkpoint.

The first vertical slice is WRT-005 (semi-formal opening/closing) plus LNG-002 (causal connectors), because it exercises lesson rendering, deterministic items, productive prechecks, mastery, and repair.

## Important truth

The node corpus is a complete **curriculum architecture and content blueprint**. It is not 132 fully authored lessons. Full lesson authoring should proceed through the supplied workflow and schemas to avoid low-quality bulk generation.
`);

write('AGENTS.md', `# Agent operating instructions

## Mission
Build the platform from the verified specification and versioned curriculum. Never invent telc rules or treat a model answer as an official score.

## Order of authority
1. Current official telc sources in SOURCE_REGISTRY.csv.
2. Verified exam spec.
3. Released curriculum and schemas.
4. Editorial decisions with a dated record.

## Required workflow
Research → curriculum mapping → original authoring → linguistic review → assessment review → copyright review → schema validation → release.

## Hard rules
- Keep raw files as source of truth.
- Preserve stable IDs and add versions for changes.
- Use deterministic scoring whenever an answer key is possible.
- AI output never directly changes mastery.
- Do not reproduce protected passages, questions, audio, answer keys, or layouts.
- Check both written and oral thresholds independently.
- On failure, route to the smallest implicated skill and use a fresh retry item.

## Before finishing any change
Run schema, graph, reference, content, linguistic, assessment, accessibility, and copyright checks described in docs/QA_AND_RELEASE.md. Update the manifest for added or renamed files.
`);

write('CODEX_START_PROMPT.md', `# Implementation start prompt

Read START_HERE.md, docs/TELC_B2_EXAM_SPEC.md, docs/PROJECT_SPEC.md, curriculum/CURRICULUM_OVERVIEW.md, curriculum/NODE_DEFINITIONS.json, curriculum/SKILL_GRAPH.json, schemas/, and docs/MVP_IMPLEMENTATION_PLAN.md.

Build milestone M0 then M1. Treat curriculum files as versioned source of truth. Validate exactly 132 nodes and an acyclic graph. Do not invent exam rules or copy any external task. Implement deterministic scoring before AI. Keep AI behind an adapter and prevent it from directly mutating mastery. Use the WRT-005 + LNG-002 vertical slice, persist attempts, compute mastery, unlock nodes, and schedule repair/review. Add tests for separate written/oral pass gates.
`);
write('.gitignore', `.env\n.env.*\nnode_modules/\n.next/\ndist/\ncoverage/\n*.log\n*.local\n.DS_Store\nThumbs.db\n`);

write('docs/PROJECT_SPEC.md', projectSpec);
write('docs/TELC_B2_EXAM_SPEC.md', examSpec);
write('docs/LEARNING_ENGINE.md', learningEngine);
write('docs/TECHNICAL_ARCHITECTURE.md', architecture);
write('docs/CONTENT_MODEL.md', contentModel);
write('docs/ASSESSMENT_AND_READINESS.md', assessment);
write('docs/MVP_IMPLEMENTATION_PLAN.md', mvp);
write('docs/QA_AND_RELEASE.md', qaPlan);
write('docs/AI_POLICY.md', aiPolicy);
write('docs/COPYRIGHT_AND_SOURCES_POLICY.md', copyrightPolicy);
write('docs/EDITORIAL_WORKFLOW.md', editorialWorkflow);
write('docs/DECISIONS.md', `# Architecture decisions\n\n- ADR-001: content files are canonical and imported atomically.\n- ADR-002: attempts are append-only; mastery is derived.\n- ADR-003: deterministic scoring precedes AI.\n- ADR-004: written and oral readiness are separate gates.\n- ADR-005: 132 nodes are stable curriculum units; lessons may version independently.\n- ADR-006: official sources inform facts only; production content is original.\n`);

const counts = Object.fromEntries(modules.map(m => [m.key, m.count]));
write('curriculum/CURRICULUM_OVERVIEW.md', `# Curriculum overview\n\nThe architecture contains exactly **132 nodes**.\n\n| Module | Nodes | Purpose |\n|---|---:|---|\n${modules.map(m=>`| ${m.key} | ${m.count} | ${m.exam} |`).join('\n')}\n\n## Design\n\nEvery node has a learner outcome, exam alignment, prerequisites, practice modes, mastery evidence, remediation, status, and copyright rule. Foundation nodes supply reusable language/strategy prerequisites. Each exam module ends in an aligned checkpoint. Integration nodes generate the path, run simulations, diagnose weaknesses, and make a conservative readiness decision.\n\nMachine-readable truth: \`NODE_DEFINITIONS.json\`. Portable inventory: \`NODE_CATALOG.csv\`. Dependencies: \`SKILL_GRAPH.json\`.\n`);

write('curriculum/NODE_DEFINITIONS.json', JSON.stringify({version:'1.0.0',node_count:nodes.length,module_counts:counts,nodes}, null, 2));
write('curriculum/SKILL_GRAPH.json', JSON.stringify({version:'1.0.0',directed:true,node_ids:nodes.map(n=>n.id),edge_count:edges.length,edges}, null, 2));

const csv = ['id,module,sequence,title,exam_alignment,lesson_minutes,prerequisites,status']
  .concat(nodes.map(n => [n.id,n.module,n.sequence,n.title,n.exam_alignment,n.lesson_minutes,n.prerequisites.join('|'),n.content_status].map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')))
  .join('\n');
write('curriculum/NODE_CATALOG.csv', csv);

write('curriculum/NODE_DEFINITIONS.md', `# Node definitions\n\nGenerated human-readable view of the canonical JSON.\n\n${nodes.map(n=>`## ${n.id} — ${n.title}\n\n- Module: ${n.module}; sequence ${n.sequence}; ${n.lesson_minutes} minutes\n- Outcome: ${n.learner_outcome}\n- Exam alignment: ${n.exam_alignment}\n- Prerequisites: ${n.prerequisites.length?n.prerequisites.join(', '):'none'}\n- Practice: ${n.practice_types.join(', ')}\n- Mastery: ${Math.round(n.mastery.threshold*100)}%, ${n.mastery.minimum_attempts} evidence event(s), transfer required\n- Repair: ${n.remediation}\n`).join('\n')}`);

write('curriculum/SKILL_GRAPH.md', `# Skill graph\n\nDirected acyclic prerequisite graph with ${nodes.length} nodes and ${edges.length} edges. JSON is canonical.\n\n## Integrity rules\n\n- IDs must exist in NODE_DEFINITIONS.json.\n- Hard prerequisites block unlock unless waived by placement; checkpoints are never waived.\n- Cycles fail the import.\n- Cross-module integration begins only after module checkpoints.\n\n## Module roots\n\n${modules.map(m=>`- ${m.key}: ${m.prefix}-001`).join('\n')}\n\n## Module terminal nodes\n\n${modules.map(m=>`- ${m.key}: ${m.prefix}-${String(m.count).padStart(3,'0')}`).join('\n')}\n`);

const moduleFileNames = {reading:'READING_MAP.md',language_elements:'SPRACHBAUSTEINE_MAP.md',listening:'LISTENING_MAP.md',writing:'WRITING_MAP.md',speaking:'SPEAKING_MAP.md',integration:'INTEGRATION_MAP.md'};
for (const [key,file] of Object.entries(moduleFileNames)) {
  const ns=nodes.filter(n=>n.module===key);
  write(`curriculum/${file}`, `# ${key.replaceAll('_',' ')} map\n\n| Seq | Node | Focus | Prerequisite |\n|---:|---|---|---|\n${ns.map(n=>`| ${n.sequence} | ${n.id} | ${n.title} | ${n.prerequisites.join(', ')} |`).join('\n')}\n\n## Exit evidence\n\nComplete ${ns.at(-1).id} and meet its threshold; mastery is retained only with delayed retrieval and transfer evidence.\n`);
}
write('curriculum/MODULE_MAPS.md', `# Module maps\n\nThis index preserves the original progression idea and links it to exact nodes.\n\n${modules.map(m=>`## ${m.key}\n\n${nodes.filter(n=>n.module===m.key).map(n=>`${n.id} ${n.title}`).join(' → ')}\n`).join('\n')}\n`);
write('curriculum/EXAM_COVERAGE_MATRIX.csv', `exam_component,module,node_range,official_max_points,weight,terminal_evidence\nLeseverstehen,reading,RDG-001..RDG-024,75,25%,RDG-024\nSprachbausteine,language_elements,LNG-001..LNG-024,30,10%,LNG-024\nHörverstehen,listening,LST-001..LST-018,75,25%,LST-018\nSchriftlicher Ausdruck,writing,WRT-001..WRT-018,45,15%,WRT-018\nMündlicher Ausdruck,speaking,SPK-001..SPK-018,75,25%,SPK-018\n`);

const schemaHeader = { '$schema':'https://json-schema.org/draft/2020-12/schema' };
const nodeSchema = {...schemaHeader,'$id':'https://example.local/schemas/node.schema.json',title:'Curriculum node',type:'object',additionalProperties:false,required:['id','module','sequence','title','learner_outcome','exam_alignment','lesson_minutes','prerequisites','practice_types','mastery','remediation','content_status','copyright'],properties:{id:{type:'string',pattern:'^(FND|RDG|LNG|LST|WRT|SPK|INT)-[0-9]{3}$'},module:{enum:modules.map(m=>m.key)},sequence:{type:'integer',minimum:1},title:{type:'string',minLength:3},learner_outcome:{type:'string',minLength:20},exam_alignment:{type:'string'},lesson_minutes:{type:'integer',minimum:3,maximum:60},prerequisites:{type:'array',uniqueItems:true,items:{type:'string'}},practice_types:{type:'array',minItems:1,uniqueItems:true,items:{type:'string'}},mastery:{type:'object',additionalProperties:false,required:['threshold','minimum_attempts','transfer_required'],properties:{threshold:{type:'number',minimum:0,maximum:1},minimum_attempts:{type:'integer',minimum:1},transfer_required:{type:'boolean'}}},remediation:{type:'string'},content_status:{enum:['definition_ready','blueprint_ready','draft','review','released','retired']},copyright:{const:'original_content_only'}}};
write('schemas/NODE_SCHEMA.json',JSON.stringify(nodeSchema,null,2));
write('schemas/SKILL_SCHEMA.yaml', `# Authoring template; NODE_SCHEMA.json is normative\nid: WRT-005\nmodule: writing\nsequence: 5\ntitle: Halbformelle Anrede und Schlussformel\nlearner_outcome: Lernende wählen passende Formeln für Empfänger und Situation.\nexam_alignment: Schriftlicher Ausdruck\nlesson_minutes: 8\nprerequisites: [WRT-004]\npractice_types: [micro_drill, guided_production, self_check]\nmastery: {threshold: 0.8, minimum_attempts: 3, transfer_required: true}\nremediation: Contrast formal and informal formulas, then serve a new item.\ncontent_status: definition_ready\ncopyright: original_content_only\n`);

const objectSchema = (title, required, properties) => ({
  ...schemaHeader,
  title,
  type: 'object',
  additionalProperties: false,
  required,
  properties
});
const schemas = {};
schemas['LESSON_SCHEMA.json'] = objectSchema('Lesson',
  ['id','node_id','version','language','estimated_minutes','blocks','status'], {
    id:{type:'string'}, node_id:{type:'string'}, version:{type:'string'}, language:{const:'de'},
    estimated_minutes:{type:'integer',minimum:3,maximum:20},
    blocks:{type:'array',minItems:4,items:{type:'object',required:['type','content'],properties:{
      type:{enum:['goal','explanation','example','contrast','practice','recap','next_action']},
      content:{type:'string'}, skill_tags:{type:'array',items:{type:'string'}}
    }}},
    status:{enum:['draft','review','released']}, source_ids:{type:'array',items:{type:'string'}}
  });
schemas['EXERCISE_SCHEMA.json'] = objectSchema('Exercise',
  ['id','node_id','type','prompt','skill_tags','scoring','explanation','provenance','status'], {
    id:{type:'string'}, node_id:{type:'string'},
    type:{enum:['multiple_choice','matching','cloze','ordering','error_correction','short_response','writing','speaking']},
    prompt:{type:'string'}, stimulus:{type:['string','null']}, options:{type:'array',items:{type:'string'}},
    skill_tags:{type:'array',minItems:1,items:{type:'string'}},
    scoring:{type:'object',required:['mode'],properties:{mode:{enum:['exact','set','regex','rubric']},answer:{},max_points:{type:'number',minimum:0},rubric_id:{type:'string'}}},
    explanation:{type:'string'}, difficulty:{enum:['foundation','standard','transfer','checkpoint']},
    provenance:{type:'object',required:['original','author'],properties:{original:{const:true},author:{type:'string'},source_ids:{type:'array',items:{type:'string'}}}},
    status:{enum:['draft','review','released']}
  });
schemas['CHECKPOINT_SCHEMA.json'] = objectSchema('Checkpoint',
  ['id','module','skills','duration_minutes','forms','pass_threshold','repair_on_fail','original_content_only'], {
    id:{type:'string'}, module:{type:'string'}, skills:{type:'array',minItems:1,items:{type:'string'}},
    duration_minutes:{type:'integer',minimum:1},
    forms:{type:'array',minItems:1,items:{type:'object',required:['id','exercise_ids'],properties:{id:{type:'string'},exercise_ids:{type:'array',minItems:1,items:{type:'string'}}}}},
    pass_threshold:{type:'number',minimum:0,maximum:1}, repair_on_fail:{type:'boolean'}, original_content_only:{const:true}
  });
schemas['ATTEMPT_SCHEMA.json'] = objectSchema('Attempt event',
  ['id','user_id','content_version','exercise_id','node_id','started_at','submitted_at','first_try','response','score','skill_evidence'], {
    id:{type:'string'}, user_id:{type:'string'}, content_version:{type:'string'}, exercise_id:{type:'string'}, node_id:{type:'string'},
    started_at:{type:'string',format:'date-time'}, submitted_at:{type:'string',format:'date-time'}, first_try:{type:'boolean'}, response:{},
    score:{type:'number',minimum:0,maximum:1},
    skill_evidence:{type:'array',items:{type:'object',required:['skill_id','weight','correct'],properties:{skill_id:{type:'string'},weight:{type:'number',minimum:0},correct:{type:'boolean'},error_code:{type:['string','null']}}}},
    scoring_trace:{type:'object'}
  });
schemas['USER_PROGRESS_SCHEMA.json'] = objectSchema('User progress projection',
  ['user_id','content_version','mastery','review_queue','readiness'], {
    user_id:{type:'string'}, content_version:{type:'string'},
    mastery:{type:'array',items:{type:'object',required:['skill_id','score','confidence','state','updated_at'],properties:{skill_id:{type:'string'},score:{type:'number',minimum:0,maximum:1},confidence:{type:'number',minimum:0,maximum:1},state:{enum:['unseen','learning','practiced','mastered','review_due']},updated_at:{type:'string',format:'date-time'}}}},
    review_queue:{type:'array',items:{type:'object'}},
    readiness:{type:'object',required:['written','oral','overall_ready'],properties:{written:{type:'number',minimum:0,maximum:1},oral:{type:'number',minimum:0,maximum:1},overall_ready:{type:'boolean'}}}
  });
schemas['SOURCE_REGISTRY_SCHEMA.json'] = objectSchema('Source record',
  ['id','title','publisher','url','authority','accessed','usage','production_copy_allowed'], {
    id:{type:'string'}, title:{type:'string'}, publisher:{type:'string'}, url:{type:'string',format:'uri'},
    authority:{enum:['primary_official','secondary_official','community']}, accessed:{type:'string',format:'date'},
    usage:{type:'string'}, production_copy_allowed:{const:false}, notes:{type:'string'}
  });
schemas['CONTENT_BUNDLE_SCHEMA.json'] = objectSchema('Content bundle',
  ['version','nodes','edges','lessons','exercises','checkpoints','sources'], {
    version:{type:'string'}, nodes:{type:'array',items:{'$ref':'NODE_SCHEMA.json'}}, edges:{type:'array',items:{type:'object'}},
    lessons:{type:'array',items:{'$ref':'LESSON_SCHEMA.json'}}, exercises:{type:'array',items:{'$ref':'EXERCISE_SCHEMA.json'}},
    checkpoints:{type:'array',items:{'$ref':'CHECKPOINT_SCHEMA.json'}}, sources:{type:'array',items:{'$ref':'SOURCE_REGISTRY_SCHEMA.json'}}
  });
for(const [name,schema] of Object.entries(schemas)) write(`schemas/${name}`,JSON.stringify(schema,null,2));

const sources = [
  ['TELC-001','telc Deutsch B2 product and exam structure','telc gGmbH','https://www.telc.net/en/language-examinations/certificate-exams/german/telc-german-b2/','primary_official','2026-10-07','Current structure, formats, durations and links','false','Checked against current official page'],
  ['TELC-002','telc Deutsch B2 Übungstest 1 (2021)','telc gGmbH','https://shop.telc.net/media/catalog/product/file/2/0/20201223_5023-b00-010201_web.pdf','primary_official','2026-10-07','Items counts, scoring, pass rules and rubric structure; never copy tasks','false','Official mock; copyrighted'],
  ['TELC-003','telc Deutsch B2 Handbuch','telc gGmbH','https://www.telc.net/fileadmin/user_upload/pdfs/Handbuch_und_Tipps_fuer_Pruefungsvorbereitung/Deutsch_B2_Handbuch.pdf','primary_official','2026-10-07','Learning objectives and test construct','false','Use facts and descriptors only'],
  ['TELC-004','Tipps zur Prüfungsvorbereitung Deutsch B2','telc gGmbH','https://www.telc.net/fileadmin/user_upload/pdfs/Handbuch_und_Tipps_fuer_Pruefungsvorbereitung/Deutsch_B2_tipps_zur_Pruefungsvorbereitung.pdf','primary_official','2026-10-07','Official task preparation guidance','false','Do not reuse sample performances'],
  ['CEFR-001','CEFR Companion Volume 2020','Council of Europe','https://rm.coe.int/cefr-companion-volume-with-new-descriptors-2020/16809ea0d4','primary_official','2026-10-07','B2 communicative descriptors and curriculum alignment','false','Paraphrase descriptors; respect Council of Europe rights'],
  ['CEFR-002','CEFR descriptors portal','Council of Europe','https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors','primary_official','2026-10-07','Descriptor provenance and updates','false','Reference link']
];
write('sources/SOURCE_REGISTRY.csv', ['id,title,publisher,url,authority,accessed,usage,production_copy_allowed,notes'].concat(sources.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(','))).join('\n'));
write('sources/README.md', `# Sources\n\nSOURCE_REGISTRY.csv is the authoritative provenance index. Registry inclusion does **not** grant permission to copy content. All entries currently set production_copy_allowed=false; they support factual verification and curriculum alignment only. Re-check current telc pages before changing exam behavior.\n`);
write('sources/SOURCE_NOTES.md', `# Verification notes\n\nVerified on 2026-10-07: the current official telc page still describes 3 reading parts plus 2 language-elements parts in a shared 90-minute block, 3 listening parts (~20 minutes), one writing task (30 minutes), and 3 speaking parts (~15 minutes, normally pairs, 20-minute preparation). The official 2021 mock supplies the 300-point weighting and separate 60% written/oral pass thresholds.\n\nThe product targets general telc Deutsch B2. Do not substitute specifications from B2+ Beruf, DTB B2, Medizin, or B2·C1 Beruf.\n`);

const promptFiles = {
  'QA_PROMPT.md': `# QA routing prompt\n\nRun the relevant specialist reviews before release: LINGUISTIC_QA_PROMPT.md for German and register, ASSESSMENT_QA_PROMPT.md for alignment and scoring, COPYRIGHT_QA_PROMPT.md for originality and licensing, and RELEASE_QA_PROMPT.md for the final gate. Consolidate blockers without silently rewriting exam facts. A release fails if any mandatory specialist review is missing.`,
  'RESEARCH_AGENT_PROMPT.md': `# Research agent prompt\n\nVerify a named exam claim using primary official telc sources first. Return: claim, exact source URL, publication/version date if visible, access date, supporting paraphrase, confidence, conflicts, product impact, and copyright-safe usage. Never copy task text, answer keys, audio scripts, or long passages. Mark unresolved claims instead of guessing.`,
  'CURRICULUM_DESIGNER_PROMPT.md': `# Curriculum designer prompt\n\nInput: verified exam claim, existing node catalog, graph, learner evidence. Output a proposed change with affected exam task, atomic skills, prerequisites, learner outcome, practice evidence, checkpoint impact, redundancy check, IDs, migration plan, and rationale. Preserve the 132-node architecture unless a documented decision explicitly changes it. Do not author exam requirements.`,
  'CONTENT_AUTHOR_PROMPT.md': `# Content author prompt\n\nCreate original B2 German content for the supplied node definition and schema. Include a concise goal, explanation, contrast, two original examples, micro-practice, deterministic explanation, recap, and repair. Keep the core lesson 5–10 minutes. Do not imitate distinctive wording, topics, answer patterns, or layouts from published tests. Return schema-valid content plus author and provenance metadata.`,
  'LINGUISTIC_QA_PROMPT.md': `# Linguistic QA prompt\n\nReview learner-facing German for correctness, idiom, collocation, punctuation, register, clarity, B2 fit, and ambiguity. Check every option and explanation. Return blocking issues, non-blocking improvements, corrected text, and skill tags. Do not change factual exam rules; flag them for research review.`,
  'ASSESSMENT_QA_PROMPT.md': `# Assessment QA prompt\n\nReview alignment, construct coverage, distractor plausibility, answer-key uniqueness, difficulty, time, scoring, parallel-form equivalence, repair routing, and mastery evidence. Reject items answerable by trivia outside the target skill. For productive tasks, verify rubric dimensions and state that scores are practice estimates.`,
  'COPYRIGHT_QA_PROMPT.md': `# Copyright QA prompt\n\nCompare draft content with the cited/source corpus available to the reviewer. Flag exact or near-exact phrases, replicated scenarios, answer patterns, distinctive layouts, unlicensed audio, and misleading affiliation. Return PASS/FAIL, evidence, and a rewrite strategy. Do not reproduce the protected source in the report beyond the shortest necessary phrase.`,
  'RELEASE_QA_PROMPT.md': `# Release QA prompt\n\nCheck schema validity, unique IDs, references, graph acyclicity, module counts, reachability, source metadata, language sign-off, assessment sign-off, copyright sign-off, accessibility, analytics, versioning, and rollback. Output a release decision, blockers, warnings, changed-file list, and manifest update. Never approve with a missing mandatory review.`
};
for(const [name,content] of Object.entries(promptFiles)) write(`prompts/${name}`,content);

write('research/DEEP_RESEARCH_AUDIT.md', audit);
write('research/RESEARCH_SOURCES_TEMPLATE.md', `# Research source record template\n\n- ID:\n- Claim being checked:\n- Title/publisher:\n- URL:\n- Publication/version date:\n- Access date:\n- Authority: primary official / secondary official / community\n- Supporting paraphrase:\n- Conflicts or uncertainty:\n- Product impact:\n- Copyright/license constraints:\n- Production copying permitted: no (default)\n- Reviewer:\n`);

write('lessons/SAMPLE_LESSON_WRITING_REGISTER.md', `# WRT-005 sample lesson — Halbformelle Anrede und Schlussformel\n\n**Goal:** Choose an opening and closing that fit a message to a company, course provider, landlord, or institution. Estimated time: 8 minutes.\n\n## Principle\n\nUse respectful distance when the recipient is not a private friend. If a name is known, use “Sehr geehrte Frau …” or “Sehr geehrter Herr …”. If no person is named, use “Sehr geehrte Damen und Herren”. Close with “Mit freundlichen Grüßen”. Do not mix a formal opening with “Liebe Grüße”.\n\n## Contrast\n\nPrivate: “Hallo Mira, … Liebe Grüße”\n\nSemi-formal: “Sehr geehrte Frau Baumann, … Mit freundlichen Grüßen”\n\n## Example\n\nYou write to a course office whose contact person is Frau Neumann. A fitting frame is: “Sehr geehrte Frau Neumann, … Mit freundlichen Grüßen”.\n\n## Micro-practice\n\nChoose the best pair for an unknown employee at a travel company:\n\nA. Hallo! / Bis bald\nB. Sehr geehrte Damen und Herren / Mit freundlichen Grüßen\nC. Liebe Leute / Viele Grüße\n\nAnswer: B. It keeps respectful distance and is internally consistent.\n\n## Repair\n\nIf you chose A or C, label the relationship first: private, known professional, or unknown professional. Then choose both formulas from the same register.\n\n## Recap\n\nRecipient known? Use title + surname. Unknown? “Sehr geehrte Damen und Herren”. Close formally and consistently.\n`);

const sampleExercises = [
 {id:'EX-WRT-005-001',node_id:'WRT-005',type:'multiple_choice',prompt:'Welche Kombination passt zu einer unbekannten Ansprechperson bei einem Energieanbieter?',options:['Hallo / Bis dann','Sehr geehrte Damen und Herren / Mit freundlichen Grüßen','Liebe Kolleginnen und Kollegen / Tschüss'],skill_tags:['register','opening','closing'],scoring:{mode:'exact',answer:1,max_points:1},explanation:'Nur Option 2 ist durchgehend halbformell.',difficulty:'foundation',provenance:{original:true,author:'project editorial team',source_ids:[]},status:'review'},
 {id:'EX-LNG-002-001',node_id:'LNG-002',type:'cloze',prompt:'Wählen Sie den passenden Konnektor: Der Kurs fällt heute aus, ___ die Lehrerin krank ist.',options:['weil','obwohl','damit'],skill_tags:['causal_connector','verb_final'],scoring:{mode:'exact',answer:0,max_points:1},explanation:'„weil“ nennt den Grund und verlangt hier Verbendstellung.',difficulty:'standard',provenance:{original:true,author:'project editorial team',source_ids:[]},status:'review'},
 {id:'EX-RDG-010-001',node_id:'RDG-010',type:'matching',prompt:'Ordnen Sie „die Gebühren werden erstattet“ der gleichbedeutenden Formulierung zu.',options:['Man erhält das gezahlte Geld zurück.','Man muss zusätzlich bezahlen.','Die Zahlung wird verschoben.'],skill_tags:['paraphrase'],scoring:{mode:'exact',answer:0,max_points:1},explanation:'„erstatten“ bedeutet, bereits gezahltes Geld zurückzugeben.',difficulty:'standard',provenance:{original:true,author:'project editorial team',source_ids:[]},status:'review'},
 {id:'EX-LST-009-001',node_id:'LST-009',type:'multiple_choice',prompt:'Im Audio heißt es: „Nicht am Freitag, sondern erst am Montag.“ Welche Aussage stimmt?',options:['Der Termin ist Freitag.','Der Termin ist Montag.','Beide Termine gelten.'],skill_tags:['listening_correction','contrast'],scoring:{mode:'exact',answer:1,max_points:1},explanation:'„sondern“ korrigiert Freitag zu Montag.',difficulty:'standard',provenance:{original:true,author:'project editorial team',source_ids:[]},status:'review'},
 {id:'EX-WRT-016-001',node_id:'WRT-016',type:'short_response',prompt:'Notieren Sie in Stichpunkten drei Inhaltspunkte für eine Anfrage an einen Weiterbildungskurs.',skill_tags:['planning','content_coverage'],scoring:{mode:'rubric',rubric_id:'RUB-WRT-PLAN',max_points:3},explanation:'Jeder Punkt muss zur Situation passen und eine andere Informationsfunktion erfüllen.',difficulty:'transfer',provenance:{original:true,author:'project editorial team',source_ids:[]},status:'review'},
 {id:'EX-SPK-015-001',node_id:'SPK-015',type:'speaking',prompt:'Einigen Sie sich mit einer Partnerperson auf Ort, Budget und Zeit für einen gemeinsamen Informationstag.',skill_tags:['planning','negotiation','agreement'],scoring:{mode:'rubric',rubric_id:'RUB-SPK-PLAN',max_points:12},explanation:'Bewertet werden Vorschläge, Reaktion auf Partnerbeiträge, Begründung und Einigung.',difficulty:'checkpoint',provenance:{original:true,author:'project editorial team',source_ids:[]},status:'review'}
];
write('exercises/SAMPLE_EXERCISES.json',JSON.stringify(sampleExercises,null,2));
write('exercises/SAMPLE_EXERCISES.md', `# Original sample exercises\n\nCanonical structured examples are in SAMPLE_EXERCISES.json. They cover deterministic and rubric-scored modes across writing, language elements, reading, listening, and speaking. All scenarios and wording are original and require editorial review before release.\n`);

const checkpoint = {id:'CP-VERTICAL-001',module:'mixed_vertical_slice',skills:['WRT-005','LNG-002'],duration_minutes:12,forms:[{id:'A',exercise_ids:['EX-WRT-005-001','EX-LNG-002-001']},{id:'B',exercise_ids:['EX-WRT-005-002','EX-LNG-002-002']}],pass_threshold:0.8,repair_on_fail:true,original_content_only:true,blueprint:{register:1,causal_connector:1,transfer_task:1},note:'Form B must be authored and reviewed before release.'};
write('checkpoints/SAMPLE_CHECKPOINT.json',JSON.stringify(checkpoint,null,2));
write('checkpoints/SAMPLE_CHECKPOINT.md', `# Vertical-slice checkpoint\n\nTests WRT-005 and LNG-002 in 12 minutes. Pass at 80% for local mastery evidence. Failure routes to the implicated node, gives a short contrast lesson, and serves the parallel form. This is a platform checkpoint, not an official telc score.\n`);

// Build a complete manifest after all artifacts exist.
const walk = dir => fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files = walk(root).filter(p => path.basename(p) !== 'PACKAGE_MANIFEST.txt').sort();
const manifestLines = files.map(p => {
  const rel = path.relative(root,p).replaceAll('\\','/');
  const buf=fs.readFileSync(p);
  return `${crypto.createHash('sha256').update(buf).digest('hex')}  ${buf.length}  ${rel}`;
});
write('PACKAGE_MANIFEST.txt', `telc_b2_platform_reconstructed_pack\nGenerated: 2026-10-07\nCanonical files (including this manifest): ${files.length + 1}\nHashed artifacts (manifest excluded to avoid self-reference): ${files.length}\nCurriculum nodes: ${nodes.length}\nGraph edges: ${edges.length}\nModule counts: ${JSON.stringify(counts)}\n\nSHA256  BYTES  PATH\n${manifestLines.join('\n')}\n`);

console.log(JSON.stringify({root,files:walk(root).length,nodes:nodes.length,edges:edges.length,module_counts:counts},null,2));
