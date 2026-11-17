// deck kit · drive a local headless Chrome over the DevTools protocol. Zero dependencies:
// Node 22+ ships WebSocket. Set CHROME_PATH to use a specific Chrome/Chromium/Edge/Brave.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const CANDIDATES = {
  darwin: [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  ],
  linux: ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'microsoft-edge', 'brave-browser'],
  win32: [
    `${process.env['PROGRAMFILES']}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env['PROGRAMFILES(X86)']}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env['LOCALAPPDATA']}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env['PROGRAMFILES(X86)']}\\Microsoft\\Edge\\Application\\msedge.exe`,
  ],
};

export function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  for (const c of CANDIDATES[process.platform] || []) {
    if (path.isAbsolute(c)) { if (fs.existsSync(c)) return c; continue; }
    for (const dir of (process.env.PATH || '').split(path.delimiter)) {
      const p = path.join(dir, c);
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
}

function connect(url) {
  return new Promise((resolve, reject) => {
    const sock = new WebSocket(url);
    let id = 0;
    const pending = new Map();
    const listeners = new Set();
    const api = {
      send(method, params = {}, sessionId) {
        const msg = { id: ++id, method, params };
        if (sessionId) msg.sessionId = sessionId;
        sock.send(JSON.stringify(msg));
        return new Promise((res, rej) => pending.set(msg.id, { res, rej, method }));
      },
      /** Wait for an event. The promise has .cancel() for when it turns out not to be coming. */
      once(method, sessionId, timeout = 30000) {
        let fn, t;
        const p = new Promise((res, rej) => {
          fn = (m) => {
            if (m.method !== method || (sessionId && m.sessionId !== sessionId)) return;
            clearTimeout(t); listeners.delete(fn); res(m.params);
          };
          t = setTimeout(() => { listeners.delete(fn); rej(new Error(`Timed out waiting for ${method}`)); }, timeout);
          listeners.add(fn);
        });
        p.cancel = () => { clearTimeout(t); listeners.delete(fn); };
        return p;
      },
      on(fn) { listeners.add(fn); return () => listeners.delete(fn); },
      close() { try { sock.close(); } catch {} },
    };
    sock.onopen = () => resolve(api);
    sock.onerror = () => reject(new Error(`Could not connect to Chrome at ${url}`));
    sock.onmessage = (ev) => {
      const m = JSON.parse(typeof ev.data === 'string' ? ev.data : Buffer.from(ev.data).toString('utf8'));
      if (m.id && pending.has(m.id)) {
        const { res, rej, method } = pending.get(m.id);
        pending.delete(m.id);
        if (m.error) rej(new Error(`${method}: ${m.error.message}`)); else res(m.result);
      } else for (const l of listeners) l(m);
    };
  });
}

function withTimeout(p, ms, what) {
  let t;
  const timer = new Promise((_, rej) => { t = setTimeout(() => rej(new Error(`Timed out: ${what}`)), ms); });
  return Promise.race([p, timer]).finally(() => clearTimeout(t));
}

export async function launchChrome() {
  const bin = findChrome();
  if (!bin) throw new Error('No Chrome, Chromium, Edge or Brave found. Install Chrome or set CHROME_PATH=/path/to/chrome.');
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'deck-chrome-'));
  const proc = spawn(bin, [
    '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--mute-audio',
    '--force-color-profile=srgb', '--disable-extensions', '--disable-background-networking',
    '--disable-renderer-backgrounding', '--disable-background-timer-throttling', 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

  const wsUrl = await new Promise((resolve, reject) => {
    let buf = '';
    const t = setTimeout(() => reject(new Error(`Chrome didn't start within 20s.\n${buf}`)), 20000);
    proc.stderr.on('data', (d) => {
      buf += d;
      const m = /DevTools listening on (ws:\/\/\S+)/.exec(buf);
      if (m) { clearTimeout(t); resolve(m[1]); }
    });
    proc.on('exit', (code) => { clearTimeout(t); reject(new Error(`Chrome exited (${code}).\n${buf}`)); });
  });
  const cdp = await connect(wsUrl);

  return {
    newPage: (opts) => newPage(cdp, opts),
    async close() {
      try { await withTimeout(cdp.send('Browser.close'), 3000, 'Browser.close'); } catch {}
      cdp.close();
      await new Promise((r) => { if (proc.exitCode != null) return r(); proc.once('exit', r); setTimeout(() => { proc.kill('SIGKILL'); r(); }, 3000); });
      fs.rmSync(profile, { recursive: true, force: true });
    },
  };
}

async function newPage(cdp, { width = 1920, height = 1080 } = {}) {
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  const send = (m, p) => cdp.send(m, p, sessionId);
  const logs = [];
  cdp.on((m) => {
    if (m.sessionId !== sessionId) return;
    if (m.method === 'Runtime.exceptionThrown') logs.push(m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text);
    if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') logs.push(`${m.params.entry.text}${m.params.entry.url ? ` (${m.params.entry.url})` : ''}`);
  });
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Log.enable');

  const page = {
    logs,
    async size(w, h) {
      await send('Emulation.setDeviceMetricsOverride', { width: Math.round(w), height: Math.round(h), deviceScaleFactor: 1, mobile: false });
    },
    async goto(url, timeout = 30000) {
      logs.length = 0;
      const loaded = cdp.once('Page.loadEventFired', sessionId, timeout);
      const r = await send('Page.navigate', { url });
      if (r.errorText) { loaded.cancel(); throw new Error(`Could not load ${url}: ${r.errorText}`); }
      if (!r.loaderId) { loaded.cancel(); return; } // same-document (hash) navigation: no load event
      await loaded;
    },
    async eval(expression, timeout = 25000) {
      const r = await withTimeout(send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }), timeout, expression.slice(0, 60));
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
      return r.result.value;
    },
    async transparent() {
      await send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
    },
    async png({ width, height, scale = 1 }) {
      const r = await send('Page.captureScreenshot', {
        format: 'png', captureBeyondViewport: true,
        clip: { x: 0, y: 0, width: Math.round(width), height: Math.round(height), scale },
      });
      return Buffer.from(r.data, 'base64');
    },
    async pdf(opts = {}) {
      const r = await send('Page.printToPDF', {
        printBackground: true, preferCSSPageSize: true,
        marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, ...opts,
      });
      return Buffer.from(r.data, 'base64');
    },
    close: () => cdp.send('Target.closeTarget', { targetId }).catch(() => {}),
  };
  await page.size(width, height);
  return page;
}
