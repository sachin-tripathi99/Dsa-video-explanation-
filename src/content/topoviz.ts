import type { Video, GraphH } from '../engine/builder';
import type { GraphNodeView } from '../engine/types';
import { words } from './helpers';

/**
 * Left-to-right layered positions for a directed graph (edge a → b means a comes first).
 * Column = longest chain of prerequisites; nodes stuck on a cycle share one last column.
 */
export function layered(
  n: number,
  edges: [number, number][],
  opts: { id?: (i: number) => string; label?: (i: number) => string; sub?: (i: number) => string | undefined; flip?: boolean } = {},
): GraphNodeView[] {
  const id = opts.id ?? String;
  const label = opts.label ?? String;
  const adj = Array.from({ length: n }, () => [] as number[]);
  const indeg = Array(n).fill(0);
  for (const [a, b] of edges) { adj[a].push(b); indeg[b]++; }
  const layer = Array(n).fill(0);
  const order = [...Array(n).keys()].filter((i) => indeg[i] === 0);
  for (let k = 0; k < order.length; k++) for (const y of adj[order[k]]) { layer[y] = Math.max(layer[y], layer[order[k]] + 1); if (--indeg[y] === 0) order.push(y); }
  const placed = new Set(order);
  const top = Math.max(0, ...order.map((i) => layer[i]));
  for (let i = 0; i < n; i++) if (!placed.has(i)) layer[i] = top + 1;
  const cols = Math.max(...layer) + 1;
  const colX = (c: number) => (cols === 1 ? 50 : 6 + (88 * c) / (cols - 1));
  const byCol: number[][] = Array.from({ length: cols }, () => []);
  for (let i = 0; i < n; i++) if (placed.has(i)) byCol[layer[i]].push(i);
  const out: GraphNodeView[] = [];
  const put = (i: number, x: number, y: number) => out.push({ id: id(i), label: label(i), x: opts.flip ? 100 - x : x, y, sub: opts.sub?.(i) });
  byCol.forEach((ids, c) => ids.forEach((i, k) => put(i, colX(c), ids.length === 1 ? 50 : 8 + (84 * k) / (ids.length - 1))));
  // nodes on a cycle sit on a small ring so every arrow between them stays visible
  const ring = [...Array(n).keys()].filter((i) => !placed.has(i));
  const cx = Math.min(84, Math.max(16, colX(top + 1)));
  ring.forEach((i, j) => {
    const a = -Math.PI / 2 + (2 * Math.PI * j) / ring.length;
    put(i, ring.length === 1 ? cx : cx + 13 * Math.cos(a), ring.length === 1 ? 50 : 50 + 36 * Math.sin(a));
  });
  return out;
}

/** "a", "a and b", "a, b and c" */
export const andList = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

