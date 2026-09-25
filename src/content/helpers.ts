/** Shared scene helpers so every video opens and closes the same way. */
import { Video } from '../engine/builder';
import type { ChapterKind } from '../engine/types';

export { Video, words } from '../engine/builder';

/** Title card + statement lines. */
export function titleCard(v: Video, title: string, subtitle: string, say: string) {
  v.chapter('intro', 'The problem');
  v.clear().text('title', { title, subtitle, big: true });
  v.say(say);
  v.drop('title');
}

/** Recap table comparing approaches, then the transferable lesson. */
export function recap(
  v: Video,
  rows: { name: string; time: string; space: string; kind?: ChapterKind }[],
  sayTable: string,
  signal: string[],
  saySignal: string,
) {
  v.chapter('recap', 'Recap');
  v.clear().layout('row');
  const t = v.table('cmp', ['Approach', 'Time', 'Space'], rows.map((r) => [r.name, r.time, r.space]));
  rows.forEach((r, i) => {
    if (r.kind === 'optimal' || (!r.kind && i === rows.length - 1)) t.tone(i, 'ok');
  });
  v.say(sayTable);
  v.text('signal', { title: 'Remember', lines: signal });
  v.say(saySignal);
  v.layout('col');
}

/** Concept-video helpers. */
export function bullets(v: Video, id: string, title: string, lines: string[], says: string[], opts: { subtitle?: string; mono?: boolean } = {}) {
  const t = v.text(id, { title, subtitle: opts.subtitle, lines, shown: 0, mono: opts.mono });
  says.forEach((s, i) => {
    t.show(Math.min(i + 1, lines.length));
    v.say(s);
  });
  return t;
}

export const fmtArr = (a: unknown[]) => `[${a.map((x) => (typeof x === 'string' ? `"${x}"` : String(x))).join(', ')}]`;
