import type { ArrayH } from '../engine/builder';

/** Draw a binary-search state: cells outside [lo, hi] are greyed, pointers lo / mid / hi shown. */
export function bsShow(a: ArrayH, lo: number, hi: number, mid?: number, midTone: 'cmp' | 'ok' | 'bad' | 'active' = 'cmp') {
  a.clearTones();
  for (let i = 0; i < a.length; i++) if (i < lo || i > hi) a.tone(i, 'out');
  const ptrs: Record<string, number> = {};
  if (lo < a.length) ptrs.lo = lo;
  if (hi >= 0 && hi < a.length) ptrs.hi = hi;
  if (mid !== undefined) { ptrs.mid = mid; a.tone(mid, midTone); }
  a.noPtr().ptrs(ptrs);
  return a;
}

/**
 * Animate "first x in [lo, hi] with ok(x)" (or the last one, with last = true).
 * Shows a vars box and a growing table of the checks made; returns the answer.
 */
export function answerSearch(
  v: import('../engine/builder').Video,
  o: {
    lo: number;
    hi: number;
    check: (x: number) => { ok: boolean; info: string };
    name: string;
    last?: boolean;
    lines?: { ok: number[]; bad: number[] };
    firstSay?: (mid: number, ok: boolean, info: string) => string;
  },
) {
  let lo = o.lo;
  let hi = o.hi;
  const vars = v.vars('bs', { lo, hi });
  const tb = v.table('checks', [o.name, 'check', 'decision'], []);
  let k = 0;
  while (lo < hi) {
    const mid = o.last ? lo + Math.floor((hi - lo + 1) / 2) : lo + Math.floor((hi - lo) / 2);
    const { ok, info } = o.check(mid);
    let dec: string;
    if (o.last) dec = ok ? `works → lo = ${mid}` : `fails → hi = ${mid - 1}`;
    else dec = ok ? `works → hi = ${mid}` : `fails → lo = ${mid + 1}`;
    tb.addRow([String(mid), info, dec]).clearTones().tone(tb.p.rows.length - 1, ok ? 'ok' : 'bad');
    vars.set({ lo, mid, hi });
    if (o.lines) v.line(...(ok ? o.lines.ok : o.lines.bad));
    v.eq(`${o.name} = ${mid}: ${info} → ${dec}`, ok ? 'ok' : 'bad');
    if (k === 0 && o.firstSay) v.say(o.firstSay(mid, ok, info));
    else v.hold(900);
    k++;
    if (o.last) { if (ok) lo = mid; else hi = mid - 1; }
    else if (ok) hi = mid;
    else lo = mid + 1;
  }
  vars.set({ lo, hi, answer: lo });
  tb.clearTones();
  return lo;
}
