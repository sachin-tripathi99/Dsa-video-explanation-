/**
 * Capture player screenshots at chosen frames for visual review.
 *   npx tsx scripts/frames.ts /problem/two-sum-ii-input-array-is-sorted 0,10,25,40 [--dark] [--narrow]
 * Frames can also be "all" or "every:5". Output: .verify-tmp/frames/<slug>-<n>.png
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIST = path.join(ROOT, 'dist');
const [route, which = '0'] = process.argv.slice(2);
const DARK = process.argv.includes('--dark');
const NARROW = process.argv.includes('--narrow');
const OUT = path.join(ROOT, '.verify-tmp/frames');
const TYPES: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff' };

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const server = http.createServer((req, res) => {
    const p = decodeURIComponent((req.url ?? '/').split('?')[0]);
    let f = path.join(DIST, p === '/' ? 'index.html' : p);
    if (!fs.existsSync(f)) f = path.join(DIST, 'index.html');
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] ?? 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise<void>((r) => server.listen(4180, () => r()));
  const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find((p) => fs.existsSync(p));
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const page = await browser.newPage({ viewport: NARROW ? { width: 400, height: 900 } : { width: 1280, height: 1000 }, colorScheme: DARK ? 'dark' : 'light' });
  page.on('pageerror', (e) => console.log('pageerror', e.message));
  await page.goto(`http://localhost:4180/#${route}`);
  await page.waitForSelector('.player .step');
  await page.addStyleTag({ content: 'header.top{display:none!important}' });
  const total = await page.$eval('.player .step', (el) => Number(el.textContent?.split('/')[1]));
  let frames: number[];
  if (which === 'all') frames = Array.from({ length: total }, (_, i) => i);
  else if (which.startsWith('every:')) {
    const k = Number(which.slice(6));
    frames = Array.from({ length: total }, (_, i) => i).filter((i) => i % k === 0 || i === total - 1);
  } else frames = which.split(',').map(Number).filter((n) => n < total);
  const slug = route.split('/').pop();
  const next = await page.$('.player .controls button[aria-label="Next step"]');
  let at = 0;
  const el = await page.$('.player');
  for (const f of frames) {
    while (at < f) {
      await next!.click();
      at++;
    }
    await page.waitForTimeout(650);
    await el!.screenshot({ path: path.join(OUT, `${slug}-${String(f).padStart(3, '0')}.png`) });
  }
  console.log(`${total} frames; saved ${frames.length} shots to ${OUT}`);
  await browser.close();
  server.close();
}
main();
