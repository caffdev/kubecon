/* Three Peaks: draws the series' mountains as inline SVG, coloured by brand.css classes.
   Load it BEFORE ../../_kit/runtime/slide.js (slide.js registers [data-step] elements as
   soon as it runs, so anything drawn here must already be in the DOM).

     <svg id="range" viewBox="0 0 1920 1080" aria-hidden="true"></svg>
     <script src="../../_shared/peaks.js"></script>
     <script>Peaks.draw('#range', Peaks.disc({cx: 960, cy: 520, r: 300}),
                         Peaks.peak({x: 960, top: 300, base: 1080, hw: 520, cap: 'var(--mint)'}));</script>
     <script src="../../_kit/runtime/slide.js"></script>

   Geometry follows the show art: a flat triangle, one ridge-shadow stripe down the right
   face, and a zigzag snow cap. Deterministic: same arguments, same drawing. */
(() => {
  'use strict';
  const f = (n) => Math.round(n * 10) / 10;

  // mulberry32: seeded so a far range looks the same every render
  function rng(seed) {
    return () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** One peak. x = summit x, top = summit y, base = foot y, hw = half-width at the foot.
      cap: CSS colour for the snow cap (a path colour), or null for none. */
  function peak({ x, top, base, hw, cap = 'var(--mint)', capScale = 1, cls = '', id = '' }) {
    const h = base - top, s = capScale;
    const idAttr = id ? ` id="${id}"` : '';
    let out = `<g class="pk ${cls}"${idAttr}>`;
    out += `<path class="pk-body" d="M${f(x - hw)} ${f(base)}L${f(x)} ${f(top)}L${f(x + hw)} ${f(base)}Z"/>`;
    out += `<path class="pk-shadow" d="M${f(x)} ${f(top)}L${f(x + hw)} ${f(base)}L${f(x + hw * 0.49)} ${f(base)}L${f(x)} ${f(top + h * 0.2)}Z"/>`;
    if (cap) {
      out += `<path class="pk-cap" style="--cap:${cap}" d="M${f(x)} ${f(top)}L${f(x + hw * 0.208 * s)} ${f(top + h * 0.164 * s)}L${f(x + hw * 0.064 * s)} ${f(top + h * 0.206 * s)}L${f(x + hw * 0.256 * s)} ${f(top + h * 0.339 * s)}L${f(x)} ${f(top + h * 0.297 * s)}Z"/>`;
    }
    return out + '</g>';
  }

  /** A far range: a seeded zigzag skyline from x0 to x1 around baseline y, filled down to bottom. */
  function far({ x0 = 0, x1 = 1920, y = 760, amp = 110, n = 11, bottom = 1080, seed = 7, cls = 'pk-far' }) {
    const r = rng(seed);
    const step = (x1 - x0) / n;
    let d = `M${x0} ${bottom}L${x0} ${f(y + amp * 0.3)}`;
    for (let i = 0; i < n; i++) {
      const xa = x0 + step * (i + 0.5), xb = x0 + step * (i + 1);
      d += `L${f(xa)} ${f(y - amp * (0.4 + r() * 0.6))}L${f(xb)} ${f(y + amp * (0.1 + r() * 0.4))}`;
    }
    return `<path class="${cls}" d="${d}L${x1} ${bottom}Z"/>`;
  }

  let discs = 0;
  /** The sky-to-mint disc behind the range. */
  function disc({ cx, cy, r, opacity = 1, from = 'var(--sky)', to = 'var(--mint)' }) {
    const id = `pk-disc-${++discs}`;
    return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">`
      + `<stop offset="0" style="stop-color:${from}"/><stop offset="1" style="stop-color:${to}"/>`
      + `</linearGradient></defs><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})" opacity="${opacity}"/>`;
  }

  /** A small peak glyph centred at (x, y) for fields of counted things (one glyph = one cluster). */
  function glyph({ x, y, w = 28, h = 24, cls = 'pk-glyph' }) {
    return `<path class="${cls}" d="M${f(x - w / 2)} ${f(y + h / 2)}L${f(x)} ${f(y - h / 2)}L${f(x + w / 2)} ${f(y + h / 2)}Z"/>`;
  }

  /** Append markup to an <svg> (selector or element). */
  function draw(target, ...parts) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) throw new Error(`Peaks.draw: no element ${target}`);
    el.insertAdjacentHTML('beforeend', parts.join(''));
    return el;
  }

  window.Peaks = { peak, far, disc, glyph, draw, rng };
})();
