import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { dijkstraViz, gridView } from '../../dijkstraviz';

const G = [[0, 1, 2, 9], [8, 12, 3, 10], [7, 6, 4, 11], [13, 14, 5, 1]];
const D4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
function swim(g: number[][]) {
  const n = g.length;
  const t = g.map((r) => r.map(() => Infinity)); t[0][0] = g[0][0];
  const done = g.map((r) => r.map(() => false));
  for (;;) {
    let br = -1, bc = -1;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (!done[r][c] && (br < 0 || t[r][c] < t[br][bc])) { br = r; bc = c; }
    if (br < 0) break;
    done[br][bc] = true;
    for (const [dr, dc] of D4) { const nr = br + dr, nc = bc + dc; if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue; const x = Math.max(t[br][bc], g[nr][nc]); if (x < t[nr][nc]) t[nr][nc] = x; }
  }
  return t[n - 1][n - 1];
}

function video() {
  const v = new Video('swim-in-rising-water', 'Swim in Rising Water');
  const n = G.length;
  const ans = swim(G);
  v.chapter('intro', 'The problem');
  v.grid('eg', G, { label: 'elevation' });
  v.say('Rain falls, and at time t the water everywhere is at depth t. You can swim between neighbouring cells only when both are under water, that is, when their elevations are at most t. Swimming itself takes no time. What is the earliest time you can get from the top-left to the bottom-right?');
  v.eq(`answer: ${ans}`);
  v.say('The earliest time is decided by the highest cell you must pass through. So among all routes, minimise the maximum elevation on the route.');

  v.chapter('brute', 'Brute force: try every time t', { cx: 'O(n⁴)', code: ['for t = grid[0][0], grid[0][0] + 1, …:', '  BFS through cells with elevation ≤ t', '  reached the corner → return t'] });
  v.eq('up to n² values of t × a BFS each', 'bad').say('Raise the water one step at a time and check with a BFS whether the corner is reachable yet. Up to n squared water levels, each with a full BFS.');

  v.chapter('optimal', 'Dijkstra: the route cost is its highest cell', { cx: 'O(n² log n)', code: ['time[start] = grid[0][0]; heap = [(that, start)]', 'pop the cell with the lowest time: final', 'neighbour: t = max(time, its elevation)', '  if t < time[neighbour]: update, push'] });
  v.clear();
  v.grid('eg', G, { label: 'elevation' });
  const tg = v.grid('tg', G.map((r) => r.map(() => '∞')), { label: 'earliest time to reach' });
  v.layout('row').weight('eg', 1).weight('tg', 1);
  const adj = Array.from({ length: n * n }, () => [] as [number, number][]);
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) for (const [dr, dc] of D4) { const nr = r + dr, nc = c + dc; if (nr >= 0 && nc >= 0 && nr < n && nc < n) adj[r * n + c].push([nr * n + nc, G[nr][nc]]); }
  const res = dijkstraViz(v, gridView(tg, n, () => '∞'), n * n, adj, 0, {
    name: (u) => `(${Math.floor(u / n)},${u % n})`,
    entry: (d, u) => `${d}@${Math.floor(u / n)},${u % n}`,
    heapLabel: 'min-heap (time @ cell)',
    combine: (d, w) => Math.max(d, w),
    start: G[0][0],
    lines: { init: [0], pop: [1], relax: [2, 3], done: [1] },
    what: 'time',
    best: 'earliest',
    narrate: 2,
    target: n * n - 1,
    showMisses: false,
    heapWeight: 1.4,
    sayInit: 'It is the same shape as minimum effort: a route’s cost is a maximum, which never decreases as the route grows, so Dijkstra applies. Always swim next to the reachable cell that floods earliest.',
    firstPopSay: 'Entering a neighbour costs the larger of the time so far and that neighbour’s elevation.',
  });
  v.eq(`corner reached at time ${res.dist[n * n - 1]}`, 'ok').say(`The corner comes off the heap at time ${words(ans)}. The route snakes along the low cells; its highest point is ${words(ans)}, so that is when the swim becomes possible.`);
  v.answer(ans);

  recap(v, [{ name: 'Every water level + BFS', time: 'O(n⁴)', space: 'O(n²)' }, { name: 'Binary search + BFS', time: 'O(n² log n)', space: 'O(n²)' }, { name: 'Dijkstra with max', time: 'O(n² log n)', space: 'O(n²)' }], 'Minimise the highest point on a route → Dijkstra with max.', ['Bottleneck path (min of max) → Dijkstra with max, or binary search + BFS'], 'The start cell’s own elevation counts too.');
  return v.build();
}

const problem: Problem = {
  slug: 'swim-in-rising-water',
  statement: 'You are given an `n × n` grid where `grid[i][j]` is the elevation of cell (i, j); all values are a permutation of 0..n²−1. At time `t` the water depth everywhere is `t`, and you can swim between 4-directionally adjacent cells if both elevations are at most `t` (swimming is instant). Return the least time until you can reach (n−1, n−1) from (0, 0).',
  examples: [{ input: 'grid = [[0,2],[1,3]]', output: '3' }, { input: 'grid = [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]', output: '16' }],
  constraints: ['1 ≤ n ≤ 50', 'grid values are a permutation of 0..n² − 1'],
  hints: ['The answer is the minimum over routes of the highest cell on the route.', 'Dijkstra with max, or binary search on t.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every level + BFS', idea: 'Raise t one step at a time; BFS each time.', time: 'O(n⁴)', space: 'O(n²)', bottleneck: 'Up to n² BFS runs.' },
    { id: 'optimal', kind: 'optimal', name: 'Dijkstra with max', idea: 'Heap by the highest cell so far.', time: 'O(n² log n)', space: 'O(n²)' },
  ],
  takeaway: 'Min over routes of the max cell → **Dijkstra with max**.',
  video,
  videoArgs: [G],
  judge: {
    type: 'fn', fn: 'swimInWater', params: ['int[][]'], ret: 'int',
    tests: [{ args: [[[0, 2], [1, 3]]], out: 3 }, { args: [[[0, 1, 2, 3, 4], [24, 23, 22, 21, 5], [12, 13, 14, 15, 16], [11, 17, 18, 19, 20], [10, 9, 8, 7, 6]]], out: 16 }, { args: [[[0]]], out: 0 }, { args: [G], out: swim(G) }],
    gen: (r: Rng) => { const n = r.int(1, 5); const vals = r.shuffle([...Array(n * n).keys()]); return [Array.from({ length: n }, (_, i) => vals.slice(i * n, i * n + n))]; },
    ref: (g: number[][]) => swim(g),
  },
};

export default problem;
