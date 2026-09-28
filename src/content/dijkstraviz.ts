import type { Video, GraphH, GridH } from '../engine/builder';

/** How Dijkstra's state is drawn: a graph panel or a grid panel both fit. */
export interface DjView {
  label(u: number, text: string | null): void;
  tone(u: number, t: 'active' | 'ok' | 'cmp' | 'none'): void;
  edge?(u: number, w: number, t: 'cmp' | 'path' | 'none'): void;
}

export const graphView = (g: GraphH, id: (u: number) => string = String): DjView => ({
  label: (u, t) => { g.badge(id(u), t); },
  tone: (u, t) => { g.tone(id(u), t); },
  edge: (u, w, t) => { g.edge(id(u), id(w), t); if (t === 'none') g.edge(id(w), id(u), 'none'); },
});

/** Grid cells are nodes r * C + c; the label replaces the cell text. */
export const gridView = (g: GridH, C: number, base: (r: number, c: number) => string | number): DjView => ({
  label: (u, t) => { const r = Math.floor(u / C), c = u % C; g.set(r, c, t === null ? base(r, c) : t); },
  tone: (u, t) => { g.tone(Math.floor(u / C), u % C, t); },
});

export interface DjOpts {
  name?: (u: number) => string;
  lines: { init: number[]; pop: number[]; relax: number[]; done: number[] };
  /** path cost through an edge (default d + w) */
  combine?: (d: number, w: number) => number;
  /** is a strictly better than b (default a < b) */
  better?: (a: number, b: number) => boolean;
  start?: number;
  worst?: number;
  fmt?: (d: number) => string;
  heapLabel?: string;
  /** how many pops get full narration (the rest just hold) */
  narrate?: number;
  /** stop as soon as this node is settled */
  target?: number;
  /** spoken word for the heap top: "cheapest", "most likely", ... */
  best?: string;
  /** spoken name of the quantity: "distance", "effort", ... */
  what?: string;
  /** extra sentence after the first pop */
  firstPopSay?: string;
  sayInit?: string;
  /** show relaxations that do not improve (default true) */
  showMisses?: boolean;
  /** heap entry text */
  entry?: (d: number, u: number) => string;
  /** heap panel width weight */
  heapWeight?: number;
}

/**
 * Dijkstra with a binary heap, drawn step by step: best-known labels, a min-heap of
 * (cost, node) entries, settled nodes in green, and stale heap entries skipped.
 */
export function dijkstraViz(v: Video, view: DjView, n: number, adj: [number, number][][], src: number, o: DjOpts) {
  const name = o.name ?? String;
  const combine = o.combine ?? ((d: number, w: number) => d + w);
  const better = o.better ?? ((a: number, b: number) => a < b);
  const worst = o.worst ?? Infinity;
  const fmt = o.fmt ?? ((d: number) => (d === Infinity ? '∞' : String(d)));
  const what = o.what ?? 'distance';
  const entry = o.entry ?? ((d: number, u: number) => `${fmt(d)}:${name(u)}`);
  const cost = new Map<string, number>();
  const h = v.heap('h', { label: o.heapLabel ?? 'min-heap (cost : node)', treeOnly: true, cmp: (a, b) => (better(cost.get(String(a))!, cost.get(String(b))!) ? -1 : better(cost.get(String(b))!, cost.get(String(a))!) ? 1 : String(a) < String(b) ? -1 : 1) });
  v.weight('h', o.heapWeight ?? 1);
  const dist = Array(n).fill(worst);
  const parent = Array(n).fill(-1);
  const done = Array(n).fill(false);
  const push = (d: number, u: number) => { const e = entry(d, u); cost.set(e, d); h.push(e); };
  dist[src] = o.start ?? 0;
  for (let u = 0; u < n; u++) view.label(u, fmt(dist[u]));
  push(dist[src], src);
  view.tone(src, 'active');
  v.line(...o.lines.init).eq(`${what}[${name(src)}] = ${fmt(dist[src])}, everything else ${fmt(worst)}`);
  v.say(o.sayInit ?? `Start with ${name(src)} at ${fmt(dist[src])} and everything else unknown, infinity. The heap holds candidates, cheapest on top.`);
  let pops = 0;
  const order: number[] = [];
  while (h.size) {
    const top = String(h.peek());
    const d = cost.get(top)!;
    const u = Number([...Array(n).keys()].find((x) => entry(d, x) === top));
    h.pop();
    if (done[u]) {
      v.line(...o.lines.pop).eq(`pop ${top}: ${name(u)} already settled → skip`, 'warn');
      if (pops <= (o.narrate ?? 3)) v.say(`The top entry is an old one for ${name(u)}: we already found a better ${what} there, so just discard it.`); else v.hold(700);
      continue;
    }
    done[u] = true;
    order.push(u);
    pops++;
    view.tone(u, 'ok');
    const full = pops <= (o.narrate ?? 3);
    v.line(...o.lines.pop).counter(`settled ${order.length}/${n}`).eq(`pop ${top} → ${name(u)} is final: ${fmt(d)}`, 'ok');
    if (full) v.say(`${pops === 1 ? `Pop the ${o.best ?? 'cheapest'} entry, ${name(u)} at ${fmt(d)}.` : `Pop ${name(u)} at ${fmt(d)}. It is the ${o.best ?? 'cheapest'} entry left in the heap, and any other route to it would have to pass through something no better, so ${fmt(d)} is final.`}${pops === 1 && o.firstPopSay ? ` ${o.firstPopSay}` : ''}`);
    else v.hold(600);
    if (u === o.target) break;
    const ups: string[] = [];
    const misses: string[] = [];
    for (const [w, c] of adj[u]) {
      if (done[w]) continue;
      const nd = combine(d, c);
      view.edge?.(u, w, 'cmp');
      if (better(nd, dist[w])) {
        if (parent[w] >= 0) view.edge?.(parent[w], w, 'none');
        const was = dist[w];
        dist[w] = nd;
        parent[w] = u;
        view.label(w, fmt(nd));
        view.tone(w, 'active');
        view.edge?.(u, w, 'path');
        push(nd, w);
        ups.push(`${name(w)}: ${fmt(nd)} beats ${fmt(was)}`);
      } else {
        view.edge?.(u, w, 'none');
        if (parent[w] >= 0) view.edge?.(parent[w], w, 'path');
        misses.push(`${name(w)}: ${fmt(nd)} is not better than ${fmt(dist[w])}`);
      }
    }
    if (!ups.length && !misses.length) continue;
    if (!ups.length && o.showMisses === false) continue;
    v.line(...o.lines.relax).eq(`relax from ${name(u)}: ${[...ups, ...misses].join(' · ')}`);
    if (full) v.say(`${ups.length ? `Relax ${name(u)}’s edges. ${ups.map((s) => { const [who, rest] = s.split(': '); return `${who} improves to ${rest.split(' beats ')[0]}`; }).join(', ')}, so ${ups.length === 1 ? 'it goes' : 'they go'} into the heap.` : `Relax ${name(u)}’s edges.`}${misses.length ? ` ${misses.map((s) => s.split(': ')[0]).join(' and ')} ${misses.length === 1 ? 'does' : 'do'} not improve.` : ''}`);
    else v.hold(700);
  }
  return { dist, parent, order, pops };
}
