import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';
import { dsuViz } from '../../dsuviz';

const E = [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]];
const POS: Record<number, [number, number]> = { 1: [20, 70], 2: [20, 18], 3: [62, 18], 4: [62, 70], 5: [90, 95] };

function redundant(edges: number[][]) {
  const p = Array.from({ length: edges.length + 1 }, (_, i) => i);
  const f = (x: number): number => (p[x] === x ? x : (p[x] = f(p[x])));
  for (const [a, b] of edges) {
    if (f(a) === f(b)) return [a, b];
    p[f(a)] = f(b);
  }
  return [];
}

function video() {
  const v = new Video('redundant-connection', 'Redundant Connection');
  const n = E.length;
  const nodes = Object.entries(POS).map(([k, [x, y]]) => ({ id: k, label: k, x, y }));
  const es = E.map(([a, b]) => ({ a: String(a), b: String(b) }));
  const ans = redundant(E);

  v.chapter('intro', 'The problem');
  const g = v.graph('g', nodes, es, { label: `edges: ${E.map((e) => `[${e}]`).join(' ')}` });
  v.say('We started with a tree on n nodes and someone added one extra edge. Now there is exactly one cycle. Return the edge we can remove to get a tree back. If several would work, return the one that appears last in the input.');
  E.forEach(([a, b]) => { if (a === 1 && b === 4 || [[1, 2], [2, 3], [3, 4]].some(([x, y]) => x === a && y === b)) g.edge(String(a), String(b), 'warn'); });
  v.eq('cycle 1–2–3–4–1: removing any of its edges leaves a tree', 'warn').say('Here the cycle is one, two, three, four. Removing any of those four edges works, and the last one in the input is the edge from one to four.');
  g.clearTones();

  v.chapter('brute', 'Brute force: DFS before adding each edge', { cx: 'O(n²)', code: ['graph = empty', 'for (u, v) in edges:', '  if dfs finds a path u → v in graph: return [u, v]', '  add edge u – v'] });
  v.clear();
  const gb = v.graph('g', nodes, es, { label: 'add the edges one at a time' });
  E.forEach(([a, b]) => gb.edge(String(a), String(b), 'dim'));
  v.say('Add edges one at a time. The first edge whose two ends are already connected is the one that closes the cycle. And since it is the first to close the only cycle, it is also the last cycle edge in the input.');
  const adj: Record<number, number[]> = {};
  for (const [a, b] of E) {
    const reach = (() => {
      const seen = new Set([a]);
      const st = [a];
      while (st.length) { const x = st.pop()!; for (const y of adj[x] ?? []) if (!seen.has(y)) { seen.add(y); st.push(y); } }
      return seen.has(b);
    })();
    gb.clearTones(['dim', 'done']).tone(String(a), 'active').tone(String(b), 'active');
    if (reach) {
      gb.edge(String(a), String(b), 'bad');
      v.line(2).eq(`[${a}, ${b}]: ${a} already reaches ${b} → redundant`, 'bad').say(`Before adding one to four, a DFS from one already reaches four, through two and three. So this edge is redundant.`);
      break;
    }
    (adj[a] ??= []).push(b);
    (adj[b] ??= []).push(a);
    gb.edge(String(a), String(b), 'done');
    v.line(2, 3).eq(`[${a}, ${b}]: no path yet → add it`).hold(700);
  }
  v.eq('one DFS per edge, each O(n) → O(n²)', 'warn').say('Each check is a full DFS, so n edges cost O of n squared. Fine for small inputs, but union find answers “are they already connected?” almost instantly.');

  v.chapter('optimal', 'Optimal: Union-Find', { cx: 'O(n · α(n))', code: ['for (u, v) in edges:', '  if find(u) == find(v): return [u, v]', '  union(u, v)'] });
  v.clear().layout('row');
  const go = v.graph('g', nodes, es, { label: 'edges' });
  E.forEach(([a, b]) => go.edge(String(a), String(b), 'dim'));
  const D = dsuViz(v, n, { labels: Array.from({ length: n }, (_, i) => i + 1), arr: false, label: 'union-find forest' });
  v.say('Same scan, but ask union find instead of running a DFS. If both ends already have the same root, the edge closes a cycle.');
  for (const [a, b] of E) {
    const ra = D.find(a - 1);
    const rb = D.find(b - 1);
    go.clearTones(['dim', 'done']).tone(String(a), 'active').tone(String(b), 'active');
    D.showPath(a - 1);
    D.showPath(b - 1, true);
    if (ra === rb) {
      go.edge(String(a), String(b), 'bad');
      v.line(1).eq(`find(${a}) = find(${b}) = ${ra + 1} → return [${a}, ${b}]`, 'bad').say(`Edge one, four: find one and find four both give ${ra + 1}. Same group already, so this edge is redundant. Return one, four.`);
      break;
    }
    D.union(a - 1, b - 1);
    go.edge(String(a), String(b), 'done');
    v.line(2).eq(`[${a}, ${b}]: roots ${ra + 1} ≠ ${rb + 1} → union`).hold(750);
  }
  v.answer(ans);
  v.eq('n edges × O(α(n)) each', 'ok').say('Each edge costs one find and one union, which is practically constant. Linear time overall.');

  recap(v, [
    { name: 'DFS before each edge', time: 'O(n²)', space: 'O(n)' },
    { name: 'Union-Find', time: 'O(n · α(n))', space: 'O(n)' },
  ], 'An edge whose ends already share a root closes a cycle.', ['Adding edges and asking “already connected?” → union-find', 'union() returning false = cycle'], 'Union-find detects the first edge that closes a cycle in almost constant time per edge.');
  return v.build();
}

