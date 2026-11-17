// deck kit · screenshots, contact sheets, PDF, PNG and single-file HTML.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { startServer } from './server.mjs';
import { launchChrome } from './chrome.mjs';
import { openDeck, manifest, renderIndex, KIT_DIR } from './project.mjs';

async function withBrowser(root, fn) {
  const server = await startServer({ root, port: 0, live: false });
  let chrome;
  try {
    chrome = await launchChrome();
    return await fn({ server, chrome });
  } finally {
    await chrome?.close();
    await server.close();
  }
}

const READY = `(window.Slide ? window.Slide.ready : document.fonts.ready)
  .then(() => window.Slide ? { steps: Slide.steps, audit: Slide.audit() } : { steps: 0, audit: null })`;

/**
 * Screenshots for review. Each slide renders in its finished state at `width` px wide
 * (scaled at capture, so no resize step), and the layout audit runs on the full-size page.
 */
export async function shoot(root, name, { slugs = [], width = 1280, steps = false, sheet = false, cols = 4, draft } = {}) {
  const deck = openDeck(root, name);
  const m = manifest(deck);
  const [W, H] = m.size;
  const order = deck.order(draft);
  const targets = slugs.length ? slugs : sheet ? [] : order;
  const outDir = path.join(deck.dir, '.shots');
  fs.mkdirSync(outDir, { recursive: true });
  const out = { files: [], sheet: null, issues: {}, errors: {} };

  await withBrowser(root, async ({ server, chrome }) => {
    const page = await chrome.newPage({ width: W, height: H });
    const base = `${server.url}/${encodeURIComponent(name)}/slides`;
    for (const slug of targets) {
      if (!fs.existsSync(deck.slideFile(slug))) { out.errors[slug] = ['no such slide file']; continue; }
      await page.goto(`${base}/${slug}.html?mode=print`);
      const first = await page.eval(READY);
      if (first.audit?.issues.length) out.issues[slug] = first.audit.issues;
      const stepList = steps && first.steps ? [...Array(first.steps + 1).keys()] : [null];
      for (const st of stepList) {
        if (st != null) {
          await page.goto(`${base}/${slug}.html?mode=print&step=${st}`);
          await page.eval(READY);
        }
        const file = path.join(outDir, st == null ? `${slug}.png` : `${slug}@${st}.png`);
        fs.writeFileSync(file, await page.png({ width: W, height: H, scale: Math.min(1, width / W) }));
        out.files.push(file);
      }
      if (page.logs.length) out.errors[slug] = [...new Set(page.logs)];
    }
    if (sheet) {
      const thumb = Math.round(1680 / cols);
      await page.size(cols * thumb + (cols - 1) * 14 + 36, 900);
      const q = new URLSearchParams({ deck: name, cols, width: thumb });
      if (draft) q.set('draft', draft);
      await page.goto(`${server.url}/__deck/sheet?${q}`);
      await page.eval('window.__deckReady');
      const [w, h] = await page.eval('(() => { const r = document.querySelector(".sheet").getBoundingClientRect(); return [Math.ceil(r.width), Math.ceil(r.height)]; })()');
      await page.size(w, h);
      await page.eval('new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))');
      out.sheet = path.join(outDir, `_sheet${draft ? '.' + draft : ''}.png`);
      fs.writeFileSync(out.sheet, await page.png({ width: w, height: h }));
    }
    await page.close();
  });
  return out;
}

export async function exportPdf(root, name, { draft, file }) {
  const deck = openDeck(root, name);
  const [W, H] = manifest(deck).size;
  await withBrowser(root, async ({ server, chrome }) => {
    const page = await chrome.newPage({ width: W, height: H });
    const q = new URLSearchParams({ deck: name });
    if (draft) q.set('draft', draft);
    await page.goto(`${server.url}/__deck/print?${q}`, 60000);
    const complete = await page.eval('window.__deckReady', 30000);
    if (!complete) console.warn('  some slides did not report ready within 20s; the PDF may show them mid-load');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, await page.pdf());
    await page.close();
  });
  return file;
}

