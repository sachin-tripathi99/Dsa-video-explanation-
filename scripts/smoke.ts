/**
 * Browser smoke test: serves dist/, opens every route, steps through every video,
 * and fails on console errors or pages that don't render.
 *
 *   npm run build && npm run smoke            # everything
 *   npm run smoke -- --shots                  # also save screenshots to .verify-tmp/shots
 *   npm run smoke -- --only two-sum-ii-input-array-is-sorted
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { MODULES, PROBLEMS } from '../src/content/curriculum';
import { PLANS } from '../src/content/roadmaps';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIST = path.join(ROOT, 'dist');
const args = process.argv.slice(2);
const SHOTS = args.includes('--shots');
const ONLY = (() => {
  const i = args.indexOf('--only');
  return i >= 0 ? args[i + 1].split(',') : null;
})();
const SHOT_DIR = path.join(ROOT, '.verify-tmp/shots');

const TYPES: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml', '.json': 'application/json' };

function serve(): Promise<http.Server> {
  return new Promise((resolve) => {
    const s = http.createServer((req, res) => {
      const p = decodeURIComponent((req.url ?? '/').split('?')[0]);
      let f = path.join(DIST, p === '/' ? 'index.html' : p);
      if (!fs.existsSync(f)) f = path.join(DIST, 'index.html');
      res.writeHead(200, { 'content-type': TYPES[path.extname(f)] ?? 'application/octet-stream' });
      fs.createReadStream(f).pipe(res);
    });
    s.listen(4179, () => resolve(s));
  });
}

async function main() {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) throw new Error('Run `npm run build` first.');
  const server = await serve();
  const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium/chrome-linux/chrome'].find((p) => fs.existsSync(p));
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
  const errors: string[] = [];
  let current = '';
  page.on('pageerror', (e) => errors.push(`${current}: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/speech|voices/i.test(m.text())) errors.push(`${current}: ${m.text()}`);
  });
  if (SHOTS) fs.mkdirSync(SHOT_DIR, { recursive: true });

  const routes: string[] = ONLY
    ? ONLY.map((s) => (PROBLEMS.some((p) => p.slug === s) ? `/problem/${s}` : `/lesson/${s}`))
    : ['/', '/learn', '/roadmaps', '/cheatsheet', '/progress', ...PLANS.map((p) => `/roadmaps/${p.id}`), ...MODULES.map((m) => `/learn/${m.id}`), ...MODULES.map((m) => `/lesson/${m.lesson}`), ...PROBLEMS.map((p) => `/problem/${p.slug}`)];

  let steps = 0;
  for (const r of routes) {
    current = r;
    await page.goto(`http://localhost:4179/#${r}`);
    await page.waitForSelector('main h1, main .empty', { timeout: 15000 }).catch(() => errors.push(`${r}: no heading rendered`));
    const hasPlayer = await page.$('.player .controls');
    if (hasPlayer && (r.startsWith('/problem/') || r.startsWith('/lesson/'))) {
      await page.waitForSelector('.player .step');
      const total = await page.$eval('.player .step', (el) => Number(el.textContent?.split('/')[1]));
      // Step through every frame of the video (narration is not triggered by stepping).
      const next = await page.$('.player .controls button[aria-label="Next step"]');
      for (let i = 1; i < total; i++) {
        await next!.click();
        steps++;
      }
      if (SHOTS) await page.screenshot({ path: path.join(SHOT_DIR, `${r.replace(/\//g, '_')}.png`) });
    } else if (SHOTS) {
      await page.screenshot({ path: path.join(SHOT_DIR, `${r.replace(/\//g, '_') || 'home'}.png`) });
    }
  }
  // Phone width check on a problem page.
  await page.setViewportSize({ width: 390, height: 844 });
  const probe = ONLY ? routes[0] : '/problem/two-sum-ii-input-array-is-sorted';
  current = `${probe} @390px`;
  await page.goto(`http://localhost:4179/#${probe}`);
  await page.waitForTimeout(500);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 2) errors.push(`${current}: page scrolls horizontally by ${overflow}px`);
  if (SHOTS) await page.screenshot({ path: path.join(SHOT_DIR, 'mobile.png'), fullPage: false });

  await browser.close();
  server.close();
  console.log(`Visited ${routes.length} routes, stepped through ${steps} video frames.`);
  if (errors.length) {
    console.log(`\nErrors (${errors.length}):`);
    for (const e of errors.slice(0, 100)) console.log('  ✗ ' + e);
    process.exit(1);
  }
  console.log('Smoke test passed.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
