# Skill graph

Directed acyclic prerequisite graph with 132 nodes and 164 edges. JSON is canonical.

## Integrity rules

- IDs must exist in NODE_DEFINITIONS.json.
- Hard prerequisites block unlock unless waived by placement; checkpoints are never waived.
- Cycles fail the import.
- Cross-module integration begins only after module checkpoints.

## Module roots

- foundation: FND-001
- reading: RDG-001
- language_elements: LNG-001
- listening: LST-001
- writing: WRT-001
- speaking: SPK-001
- integration: INT-001

## Module terminal nodes

- foundation: FND-018
- reading: RDG-024
- language_elements: LNG-024
- listening: LST-018
- writing: WRT-018
- speaking: SPK-018
- integration: INT-012
