// deck kit · static server for docs/decks with live reload and a tiny write API.
// `deck serve` runs it live; shoot/export run it quietly on a random port.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { buildDeck, buildHome, openDeck, renderPrint, renderSheet, SLUG, KIT_VERSION, listDecks } from './project.mjs';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
  '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.otf': 'font/otf', '.mp4': 'video/mp4', '.webm': 'video/webm', '.mp3': 'audio/mpeg', '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8',
};

// Only the top window holds the event stream (browsers cap connections per host);
// it relays changes down to every nested slide frame.
const LIVE = `<script>/* deck serve: live reload */(() => {
  const here = decodeURIComponent(location.pathname).replace(/index\\.html$/, '');
  const isIndex = here.endsWith('/');
  function apply(m) {
    if (m.kind === 'css') {
      for (const l of document.querySelectorAll('link[rel="stylesheet"]')) {
        const u = new URL(l.href); u.searchParams.set('v', Date.now()); l.href = u.href;
      }
    } else if (m.kind === 'html') {
      if (m.path.replace(/index\\.html$/, '') === here) location.reload();
    } else if (m.kind === 'asset') {
      if (here.startsWith(m.scope) && (m.target === 'index') === isIndex) location.reload();
    }
  }
  function relay(m) { for (let i = 0; i < frames.length; i++) frames[i].postMessage({ deckLive: m }, '*'); }
  if (window.parent === window) {
    const es = new EventSource('/__deck/events');
    es.onmessage = (e) => { const m = JSON.parse(e.data); relay(m); apply(m); };
  } else {
    addEventListener('message', (e) => { if (e.data && e.data.deckLive) { relay(e.data.deckLive); apply(e.data.deckLive); } });
  }
})();</script>`;

function classify(rel) {
  const parts = rel.split('/');
  const base = parts[parts.length - 1];
  if (!base || base.startsWith('.') || base.endsWith('~') || /\.(swp|tmp)$/.test(base)) return null;
  if (parts.some((p) => p === '.shots' || p === 'dist' || p === 'node_modules' || p === '.git')) return null;
  if (base.endsWith('.html')) return { kind: 'html', path: '/' + rel };
  if (base.endsWith('.css')) return { kind: 'css', path: '/' + rel };
  if (/\.(json|md|mjs)$/.test(base) && !rel.startsWith('_kit/runtime/')) return null;
  if (rel === '_kit/runtime/deck.js') return { kind: 'asset', scope: '/', target: 'index' };
  const top = parts[0];
  return { kind: 'asset', scope: top === '_kit' || top === '_shared' ? '/' : `/${top}/`, target: 'slides' };
}

const send = (res, code, type, body) => {
  res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store' });
  res.end(body);
};
const sendJson = (res, code, obj) => send(res, code, 'application/json; charset=utf-8', JSON.stringify(obj));

function readBody(req, limit = 1e6) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > limit) { reject(new Error('body too large')); req.destroy(); } });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

