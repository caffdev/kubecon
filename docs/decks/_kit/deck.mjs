#!/usr/bin/env node
// deck: story-first HTML slide decks in docs/decks/. Zero dependencies; Node 22+, Chrome for shots/export.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import {
  KIT_DIR, KIT_VERSION, DeckError, fail, isVendored, decksRoot, listDecks, openDeck, checkSlug,
  parseNarrative, parseSlide, energyOf, buildDeck, buildHome, fill, readTemplate,
} from './lib/project.mjs';

const HELP = `deck ${KIT_VERSION}: story-first HTML slide decks

  node docs/decks/_kit/deck.mjs <command> …

Setup
  init [--force]                     vendor this kit into <repo>/docs/decks/_kit (run from the skill copy)
  new <deck> [--title "…"]           scaffold docs/decks/<deck>/: deck.json, narrative.md, theme/, slides/

Slides  (work on the current draft unless --draft <name>)
  sync <deck>                        create slides/<slug>.html for every narrative beat that has none
  add <deck> <slug> [--title "…"] [--after <slug> | --before <slug> | --at <n>]
  fork <deck> <slug> <new-slug> [--swap]   copy a slide to try another take (--swap uses it in the draft)
  swap <deck> <slug> <other-slug>    put other-slug where slug is in the draft (A/B a variant)
  move <deck> <slug> --after <slug> | --before <slug> | --at <n>
  order <deck> <slug> <slug> …       set the whole order of the draft
  bench <deck> <slug> …              take slides out of the draft (files are kept)

Drafts
  draft <deck>                       list drafts
  draft <deck> new <name> [--from <draft> | --empty]
  draft <deck> use <name>            make <name> the default draft
  draft <deck> rm <name>

Look and check
  status <deck>                      order, pacing, ghost deck, bench, problems
  build [<deck>]                     regenerate index.html (one deck or all) and the decks home page
  serve [<deck>] [--port 4173] [--open]   live server: reloads on save; dragging slides saves deck.json
  shoot <deck> [<slug> …] [--width 1280] [--steps] [--sheet [--cols 4]]
                                     PNG screenshots + layout audit into <deck>/.shots/

Assets
  raster <file.svg> [--out file.png] [--scale 2]   render an SVG (e.g. a generated texture) to PNG

Export  (into <deck>/dist/; default is --pdf --html)
  export <deck> [--pdf] [--html] [--png] [--draft <name>]
`;

const VALUE_FLAGS = new Set(['out', 'scale', 'title', 'after', 'before', 'at', 'draft', 'from', 'port', 'width', 'cols', 'root', 'host']);
function parseArgs(argv) {
  const pos = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h') { flags.help = true; continue; }
    if (!a.startsWith('--')) { pos.push(a); continue; }
    const eq = a.indexOf('=');
    const key = a.slice(2, eq < 0 ? undefined : eq);
    if (eq >= 0) flags[key] = a.slice(eq + 1);
    else if (VALUE_FLAGS.has(key)) { if (argv[i + 1] == null) fail(`--${key} needs a value`); flags[key] = argv[++i]; }
    else flags[key] = true;
  }
  return { pos, flags };
}

const say = (...a) => console.log(...a);
const rel = (p) => path.relative(process.cwd(), p) || '.';

function requireKit(root) {
  if (!fs.existsSync(path.join(root, '_kit', 'runtime', 'slide.css'))) {
    fail(`No deck kit at ${rel(path.join(root, '_kit'))}. Run: node ~/.claude/skills/deck/kit/deck.mjs init`);
  }
}

function rebuild(root, name) {
  buildDeck(root, name);
  buildHome(root);
}

