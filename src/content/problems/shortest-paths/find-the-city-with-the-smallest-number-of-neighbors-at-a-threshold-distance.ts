import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const N = 4, TH = 4;
const ED = [[0, 1, 3], [1, 2, 1], [1, 3, 4], [2, 3, 1]];
const POS = [[10, 50], [45, 15], [55, 85], [90, 50]];
function allPairs(n: number, edges: number[][]) {
  const d = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 0 : Infinity)));
  for (const [a, b, w] of edges) { d[a][b] = Math.min(d[a][b], w); d[b][a] = Math.min(d[b][a], w); }
  for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];
  return d;
}
function city(n: number, edges: number[][], th: number) {
  const d = allPairs(n, edges);
  let best = -1, bestCnt = Infinity;
  for (let i = 0; i < n; i++) { const cnt = d[i].filter((x, j) => j !== i && x <= th).length; if (cnt <= bestCnt) { bestCnt = cnt; best = i; } }
  return best;
}

function video() {
  const v = new Video('find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance', 'Find the City With the Smallest Number of Neighbors at a Threshold Distance');
  const nodes = POS.map(([x, y], i) => ({ id: String(i), label: String(i), x, y }));
  const edges = ED.map(([a, b, w]) => ({ a: String(a), b: String(b), w }));
  const f = (x: number) => (x === Infinity ? '∞' : String(x));
  const ans = city(N, ED, TH);

  v.chapter('intro', 'The problem');
  v.graph('g', nodes, edges, { label: `roads · threshold = ${TH}` });
  v.say(`For each city, count the other cities within distance ${words(TH)} by shortest path. Return the city with the fewest such neighbours; if there is a tie, the one with the largest number.`);
  v.eq(`answer: ${ans}`);
  v.say('We need shortest distances between every pair of cities, which is exactly what Floyd–Warshall computes.');

  v.chapter('brute', 'Brute force: Bellman-Ford from every city', { cx: 'O(V² · E)', code: ['for each city s: Bellman-Ford from s', '  count cities with dist ≤ threshold', 'pick the fewest, ties → largest index'] });
  v.eq('V runs of an O(V · E) algorithm', 'bad').say('Running Bellman-Ford from every city gives all the distances, but each run costs V times E. Running Dijkstra from each city would already be faster, and Floyd–Warshall is the simplest of all.');

  v.chapter('optimal', 'Floyd–Warshall, then count each row', { cx: 'O(V³)', code: ['d[i][j] = road length, 0 on the diagonal, ∞ otherwise', 'for k: for i, j: d[i][j] = min(d[i][j], d[i][k] + d[k][j])', 'count[i] = # of j ≠ i with d[i][j] ≤ threshold', 'answer = fewest, ties → largest i'] });
  v.clear();
  const g = v.graph('g', nodes, edges, { label: 'roads' });
  const d = Array.from({ length: N }, (_, i) => Array.from({ length: N }, (_, j) => (i === j ? 0 : Infinity)));
  ED.forEach(([a, b, w]) => { d[a][b] = w; d[b][a] = w; });
  const m = v.grid('m', d.map((r) => r.map(f)), { label: 'd[i][j]' });
  v.layout('row').weight('g', 1.4).weight('m', 1);
  v.line(0).say('Fill the table with the direct roads. Roads go both ways, so the table is symmetric.');
  for (let k = 0; k < N; k++) {
    m.clearTones(); g.clearTones(); g.tone(String(k), 'cmp');
    for (let t = 0; t < N; t++) { m.tone(k, t, 'cmp'); m.tone(t, k, 'cmp'); }
    const ch: string[] = [];
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (d[i][k] + d[k][j] < d[i][j]) { d[i][j] = d[i][k] + d[k][j]; m.set(i, j, d[i][j]).tone(i, j, 'ok'); if (i < j) ch.push(`${i}↔${j}=${d[i][j]}`); }
    v.line(1).counter(`k = ${k}`).eq(ch.length ? `via ${k}: ${ch.join(', ')}` : `via ${k}: nothing improves`, ch.length ? 'ok' : undefined);
    if (k === 1) v.say(`Using city one as a stopover connects zero to two and three: ${ch.join(', ').replace(/↔/g, ' to ').replace(/=/g, ' costs ')}.`);
    else if (k === 2) v.say(`Stopping at city two gives cheaper routes: ${ch.join(', ').replace(/↔/g, ' to ').replace(/=/g, ' now costs ')}.`);
    else if (k === 0) v.say('City zero as a stopover helps nobody here: it is a dead end at the edge.');
    else v.hold(900);
  }
  m.clearTones(); g.clearTones();

  v.chapter('count', 'Count the neighbours within the threshold', { code: ['count[i] = # of j ≠ i with d[i][j] ≤ threshold', 'answer = fewest, ties → largest i'] });
  const cnt: number[] = [];
  const vars = v.vars('cnt', {});
  for (let i = 0; i < N; i++) {
    m.clearTones(); g.clearTones(); g.tone(String(i), 'active');
    const near: number[] = [];
    for (let j = 0; j < N; j++) { if (j === i) { m.tone(i, j, 'dim'); continue; } const ok = d[i][j] <= TH; m.tone(i, j, ok ? 'ok' : 'bad'); if (ok) { near.push(j); g.tone(String(j), 'ok'); } }
    cnt.push(near.length);
    vars.set({ [`city ${i}`]: near.length });
    v.line(0).counter(`city ${i}`).eq(`city ${i}: within ${TH} → ${near.join(', ') || 'none'} (${near.length})`);
    if (i === 0) v.say(`City zero reaches ${near.map((x) => words(x)).join(' and ')} within ${words(TH)}; city three is ${words(d[0][3])} away, too far. Count: ${words(near.length)}.`); else v.hold(900);
  }
  const low = Math.min(...cnt);
  const ties = cnt.map((c, i) => (c === low ? i : -1)).filter((i) => i >= 0);
  m.clearTones(); g.clearTones(); g.tone(String(ans), 'ok');
  vars.clearTones?.();
  v.line(1).eq(`fewest = ${low} at cities ${ties.join(', ')} → largest: ${ans}`, 'ok').say(`The fewest neighbours is ${words(low)}, shared by cities ${ties.map((x) => words(x)).join(' and ')}. Ties go to the larger number, so the answer is ${words(ans)}.`);
  v.answer(ans);

  recap(v, [{ name: 'Bellman-Ford from each city', time: 'O(V² · E)', space: 'O(V)' }, { name: 'Dijkstra from each city', time: 'O(V · E log V)', space: 'O(V + E)' }, { name: 'Floyd–Warshall', time: 'O(V³)', space: 'O(V²)' }], 'All-pairs distances, then a row count.', ['Small V and a question about every pair → Floyd–Warshall'], 'Ties → largest index: use ≤ when scanning upward.');
  return v.build();
}

