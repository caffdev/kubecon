// Sync each slide's data-energy (the star's brightness) from narrative.md's Energy fields.
// Run from the repo root: node docs/decks/takeaways-v3/theme/gen/energy.mjs
import fs from 'node:fs';
const deck = new URL('../../', import.meta.url);
const text = fs.readFileSync(new URL('narrative.md', deck), 'utf8');
const beats = [...text.matchAll(/^### (\S+)\n([\s\S]*?)(?=^### |(?![\s\S]))/gm)];
for (const [, slug, body] of beats) {
  const m = body.match(/\*\*Energy:\*\* (\d)/);
  const file = new URL(`slides/${slug}.html`, deck);
  if (!m || !fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/<main class="slide([^"]*)"(?: data-energy="\d")?>/, `<main class="slide$1" data-energy="${m[1]}">`);
  fs.writeFileSync(file, html);
  console.log(slug, m[1]);
}
