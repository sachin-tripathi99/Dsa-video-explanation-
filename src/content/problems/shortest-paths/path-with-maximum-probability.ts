import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';
import { dijkstraViz, graphView } from '../../dijkstraviz';

const N = 5, S = 0, E = 2;
const ED = [[0, 1], [1, 2], [0, 2], [0, 3], [3, 4], [4, 2], [1, 4]];
const P = [0.5, 0.5, 0.2, 0.9, 0.8, 0.6, 0.3];
const POS = [[8, 50], [45, 12], [92, 50], [35, 88], [65, 70]];
function best(n: number, edges: number[][], p: number[], s: number, e: number) {
  const d = Array(n).fill(0); d[s] = 1;
  for (let r = 1; r < n; r++) edges.forEach(([a, b], i) => { if (d[a] * p[i] > d[b]) d[b] = d[a] * p[i]; if (d[b] * p[i] > d[a]) d[a] = d[b] * p[i]; });
  return d[e];
}
const pf = (x: number) => (x === 0 ? '0' : x === 1 ? '1' : String(+x.toFixed(3)).replace(/^0\./, '.'));

function video() {
  const v = new Video('path-with-maximum-probability', 'Path with Maximum Probability');
  const nodes = POS.map(([x, y], i) => ({ id: String(i), label: String(i), x, y }));
  const edges = ED.map(([a, b], i) => ({ a: String(a), b: String(b), w: String(P[i]).replace(/^0\./, '.') }));
  const adj = Array.from({ length: N }, () => [] as [number, number][]);
  ED.forEach(([a, b], i) => { adj[a].push([b, P[i]]); adj[b].push([a, P[i]]); });
  const ans = best(N, ED, P, S, E);

  v.chapter('intro', 'The problem');
  const g0 = v.graph('g', nodes, edges, { label: 'edge = probability of crossing safely' });
  v.say(`Each edge succeeds with some probability, and a path succeeds only if every edge on it does, so its probability is the product. Find the most likely path from ${S} to ${E}.`);
  g0.edge('0', '2', 'bad');
  v.eq('direct 0 → 2: 0.2', 'bad').say('The direct edge only has point two.');
  g0.clearTones(); ['0>3', '3>4', '4>2'].forEach((k) => { const [a, b] = k.split('>'); g0.edge(a, b, 'ok'); });
  v.eq(`0 → 3 → 4 → 2: 0.9 × 0.8 × 0.6 = ${pf(ans)}`, 'ok').say('The long way round, point nine times point eight times point six, is point four three two. More edges, but each is very reliable.');

  v.chapter('brute', 'Brute force: Bellman-Ford style, relax every edge n − 1 times', { cx: 'O(V · E)', code: ['prob[start] = 1, others 0', 'repeat n − 1 times: for each edge (a, b, p):', '  prob[b] = max(prob[b], prob[a] · p), and the other direction'] });
  v.eq('n − 1 full passes over the edges', 'warn').say('Relaxing every edge n minus one times always works, but touches every edge in every pass.');

  v.chapter('optimal', 'Dijkstra with a max-heap and multiplication', { cx: 'O(E log V)', code: ['prob[start] = 1; max-heap = [(1, start)]', 'pop the most likely node: its probability is final', 'for (w, p): if prob[u] · p > prob[w]: update, push', 'stop when end is popped'] });
  v.clear();
  const g = v.graph('g', nodes, edges, { label: 'badge = best probability known · green = final' });
  v.layout('row').weight('g', 2.2);
  dijkstraViz(v, graphView(g), N, adj, S, {
    lines: { init: [0], pop: [1], relax: [2], done: [3] },
    combine: (d, w) => d * w,
    better: (a, b) => a > b,
    start: 1,
    worst: 0,
    fmt: pf,
    heapLabel: 'max-heap (probability : node)',
    what: 'probability',
    best: 'most likely',
    target: E,
    narrate: 3,
    sayInit: 'Multiplying by a probability can never increase a number, so a path only gets less likely as it grows. That is the mirror image of non-negative weights, so Dijkstra works: always expand the most likely node, using a max-heap.',
  });
  v.eq(`end popped with ${pf(ans)} → answer ${+ans.toFixed(5)}`, 'ok').say(`Node ${E} comes off the heap at point four three two. Nothing left in the heap is more likely, and multiplying only shrinks things, so this is the best.`);
  v.answer(ans);

  recap(v, [{ name: 'Relax all edges n − 1 times', time: 'O(V · E)', space: 'O(V)' }, { name: 'Dijkstra (max-heap, ×)', time: 'O(E log V)', space: 'O(V + E)' }], 'Products of numbers ≤ 1 only shrink → Dijkstra with a max-heap.', ['Maximise a product of probabilities → Dijkstra with × and max'], 'Could also use −log(p) as a non-negative weight.');
  return v.build();
}

