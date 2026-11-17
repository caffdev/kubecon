// gen.mjs: out/<slug>.json (from extract.mjs) → deck/project/ (Claude Slides, format v5)
//   Drawings: inline SVG with their animations inside. Labels: <p> over the drawing, or one PNG when a
//   slide would pass Slides' 24 pinned elements. Build steps: PNG fragments. Text: the extractor's
//   blocks, pinned where the kit put them, their computed styles folded into shared classes.
import fs from 'node:fs';
import path from 'node:path';
const HERE = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(HERE, 'out');
const ROOT = path.join(HERE, 'deck');
const DECKS = path.resolve(HERE, '../../..');
const DECK = JSON.parse(fs.readFileSync(path.join(HERE, 'artifact.json'), 'utf8')).deck;
const kit = JSON.parse(fs.readFileSync(path.join(DECKS, DECK, 'deck.json'), 'utf8'));
const ORDER = kit.drafts[kit.draft];
const PIN_BUDGET = 24;
const ESTATE_RUN = ['day-one', 'cloud-dev', 'second-exchange', 'cloud-migration', 'multi-region', 'second-cloud'];

const DISPLAY = `'Barlow Condensed', 'Arial Narrow', sans-serif`;
const BODY = `'Barlow', 'Helvetica Neue', Arial, sans-serif`;
const MONO = `'JetBrains Mono', 'Courier New', monospace`;
const EASE = 'cubic-bezier(.2,.7,.2,1)';

