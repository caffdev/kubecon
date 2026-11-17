/* The estate map for Takeaways v2: where our clusters live, one table, drawn at a stage.
   Needs ../../_shared/peaks.js; run BEFORE ../../_kit/runtime/slide.js.

     <svg class="map" id="map" viewBox="0 0 1680 540" ...></svg>
     Estate.draw('#map', 3);      // stage 3: + EKS

   Stages: 1 day one · 2 + DR · 3 + EKS · 4 + teams · 5 + AI · 6 + second cloud.
   Everything introduced at the drawn stage gets class "new" (coloured); the rest is grey.
   The counts match the toil model in narrative.md (2, 3, 6, 14, 20, 28 clusters).
   People, agents and apps are illustrative, like the model. */
(() => {
  'use strict';

  const ZONES = [
    { id: 'onprem', x: 0, w: 470, from: 1, name: 'On-prem', how: 'built with kubeadm, by hand', cols: 3, dx: 150, x0: 85 },
    { id: 'aws', x: 510, w: 660, from: 3, name: 'AWS', how: 'EKS, two regions', cols: 6, dx: 104, x0: 70 },
    { id: 'cloud2', x: 1210, w: 470, from: 6, name: 'Second cloud', how: 'so an AWS outage isn’t ours', cols: 3, dx: 140, x0 : 95 },
  ];
  const ZONE_H = 420, ROW0 = 156, DY = 100;

  // [zone, stage introduced, name or '', ai?]
  const CLUSTERS = [
    ['onprem', 1, 'test'], ['onprem', 1, 'prod'], ['onprem', 2, 'DR'],
    ['onprem', 4], ['onprem', 4], ['onprem', 5, '', 1],
    ['aws', 3, 'dev'], ['aws', 3, 'east'], ['aws', 3, 'west'],
    ['aws', 4], ['aws', 4], ['aws', 4], ['aws', 4], ['aws', 4], ['aws', 4],
    ['aws', 5], ['aws', 5], ['aws', 5], ['aws', 5, '', 1], ['aws', 5, '', 1],
    ['aws', 6], ['aws', 6],
    ['cloud2', 6], ['cloud2', 6], ['cloud2', 6], ['cloud2', 6], ['cloud2', 6], ['cloud2', 6],
  ];
  //            stage:  1   2   3   4   5    6
  const PEOPLE = [0,    6,  6, 12, 34, 44,  52];
  const AGENTS = [0,    0,  0,  0,  0, 24,  40];
  const APPS   = [0,    4,  5, 12, 60, 95, 140];

  const f = (n) => Math.round(n * 10) / 10;

  /** The climber mark. (x, y) = feet centre; s = scale (1 is about 64px tall). */
  function person(x, y, s = 1, cls = 'you') {
    const r = 12 * s, top = y - 64 * s;
    return `<g class="${cls}"><circle cx="${f(x)}" cy="${f(top + r)}" r="${f(r)}"/>`
      + `<path d="M${f(x - 17 * s)} ${f(y)}Q${f(x - 17 * s)} ${f(top + 30 * s)} ${f(x)} ${f(top + 30 * s)}Q${f(x + 17 * s)} ${f(top + 30 * s)} ${f(x + 17 * s)} ${f(y)}Z"/></g>`;
  }
  /** The one person with his runbook, in alpenglow. */
  function you(x, y, s = 1) {
    return person(x, y, s, 'you')
      + `<rect class="you-book" x="${f(x + 14 * s)}" y="${f(y - 40 * s)}" width="${f(22 * s)}" height="${f(28 * s)}" rx="${f(2 * s)}"/>`;
  }
  function agent(x, y, size, cls) {
    const h = size / 2;
    return `<path class="${cls}" d="M${f(x)} ${f(y - h)}L${f(x + h)} ${f(y)}L${f(x)} ${f(y + h)}L${f(x - h)} ${f(y)}Z"/>`;
  }

  function slots() {
    const seen = {};
    return CLUSTERS.map(([zone, stage, name = '', ai = 0]) => {
      const z = ZONES.find((q) => q.id === zone);
      const i = (seen[zone] = (seen[zone] ?? -1) + 1);
      const c = i % z.cols, r = Math.floor(i / z.cols);
      return { zone, stage, name, ai, x: z.x + z.x0 + c * z.dx, y: ROW0 + r * DY };
    });
  }

  function count(stage) {
    return {
      clusters: CLUSTERS.filter((c) => c[1] <= stage).length,
      people: PEOPLE[stage], agents: AGENTS[stage], apps: APPS[stage],
    };
  }

  function draw(sel, stage, { youLabel = true, youText = null, litAll = false, people = true } = {}) {
    let out = '';
    const at = slots();
    // zones
    for (const z of ZONES) {
      if (z.from > stage) continue;
      const nw = z.from === stage && !litAll ? ' new' : '';
      out += `<rect class="zone-box${nw}" x="${z.x}" y="0" width="${z.w}" height="${ZONE_H}" rx="14"/>`;
      out += `<text class="zone-name${nw}" x="${z.x + 28}" y="50">${z.name}</text>`;
      out += `<text class="zone-how" x="${z.x + 28}" y="84">${z.how}</text>`;
    }
    // prod and DR in lockstep
    if (stage >= 2) {
      const prod = at[1], dr = at[2], nw = stage === 2;
      out += `<path class="tie" d="M${prod.x + 40} ${prod.y + 4}H${dr.x - 40}" ${nw ? '' : 'opacity=".45"'}/>`;
      if (nw) out += `<text class="tie-label" x="${(prod.x + dr.x) / 2}" y="${prod.y - 18}">lockstep</text>`;
    }
    // clusters
    for (const c of at) {
      if (c.stage > stage) continue;
      const nw = litAll ? ' lit' : c.stage === stage ? ' new' : '';
      out += Peaks.glyph({ x: c.x, y: c.y, w: 64, h: 54, cls: `pk-glyph${c.ai ? ' ai' : ''}${nw}` });
      if (c.name && stage <= 3) out += `<text class="cl-name${nw}" x="${c.x}" y="${c.y + 58}">${c.name}</text>`;
    }
    // apps moving to the second cloud
    if (stage >= 6 && !litAll) {
      const arc = (x1, x2, lift) => {
        const y = 0, mx = (x1 + x2) / 2;
        return `<path class="move" d="M${x1} ${y - 6}Q${mx} ${y - lift} ${x2 - 14} ${y - 10}"/>`
          + `<path class="move-head" d="M${x2 - 2} ${y - 6}l-22 -12l2 22z"/>`;
      };
      out += arc(240, 1380, 64) + arc(860, 1480, 44);
      out += `<text class="move-label" x="226" y="-14" text-anchor="end">apps moving</text>`;
    }
    // the people strip: the one person, then users and agents, one mark each
    const n = count(stage), y0 = 488;
    out += you(40, y0 + 34, 1.05);
    if (youText) out += `<text class="you-label" x="92" y="${y0 + 8}">${youText[0]}</text><text class="you-label" x="92" y="${y0 + 40}">${youText[1]}</text>`;
    else if (youLabel) out += `<text class="you-label" x="92" y="${y0 + 8}">one person</text><text class="you-label" x="92" y="${y0 + 40}">${n.clusters === 2 ? 'upgrades both' : `upgrades all ${n.clusters}`}</text>`;
    let k = 0;
    if (!people) return Peaks.draw(sel, out);
    const per = 48, sx = 26, px = 420;
    const place = () => { const c = k % per, r = Math.floor(k / per); k++; return [px + c * sx, y0 - 8 + r * 34]; };
    for (let i = 0; i < n.people; i++) {
      const [x, y] = place();
      const nw = i >= PEOPLE[stage - 1] && !litAll ? ' new' : '';
      out += person(x, y + 14, 0.44, `user${nw}`);
    }
    for (let i = 0; i < n.agents; i++) {
      const [x, y] = place();
      const nw = i >= AGENTS[stage - 1] && !litAll ? ' new' : '';
      out += agent(x, y, 20, `agent${nw}`);
    }
    return Peaks.draw(sel, out);
  }

  /** The census line under the map: counts that changed since the last stage get class "up". */
  function census(stage) {
    const n = count(stage), p = stage > 1 ? count(stage - 1) : n;
    const item = (v, was, word, cls = 'up') => `<span${v !== was ? ` class="${cls}"` : ''}><b>${v}</b><span>${word}</span></span>`;
    let s = item(n.clusters, p.clusters, 'clusters') + item(n.apps, p.apps, 'apps') + item(n.people, p.people, 'people');
    if (n.agents) s += item(n.agents, p.agents, 'agents', 'ai');
    return s;
  }

  window.Estate = { census, draw, count, person, you, agent, ZONES, CLUSTERS, PEOPLE, AGENTS, APPS };
})();
