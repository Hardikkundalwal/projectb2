# Project Spec


## Problem
Learners in Germany may need B2 for graduation/work while balancing university, jobs, and other obligations. Traditional courses provide structure but are often not self-paced, not practical enough, or fragmented across apps and files.


## Product promise
One integrated path from current ability to telc Deutsch B2 readiness.


## Target user
Initial target: a learner around B1 who needs telc B2, plus a small group of friends. Later the platform may become public.


## UX
Board-game / treasure-map progression with nodes and checkpoints. CEFR labels may exist as metadata, but the learner sees a concrete sequence of levels/paths.


Map → Lesson → Cards → Exercise → Checkpoint → Progress.


## Level design
- Normal learning unit: about 5–10 min.
- Checkpoint/model test: about 15–30 min.
- A node bundles one or a few related atomic skills.
- Checkpoints are cumulative and increasingly authentic.


## Failure behavior
Do not make the learner repeat the full lesson.
1. Identify weak skill.
2. Give tiny corrective explanation/exercise.
3. Retry.
4. Update skill mastery.
5. Add future spaced review.


## Placement
Diagnostic onboarding should allow learners to skip mastered prerequisites.


## Content architecture
Production curriculum:
- skill.yaml
- lesson.md
- cards.json
- exercises.json
- checkpoint.json


Private references:
- official telc PDFs/audio
- owned books
- teacher notes
- research notes


Private references are research material, not production content.
