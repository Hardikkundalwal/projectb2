# Project-B2

Project-B2 is a German-first, independent preparation platform for the telc Deutsch B2 exam. It is not affiliated with telc gGmbH.

## Included

- Complete 132-node curriculum across foundations, reading, language elements, listening, writing, speaking, and integration.
- Prerequisite-based transit map, three scored exercises per lesson, repair guidance, review scheduling, diagnostics, checkpoints, and readiness estimates.
- German browser speech synthesis for original listening scripts.
- Device-local speaking recording and playback; recordings are never uploaded.
- Deterministic writing rubric plus optional structured OpenAI feedback.
- D1 persistence for profiles, attempts, mastery, reviews, assessments, rubric scores, and AI usage records.
- Owner-private Sites deployment and a portable local development mode.

## Run locally

1. Install dependencies: `npm ci`
2. Generate migrations if the schema changed: `npm run db:generate`
3. Build once so the local D1 binding exists: `npm run build`
4. Apply `drizzle/0000_oval_white_tiger.sql` using the local D1 command documented by the Sites starter.
5. Start development: `npm run dev`

The local profile is `local-seeded-learner`. Hosted private access uses the authenticated Sites user ID.

## Verification

Run `npm run verify`. The curriculum validator checks exactly 132 unique nodes, valid prerequisites, valid edges, and an acyclic graph. The build checks all TypeScript and Worker output.

## AI configuration

AI writing feedback is optional. Configure `OPENAI_API_KEY` as a hosted secret; never commit it. When absent or disabled, Project-B2 uses its deterministic local rubric. AI requests set `store: false` and are limited to three successful feedback runs per learner per day.

## Hosting

The first hosted release is intentionally private and has no custom domain. Database, identity, content, and AI access are separated so a later hosting migration can replace the adapters without rewriting the curriculum or learning interface.
