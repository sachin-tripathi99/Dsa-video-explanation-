import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const PTS = [[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]];
const md = (a: number[], b: number[]) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
function mst(p: number[][]) {
  const n = p.length; const best = Array(n).fill(Infinity); const inT = Array(n).fill(false); best[0] = 0; let total = 0;
  for (let k = 0; k < n; k++) { let u = -1; for (let i = 0; i < n; i++) if (!inT[i] && (u < 0 || best[i] < best[u])) u = i; inT[u] = true; total += best[u]; for (let i = 0; i < n; i++) if (!inT[i]) best[i] = Math.min(best[i], md(p[u], p[i])); }
  return total;
}

function video() {
  const v = new Video('min-cost-to-connect-all-points', 'Min Cost to Connect All Points');
  const n = PTS.length;
  const ans = mst(PTS);
  const X = (x: number) => 8 + x * 12;
  const Y = (y: number) => 92 - y * 8.4;
  const nodes = PTS.map(([x, y], i) => ({ id: String(i), label: String(i), x: X(x), y: Y(y), sub: `(${x},${y})` }));

  v.chapter('intro', 'The problem');
  v.graph('g', nodes, [], { label: 'points on a plane' });
  v.say('Connect all the points. Joining two points costs their Manhattan distance: the difference in x plus the difference in y. Find the cheapest total cost so every point is connected.');
  v.eq(`answer: ${ans}`);
  v.say('Every pair of points is a possible edge, so this is a minimum spanning tree on a complete graph.');

  v.chapter('brute', 'Kruskal on all n² edges', { cx: 'O(n² log n)', code: ['build every pair (i, j) with its distance', 'sort them', 'Union-Find: take edges that join two groups'] });
  v.eq(`${n * (n - 1) / 2} edges here · ~500 000 for n = 1000`, 'warn').say('Kruskal works, but first it must build and sort every pair: half a million edges for a thousand points, and sorting them costs another log factor.');

  v.chapter('optimal', 'Prim with an array: O(n²), no edge list at all', { cx: 'O(n²)', code: ['best[i] = cheapest link from the tree to i (∞); best[0] = 0', 'n times: u = the outside point with the smallest best', '  add u to the tree; total += best[u]', '  for every outside i: best[i] = min(best[i], dist(u, i))'] });
  v.clear();
  const g = v.graph('g', nodes, [], { label: 'green = connected' });
  const arr = v.array('best', PTS.map(() => '∞'), { label: 'best[i] = cheapest link from the tree' });
  v.weight('g', 2.4).weight('best', 1.3);
  const best = Array(n).fill(Infinity);
  const from = Array(n).fill(-1);
  const inT = Array(n).fill(false);
  best[0] = 0;
  arr.set(0, 0);
  v.line(0).say('On a complete graph, Prim does not even need a heap. Keep one number per point: the cheapest way to link it to the tree built so far. Start with point zero at cost zero.');
  let total = 0;
  for (let k = 0; k < n; k++) {
    let u = -1;
    for (let i = 0; i < n; i++) if (!inT[i] && (u < 0 || best[i] < best[u])) u = i;
    inT[u] = true;
    total += best[u];
    g.tone(String(u), 'ok');
    arr.tone(u, 'ok');
    if (from[u] >= 0) { g.p.edges.push({ a: String(from[u]), b: String(u), w: best[u] }); g.edge(String(from[u]), String(u), 'ok'); }
    v.line(1, 2).counter(`connected ${k + 1}/${n} · cost ${total}`).eq(k === 0 ? 'take point 0 (cost 0)' : `smallest best: point ${u} via ${from[u]} (+${best[u]}) → total ${total}`, 'ok');
    if (k === 1) v.say(`The outside point with the smallest link cost is ${words(u)}, at ${words(best[u])} from point ${words(from[u])}. Link it.`);
    else if (k === n - 1) v.say(`The last point, ${words(u)}, joins for ${words(best[u])}. Total: ${words(total)}.`);
    else if (k > 1) v.hold(800);
    const ups: string[] = [];
    for (let i = 0; i < n; i++) if (!inT[i]) { const d = md(PTS[u], PTS[i]); if (d < best[i]) { best[i] = d; from[i] = u; arr.set(i, d).tone(i, 'active'); ups.push(`best[${i}]=${d}`); } }
    if (ups.length) {
      v.line(3).eq(`closer via ${u}: ${ups.join(', ')}`);
      if (k === 0) v.say(`Measure from point zero to every other point: ${ups.map((s) => s.split('=')[1]).map(Number).map((x) => words(x)).join(', ')}.`);
      else if (k === 1) v.say(`Point ${words(u)} is closer to some outside points than anything before, so their best links drop.`);
      else v.hold(800);
      for (let i = 0; i < n; i++) if (!inT[i]) arr.tone(i, 'none');
    }
  }
  v.eq(`minimum cost = ${total}`, 'ok').say(`All points are connected for ${words(total)}. The work is n rounds of scanning n numbers: n squared, and only linear memory.`);
  v.answer(ans);

  recap(v, [{ name: 'Kruskal on all pairs', time: 'O(n² log n)', space: 'O(n²)' }, { name: 'Prim with a heap', time: 'O(n² log n)', space: 'O(n²)' }, { name: 'Prim with an array', time: 'O(n²)', space: 'O(n)' }], 'Complete graph → array-based Prim.', ['Connect all points at minimum cost → MST'], 'Dense graph: skip the heap and the edge list.');
  return v.build();
}

const problem: Problem = {
  slug: 'min-cost-to-connect-all-points',
  statement: 'You are given an array `points` where `points[i] = [xi, yi]`. The cost of connecting two points is their Manhattan distance `|xi − xj| + |yi − yj|`. Return the minimum cost to make all points connected (exactly one simple path between any two points).',
  examples: [{ input: 'points = [[0,0],[2,2],[3,10],[5,2],[7,0]]', output: '20' }, { input: 'points = [[3,12],[-2,5],[-4,1]]', output: '18' }],
  constraints: ['1 ≤ points.length ≤ 1000', '−10⁶ ≤ xi, yi ≤ 10⁶', 'all points are distinct'],
  hints: ['It is a minimum spanning tree.', 'The graph is complete: Prim with an array is O(n²).'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Kruskal on all pairs', idea: 'Build and sort all n² edges; Union-Find to skip cycles.', time: 'O(n² log n)', space: 'O(n²)', bottleneck: 'Stores and sorts every pair.' },
    { id: 'optimal', kind: 'optimal', name: 'Prim with an array', idea: 'best[i] = cheapest link to the tree; repeatedly take the smallest.', time: 'O(n²)', space: 'O(n)' },
  ],
  takeaway: 'Dense MST → **array Prim**.',
  video,
  videoArgs: [PTS],
  judge: {
    type: 'fn', fn: 'minCostConnectPoints', params: ['int[][]'], ret: 'int',
    tests: [{ args: [PTS], out: 20 }, { args: [[[3, 12], [-2, 5], [-4, 1]]], out: 18 }, { args: [[[0, 0]]], out: 0 }, { args: [[[0, 0], [1, 1], [1, 0], [-1, 1]]], out: 4 }],
    gen: (r: Rng) => { const n = r.int(1, 9); const seen = new Set<string>(); const p: number[][] = []; while (p.length < n) { const x = r.int(-10, 10), y = r.int(-10, 10); if (seen.has(`${x},${y}`)) continue; seen.add(`${x},${y}`); p.push([x, y]); } return [p]; },
    ref: (p: number[][]) => mst(p),
  },
};

export default problem;
