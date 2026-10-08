# Agent operating instructions

## Mission
Build the platform from the verified specification and versioned curriculum. Never invent telc rules or treat a model answer as an official score.

## Order of authority
1. Current official telc sources in SOURCE_REGISTRY.csv.
2. Verified exam spec.
3. Released curriculum and schemas.
4. Editorial decisions with a dated record.

## Required workflow
Research → curriculum mapping → original authoring → linguistic review → assessment review → copyright review → schema validation → release.

## Hard rules
- Keep raw files as source of truth.
- Preserve stable IDs and add versions for changes.
- Use deterministic scoring whenever an answer key is possible.
- AI output never directly changes mastery.
- Do not reproduce protected passages, questions, audio, answer keys, or layouts.
- Check both written and oral thresholds independently.
- On failure, route to the smallest implicated skill and use a fresh retry item.

## Before finishing any change
Run schema, graph, reference, content, linguistic, assessment, accessibility, and copyright checks described in docs/QA_AND_RELEASE.md. Update the manifest for added or renamed files.
