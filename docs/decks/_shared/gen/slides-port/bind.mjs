// bind.mjs: swap {{asset:name}} for the uploaded /_blob/<id> urls in deck/project/slides
import fs from 'node:fs';
import path from 'node:path';
const HERE = path.dirname(new URL(import.meta.url).pathname);
const map = JSON.parse(fs.readFileSync(path.join(HERE, 'artifact.json'), 'utf8')).blobs;
const dir = path.join(HERE, 'deck', 'project', 'slides');
let missing = 0;
for (const f of fs.readdirSync(dir)) {
  const p = path.join(dir, f);
  const s = fs.readFileSync(p, 'utf8').replace(/\{\{asset:([^}]+)\}\}/g, (m, n) => map[n] || (missing++, console.error(`missing upload: ${n}`), m));
  fs.writeFileSync(p, s);
}
process.exit(missing ? 1 : 0);
