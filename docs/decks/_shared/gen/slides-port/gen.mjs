// gen.mjs: out/<slug>.json (from extract.mjs) + the text below → deck/project/ (Slides format v5)
// Art: inline SVG with its own <style> animations. Labels: <p> over the art, or a PNG when a
// drawing has too many to pin. Build steps: PNG fragments. Text: hand-ported, editable.
import fs from 'node:fs';
import path from 'node:path';
const HERE = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(HERE, 'out');
const ROOT = path.join(HERE, 'deck');
const ORDER = ['title', 'day-one', 'cloud-dev', 'second-exchange', 'overrun', 'gates', 'ai-resize'];
const LABEL_BUDGET = 16;      // more labels than this on one drawing → one PNG

const C = { night: '#070b0e', dusk: '#0f2230', snow: '#e8f4f2', lichen: '#9fb4b6', scree: '#3a4a52', mint: '#9cf0e1',
  teal: '#36baa2', haze: '#68b6c3', glow: '#f4a261', lake: '#4f8fd8' };
const DISPLAY = `'Barlow Condensed', 'Arial Narrow', sans-serif`;
const BODY = `'Barlow', 'Helvetica Neue', Arial, sans-serif`;

const load = (s) => JSON.parse(fs.readFileSync(path.join(OUT, `${s}.json`), 'utf8'));
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const typo = (t) => t.replace(/(\w)'(\w)/g, '$1’$2').replace(/(^|\s)'/g, '$1‘').replace(/'/g, '’');
const r1 = (n) => Math.round(n);

// ---------- SVG helpers ----------
const addCss = (svg, css) => svg.includes('<style>') ? svg.replace('<style>', `<style>${css}`) : svg.replace(/^(<svg[^>]*>)/, `$1<style>${css}</style>`);
const dropRule = (svg, cls) => svg.replace(new RegExp(`\\.${cls}\\{[^}]*\\}`), '');
const clean = (svg) => svg.replace(/ data-(bb|len)="[^"]*"/g, '');
/** every leaf with its class list, bbox and path length, for rules that pick by class or position */
function leaves(svg) {
  const out = [];
  const re = /<(path|rect|circle|line|ellipse|polyline|polygon)\b([^>]*?)\/?>/g;
  let m;
  while ((m = re.exec(svg))) {
    const a = m[2];
    const cls = (/ class="([^"]*)"/.exec(a) || [])[1] || '';
    const bb = ((/ data-bb="([^"]*)"/.exec(a) || [])[1] || '0 0 0 0').split(' ').map(Number);
    const len = +((/ data-len="([^"]*)"/.exec(a) || [])[1] || 0);
    out.push({ tag: m[1], cls, bb, len, at: m.index, src: m[0] });
  }
  return out;
}
/** give the n-th matching leaves an inline animation (style="…") */
function animate(svg, pick, styleOf) {
  const ls = leaves(svg).filter(pick);
  let i = 0;
  return svg.replace(/<(path|rect|circle|line|ellipse|polyline|polygon)\b([^>]*?)(\/?)>/g, (whole, tag, attrs, slash, at) => {
    const l = ls.find((x) => x.at === at);
    if (!l) return whole;
    const st = styleOf(l, i++);
    return `<${tag}${attrs} style="${st}"${slash}>`;
  });
}
const KF = {
  draw: '@keyframes draw{from{stroke-dashoffset:var(--len)}}',
  fade: '@keyframes fade{from{opacity:0}}',
  rise: '@keyframes rise{from{opacity:0;transform:translateY(18px)}}',
  pop: '@keyframes pop{from{opacity:0;transform:scale(.4)}}',
};
const EASE = 'cubic-bezier(.2,.7,.2,1)';
const drawOn = (l, delay, dur = 1400) => `--len:${l.len};stroke-dasharray:${l.len};animation:draw ${dur}ms ${EASE} ${delay}ms both`;

