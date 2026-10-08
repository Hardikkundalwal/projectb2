# CODEX START PROMPT


You are implementing the telc Deutsch B2 learning platform in this repository.


Read first:
- START_HERE.md
- AGENTS.md
- docs/PROJECT_SPEC.md
- docs/TELC_B2_EXAM_SPEC.md
- curriculum/CURRICULUM_OVERVIEW.md
- curriculum/MODULE_MAPS.md
- docs/LEARNING_ENGINE.md


Rules:
1. Curriculum files are the source of truth.
2. Do not invent telc requirements.
3. Do not copy copyrighted telc/publisher material into production.
4. Do not put AI into deterministic interactions.
5. Keep provider abstraction around any LLM calls.
6. Keep UX simple and map-driven.
7. Build a thin vertical slice before broadening coverage.
8. Failure should trigger targeted repair, not full lesson repetition.
9. Mastery is tracked per skill, not only per completed lesson.
10. Existing learners must be able to place out of mastered prerequisites.


First milestone:
- dashboard/map;
- one Writing or Sprachbausteine node;
- lesson page;
- flashcards;
- deterministic exercise;
- mastery update;
- unlock logic;
- checkpoint;
- review queue;
- persistence.


Do not attempt the entire B2 course in the first implementation pass.