const load = (s) => JSON.parse(fs.readFileSync(path.join(OUT, `${s}.json`), 'utf8'));
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const typo = (t) => t.replace(/(\w)'(\w)/g, '$1’$2').replace(/(^|[\s(])'/g, '$1‘').replace(/'/g, '’');
/** curly apostrophes in the text of an HTML string, never inside a tag */
const typoHtml = (h) => h.split(/(<[^>]+>)/).map((seg) => (seg.startsWith('<') ? seg : typo(seg))).join('');
const r1 = (n) => Math.round(n);

// ---------- SVG helpers ----------
const addCss = (svg, css) => svg.includes('<style>') ? svg.replace('<style>', `<style>${css}`) : svg.replace(/^(<svg[^>]*>)/, `$1<style>${css}</style>`);
const dropRule = (svg, cls) => svg.replace(new RegExp(`\\.${cls}\\{[^}]*\\}`), '');
const clean = (svg) => svg.replace(/ data-(bb|len)="[^"]*"/g, '');
const LEAF = /<(path|rect|circle|line|ellipse|polyline|polygon)\b([^>]*?)(\/?)>/g;
function leaves(svg) {
  const skip = [...svg.matchAll(/<(defs|pattern|clipPath|mask|linearGradient|radialGradient)\b[\s\S]*?<\/\1>/g)].map((m) => [m.index, m.index + m[0].length]);
  const out = [];
  for (const m of svg.matchAll(LEAF)) {
    if (skip.some(([a, b]) => m.index > a && m.index < b)) continue;
    const a = m[2];
    out.push({ cls: (/ class="([^"]*)"/.exec(a) || [])[1] || '', bb: ((/ data-bb="([^"]*)"/.exec(a) || [])[1] || '0 0 0 0').split(' ').map(Number),
      len: +((/ data-len="([^"]*)"/.exec(a) || [])[1] || 0), at: m.index, src: m[0] });
  }
  return out;
}
/** give the matching leaves an inline animation */
function animate(svg, pick, styleOf) {
  const ls = leaves(svg).filter(pick);
  let i = 0;
  return svg.replace(LEAF, (whole, tag, attrs, slash, at) => {
    const l = ls.find((x) => x.at === at);
    if (!l || / style="/.test(attrs)) return whole;
    return `<${tag}${attrs} style="${styleOf(l, i++)}"${slash}>`;
  });
}
const KF = {
  draw: '@keyframes draw{from{stroke-dashoffset:var(--len)}}',
  fade: '@keyframes fade{from{opacity:0}}',
  rise: '@keyframes rise{from{opacity:0;transform:translateY(18px)}}',
  pop: '@keyframes pop{from{opacity:0;transform:scale(.4)}}',
};
const drawOn = (l, delay, dur = 1400) => `--len:${l.len};stroke-dasharray:${l.len};animation:draw ${dur}ms ${EASE} ${delay}ms both`;
const xDelay = (x, from = 250, span = 900) => r1(from + Math.max(0, Math.min(1, x / 1920)) * span);

// ---------- the motion each drawing gets ----------
/** a drawing the kit never animated: it builds left to right, lines drawing, shapes fading */
function reveal(m) {
  m = animate(m, (l) => l.bb[2] || l.bb[3], (l) => {
    const d = xDelay(l.bb[0] + l.bb[2] / 2);
    if (l.len && /fill="none"/.test(l.src) && !/stroke-dasharray=/.test(l.src)) return drawOn(l, d, 800);
    return `animation:fade 500ms ease ${d}ms both`;
  });
  return addCss(m, KF.draw + KF.fade);
}
const HOOKS = {
  /** the estate map: new zones draw, new apps pop in left to right (plus the kit's drops) */
  map(m) {
    m = animate(m, (l) => /zone-box new|region-rule new/.test(l.cls) && l.len, (l) => drawOn(l, 150, 1100));
    m = animate(m, (l) => /\bapp new\b/.test(l.cls), (l, i) => `transform-box:fill-box;transform-origin:50% 50%;animation:pop 420ms ${EASE} ${900 + i * 35}ms both`);
    return addCss(m, KF.draw + KF.pop);
  },
  /** overrun: bars stack up column by column, then the capacity lines draw */
  overrun(m) {
    m = animate(m, (l) => l.bb[2] === 40 && l.bb[1] > 330, (l) => {
      const panel = l.bb[0] < 680 ? 120 : l.bb[0] < 1250 ? 690 : 1260;
      const col = Math.round((l.bb[0] - panel - 34) / 68), lift = Math.max(0, 740 - (l.bb[1] + l.bb[3]));
      return `animation:rise 520ms ${EASE} ${250 + col * 90 + lift * 0.9}ms both`;
    });
    m = animate(m, (l) => /cap-line/.test(l.cls) && l.len, (l) => drawOn(l, 1100, 900));
    return addCss(m, KF.rise + KF.draw);
  },
  /** gates: rings ripple out from the test cluster, the fleet settles on them, gates pop */
  gates(m) {
    let ri = 0;
    m = animate(m, (l) => /\bring\b/.test(l.cls) && l.len, (l) => drawOn(l, 200 + (ri++) * 160, 900));
    m = animate(m, (l) => /pk-glyph old/.test(l.cls), (l) => `animation:fade 500ms ease ${r1(400 + Math.hypot(l.bb[0] + l.bb[2] / 2 - 190, l.bb[1] + l.bb[3] / 2 - 700) * 1.3)}ms both`);
    m = animate(m, (l) => /\bgate\b/.test(l.cls), (l, i) => `transform-box:fill-box;transform-origin:50% 50%;animation:pop 400ms ${EASE} ${1100 + i * 110}ms both`);
    return addCss(m, KF.draw + KF.fade + KF.pop);
  },
  /** ai-resize: use draws across the week, VPA lands, the AI's request follows, the saving fills */
  'ai-resize'(m) {
    m = animate(m, (l) => /^use\b/.test(l.cls) && l.len, (l) => drawOn(l, 300, 1700));
    m = animate(m, (l) => /^vpa\b/.test(l.cls), () => `animation:fade 600ms ease 1500ms both`);
    m = animate(m, (l) => /^ai\b/.test(l.cls) && l.len, (l) => drawOn(l, 1900, 1700));
    m = animate(m, (l) => /^saved\b/.test(l.cls), () => `animation:fade 900ms ease 3300ms both`);
    return addCss(m, KF.draw + KF.fade);
  },
};
/** when each overlay label arrives, per drawing */
const LABEL_TIMING = {
  title: (l, i) => `animation:fade 700ms ease ${1000 + i * 140}ms both;`,
  map: (l) => /\bnew\b/.test(l.cls) ? 'animation:fade 500ms ease 700ms both;' : '',
  gates: (l) => `animation:fade 500ms ease ${r1(600 + (l.x - 150) * 1.2)}ms both;`,
  'ai-resize': (l) => { const k = { 'vpa-t': 1600, 'ai-t': 3000, 'use-t': 1500 }; const h = Object.keys(k).find((x) => l.cls.includes(x)); return h ? `animation:fade 600ms ease ${k[h]}ms both;` : ''; },
  reveal: (l) => `animation:fade 500ms ease ${xDelay(l.x + l.w / 2) + 150}ms both;`,
};

// ---------- labels ----------
const classes = new Map();   // css text → class name
const cls = (css, prefix = 'x') => { if (!classes.has(css)) classes.set(css, `${prefix}${classes.size + 1}`); return classes.get(css); };
function labelP(l, extra = '') {
  const size = Math.max(24, l.size);
  const fam = /Mono/.test(l.family) ? MONO : /Condensed/.test(l.family) ? DISPLAY : BODY;
  const ls = l.spacing && l.spacing !== 'normal' && parseFloat(l.spacing) ? `letter-spacing:${l.spacing};` : '';
  const c = cls(`font-family:${fam};font-size:${size}px;font-weight:${l.weight};color:${l.color};${ls}${l.opacity < 0.99 ? `opacity:${+l.opacity.toFixed(2)};` : ''}`, 'lb');
  const k = size / l.size, w = l.w * k + 14, h = l.h * k;
  const left = l.anchor === 'middle' ? l.x + l.w / 2 - w / 2 : l.anchor === 'end' ? l.x + l.w - w : l.x;
  const align = l.anchor === 'middle' ? 'center' : l.anchor === 'end' ? 'right' : 'left';
  return `<p class="lb ${c}" style="left:${r1(left)}px;top:${r1(l.y - (h - l.h) / 2)}px;width:${r1(w)}px;line-height:${r1(h)}px;text-align:${align};${extra}">${esc(typo(l.text))}</p>`;
}

// ---------- text blocks ----------
const GEOM = new Set(['position', 'left', 'top', 'width', 'height', 'grid-column', 'grid-row']);
const NUM = /^[\d][\d,.]*%?$/;
const famOf = (f) => /Mono/.test(f) ? MONO : /Condensed/.test(f) ? DISPLAY : /Barlow/.test(f) ? BODY : f;
function block(n, { id } = {}) {
  const inline = [], rest = [];
  for (const [k, v] of Object.entries(n.s)) {
    if (k === 'font-family') rest.push(`font-family:${famOf(v)}`);
    else (GEOM.has(k) ? inline : rest).push(`${k}:${v}`);
  }
  const names = [];
  if (rest.length) names.push(cls(rest.sort().join(';') + ';'));
  if (n.a.class) names.push(n.a.class);
  const text = n.c.length === 1 && typeof n.c[0] === 'string' ? n.c[0] : null;
  if (text && NUM.test(text.trim()) && parseFloat(n.s['font-size']) >= 44) names.push('n');
  const attrs = [id ? ` id="${id}"` : '', names.length ? ` class="${names.join(' ')}"` : '', inline.length ? ` style="${inline.join(';')}"` : '',
    n.a['data-fragment-index'] ? ` data-fragment-index="${n.a['data-fragment-index']}"` : ''].join('');
  const body = n.c.map((c) => (typeof c === 'string' ? typoHtml(c) : block(c))).join('');
  return `<${n.t}${attrs}>${body}</${n.t}>`;
}

// ---------- drawings ----------
const svgEl = (s, markup, { id = '', label = '' } = {}) =>
  `<svg${id ? ` id="${id}"` : ''} ${label ? `aria-label="${esc(label)}"` : 'aria-hidden="true"'} style="position:absolute;left:${s.box.x}px;top:${s.box.y}px;width:${s.box.w}px;height:${s.box.h}px"` + clean(markup).replace(/^<svg/, '');
const img = (layer, alt, extraCls = '', style = '') =>
  `<img class="art${extraCls ? ' ' + extraCls : ''}" src="{{asset:${path.basename(layer.file)}}}" alt="${esc(alt)}" style="left:${layer.box.x}px;top:${layer.box.y}px;width:${layer.box.w}px;height:${layer.box.h}px;${style}"${extraCls.includes('fragment') ? ` data-fragment-index="${layer.step}"` : ''}>`;

/** the background range: a peak rises only if it wasn't up on the slide before; the star fades in once */
function range(s, prevUp, first) {
  let m = s.markup;
  const up = [];
  for (const [c, key] of Object.entries(s.animKeys)) {
    if (key.startsWith('rg-')) { up.push(key); if (prevUp.includes(key)) m = dropRule(m, c); }
    if (key === 'north-star' && !first) m = dropRule(m, c);
  }
  const words = s.labels.map((l) => {
    const peak = { fleet: 'rg-p3', delivery: 'rg-p1', agents: 'rg-p2' }[l.text];
    return labelP(l, peak && !prevUp.includes(peak) ? 'animation:fade 600ms ease 1300ms both;' : '');
  });
  return { html: [svgEl(s, m), ...words].join('\n'), up, pins: 1 + words.length };
}

function drawing(d, s, { png }) {
  const kitAnimated = Object.keys(s.animKeys).length > 0;
  const hook = HOOKS[d.slug] || HOOKS[s.cls];
  let m = s.markup, timing = LABEL_TIMING[d.slug] || LABEL_TIMING[s.cls];
  if (hook) m = hook(m);
  else if (!kitAnimated) { m = reveal(m); timing = timing || LABEL_TIMING.reveal; }
  const base = s.labels.filter((l) => !l.step);
  let labels = '';
  if (base.length && png) {
    const layer = d.layers.find((x) => x.svg === s.index && x.step === 0);
    labels = img(layer, `Labels: ${s.label}`, '', !kitAnimated && !hook ? 'animation:fade 600ms ease 1100ms both;' : '');
  } else labels = base.map((l, i) => labelP(l, timing ? timing(l, i) : '')).join('\n');
  const steps = d.layers.filter((x) => x.svg === s.index && x.step).map((x) => img(x, `${s.label} (step ${x.step})`, 'fragment')).join('\n');
  const id = ESTATE_RUN.includes(d.slug) && s.cls === 'map' ? 'estate' : '';
  return [svgEl(s, m, { id, label: s.label }), labels, steps].filter(Boolean).join('\n');
}

// ---------- build ----------
fs.rmSync(path.join(ROOT, 'project'), { recursive: true, force: true });
fs.mkdirSync(path.join(ROOT, 'project', 'slides'), { recursive: true });
let prevUp = [];
const assets = new Set();
const report = [];
ORDER.forEach((slug, i) => {
  const d = load(slug);
  d.slug = slug;
  // which drawings' labels go to PNG: the most-labelled first, until the slide fits the pinned budget
  const art = d.svgs.filter((s) => s.cls !== 'range');
  const rangeSvg = d.svgs.find((s) => s.cls === 'range');
  const png = new Set();
  const pins = () => d.blocks.length + (rangeSvg ? 1 + rangeSvg.labels.length : 0)
    + art.reduce((n, s) => n + 1 + (png.has(s) ? 1 : s.labels.filter((l) => !l.step).length) + Object.keys(s.steps).length, 0);
  // labels the 24px floor would blow up by more than a quarter (a scaled-down drawing) stay pictures
  for (const s of art) if (s.labels.some((l) => !l.step && l.size < 24 / 1.25)) png.add(s);
  for (const s of [...art].sort((a, b) => b.labels.length - a.labels.length)) { if (pins() <= PIN_BUDGET) break; if (s.labels.some((l) => !l.step)) png.add(s); }
  // pieces in the kit's paint order: negative z-index first, then the page order
  const ordered = [...d.order.filter((o) => o.z < 0), ...d.order.filter((o) => o.z >= 0)];
  const parts = [];
  for (const o of ordered) {
    if (o.kind === 'svg') {
      const s = d.svgs[o.index];
      if (s.cls === 'range') { const rg = range(s, prevUp, i === 0); prevUp = rg.up; parts.push(rg.html); }
      else parts.push(drawing(d, s, { png: png.has(s) }));
    } else {
      const b = d.blocks[o.index];
      parts.push(block(b, { id: ESTATE_RUN.includes(slug) && /\bcensus\b/.test(b.oc) ? 'census' : '' }));
    }
  }
  if (!rangeSvg) prevUp = [];
  const ground = /\bsnow\b/.test(d.cls) ? 'snow' : /\bdusk\b/.test(d.cls) ? 'dusk' : 'night';
  const transition = ESTATE_RUN.includes(slug) && ESTATE_RUN.includes(ORDER[i + 1]) ? 'magic' : 'fade';
  const notes = `<aside>${esc(typo(d.notes.replace(/\n{3,}/g, '\n\n')))}</aside>`;
  const html = `<section id="${slug}" class="${ground}" data-transition="${transition}">\n${parts.join('\n')}\n${notes}\n</section>\n`;
  for (const m of html.matchAll(/\{\{asset:([^}]+)\}\}/g)) assets.add(m[1]);
  fs.writeFileSync(path.join(ROOT, 'project', 'slides', `${slug}.html`), html);
  const svgK = [...html.matchAll(/<svg[\s\S]*?<\/svg>/g)].map((m) => m[0].length / 1024);
  const tags = (html.replace(/<svg[\s\S]*?<\/svg>/g, '<svg>').match(/<(p|h[1-3]|div|img|svg|span|b|i|u|br|x-icon)\b/g) || []).length;
  report.push(`${slug.padEnd(20)} ${(html.length / 1024).toFixed(1).padStart(5)}K  maxsvg ${Math.max(0, ...svgK).toFixed(1)}K  pinned ${pins()}  elements ${tags}  notes ${d.notes.length}${png.size ? '  labels→png' : ''}${d.warns.length ? '  warn ' + d.warns.length : ''}`);
});

// ---------- deck.css ----------
const css = `/* ${kit.title}: Three Peaks brand, ported from docs/decks/${DECK} by _shared/gen/slides-port */
@property --n { syntax: '<integer>'; inherits: false; initial-value: 0 }
@keyframes count { from { --n: 0 } }
.n { animation: count 1.2s ease-out both }
@keyframes fade { from { opacity: 0 } }

body { font-family: ${BODY}; color: #e8f4f2; }
section { background: #070b0e; color: #e8f4f2; padding: 96px 120px; font-family: ${BODY}; font-size: 34px; line-height: 1.38; }
section.dusk { background: #0f2230; }
section.snow { background: #e9f1f0; color: #0f1e29; }
.art, .lb { position: absolute; }
.lb { white-space: nowrap; }

/* click builds */
.fragment { opacity: 0; transform: translateY(14px); transition: opacity 450ms ease, transform 450ms ${EASE}; }
.fragment.visible { opacity: 1; transform: none; }

/* every text style in the deck, from the kit's computed styles */
${[...classes].map(([c, n]) => `.${n} { ${c.replace(/;/g, '; ').trim()} }`).join('\n')}
`;
fs.writeFileSync(path.join(ROOT, 'project', 'deck.css'), css);

const starts = [
  ['The north star, and an estate that grows from four clusters to three clouds', 'title'],
  ['Upgrades by hand: one runbook, four tools, and every group drowning', 'one-runbook'],
  ['The fixes: clusters from code, tools through waves and gates, placement by constraint', 'kubeadm-past'],
  ['The agents arrive: elastic, sandboxed, behind one gateway and one policy layer', 'ai-arrives'],
  ['One view, one lake, and the ask', 'one-view'],
].filter(([, s]) => ORDER.includes(s));
const deck = {
  v: 5, createdOnFiles: { v: 1, at: new Date().toISOString().replace(/\.\d+Z$/, 'Z') }, lists: 'css', format: { v: 1, shared: ['project/deck.css'] },
  title: 'Takeaways v3: the fleet outgrows one team, then the agents arrive',
  order: ORDER,
  sections: Object.fromEntries(starts.map(([description, start], i) => [`s${i + 1}`, { description, start }])),
  cover: ORDER[0],
  faces: {
    'barlow-condensed': { family: 'Barlow Condensed', href: 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&display=swap' },
    barlow: { family: 'Barlow', href: 'https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap' },
    'jetbrains-mono': { family: 'JetBrains Mono', href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap' },
  },
  designSystems: [],
};
fs.writeFileSync(path.join(ROOT, 'project', 'deck.json'), JSON.stringify(deck, null, 1));
fs.writeFileSync(path.join(ROOT, 'assets.json'), JSON.stringify([...assets].map((a) => ({ name: a, path: path.join(OUT, a) })), null, 1));
console.log(report.join('\n'));
console.log(`slides ${ORDER.length}  assets ${assets.size}  classes ${classes.size}  deck.css ${(css.length / 1024).toFixed(1)}K`);
