import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const data = JSON.parse(readFileSync(resolve("content/node-definitions.json"), "utf8"));
const graph = JSON.parse(readFileSync(resolve("content/skill-graph.json"), "utf8"));
const nodes = data.nodes;
const ids = new Set(nodes.map((node) => node.id));
if (nodes.length !== 132) throw new Error(`Expected 132 nodes, found ${nodes.length}`);
if (ids.size !== 132) throw new Error("Node IDs are not unique");
for (const node of nodes) {
  if (!node.title || !node.learner_outcome || !node.exam_alignment) throw new Error(`Incomplete node ${node.id}`);
  if (!Array.isArray(node.prerequisites)) throw new Error(`Missing prerequisites on ${node.id}`);
  for (const prerequisite of node.prerequisites) if (!ids.has(prerequisite)) throw new Error(`Unknown prerequisite ${prerequisite} on ${node.id}`);
}
const incoming = new Map(nodes.map((node) => [node.id, 0]));
const outgoing = new Map(nodes.map((node) => [node.id, []]));
for (const edge of graph.edges) {
  if (!ids.has(edge.from) || !ids.has(edge.to)) throw new Error(`Invalid edge ${edge.from} -> ${edge.to}`);
  incoming.set(edge.to, incoming.get(edge.to) + 1);
  outgoing.get(edge.from).push(edge.to);
}
const queue = [...incoming].filter(([, count]) => count === 0).map(([id]) => id);
let visited = 0;
while (queue.length) {
  const id = queue.shift(); visited += 1;
  for (const target of outgoing.get(id)) { incoming.set(target, incoming.get(target) - 1); if (incoming.get(target) === 0) queue.push(target); }
}
if (visited !== nodes.length) throw new Error("Skill graph contains a cycle");
console.log(JSON.stringify({ ok: true, nodes: nodes.length, edges: graph.edges.length, modules: data.module_counts, lessonExercises: nodes.length * 3 }));