// ---------- labels ----------
const labelCss = new Map();   // type style → class
function labelClass(l) {
  const size = Math.max(24, l.size);
  const fam = /Condensed/.test(l.family) ? DISPLAY : BODY;
  const key = `${fam}|${size}|${l.weight}|${l.color}|${l.spacing}`;
  if (!labelCss.has(key)) {
    const ls = l.spacing && l.spacing !== 'normal' ? `letter-spacing:${l.spacing};` : '';
    labelCss.set(key, { cls: `lb${labelCss.size + 1}`, css: `font-family:${fam};font-size:${size}px;font-weight:${l.weight};color:${l.color};${ls}` });
  }
  return labelCss.get(key).cls;
}
function labelP(l, extraStyle = '', extraCls = '') {
  const k = Math.max(24, l.size) / l.size;
  const w = l.w * k + 14, h = l.h * k;
  let left = l.x;
  if (l.anchor === 'middle') left = l.x + l.w / 2 - w / 2;
  else if (l.anchor === 'end') left = l.x + l.w - w;
  const align = l.anchor === 'middle' ? 'center' : l.anchor === 'end' ? 'right' : 'left';
  const top = l.y - (h - l.h) / 2;
  return `<p class="lb ${labelClass(l)}${extraCls ? ' ' + extraCls : ''}" style="left:${r1(left)}px;top:${r1(top)}px;width:${r1(w)}px;line-height:${r1(h)}px;text-align:${align};${extraStyle}">${esc(typo(l.text))}</p>`;
}


// ---------- live text from the extraction ----------
const dec = (t) => t.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const strip = (h) => dec(h.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const all = (d, tag, cls) => d.html.filter((h) => h.tag === tag && (cls == null || (' ' + h.cls + ' ').includes(' ' + cls + ' ')));
const one = (d, tag, cls, i = 0) => { const h = all(d, tag, cls)[i]; if (!h) throw new Error(`${d.slug}: no ${tag}${cls ? '.' + cls : ''}[${i}]`); return h; };
const T = (s) => esc(typo(s));
const heading = (h) => h.lines.map(T).join('<br>');
/** "<i>I</i><span><b>B</b> rest</span>" or "<b>B</b><span>rest</span>" */
const parts = (inner) => ({ icon: strip((/<i\b[^>]*>([\s\S]*?)<\/i>/.exec(inner) || [])[1] || ''), b: strip((/<b\b[^>]*>([\s\S]*?)<\/b>/.exec(inner) || [])[1] || ''),
  rest: strip(inner.replace(/<i\b[^>]*>[\s\S]*?<\/i>/, '').replace(/<b\b[^>]*>[\s\S]*?<\/b>/, '')) });
/** inline markup: <b> becomes the given wrapper; path-colour spans survive */
const inline = (inner, b) => inner.split(/(<b\b[^>]*>[\s\S]*?<\/b>|<span class="[^"]*">[\s\S]*?<\/span>)/).map((seg) => {
  const mb = /^<b\b[^>]*>([\s\S]*?)<\/b>$/.exec(seg); if (mb) return b(T(strip(mb[1])));
  const ms = /^<span class="([^"]*)">([\s\S]*?)<\/span>$/.exec(seg); if (ms) return `<span class="${ms[1]}">${T(strip(ms[2]))}</span>`;
  return T(strip(seg) ? dec(seg.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ') : seg.replace(/<[^>]+>/g, ''));
}).join('');

// ---------- pieces ----------
const svgEl = (s, markup, { id = '', label = '' } = {}) =>
  `<svg${id ? ` id="${id}"` : ''} ${label ? `aria-label="${esc(label)}"` : 'aria-hidden="true"'} style="position:absolute;left:${s.box.x}px;top:${s.box.y}px;width:${s.box.w}px;height:${s.box.h}px"` + clean(markup).replace(/^<svg/, '').replace(/ xmlns="http:\/\/www.w3.org\/2000\/svg"/, ' xmlns="http://www.w3.org/2000/svg"');
const img = (layer, alt, cls = 'art', extra = '') =>
  `<img class="${cls}" src="{{asset:${path.basename(layer.file)}}}" alt="${esc(alt)}" style="left:${layer.box.x}px;top:${layer.box.y}px;width:${layer.box.w}px;height:${layer.box.h}px;${extra}">`;

