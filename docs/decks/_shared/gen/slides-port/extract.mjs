// extract.mjs <deck> <slug>...  → out/<slug>.json
// Loads each kit slide in Chrome, lets its scripts draw, records the entrance animations,
// jumps to the finished state, then turns every top-level <svg> into a script-free SVG with
// computed paint baked into attributes and the animations re-expressed as CSS inside the SVG.
// <text> is lifted out as positioned labels (fonts never load inside a Slides SVG).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const DECKS = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../..');
const { startServer } = await import(`${DECKS}/_kit/lib/server.mjs`);
const { launchChrome } = await import(`${DECKS}/_kit/lib/chrome.mjs`);

const [deck, ...slugs] = process.argv.slice(2);
const OUT = path.join(path.dirname(new URL(import.meta.url).pathname), 'out');
fs.mkdirSync(OUT, { recursive: true });

const IN_PAGE = String.raw`(async () => {
  await (window.Slide ? Slide.ready : document.fonts.ready);
  await new Promise((r) => setTimeout(r, 120));
  const slide = document.querySelector('.slide');
  const sr = slide.getBoundingClientRect(), k = 1920 / sr.width;
  const rel = (r) => ({ x: (r.left - sr.left) * k, y: (r.top - sr.top) * k, w: r.width * k, h: r.height * k });

  // ---- keyframes from every stylesheet (through @import) ----
  const KF = {};
  const walk = (sheet) => { let rules; try { rules = sheet.cssRules; } catch { return; }
    for (const r of rules) {
      if (r instanceof CSSImportRule && r.styleSheet) walk(r.styleSheet);
      else if (r instanceof CSSKeyframesRule) KF[r.name] = r.cssText;
      else if (r.cssRules) for (const q of r.cssRules) if (q instanceof CSSKeyframesRule) KF[q.name] = q.cssText; } };
  for (const s of document.styleSheets) walk(s);
  const resolveVars = (text, el) => { const cs = getComputedStyle(el); let prev;
    do { prev = text; text = text.replace(/var\((--[\w-]+)\s*(?:,\s*([^()]*?))?\)/g, (m, n, fb) => cs.getPropertyValue(n).trim() || (fb || '').trim()); } while (text !== prev);
    return text; };

  // ---- 1. entrance animations, as the slide arrives (solo mode enters at step 0) ----
  const ANIM = new Map();
  for (const el of slide.querySelectorAll('*')) {
    const list = el.getAnimations().filter((a) => a.animationName);
    if (!list.length) continue;
    const cs = getComputedStyle(el);
    ANIM.set(el, list.map((a) => { const t = a.effect.getTiming();
      const kfs = a.effect.getKeyframes(); return { name: a.animationName, dur: t.duration, delay: t.delay, easing: (kfs[0] && kfs[0].easing) || t.easing, fill: t.fill, iter: t.iterations, dir: t.direction,
        kf: KF[a.animationName] ? resolveVars(KF[a.animationName], el).replace(/\s+/g, ' ') : null, key: el.id || (el.getAttribute('class') || '').split(' ')[0],
        box: cs.transformBox, origin: cs.transformOrigin }; }));
  }

  // ---- 2. the finished slide ----
  if (window.Slide && Slide.steps) Slide.go(Slide.steps);
  await new Promise((r) => setTimeout(r, 60));
  for (const a of document.getAnimations()) { try { a.finish(); } catch { a.cancel(); } }
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  const hex = (c) => { const m = /^rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)$/.exec(c);
    if (!m) return c; const h = [m[1], m[2], m[3]].map((v) => (+v).toString(16).padStart(2, '0')).join('');
    return m[4] != null && +m[4] < 1 ? 'rgba(' + m[1] + ',' + m[2] + ',' + m[3] + ',' + m[4] + ')' : '#' + h; };
  const urlRef = (v) => { const m = /url\(["']?[^#"')]*#([^"')]+)["']?\)/.exec(v); return m ? 'url(#' + m[1] + ')' : v; };
  const LEAF = new Set(['path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'use']);
  const DEF = { 'fill-opacity': '1', 'fill-rule': 'nonzero', stroke: 'none', 'stroke-width': '1px', 'stroke-opacity': '1',
    'stroke-dasharray': 'none', 'stroke-dashoffset': '0px', 'stroke-linecap': 'butt', 'stroke-linejoin': 'miter', 'paint-order': 'normal' };
  const KEEP_ID = new Set(['clipPath', 'linearGradient', 'radialGradient', 'mask', 'pattern', 'marker', 'symbol', 'filter']);
  const effOpacity = (el, stop) => { let o = 1; for (let n = el; n && n !== stop; n = n.parentElement) o *= +getComputedStyle(n).opacity; return o; };
  const visible = (el) => { const cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden'; };

  const svgs = [];
  const tops = [...slide.querySelectorAll('svg')].filter((s) => !s.parentElement.closest('svg'));
  let animSeq = 0;
  for (const [si, svg] of tops.entries()) {
    const box = rel(svg.getBoundingClientRect());
    const vb = svg.viewBox.baseVal && svg.viewBox.baseVal.width ? svg.viewBox.baseVal : { x: 0, y: 0, width: box.w, height: box.h };
    const sx = vb.width / box.w, sy = vb.height / box.h;
    // content extent (screen), so overflow:visible art isn't cut, clamped to the canvas
    let ext = { x0: box.x, y0: box.y, x1: box.x + box.w, y1: box.y + box.h };
    const labels = [], animCss = [], kfCss = new Map(), animKeys = {};
    const stepOf = (el) => { const s = el.closest('[data-step]'); return s && svg.contains(s) ? +(s.getAttribute('data-step') || 1) : 0; };

    const bake = (src, dst) => {
      const tag = src.tagName;
      if (tag === 'text') return 'drop';
      if (!(src instanceof SVGElement)) return 'drop';
      if (src !== svg && !visible(src)) return 'drop';
      const cs = getComputedStyle(src);
      const oc = src.getAttribute('class') || '';
      for (const a of [...dst.attributes]) if (a.name === 'class' || a.name === 'style' || a.name.startsWith('data-') || a.name.startsWith('aria-') || a.name === 'role' || (a.name === 'id' && !KEEP_ID.has(tag) && !src.closest('defs'))) dst.removeAttribute(a.name);
      if (LEAF.has(tag)) {
        const f = urlRef(cs.fill); if (f !== 'rgb(0, 0, 0)') dst.setAttribute('fill', hex(f));
        for (const p of Object.keys(DEF)) { let v = cs.getPropertyValue(p); if (p === 'stroke') v = urlRef(v); if (v && v !== DEF[p]) dst.setAttribute(p, p === 'stroke' ? hex(v) : v.replace(/px/g, '')); }
        const r = rel(src.getBoundingClientRect());
        dst.setAttribute('data-bb', [r.x, r.y, r.w, r.h].map((v) => Math.round(v)).join(' '));
        if (cs.stroke !== 'none' && src.getTotalLength) { try { dst.setAttribute('data-len', Math.ceil(src.getTotalLength())); } catch {} }
        if (r.w || r.h) { ext.x0 = Math.min(ext.x0, r.x); ext.y0 = Math.min(ext.y0, r.y); ext.x1 = Math.max(ext.x1, r.x + r.w); ext.y1 = Math.max(ext.y1, r.y + r.h); }
      }
      if (oc && tag !== 'svg') dst.setAttribute('class', oc);
      if (tag === 'stop') { dst.setAttribute('stop-color', hex(cs.stopColor)); if (cs.stopOpacity !== '1') dst.setAttribute('stop-opacity', cs.stopOpacity); }
      if (src !== svg && cs.opacity !== '1') dst.setAttribute('opacity', cs.opacity);
      const cp = urlRef(cs.clipPath); if (cp && cp !== 'none') dst.setAttribute('clip-path', cp);
      const an = ANIM.get(src);
      if (an) {
        const names = [];
        for (const a of an) {
          if (!a.kf) continue;
          const body = a.kf.replace(/^@keyframes\s+[^\s{]+/, '').trim();
          let kn = kfCss.get(body); if (!kn) { kn = a.name + '-' + (kfCss.size + 1); kfCss.set(body, kn); }
          names.push(kn + ' ' + Math.round(a.dur) + 'ms ' + a.easing + ' ' + Math.round(a.delay) + 'ms ' + (a.iter === Infinity ? 'infinite' : a.iter) + ' ' + a.dir + ' ' + a.fill);
        }
        if (names.length) {
          const c = 'a' + (animSeq++);
          dst.setAttribute('class', (oc ? oc + ' ' : '') + c);
          const tb = an[0].box !== 'view-box' ? 'transform-box:' + an[0].box + ';transform-origin:' + an[0].origin + ';' : '';
          animCss.push('.' + c + '{animation:' + names.join(',') + ';' + tb + '}');
          animKeys[c] = an[0].key;
        }
      }
      return 'keep';
    };
    const clone = svg.cloneNode(true);
    const pairs = (a, b) => { const r = bake(a, b); if (r === 'drop') { b.remove(); return; }
      if (a !== svg && a.hasAttribute('data-step')) { b.setAttribute('data-xstep', a.getAttribute('data-step') || '1'); a.setAttribute('data-stp', si + '-' + (a.getAttribute('data-step') || '1')); }
      const ac = [...a.children], bc = [...b.children]; ac.forEach((c, i) => pairs(c, bc[i])); };
    pairs(svg, clone);

    // labels: every visible <text>, positioned on the slide
    for (const t of svg.querySelectorAll('text')) {
      if (!visible(t) || !t.textContent.trim()) continue;
      const cs = getComputedStyle(t), r = rel(t.getBoundingClientRect());
      let anim = null; for (let n = t; n && n !== svg; n = n.parentElement) { const a = ANIM.get(n); if (a && a.some((x) => x.kf)) { anim = { own: n === t, list: a }; break; } }
      labels.push({ text: t.textContent.trim(), cls: t.getAttribute('class') || '', ...r, family: cs.fontFamily, size: parseFloat(cs.fontSize), weight: cs.fontWeight, style: cs.fontStyle,
        spacing: cs.letterSpacing, color: hex(urlRef(cs.fill)), opacity: effOpacity(t, svg.parentElement), anchor: cs.textAnchor, step: stepOf(t), anim });
    }

    // split build steps out of the base drawing
    const steps = {};
    const stepNums = [...new Set([...clone.querySelectorAll('[data-xstep]')].map((e) => +e.getAttribute('data-xstep')))].sort((a, b) => a - b);
    for (const step of stepNums) {
      const c = clone.cloneNode(true);
      const keep = [...c.querySelectorAll('[data-xstep="' + step + '"]')];
      const prune = (n) => { for (const ch of [...n.children]) {
        if (ch.tagName === 'defs' || ch.tagName === 'style') continue;
        if (keep.includes(ch)) continue;
        if (keep.some((kn) => ch.contains(kn))) prune(ch); else ch.remove(); } };
      prune(c);
      c.querySelectorAll('[data-xstep]').forEach((e) => e.removeAttribute('data-xstep'));
      steps[step] = c;
    }
    const base = clone.cloneNode(true);
    base.querySelectorAll('[data-xstep]').forEach((n) => n.remove());
    // tag the source <text> so a label layer can be shot on its own
    for (const t of svg.querySelectorAll('text')) if (!t.closest('[data-step]')) t.setAttribute('data-lbl', String(si));
    const ser = (n) => new XMLSerializer().serializeToString(n);
    const finish = (node) => {
      const x0 = Math.max(0, ext.x0), y0 = Math.max(0, ext.y0), x1 = Math.min(1920, ext.x1), y1 = Math.min(1080, ext.y1);
      const r = { x: Math.floor(x0), y: Math.floor(y0), w: Math.ceil(x1) - Math.floor(x0), h: Math.ceil(y1) - Math.floor(y0) };
      const vx = vb.x + (r.x - box.x) * sx, vy = vb.y + (r.y - box.y) * sy, vw = r.w * sx, vh = r.h * sy;
      const f = (n) => Math.round(n * 100) / 100;
      node.setAttribute('viewBox', [vx, vy, vw, vh].map(f).join(' '));
      node.setAttribute('width', f(vw)); node.setAttribute('height', f(vh));
      node.removeAttribute('class'); node.removeAttribute('id'); node.removeAttribute('style'); node.removeAttribute('role'); node.removeAttribute('aria-hidden'); node.removeAttribute('data-bleed');
      node.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      return r;
    };
    const r = finish(base);
    const style = (cssList, kf) => cssList.length ? '<style>' + cssList.join('') + [...kf].map(([body, n]) => '@keyframes ' + n + body).join('') + '</style>' : '';
    const withStyle = (node) => { const s = ser(node); const st = style(animCss, kfCss); return st ? s.replace(/^(<svg[^>]*>)/, '$1' + st) : s; };
    const stepOut = {};
    for (const [n, c] of Object.entries(steps)) { finish(c); stepOut[n] = withStyle(c); }
    svgs.push({ index: si, cls: svg.getAttribute('class') || '', id: svg.id, label: svg.getAttribute('aria-label') || '', box: r, markup: withStyle(base), steps: stepOut, labels, animKeys });
  }

  // HTML text, for reference while porting by hand
  const html = [];
  for (const el of slide.querySelectorAll('h1,h2,h3,p,li,div,ol,ul,b,span')) {
    if (el.closest('svg')) continue;
    const cs = getComputedStyle(el), r = rel(el.getBoundingClientRect());
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!own && !['ol', 'ul', 'div', 'li'].includes(el.tagName.toLowerCase())) continue;
    const ownText = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ').replace(/\s+/g, ' ').trim();
    let lines = null;
    if (/^H[1-3]$/.test(el.tagName)) {
      const words = []; const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n;
      while ((n = tw.nextNode())) { const re = /\S+/g; let m; while ((m = re.exec(n.data))) { const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length); const rc = rg.getClientRects()[0]; words.push({ w: m[0], top: rc ? Math.round(rc.top) : 0 }); } }
      lines = []; let cur = null; for (const w of words) { if (!cur || Math.abs(w.top - cur.top) > 5) { cur = { top: w.top, ws: [] }; lines.push(cur); } cur.ws.push(w.w); }
      lines = lines.map((l) => l.ws.join(' '));
    }
    html.push({ tag: el.tagName.toLowerCase(), cls: typeof el.className === 'string' ? el.className : '', text: el.textContent.trim().replace(/\s+/g, ' '), own: ownText, inner: el.innerHTML.trim().replace(/\s+/g, ' '), lines,
      box: Object.fromEntries(Object.entries(r).map(([a, b]) => [a, Math.round(b)])), font: cs.fontFamily.split(',')[0] + ' ' + cs.fontWeight + ' ' + cs.fontSize + '/' + cs.lineHeight,
      color: hex(cs.color), step: el.closest('[data-step]') ? +(el.closest('[data-step]').getAttribute('data-step') || 1) : 0,
      anim: ANIM.get(el) ? ANIM.get(el).map((a) => a.name + ' ' + a.dur + 'ms+' + a.delay) : null });
  }
  const notes = document.querySelector('aside.notes');
  return { title: document.title, cls: slide.className, energy: slide.dataset.energy || '', bg: getComputedStyle(slide).backgroundColor,
    steps: window.Slide ? Slide.steps : 0, svgs, html, notes: notes ? notes.innerText.trim() : '' };
})()`;

