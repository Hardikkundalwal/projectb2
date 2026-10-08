# Technical architecture

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

`content_versions`, `nodes`, `edges`, `lessons`, `exercises`, `checkpoints`, `users`, `attempts`, `skill_mastery`, `review_queue`, `assessment_sessions`, `rubric_scores`, `ai_feedback_runs`, `source_records`.

## Import contract

Validate → reject unknown IDs → topologically sort graph → reject cycles → check all prerequisites → verify released nodes have lesson and assessment evidence → atomically publish a content version.

## Security and privacy

Minimize learner PII; encrypt recordings; configurable deletion; do not send personal data to AI providers; redact prompts; log provider/model/cost without storing secrets; rate-limit uploads and generation.
