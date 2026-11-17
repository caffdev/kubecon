// deck kit · project model: where decks live, deck.json, slide + narrative parsing, generated pages.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const KIT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const KIT_VERSION = fs.readFileSync(path.join(KIT_DIR, 'VERSION'), 'utf8').trim();
export const SLUG = /^[a-z0-9][a-z0-9-]*$/;
export const isVendored = () => path.basename(KIT_DIR) === '_kit';

export class DeckError extends Error {}
export const fail = (msg) => { throw new DeckError(msg); };

export function findRepoRoot(start = process.cwd()) {
  let dir = path.resolve(start);
  for (;;) {
    if (fs.existsSync(path.join(dir, '.git'))) return dir;
    const up = path.dirname(dir);
    if (up === dir) return path.resolve(start);
    dir = up;
  }
}

/** docs/decks for this repo. Vendored kit: its parent. Skill copy: <repo>/docs/decks. */
export function decksRoot(opt) {
  if (opt) return path.resolve(opt);
  if (isVendored()) return path.dirname(KIT_DIR);
  return path.join(findRepoRoot(), 'docs', 'decks');
}

export function listDecks(root) {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !/^[_.]/.test(d.name) && fs.existsSync(path.join(root, d.name, 'deck.json')))
    .map((d) => d.name)
    .sort();
}

export function checkSlug(slug, what = 'slug') {
  if (!slug || !SLUG.test(slug)) fail(`Bad ${what} "${slug ?? ''}". Use lowercase letters, digits and dashes, e.g. the-turn.`);
  return slug;
}

export function openDeck(root, name) {
  const known = () => listDecks(root).join(', ') || '(none yet)';
  if (!name) fail(`Name a deck. Decks here: ${known()}`);
  const dir = path.join(root, name);
  const file = path.join(dir, 'deck.json');
  if (!fs.existsSync(file)) fail(`No deck "${name}" in ${root}. Decks here: ${known()}`);
  let json;
  try { json = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { fail(`${file} is not valid JSON: ${e.message}`); }
  json.drafts ||= { main: [] };
  if (!json.draft || !json.drafts[json.draft]) json.draft = Object.keys(json.drafts)[0];
  const slidesDir = path.join(dir, 'slides');
  return {
    name, dir, file, json, slidesDir,
    narrativeFile: path.join(dir, 'narrative.md'),
    order(draft = json.draft) {
      if (!json.drafts[draft]) fail(`No draft "${draft}" in ${name}. Drafts: ${Object.keys(json.drafts).join(', ')}`);
      return json.drafts[draft];
    },
    slideFile: (slug) => path.join(slidesDir, `${slug}.html`),
    slideSlugs() {
      if (!fs.existsSync(slidesDir)) return [];
      return fs.readdirSync(slidesDir)
        .filter((f) => f.endsWith('.html') && SLUG.test(f.slice(0, -5)))
        .map((f) => f.slice(0, -5))
        .sort();
    },
    save() { fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n'); },
  };
}

// ---------- parsing ----------
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', hellip: '…' };
export const decode = (s) => s.replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e) => {
  if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
  return ENTITIES[e.toLowerCase()] ?? m;
});
export const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function dedent(s) {
  const lines = s.replace(/^\n+|\s+$/g, '').split('\n');
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^\s*/)[0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(min)).join('\n');
}

/** Notes may be plain paragraphs separated by blank lines, or HTML. */
function notesHtml(raw) {
  const text = dedent(raw);
  if (!text) return '';
  if (/<(p|ul|ol|div|br)\b/i.test(text)) return text;
  return text.split(/\n\s*\n/).map((p) => `<p>${p.replace(/\s*\n\s*/g, ' ')}</p>`).join('\n');
}

