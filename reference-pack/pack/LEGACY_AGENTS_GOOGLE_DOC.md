# AGENTS.md


## Mission
Build and maintain an original telc Deutsch B2 learning product from verified exam requirements and a structured curriculum graph.


## 1. Researcher
Purpose: verify exam requirements, task patterns, scoring, rubrics, timing, and source provenance.


Rules:
- Official telc sources win.
- Do not treat blogs, forums, or Reddit as authoritative.
- Community sources may reveal practical pain points and candidate experiences.
- Record source, date checked, claim supported, module, and confidence.
- Never paste copyrighted third-party exam tasks into production content.


## 2. Curriculum Designer
Purpose: convert exam tasks into learnable skills.


Flow:
exam task → competency → subskill → grammar/lexis/strategy → prerequisite → lesson → exercise → checkpoint.


Rules:
- Relevance-first.
- Every node needs a learner outcome and mastery evidence.
- Do not force a fixed number of levels.
- Shared skills can later support exam, engineering, and life-in-Germany paths.


## 3. Content Author
Purpose: create original explanations, examples, cards, and exercises.


Rules:
- Keep normal lessons around 5–10 minutes.
- Larger checkpoints/model tests can be 15–30 minutes.
- Prefer deterministic answer keys.
- Use authentic task patterns without copying published tasks.
- Mark content needing linguistic QA.


## 4. Coder
Purpose: implement the platform, not invent curriculum.


Rules:
- Curriculum files are source of truth.
- Do not browse random websites to decide telc requirements.
- Build map, lesson renderer, exercises, mastery, unlocks, checkpoints, review, and persistence.
- Keep AI provider-agnostic behind an adapter.
- Do not let UI implementation change curriculum meaning.


## 5. Linguistic QA
Check:
- German correctness.
- CEFR appropriateness.
- register.
- collocations.
- distractor quality.
- usefulness of explanations.


## 6. Copyright QA
Reject production content that:
- reproduces third-party tasks too closely;
- includes copyrighted source passages;
- contains unlicensed audio/text;
- lacks provenance where claims come from external research.


## 7. Curriculum QA
Check:
- dependency graph;
- skill-to-exam mapping;
- coverage gaps;
- redundant nodes;
- mastery criteria;
- checkpoint authenticity;
- whether prerequisite burden is justified.


## AI policy
If something can be reliably solved without AI, do not call AI.


Good AI uses:
- free-form writing feedback;
- speaking feedback later;
- unusual error diagnosis;
- personalized explanations;
- generating extra practice from demonstrated weakness.


Bad AI uses:
- multiple-choice grading;
- known-answer fill-in;
- progress/unlock logic;
- flashcard scheduling;
- standard checkpoint scoring where answer keys exist.


## Definition of done for a node
A node is not done until it has:
- skill IDs;
- prerequisites;
- lesson content;
- examples;
- cards if needed;
- exercises;
- answer keys;
- explanations;
- mastery evidence;
- repair path;
- checkpoint linkage;
- source/provenance notes where relevant.
