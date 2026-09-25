/**
 * Print narration + on-screen equation for videos, to review that words match visuals.
 *   npx tsx scripts/transcript.ts --module heaps
 *   npx tsx scripts/transcript.ts --only two-sum,valid-anagram
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { MODULES, PROBLEMS } from '../src/content/curriculum';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2);
const opt = (n: string) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1].split(',') : null; };
const mods = opt('module');
const only = opt('only');
const walk = (d: string): string[] => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));

const files = [...walk(path.join(ROOT, 'src/content/lessons')), ...walk(path.join(ROOT, 'src/content/problems'))].filter((f) => f.endsWith('.ts'));
for (const f of files) {
  const slug = path.basename(f, '.ts');
  const mod = PROBLEMS.find((p) => p.slug === slug)?.module ?? MODULES.find((m) => m.lesson === slug)?.id;
  if (only && !only.includes(slug)) continue;
  if (mods && !mods.includes(mod ?? '')) continue;
  const c = (await import(pathToFileURL(f).href)).default;
  const s = c.video();
  console.log(`\n### ${slug}`);
  s.frames.forEach((fr: { say: string; eq: string; ch: number }, i: number) => {
    if (!fr.say) return;
    console.log(`[${i}|${s.chapters[fr.ch].id}] ${fr.eq ? `{${fr.eq}} ` : ''}${fr.say}`);
  });
}
