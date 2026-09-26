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
