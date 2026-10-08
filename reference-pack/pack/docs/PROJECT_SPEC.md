# Product specification

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
2. Map: render 132 nodes from `NODE_DEFINITIONS.json` and prerequisites from `SKILL_GRAPH.json`.
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