export function parseSlide(file) {
  const src = fs.readFileSync(file, 'utf8');
  const title = decode((/<title>([\s\S]*?)<\/title>/i.exec(src)?.[1] ?? '').replace(/\s+/g, ' ').trim());
  const notes = /<aside\b[^>]*class=["'][^"']*\bnotes\b[^"']*["'][^>]*>([\s\S]*?)<\/aside>/i.exec(src)?.[1] ?? '';
  return { title, notes: notesHtml(notes) };
}

/** Beats are `### slug` headings followed by `- **Field:** value` bullets. */
export function parseNarrative(file) {
  if (!fs.existsSync(file)) return { beats: {}, order: [], exists: false };
  const md = fs.readFileSync(file, 'utf8');
  const heads = [...md.matchAll(/^###\s+`?([a-z0-9][a-z0-9-]*)`?\s*$/gm)];
  const beats = {};
  const order = [];
  heads.forEach((m, i) => {
    const start = m.index + m[0].length;
    let body = md.slice(start, i + 1 < heads.length ? heads[i + 1].index : md.length);
    const stop = body.search(/^#{1,2}\s/m);
    if (stop >= 0) body = body.slice(0, stop);
    const fields = {};
    for (const f of body.matchAll(/^\s*[-*]\s+\*\*([^*]+?):?\*\*:?\s*(.*)$/gm)) fields[f[1].trim()] = f[2].trim();
    beats[m[1]] = fields;
    order.push(m[1]);
  });
  return { beats, order, exists: true };
}

export const energyOf = (fields) => {
  const n = parseInt(fields?.Energy, 10);
  return Number.isFinite(n) ? Math.max(0, Math.min(5, n)) : null;
};

// ---------- manifest ----------
export function manifest(deck) {
  const narrative = parseNarrative(deck.narrativeFile);
  const slides = {};
  for (const slug of deck.slideSlugs()) {
    const { title, notes } = parseSlide(deck.slideFile(slug));
    slides[slug] = { title: title || narrative.beats[slug]?.Headline || slug, notes, plan: narrative.beats[slug] || {} };
  }
  for (const order of Object.values(deck.json.drafts)) {
    for (const slug of order) if (!slides[slug]) slides[slug] = { title: slug, notes: '', plan: narrative.beats[slug] || {}, missing: true };
  }
  return {
    deck: deck.name,
    title: deck.json.title || deck.name,
    draft: deck.json.draft,
    drafts: deck.json.drafts,
    size: deck.json.size || [1920, 1080],
    slides,
    narrativeOrder: narrative.order,
    kit: KIT_VERSION,
  };
}

/** JSON that is safe inside <script>. */
export const scriptJson = (v) => JSON.stringify(v).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

export function renderIndex(m, { css, js } = {}) {
  const head = css ? `<style>${css}</style>` : '<link rel="stylesheet" href="../_kit/runtime/deck.css">';
  const tail = js ? `<script>${js.replace(/<\/script/gi, '<\\/script')}</script>` : '<script src="../_kit/runtime/deck.js"></script>';
  return `<!doctype html>
<!-- Generated by \`deck build\`. Edit deck.json, narrative.md and slides/ instead; this file is rewritten. -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(m.title)}</title>
${head}
</head>
<body>
<noscript>This deck needs JavaScript. Each slide also opens on its own from the slides/ folder.</noscript>
<script>window.DECK = ${scriptJson(m)};</script>
${tail}
</body>
</html>
`;
}

export function renderHome(root) {
  const decks = listDecks(root).map((name) => {
    const deck = openDeck(root, name);
    const order = deck.order();
    const first = order.find((s) => fs.existsSync(deck.slideFile(s)));
    const updated = Math.max(0, ...deck.slideSlugs().map((s) => fs.statSync(deck.slideFile(s)).mtimeMs), fs.statSync(deck.file).mtimeMs);
    return { name, title: deck.json.title || name, count: order.length, drafts: Object.keys(deck.json.drafts).length, first, updated };
  }).sort((a, b) => b.updated - a.updated);
  const cards = decks.map((d) => `
    <li><a class="card" href="${encodeURIComponent(d.name)}/">
      <div class="thumb">${d.first ? `<iframe name="deck:thumb" loading="lazy" tabindex="-1" title="" src="${encodeURIComponent(d.name)}/slides/${d.first}.html"></iframe>` : ''}<div class="shield"></div></div>
      <div class="meta"><span class="title">${escapeHtml(d.title)}</span>
        <span class="sub"><span>${d.count} slide${d.count === 1 ? '' : 's'}</span>${d.drafts > 1 ? `<span>${d.drafts} drafts</span>` : ''}<span>${new Date(d.updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></span></div>
    </a></li>`).join('');
  return `<!doctype html>
<!-- Generated by \`deck build\`. -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Decks</title>
<link rel="stylesheet" href="_kit/runtime/deck.css">
</head>
<body>
<main class="home">
  <h1>Decks</h1>
  <p>${decks.length ? 'Open a deck to see its slides, rearrange them, or present.' : 'No decks yet. Create one with: node docs/decks/_kit/deck.mjs new &lt;name&gt;'}</p>
  <ol class="cards">${cards}</ol>
</main>
</body>
</html>
`;
}

/** Contact sheet: every slide of a draft in one image, for reviewing rhythm and consistency. */
export function renderSheet(deck, { draft, cols = 4, width = 400 } = {}) {
  const m = manifest(deck);
  const order = deck.order(draft);
  const [w, h] = m.size;
  const th = Math.round((width * h) / w);
  const items = order.map((slug, i) => {
    const s = m.slides[slug];
    const frame = s.missing
      ? `<div class="missing">missing: slides/${slug}.html</div>`
      : `<iframe name="deck:thumb" src="/${deck.name}/slides/${slug}.html?mode=thumb"></iframe>`;
    return `<figure>${frame}<figcaption><b>${i + 1}</b> ${escapeHtml(s.title)}</figcaption></figure>`;
  }).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;background:#1a1a19;}
.sheet{display:grid;grid-template-columns:repeat(${cols},${width}px);gap:22px 14px;padding:18px;width:max-content;}
figure{margin:0;width:${width}px}
iframe,.missing{display:block;width:${width}px;height:${th}px;border:0;background:#000}
.missing{display:grid;place-items:center;color:#f0a3a3;font:14px ui-monospace,monospace}
figcaption{font:500 15px/1.25 ui-sans-serif,system-ui,sans-serif;color:#d9d5ce;margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
figcaption b{color:#8d887f;font-weight:500;margin-right:6px}
</style>${readyScript(order.filter((s) => !m.slides[s].missing).length)}</head><body><div class="sheet">${items}</div></body></html>`;
}

/** Every slide at full size, one per page, for PDF. */
export function renderPrint(deck, { draft } = {}) {
  const m = manifest(deck);
  const [w, h] = m.size;
  const slugs = deck.order(draft).filter((s) => !m.slides[s].missing);
  const frames = slugs.map((slug) => `<iframe name="deck:print" src="/${deck.name}/slides/${slug}.html?mode=print"></iframe>`).join('\n');
  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(m.title)}</title><style>
@page{size:${w}px ${h}px;margin:0}
html,body{margin:0;background:#000}
iframe{display:block;width:${w}px;height:${h}px;border:0;break-inside:avoid}
iframe:not(:last-of-type){break-after:page}
</style>${readyScript(slugs.length)}</head><body>${frames}</body></html>`;
}

// Resolves window.__deckReady once every slide frame reports ready (or after a timeout).
// Lives in <head> so it is listening before any frame can finish loading.
const readyScript = (expected) => `<script>
(() => {
  const seen = new Set();
  let done;
  window.__deckReady = new Promise((r) => (done = r));
  addEventListener('message', (e) => {
    if (e.data && e.data.deckSlide && e.data.type === 'ready') { seen.add(e.source); if (seen.size >= ${expected}) done(true); }
  });
  if (${expected} === 0) done(true);
  setTimeout(() => done(false), 20000);
})();
</script>`;

// ---------- writing ----------
export function writeIfChanged(file, content) {
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) return false;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return true;
}

export function buildDeck(root, name) {
  const deck = openDeck(root, name);
  return writeIfChanged(path.join(deck.dir, 'index.html'), renderIndex(manifest(deck)));
}

export function buildHome(root) {
  return writeIfChanged(path.join(root, 'index.html'), renderHome(root));
}

export function fill(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '');
}

export function readTemplate(name) {
  return fs.readFileSync(path.join(KIT_DIR, 'templates', name), 'utf8');
}
