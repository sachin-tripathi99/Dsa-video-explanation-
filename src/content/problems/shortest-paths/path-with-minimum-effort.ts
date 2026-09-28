import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { dijkstraViz, gridView } from '../../dijkstraviz';

const H = [[1, 2, 2], [3, 8, 2], [5, 3, 5]];
const D4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
function effort(h: number[][]) {
  const R = h.length, C = h[0].length;
  const d = h.map((r) => r.map(() => Infinity)); d[0][0] = 0;
  const done = h.map((r) => r.map(() => false));
  for (;;) {
    let br = -1, bc = -1;
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (!done[r][c] && (br < 0 || d[r][c] < d[br][bc])) { br = r; bc = c; }
    if (br < 0) break;
    done[br][bc] = true;
    for (const [dr, dc] of D4) { const nr = br + dr, nc = bc + dc; if (nr < 0 || nc < 0 || nr >= R || nc >= C) continue; const e = Math.max(d[br][bc], Math.abs(h[nr][nc] - h[br][bc])); if (e < d[nr][nc]) d[nr][nc] = e; }
  }
  return d[R - 1][C - 1];
}

function video() {
  const v = new Video('path-with-minimum-effort', 'Path With Minimum Effort');
  const R = H.length, C = H[0].length;
  const ans = effort(H);
  v.chapter('intro', 'The problem');
  v.grid('hg', H, { label: 'heights' });
  v.say('A hiker walks from the top-left cell to the bottom-right, moving up, down, left or right. The effort of a route is its single biggest height difference between neighbouring steps. Find the route with the smallest effort.');
  v.eq(`answer: ${ans}`);
  v.say('It is a shortest-path problem where a route’s cost is its worst step rather than the sum of its steps.');

  v.chapter('brute', 'Brute force: try every effort limit', { cx: 'O(maxH · R·C)', code: ['for limit = 0, 1, 2, …:', '  BFS using only steps with difference ≤ limit', '  reached the end → return limit'] });
  v.eq('up to 10⁶ limits × a BFS each', 'bad').say('Try limit zero, one, two and so on. For each limit, a BFS checks whether the end is reachable using only steps no steeper than the limit. The first limit that works is the answer, but heights go up to a million.');

  v.chapter('better', 'Better: binary search the limit', { cx: 'O(R·C · log maxH)', code: ['lo = 0, hi = max height', 'mid works (BFS reaches the end) → hi = mid', 'otherwise lo = mid + 1'] });
  v.eq('feasible(limit) is monotonic → binary search', 'warn').say('If a limit works, every larger limit works too. So binary search the smallest working limit: about twenty BFS runs instead of a million.');

  v.chapter('optimal', 'Dijkstra where a path costs its steepest step', { cx: 'O(R·C · log(R·C))', code: ['effort[start] = 0; heap = [(0, start)]', 'pop the cell with the smallest effort: final', 'neighbour: e = max(effort, |height difference|)', '  if e < effort[neighbour]: update, push'] });
  v.clear();
  v.grid('hg', H, { label: 'heights' });
  const eg = v.grid('eg', H.map((r) => r.map(() => '∞')), { label: 'best effort to each cell' });
  v.layout('row').weight('hg', 1).weight('eg', 1);
  const adj = Array.from({ length: R * C }, () => [] as [number, number][]);
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) for (const [dr, dc] of D4) { const nr = r + dr, nc = c + dc; if (nr >= 0 && nc >= 0 && nr < R && nc < C) adj[r * C + c].push([nr * C + nc, Math.abs(H[nr][nc] - H[r][c])]); }
  const res = dijkstraViz(v, gridView(eg, C, () => '∞'), R * C, adj, 0, {
    name: (u) => `(${Math.floor(u / C)},${u % C})`,
    entry: (d, u) => `${d}@${Math.floor(u / C)},${u % C}`,
    heapLabel: 'min-heap (effort @ cell)',
    combine: (d, w) => Math.max(d, w),
    lines: { init: [0], pop: [1], relax: [2, 3], done: [1] },
    what: 'effort',
    best: 'lowest-effort',
    narrate: 2,
    target: R * C - 1,
    showMisses: false,
    heapWeight: 1.4,
    sayInit: 'Extending a route can never lower its steepest step, so the Dijkstra argument still holds: the cell with the smallest effort in the heap is final. Only the combine step changes, from plus to max.',
    firstPopSay: 'From here, a step’s cost is the larger of the effort so far and that step’s height difference.',
  });
  v.eq(`reached (${R - 1},${C - 1}) with effort ${res.dist[R * C - 1]}`, 'ok').say(`The bottom-right cell is popped with effort ${words(ans)}, so no route can do better. We can stop right there.`);
  v.answer(ans);

  recap(v, [{ name: 'Every limit + BFS', time: 'O(maxH · R·C)', space: 'O(R·C)' }, { name: 'Binary search + BFS', time: 'O(R·C · log maxH)', space: 'O(R·C)' }, { name: 'Dijkstra with max', time: 'O(R·C · log(R·C))', space: 'O(R·C)' }], 'Minimise the worst step → Dijkstra with max instead of +.', ['Path cost = maximum edge → Dijkstra (max), binary search + BFS, or Union-Find by edge weight'], 'Stop as soon as the target is popped.');
  return v.build();
}

const problem: Problem = {
  slug: 'path-with-minimum-effort',
  statement: 'You are given a `rows × columns` grid `heights`. Starting at the top-left cell you want to reach the bottom-right cell, moving up, down, left or right. A route’s **effort** is the maximum absolute difference in heights between two consecutive cells. Return the minimum effort.',
  examples: [{ input: 'heights = [[1,2,2],[3,8,2],[5,3,5]]', output: '2' }, { input: 'heights = [[1,2,3],[3,8,4],[5,3,5]]', output: '1' }, { input: 'heights = [[1,2,1,1,1],[1,2,1,2,1],[1,2,1,2,1],[1,2,1,2,1],[1,1,1,2,1]]', output: '0' }],
  constraints: ['1 ≤ rows, columns ≤ 100', '1 ≤ heights[i][j] ≤ 10⁶'],
  hints: ['A route costs its worst step.', 'Dijkstra works with max instead of +.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every limit + BFS', idea: 'For limit = 0, 1, …, BFS with steps ≤ limit.', time: 'O(maxH · R·C)', space: 'O(R·C)', bottleneck: 'Too many limits.' },
    { id: 'better', kind: 'better', name: 'Binary search + BFS', idea: 'Feasibility is monotonic in the limit.', time: 'O(R·C · log maxH)', space: 'O(R·C)', bottleneck: 'A BFS per probe.' },
    { id: 'optimal', kind: 'optimal', name: 'Dijkstra with max', idea: 'Heap by effort; combine with max(d, step).', time: 'O(R·C · log(R·C))', space: 'O(R·C)' },
  ],
  takeaway: 'Worst-step cost → **Dijkstra with max**.',
  video,
  videoArgs: [H],
  judge: {
    type: 'fn', fn: 'minimumEffortPath', params: ['int[][]'], ret: 'int',
    tests: [{ args: [H], out: 2 }, { args: [[[1, 2, 3], [3, 8, 4], [5, 3, 5]]], out: 1 }, { args: [[[1, 2, 1, 1, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 1, 1, 2, 1]]], out: 0 }, { args: [[[7]]], out: 0 }],
    gen: (r: Rng) => { const R = r.int(1, 5), C = r.int(1, 5); return [Array.from({ length: R }, () => Array.from({ length: C }, () => r.int(1, 30)))]; },
    ref: (h: number[][]) => effort(h),
  },
};

export default problem;
