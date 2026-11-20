/* The rails: the ten-slide draft's signature element. Two mint rails and their sleepers,
   drawn only where something rides them. Returns SVG strings; draw them with Peaks.draw.
   Load after ../../_shared/peaks.js and BEFORE ../../_kit/runtime/slide.js.

     Rails.h({ x1: 120, x2: 1800, y: 640 })          a straight track, left to right
     Rails.v({ x: 760, y1: 300, y2: 900 })           an upright track
     Rails.ring({ cx: 690, cy: 628, r: 206 })        a loop of track
     Rails.stop(x, y, { lit: true })                 a stop sitting on the track

   y (or x) is the track's centre line; the rails sit gauge/2 either side of it.
   Styles: .rl-* in theme.css. */
(() => {
  'use strict';
  const f = (n) => Math.round(n * 10) / 10;

  function h({ x1, x2, y, gauge = 30, pitch = 36, over = 9, cls = '' }) {
    let s = `<g class="rl-track ${cls}">`;
    for (let x = x1 + pitch / 2; x <= x2 - pitch / 4; x += pitch) {
      s += `<path class="rl-sleeper" d="M${f(x)} ${f(y - gauge / 2 - over)}V${f(y + gauge / 2 + over)}"/>`;
    }
    s += `<path class="rl-rail" d="M${x1} ${f(y - gauge / 2)}H${x2}M${x1} ${f(y + gauge / 2)}H${x2}"/>`;
    return s + '</g>';
  }

  function v({ x, y1, y2, gauge = 30, pitch = 36, over = 9, cls = '' }) {
    let s = `<g class="rl-track ${cls}">`;
    for (let y = y1 + pitch / 2; y <= y2 - pitch / 4; y += pitch) {
      s += `<path class="rl-sleeper" d="M${f(x - gauge / 2 - over)} ${f(y)}H${f(x + gauge / 2 + over)}"/>`;
    }
    s += `<path class="rl-rail" d="M${f(x - gauge / 2)} ${y1}V${y2}M${f(x + gauge / 2)} ${y1}V${y2}"/>`;
    return s + '</g>';
  }

  function ring({ cx, cy, r, gauge = 26, n = 56, over = 8, cls = '' }) {
    let s = `<g class="rl-track ${cls}">`;
    const ri = r - gauge / 2 - over, ro = r + gauge / 2 + over;
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2;
      const c = Math.cos(a), sn = Math.sin(a);
      s += `<path class="rl-sleeper" d="M${f(cx + c * ri)} ${f(cy + sn * ri)}L${f(cx + c * ro)} ${f(cy + sn * ro)}"/>`;
    }
    s += `<circle class="rl-rail" cx="${cx}" cy="${cy}" r="${f(r - gauge / 2)}"/><circle class="rl-rail" cx="${cx}" cy="${cy}" r="${f(r + gauge / 2)}"/>`;
    return s + '</g>';
  }

  /** A stop: a rounded platform sitting across the track at (x, y). */
  function stop(x, y, { w = 52, hgt = 60, lit = false, cls = '' } = {}) {
    return `<rect class="rl-stop${lit ? ' lit' : ''} ${cls}" x="${f(x - w / 2)}" y="${f(y - hgt / 2)}" width="${w}" height="${hgt}" rx="10"/>`;
  }

  window.Rails = { h, v, ring, stop };
})();
