import type { Video, ArrayH, GridH } from '../engine/builder';
import { decisionTree } from './btviz';

/**
 * Grow a recursion tree call by call. Repeated subproblems turn amber; with `memo`, a repeat is
 * answered from the cache (green) and not expanded. Returns the number of calls made.
 */
export function callTree<S>(
  v: Video,
  id: string,
  label: string,
  root: S,
  o: {
    kids: (s: S) => S[];
    key: (s: S) => string;
    text: (s: S) => string;
    memo?: boolean;
    /** narration for a call (return undefined to just hold) */
    say?: (s: S, info: { repeat: boolean; cached: boolean; calls: number; depth: number }) => string | undefined;
    hold?: number;
    lines?: { call?: number[]; cached?: number[]; base?: number[] };
    eq?: (s: S, info: { repeat: boolean; cached: boolean; calls: number }) => string;
  },
) {
  const T = decisionTree(v, id, label);
  const seen = new Set<string>();
  const done = new Set<string>();
  let calls = 0;
  const said = new Set<string>();
  const go = (s: S) => {
    calls++;
    const k = o.key(s);
    const repeat = seen.has(k);
    const cached = !!o.memo && done.has(k);
    const nid = T.enter(o.text(s));
    if (cached) T.mark(nid, 'ok');
    else if (repeat) T.mark(nid, 'warn');
    seen.add(k);
    const kids = cached ? [] : o.kids(s);
    const info = { repeat, cached, calls, depth: T.depth };
    if (o.lines) v.line(...((cached ? o.lines.cached : kids.length ? o.lines.call : o.lines.base) ?? o.lines.call ?? []));
    v.counter(`calls: ${calls}`);
    if (o.eq) v.eq(o.eq(s, info), cached ? 'ok' : repeat ? 'warn' : undefined);
    const text = o.say?.(s, info);
    if (text && !said.has(text)) { said.add(text); v.say(text); }
    else v.hold(o.hold ?? 380);
    for (const c of kids) go(c);
    done.add(k);
    T.leave();
  };
  go(root);
  return { calls, T };
}

/**
 * Fill a 1D dp array left to right. For each i: dependencies glow blue, the new cell is written
 * and glows, and a caption or narration explains the transition.
 */
export function fill1D(
  v: Video,
  a: ArrayH,
  idx: number[],
  o: {
    deps: (i: number) => number[];
    val: (i: number) => number | string;
    eq: (i: number) => string;
    say?: (i: number) => string | undefined;
    line?: number[];
    hold?: number;
    ptr?: string;
    /** cells already filled before the loop (base cases) */
    base?: number[];
  },
) {
  const filled = [...(o.base ?? [])];
  for (const i of idx) {
    a.clearTones();
    filled.forEach((k) => a.tone(k, 'done'));
    filled.push(i);
    o.deps(i).forEach((d) => a.tone(d, 'cmp'));
    a.set(i, o.val(i)).tone(i, 'active');
    if (o.ptr) a.ptr(o.ptr, i);
    if (o.line) v.line(...o.line);
    v.eq(o.eq(i));
    const s = o.say?.(i);
    if (s) v.say(s);
    else v.hold(o.hold ?? 650);
  }
  a.clearTones();
  if (o.ptr) a.noPtr();
}

/**
 * Fill a 2D dp grid in the given cell order, drawing arrows from each dependency into the cell.
 */
export function fill2D(
  v: Video,
  g: GridH,
  cells: [number, number][],
  o: {
    deps: (r: number, c: number) => [number, number][];
    val: (r: number, c: number) => number | string;
    eq: (r: number, c: number) => string;
    say?: (r: number, c: number) => string | undefined;
    line?: number[] | ((r: number, c: number) => number[]);
    hold?: number;
    /** tone for the new cell (default active) */
    tone?: (r: number, c: number) => 'active' | 'ok' | 'bad' | 'warn';
    arrows?: boolean;
  },
) {
  const filled: [number, number][] = [];
  for (const [r, c] of cells) {
    g.clearTones().noArrows();
    filled.forEach(([a, b]) => g.tone(a, b, 'done'));
    const ds = o.deps(r, c);
    ds.forEach(([a, b]) => { g.tone(a, b, 'cmp'); if (o.arrows !== false) g.arrow([a, b], [r, c], 'cmp'); });
    g.set(r, c, o.val(r, c)).tone(r, c, o.tone?.(r, c) ?? 'active');
    if (o.line) v.line(...(typeof o.line === 'function' ? o.line(r, c) : o.line));
    v.eq(o.eq(r, c));
    const s = o.say?.(r, c);
    if (s) v.say(s);
    else v.hold(o.hold ?? 450);
    filled.push([r, c]);
  }
  g.clearTones().noArrows();
}
