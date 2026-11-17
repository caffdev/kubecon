/* The background range for Takeaways v2. Needs ../../_shared/peaks.js loaded first, and
   must run BEFORE ../../_kit/runtime/slide.js.

     <svg class="range" id="range" viewBox="0 0 1920 1080" aria-hidden="true" data-bleed></svg>
     Range.draw('#range', { touch: ['p3'] });             // the fleet peak emerges
     Range.draw('#range', { touch: ['p1','p2','p3'], survey: true });   // OTel: survey lines
     Range.draw('#range', { touch: ['p1','p2','p3'], fence: true });    // policy: the fence line

   The three peaks always sit in the same place (fleet left, delivery centre, agents right).
   A touched peak is drawn up, with its cap and its word at the base; an untouched one is drawn sunk, dark,
   with no cap. Base styles are the finished state; theme.css animates .rg.up from below. */
(() => {
  'use strict';
  const H = 440;      // full peak height; the base runs below the stage
  const SINK = 150;   // how far an untouched peak sits below its emerged position
  // summits sit right of the text column so a cap never lands under the left-aligned copy
  const PEAKS = {
    p3: { x: 700, top: 880, hw: 560, cap: 'var(--haze)', word: 'fleet' },
    p1: { x: 1270, top: 800, hw: 480, cap: 'var(--mint)', word: 'delivery' },
    p2: { x: 1750, top: 868, hw: 330, cap: 'var(--teal)', word: 'agents' },
  };
  const ORDER = ['p3', 'p1', 'p2'];

  function body(p, dy = 0) {
    const t = p.top + dy, b = t + H;
    return `M${p.x - p.hw} ${b}L${p.x} ${t}L${p.x + p.hw} ${b}Z`;
  }

  function draw(sel, { touch = [], survey = false, fence = false, words = true, sink = SINK } = {}) {
    let out = '';
    for (const id of ORDER) {
      const p = PEAKS[id], up = touch.includes(id);
      const inner = Peaks.peak({ x: p.x, top: p.top, base: p.top + H, hw: p.hw, cap: up ? p.cap : null });
      const word = up && words
        ? `<text class="pk-word" style="--cap:${p.cap}" x="${p.x}" y="1050" text-anchor="middle">${p.word}</text>`
        : '';
      out += up
        ? `<g class="rg up" id="rg-${id}" style="--sink:${sink}px;--cap:${p.cap}">${inner}${word}</g>`
        : `<g class="rg sunk" id="rg-${id}" transform="translate(0 ${sink})">${inner}</g>`;
    }
    if (survey) {
      // level lines at the same heights across every risen peak: one measurement for the range
      const clip = `rg-clip-${Math.random().toString(36).slice(2, 7)}`;
      out += `<defs><clipPath id="${clip}">${ORDER.filter((id) => touch.includes(id)).map((id) => `<path d="${body(PEAKS[id])}"/>`).join('')}</clipPath></defs>`;
      out += `<g clip-path="url(#${clip})">`;
      let i = 0;
      for (let y = 900; y < 1080; y += 30) {
        out += `<path class="survey" style="--i:${i++}" d="M0 ${y}H1920"/>`;
      }
      out += '</g>';
    }
    if (fence) {
      // the policy fence along the foot of the range: one gate on every trail, whoever walks it
      const y1 = 968, y2 = 994, top = 950, bot = 1006, gates = ORDER.map((id) => PEAKS[id].x);
      out += `<g class="fence">`;
      let x = 40, i = 0;
      const segs = [];
      let from = 40;
      for (const g of gates) { segs.push([from, g - 46]); from = g + 46; }
      segs.push([from, 1880]);
      for (const [a, b] of segs) {
        out += `<path class="rail" style="--i:${i++}" d="M${a} ${y1}H${b}M${a} ${y2}H${b}"/>`;
        for (x = a; x <= b; x += 64) out += `<rect class="post" x="${x - 3}" y="${top}" width="6" height="${bot - top}"/>`;
      }
      for (const g of gates) {
        out += `<rect class="gate-post" x="${g - 52}" y="${top - 26}" width="10" height="${bot - top + 26}"/><rect class="gate-post" x="${g + 42}" y="${top - 26}" width="10" height="${bot - top + 26}"/>`;
        out += `<path class="gate-bar" d="M${g - 42} ${top - 18}H${g + 42}"/>`;
      }
      out += `</g>`;
    }
    out += star();
    return Peaks.draw(sel, out);
  }

  /** The north star in the top-right corner. Its brightness follows the slide's energy (1-5),
      read from data-energy on .slide (synced from narrative.md by theme/gen/energy.mjs). */
  function star() {
    const el = document.querySelector('.slide');
    const e = Math.min(5, Math.max(1, +(el && el.dataset.energy) || 3));
    const op = [0.3, 0.45, 0.62, 0.82, 1][e - 1];
    const halo = [0, 0.1, 0.18, 0.32, 0.55][e - 1];
    const hr = [0, 44, 54, 66, 84][e - 1];
    const cx = 1828, cy = 80, R = 34, r = 21, w = 5;
    const id = `star-glow-${Math.random().toString(36).slice(2, 7)}`;
    let s = `<g class="north-star" data-e="${e}">`;
    if (halo) {
      s += `<defs><radialGradient id="${id}"><stop offset="0" class="star-glow-0" style="stop-opacity:${halo}"/><stop offset="1" class="star-glow-1" style="stop-opacity:0"/></radialGradient></defs>`;
      s += `<circle cx="${cx}" cy="${cy}" r="${hr}" fill="url(#${id})"/>`;
    }
    s += `<path class="star" style="opacity:${op}" d="M${cx} ${cy - R}Q${cx + w} ${cy - w} ${cx + r} ${cy}Q${cx + w} ${cy + w} ${cx} ${cy + R}Q${cx - w} ${cy + w} ${cx - r} ${cy}Q${cx - w} ${cy - w} ${cx} ${cy - R}Z"/>`;
    return s + '</g>';
  }

  window.Range = { draw, star, PEAKS, H, SINK };
})();
