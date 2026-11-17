// preview.mjs [--at <ms>] [slug...]: render deck/project slides roughly as Slides does (SVG as an image,
// fragments shown, labels over art) into out/preview/<slug>.png, plus the original kit slide beside it.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const DECKS = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../..');
const { launchChrome } = await import(`${DECKS}/_kit/lib/chrome.mjs`);
const { startServer } = await import(`${DECKS}/_kit/lib/server.mjs`);
const HERE = path.dirname(new URL(import.meta.url).pathname);
const P = path.join(HERE, 'deck', 'project');
const OUT = path.join(HERE, 'out', 'preview');
fs.mkdirSync(OUT, { recursive: true });
const args = process.argv.slice(2);
let at = null;
if (args[0] === '--at') { at = +args[1]; args.splice(0, 2); }
const deck = JSON.parse(fs.readFileSync(path.join(P, 'deck.json'), 'utf8'));
const slugs = args.length ? args : deck.order;

const BASE = `* { margin: 0 } body { font: 32px/1.2 sans-serif }
body > section { width: 1920px !important; height: 1080px !important; overflow: hidden !important; box-sizing: border-box !important; position: relative; isolation: isolate }
section[hidden], aside, noscript { display: none !important }
h1 { font-size: 96px; font-weight: 600 } h2 { font-size: 64px; font-weight: 600 } h3 { font-size: 44px; font-weight: 600 }
p, li, h1, h2, h3, td, th { overflow-wrap: break-word; text-wrap: pretty }
x-shape, x-icon, x-embed { display: block } x-icon { background: currentColor; -webkit-mask: radial-gradient(circle, #000 40%, transparent 41%); }`;
const fonts = Object.values(deck.faces).map((f) => `<link rel="stylesheet" href="${f.href}">`).join('');

const server = await startServer({ root: DECKS, port: 0, live: false });
const chrome = await launchChrome();
try {
  const page = await chrome.newPage({ width: 1920, height: 1080 });
  for (const slug of slugs) {
    let sec = fs.readFileSync(path.join(P, 'slides', `${slug}.html`), 'utf8');
    sec = sec.replace(/\{\{asset:([^}]+)\}\}/g, (_, n) => pathToFileURL(path.join(HERE, 'out', n)).href);
    // an inline <svg> is shown as an image in Slides: same here
    sec = sec.replace(/<svg([^>]*?) style="([^"]*)"([\s\S]*?<\/svg>)/g, (_, a, st, rest) => {
      const svg = `<svg${a.replace(/ (id|aria-[a-z]+)="[^"]*"/g, '')}${rest}`;
      return `<img style="${st}" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}">`;
    });
    if (at == null) sec = sec.replace(/class="([^"]*\bfragment\b[^"]*)"/g, 'class="$1 visible"');
    const html = `<!doctype html><html><head><meta charset="utf-8">${fonts}<style>${BASE}</style><link rel="stylesheet" href="${pathToFileURL(path.join(P, 'deck.css')).href}"></head><body>${sec}</body></html>`;
    const file = path.join(OUT, `${slug}.html`);
    fs.writeFileSync(file, html);
    await page.goto(pathToFileURL(file).href);
    await page.eval(`(async () => { await document.fonts.ready;
      const s = document.querySelector('section'); let firstFlow = null;
      for (const c of s.children) { const p = getComputedStyle(c).position; if (p !== 'absolute' && c.tagName !== 'ASIDE') { firstFlow = c; break; } }
      for (const c of s.children) { if (c === firstFlow) break; if (getComputedStyle(c).position === 'absolute') c.style.zIndex = '-1'; }
    })()`);
    if (at == null) {
      await page.eval('new Promise((r) => setTimeout(r, 5000))');
      await page.eval('document.getAnimations().forEach((a) => a.finish())');
    } else await page.eval(`new Promise((r) => setTimeout(r, ${at}))`);
    const shot = path.join(OUT, `${slug}${at == null ? '' : '@' + at}.png`);
    fs.writeFileSync(shot, await page.png({ width: 1920, height: 1080, scale: 0.5 }));
    // the original, finished, for comparison
    if (at == null) {
      await page.goto(`${server.url}/takeaways-v3/slides/${slug}.html?mode=print`);
      await page.eval('(window.Slide ? Slide.ready : document.fonts.ready).then(() => new Promise((r) => setTimeout(r, 300)))');
      fs.writeFileSync(path.join(OUT, `${slug}.orig.png`), await page.png({ width: 1920, height: 1080, scale: 0.5 }));
    }
    console.log(shot);
  }
  await page.close();
} finally {
  await chrome.close();
  await server.close();
}