export async function exportPng(root, name, { draft, dir }) {
  const deck = openDeck(root, name);
  const [W, H] = manifest(deck).size;
  const order = deck.order(draft).filter((s) => fs.existsSync(deck.slideFile(s)));
  fs.mkdirSync(dir, { recursive: true });
  const files = [];
  await withBrowser(root, async ({ server, chrome }) => {
    const page = await chrome.newPage({ width: W, height: H });
    for (const [i, slug] of order.entries()) {
      await page.goto(`${server.url}/${encodeURIComponent(name)}/slides/${slug}.html?mode=print`);
      await page.eval(READY);
      const file = path.join(dir, `${String(i + 1).padStart(2, '0')}-${slug}.png`);
      fs.writeFileSync(file, await page.png({ width: W, height: H }));
      files.push(file);
    }
    await page.close();
  });
  return files;
}

// ---------- SVG -> PNG ----------
/**
 * Render an SVG to PNG with a transparent background. Use for generated textures that rely on
 * SVG filters (feTurbulence etc.): as SVG they re-rasterize at print resolution on every PDF page.
 */
export async function rasterize(file, { out, scale = 1 } = {}) {
  const svg = fs.readFileSync(file, 'utf8');
  const tag = /<svg\b[^>]*>/i.exec(svg)?.[0] || '';
  const num = (name) => parseFloat(new RegExp(`\\s${name}\\s*=\\s*["']?([\\d.]+)`, 'i').exec(tag)?.[1]);
  const vb = /viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(tag);
  const w = num('width') || (vb && +vb[1]);
  const h = num('height') || (vb && +vb[2]);
  if (!w || !h) throw new Error(`${file}: give the <svg> width and height (or a viewBox) so it has a size`);
  out ||= file.replace(/\.svg$/i, '') + '.png';
  const chrome = await launchChrome();
  try {
    const page = await chrome.newPage({ width: w, height: h });
    await page.transparent();
    await page.goto(pathToFileURL(path.resolve(file)).href);
    fs.writeFileSync(out, await page.png({ width: w, height: h, scale }));
  } finally {
    await chrome.close();
  }
  return { out, width: Math.round(w * scale), height: Math.round(h * scale) };
}

// ---------- single-file HTML ----------
const MIME = {
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.webp': 'image/webp', '.avif': 'image/avif', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.otf': 'font/otf', '.mp4': 'video/mp4', '.webm': 'video/webm', '.mp3': 'audio/mpeg', '.json': 'application/json',
  '.css': 'text/css', '.js': 'text/javascript',
};
const external = (u) => /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|%%A\d+%%$)/i.test(u.trim());