/** the range: newly risen peaks emerge, peaks already up stay still; the star fades in only on the first slide */
function range(d, prevUp, first) {
  const s = d.svgs.find((x) => x.cls === 'range');
  if (!s) return { html: '', up: [] };
  let m = s.markup;
  const up = [];
  for (const [cls, key] of Object.entries(s.animKeys)) {
    if (key.startsWith('rg-')) { up.push(key); if (prevUp.includes(key)) m = dropRule(m, cls); }
    if (key === 'north-star' && !first) m = dropRule(m, cls);
  }
  const words = s.labels.map((l) => {
    const peak = { fleet: 'rg-p3', delivery: 'rg-p1', agents: 'rg-p2' }[l.text];
    const fresh = peak && !prevUp.includes(peak);
    return labelP(l, fresh ? 'animation:fade 600ms ease 1300ms both;' : '');
  });
  return { html: svgEl(s, m) + '\n' + words.join('\n'), up };
}

function labelsFor(d, s, opts = {}) {
  const base = s.labels.filter((l) => !l.step);
  if (base.length > LABEL_BUDGET || opts.png) {
    const layer = d.layers.find((x) => x.svg === s.index && x.step === 0);
    return img(layer, `Labels for: ${s.label}`);
  }
  return base.map((l) => labelP(l, opts.style ? opts.style(l) : '')).join('\n');
}
function stepImgs(d, s, alts) {
  return d.layers.filter((x) => x.svg === s.index && x.step).map((x) =>
    img(x, alts[x.step - 1] || `Build step ${x.step}`, 'art fragment', '').replace('<img ', `<img data-fragment-index="${x.step}" `)).join('\n');
}
const notes = (d) => `<aside>${esc(typo(d.notes.replace(/\n{3,}/g, '\n\n')))}</aside>`;

// ---------- per-slide art animation (converted + new) ----------
function estateMap(s, stage) {
  let m = s.markup;
  // new zone outlines and region rule draw on; new apps pop in, left to right
  m = animate(m, (l) => /zone-box new|region-rule new/.test(l.cls) && l.len, (l) => drawOn(l, 150, 1100));
  m = animate(m, (l) => /\bapp new\b/.test(l.cls), (l, i) => `transform-box:fill-box;transform-origin:50% 50%;animation:pop 420ms ${EASE} ${900 + i * 35}ms both`);
  m = addCss(m, KF.draw + KF.pop);
  return m;
}

const census = (d, extraCls = '') => {
  const nums = d.html.filter((h) => h.tag === 'b').map((h) => ({ v: h.text, up: h.color === C.haze }));
  const words = ['clusters', 'apps', 'pods'];
  return `<div class="census" id="census">\n${nums.map((n, i) => `<p class="c-n${n.up ? ' up n' : ''}${extraCls}">${n.v}</p><p class="c-w">${words[i]}</p>`).join('\n')}\n</div>`;
};