const server = await startServer({ root: DECKS, port: 0, live: false });
const chrome = await launchChrome();
try {
  const page = await chrome.newPage({ width: 1920, height: 1080 });
  for (const slug of slugs) {
    await page.goto(`${server.url}/${deck}/slides/${slug}.html?mode=solo`);
    const data = await page.eval(IN_PAGE, 30000);
    data.slug = slug;
    // PNG layers: each drawing's labels, and each build step (shapes + labels), cropped, at 2x
    data.layers = [];
    const shots = [];
    for (const s of data.svgs) {
      if (s.labels.some((l) => !l.step)) shots.push({ name: `${slug}--${s.cls || s.index}-labels`, sel: `[data-lbl="${s.index}"]`, svg: s.index, step: 0 });
      for (const n of Object.keys(s.steps)) shots.push({ name: `${slug}--${s.cls || s.index}-step${n}`, sel: `[data-stp="${s.index}-${n}"]`, svg: s.index, step: +n });
    }
    for (const shot of shots) {
      const rect = await page.eval(`(() => {
        let st = document.getElementById('__shoot');
        if (!st) { st = document.createElement('style'); st.id = '__shoot'; document.head.append(st); }
        const sel = ${JSON.stringify(shot.sel)};
        st.textContent = 'html,body,.slide{background:transparent!important}.slide *{visibility:hidden!important}' + sel + ',' + sel + ' *{visibility:visible!important}';
        const slide = document.querySelector('.slide'), sr = slide.getBoundingClientRect(), k = 1920 / sr.width;
        let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
        for (const el of document.querySelectorAll(sel)) { const r = el.getBoundingClientRect(); if (!r.width && !r.height) continue;
          x0 = Math.min(x0, (r.left - sr.left) * k); y0 = Math.min(y0, (r.top - sr.top) * k); x1 = Math.max(x1, (r.right - sr.left) * k); y1 = Math.max(y1, (r.bottom - sr.top) * k); }
        const p = 8; x0 = Math.max(0, Math.floor(x0 - p)); y0 = Math.max(0, Math.floor(y0 - p)); x1 = Math.min(1920, Math.ceil(x1 + p)); y1 = Math.min(1080, Math.ceil(y1 + p));
        return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
      })()`);
      await page.transparent();
      await page.eval('new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))');
      const full = path.join(OUT, `_full.png`);
      fs.writeFileSync(full, await page.png({ width: 1920, height: 1080, scale: 2 }));
      const file = path.join(OUT, `${shot.name}.png`);
      execFileSync('sips', ['-c', String(rect.h * 2), String(rect.w * 2), '--cropOffset', String(rect.y * 2), String(rect.x * 2), full, '--out', file], { stdio: 'ignore' });
      data.layers.push({ ...shot, file, box: rect });
    }
    await page.eval(`document.getElementById('__shoot')?.remove()`);
    fs.writeFileSync(path.join(OUT, `${slug}.json`), JSON.stringify(data, null, 1));
    const sizes = data.svgs.map((s) => `${s.cls || s.id}:${(s.markup.length / 1024).toFixed(1)}K/${s.labels.length}L${Object.keys(s.steps).length ? '/steps ' + Object.keys(s.steps) : ''}`);
    console.log(`${slug.padEnd(18)} ${sizes.join('  ')}  html=${data.html.length}${page.logs.length ? '  LOGS ' + page.logs.join(' | ') : ''}`);
  }
  await page.close();
} finally {
  await chrome.close();
  await server.close();
}
