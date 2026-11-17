/* deck kit · slide runtime
   Loaded at the end of every slide. Fits the stage to the viewport, runs build steps,
   talks to the deck player, and audits layout for `deck shoot`. No configuration.

   Modes (from ?mode=, the iframe name "deck:<mode>", or context):
     solo     opened directly: arrows step through builds
     present  inside the player: the player drives steps
     thumb    overview/contact-sheet: finished state, no motion
     print    PDF/screenshot: finished state (or ?step=N), no motion

   API for slide scripts (put them after this script):
     Slide.steps, Slide.step, Slide.go(n), Slide.next(), Slide.prev()
     Slide.wait(promise)       hold screenshots/export until async drawing is done
     Slide.ready               resolves once fonts + waits are done
     Slide.audit()             layout problems (offstage, overlap, clipped, small text, density)
     document events: slide:enter, slide:leave, slide:step  (detail: {step, steps}) */
(() => {
  'use strict';
  const html = document.documentElement;
  const params = new URLSearchParams(location.search);
  const embedded = window.parent !== window;
  const named = /^deck:(\w+)$/.exec(window.name || '');
  const mode = params.get('mode') || (named && named[1]) || (embedded ? 'present' : 'solo');
  const still = mode === 'thumb' || mode === 'print';
  html.dataset.mode = mode;
  if (params.has('grid')) html.dataset.grid = '';

  const slide = document.querySelector('.slide') || document.body;

  // ---------- fit the stage ----------
  const cssPx = (name, fallback) => parseFloat(getComputedStyle(html).getPropertyValue(name)) || fallback;
  const size = () => [cssPx('--slide-w', 1920), cssPx('--slide-h', 1080)];
  function fit() {
    const [w, h] = size();
    html.style.setProperty('--fit', String(Math.min(innerWidth / w, innerHeight / h)));
  }
  fit();
  addEventListener('resize', fit);

  // ---------- build steps ----------
  const marks = [];
  let steps = 0;
  for (const el of slide.querySelectorAll('[data-step]')) {
    const raw = (el.getAttribute('data-step') || '').trim();
    const n = raw === '' ? steps + 1 : Math.max(1, parseInt(raw, 10) || 1);
    steps = Math.max(steps, n);
    marks.push([el, n]);
  }
  let step = 0;
  let pinned = false; // still render of the finished slide: no step is "current", so nothing dims

  const emit = (name) => document.dispatchEvent(new CustomEvent(name, { detail: { step, steps } }));
  const post = (msg) => { if (embedded) parent.postMessage({ deckSlide: 1, ...msg }, '*'); };

  function render() {
    for (const [el, n] of marks) {
      el.classList.toggle('is-on', n <= step);
      el.classList.toggle('is-current', !pinned && n === step);
    }
    for (let i = 1; i <= steps; i++) slide.classList.toggle('at-' + i, i <= step);
    slide.dataset.at = String(step);
  }
  function go(n) {
    const next = Math.max(0, Math.min(steps, n === 'last' ? steps : (n | 0)));
    if (next === step && slide.dataset.at === String(step)) return;
    step = next;
    render();
    emit('slide:step');
    post({ type: 'step', step, steps });
  }
  function enter(n = 0) {
    slide.classList.remove('is-entered');
    void slide.offsetWidth; // restart entrance animations
    slide.classList.add('is-entered');
    step = -1;
    go(n);
    emit('slide:enter');
  }
  function leave() {
    slide.classList.remove('is-entered');
    emit('slide:leave');
  }

  if (still) {
    const fixed = params.get('step');
    step = fixed == null ? steps : Math.max(0, Math.min(steps, parseInt(fixed, 10) || 0));
    pinned = fixed == null;
    slide.classList.toggle('is-pinned', pinned);
    slide.classList.add('is-entered');
    render();
  } else if (!embedded) {
    enter(0);
  } else {
    render();
  }

  // ---------- messages from the player ----------
  addEventListener('message', (e) => {
    const d = e.data;
    if (!d || d.deckHost !== 1) return;
    if (d.type === 'enter') enter(d.step === 'last' ? steps : d.step || 0);
    else if (d.type === 'leave') leave();
    else if (d.type === 'goto') go(d.step);
  });

  // ---------- keys ----------
  const NEXT = new Set(['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter']);
  const PREV = new Set(['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace']);
  addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]')) return;
    if (mode === 'solo') {
      if (NEXT.has(e.key) && !(e.key === ' ' && e.shiftKey)) { e.preventDefault(); go(step + 1); }
      else if (PREV.has(e.key) || (e.key === ' ' && e.shiftKey)) { e.preventDefault(); go(step - 1); }
      return;
    }
    if (embedded && mode === 'present') {
      post({ type: 'key', key: e.key, shiftKey: e.shiftKey, altKey: e.altKey, metaKey: e.metaKey, ctrlKey: e.ctrlKey });
      if (NEXT.has(e.key) || PREV.has(e.key)) e.preventDefault();
    }
  });

  // ---------- layout audit ----------
  function audit() {
    const issues = [];
    const box = slide.getBoundingClientRect();
    const k = box.width / size()[0] || 1;
    const tol = 2 * k;
    const ignored = (el) => el.closest('[aria-hidden="true"], [data-bleed], [data-audit="off"], .notes, script, style, template');
    const directText = (el) => [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim());
    const name = (el) => {
      let s = el.tagName.toLowerCase();
      if (el.id) s += '#' + el.id;
      else {
        const cls = [...el.classList].filter((c) => !/^(is-|at-)/.test(c)).slice(0, 2);
        if (cls.length) s += '.' + cls.join('.');
      }
      const t = (el.textContent || '').trim().replace(/\s+/g, ' ');
      return t ? `${s} "${t.length > 42 ? t.slice(0, 42) + '…' : t}"` : s;
    };
    const textRect = (el) => {
      const r = document.createRange();
      r.selectNodeContents(el);
      return r.getBoundingClientRect();
    };
    const visible = (el, cs) => cs.display !== 'none' && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0.01;

    const blocks = new Map(); // text block -> rect of its text
    let words = 0;
    for (const el of slide.querySelectorAll('*')) {
      if (ignored(el)) continue;
      const cs = getComputedStyle(el);
      if (!visible(el, cs)) continue;
      const own = directText(el);
      const media = el.matches('img, video, canvas, picture, svg:not(svg svg)');
      if (!own.length && !media) continue;
      const r = own.length ? textRect(el) : el.getBoundingClientRect();
      if (!r.width || !r.height) continue;

      if (r.left < box.left - tol || r.top < box.top - tol || r.right > box.right + tol || r.bottom > box.bottom + tol) {
        issues.push({ type: 'offstage', el: name(el), msg: 'runs past the slide edge (decorative bleed? mark it data-bleed or aria-hidden)' });
      }
      if (own.length) {
        const fs = parseFloat(cs.fontSize);
        if (fs < 22) issues.push({ type: 'small-text', el: name(el), msg: `${fs}px text is hard to read in a room (aim for 24px+)` });
        if ((/(hidden|clip)/.test(cs.overflowX + cs.overflowY) || cs.webkitLineClamp !== 'none') &&
            (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2)) {
          issues.push({ type: 'clipped', el: name(el), msg: 'text is cut off by its box' });
        }
        words += own.reduce((sum, n) => sum + n.textContent.trim().split(/\s+/).filter(Boolean).length, 0);
        let block = el;
        while (block !== slide && /^inline/.test(getComputedStyle(block).display) && block.parentElement) block = block.parentElement;
        if (block !== slide && !blocks.has(block)) blocks.set(block, textRect(block));
      }
      if (el.matches('img:not([alt])')) issues.push({ type: 'a11y', el: name(el), msg: 'image has no alt text' });
    }

    const texts = [...blocks];
    for (let i = 0; i < texts.length; i++) {
      for (let j = i + 1; j < texts.length; j++) {
        const [a, ra] = texts[i];
        const [b, rb] = texts[j];
        if (a.contains(b) || b.contains(a)) continue;
        const w = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
        const h = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
        if (w <= 0 || h <= 0) continue;
        const smaller = Math.min(ra.width * ra.height, rb.width * rb.height);
        if ((w * h) / smaller > 0.15) {
          issues.push({ type: 'overlap', el: `${name(a)} × ${name(b)}`, msg: 'text blocks collide (intentional overprint? mark one aria-hidden)' });
        }
      }
    }
    if (words > 70) issues.push({ type: 'dense', el: 'slide', msg: `${words} words on screen; is this slide doing a document's job?` });
    return { words, steps, issues };
  }

  // ---------- ready ----------
  const waits = [];
  const Slide = (window.Slide = {
    mode,
    get steps() { return steps; },
    get step() { return step; },
    go, next: () => go(step + 1), prev: () => go(step - 1),
    wait(p) { waits.push(Promise.resolve(p).catch(() => {})); return p; },
    audit,
    ready: null,
  });
  const loaded = new Promise((r) => (document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true })));
  Slide.ready = loaded
    .then(() => Promise.all([document.fonts ? document.fonts.ready : null, ...waits]))
    .then(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
    .then(() => {
      html.dataset.ready = '';
      post({ type: 'ready', steps, title: document.title });
      return true;
    });
})();