// ---------- slides ----------
const SLIDES = {
  title(d, ctx) {
    const hero = d.svgs.find((x) => x.cls === 'hero');
    const words = hero.labels.map((l, i) => labelP(l, `animation:fade 700ms ease ${1000 + i * 140}ms both;`)).join('\n');
    return { cls: 'tk', transition: 'fade', body: `${ctx.range}
${svgEl(hero, hero.markup)}
${words}
<h1 class="t-hero">${heading(one(d, 'h1'))}</h1>
<p class="t-sub">${T(one(d, 'p', 'sub').text)}</p>
<p class="t-by">${T(one(d, 'p', 'byline').text)}</p>` };
  },
  estate(d, ctx, stage, transition) {
    const map = d.svgs.find((x) => x.cls === 'map');
    const mk = estateMap(map, stage);
    const lbl = labelsFor(d, map, { style: (l) => /\bnew\b/.test(l.cls) ? 'animation:fade 500ms ease 700ms both;' : '' });
    return { cls: 'tk', transition, body: `${ctx.range}
${svgEl(map, mk, { id: 'estate', label: map.label })}
${lbl}
<h1 class="t-estate">${heading(one(d, 'h1'))}</h1>
${census(d)}` };
  },
  overrun(d, ctx) {
    const ch = d.svgs.find((x) => x.cls === 'chart');
    let m = ch.markup;
    // bars stack up, column by column, bottom segment first
    m = animate(m, (l) => l.bb[2] === 40 && l.bb[1] > 330, (l) => {
      const panel = l.bb[0] < 680 ? 120 : l.bb[0] < 1250 ? 690 : 1260;
      const col = Math.round((l.bb[0] - panel - 34) / 68), lift = Math.max(0, 740 - (l.bb[1] + l.bb[3]));
      return `animation:rise 520ms ${EASE} ${250 + col * 90 + lift * 0.9}ms both`;
    });
    m = animate(m, (l) => /cap-line/.test(l.cls) && l.len, (l) => drawOn(l, 1100, 900));
    m = addCss(m, KF.rise + KF.draw);
    return { cls: 'tk', transition: 'fade', body: `${ctx.range}
${svgEl(ch, m, { label: ch.label })}
${labelsFor(d, ch)}
<h2 class="t-overrun">${heading(one(d, 'h2'))}</h2>
<p class="model-tag">${inline(one(d, 'p', 'model-tag').inner, (t) => `<span class="warn"><b>${t}</b></span>`)}</p>
${stepImgs(d, ch, ['AI adds a fourth bar to every panel: 976 hours for admins, 3,756 for the platform team, 1,560 for developers'])}` };
  },
  gates(d, ctx) {
    const rg = d.svgs.find((x) => x.cls === 'rings');
    let m = rg.markup;
    // rings ripple out from the test cluster; the fleet settles on them; gates pop on the ray
    let ri = 0;
    m = animate(m, (l) => /\bring\b/.test(l.cls) && l.len, (l) => drawOn(l, 200 + (ri++) * 160, 900));
    m = animate(m, (l) => /pk-glyph old/.test(l.cls), (l) => {
      const dx = l.bb[0] + l.bb[2] / 2 - 190, dy = l.bb[1] + l.bb[3] / 2 - 700, r = Math.hypot(dx, dy);
      return `animation:fade 500ms ease ${400 + r * 1.3}ms both`;
    });
    m = animate(m, (l) => /\bgate\b/.test(l.cls), (l, i) => `transform-box:fill-box;transform-origin:50% 50%;animation:pop 400ms ${EASE} ${1100 + i * 110}ms both`);
    m = addCss(m, KF.draw + KF.fade + KF.pop);
    const lbl = labelsFor(d, rg, { style: (l) => `animation:fade 500ms ease ${600 + (l.x - 150) * 1.2}ms both;` });
    return { cls: 'tk dusk', transition: 'fade', body: `${ctx.range}
${svgEl(rg, m, { label: rg.label })}
${lbl}
${stepImgs(d, rg, ['The test cluster takes the new version and its gate passes', 'The canary takes it and its gate fails', 'The canary rolls back to the old version on its own'])}
<div class="group-tag"><div class="g-bars"><div class="g-bar g-admins"></div><div class="g-bar g-platform on"></div><div class="g-bar g-developers"></div></div><p class="g-name">${T(one(d, 'p', 'group-tag').own)}</p></div>
<h2 class="t-gates">${heading(one(d, 'h2'))}</h2>
<div class="log">
${all(d, 'li').filter((h) => /\b(pass|fail)\b/.test(h.cls)).map((h, i) => { const q = parts(h.inner), fail = /\bfail\b/.test(h.cls);
  const icon = q.icon === '✓' ? `<x-icon name="Check" class="log-icon pass"></x-icon>` : `<p class="log-icon-t${fail ? ' fail' : ''}">${T(q.icon)}</p>`;
  return `<div class="log-row fragment" data-fragment-index="${i + 1}">${icon}<p class="log-b${fail ? ' fail' : ''}">${T(q.b)}</p><p class="log-t">${T(q.rest)}</p></div>`; }).join('\n')}
</div>
<div class="gatelist">
<h3>${T(one(d, 'h3').text)}</h3>
${all(d, 'li').filter((h) => !/\b(pass|fail)\b/.test(h.cls)).map((h) => { const q = parts(h.inner);
  return `<div class="gate-row${/\bhot\b/.test(h.cls) ? ' hot' : ''}"><p class="gate-b">${T(q.b)}</p><p class="gate-t">${T(q.rest)}</p></div>`; }).join('\n')}
</div>
<p class="src s-gates">${T(one(d, 'p', 'src').text)}</p>` };
  },
  'ai-resize'(d, ctx) {
    const ch = d.svgs.find((x) => x.cls === 'chart');
    let m = ch.markup;
    // actual use draws across the week, VPA's flat request lands, then the AI's request tracks it and the saving fills in
    m = animate(m, (l) => /^use\b/.test(l.cls) && l.len, (l) => drawOn(l, 300, 1700));
    m = animate(m, (l) => /^vpa\b/.test(l.cls), () => `animation:fade 600ms ease 1500ms both`);
    m = animate(m, (l) => /^ai\b/.test(l.cls) && l.len, (l) => drawOn(l, 1900, 1700));
    m = animate(m, (l) => /^saved\b/.test(l.cls), () => `animation:fade 900ms ease 3300ms both`);
    m = addCss(m, KF.draw + KF.fade);
    const delay = { 'vpa-t': 1600, 'ai-t': 3000, 'use-t': 1500 };
    const lbl = labelsFor(d, ch, { style: (l) => { const k = Object.keys(delay).find((x) => l.cls.includes(x)); return k ? `animation:fade 600ms ease ${delay[k]}ms both;` : ''; } });
    return { cls: 'tk', transition: 'fade', body: `${ctx.range}
${svgEl(ch, m, { label: ch.label })}
${lbl}
<h2 class="t-resize">${heading(one(d, 'h2'))}</h2>
<p class="lede t-resize-lede">${inline(one(d, 'p', 'lede').inner, (t) => `<span class="hi">${t}</span>`)}</p>
<div class="tally"><p class="tally-n n">${T(one(d, 'b', 'big').text)}</p><p class="tally-t">${T(one(d, 'div', 'tally').own)}</p></div>
<div class="guard"><p class="guard-b">${T(parts(one(d, 'div', 'guard').inner).b)}</p><p class="guard-t">${T(one(d, 'div', 'guard').own)}</p></div>
<div class="how">
${all(d, 'div').filter((h) => h.cls === '' && /^<b>/.test(h.inner)).map((h) => `<div class="how-c"><p class="how-b">${T(parts(h.inner).b)}</p><p class="how-t">${T(h.own)}</p></div>`).join('\n')}
</div>` };
  },
};

