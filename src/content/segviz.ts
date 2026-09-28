import type { Video, TreeH, ArrayH } from '../engine/builder';
import { words } from './helpers';

/** A sum segment tree drawn as a binary tree: node k has children 2k and 2k + 1, badge = its range. */
export interface Seg { t: TreeH; n: number; sum: number[]; range: Record<number, [number, number]>; nid: (k: number) => string }

const rng = (lo: number, hi: number) => (lo === hi ? `[${lo}]` : `[${lo}..${hi}]`);

export function segTree(
  v: Video,
  id: string,
  a: number[],
  o: {
    label?: string;
    /** animate the build bottom-up (otherwise values appear at once) */
    animate?: boolean;
    line?: number[];
    say?: (k: number, lo: number, hi: number, val: number, leaf: boolean) => string | undefined;
    hold?: number;
  } = {},
): Seg {
  const t = v.tree(id, { label: o.label ?? 'segment tree (badge = range)', binary: true });
  const nid = (k: number) => `${id}${k}`;
  const sum: number[] = [];
  const range: Record<number, [number, number]> = {};
  const make = (k: number, lo: number, hi: number, parent: string | null, side?: 0 | 1) => {
    t.add(parent, o.animate ? '?' : 0, side, nid(k));
    t.badge(nid(k), rng(lo, hi));
    range[k] = [lo, hi];
    if (lo === hi) { sum[k] = a[lo]; return; }
    const mid = (lo + hi) >> 1;
    make(2 * k, lo, mid, nid(k), 0);
    make(2 * k + 1, mid + 1, hi, nid(k), 1);
    sum[k] = sum[2 * k] + sum[2 * k + 1];
  };
  make(1, 0, a.length - 1, null);
  if (!o.animate) {
    for (const k of Object.keys(range)) t.setVal(nid(+k), sum[+k]);
    return { t, n: a.length, sum, range, nid };
  }
  const fill = (k: number) => {
    const [lo, hi] = range[k];
    if (lo !== hi) { fill(2 * k); fill(2 * k + 1); }
    t.clearTones();
    t.setVal(nid(k), sum[k]).tone(nid(k), 'active');
    if (lo !== hi) t.tone([nid(2 * k), nid(2 * k + 1)], 'cmp');
    if (o.line) v.line(...o.line);
    v.eq(lo === hi ? `leaf ${rng(lo, hi)} = a[${lo}] = ${sum[k]}` : `${rng(lo, hi)} = ${sum[2 * k]} + ${sum[2 * k + 1]} = ${sum[k]}`);
    const s = o.say?.(k, lo, hi, sum[k], lo === hi);
    if (s) v.say(s);
    else v.hold(o.hold ?? 420);
  };
  fill(1);
  t.clearTones();
  return { t, n: a.length, sum, range, nid };
}

export type SegCase = 'inside' | 'outside' | 'split';

/** Range-sum query, one frame per visited node: fully inside (green, taken), outside (dim), partial (split). */
export function segQuery(
  v: Video,
  S: Seg,
  l: number,
  r: number,
  o: {
    arr?: ArrayH;
    lines?: { inside?: number[]; outside?: number[]; split?: number[] };
    say?: (c: SegCase, lo: number, hi: number, val: number, first: boolean) => string | undefined;
    hold?: number;
  } = {},
) {
  const { t, sum, range, nid } = S;
  t.clearTones();
  o.arr?.clearTones().win(l, r, 'win', `[${l}..${r}]`);
  const seen = new Set<SegCase>();
  let total = 0;
  const parts: number[] = [];
  const go = (k: number) => {
    const [lo, hi] = range[k];
    const c: SegCase = hi < l || lo > r ? 'outside' : l <= lo && hi <= r ? 'inside' : 'split';
    t.tone(nid(k), c === 'inside' ? 'ok' : c === 'outside' ? 'dim' : 'path');
    if (c === 'inside') { total += sum[k]; parts.push(sum[k]); o.arr?.toneRange(lo, hi, 'ok'); }
    v.line(...(o.lines?.[c] ?? []));
    v.eq(c === 'inside' ? `${rng(lo, hi)} inside [${l}..${r}] → take ${sum[k]} (total ${total})` : c === 'outside' ? `${rng(lo, hi)} outside → 0` : `${rng(lo, hi)} overlaps partly → ask both children`, c === 'inside' ? 'ok' : undefined);
    const s = o.say?.(c, lo, hi, sum[k], !seen.has(c));
    seen.add(c);
    if (s) v.say(s);
    else v.hold(o.hold ?? 650);
    if (c === 'split') { go(2 * k); go(2 * k + 1); }
  };
  go(1);
  return { total, parts };
}