export interface KahnOpts {
  id?: (i: number) => string;
  name?: (i: number) => string;
  /** code lines for: seeding the queue, popping, relaxing an edge, the final check */
  lines: { init: number[]; pop: number[]; done: number[] };
  /** badge text for a remaining count */
  badge?: (d: number) => string;
  /** the count being peeled, spoken: "prerequisite(s)" */
  unit?: [string, string];
  /** the drawn arrow for a relaxation x → y (defaults to x → y) */
  arrow?: (x: number, y: number) => [number, number];
  /** show a badge on nodes that start with count 0 (default true) */
  zeroBadge?: boolean;
  /** nodes that start in the queue (default: every node with count 0) */
  seed?: number[];
  queueLabel?: string;
  queueName?: string;
  orderLabel?: string;
  /** called after x is popped and its neighbours relaxed, before the frame; may return extra narration */
  afterPop?: (x: number, freed: number[]) => string | void;
  leafEq?: string;
  leafSay?: string;
  /** first sentence when x is popped */
  popSay?: (x: number) => string;
  /** opening narration for the seeding frame */
  sayInit?: string;
  /** narrate every pop (default) or only the first two */
  narrate?: 'all' | 'first';
  finalEq?: (order: number[], stuck: number[]) => string;
  /** leftover nodes are expected (not a failure): colour the final line green */
  finalOk?: boolean;
  /** text for the order row of the final frame */
  finalSay?: (order: number[], stuck: number[]) => string;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Kahn's algorithm, animated on an existing graph panel: remaining-count badges, a queue of
 * ready nodes and the growing order. Returns the order (shorter than n when there is a cycle).
 */
export function kahnViz(v: Video, g: GraphH, n: number, adj: number[][], o: KahnOpts): { order: number[]; stuck: number[] } {
  const id = o.id ?? String;
  const name = o.name ?? String;
  const badge = o.badge ?? ((d: number) => `in ${d}`);
  const [one, many] = o.unit ?? ['prerequisite', 'prerequisites'];
  const arrow = o.arrow ?? ((x: number, y: number) => [x, y] as [number, number]);
  const deg = Array(n).fill(0);
  for (let x = 0; x < n; x++) for (const y of adj[x]) deg[y]++;
  const kv = v.vars('kv', {}, { label: o.queueLabel });
  const Q: number[] = [];
  const order: number[] = [];
  const show = () => kv.set({ [o.queueName ?? 'queue']: `[${Q.map(name).join(', ')}]`, [o.orderLabel ?? 'order']: order.length ? order.map(name).join(' → ') : '—' });
  for (let i = 0; i < n; i++) if (deg[i] || o.zeroBadge !== false) g.badge(id(i), badge(deg[i]));
  for (const i of o.seed ?? [...Array(n).keys()].filter((i) => deg[i] === 0)) { Q.push(i); g.tone(id(i), 'active'); }
  show();
  v.line(...o.lines.init).eq(`ready at the start: ${Q.map(name).join(', ') || 'none'}`);
  v.say(o.sayInit ?? `Write each node’s number of ${many} on it. ${Q.length === 1 ? `Only ${name(Q[0])} has none, so it is ready now and goes in the queue.` : `${cap(andList(Q.map(name)))} have none, so they are ready and go in the queue.`}`);
  let pops = 0;
  while (Q.length) {
    const x = Q.shift()!;
    order.push(x);
    g.tone(id(x), 'ok').badge(id(x), null);
    const freed: number[] = [];
    const waiting: number[] = [];
    for (const y of adj[x]) {
      deg[y]--;
      const [a, b] = arrow(x, y);
      g.edge(id(a), id(b), 'dim');
      g.badge(id(y), badge(deg[y]));
      if (deg[y] === 0) { freed.push(y); Q.push(y); g.tone(id(y), 'active'); } else waiting.push(y);
    }
    show();
    const extra = o.afterPop?.(x, freed);
    v.line(...o.lines.pop).counter(`placed ${order.length}/${n}`).eq(`take ${name(x)}${adj[x].length ? ` → ${adj[x].map((y) => `${name(y)}:${deg[y]}`).join(' ')}` : ` (${o.leafEq ?? 'no arrows out'})`}${freed.length ? ` · ready: ${freed.map(name).join(', ')}` : ''}`);
    pops++;
    if (o.narrate !== 'first' || pops <= 2) {
      const parts = [o.popSay ? o.popSay(x) : `Take ${name(x)} from the queue and place it next.`];
      if (!adj[x].length) parts.push(o.leafSay ?? 'Nothing depends on it.');
      else {
        if (freed.length) parts.push(`${cap(andList(freed.map(name)))} ${freed.length === 1 ? 'was' : 'were'} waiting only on it, so ${freed.length === 1 ? 'it drops' : 'they drop'} to zero and ${freed.length === 1 ? 'joins' : 'join'} the queue.`);
        if (waiting.length) {
          const byDeg = new Map<number, number[]>();
          waiting.forEach((y) => byDeg.set(deg[y], [...(byDeg.get(deg[y]) ?? []), y]));
          parts.push([...byDeg].map(([d, ys]) => `${cap(andList(ys.map(name)))} ${ys.length > 1 ? 'each still wait' : 'still waits'} on ${words(d)} more ${d === 1 ? one : many}.`).join(' '));
        }
      }
      if (extra) parts.push(extra);
      v.say(parts.join(' '));
    } else v.hold(800);
  }
  const done = new Set(order);
  const stuck = [...Array(n).keys()].filter((i) => !done.has(i));
  stuck.forEach((i) => g.tone(id(i), 'bad'));
  v.line(...o.lines.done).eq(o.finalEq?.(order, stuck) ?? (stuck.length ? `queue empty, ${stuck.length} never ready → cycle` : `all ${n} placed`), stuck.length && !o.finalOk ? 'bad' : 'ok');
  v.say(o.finalSay?.(order, stuck) ?? (stuck.length
    ? `The queue is empty but ${andList(stuck.map(name))} never reached zero. They wait on each other around a cycle, so no valid order exists.`
    : `The queue is empty and all ${words(n)} nodes are placed. Every node and every arrow was handled once: O(V + E).`));
  return { order, stuck };
}