const problem: Problem = {
  slug: 'redundant-connection',
  statement: 'A tree with `n` nodes labelled `1…n` had one extra edge added. The result is given as `edges` (length `n`). Return an edge that can be removed so the graph becomes a tree again. If there are multiple answers, return the one that occurs **last** in the input.',
  examples: [
    { input: 'edges = [[1,2],[1,3],[2,3]]', output: '[2,3]' },
    { input: 'edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]', output: '[1,4]' },
  ],
  constraints: ['3 ≤ n ≤ 1000', 'no repeated edges', 'the graph is connected'],
  hints: ['Add the edges one by one. When does an edge create a cycle?', 'You need a fast “are u and v already connected?”'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'DFS before each edge', idea: 'Before adding edge (u, v), run a DFS to see if u already reaches v. The first such edge is the answer.', time: 'O(n²)', space: 'O(n)', bottleneck: 'A full DFS for every edge.' },
    { id: 'optimal', kind: 'optimal', name: 'Union-Find', idea: 'Process edges in order; if `find(u) == find(v)` return the edge, otherwise union them.', time: 'O(n · α(n))', space: 'O(n)' },
  ],
  pitfalls: ['Why the first cycle-closing edge is the last one in the input: there is exactly one cycle, and the scan stops at the cycle edge that appears latest.', 'Nodes are 1-indexed: size the parent array n + 1.'],
  takeaway: '`union` returning false (same root) means the edge **closes a cycle**.',
  video,
  videoArgs: [E],
  judge: {
    type: 'fn', fn: 'findRedundantConnection', params: ['int[][]'], ret: 'int[]',
    tests: [
      { args: [[[1, 2], [1, 3], [2, 3]]], out: [2, 3] },
      { args: [[[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]], out: [1, 4] },
    ],
    gen: (r: Rng) => {
      const n = r.int(3, 9);
      const edges: number[][] = [];
      for (let v2 = 2; v2 <= n; v2++) edges.push([r.int(1, v2 - 1), v2]);
      const has = (a: number, b: number) => edges.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
      let a = 0, b = 0;
      do { a = r.int(1, n); b = r.int(1, n); } while (a === b || has(a, b));
      edges.push([Math.min(a, b), Math.max(a, b)]);
      return [r.shuffle(edges).map(([x, y]) => (x < y ? [x, y] : [y, x]))];
    },
    ref: (e: number[][]) => redundant(e),
  },
};

export default problem;
