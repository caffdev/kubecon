/* The show-* slides: the four days of KubeCon as boxes, one per talk, with this topic's
   talks lit; a riffle through session cards on entry; then the big names that stay.
   Needs ../../_shared/peaks.js, theme/assets/schedule.js and this file, before slide.js.

     <svg class="show-grid" id="grid" viewBox="0 0 1920 1080" role="img" aria-label="…"></svg>
     <div class="riffle" id="riffle" aria-hidden="true"></div>
     <div class="picks" id="picks"></div>
     Riffle.draw({ topic: 'fleet', flicks: [[day, title, who, keynote], …], picks: [{ who, claim, title, day, keynote, tag }] });

   Base styles are the finished slide: boxes lit, flicks hidden, picks shown. On entry the
   lit boxes sweep in day by day, the flicks riffle past, and the picks settle (theme.css). */
(() => {
  'use strict';
  const BIT = { fleet: 1, delivery: 2, agents: 4 };
  const DAY = ['Mon 9', 'Tue 10', 'Wed 11', 'Thu 12'];
  const DAY_SUB = ['co-located day', '', '', ''];
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  function grid(sel, topic) {
    const S = window.SCHEDULE, bit = BIT[topic];
    const X0 = 120, PER = 10, B = 19, G = 4, DW = PER * B + (PER - 1) * G, DGAP = 30, Y0 = 410;
    const lit = S.talks.filter((t) => t[2] & bit).length;
    let s = '', seen = 0;
    const row = [0, 0, 0, 0], n = [0, 0, 0, 0];
    S.talks.forEach((t) => {
      const d = t[0], k = row[d]++, on = !!(t[2] & bit);
      const x = X0 + d * (DW + DGAP) + (k % PER) * (B + G), y = Y0 + Math.floor(k / PER) * (B + G);
      if (on) { n[d]++; seen++; }
      const delay = on ? Math.round(250 + 1500 * (seen / lit)) : 0;
      s += `<rect class="tb${on ? ' lit' : ''}" x="${x}" y="${y}" width="${B}" height="${B}" rx="3"${on ? ` style="--d:${delay}ms"` : ''}/>`;
    });
    DAY.forEach((name, d) => {
      const x = X0 + d * (DW + DGAP);
      s += `<text class="day-name" x="${x}" y="${Y0 - 48}">${name}</text>`;
      s += `<text class="day-sub" x="${x}" y="${Y0 - 16}">${n[d]} of ${S.perDay[d]}${DAY_SUB[d] ? ` · ${DAY_SUB[d]}` : ''}</text>`;
    });
    // the tally sits under Monday, the short day
    const monRows = Math.ceil(S.perDay[0] / PER), ty = Y0 + monRows * (B + G) + 96;
    s += `<text class="tally-n" x="${X0}" y="${ty}">${lit}</text>`;
    s += `<text class="tally-t" x="${X0}" y="${ty + 40}">of ${S.counts.all} talks</text><text class="tally-t" x="${X0}" y="${ty + 74}">over four days</text>`;
    Peaks.draw(sel, s);
  }

  function card({ who, title, day, keynote, claim, tag }, cls, i) {
    const when = `${DAY[day]}${keynote ? ' · keynote' : ''}`;
    const t = tag ? `<span class="tag ${tag}">${tag}</span>` : '';
    return `<div class="${cls}" style="--i:${i}"><p class="who">${t}${esc(who)}<span class="when">${when}</span></p>`
      + (claim ? `<p class="claim">${esc(claim)}</p><p class="title">${esc(title)}</p>` : `<p class="claim">${esc(title)}</p>`)
      + `</div>`;
  }

  function draw({ topic, flicks = [], picks = [] }) {
    grid('#grid', topic);
    const r = document.getElementById('riffle'), p = document.getElementById('picks');
    if (r) {
      r.style.setProperty('--n', flicks.length);
      r.innerHTML = flicks.map(([day, title, who, keynote], i) => card({ day, title, who, keynote }, 'flick', i)).join('');
      r.querySelectorAll('.flick').forEach((el, i) => el.style.setProperty('--r', `${((i * 37) % 7) - 3}deg`));
    }
    if (p) {
      p.style.setProperty('--n', flicks.length);
      p.innerHTML = picks.map((x, i) => card(x, 'pick', i)).join('');
    }
  }

  window.Riffle = { draw };
})();
