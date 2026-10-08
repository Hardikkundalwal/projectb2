# START HERE


## What this project is
A self-paced telc Deutsch B2 preparation platform for learners who need a concrete German outcome and cannot rely on a conventional course schedule.


## What it is not
- Not Duolingo.
- Not ChatGPT with a German prompt.
- Not a folder of PDFs.
- Not an AI-first product.
- Not a generic A1→B2 textbook clone.


## First build target
Build one thin vertical slice:
1. Dashboard / map.
2. One Writing or Sprachbausteine node.
3. Short lesson.
4. Deterministic exercise.
5. Mastery update.
6. Unlock logic.
7. Checkpoint.
8. Review queue.


Do not build the whole app before this flow works.


## Source of truth
Production curriculum lives in structured project files. External books, official telc material, teacher notes, and owned resources are private references only.


## Private local source library
source_library/
- official_telc/
- owned_books/
- teacher_material/
- research_notes/


Keep source_library private and out of Git.
