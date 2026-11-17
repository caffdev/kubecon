// sheet.mjs <out.png> <img>... : a 2-column contact sheet of preview PNGs
import fs from 'node:fs';
import path from 'node:path';
const { launchChrome } = await import(path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../../_kit/lib/chrome.mjs'));
const [out, ...imgs] = process.argv.slice(2);
const rows = Math.ceil(imgs.length / 2);
const html = path.join(path.dirname(path.resolve(out)), '_sheet.html');
fs.writeFileSync(html, `<!doctype html><body style="margin:0;background:#333;display:grid;grid-template-columns:960px 960px;gap:6px">${imgs.map((i) => `<img src="file://${path.resolve(i)}">`).join('')}</body>`);
const c = await launchChrome();
const p = await c.newPage({ width: 1926, height: rows * 546 });
await p.goto('file://' + html);
await p.eval('new Promise((r) => setTimeout(r, 300))');
fs.writeFileSync(out, await p.png({ width: 1926, height: rows * 546, scale: 0.75 }));
await c.close();