const problem: Problem = {
  slug: 'find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance',
  statement: 'There are `n` cities and bidirectional weighted `edges[i] = [from, to, weight]`. Return the city with the smallest number of cities reachable through a path of total distance at most `distanceThreshold`. If several cities tie, return the one with the greatest number.',
  examples: [{ input: 'n = 4, edges = [[0,1,3],[1,2,1],[1,3,4],[2,3,1]], distanceThreshold = 4', output: '3' }, { input: 'n = 5, edges = [[0,1,2],[0,4,8],[1,2,3],[1,4,2],[2,3,1],[3,4,1]], distanceThreshold = 2', output: '0' }],
  constraints: ['2 ≤ n ≤ 100', '1 ≤ edges.length ≤ n(n − 1)/2', '1 ≤ weight, distanceThreshold ≤ 10⁴', 'all pairs (from, to) are distinct'],
  hints: ['You need distances between all pairs.', 'n ≤ 100: Floyd–Warshall is fine.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Bellman-Ford from each city', idea: 'Single-source shortest paths from every city, then count.', time: 'O(V² · E)', space: 'O(V)', bottleneck: 'Slow per source.' },
    { id: 'optimal', kind: 'optimal', name: 'Floyd–Warshall', idea: 'All-pairs table, then count entries ≤ threshold per row.', time: 'O(V³)', space: 'O(V²)' },
  ],
  takeaway: 'Every pair, small V → **Floyd–Warshall**.',
  video,
  videoArgs: [N, ED, TH],
  judge: {
    type: 'fn', fn: 'findTheCity', params: ['int', 'int[][]', 'int'], ret: 'int',
    tests: [{ args: [N, ED, TH], out: 3 }, { args: [5, [[0, 1, 2], [0, 4, 8], [1, 2, 3], [1, 4, 2], [2, 3, 1], [3, 4, 1]], 2], out: 0 }, { args: [2, [[0, 1, 5]], 4], out: 1 }],
    gen: (r: Rng) => {
      const n = r.int(2, 7);
      const seen = new Set<string>();
      const edges: number[][] = [];
      for (let i = r.int(1, n * 2); i > 0; i--) { const a = r.int(0, n - 1), b = r.int(0, n - 1); if (a === b || seen.has(`${Math.min(a, b)},${Math.max(a, b)}`)) continue; seen.add(`${Math.min(a, b)},${Math.max(a, b)}`); edges.push([a, b, r.int(1, 9)]); }
      if (!edges.length) edges.push([0, 1, 3]);
      return [n, edges, r.int(1, 12)];
    },
    ref: (n: number, edges: number[][], th: number) => city(n, edges, th),
  },
};

export default problem;