// ---------- build ----------
fs.rmSync(path.join(ROOT, 'project'), { recursive: true, force: true });
fs.mkdirSync(path.join(ROOT, 'project', 'slides'), { recursive: true });
let prevUp = [];
const assets = new Set();
const report = [];
ORDER.forEach((slug, i) => {
  const d = load(slug);
  const rg = range(d, prevUp, i === 0);
  prevUp = rg.up;
  const ctx = { range: rg.html };
  let out;
  if (slug === 'day-one') out = SLIDES.estate(d, ctx, 1, 'magic');
  else if (slug === 'cloud-dev') out = SLIDES.estate(d, ctx, 2, 'magic');
  else if (slug === 'second-exchange') out = SLIDES.estate(d, ctx, 3, 'fade');
  else out = SLIDES[slug](d, ctx);
  const html = `<section id="${slug}" class="${out.cls}" data-transition="${out.transition}">\n${out.body}\n${notes(d)}\n</section>\n`;
  for (const m of html.matchAll(/\{\{asset:([^}]+)\}\}/g)) assets.add(m[1]);
  fs.writeFileSync(path.join(ROOT, 'project', 'slides', `${slug}.html`), html);
  const svgSizes = [...html.matchAll(/<svg[\s\S]*?<\/svg>/g)].map((m) => (m[0].length / 1024).toFixed(1) + 'K');
  const pinned = (html.match(/position:absolute|class="lb |class="art|class="census|class="model-tag|class="group-tag|class="log"|class="gatelist|class="src|class="lede|class="tally|class="guard|class="how"/g) || []).length;
  report.push(`${slug.padEnd(16)} ${(html.length / 1024).toFixed(1)}K  svgs ${svgSizes.join(' ')}  ~pinned ${pinned}  notes ${d.notes.length}`);
});

