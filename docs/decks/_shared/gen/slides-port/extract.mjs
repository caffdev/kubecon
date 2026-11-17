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
      const ctm = t.getScreenCTM(), sc = (ctm ? Math.hypot(ctm.a, ctm.b) : 1) * k;
      labels.push({ text: t.textContent.trim(), cls: t.getAttribute('class') || '', ...r, family: cs.fontFamily, size: parseFloat(cs.fontSize) * sc, weight: cs.fontWeight, style: cs.fontStyle,
        spacing: parseFloat(cs.letterSpacing) ? (parseFloat(cs.letterSpacing) * sc).toFixed(2) + 'px' : 'normal', color: hex(urlRef(cs.fill)), opacity: effOpacity(t, svg.parentElement), anchor: cs.textAnchor, step: stepOf(t), anim });
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
  // ---- HTML text → Slides trees: {t, s:{css}, a:{attrs}, c:[node|string]} from computed styles ----
  const warns = new Set();
  const cap = (w) => w[0].toUpperCase() + w.slice(1);
  const clear = (c) => c === 'rgba(0, 0, 0, 0)' || c === 'transparent';
  const isInline = (cs) => cs.display === 'inline' || cs.display === 'contents';
  const atomic = (cs) => /^inline-(block|flex|grid|table)$/.test(cs.display);
  const painted = (cs) => !clear(cs.backgroundColor) || ['Top', 'Right', 'Bottom', 'Left'].some((s) => parseFloat(cs['border' + s + 'Width']) && cs['border' + s + 'Style'] !== 'none');
  const SKIP = new Set(['SCRIPT', 'STYLE', 'ASIDE', 'svg', 'NOSCRIPT']);
  const kids = (el) => { const out = [];
    for (const n of el.childNodes) {
      if (n.nodeType === 3) { out.push(n); continue; }
      if (n.nodeType !== 1 || SKIP.has(n.tagName)) continue;
      const cs = getComputedStyle(n);
      if (cs.display === 'none') continue;
      if (cs.display === 'contents') out.push(...kids(n)); else out.push(n);
    }
    return out; };
  const textS = (cs) => { const s = { 'font-family': cs.fontFamily, 'font-size': cs.fontSize, 'font-weight': cs.fontWeight, 'line-height': cs.lineHeight, color: hex(cs.color) };
    if (cs.fontStyle !== 'normal') s['font-style'] = cs.fontStyle;
    if (cs.letterSpacing !== 'normal' && parseFloat(cs.letterSpacing)) s['letter-spacing'] = cs.letterSpacing;
    if (!/^(start|left)$/.test(cs.textAlign)) s['text-align'] = cs.textAlign === 'end' ? 'right' : cs.textAlign;
    if (cs.textTransform !== 'none') s['text-transform'] = cs.textTransform;
    if (/tabular/.test(cs.fontVariantNumeric)) s['font-variant-numeric'] = 'tabular-nums';
    if (cs.whiteSpace === 'nowrap' || /^pre/.test(cs.whiteSpace)) s['white-space'] = 'nowrap';
    if (/underline/.test(cs.textDecorationLine)) s['text-decoration'] = 'underline';
    return s; };
  const boxS = (cs, el, { top = false } = {}) => { const s = {};
    for (const side of ['top', 'right', 'bottom', 'left']) {
      const p = cs['padding' + cap(side)]; if (parseFloat(p)) s['padding-' + side] = p;
      const bw = cs['border' + cap(side) + 'Width'], bs = cs['border' + cap(side) + 'Style'];
      if (parseFloat(bw) && bs !== 'none') s['border-' + side] = bw + ' ' + bs + ' ' + hex(cs['border' + cap(side) + 'Color']);
      const m = cs['margin' + cap(side)]; if (!top && parseFloat(m)) s['margin-' + side] = m;
    }
    if (cs.borderRadius !== '0px') s['border-radius'] = cs.borderRadius;
    if (!clear(cs.backgroundColor)) s.background = hex(cs.backgroundColor);
    if (cs.backgroundImage !== 'none') { if (/gradient/.test(cs.backgroundImage)) s.background = cs.backgroundImage; else warns.add('background image dropped: ' + (el.className || el.tagName)); }
    if (cs.boxShadow !== 'none') s['box-shadow'] = cs.boxShadow;
    if (cs.opacity !== '1') s.opacity = cs.opacity;
    s['box-sizing'] = 'border-box';
    return s; };
  // heading line breaks (the kit balances h1-h3; Slides doesn't)
  const breaksOf = (el) => { const br = new Map(); const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n, top = null;
    while ((n = tw.nextNode())) { const re = /\S+/g; let m;
      while ((m = re.exec(n.data))) { const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length); const rc = rg.getClientRects()[0]; if (!rc) continue;
        if (top !== null && rc.top - top > 5) { if (!br.has(n)) br.set(n, []); br.get(n).push(m.index); }
        top = rc.top; } }
    return br; };
  const escT = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  /** inline content → HTML string (colour, bold, italic, underline survive; other phrase styling doesn't) */
  const inl = (nodes, pcs, brk) => nodes.map((n) => {
    if (n.nodeType === 3) {
      let t = n.data;
      const pre = /^pre/.test(pcs.whiteSpace);
      const cuts = brk && brk.get(n);
      if (cuts) { let out = '', last = 0; for (const i of cuts) { out += t.slice(last, i).replace(/\s+$/, '') + '\u0001'; last = i; } t = out + t.slice(last); }
      if (pre) return escT(t).replace(/\n/g, '<br>').replace(/ {2,}/g, (m) => '&#160;'.repeat(m.length)).replace(/\u0001/g, '<br>');
      return escT(t.replace(/\s+/g, ' ')).replace(/\u0001/g, '<br>');
    }
    if (n.tagName === 'BR') return '<br>';
    const cs = getComputedStyle(n);
    let inner = inl(kids(n), cs, brk);
    if (cs.fontSize !== pcs.fontSize || cs.fontFamily !== pcs.fontFamily) warns.add('inline size/face dropped: ' + n.tagName.toLowerCase() + (n.className ? '.' + n.className : '') + ' “' + n.textContent.trim().slice(0, 30) + '”');
    if (/underline/.test(cs.textDecorationLine) && !/underline/.test(pcs.textDecorationLine)) inner = '<u>' + inner + '</u>';
    if (cs.fontStyle === 'italic' && pcs.fontStyle !== 'italic') inner = '<i>' + inner + '</i>';
    if (+cs.fontWeight >= 600 && +pcs.fontWeight < 600) inner = '<b>' + inner + '</b>';
    if (cs.color !== pcs.color) inner = '<span style="color:' + hex(cs.color) + '">' + inner + '</span>';
    return inner;
  }).join('');
  const stepAttr = (el, a, s) => { const st = el.getAttribute && el.getAttribute('data-step'); if (st !== null && st !== undefined) { a.class = (a.class ? a.class + ' ' : '') + 'fragment'; a['data-fragment-index'] = String(+(st || 1)); } };
  const geomRel = (el, host) => { const r = el.getBoundingClientRect(), h = host.getBoundingClientRect(), hc = getComputedStyle(host);
    return { x: (r.left - h.left - parseFloat(hc.borderLeftWidth)) * k, y: (r.top - h.top - parseFloat(hc.borderTopWidth)) * k, w: r.width * k, h: r.height * k }; };
  const px = (v) => Math.round(v * 10) / 10 + 'px';

  const conv = (el, ctx) => Object.assign(conv0(el, ctx), { oc: typeof el.className === 'string' ? el.className : '' });
  function conv0(el, ctx) {
    const cs = getComputedStyle(el);
    const r = rel(el.getBoundingClientRect());
    const parent = ctx.parentEl, pcs = parent && getComputedStyle(parent);
    const ch = kids(el);
    const real = ch.filter((n) => n.nodeType === 1 || n.data.trim());
    const blockKids = ch.filter((n) => n.nodeType === 1 && !isInline(getComputedStyle(n)) && n.tagName !== 'BR');
    const atomics = ch.filter((n) => n.nodeType === 1 && atomic(getComputedStyle(n)));
    const isTable = cs.display === 'table';
    const s = boxS(cs, el, { top: ctx.top }), a = {};
    stepAttr(el, a, s);
    // placement
    if (ctx.top || cs.position === 'absolute') {
      const g = ctx.top ? r : geomRel(el, parent);
      Object.assign(s, { position: 'absolute', left: px(g.x), top: px(g.y), width: px(g.w) });
      if (painted(cs) || cs.display === 'grid' || (cs.display === 'flex' && cs.flexDirection === 'column')) s.height = px(g.h);
      for (const m of ['top', 'right', 'bottom', 'left']) delete s['margin-' + m];
    } else if (pcs) {
      const pd = pcs.display;
      const pr = parent.getBoundingClientRect(), contentW = (pr.width - parseFloat(pcs.paddingLeft) - parseFloat(pcs.paddingRight) - parseFloat(pcs.borderLeftWidth) - parseFloat(pcs.borderRightWidth)) * k;
      const multiLine = r.h > parseFloat(cs.lineHeight || cs.fontSize) * 1.6;
      if (/flex/.test(pd) && !/column/.test(pcs.flexDirection)) {
        if (+cs.flexGrow > 0) s.flex = cs.flexGrow + ' 1 0'; else if (multiLine || painted(cs) || !real.length) s.width = px(r.w);
        if (+cs.flexShrink === 0) s['flex-shrink'] = '0';
      } else if (/grid/.test(pd)) {
        if (!real.length) { s.width = px(r.w); }
        if (ctx.gridPos) { const gp = ctx.gridPos.get(el); if (gp) { s['grid-column'] = String(gp.c); s['grid-row'] = String(gp.r); } }
      } else if (r.w < contentW - 2) s.width = px(r.w);
      if (cs.alignSelf !== 'auto' && cs.alignSelf !== 'normal') s['align-self'] = cs.alignSelf;
    }
    if (!real.length) { s.width = s.width || px(r.w); s.height = px(r.h); return { t: 'div', s, a, c: [] }; }

    // a box of inline content only: a text block
    if (!blockKids.length && !isTable) {
      const differs = (n) => { const c = getComputedStyle(n); return c.fontSize !== cs.fontSize || c.fontFamily !== cs.fontFamily; };
      const mixed = [...el.querySelectorAll('*')].some((n) => isInline(getComputedStyle(n)) && differs(n));
      const realEls = real.filter((n) => n.nodeType === 1);
      if (mixed && real.length === 1 && realEls.length === 1) {
        // one phrase is the whole line: its type is the block's type
        const ics = getComputedStyle(realEls[0]);
        Object.assign(s, textS(ics));
        if (ics.color !== cs.color) s.color = hex(ics.color);
        return { t: 'p', s, a, c: [inl(kids(realEls[0]), ics, null).replace(/^\s+|\s+$/g, '')] };
      }
      const lh = Math.max(...[el, ...el.querySelectorAll('*')].map((n) => { const c = getComputedStyle(n); return parseFloat(c.lineHeight) || parseFloat(c.fontSize) * 1.2; })) * k;
      if (mixed && r.h < lh * 1.6) {
        // one line in two sizes: a row of blocks on one baseline
        const segs = []; let cur = null;
        for (const n of ch) {
          const own = n.nodeType === 1 && (differs(n) || n.querySelector('*') && [...n.querySelectorAll('*')].some(differs));
          if (own) { segs.push({ el: n, nodes: kids(n) }); cur = null; }
          else { if (!cur) { cur = { el: null, nodes: [] }; segs.push(cur); } cur.nodes.push(n); }
        }
        const row = { t: 'div', s: { ...s, display: 'flex', 'align-items': 'baseline', 'column-gap': px(parseFloat(cs.fontSize) * 0.26 * k) }, a, c: [] };
        for (const g of segs) {
          const gcs = g.el ? getComputedStyle(g.el) : cs;
          const html = inl(g.nodes, gcs, null).replace(/^\s+|\s+$/g, '');
          if (!html) continue;
          const ps = textS(gcs); if (g.el && gcs.color !== cs.color) ps.color = hex(gcs.color);
          ps['white-space'] = 'nowrap';
          row.c.push({ t: 'p', s: ps, a: {}, c: [html] });
        }
        return row;
      }
      const lead = realEls[0];
      if (mixed && real[0] === lead && differs(lead)) {
        // a wrapping line led by a phrase in another size: the phrase on its own line, the rest below
        const lcs = getComputedStyle(lead), lr = rel(lead.getBoundingClientRect()), gap = parseFloat(cs.fontSize) * 0.26 * k;
        const inner = r.w - (parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth)) * k;
        const row = { t: 'div', s: { ...s, display: 'flex', 'align-items': 'baseline', 'column-gap': px(gap) }, a, c: [] };
        if (/right|end/.test(cs.textAlign)) row.s['justify-content'] = 'flex-end';
        const ps = textS(lcs); if (lcs.color !== cs.color) ps.color = hex(lcs.color); ps['white-space'] = 'nowrap'; ps['flex-shrink'] = '0';
        row.c.push({ t: 'p', s: ps, a: {}, c: [inl(kids(lead), lcs, null).replace(/^\s+|\s+$/g, '')] });
        const rest = inl(ch.slice(ch.indexOf(lead) + 1), cs, null).replace(/^\s+|\s+$/g, '');
        let restW = inner - lr.w - gap;
        if (/right|end|center/.test(cs.textAlign)) {
          // hugging the lead from the right: as wide as the rest's widest line, not the whole row
          const rg = document.createRange(); rg.setStartAfter(lead); rg.setEnd(el, el.childNodes.length);
          const lines = [...rg.getClientRects()].filter((q) => q.width > 1), L = lead.getBoundingClientRect();
          if (lines.length) restW = Math.max(...lines.map((q) => (Math.abs(q.bottom - L.bottom) < 4 ? q.right - L.right - gap / k : q.width))) * k + 2;
        }
        if (rest) row.c.push({ t: 'p', s: { ...textS(cs), width: px(restW) }, a: {}, c: [rest] });
        return row;
      }
      Object.assign(s, textS(cs));
      const tag = /^H[1-3]$/.test(el.tagName) ? el.tagName.toLowerCase() : 'p';
      if (/grid|flex/.test(cs.display) && (cs.alignItems === 'center' || cs.justifyContent === 'center' || cs.placeItems === 'center')) {
        s['text-align'] = 'center'; s.width = s.width || px(r.w); s.height = px(r.h);
        s['line-height'] = px((r.h / k - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - parseFloat(cs.borderTopWidth) - parseFloat(cs.borderBottomWidth)) * k);
      }
      const brk = /^H[1-3]$/.test(el.tagName) ? breaksOf(el) : null;
      const html = inl(ch, cs, brk).replace(/^\s+|\s+$/g, '');
      return { t: tag, s, a, c: [html] };
    }

    // a container
    const out = { t: 'div', s, a, c: [] };
    const sub = { parentEl: el, top: false };
    if (isTable) {
      // table → grid of cells, columns from the first row
      const rows = [...el.querySelectorAll('tr')];
      const cols = [...rows[0].children].map((c) => px(c.getBoundingClientRect().width * k));
      Object.assign(s, { display: 'grid', 'grid-template-columns': cols.join(' ') });
      Object.assign(s, textS(cs));
      for (const tr of rows) {
        const tcs = getComputedStyle(tr);
        for (const td of tr.children) {
          const n = conv(td, { parentEl: el, top: false });
          delete n.s.width;
          if (!clear(tcs.backgroundColor) && !n.s.background) n.s.background = hex(tcs.backgroundColor);
          out.c.push(n);
        }
      }
      return out;
    }
    if (/flex|grid/.test(cs.display) || atomics.length) {
      const grid = /grid/.test(cs.display);
      s.display = grid ? 'grid' : 'flex';
      if (!grid) { s['flex-direction'] = atomics.length && !/flex/.test(cs.display) ? 'row' : cs.flexDirection; if (cs.flexWrap !== 'nowrap') s['flex-wrap'] = cs.flexWrap; }
      if (grid) {
        s['grid-template-columns'] = cs.gridTemplateColumns;
        if (/column/.test(cs.gridAutoFlow)) {
          s['grid-template-rows'] = cs.gridTemplateRows;
          // place every item explicitly: Slides has no grid-auto-flow
          const items = ch.filter((n) => n.nodeType === 1), xs = [...new Set(items.map((n) => Math.round(n.getBoundingClientRect().left)))].sort((p, q) => p - q),
            ys = [...new Set(items.map((n) => Math.round(n.getBoundingClientRect().top)))].sort((p, q) => p - q);
          sub.gridPos = new Map(items.map((n) => { const b = n.getBoundingClientRect(); return [n, { c: xs.indexOf(Math.round(b.left)) + 1, r: ys.indexOf(Math.round(b.top)) + 1 }]; }));
        }
      }
      if (cs.justifyContent !== 'normal' && cs.justifyContent !== 'flex-start' && cs.justifyContent !== 'start') s['justify-content'] = cs.justifyContent;
      const ai = atomics.length && !/flex|grid/.test(cs.display) ? 'baseline' : cs.alignItems;
      if (ai !== 'normal' && ai !== 'stretch') s['align-items'] = ai;
      if (parseFloat(cs.rowGap)) s['row-gap'] = cs.rowGap;
      let cg = parseFloat(cs.columnGap) || 0;
      if (atomics.length && !/flex|grid/.test(cs.display)) {   // a line holding swatches: measure the gaps
        const bs = ch.map((n) => { if (n.nodeType === 1) return n.getBoundingClientRect(); const rg = document.createRange(); rg.selectNodeContents(n); return rg.getBoundingClientRect(); });
        const gaps = []; for (let i = 1; i < bs.length; i++) gaps.push(bs[i].left - bs[i - 1].right);
        cg = Math.max(0, Math.min(...gaps.filter((g) => g > 0.5)) || 0) * k;
      }
      if (cg) s['column-gap'] = px(cg);
    } else if (parseFloat(cs.rowGap)) s['row-gap'] = cs.rowGap;
    if (ch.some((n) => n.nodeType === 1 && getComputedStyle(n).position === 'absolute')) s.position = s.position || 'relative';
    // children: inline runs become paragraphs with this box's type
    const swatchRow = atomics.length > 0 && !/flex|grid/.test(cs.display);
    let run = [];
    const flush = () => { const nodes = run; run = [];
      if (!nodes.some((n) => n.nodeType === 1 || n.data.trim())) return;
      // a run that is one phrase (a span after a block title) takes that phrase's type
      const els = nodes.filter((n) => n.nodeType === 1), solo = els.length === 1 && nodes.every((n) => n.nodeType === 1 || !n.data.trim());
      const rcs = solo ? getComputedStyle(els[0]) : cs;
      const html = inl(solo ? kids(els[0]) : nodes, rcs, null).replace(/^\s+|\s+$/g, '');
      if (html) out.c.push({ t: 'p', s: { ...textS(rcs), ...(swatchRow ? { 'white-space': 'nowrap' } : {}) }, a: {}, c: [html] }); };
    for (const n of ch) {
      const block = n.nodeType === 1 && (!isInline(getComputedStyle(n)) || atomic(getComputedStyle(n)));
      if (block) { flush(); out.c.push(conv(n, sub)); } else run.push(n);
    }
    flush();
    return out;
  }
  const blocks = [];
  const order = [];   // paint order: svgs (by z-index, then DOM) and html blocks, by top-level child
  const topKids = [...slide.children].filter((n) => !['SCRIPT', 'STYLE', 'ASIDE', 'NOSCRIPT'].includes(n.tagName) && getComputedStyle(n).display !== 'none');
  const svgIndex = new Map(tops.map((s, i) => [s, i]));
  for (const n of topKids) {
    const z = parseInt(getComputedStyle(n).zIndex) || 0;
    if (n.tagName.toLowerCase() === 'svg') { order.push({ kind: 'svg', index: svgIndex.get(n), z }); continue; }
    if (n.querySelector && n.querySelector('svg')) warns.add('svg inside html block: ' + n.className);
    blocks.push(conv(n, { top: true }));
    order.push({ kind: 'html', index: blocks.length - 1, z });
  }

  const notes = document.querySelector('aside.notes');
  return { title: document.title, cls: slide.className, energy: slide.dataset.energy || '', bg: getComputedStyle(slide).backgroundColor,
    steps: window.Slide ? Slide.steps : 0, svgs, html, blocks, order, warns: [...warns], notes: notes ? notes.innerText.trim() : '' };
})()`;

const server = await startServer({ root: DECKS, port: 0, live: false });
const chrome = await launchChrome();
try {
  const page = await chrome.newPage({ width: 1920, height: 1080 });
  for (const slug of slugs) {
    await page.goto(`${server.url}/${deck}/slides/${slug}.html?mode=solo`);
    let data;
    try { data = await page.eval(IN_PAGE, 30000); }
    catch (e) { console.log(`${slug.padEnd(18)} FAILED ${e.message.split('\n')[0]}`); continue; }
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
