/* Drafting helpers for the eks-2030 deck. Each returns an SVG string coloured by theme.css classes.
   Load it BEFORE ../../_kit/runtime/slide.js, and draw synchronously, so that elements carrying
   data-step exist when slide.js registers builds. Deterministic: same arguments, same drawing.

     <svg id="d" viewBox="0 0 1920 1080"></svg>
     <script src="../theme/draw.js"></script>
     <script>Dwg.into('#d', Dwg.defs(), Dwg.hdim(420, 1720, 500, '~100 clusters'));</script> */
(() => {
  'use strict';
  const f = (n) => Math.round(n * 10) / 10;
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  // arrowheads, hatches. Call once per <svg>.
  function defs() {
    return `<defs>
      <marker id="ar" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" orient="auto-start-reverse"><path d="M0 1 L12 6 L0 11 Z" fill="#22272b"/></marker>
      <marker id="ar-red" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" orient="auto-start-reverse"><path d="M0 1 L12 6 L0 11 Z" fill="#d0293a"/></marker>
      <marker id="flow" viewBox="0 0 14 14" refX="7" refY="7" markerWidth="14" markerHeight="14" orient="auto"><path d="M1 1 L13 7 L1 13 Z" fill="#22272b"/></marker>
      <pattern id="h-red" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="12" height="12" fill="rgb(208 41 58 / .16)"/><line x1="0" y1="0" x2="0" y2="12" stroke="#d0293a" stroke-width="4"/></pattern>
      <pattern id="h-ink" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><rect width="12" height="12" fill="rgb(34 39 43 / .08)"/><line x1="0" y1="0" x2="0" y2="12" stroke="#22272b" stroke-width="2.5"/></pattern>
      <pattern id="h-blue" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="rgb(108 155 216 / .12)"/><line x1="0" y1="0" x2="0" y2="10" stroke="#6c9bd8" stroke-width="2"/></pattern>
      <pattern id="h-void" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="rgb(34 39 43 / .05)"/><path d="M0 0 L14 14 M14 0 L0 14" stroke="#5d656b" stroke-width="1.6"/></pattern>
    </defs>`;
  }

  /** Horizontal dimension: arrows at x1 and x2 on line y; label on the line (in a film gap) or above. */
  function hdim(x1, x2, y, label = '', { on = true, cls = 'dim-t', ext = 0, red = false } = {}) {
    const m = red ? 'url(#ar-red)' : 'url(#ar)';
    let s = '';
    if (ext) s += `<line class="ext" x1="${x1}" y1="${y - ext}" x2="${x1}" y2="${y + 12}"/><line class="ext" x1="${x2}" y1="${y - ext}" x2="${x2}" y2="${y + 12}"/>`;
    s += `<line class="dim" ${red ? 'style="stroke:#d0293a"' : ''} x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" marker-start="${m}" marker-end="${m}"/>`;
    if (label) {
      const cx = (x1 + x2) / 2, w = String(label).length * 15 + 24;
      if (on) s += `<rect class="paper" x="${f(cx - w / 2)}" y="${y - 18}" width="${f(w)}" height="36"/><text class="${cls}" x="${f(cx)}" y="${y + 9}" text-anchor="middle">${esc(label)}</text>`;
      else s += `<text class="${cls}" x="${f(cx)}" y="${y - 14}" text-anchor="middle">${esc(label)}</text>`;
    }
    return s;
  }

  /** Vertical dimension at x from y1 to y2, label rotated alongside. */
  function vdim(x, y1, y2, label = '', { cls = 'dim-t', side = -1 } = {}) {
    let s = `<line class="dim" x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" marker-start="url(#ar)" marker-end="url(#ar)"/>`;
    if (label) {
      const cy = (y1 + y2) / 2, tx = x + side * 16;
      s += `<text class="${cls}" x="${tx}" y="${cy}" text-anchor="middle" transform="rotate(-90 ${tx} ${cy})">${esc(label)}</text>`;
    }
    return s;
  }

  /** Numbered balloon. person = the red one. */
  function balloon(cx, cy, n, { person = false, r = 30 } = {}) {
    const p = person ? ' person' : '';
    return `<circle class="bal${p}" cx="${cx}" cy="${cy}" r="${r}"/><text class="bal-n${p}" x="${cx}" y="${cy}">${esc(n)}</text>`;
  }

  /** Revision cloud around a rectangle: a ring of outward arcs. Marks an open decision. */
  function cloud(x, y, w, h, { r = 22 } = {}) {
    const pts = [];
    const side = (ax, ay, bx, by) => {
      const len = Math.hypot(bx - ax, by - ay), n = Math.max(1, Math.round(len / (r * 1.6)));
      for (let i = 0; i < n; i++) pts.push([ax + (bx - ax) * i / n, ay + (by - ay) * i / n]);
    };
    side(x, y, x + w, y); side(x + w, y, x + w, y + h); side(x + w, y + h, x, y + h); side(x, y + h, x, y);
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
    for (let i = 1; i <= pts.length; i++) {
      const [px, py] = pts[i % pts.length], [qx, qy] = pts[i - 1];
      const rr = Math.hypot(px - qx, py - qy) * 0.62;
      d += `A${f(rr)} ${f(rr)} 0 0 1 ${f(px)} ${f(py)}`;
    }
    return `<path class="cloud" d="${d}"/>`;
  }

  /** Zigzag scale-break across a horizontal bar at x, from y1 (top) to y2 (bottom). */
  function brk(x, y1, y2) {
    const h = y2 - y1;
    return `<path class="dim" d="M${x - 8} ${y1 - 14} L${x - 8} ${y1 + h * .35} L${x + 8} ${y1 + h * .5} L${x - 8} ${y1 + h * .65} L${x - 8} ${y2 + 14}"/>`;
  }

  /** P&ID gate valve (bowtie). A gate in a pipeline. */
  function valve(cx, cy, s = 26, { red = false } = {}) {
    const st = red ? 'stroke:#d0293a;fill:rgb(208 41 58 / .16)' : 'stroke:#22272b;fill:#e5e9e2';
    return `<path style="${st};stroke-width:3;stroke-linejoin:round" d="M${cx - s} ${cy - s * .7} L${cx + s} ${cy + s * .7} L${cx + s} ${cy - s * .7} L${cx - s} ${cy + s * .7} Z"/>`;
  }

  /** A run of n unit squares (size u, gap g) starting at x,y in rows of `cols`, column-major. */
  function units(x, y, n, { u = 22, g = 6, rows = 10, cls = 'hatch-ink', from = 0 } = {}) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const k = i + from, c = Math.floor(k / rows), r = k % rows;
      s += `<rect class="${cls}" x="${x + c * (u + g)}" y="${y + r * (u + g)}" width="${u}" height="${u}"/>`;
    }
    return s;
  }

  function into(target, ...parts) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) throw new Error(`Dwg.into: no element ${target}`);
    el.innerHTML = parts.join('');
    return el;
  }

  window.Dwg = { defs, hdim, vdim, balloon, cloud, brk, valve, units, into, esc };
})();

/* Added for the ten-slide draft (2026-11-20). Additive only: a new helper on Dwg; nothing above
   changed. */
(() => {
  'use strict';
  /** Revision delta at cx,cy: an equilateral triangle with the revision letter. red = ours, dashed. */
  function delta(cx, cy, letter, { s = 48, red = false } = {}) {
    const h = s * 0.866, r = red ? ' red' : '';
    const d = `M${cx} ${cy - h * 2 / 3} L${cx + s / 2} ${cy + h / 3} L${cx - s / 2} ${cy + h / 3} Z`;
    return `<path class="delta${r}" d="${d}"/><text class="delta-n${r}" x="${cx}" y="${cy + 3}">${Dwg.esc(letter)}</text>`;
  }
  window.Dwg.delta = delta;
})();
