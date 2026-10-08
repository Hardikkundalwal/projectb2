# QA and release checklist

## Automated

- JSON/YAML parses and validates against schemas.
- Exactly 132 curriculum nodes; unique IDs; counts 18/24/24/18/18/18/12.
- Every prerequisite exists; graph is acyclic; every module checkpoint is reachable.
- Released nodes reference available lesson and evidence assets.
- Deterministic items have valid keys, plausible distractors, and no duplicate options.
- Timers, word counts, attempt weights, and 60%/65% thresholds are unit tested.
- URLs in the source registry resolve during scheduled link checks.

## Human linguistic review

Grammar, idiom, collocation, punctuation, register, CEFR fit, clarity of explanations, distractor fairness, and audio transcript accuracy.

## Assessment review

Task-to-skill alignment, blueprint balance, answer-key independence, parallel-form equivalence, time feasibility, and rubric consistency.

## Copyright review

Search distinctive phrases; reject copied or lightly paraphrased passages/questions; verify audio ownership; record licenses; remove trademarks from branding claims; keep telc references nominative and factual.

## Release sign-off

Content editor, linguistic reviewer, assessment reviewer, and copyright reviewer are separate recorded roles where possible. Emergency fixes retain an audit trail and trigger retrospective review.