// ---------- deck.css ----------
const css = `/* Takeaways v3 on Slides: Three Peaks brand, ported from docs/decks/takeaways-v3 */
@property --n { syntax: '<integer>'; inherits: false; initial-value: 0 }
@keyframes count { from { --n: 0 } }
.n { animation: count 1.2s ease-out both }
@keyframes fade { from { opacity: 0 } }

body { font-family: ${BODY}; color: ${C.snow}; }
section { background: ${C.night}; color: ${C.snow}; padding: 96px 120px; font-family: ${BODY}; font-size: 34px; line-height: 1.38; }
section.dusk { background: ${C.dusk}; }
h1 { font-family: ${DISPLAY}; font-weight: 600; font-size: 112px; line-height: 1.02; letter-spacing: -1px; color: ${C.snow}; }
h2 { font-family: ${DISPLAY}; font-weight: 600; font-size: 76px; line-height: 1.02; letter-spacing: -1px; color: ${C.snow}; max-width: 1500px; }
h3 { font-family: ${DISPLAY}; font-weight: 600; font-size: 50px; line-height: 1.08; color: ${C.snow}; }
.art { position: absolute; }
.lb { position: absolute; white-space: nowrap; }
${[...labelCss.values()].map((v) => `.${v.cls} { ${v.css} }`).join('\n')}
.warn { color: ${C.glow}; }

/* click builds */
.fragment { opacity: 0; transform: translateY(14px); transition: opacity 450ms ease, transform 450ms ${EASE}; }
.fragment.visible { opacity: 1; transform: none; }

/* title */
.t-hero { font-size: 150px; line-height: .95; letter-spacing: -3px; max-width: 1300px; }
.t-sub { margin-top: 26px; font-family: ${DISPLAY}; font-weight: 600; font-size: 72px; line-height: 1.02; color: ${C.lichen}; max-width: 1200px; }
.t-by { margin-top: 30px; font-size: 30px; color: ${C.lichen}; }

/* the estate run */
.t-estate { font-size: 92px; line-height: 1; max-width: 1400px; }
.census { position: absolute; left: 1562px; top: 104px; width: 272px; display: grid; grid-template-columns: 120px 140px; column-gap: 12px; row-gap: 2px; align-items: baseline; }
.c-n { font-family: ${DISPLAY}; font-weight: 600; font-size: 50px; line-height: 1.05; color: ${C.snow}; text-align: right; font-variant-numeric: tabular-nums; }
.c-n.up { color: ${C.haze}; }
.c-w { font-size: 30px; line-height: 1.2; color: ${C.lichen}; }

/* overrun */
.t-overrun { font-size: 80px; max-width: 1600px; }
.model-tag { position: absolute; left: 120px; top: 930px; width: 560px; font-size: 24px; line-height: 1.3; font-weight: 500; color: ${C.lichen}; }

/* gates */
.group-tag { position: absolute; left: 120px; top: 40px; width: 400px; display: flex; align-items: center; gap: 14px; }
.g-name { font-family: ${DISPLAY}; font-weight: 600; font-size: 28px; line-height: 1; letter-spacing: .5px; color: ${C.mint}; }
.g-bars { display: flex; gap: 5px; align-items: flex-end; }
.g-bar { width: 10px; height: 26px; border-radius: 2px; opacity: .25; }
.g-bar.on { opacity: 1; }
.g-admins { background: ${C.haze}; }
.g-platform { background: ${C.mint}; }
.g-developers { background: ${C.lake}; }
.t-gates { font-size: 84px; max-width: 1560px; }
.log { position: absolute; left: 1010px; top: 310px; width: 800px; display: flex; flex-direction: column; gap: 12px; }
.log-row { display: flex; align-items: baseline; gap: 12px; }
.log-icon { width: 48px; height: 48px; color: ${C.mint}; }
.log-icon-t { width: 44px; font-family: ${DISPLAY}; font-weight: 700; font-size: 40px; line-height: 1; color: ${C.glow}; }
.log-b { font-family: ${DISPLAY}; font-weight: 600; font-size: 38px; line-height: 1.1; color: ${C.snow}; }
.log-b.fail { color: ${C.glow}; }
.log-t { font-size: 30px; line-height: 1.3; color: ${C.lichen}; }
.gatelist { position: absolute; left: 1010px; top: 548px; width: 800px; display: flex; flex-direction: column; }
.gatelist h3 { font-size: 30px; line-height: 1; color: ${C.lichen}; letter-spacing: .6px; margin-bottom: 14px; }
.gate-row { display: flex; align-items: baseline; padding: 6px 0 6px 20px; border-left: 4px solid ${C.scree}; }
.gate-row.hot { border-left: 4px solid ${C.glow}; }
.gate-b { width: 190px; font-family: ${DISPLAY}; font-weight: 600; font-size: 32px; line-height: 1.2; color: ${C.snow}; }
.gate-t { flex: 1; font-size: 28px; line-height: 1.3; color: ${C.lichen}; }
.src { position: absolute; left: 120px; bottom: 52px; width: 1680px; font-size: 24px; line-height: 1.3; color: ${C.lichen}; }
.src.s-gates { left: 1440px; width: 380px; }

/* ai-resize */
.t-resize { font-size: 96px; }
.lede { font-size: 38px; line-height: 1.36; color: ${C.lichen}; }
.t-resize-lede { position: absolute; left: 120px; top: 214px; width: 1500px; font-size: 34px; line-height: 1.3; }
.hi { color: ${C.snow}; }
.tally { position: absolute; left: 1330px; top: 316px; width: 490px; display: flex; flex-direction: column; }
.tally-n { font-family: ${DISPLAY}; font-weight: 600; font-size: 96px; line-height: 1; color: ${C.teal}; }
.tally-t { font-size: 26px; line-height: 1.3; color: ${C.lichen}; }
.guard { position: absolute; left: 1330px; top: 660px; width: 490px; padding-left: 18px; border-left: 4px solid ${C.glow}; display: flex; flex-direction: column; gap: 4px; }
.guard-b { font-family: ${DISPLAY}; font-weight: 600; font-size: 32px; line-height: 1.1; color: ${C.snow}; }
.guard-t { font-size: 27px; line-height: 1.32; color: ${C.lichen}; }
.how { position: absolute; left: 120px; top: 766px; width: 1100px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.how-c { border-top: 3px solid ${C.scree}; padding-top: 8px; display: flex; flex-direction: column; }
.how-b { font-family: ${DISPLAY}; font-weight: 600; font-size: 30px; line-height: 1.1; color: ${C.snow}; }
.how-t { font-size: 24px; line-height: 1.3; color: ${C.lichen}; }
`;
fs.writeFileSync(path.join(ROOT, 'project', 'deck.css'), css);

