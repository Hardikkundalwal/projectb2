# Start here

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
