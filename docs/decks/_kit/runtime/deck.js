/* deck kit · player
   One page, three views, driven by window.DECK (written by `deck build`):
     overview   slide grid in draft order, drag to rearrange, bench, pacing curve, inspector
     present    full-screen player (#/slug/step), builds via the slide runtime
     presenter  ?view=presenter: current, next, notes, timer, kept in sync with the audience window */
(() => {
  'use strict';
  const D = window.DECK;
  if (!D) return;

  // ---------- helpers ----------
  const $ = (s, el = document) => el.querySelector(s);
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  function h(tag, attrs = {}, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat(Infinity)) if (kid != null && kid !== false) el.append(kid.nodeType ? kid : String(kid));
    return el;
  }
  const put = (el, ...kids) => el.replaceChildren(...kids.flat(Infinity).filter((k) => k != null && k !== false));
  const info = (slug) => D.slides[slug] || { title: slug, notes: '', plan: {}, missing: true };
  const energy = (slug) => {
    const v = parseInt((info(slug).plan || {}).Energy, 10);
    return Number.isFinite(v) ? clamp(v, 0, 5) : null;
  };

  const assetCache = new Map();
  const expand = (s) => s.replace(/%%A(\d+)%%/g, (_, n) => {
    if (!assetCache.has(n)) assetCache.set(n, expand(D.assets[+n]));
    return assetCache.get(n);
  });
  function frame(slug, mode) {
    const el = h('iframe', {
      name: 'deck:' + mode, tabindex: '-1', title: info(slug).title || slug,
      loading: mode === 'thumb' ? 'lazy' : null, allow: 'fullscreen; autoplay',
    });
    if (info(slug).missing) return el;
    if (D.inline) el.srcdoc = expand(D.slides[slug].html);
    else el.src = `slides/${encodeURIComponent(slug)}.html`;
    return el;
  }

  // ---------- state ----------
  const params = new URLSearchParams(location.search);
  const isPresenter = params.get('view') === 'presenter';
  const requested = params.get('draft');
  const S = {
    draft: requested && D.drafts[requested] ? requested : D.draft,
    order: [], i: 0, step: 0, mode: 'overview', sel: null, live: false,
  };
  S.order = [...(D.drafts[S.draft] || [])];
  const allSlugs = Object.keys(D.slides).filter((s) => !D.slides[s].missing);
  const bench = () => allSlugs.filter((s) => !S.order.includes(s));
  const [W, H] = D.size || [1920, 1080];
  document.documentElement.style.setProperty('--ar', `${W} / ${H}`);
  document.title = isPresenter ? `Presenter: ${D.title}` : D.title;

  // ---------- skeleton ----------
  const app = h('div', { class: 'app', 'data-mode': 'overview' });
  const toast = h('div', { class: 'toast', role: 'status', 'aria-live': 'polite' });
  const stage = h('div', { class: 'stage' });
  const hud = h('div', { class: 'hud' });
  const player = h('section', { class: 'player', 'aria-label': 'Slide player' }, stage, hud);

  // overview
  const draftSelect = h('select', { 'aria-label': 'Draft', onchange: (e) => switchDraft(e.target.value) },
    Object.keys(D.drafts).map((d) => h('option', { value: d, selected: d === S.draft }, d)));
  const liveBadge = h('span', { class: 'ov-live' });
  const ovSub = h('p', { class: 'ov-sub' });
  const pacing = h('figure', { class: 'pacing' });
  const orderZone = h('ol', { class: 'cards', 'data-zone': 'order', 'aria-label': 'Slides in this draft' });
  const benchZone = h('ol', { class: 'cards', 'data-zone': 'bench', 'aria-label': 'Slides on the bench' });
  const inspector = h('aside', { class: 'inspector', 'aria-label': 'Selected slide' });
  const marker = h('div', { class: 'drop-marker', hidden: true });
  const overview = h('section', { class: 'overview' },
    h('header', { class: 'ov-head' },
      h('div', { class: 'ov-title' }, h('h1', {}, D.title), ovSub),
      h('label', { class: 'ov-draft' }, h('span', {}, 'Draft'), draftSelect),
      h('div', { class: 'ov-actions' },
        liveBadge,
        h('button', { type: 'button', onclick: () => openPresenter() }, 'Presenter view'),
        h('button', { type: 'button', class: 'primary', onclick: () => present(S.sel ? Math.max(0, S.order.indexOf(S.sel)) : 0) }, 'Present'))),
    pacing,
    h('div', { class: 'ov-body' }, orderZone, inspector),
    h('section', { class: 'bench' },
      h('h2', {}, 'On the bench'),
      h('p', {}, 'Slides in this deck that aren’t in this draft. Drag one into the sequence to use it; drag a slide here to set it aside.'),
      benchZone),
    marker);

  // presenter
  const pvNext = h('div', { class: 'pv-next-frame' });
  const pvNextLabel = h('p', { class: 'pv-label' });
  const pvNotes = h('div', { class: 'pv-notes' });
  const pvElapsed = h('button', { type: 'button', class: 'pv-elapsed', title: 'Click to restart the timer' }, '0:00');
  const pvClock = h('span', { class: 'pv-clock' });
  const pvCount = h('span', { class: 'pv-count' });
  const presenterView = h('section', { class: 'presenter' },
    h('div', { class: 'pv-current' }),
    h('div', { class: 'pv-side' },
      h('div', { class: 'pv-meta' }, pvElapsed, pvCount, pvClock),
      h('div', { class: 'pv-next' }, pvNextLabel, pvNext),
      pvNotes));

  const help = h('div', { class: 'help', hidden: true, onclick: () => (help.hidden = true) },
    h('div', { class: 'help-card' },
      h('h2', {}, 'Keys'),
      h('dl', {}, [
        ['→  Space  PgDn', 'Next build or slide'], ['←  PgUp', 'Previous'], ['Home  End', 'First, last'],
        ['3 Enter', 'Go to slide 3'], ['O  Esc', 'Overview'], ['F', 'Full screen'], ['P', 'Presenter view'],
        ['B', 'Black screen'], ['Alt ← →', 'Move the selected slide (overview)'], ['?', 'This help'],
      ].map(([k, v]) => [h('dt', {}, k), h('dd', {}, v)]))));

  app.append(overview, player, toast, help);
  if (isPresenter) {
    app.append(presenterView);
    $('.pv-current', presenterView).append(stage);
    player.remove();
  }
  document.body.append(app);

  // ---------- toast ----------
  let toastTimer;
  function say(msg, action) {
    put(toast, h('span', {}, msg));
    if (action) toast.append(h('button', { type: 'button', onclick: action.run }, action.label));
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-on'), action ? 9000 : 2600);
  }

  // ---------- overview ----------
  const cards = new Map();
  function card(slug) {
    if (cards.has(slug)) return cards.get(slug);
    const meta = info(slug);
    const el = h('li', { class: 'card' + (meta.missing ? ' is-missing' : ''), draggable: 'true', tabindex: '0', 'data-slug': slug },
      h('div', { class: 'thumb' }, meta.missing ? h('p', { class: 'missing' }, `slides/${slug}.html is missing`) : frame(slug, 'thumb'), h('div', { class: 'shield' })),
      h('div', { class: 'meta' },
        h('span', { class: 'num' }),
        h('span', { class: 'title' }, meta.title || slug),
        meta.plan && meta.plan.Act ? h('span', { class: 'act' }, meta.plan.Act) : null));
    cards.set(slug, el);
    return el;
  }

  function renderOverview() {
    const benchList = bench();
    S.order.forEach((slug, i) => {
      const el = card(slug);
      if (el.parentNode !== orderZone) orderZone.append(el);
      el.style.order = i;
      $('.num', el).textContent = i + 1;
    });
    benchList.forEach((slug, i) => {
      const el = card(slug);
      if (el.parentNode !== benchZone) benchZone.append(el);
      el.style.order = i;
      $('.num', el).textContent = '';
    });
    benchZone.closest('.bench').hidden = benchList.length === 0;
    if (!S.order.length) orderZone.dataset.empty = 'This draft is empty. Drag slides in from the bench.';
    else delete orderZone.dataset.empty;

    put(ovSub, [
      h('span', {}, `${S.order.length} slide${S.order.length === 1 ? '' : 's'}`),
      benchList.length ? h('span', {}, `${benchList.length} on the bench`) : null,
      D.deck ? h('span', { class: 'ov-path' }, `docs/decks/${D.deck}/`) : null,
    ].filter(Boolean));
    renderPacing();
    renderInspector();
  }

  function renderPacing() {
    const values = S.order.map(energy);
    if (!values.some((v) => v != null)) { pacing.hidden = true; return; }
    pacing.hidden = false;
    const n = S.order.length;
    const step = 64, pad = 20, top = 10, height = 74, w = pad * 2 + step * Math.max(1, n - 1);
    const y = (v) => top + (5 - v) * ((height - top * 2) / 5);
    const pts = values.map((v, i) => (v == null ? null : [pad + i * step, y(v)]));
    let path = '';
    pts.forEach((p, i) => { if (p) path += (path && pts[i - 1] ? 'L' : 'M') + p[0] + ' ' + p[1] + ' '; });
    const svg = `<svg viewBox="0 0 ${w} ${height + 18}" preserveAspectRatio="xMinYMid meet" role="img" aria-label="Energy by slide">
      <path class="pc-line" d="${path}"/>
      ${pts.map((p, i) => p ? `<g class="pc-pt" data-slug="${S.order[i]}"><circle cx="${p[0]}" cy="${p[1]}" r="6"/><title>${i + 1}. ${escapeHtml(info(S.order[i]).title || S.order[i])} (energy ${values[i]})</title></g>` : '').join('')}
      ${S.order.map((s, i) => `<text x="${pad + i * step}" y="${height + 14}">${i + 1}</text>`).join('')}
    </svg>`;
    pacing.innerHTML = `<figcaption>Pacing <span>energy per slide, from narrative.md</span></figcaption>${svg}`;
  }

  function renderInspector() {
    const slug = S.sel;
    if (!slug || !cards.has(slug)) {
      put(inspector, h('p', { class: 'insp-empty' }, 'Select a slide to see its plan and notes. Double-click to present from it.'));
      return;
    }
    const meta = info(slug);
    const i = S.order.indexOf(slug);
    const plan = Object.entries(meta.plan || {}).filter(([k]) => k !== 'Energy');
    put(inspector, 
      h('p', { class: 'insp-pos' }, i >= 0 ? `Slide ${i + 1} of ${S.order.length}` : 'On the bench'),
      h('h2', {}, meta.title || slug),
      h('p', { class: 'insp-file' }, h('code', {}, `slides/${slug}.html`)),
      plan.length ? h('dl', { class: 'insp-plan' }, plan.map(([k, v]) => [h('dt', {}, k), h('dd', {}, v)])) : null,
      meta.notes ? h('div', { class: 'insp-notes' }, h('h3', {}, 'Speaker notes'), h('div', { html: meta.notes })) : null,
      h('div', { class: 'insp-actions' },
        i >= 0 ? h('button', { type: 'button', class: 'primary', onclick: () => present(i) }, 'Present from here') : null,
        !D.inline && !meta.missing ? h('a', { href: `slides/${encodeURIComponent(slug)}.html`, target: '_blank', rel: 'noopener' }, 'Open on its own') : null));
  }

  function select(slug, focus) {
    for (const el of cards.values()) el.classList.toggle('is-selected', el.dataset.slug === slug);
    S.sel = slug;
    renderInspector();
    if (focus && cards.get(slug)) cards.get(slug).focus({ preventScroll: false });
  }

  function switchDraft(name) {
    S.draft = name;
    S.order = [...D.drafts[name]];
    const url = new URL(location.href);
    if (name === D.draft) url.searchParams.delete('draft'); else url.searchParams.set('draft', name);
    history.replaceState(null, '', url);
    renderOverview();
  }

  // drag to rearrange
  let dragSlug = null;
  overview.addEventListener('dragstart', (e) => {
    const el = e.target.closest && e.target.closest('.card');
    if (!el) return;
    dragSlug = el.dataset.slug;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dragSlug);
    requestAnimationFrame(() => el.classList.add('is-dragging'));
  });
  overview.addEventListener('dragend', () => {
    marker.hidden = true;
    for (const el of cards.values()) el.classList.remove('is-dragging');
    dragSlug = null;
  });
  function slotAt(x, y) {
    const list = S.order.filter((s) => s !== dragSlug).map((s) => cards.get(s)).filter(Boolean);
    for (let k = 0; k < list.length; k++) {
      const r = list[k].getBoundingClientRect();
      if (y < r.top || (y <= r.bottom && x < r.left + r.width / 2)) return { index: k, rect: r, side: 'before' };
    }
    const last = list[list.length - 1];
    return { index: list.length, rect: last ? last.getBoundingClientRect() : orderZone.getBoundingClientRect(), side: last ? 'after' : 'empty' };
  }
  for (const zone of [orderZone, benchZone]) {
    zone.addEventListener('dragover', (e) => {
      if (!dragSlug) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (zone === orderZone) {
        const { rect, side } = slotAt(e.clientX, e.clientY);
        const box = overview.getBoundingClientRect();
        marker.hidden = false;
        marker.style.top = rect.top - box.top + 'px';
        marker.style.height = rect.height + 'px';
        marker.style.left = (side === 'after' ? rect.right + 6 : rect.left - 10) - box.left + 'px';
      } else marker.hidden = true;
    });
    zone.addEventListener('drop', (e) => {
      if (!dragSlug) return;
      e.preventDefault();
      const next = S.order.filter((s) => s !== dragSlug);
      if (zone === orderZone) next.splice(slotAt(e.clientX, e.clientY).index, 0, dragSlug);
      const moved = dragSlug;
      marker.hidden = true;
      commitOrder(next, moved);
    });
  }

  function commitOrder(next, moved) {
    if (next.join() === S.order.join()) return;
    S.order = next;
    D.drafts[S.draft] = [...next];
    renderOverview();
    if (moved) select(moved, false);
    persist();
  }

  async function persist() {
    if (D.inline) return say('Order changed for this viewing only.');
    const cmd = `node docs/decks/_kit/deck.mjs order ${D.deck} ${S.order.join(' ')}${S.draft !== D.draft ? ' --draft ' + S.draft : ''}`;
    if (!S.live) {
      return say('Order changed here only. Run deck serve to save drags, or copy the command.', {
        label: 'Copy command', run: () => navigator.clipboard.writeText(cmd).then(() => say('Copied. Paste it in a terminal or to Claude.')),
      });
    }
    try {
      const r = await fetch('/__deck/api/order', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ deck: D.deck, draft: S.draft, slides: S.order }),
      });
      const j = await r.json().catch(() => ({}));
      say(r.ok ? `Saved order to deck.json (${S.draft})` : `Couldn’t save: ${j.error || r.status}`);
    } catch (err) {
      say('Couldn’t reach deck serve. Is it still running?');
    }
  }

  overview.addEventListener('click', (e) => {
    const pt = e.target.closest && e.target.closest('.pc-pt');
    if (pt) return select(pt.dataset.slug, true);
    const el = e.target.closest && e.target.closest('.card');
    if (el) select(el.dataset.slug, false);
  });
  overview.addEventListener('dblclick', (e) => {
    const el = e.target.closest && e.target.closest('.card');
    if (el && S.order.includes(el.dataset.slug)) present(S.order.indexOf(el.dataset.slug));
  });

  // ---------- player ----------
  const pool = new Map(); // slug -> { el, ready, steps, pending }
  const tell = (f, msg) => f && f.el.contentWindow && f.el.contentWindow.postMessage({ deckHost: 1, ...msg }, '*');
  const current = () => pool.get(S.order[S.i]);

  function ensure(slug) {
    if (!pool.has(slug) && !info(slug).missing) {
      const f = { el: frame(slug, 'present'), ready: false, steps: 0, pending: null };
      stage.append(f.el);
      pool.set(slug, f);
    }
    return pool.get(slug);
  }

  function show(i, step = 0, opts = {}) {
    if (!S.order.length) return;
    i = clamp(i, 0, S.order.length - 1);
    const slug = S.order[i];
    const curEl = $('iframe.is-current', stage);
    const f = ensure(slug);
    if (f && curEl === f.el) { // same slide: just move the build
      const target = step === 'last' ? f.steps : clamp(step, 0, f.steps);
      S.i = i; S.step = target;
      tell(f, { type: 'goto', step: target });
      return afterNav(opts);
    }
    const keep = [S.order[i - 1], slug, S.order[i + 1]].filter(Boolean);
    keep.forEach(ensure);
    for (const [s, g] of pool) {
      const on = s === slug;
      if (!on && g.el.classList.contains('is-current')) tell(g, { type: 'leave' });
      g.el.classList.toggle('is-current', on);
    }
    for (const [s, g] of pool) if (!keep.includes(s)) { g.el.remove(); pool.delete(s); }
    S.i = i;
    if (f && f.ready) {
      S.step = step === 'last' ? f.steps : clamp(step, 0, f.steps);
      tell(f, { type: 'enter', step: S.step });
    } else {
      S.step = 0;
      if (f) f.pending = step;
    }
    afterNav(opts);
  }

  function next() {
    const f = current();
    if (f && f.ready && S.step < f.steps) { S.step++; tell(f, { type: 'goto', step: S.step }); afterNav(); }
    else if (S.i < S.order.length - 1) show(S.i + 1, 0);
  }
  function prev() {
    const f = current();
    if (f && S.step > 0) { S.step--; tell(f, { type: 'goto', step: S.step }); afterNav(); }
    else if (S.i > 0) show(S.i - 1, 'last');
  }

  function present(i = 0, step = 0) {
    if (!S.order.length) return say('This draft has no slides yet.');
    S.mode = isPresenter ? 'presenter' : 'present';
    app.dataset.mode = S.mode;
    show(i, step);
    window.focus();
  }
  function toOverview() {
    if (isPresenter) return;
    const f = current();
    if (f) tell(f, { type: 'leave' });
    for (const [, g] of pool) g.el.remove();
    pool.clear();
    S.mode = 'overview';
    app.dataset.mode = 'overview';
    history.replaceState(null, '', location.pathname + location.search);
    const slug = S.order[S.i];
    if (slug) { select(slug, true); cards.get(slug).scrollIntoView({ block: 'center' }); }
  }

  let hudTimer;
  function afterNav(opts = {}) {
    const slug = S.order[S.i];
    if (!slug) return;
    const hash = `#/${encodeURIComponent(slug)}${S.step ? '/' + S.step : ''}`;
    if (location.hash !== hash) history.replaceState(null, '', location.pathname + location.search + hash);
    const f = current();
    const builds = f && f.steps ? `build ${S.step}/${f.steps}` : '';
    put(hud, 
      h('span', { class: 'hud-n' }, `${S.i + 1} / ${S.order.length}`),
      h('span', { class: 'hud-t' }, info(slug).title || slug),
      builds ? h('span', { class: 'hud-b' }, builds) : null,
      h('i', { class: 'hud-bar', style: `--p:${(S.i + 1) / S.order.length}` }));
    if (isPresenter) renderPresenter();
    if (!opts.fromPeer) broadcast();
  }

  // ---------- presenter ----------
  let nextShown = null;
  let started = Date.now();
  function renderPresenter() {
    const slug = S.order[S.i];
    const f = current();
    const nextSlug = S.order[S.i + 1];
    const moreBuilds = f && S.step < f.steps;
    pvCount.textContent = `${S.i + 1} / ${S.order.length}`;
    pvNextLabel.textContent = moreBuilds
      ? `Next: build ${S.step + 1} of ${f.steps} on this slide`
      : nextSlug ? `Next: ${info(nextSlug).title || nextSlug}` : 'End of deck';
    if (nextSlug !== nextShown) {
      put(pvNext, nextSlug ? frame(nextSlug, 'thumb') : h('p', { class: 'pv-end' }, 'That’s the last slide.'));
      nextShown = nextSlug;
    }
    const meta = info(slug);
    const into = meta.plan && (meta.plan['Into next'] || meta.plan.Transition);
    put(pvNotes, 
      h('h2', {}, meta.title || slug),
      meta.notes ? h('div', { class: 'pv-notes-body', html: meta.notes }) : h('p', { class: 'pv-none' }, 'No speaker notes. Add an <aside class="notes"> to the slide.'),
      into ? h('p', { class: 'pv-into' }, h('span', {}, 'Into next'), into) : null);
  }
  function tick() {
    const s = Math.floor((Date.now() - started) / 1000);
    pvElapsed.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    pvClock.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  pvElapsed.addEventListener('click', () => { started = Date.now(); tick(); });

  // ---------- window sync (audience <-> presenter) ----------
  const peers = new Set();
  if (isPresenter && window.opener) peers.add(window.opener);
  function broadcast() {
    for (const w of peers) {
      if (w.closed) { peers.delete(w); continue; }
      w.postMessage({ deckSync: { slug: S.order[S.i], step: S.step, draft: S.draft } }, '*');
    }
  }
  function openPresenter() {
    const url = new URL(location.href);
    url.searchParams.set('view', 'presenter');
    if (!/^#\//.test(url.hash)) url.hash = `#/${encodeURIComponent(S.order[S.i] || S.order[0] || '')}`;
    const w = window.open(url, 'deck-presenter', 'popup,width=1320,height=820');
    if (!w) return say('The browser blocked the presenter window. Allow pop-ups for this page.');
    peers.add(w);
    if (S.mode === 'overview') present(Math.max(0, S.order.indexOf(S.sel)));
  }

  // ---------- messages ----------
  addEventListener('message', (e) => {
    const d = e.data;
    if (!d || typeof d !== 'object') return;
    if (d.deckSync) {
      if (e.source && e.source !== window) peers.add(e.source);
      const { slug, step, draft } = d.deckSync;
      if (draft && draft !== S.draft && D.drafts[draft]) { S.draft = draft; S.order = [...D.drafts[draft]]; }
      const i = S.order.indexOf(slug);
      if (i < 0) return;
      if (S.mode === 'overview') { S.mode = 'present'; app.dataset.mode = 'present'; }
      return show(i, step, { fromPeer: true });
    }
    if (!d.deckSlide) return;
    let f = null;
    for (const g of pool.values()) if (g.el.contentWindow === e.source) f = g;
    if (d.type === 'ready' && f) {
      f.ready = true;
      f.steps = d.steps || 0;
      if (f === current()) {
        const want = f.pending != null ? f.pending : S.step;
        f.pending = null;
        S.step = want === 'last' ? f.steps : clamp(want, 0, f.steps);
        tell(f, { type: 'enter', step: S.step });
        afterNav({ fromPeer: true });
      }
    } else if (d.type === 'key' && f) {
      onKey(d);
    } else if (d.type === 'step' && f && f === current() && d.step !== S.step) {
      S.step = d.step;
      afterNav();
    }
  });

  // ---------- keys ----------
  let digits = '';
  function onKey(e) {
    const k = e.key;
    if (S.mode === 'overview') return;
    if (/^[0-9]$/.test(k)) { digits += k; return; }
    if (k === 'Enter' && digits) { show(parseInt(digits, 10) - 1, 0); digits = ''; return; }
    digits = '';
    if (['ArrowRight', 'ArrowDown', 'PageDown', 'Enter', 'n'].includes(k) || (k === ' ' && !e.shiftKey)) next();
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k) || (k === ' ' && e.shiftKey)) prev();
    else if (k === 'Home') show(0, 0);
    else if (k === 'End') show(S.order.length - 1, 'last');
    else if (k === 'Escape' || k === 'o') toOverview();
    else if (k === 'f') (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {});
    else if (k === 'p' && !isPresenter) openPresenter();
    else if (k === 'b' || k === '.') app.classList.toggle('is-black');
    else if (k === '?') help.hidden = !help.hidden;
  }
  addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('input, select, textarea')) return;
    if (S.mode === 'overview') {
      const el = document.activeElement && document.activeElement.closest && document.activeElement.closest('.card');
      const slug = el && el.dataset.slug;
      const i = S.order.indexOf(slug);
      if (e.key === '?') { help.hidden = !help.hidden; return; }
      if (e.key === 'Escape') { help.hidden = true; return; }
      if (!slug) return;
      if (e.key === 'Enter') { e.preventDefault(); if (i >= 0) present(i); return; }
      if (i >= 0 && e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        const to = clamp(i + (e.key === 'ArrowLeft' ? -1 : 1), 0, S.order.length - 1);
        if (to === i) return;
        const nextOrder = [...S.order];
        nextOrder.splice(i, 1);
        nextOrder.splice(to, 0, slug);
        commitOrder(nextOrder, slug);
        cards.get(slug).focus();
        return;
      }
      if (i >= 0 && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        const to = S.order[clamp(i + (e.key === 'ArrowLeft' ? -1 : 1), 0, S.order.length - 1)];
        select(to, true);
      }
      return;
    }
    if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', ' ', 'PageDown', 'PageUp', 'Home', 'End', 'Backspace'].includes(e.key)) e.preventDefault();
    onKey(e);
  });
  overview.addEventListener('focusin', (e) => {
    const el = e.target.closest && e.target.closest('.card');
    if (el && el.dataset.slug !== S.sel) select(el.dataset.slug, false);
  });

  // HUD shows on pointer movement, then gets out of the way
  player.addEventListener('pointermove', () => {
    hud.classList.add('is-on');
    clearTimeout(hudTimer);
    hudTimer = setTimeout(() => hud.classList.remove('is-on'), 1800);
  });

  addEventListener('hashchange', () => {
    const at = fromHash();
    if (at) { if (S.mode === 'overview') present(at.i, at.step); else show(at.i, at.step); }
    else if (S.mode !== 'overview') toOverview();
  });
  function fromHash() {
    const m = /^#\/([^/]+)(?:\/(\d+))?/.exec(location.hash);
    if (!m) return null;
    const i = S.order.indexOf(decodeURIComponent(m[1]));
    return i < 0 ? null : { i, step: parseInt(m[2] || '0', 10) };
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ---------- start ----------
  renderOverview();
  const at = fromHash();
  if (isPresenter) { present(at ? at.i : 0, at ? at.step : 0); tick(); setInterval(tick, 1000); }
  else if (at) present(at.i, at.step);

  if (!D.inline && location.protocol.startsWith('http')) {
    fetch('/__deck/ping', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { S.live = !!(j && j.live); })
      .catch(() => {})
      .finally(() => {
        liveBadge.textContent = S.live ? 'Live: drags save to deck.json' : '';
        liveBadge.hidden = !S.live;
      });
  } else {
    liveBadge.hidden = true;
  }
})();
