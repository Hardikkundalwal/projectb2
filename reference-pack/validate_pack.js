const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.join(__dirname, 'pack');
const readJson = rel => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
const defs = readJson('curriculum/NODE_DEFINITIONS.json');
const graph = readJson('curriculum/SKILL_GRAPH.json');
const ids = new Set(defs.nodes.map(n => n.id));
if (defs.nodes.length !== 132 || ids.size !== 132) throw new Error('Node count or uniqueness failed');
const expected = {foundation:18,reading:24,language_elements:24,listening:18,writing:18,speaking:18,integration:12};
for (const [module,count] of Object.entries(expected)) {
  const actual = defs.nodes.filter(n => n.module === module).length;
  if (actual !== count) throw new Error(`${module}: expected ${count}, got ${actual}`);
}
for (const n of defs.nodes) for (const p of n.prerequisites) if (!ids.has(p)) throw new Error(`Missing prerequisite ${p}`);

const outgoing = new Map([...ids].map(id => [id, []]));
const indegree = new Map([...ids].map(id => [id, 0]));
for (const e of graph.edges) {
  if (!ids.has(e.from) || !ids.has(e.to)) throw new Error(`Bad edge ${e.from}->${e.to}`);
  outgoing.get(e.from).push(e.to);
  indegree.set(e.to, indegree.get(e.to) + 1);
}
const queue = [...ids].filter(id => indegree.get(id) === 0);
let visited = 0;
while (queue.length) {
  const id = queue.shift(); visited++;
  for (const next of outgoing.get(id)) {
    indegree.set(next, indegree.get(next) - 1);
    if (indegree.get(next) === 0) queue.push(next);
  }
}
if (visited !== ids.size) throw new Error(`Graph cycle detected: visited ${visited}/${ids.size}`);

const jsonFiles = [];
const walk = dir => {
  for (const e of fs.readdirSync(dir,{withFileTypes:true})) {
    const p = path.join(dir,e.name);
    if (e.isDirectory()) walk(p); else if (p.endsWith('.json')) jsonFiles.push(p);
  }
};
walk(root);
for (const p of jsonFiles) JSON.parse(fs.readFileSync(p,'utf8'));

const manifest = fs.readFileSync(path.join(root,'PACKAGE_MANIFEST.txt'),'utf8');
for (const line of manifest.split(/\r?\n/)) {
  const m = line.match(/^([a-f0-9]{64})  (\d+)  (.+)$/);
  if (!m) continue;
  const p = path.join(root, m[3].replaceAll('/',path.sep));
  const buf = fs.readFileSync(p);
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  if (hash !== m[1] || buf.length !== Number(m[2])) throw new Error(`Manifest mismatch ${m[3]}`);
}

const csvLines = fs.readFileSync(path.join(root,'curriculum/NODE_CATALOG.csv'),'utf8').trim().split(/\r?\n/);
if (csvLines.length !== 133) throw new Error(`Catalog line count ${csvLines.length}`);

console.log(JSON.stringify({ok:true,nodes:ids.size,edges:graph.edges.length,json_files:jsonFiles.length,catalog_rows:csvLines.length-1,acyclic:true,manifest_verified:true},null,2));
