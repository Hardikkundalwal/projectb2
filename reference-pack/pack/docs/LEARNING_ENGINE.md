# Learning and mastery engine

## State model

The immutable unit is an attempt event. Derived state is rebuilt from attempts, checkpoint results, manual overrides, and content-version migrations. Store mastery per atomic skill, not per page visited.

## Evidence weights

| Evidence | Base weight |
|---|---:|
| first-try deterministic item | 1.00 |
| corrected retry | 0.45 |
| delayed retrieval (>=24h) | 1.20 |
| transfer item in new context | 1.35 |
| module checkpoint | 1.50 |
| full mock aligned to rubric | 2.00 |

Compute a decayed weighted accuracy over the last 12 meaningful observations. Apply recency half-life 30 days, cap repeated same-template evidence at 35%, and lower confidence when fewer than three observations exist.

## Mastery states

- unseen: no evidence
- learning: score <0.65 or confidence low
- practiced: score 0.65–0.79
- mastered: score >=0.80, at least three observations, and one transfer observation
- review_due: mastered but recency threshold exceeded or recent failure occurred

## Unlocking

A node unlocks when every hard prerequisite is mastered or explicitly waived by diagnostic evidence. Checkpoints cannot be waived. Optional enrichment edges influence recommendations but never block.

## Failure loop

1. Tag error to one or more skills and error codes.
2. Show a 2–4 minute repair with one contrast and one worked example.
3. Serve a fresh parallel item.
4. Update mastery with reduced weight for an immediate retry.
5. Schedule a delayed retrieval in 1, 3, 7, then 21 days.

## Readiness

Compute written readiness from reading, language elements, listening, and writing evidence using official point weights (75/30/75/45). Compute oral readiness separately from speaking. Display a confidence interval. “Ready” requires both projected parts >=65%, at least one recent full simulation in each part, and no critical module checkpoint below 60%.

## AI boundary

AI may propose feedback for free writing/speaking, but it does not directly mutate mastery. A deterministic rubric adapter converts accepted feedback into bounded evidence, stores model/version/prompt, and allows human review.