/** Every inlined resource is stored once and referenced by %%A<n>%% tokens; the player expands them. */
function makeBundler() {
  const assets = [];
  const keys = new Map();
  const warnings = new Set();
  const store = (key, make) => {
    if (!keys.has(key)) { keys.set(key, assets.length); assets.push(''); assets[keys.get(key)] = make(); }
    return `%%A${keys.get(key)}%%`;
  };
  const fileRef = (file) => {
    if (!fs.existsSync(file)) { warnings.add(`missing file: ${file}`); return null; }
    return store(file, () => `data:${MIME[path.extname(file).toLowerCase()] || 'application/octet-stream'};base64,${fs.readFileSync(file).toString('base64')}`);
  };
  const resolveRef = (ref, dir) => path.resolve(dir, decodeURI(ref.split(/[?#]/)[0]));

  const urls = (text, dir) => text.replace(/url\(\s*(['"]?)([^'")]+?)\1\s*\)/g, (m, _q, ref) => {
    if (external(ref)) return m;
    const tok = fileRef(resolveRef(ref, dir));
    return tok ? `url("${tok}")` : m;
  });

  function css(text, dir, hoist, seen = new Set()) {
    const nested = [];
    // quoted URLs may contain ";" (Google Fonts axes), so match quoted and bare forms separately
    text = text.replace(/@import\s+(?:url\(\s*)?(?:"([^"]*)"|'([^']*)'|([^'"()\s;]+))\s*\)?\s*([^;]*);/g, (m, dq, sq, bare, media) => {
      const href = dq ?? sq ?? bare;
      if (external(href)) { hoist.push(m); return ''; }
      const file = resolveRef(href, dir);
      if (seen.has(file)) return '';
      if (!fs.existsSync(file)) { warnings.add(`missing stylesheet: ${file}`); return ''; }
      seen.add(file);
      const inner = css(fs.readFileSync(file, 'utf8'), path.dirname(file), hoist, seen);
      nested.push(media.trim() ? `@media ${media.trim()} {\n${inner}\n}` : inner);
      return `\u0000${nested.length - 1}\u0000`;
    });
    text = urls(text, dir);
    return text.replace(/\u0000(\d+)\u0000/g, (_, i) => nested[+i]);
  }

  function stylesheet(file) {
    if (!fs.existsSync(file)) { warnings.add(`missing stylesheet: ${file}`); return null; }
    return store(`${file}#css`, () => {
      const hoist = [];
      const body = css(fs.readFileSync(file, 'utf8'), path.dirname(file), hoist);
      return [...new Set(hoist)].join('\n') + '\n' + body;
    });
  }

  function html(text, dir) {
    text = urls(text, dir); // inline <style> blocks and style="" attributes
    text = text.replace(/<link\b[^>]*>/gi, (tag) => {
      if (!/\brel\s*=\s*["']?stylesheet/i.test(tag)) return tag;
      const href = /\bhref\s*=\s*(["'])(.*?)\1/i.exec(tag)?.[2];
      if (!href || external(href)) return tag;
      const tok = stylesheet(resolveRef(href, dir));
      return tok ? `<style>${tok}</style>` : tag;
    });
    text = text.replace(/<script\b([^>]*?)\bsrc\s*=\s*(["'])(.*?)\2([^>]*)>\s*<\/script>/gi, (m, a, _q, src, b) => {
      if (external(src)) return m;
      const file = resolveRef(src, dir);
      if (!fs.existsSync(file)) { warnings.add(`missing script: ${file}`); return m; }
      const tok = store(`${file}#js`, () => fs.readFileSync(file, 'utf8').replace(/<\/script/gi, '<\\/script'));
      return `<script${a}${b}>${tok}</script>`;
    });
    text = text.replace(/<(img|source|video|audio|image|track|object|embed)\b[^>]*>/gi, (tag) =>
      tag.replace(/(\s(?:src|href|xlink:href|poster|data)\s*=\s*)(["'])(.*?)\2/gi, (m, attr, q, ref) => {
        if (!ref || external(ref)) return m;
        const tok = fileRef(resolveRef(ref, dir));
        return tok ? `${attr}${q}${tok}${q}` : m;
      }));
    if (/\ssrcset\s*=/.test(text)) warnings.add('srcset is not inlined; use a single src for exported decks');
    if (/<use\b[^>]*href\s*=\s*["'](?!#)/i.test(text)) warnings.add('<use href="file.svg#id"> does not survive a single-file export; inline the SVG symbol');
    return text;
  }
  return { assets, warnings, html };
}

export function exportHtml(root, name, { draft, file }) {
  const deck = openDeck(root, name);
  const m = manifest(deck);
  const d = draft || deck.json.draft;
  const order = deck.order(d);
  const bundler = makeBundler();
  const slides = {};
  for (const slug of order) {
    const s = m.slides[slug];
    if (s.missing) continue;
    slides[slug] = { ...s, html: bundler.html(fs.readFileSync(deck.slideFile(slug), 'utf8'), deck.slidesDir) };
  }
  const bundled = { ...m, draft: d, drafts: { [d]: order.filter((s) => slides[s]) }, slides, inline: true, assets: bundler.assets };
  const css = fs.readFileSync(path.join(KIT_DIR, 'runtime', 'deck.css'), 'utf8');
  const js = fs.readFileSync(path.join(KIT_DIR, 'runtime', 'deck.js'), 'utf8');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, renderIndex(bundled, { css, js }));
  return { file, warnings: [...bundler.warnings] };
}
