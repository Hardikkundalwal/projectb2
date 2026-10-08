# Content model

## Canonical hierarchy

Exam → module → node → atomic skills → lesson blocks → practice items → checkpoint blueprint → attempt evidence.

## Release statuses

`draft` → `linguistic_review` → `assessment_review` → `copyright_review` → `ready` → `released` → `retired`.

## Required guarantees

- IDs are stable and never reused.
- Every node has an outcome, exam alignment, prerequisites, practice types, mastery rule, remediation, and copyright flag.
- Every exercise has exactly one scoring strategy; deterministic items include an answer key and explanation.
- Free-form prompts include a rubric, reference constraints, and human-readable scoring disclaimer.
- Every external factual claim has a source record; production passages are original and have no copied source text.
- Any changed released item increments `content_version` and records migration impact.

## Localization

Learner-facing German is the default. Editorial notes may be English. Keep prompt text separate from UI labels; never embed UI behavior inside lesson prose.
