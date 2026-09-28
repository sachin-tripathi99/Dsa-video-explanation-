import type { Video, ArrayH } from '../engine/builder';
import { words } from './helpers';

/** lps[i] = length of the longest proper prefix of p[0..i] that is also a suffix of it. */
export function lpsOf(p: string) {
  const out = Array(p.length).fill(0);
  let len = 0;
  for (let i = 1; i < p.length; ) {
    if (p[i] === p[len]) out[i++] = ++len;
    else if (len) len = out[len - 1];
    else out[i++] = 0;
  }
  return out;
}

const q = (c: string) => (c === '#' ? 'the separator' : `“${c}”`);

export interface LpsEvent { kind: 'match' | 'fall' | 'zero'; i: number; len: number; from: number; first: boolean }

/**
 * Build the lps table cell by cell under the pattern. Pointers `len` and `i` show the two
 * characters compared; the current border (prefix and matching suffix) is shaded.
 */
export function lpsViz(
  v: Video,
  a: ArrayH,
  p: string,
  o: {
    lines?: { match?: number[]; fall?: number[]; zero?: number[] };
    say?: (e: LpsEvent) => string | undefined;
    hold?: number;
    /** array name in captions (default p) */
    name?: string;
  } = {},
) {
  const x = o.name ?? 'p';
  const L: (number | null)[] = Array(p.length).fill(null);
  L[0] = 0;
  const seen = new Set<string>();
  const out = Array(p.length).fill(0);
  let len = 0;
  const show = (i: number, cur: number, hit: boolean) => {
    a.clearTones();
    if (cur) { a.toneRange(0, cur - 1, 'win'); a.toneRange(i - cur, i - 1, 'win'); }
    a.tone([i, cur], hit ? 'ok' : 'bad');
    a.ptrs({ len: cur, i });
    a.subs(L.map((x) => (x === null ? '' : x)));
  };
  for (let i = 1; i < p.length; ) {
    const from = len;
    let e: LpsEvent;
    if (p[i] === p[len]) {
      L[i] = out[i] = len + 1;
      show(i, len, true);
      v.line(...(o.lines?.match ?? [])).eq(`${x}[${i}] = ${x}[${len}] = ${p[i]} → lps[${i}] = ${len + 1}`, 'ok');
      e = { kind: 'match', i, len: len + 1, from, first: !seen.has('match') };
      len++; i++;
    } else if (len) {
      show(i, len, false);
      len = out[len - 1];
      v.line(...(o.lines?.fall ?? [])).eq(`${x}[${i}] = ${p[i]} ≠ ${x}[${from}] = ${p[from]} → len = lps[${from - 1}] = ${len}`, 'bad');
      e = { kind: 'fall', i, len, from, first: !seen.has('fall') };
    } else {
      L[i] = out[i] = 0;
      show(i, 0, false);
      v.line(...(o.lines?.zero ?? [])).eq(`${x}[${i}] = ${p[i]} ≠ ${x}[0] = ${p[0]}, len = 0 → lps[${i}] = 0`, 'bad');
      e = { kind: 'zero', i, len: 0, from, first: !seen.has('zero') };
      i++;
    }
    seen.add(e.kind);
    const custom = o.say?.(e);
    const text = custom ?? (e.first ? defaultSay(p, e) : undefined);
    if (text) v.say(text);
    else v.hold(o.hold ?? 750);
  }
  a.clearTones().noPtr();
  a.subs(out);
  return out as number[];
}

function defaultSay(p: string, e: LpsEvent) {
  if (e.kind === 'match') return `${q(p[e.i])} at position ${words(e.i)} matches the character right after the current border, so prefix and suffix both grow by one: lps of ${words(e.i)} is ${words(e.len)}.`;
  if (e.kind === 'fall') return `Mismatch: ${q(p[e.i])} cannot extend the border of length ${words(e.from)}. But the border of that border, lps of ${words(e.from - 1)}, is also a suffix ending here. So fall back to length ${words(e.len)} and compare again, without moving i.`;
  return `Mismatch with nothing left to fall back to: no border ends at position ${words(e.i)}, so lps of ${words(e.i)} is zero.`;
}

export interface ScanEvent { kind: 'match' | 'fall' | 'skip' | 'found'; i: number; j: number; from: number; first: boolean }

/**
 * KMP search: the text pointer i only moves forward; on a mismatch j falls back through lps.
 * `pa` is a second array, as wide as the text, showing the pattern aligned under it.
 */
export function kmpScanViz(
  v: Video,
  t: ArrayH,
  pa: ArrayH,
  T: string,
  P: string,
  L: number[],
  o: {
    lines?: { fall?: number[]; match?: number[]; skip?: number[]; found?: number[] };
    say?: (e: ScanEvent) => string | undefined;
    hold?: number;
    vars?: { set(x: Record<string, string | number>): unknown };
    /** keep searching after a match (default: stop at the first) */
    all?: boolean;
  } = {},
) {
  const seen = new Set<string>();
  const found: number[] = [];
  let j = 0;
  let steps = 0;
  const show = (s: number, okTo: number, at: number, tone: 'ok' | 'bad' | 'cmp') => {
    pa.setAll(Array.from({ length: T.length }, (_, k) => (k >= s && k < s + P.length ? P[k - s] : null)));
    t.clearTones();
    pa.clearTones();
    found.forEach((f) => t.toneRange(f, f + P.length - 1, 'done'));
    if (okTo >= s) { t.toneRange(s, okTo, 'ok'); pa.toneRange(s, okTo, 'ok'); }
    if (at >= 0 && at < T.length) { t.tone(at, tone); pa.tone(at, tone); }
    t.ptr('i', Math.min(at, T.length - 1));
  };
  const emit = (e: ScanEvent, eq: string, tone: 'ok' | 'bad' | undefined, line?: number[]) => {
    steps++;
    v.line(...(line ?? [])).counter(`steps: ${steps}`).eq(eq, tone);
    o.vars?.set({ i: e.i, j: e.j });
    seen.add(e.kind);
    const text = o.say?.(e);
    if (text) v.say(text);
    else v.hold(o.hold ?? 520);
  };
  for (let i = 0; i < T.length; i++) {
    while (j > 0 && T[i] !== P[j]) {
      const from = j;
      j = L[j - 1];
      show(i - j, i - 1, i, 'bad');
      emit({ kind: 'fall', i, j, from, first: !seen.has('fall') }, `T[${i}] = ${T[i]} ≠ P[${from}] = ${P[from]} → j = lps[${from - 1}] = ${j}`, 'bad', o.lines?.fall);
    }
    if (T[i] === P[j]) {
      j++;
      show(i + 1 - j, i, i, 'ok');
      emit({ kind: 'match', i, j, from: j - 1, first: !seen.has('match') }, `T[${i}] = P[${j - 1}] = ${T[i]} → j = ${j}`, 'ok', o.lines?.match);
    } else {
      show(i, i - 1, i, 'bad');
      emit({ kind: 'skip', i, j: 0, from: 0, first: !seen.has('skip') }, `T[${i}] = ${T[i]} ≠ P[0] → move on`, 'bad', o.lines?.skip);
    }
    if (j === P.length) {
      const s = i - P.length + 1;
      found.push(s);
      emit({ kind: 'found', i, j, from: j, first: !seen.has('found') }, `j = m → match at ${s}`, 'ok', o.lines?.found);
      if (!o.all) break;
      j = L[j - 1];
    }
  }
  t.noPtr();
  return { found, steps };
}