export function startServer({ root, port = 4173, host = '127.0.0.1', live = true, log = () => {} }) {
  root = path.resolve(root);
  const clients = new Set();
  const quietUntil = new Map(); // deck -> ms; skip index reload right after an API write

  const broadcast = (msg) => {
    const line = `data: ${JSON.stringify(msg)}\n\n`;
    for (const res of clients) res.write(line);
  };

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    try {
      if (url.pathname === '/__deck/events') {
        res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-store', connection: 'keep-alive' });
        res.write(': deck\n\n');
        clients.add(res);
        req.on('close', () => clients.delete(res));
        return;
      }
      if (url.pathname === '/favicon.ico') { res.writeHead(204); return res.end(); }
      if (url.pathname === '/__deck/ping') return sendJson(res, 200, { live, kit: KIT_VERSION });
      if (url.pathname === '/__deck/api/order' && req.method === 'POST') {
        if (!live) return sendJson(res, 403, { error: 'read-only server' });
        const { deck: name, draft, slides } = JSON.parse(await readBody(req));
        const deck = openDeck(root, name);
        const d = draft || deck.json.draft;
        deck.order(d);
        if (!Array.isArray(slides) || slides.some((s) => !SLUG.test(s) || !fs.existsSync(deck.slideFile(s)))) {
          return sendJson(res, 400, { error: 'every slide must be an existing slides/<slug>.html' });
        }
        deck.json.drafts[d] = [...new Set(slides)];
        deck.save();
        quietUntil.set(name, Date.now() + 2000);
        buildDeck(root, name);
        log(`order saved: ${name} (${d}) ${deck.json.drafts[d].join(' ')}`);
        return sendJson(res, 200, { ok: true, draft: d, slides: deck.json.drafts[d] });
      }
      if (url.pathname === '/__deck/sheet' || url.pathname === '/__deck/print') {
        const deck = openDeck(root, url.searchParams.get('deck'));
        const draft = url.searchParams.get('draft') || undefined;
        const html = url.pathname === '/__deck/sheet'
          ? renderSheet(deck, { draft, cols: +url.searchParams.get('cols') || 4, width: +url.searchParams.get('width') || 400 })
          : renderPrint(deck, { draft });
        return send(res, 200, TYPES['.html'], html);
      }

      // static files
      let rel = decodeURIComponent(url.pathname);
      let file = path.join(root, rel);
      if (file !== root && !file.startsWith(root + path.sep)) return send(res, 403, TYPES['.txt'], 'Forbidden');
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
        if (!rel.endsWith('/')) { res.writeHead(301, { location: url.pathname + '/' + url.search }); return res.end(); }
        file = path.join(file, 'index.html');
      }
      if (!fs.existsSync(file)) return send(res, 404, TYPES['.txt'], `Not found: ${rel}`);
      const ext = path.extname(file).toLowerCase();
      let body = fs.readFileSync(file);
      if (live && ext === '.html') {
        const text = body.toString('utf8');
        body = /<\/body>/i.test(text) ? text.replace(/<\/body>(?![\s\S]*<\/body>)/i, `${LIVE}</body>`) : text + LIVE;
      }
      return send(res, 200, TYPES[ext] || 'application/octet-stream', body);
    } catch (err) {
      return sendJson(res, err.name === 'DeckError' || err instanceof SyntaxError ? 400 : 500, { error: err.message });
    }
  });

  let watcher;
  if (live) {
    const timers = new Map();
    const rebuilds = new Map();
    watcher = fs.watch(root, { recursive: true }, (_ev, filename) => {
      if (!filename) return;
      const rel = filename.split(path.sep).join('/');
      clearTimeout(timers.get(rel));
      timers.set(rel, setTimeout(() => {
        timers.delete(rel);
        const top = rel.split('/')[0];
        // regenerate a deck's index when its manifest inputs change
        if (/^[^_./][^/]*\/(deck\.json|narrative\.md|slides\/[^/]+\.html)$/.test(rel)) {
          clearTimeout(rebuilds.get(top));
          rebuilds.set(top, setTimeout(() => {
            try { if (buildDeck(root, top)) log(`rebuilt ${top}/index.html`); buildHome(root); } catch (e) { log(`build failed: ${e.message}`); }
          }, 80));
        }
        if (rel === `${top}/index.html` && (quietUntil.get(top) || 0) > Date.now()) return;
        const msg = classify(rel);
        if (msg) broadcast(msg);
      }, 60));
    });
  }

  const keepAlive = live ? setInterval(() => { for (const res of clients) res.write(': ping\n\n'); }, 25000) : null;

  return new Promise((resolve, reject) => {
    let attempts = 0;
    const tryListen = (p) => {
      server.once('error', (err) => {
        if (err.code === 'EADDRINUSE' && port !== 0 && attempts++ < 20) return tryListen(p + 1);
        reject(err);
      });
      server.listen(p, host, () => {
        const actual = server.address().port;
        resolve({
          port: actual,
          url: `http://${host === '0.0.0.0' ? 'localhost' : host}:${actual}`,
          close() {
            clearInterval(keepAlive);
            watcher?.close();
            for (const res of clients) res.end();
            return new Promise((r) => server.close(() => r()));
          },
        });
      });
    };
    tryListen(port);
  });
}

export { listDecks };
