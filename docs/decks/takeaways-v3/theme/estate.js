/* The estate map for Takeaways v3: our clusters, one table, drawn at a stage.
   Needs ../../_shared/peaks.js; run BEFORE ../../_kit/runtime/slide.js.

     <svg class="map" id="map" viewBox="0 0 1680 540" ...></svg>
     Estate.draw('#map', 3);

   Stages: 1 day one · 2 + cloud dev · 3 + second exchange · 4 + migration ·
           5 + second region · 6 + second cloud · 7 + AI (second half).
   Everything introduced at the drawn stage gets class "new" (coloured); the rest is grey.
   Cluster counts match the toil model in narrative.md (4, 7, 11, 17, 23, 29, 32).
   Apps and pods are illustrative, like the model: pods = app placements x 8 replicas.
   One team (three, roped) owns cluster and app upgrades.

   Estate.slot(zone, col, row) and Estate.at() give positions so a slide can draw on top
   (replica chips on the Karmada slides, AI overlays on ai-arrives). */
(() => {
  'use strict';

  const ROW0 = 156, DY = 100, ZONE_H = 420;
  const ZONES = [
    { id: 'onprem', x: 0, w: 470, from: 1, name: 'On-prem', x0: 70, dx: 104,
      how: (s) => (s < 3 ? 'one exchange, built with kubeadm' : 'two exchanges, built with kubeadm') },
    { id: 'aws', x: 510, w: 660, from: 2, name: 'AWS', x0: 70, dx: 104,
      how: (s) => (s < 5 ? 'EKS, one region' : 'EKS, two regions') },
    { id: 'cloud2', x: 1210, w: 470, from: 6, name: 'Second cloud', x0: 95, dx: 140,
      how: () => 'for the day AWS has a bad one' },
  ];

  // [zone, col, row, stage introduced, name, ai-from-stage]
  const CLUSTERS = [
    ['onprem', 0, 0, 1, 'dev', 7], ['onprem', 1, 0, 1, 'staging'], ['onprem', 2, 0, 1, 'ny4'], ['onprem', 3, 0, 1, 'ch4'],
    ['onprem', 0, 1, 3], ['onprem', 1, 1, 3], ['onprem', 2, 1, 3], ['onprem', 3, 1, 3],
    // AWS region 1: columns 0-2
    ['aws', 0, 0, 2, 'dev', 7], ['aws', 1, 0, 2, 'qa'], ['aws', 2, 0, 2, 'ftb'],
    ['aws', 0, 1, 4], ['aws', 1, 1, 4], ['aws', 2, 1, 4], ['aws', 0, 2, 4], ['aws', 1, 2, 4], ['aws', 2, 2, 4],
    // AWS region 2: columns 3-5
    ['aws', 3, 0, 5], ['aws', 4, 0, 5], ['aws', 5, 0, 5], ['aws', 3, 1, 5], ['aws', 4, 1, 5], ['aws', 5, 1, 5],
    ['aws', 3, 2, 7, '', 7], ['aws', 4, 2, 7, '', 7], ['aws', 5, 2, 7, '', 7],
    // second cloud
    ['cloud2', 0, 0, 6], ['cloud2', 1, 0, 6], ['cloud2', 2, 0, 6], ['cloud2', 0, 1, 6], ['cloud2', 1, 1, 6], ['cloud2', 2, 1, 6],
  ];
  //            stage:  1     2     3     4     5     6     7
  const APPS = [0,     20,   20,   32,   50,   50,   65,   80];
  const PODS = [0,    640, 1120, 1504, 2320, 3040, 4000, 4800];

  const f = (n) => Math.round(n * 10) / 10;
  const zoneOf = (id) => ZONES.find((z) => z.id === id);
  function slot(zone, col, row) {
    const z = zoneOf(zone);
    return { x: z.x + z.x0 + col * z.dx, y: ROW0 + row * DY };
  }
  function at() {
    return CLUSTERS.map(([zone, col, row, stage, name = '', ai = 0]) => ({ zone, col, row, stage, name, ai, region: zone === 'aws' ? (col < 3 ? 1 : 2) : 0, ...slot(zone, col, row) }));
  }

  /** The team: three climber marks roped together, in alpenglow. (x, y) = first climber's feet. */
  function team(x, y, s = 0.9) {
    let out = `<path class="team-rope" d="M${f(x)} ${f(y - 34 * s)}Q${f(x + 22 * s)} ${f(y - 18 * s)} ${f(x + 44 * s)} ${f(y - 34 * s)}T${f(x + 88 * s)} ${f(y - 34 * s)}"/>`;
    for (let i = 0; i < 3; i++) out += person(x + i * 44 * s, y, s, 'you');
    return out;
  }
  /** The climber mark. (x, y) = feet centre; s = scale (1 is about 64px tall). */
  function person(x, y, s = 1, cls = 'you') {
    const r = 12 * s, top = y - 64 * s;
    return `<g class="${cls}"><circle cx="${f(x)}" cy="${f(top + r)}" r="${f(r)}"/>`
      + `<path d="M${f(x - 17 * s)} ${f(y)}Q${f(x - 17 * s)} ${f(top + 30 * s)} ${f(x)} ${f(top + 30 * s)}Q${f(x + 17 * s)} ${f(top + 30 * s)} ${f(x + 17 * s)} ${f(y)}Z"/></g>`;
  }
  function you(x, y, s = 1) {
    return person(x, y, s, 'you')
      + `<rect class="you-book" x="${f(x + 14 * s)}" y="${f(y - 40 * s)}" width="${f(22 * s)}" height="${f(28 * s)}" rx="${f(2 * s)}"/>`;
  }
  function agent(x, y, size, cls = 'agent') {
    const h = size / 2;
    return `<path class="${cls}" d="M${f(x)} ${f(y - h)}L${f(x + h)} ${f(y)}L${f(x)} ${f(y + h)}L${f(x - h)} ${f(y)}Z"/>`;
  }

  function count(stage) {
    return { clusters: CLUSTERS.filter((c) => c[3] <= stage).length, apps: APPS[stage], pods: PODS[stage] };
  }

  /** The tally in the top-right corner: counts that changed since the last stage get class "up". */
  function census(stage, extra = '') {
    const n = count(stage), p = stage > 1 ? count(stage - 1) : n;
    const item = (v, was, word, cls = 'up') => `<span${v !== was ? ` class="${cls}"` : ''}><b>${v.toLocaleString('en-US')}</b><span>${word}</span></span>`;
    return item(n.clusters, p.clusters, 'clusters') + item(n.apps, p.apps, 'apps') + item(n.pods, p.pods, 'pods') + extra;
  }

  /**
   * opts: youText [l1, l2] | youLabel false · litAll (every cluster in the "lit" style) ·
   *       people false · showAI (draw ai-from clusters teal at stage >= their ai stage) ·
   *       quiet (nothing marked new) · names (default true) · you false (no person, no label)
   */
  function draw(sel, stage, { youLabel = true, youText = null, litAll = false, people = true, showAI = true, quiet = false, names = true, you: withYou = true } = {}) {
    let out = '';
    const cs = at();
    const isNew = (s) => !quiet && !litAll && s === stage;
    for (const z of ZONES) {
      if (z.from > stage) continue;
      const nw = isNew(z.from) ? ' new' : '';
      out += `<rect class="zone-box${nw}" x="${z.x}" y="0" width="${z.w}" height="${ZONE_H}" rx="14"/>`;
      out += `<text class="zone-name${nw}" x="${z.x + 28}" y="50">${z.name}</text>`;
      out += `<text class="zone-how" x="${z.x + 28}" y="84">${z.how(stage)}</text>`;
    }
    // two AWS regions from stage 5
    if (stage >= 5) {
      const z = zoneOf('aws'), dx = z.x + z.x0 + 2.5 * z.dx;
      const nw = isNew(5) ? ' new' : '';
      out += `<line class="region-rule${nw}" x1="${dx}" x2="${dx}" y1="112" y2="${ZONE_H - 14}"/>`;
      out += `<text class="region-name${nw}" x="${z.x + z.x0 + z.dx}" y="${ZONE_H - 14}" text-anchor="middle">region 1</text>`;
      out += `<text class="region-name${nw}" x="${z.x + z.x0 + 4 * z.dx}" y="${ZONE_H - 14}" text-anchor="middle">region 2</text>`;
    }
    // DR pairs in lockstep: ny4-ch4, and the second exchange's pair
    const tie = (a, b, s, label, below = false) => {
      if (stage < s) return;
      const nw = isNew(s);
      out += `<path class="tie" d="M${a.x + 36} ${a.y + 4}H${b.x - 36}" ${nw ? '' : 'opacity=".45"'}/>`;
      if (nw && label) out += `<text class="tie-label" x="${(a.x + b.x) / 2}" y="${below ? a.y + 58 : a.y - 32}">${label}</text>`;
    };
    tie(cs[2], cs[3], 1, 'DR');
    tie(cs[6], cs[7], 3, 'DR', true);
    for (const c of cs) {
      if (c.stage > stage) continue;
      const ai = showAI && c.ai && stage >= c.ai;
      const cls = `pk-glyph${ai ? ' ai' : ''}${litAll ? ' lit' : isNew(c.stage) || (ai && isNew(c.ai)) ? ' new' : ''}`;
      out += Peaks.glyph({ x: c.x, y: c.y, w: 64, h: 54, cls });
      if (c.name && names) out += `<text class="cl-name${isNew(c.stage) ? ' new' : ''}" x="${c.x}" y="${c.y + 58}">${c.name}</text>`;
    }
    // the one team, then one square per app
    const n = count(stage), y0 = 488;
    if (withYou) out += team(26, y0 + 36, 0.9);
    if (!withYou) {}
    else if (youText) out += `<text class="you-label" x="150" y="${y0 + 8}">${youText[0]}</text><text class="you-label" x="150" y="${y0 + 40}">${youText[1]}</text>`;
    else if (youLabel) out += `<text class="you-label" x="150" y="${y0 + 8}">one team upgrades</text><text class="you-label" x="150" y="${y0 + 40}">${n.clusters} clusters and their apps</text>`;
    if (people) {
      const per = 40, sx = 28, px = 470;
      for (let i = 0; i < n.apps; i++) {
        const c = i % per, r = Math.floor(i / per);
        const nw = !quiet && !litAll && i >= APPS[stage - 1] ? ' new' : '';
        out += `<rect class="app${nw}" x="${px + c * sx}" y="${y0 - 10 + r * 30}" width="20" height="20" rx="4"/>`;
      }
    }
    return Peaks.draw(sel, out);
  }

  window.Estate = { draw, census, count, person, you, team, agent, slot, at, ZONES, CLUSTERS, APPS, PODS };
})();
