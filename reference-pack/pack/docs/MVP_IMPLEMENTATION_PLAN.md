# MVP implementation plan

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
2. Import `NODE_DEFINITIONS.json` and render the map.
3. Implement attempt ledger and mastery projection.
4. Author full content for WRT-005 and LNG-002.
5. Add one deterministic checkpoint and repair route.
6. Add CI checks for IDs, sources, copyright fields, and broken references.

## Definition of done

Code tested; content validated; keyboard and screen-reader path checked; German reviewed; sources recorded; no copyrighted third-party passage; analytics event documented; rollback possible.