/** Point assignment a[i] = val: walk down to the leaf, then fix every sum on the way back up. */
export function segUpdate(
  v: Video,
  S: Seg,
  i: number,
  val: number,
  o: { arr?: ArrayH; lines?: { down?: number[]; up?: number[] }; say?: (lo: number, hi: number, val: number, leaf: boolean) => string | undefined; hold?: number } = {},
) {
  const { t, sum, range, nid } = S;
  t.clearTones();
  const path: number[] = [];
  let k = 1;
  for (;;) {
    path.push(k);
    const [lo, hi] = range[k];
    if (lo === hi) break;
    k = i <= (lo + hi) >> 1 ? 2 * k : 2 * k + 1;
  }
  t.tone(path.map(nid), 'path');
  v.line(...(o.lines?.down ?? [])).eq(`walk down to the leaf for index ${i}: ${path.map((x) => rng(...range[x])).join(' → ')}`);
  const s0 = o.say?.(-1, -1, 0, false);
  if (s0) v.say(s0); else v.hold(o.hold ?? 800);
  for (let p = path.length - 1; p >= 0; p--) {
    const x = path[p];
    const [lo, hi] = range[x];
    const old = sum[x];
    if (lo === hi) { sum[x] = val; o.arr?.set(i, val).clearTones().tone(i, 'active'); }
    else sum[x] = sum[2 * x] + sum[2 * x + 1];
    t.setVal(nid(x), sum[x]).tone(nid(x), 'ok');
    v.line(...(o.lines?.up ?? [])).eq(lo === hi ? `leaf ${rng(lo, hi)}: ${old} → ${val}` : `${rng(lo, hi)} = ${sum[2 * x]} + ${sum[2 * x + 1]} = ${sum[x]} (was ${old})`, 'ok');
    const s = o.say?.(lo, hi, sum[x], lo === hi);
    if (s) v.say(s); else v.hold(o.hold ?? 650);
  }
  return path.length;
}

/* ---------------- Fenwick (binary indexed) tree ---------------- */

export const lowbit = (i: number) => i & -i;

/** Covered ranges shown under each cell; cell p shows tree[p + 1]. */
export const fenSubs = (n: number) => Array.from({ length: n }, (_, p) => { const i = p + 1, lo = i - lowbit(i) + 1; return lo === i ? `${i}` : `${lo}–${i}`; });

/** prefix(i) = tree[i] + tree[i − lowbit(i)] + … ; highlights each visited cell. */
export function fenQuery(
  v: Video,
  f: ArrayH,
  tree: number[],
  i: number,
  o: { line?: number[]; say?: (visited: number[], total: number) => string | undefined; hold?: number; eqPrefix?: string } = {},
) {
  f.clearTones();
  const visited: number[] = [];
  let total = 0;
  for (let x = i; x > 0; x -= lowbit(x)) { visited.push(x); total += tree[x]; f.tone(x - 1, 'ok'); }
  if (o.line) v.line(...o.line);
  v.eq(`${o.eqPrefix ?? ''}prefix(${i}) = ${visited.length ? visited.map((x) => `t[${x}]`).join(' + ') : '0'} = ${total}`, 'ok');
  const s = o.say?.(visited, total);
  if (s) v.say(s); else v.hold(o.hold ?? 750);
  return total;
}

/** add(i, delta): tree[i] += delta, then i += lowbit(i) up to n. */
export function fenAdd(
  v: Video,
  f: ArrayH,
  tree: number[],
  i: number,
  delta: number,
  o: { line?: number[]; say?: (visited: number[]) => string | undefined; hold?: number; eqPrefix?: string } = {},
) {
  const n = tree.length - 1;
  f.clearTones();
  const visited: number[] = [];
  for (let x = i; x <= n; x += lowbit(x)) { visited.push(x); tree[x] += delta; f.set(x - 1, tree[x]).tone(x - 1, 'active'); }
  if (o.line) v.line(...o.line);
  v.eq(`${o.eqPrefix ?? ''}add(${i}, ${delta > 0 ? '+' : ''}${delta}) → ${visited.map((x) => `t[${x}]`).join(', ')}`);
  const s = o.say?.(visited);
  if (s) v.say(s); else v.hold(o.hold ?? 700);
  return visited;
}

export const listWords = (xs: number[]) => (xs.length === 1 ? words(xs[0]) : `${xs.slice(0, -1).map(words).join(', ')} and ${words(xs[xs.length - 1])}`);