function insert(order, slug, flags) {
  const list = order.filter((s) => s !== slug);
  let at = list.length;
  if (flags.after) { const i = list.indexOf(flags.after); if (i < 0) fail(`"${flags.after}" isn't in this draft`); at = i + 1; }
  else if (flags.before) { const i = list.indexOf(flags.before); if (i < 0) fail(`"${flags.before}" isn't in this draft`); at = i; }
  else if (flags.at) { at = Math.max(0, Math.min(list.length, parseInt(flags.at, 10) - 1)); }
  list.splice(at, 0, slug);
  return list;
}

const humanize = (slug) => slug.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());
const unquote = (s) => (s || '').replace(/^["“'‘]+|["”'’]+$/g, '').trim();

function slideHtml(title) {
  return fill(readTemplate('slide.html'), { title: title.replace(/[<&]/g, (c) => (c === '<' ? '&lt;' : '&amp;')) });
}

function printOrder(deck, draft) {
  const order = deck.order(draft);
  order.forEach((s, i) => say(`  ${String(i + 1).padStart(2)}  ${s}`));
}

// ---------- commands ----------
const commands = {
  help() { say(HELP); },

  init({ flags }) {
    const root = decksRoot(flags.root);
    const target = path.join(root, '_kit');
    if (isVendored() && path.resolve(target) === KIT_DIR) {
      fail('This is the vendored copy. To update it, run init from the skill: node ~/.claude/skills/deck/kit/deck.mjs init --force');
    }
    const current = fs.existsSync(path.join(target, 'VERSION')) ? fs.readFileSync(path.join(target, 'VERSION'), 'utf8').trim() : null;
    if (current && current === KIT_VERSION && !flags.force) {
      say(`Kit ${KIT_VERSION} is already in ${rel(target)}.`);
    } else {
      fs.mkdirSync(root, { recursive: true });
      fs.cpSync(KIT_DIR, target, { recursive: true, force: true });
      say(current ? `Updated ${rel(target)} from ${current} to ${KIT_VERSION}.` : `Installed deck kit ${KIT_VERSION} in ${rel(target)}.`);
    }
    const ignore = path.join(root, '.gitignore');
    if (!fs.existsSync(ignore)) fs.writeFileSync(ignore, '# review screenshots from `deck shoot`\n*/.shots/\n');
    buildHome(root);
    for (const d of listDecks(root)) buildDeck(root, d);
    say(`Next: node ${rel(path.join(target, 'deck.mjs'))} new <deck-name> --title "…"`);
  },

  new({ pos, flags }) {
    const root = decksRoot(flags.root);
    requireKit(root);
    const name = checkSlug(pos[0], 'deck name');
    const dir = path.join(root, name);
    if (fs.existsSync(path.join(dir, 'deck.json'))) fail(`${rel(dir)} already exists.`);
    const title = flags.title || humanize(name);
    fs.mkdirSync(path.join(dir, 'slides'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'theme', 'assets'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'deck.json'), JSON.stringify({ title, draft: 'main', drafts: { main: [] } }, null, 2) + '\n');
    fs.writeFileSync(path.join(dir, 'narrative.md'), fill(readTemplate('narrative.md'), { title, date: new Date().toISOString().slice(0, 10) }));
    fs.writeFileSync(path.join(dir, 'theme', 'theme.css'), fill(readTemplate('theme.css'), { title }));
    rebuild(root, name);
    say(`Created ${rel(dir)}/
  narrative.md     write the story here first
  theme/theme.css  this deck's visual identity
  slides/          one HTML file per slide (deck sync ${name} creates them from the narrative)
  index.html       open it to see, rearrange and present the deck`);
  },

  sync({ pos, flags }) {
    const root = decksRoot(flags.root);
    const deck = openDeck(root, pos[0]);
    const narrative = parseNarrative(deck.narrativeFile);
    if (!narrative.order.length) fail('narrative.md has no beats yet. Each beat is a "### slug" heading with - **Field:** lines.');
    const draft = flags.draft || deck.json.draft;
    const order = [...deck.order(draft)];
    const created = [];
    const added = [];
    narrative.order.forEach((slug, i) => {
      checkSlug(slug, 'beat slug');
      if (!fs.existsSync(deck.slideFile(slug))) {
        const beat = narrative.beats[slug];
        fs.mkdirSync(deck.slidesDir, { recursive: true });
        fs.writeFileSync(deck.slideFile(slug), slideHtml(unquote(beat.Headline) || humanize(slug)));
        created.push(slug);
      }
      if (!order.includes(slug)) {
        const before = narrative.order.slice(0, i).reverse().find((s) => order.includes(s));
        order.splice(before ? order.indexOf(before) + 1 : 0, 0, slug);
        added.push(slug);
      }
    });
    deck.json.drafts[draft] = order;
    deck.save();
    rebuild(root, deck.name);
    say(created.length ? `Created ${created.length} slide skeleton(s): ${created.join(', ')}` : 'Every beat already has a slide file.');
    if (added.length) say(`Added to draft "${draft}": ${added.join(', ')}`);
    const extra = order.filter((s) => !narrative.beats[s]);
    if (extra.length) say(`In the draft but not in narrative.md: ${extra.join(', ')}`);
  },

  add({ pos, flags }) {
    const root = decksRoot(flags.root);
    const deck = openDeck(root, pos[0]);
    const slug = checkSlug(pos[1]);
    if (fs.existsSync(deck.slideFile(slug))) fail(`slides/${slug}.html already exists. Use fork to make a variant.`);
    const beat = parseNarrative(deck.narrativeFile).beats[slug];
    fs.mkdirSync(deck.slidesDir, { recursive: true });
    fs.writeFileSync(deck.slideFile(slug), slideHtml(flags.title || unquote(beat?.Headline) || humanize(slug)));
    const draft = flags.draft || deck.json.draft;
    deck.json.drafts[draft] = insert(deck.order(draft), slug, flags);
    deck.save();
    rebuild(root, deck.name);
    say(`Created ${rel(deck.slideFile(slug))} at position ${deck.json.drafts[draft].indexOf(slug) + 1} of "${draft}".`);
  },

  fork({ pos, flags }) {
    const root = decksRoot(flags.root);
    const deck = openDeck(root, pos[0]);
    const from = checkSlug(pos[1]);
    const to = checkSlug(pos[2], 'new slug');
    if (!fs.existsSync(deck.slideFile(from))) fail(`No slides/${from}.html`);
    if (fs.existsSync(deck.slideFile(to))) fail(`slides/${to}.html already exists`);
    fs.copyFileSync(deck.slideFile(from), deck.slideFile(to));
    const draft = flags.draft || deck.json.draft;
    if (flags.swap) {
      const order = deck.order(draft);
      const i = order.indexOf(from);
      if (i >= 0) order[i] = to; else order.push(to);
      deck.save();
    }
    rebuild(root, deck.name);
    say(flags.swap
      ? `Forked ${from} → ${to} and swapped it into "${draft}". ${from} is on the bench.`
      : `Forked ${from} → ${to} (on the bench). Swap it in with: deck swap ${deck.name} ${from} ${to}`);
  },

  swap({ pos, flags }) {
    const root = decksRoot(flags.root);
    const deck = openDeck(root, pos[0]);
    const [a, b] = [checkSlug(pos[1]), checkSlug(pos[2])];
    if (!fs.existsSync(deck.slideFile(b))) fail(`No slides/${b}.html`);
    const draft = flags.draft || deck.json.draft;
    const order = deck.order(draft);
    const i = order.indexOf(a);
    if (i < 0) fail(`"${a}" isn't in draft "${draft}"`);
    const j = order.indexOf(b);
    order[i] = b;
    if (j >= 0) order[j] = a; // both in the draft: trade places
    deck.save();
    rebuild(root, deck.name);
    say(j >= 0 ? `Traded places: ${a} ↔ ${b}` : `${b} now sits at ${i + 1}; ${a} is on the bench.`);
  },

  move({ pos, flags }) {
    const root = decksRoot(flags.root);
    const deck = openDeck(root, pos[0]);
    const slug = checkSlug(pos[1]);
    const draft = flags.draft || deck.json.draft;
    if (!deck.order(draft).includes(slug)) fail(`"${slug}" isn't in draft "${draft}"`);
    if (!flags.after && !flags.before && !flags.at) fail('Say where: --after <slug>, --before <slug> or --at <n>');
    deck.json.drafts[draft] = insert(deck.order(draft), slug, flags);
    deck.save();
    rebuild(root, deck.name);
    printOrder(deck, draft);
  },

  order({ pos, flags }) {
    const root = decksRoot(flags.root);
    const deck = openDeck(root, pos[0]);
    const slugs = [...new Set(pos.slice(1).map((s) => checkSlug(s)))];
    if (!slugs.length) fail('List the slugs in the order you want.');
    const missing = slugs.filter((s) => !fs.existsSync(deck.slideFile(s)));
    if (missing.length) fail(`No slide file for: ${missing.join(', ')}`);
    const draft = flags.draft || deck.json.draft;
    const benched = deck.order(draft).filter((s) => !slugs.includes(s));
    deck.json.drafts[draft] = slugs;
    deck.save();
    rebuild(root, deck.name);
    printOrder(deck, draft);
    if (benched.length) say(`Now on the bench: ${benched.join(', ')}`);
  },

  bench({ pos, flags }) {
    const root = decksRoot(flags.root);
    const deck = openDeck(root, pos[0]);
    const draft = flags.draft || deck.json.draft;
    const out = pos.slice(1);
    if (!out.length) fail('Name the slides to bench.');
    deck.json.drafts[draft] = deck.order(draft).filter((s) => !out.includes(s));
    deck.save();
    rebuild(root, deck.name);
    say(`Benched ${out.join(', ')}. Files stay in slides/.`);
  },

  draft({ pos, flags }) {
    const root = decksRoot(flags.root);
    const deck = openDeck(root, pos[0]);
    const [action, name] = [pos[1], pos[2]];
    const drafts = deck.json.drafts;
    if (!action || action === 'list') {
      for (const [d, order] of Object.entries(drafts)) say(`${d === deck.json.draft ? '*' : ' '} ${d.padEnd(16)} ${order.length} slides`);
      return;
    }
    if (action === 'new') {
      checkSlug(name, 'draft name');
      if (drafts[name]) fail(`Draft "${name}" exists.`);
      drafts[name] = flags.empty ? [] : [...deck.order(flags.from || deck.json.draft)];
      deck.save();
      rebuild(root, deck.name);
      return say(`Draft "${name}" created${flags.empty ? ' (empty)' : ` from "${flags.from || deck.json.draft}"`}. Work on it with --draft ${name}, or: deck draft ${deck.name} use ${name}`);
    }
    if (action === 'use') {
      deck.order(name);
      deck.json.draft = name;
      deck.save();
      rebuild(root, deck.name);
      return say(`"${name}" is now the default draft.`);
    }
    if (action === 'rm') {
      deck.order(name);
      if (name === deck.json.draft) fail(`"${name}" is the default draft. Switch first: deck draft ${deck.name} use <other>`);
      delete drafts[name];
      deck.save();
      rebuild(root, deck.name);
      return say(`Removed draft "${name}". Slide files are untouched.`);
    }
    fail(`Unknown draft action "${action}". Use: list, new, use, rm`);
  },

  status({ pos, flags }) {
    const root = decksRoot(flags.root);
    const deck = openDeck(root, pos[0]);
    const draft = flags.draft || deck.json.draft;
    const order = deck.order(draft);
    const narrative = parseNarrative(deck.narrativeFile);
    const bars = '▁▂▃▄▅▆▇█';
    const problems = [];
    say(`${deck.json.title}  (${rel(deck.dir)})`);
    say(`Draft "${draft}", ${order.length} slides. Drafts: ${Object.keys(deck.json.drafts).join(', ')}\n`);
    const width = Math.max(4, ...order.map((s) => s.length));
    order.forEach((slug, i) => {
      const exists = fs.existsSync(deck.slideFile(slug));
      const beat = narrative.beats[slug] || {};
      const e = energyOf(beat);
      let title = '(missing file)';
      let state = '';
      if (exists) {
        const src = fs.readFileSync(deck.slideFile(slug), 'utf8');
        const parsed = parseSlide(deck.slideFile(slug));
        title = parsed.title;
        if (src.includes('deck:unbuilt')) state = 'skeleton';
        if (!parsed.notes || /Say it out loud/.test(parsed.notes)) problems.push(`~ ${slug}: no speaker notes yet`);
      } else problems.push(`! ${slug}: in the draft but slides/${slug}.html doesn't exist`);
      if (narrative.exists && !narrative.beats[slug]) problems.push(`~ ${slug}: not in narrative.md (add a beat so its job is written down)`);
      say(`  ${String(i + 1).padStart(2)}  ${slug.padEnd(width)}  ${e == null ? ' ' : bars[Math.round((e / 5) * 7)]}  ${state ? `[${state}] ` : ''}${title}`);
    });
    const energies = order.map((s) => energyOf(narrative.beats[s]));
    if (energies.some((e) => e != null)) say(`\nPacing  ${energies.map((e) => (e == null ? '·' : bars[Math.round((e / 5) * 7)])).join('')}   (Energy, from narrative.md)`);
    const ghost = order.map((s) => unquote(narrative.beats[s]?.Headline));
    if (ghost.some(Boolean)) {
      say('\nGhost deck: headlines alone, in order. It should still tell the story.');
      ghost.forEach((g, i) => say(`  ${String(i + 1).padStart(2)}. ${g || `(no headline: ${order[i]})`}`));
    }
    const benched = deck.slideSlugs().filter((s) => !order.includes(s));
    if (benched.length) say(`\nOn the bench: ${benched.join(', ')}`);
    for (const slug of narrative.order) if (!order.includes(slug) && !benched.includes(slug)) problems.push(`! ${slug}: narrative beat has no slide (run: deck sync ${deck.name})`);
    const nOrder = narrative.order.filter((s) => order.includes(s));
    const dOrder = order.filter((s) => narrative.beats[s]);
    const firstDiff = nOrder.findIndex((s, i) => s !== dOrder[i]);
    if (firstDiff >= 0) problems.push(`~ draft order departs from narrative.md at "${dOrder[firstDiff]}" (narrative has "${nOrder[firstDiff]}"). If the new order is intended, reorder the beats in narrative.md so the story doc stays true.`);
    if (problems.length) say(`\nProblems\n${problems.map((p) => '  ' + p).join('\n')}`);
  },

  build({ pos, flags }) {
    const root = decksRoot(flags.root);
    requireKit(root);
    const names = pos[0] ? [openDeck(root, pos[0]).name] : listDecks(root);
    for (const n of names) say(`${buildDeck(root, n) ? 'built ' : 'unchanged'} ${rel(path.join(root, n, 'index.html'))}`);
    buildHome(root);
  },

  async serve({ pos, flags }) {
    const root = decksRoot(flags.root);
    requireKit(root);
    for (const n of listDecks(root)) buildDeck(root, n);
    buildHome(root);
    const { startServer } = await import('./lib/server.mjs');
    const srv = await startServer({ root, port: parseInt(flags.port || '4173', 10), host: flags.host || '127.0.0.1', live: true, log: (m) => say(`  ${m}`) });
    const target = pos[0] ? `${srv.url}/${openDeck(root, pos[0]).name}/` : `${srv.url}/`;
    say(`Serving ${rel(root)} at ${srv.url}/`);
    for (const n of listDecks(root)) say(`  ${n.padEnd(24)} ${srv.url}/${n}/`);
    say('Saving a slide reloads it in the browser. Dragging slides in the overview writes deck.json. Ctrl-C to stop.');
    if (flags.open) {
      const opener = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'explorer' : 'xdg-open';
      spawn(opener, [target], { stdio: 'ignore', detached: true }).unref();
    }
    await new Promise((resolve) => process.once('SIGINT', resolve));
    await srv.close();
  },

  async shoot({ pos, flags }) {
    const root = decksRoot(flags.root);
    const deck = openDeck(root, pos[0]);
    const { shoot } = await import('./lib/export.mjs');
    const slugs = pos.slice(1);
    const sheet = !!flags.sheet;
    const res = await shoot(root, deck.name, {
      slugs, sheet, steps: !!flags.steps, draft: flags.draft,
      width: parseInt(flags.width || '1280', 10), cols: parseInt(flags.cols || '4', 10),
    });
    for (const f of res.files) say(f);
    if (res.sheet) say(`${res.sheet}  (contact sheet)`);
    const issueSlugs = Object.keys(res.issues);
    if (issueSlugs.length) {
      say('\nLayout audit');
      for (const s of issueSlugs) for (const i of res.issues[s]) say(`  ${s}: ${i.type}  ${i.el}  ${i.msg}`);
    } else if (res.files.length) say('\nLayout audit: clean');
    for (const [s, errs] of Object.entries(res.errors)) for (const e of errs) say(`  ${s}: error  ${e}`);
  },

  async raster({ pos, flags }) {
    if (!pos[0] || !fs.existsSync(pos[0])) fail('Give an SVG file: deck raster theme/assets/grain.svg');
    const { rasterize } = await import('./lib/export.mjs');
    const r = await rasterize(pos[0], { out: flags.out, scale: parseFloat(flags.scale || '1') });
    say(`${r.out}  (${r.width}×${r.height})`);
  },

  async export({ pos, flags }) {
    const root = decksRoot(flags.root);
    const deck = openDeck(root, pos[0]);
    const draft = flags.draft;
    deck.order(draft);
    const stem = path.join(deck.dir, 'dist', `${deck.name}${draft && draft !== deck.json.draft ? '.' + draft : ''}`);
    const want = { pdf: flags.pdf, html: flags.html, png: flags.png };
    if (!want.pdf && !want.html && !want.png) { want.pdf = true; want.html = true; }
    const ex = await import('./lib/export.mjs');
    if (want.html) {
      const { file, warnings } = ex.exportHtml(root, deck.name, { draft, file: `${stem}.html` });
      say(`${file}  (single file: player + presenter, opens offline except web fonts)`);
      for (const w of warnings) say(`  warning: ${w}`);
    }
    if (want.pdf) say(`${await ex.exportPdf(root, deck.name, { draft, file: `${stem}.pdf` })}`);
    if (want.png) {
      const files = await ex.exportPng(root, deck.name, { draft, dir: `${stem}-png` });
      say(`${files.length} PNGs in ${path.dirname(files[0] || stem + '-png/x')}`);
    }
  },
};

// ---------- main ----------
const aliases = { update: 'init', ls: 'status', shots: 'shoot', screenshot: 'shoot', reorder: 'order' };
const { pos, flags } = (() => { try { return parseArgs(process.argv.slice(2)); } catch (e) { console.error(e.message); process.exit(1); } })();
let cmd = pos.shift() || 'help';
cmd = aliases[cmd] || cmd;
if (cmd === 'init' && process.argv[2] === 'update') flags.force = true;
if (flags.help || cmd === '--help') cmd = 'help';
if (!commands[cmd]) { console.error(`Unknown command "${cmd}".\n`); say(HELP); process.exit(1); }
try {
  await commands[cmd]({ pos, flags });
} catch (e) {
  if (e instanceof DeckError) { console.error(e.message); process.exit(1); }
  throw e;
}
