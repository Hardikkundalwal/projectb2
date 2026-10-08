# Implementation start prompt

Read START_HERE.md, docs/TELC_B2_EXAM_SPEC.md, docs/PROJECT_SPEC.md, curriculum/CURRICULUM_OVERVIEW.md, curriculum/NODE_DEFINITIONS.json, curriculum/SKILL_GRAPH.json, schemas/, and docs/MVP_IMPLEMENTATION_PLAN.md.

Build milestone M0 then M1. Treat curriculum files as versioned source of truth. Validate exactly 132 nodes and an acyclic graph. Do not invent exam rules or copy any external task. Implement deterministic scoring before AI. Keep AI behind an adapter and prevent it from directly mutating mastery. Use the WRT-005 + LNG-002 vertical slice, persist attempts, compute mastery, unlock nodes, and schedule repair/review. Add tests for separate written/oral pass gates.