const deck = {
  v: 5, createdOnFiles: { v: 1, at: new Date().toISOString().replace(/\.\d+Z$/, 'Z') }, lists: 'css', format: { v: 1, shared: ['project/deck.css'] },
  title: 'Takeaways v3: Slides pilot',
  order: ORDER,
  sections: {
    s1: { description: 'The north star, and our estate growing from four clusters at the exchange', start: 'title' },
    s2: { description: 'Keep upgrading this way and every group drowns in upkeep', start: 'overrun' },
    s3: { description: 'The fixes: gated waves that roll themselves back', start: 'gates' },
    s4: { description: 'The agents arrive: AI resizing from the lake', start: 'ai-resize' },
  },
  cover: 'title',
  faces: {
    'barlow-condensed': { family: 'Barlow Condensed', href: 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&display=swap' },
    barlow: { family: 'Barlow', href: 'https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;1,400&display=swap' },
  },
  designSystems: [],
};
fs.writeFileSync(path.join(ROOT, 'project', 'deck.json'), JSON.stringify(deck, null, 1));
fs.writeFileSync(path.join(ROOT, 'assets.json'), JSON.stringify([...assets].map((a) => ({ name: a, path: path.join(OUT, a) })), null, 1));
console.log(report.join('\n'));
console.log(`assets: ${assets.size}  label classes: ${labelCss.size}  deck.css ${(css.length / 1024).toFixed(1)}K`);