const problem: Problem = {
  slug: 'path-with-maximum-probability',
  statement: 'You are given an undirected weighted graph of `n` nodes, where `edges[i] = [a, b]` succeeds with probability `succProb[i]`. Return the maximum probability of success of any path from `start_node` to `end_node`, or 0 if there is no path. Answers within 1e-5 are accepted.',
  examples: [{ input: 'n = 3, edges = [[0,1],[1,2],[0,2]], succProb = [0.5,0.5,0.2], start = 0, end = 2', output: '0.25' }, { input: 'n = 3, edges = [[0,1],[1,2],[0,2]], succProb = [0.5,0.5,0.3], start = 0, end = 2', output: '0.3' }, { input: 'n = 3, edges = [[0,1]], succProb = [0.5], start = 0, end = 2', output: '0' }],
  constraints: ['2 ≤ n ≤ 10⁴', '0 ≤ edges.length ≤ 2 · 10⁴', '0 ≤ succProb[i] ≤ 1', 'at most one edge between any two nodes'],
  hints: ['A path’s probability is a product.', 'Products only shrink: Dijkstra with a max-heap.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Relax all edges n − 1 times', idea: 'Bellman-Ford with × and max.', time: 'O(V · E)', space: 'O(V)', bottleneck: 'Every edge every pass.' },
    { id: 'optimal', kind: 'optimal', name: 'Dijkstra (max-heap)', idea: 'Expand the most likely node first; multiply along edges.', time: 'O(E log V)', space: 'O(V + E)' },
  ],
  takeaway: 'Maximise a product ≤ 1 → **Dijkstra with a max-heap**.',
  video,
  videoArgs: [N, ED, P, S, E],
  judge: {
    type: 'fn', fn: 'maxProbability', params: ['int', 'int[][]', 'double[]', 'int', 'int'], ret: 'double', cmp: 'float',
    tests: [{ args: [3, [[0, 1], [1, 2], [0, 2]], [0.5, 0.5, 0.2], 0, 2], out: 0.25 }, { args: [3, [[0, 1], [1, 2], [0, 2]], [0.5, 0.5, 0.3], 0, 2], out: 0.3 }, { args: [3, [[0, 1]], [0.5], 0, 2], out: 0 }, { args: [N, ED, P, S, E], out: best(N, ED, P, S, E) }],
    gen: (r: Rng) => {
      const n = r.int(2, 7);
      const seen = new Set<string>();
      const edges: number[][] = [];
      const p: number[] = [];
      for (let i = r.int(0, n * 2); i > 0; i--) { const a = r.int(0, n - 1), b = r.int(0, n - 1); if (a === b || seen.has(`${Math.min(a, b)},${Math.max(a, b)}`)) continue; seen.add(`${Math.min(a, b)},${Math.max(a, b)}`); edges.push([a, b]); p.push(r.int(0, 10) / 10); }
      const s = r.int(0, n - 1);
      let e = r.int(0, n - 1);
      if (e === s) e = (e + 1) % n;
      return [n, edges, p, s, e];
    },
    ref: (n: number, edges: number[][], p: number[], s: number, e: number) => best(n, edges, p, s, e),
  },
};

export default problem;
