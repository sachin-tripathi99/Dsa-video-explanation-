import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { ringBfs } from '../../gridbfs';

const G = [
  [1, 1, 0, 0, 0],
  [1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1],
  [0, 0, 0, 1, 1],
  [0, 0, 0, 1, 1],
];
function bridge(g: number[][]) { const n = g.length; const w = g.map((r) => [...r]); let sr = -1, sc = -1; outer: for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (w[r][c]) { sr = r; sc = c; break outer; } const q: [number, number][] = []; const mark = (r: number, c: number) => { if (r < 0 || c < 0 || r >= n || c >= n || w[r][c] !== 1) return; w[r][c] = 2; q.push([r, c]); mark(r + 1, c); mark(r - 1, c); mark(r, c + 1); mark(r, c - 1); }; mark(sr, sc); let front = q, d = 0; while (front.length) { const nx: [number, number][] = []; for (const [r, c] of front) for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nr = r + dr, nc = c + dc; if (nr < 0 || nc < 0 || nr >= n || nc >= n || w[nr][nc] === 2) continue; if (w[nr][nc] === 1) return d; w[nr][nc] = 2; nx.push([nr, nc]); } front = nx; d++; } return -1; }

function video() {
  const v = new Video('shortest-bridge', 'Shortest Bridge');
  const n = G.length;
  v.chapter('intro', 'The problem');
  v.grid('g', G, { label: 'exactly two islands' });
  v.say('The grid has exactly two islands. Flip the fewest water cells to land so the two islands become connected.');
  v.eq(`answer: ${bridge(G)}`);

  v.chapter('brute', 'Brute force: every pair of cells from the two islands', { cx: 'O(A · B)', code: ['cells of island A, cells of island B', 'answer = min over pairs of (|dr| + |dc| − 1)'] });
  v.eq('A × B pairs of cells', 'warn').say('Once we know which cells belong to each island, the bridge between two cells needs their Manhattan distance minus one flips. Trying every pair works, since there are no obstacles in the water, but it costs the product of the two islands’ sizes, which can be quadratic in the grid.');

  v.chapter('optimal', 'Mark one island, then multi-source BFS until the other', { cx: 'O(n²)', code: ['DFS island A; queue all its cells', 'BFS over water, ring by ring', 'ring touching B → flips = ring − 1'] });
  v.clear();
  const g = v.grid('g', G.map((r) => r.map((x) => (x ? 'B' : ''))), { label: 'island A (sources) spreads toward island B' });
  const w = G.map((r) => [...r]);
  const A: [number, number][] = [];
  const mark = (r: number, c: number) => { if (r < 0 || c < 0 || r >= n || c >= n || w[r][c] !== 1) return; w[r][c] = 2; A.push([r, c]); mark(r + 1, c); mark(r - 1, c); mark(r, c + 1); mark(r, c - 1); };
  mark(0, 0);
  A.forEach(([r, c]) => g.set(r, c, 'A').tone(r, c, 'active'));
  v.line(0).eq(`island A: ${A.length} cells`).say('First find one island with a DFS and mark all of its cells. They become the sources of a multi-source BFS.');
  let flips = -1;
  let hitCell: [number, number] = [0, 0];
  const dist = ringBfs(v, g, n, n, A, (r, c) => w[r][c] !== 2, (ring, cells) => {
    const hit = cells.filter(([r, c]) => w[r][c] === 1);
    if (hit.length) { flips = ring - 1; hitCell = hit[0]; hit.forEach(([r, c]) => g.set(r, c, 'B').tone(r, c, 'ok')); return { eq: `ring ${ring} touches island B → flips = ${ring - 1}`, ok: true, stop: true, say: `Ring ${words(ring)} reaches island B. The water crossed on the way, rings one to ${words(ring - 1)}, is what must be flipped: ${words(ring - 1)} cells.` }; }
    return { eq: `ring ${ring}: water at distance ${ring} from island A`, say: ring === 1 ? 'Spread over the water one ring at a time, from every cell of island A together.' : undefined };
  }, { lines: [1, 2], show: (d) => (d === 0 ? 'A' : d) });
  // walk back down the rings from the touched B cell: one bridge of `flips` cells
  const path: [number, number][] = [];
  let [pr, pc] = hitCell;
  for (let d = flips; d >= 1; d--) {
    const nb = ([[1, 0], [-1, 0], [0, 1], [0, -1]] as const).map(([dr, dc]) => [pr + dr, pc + dc] as [number, number]).find(([r, c]) => r >= 0 && c >= 0 && r < n && c < n && dist[r][c] === d)!;
    path.push(nb);
    [pr, pc] = nb;
  }
  g.clearTones();
  A.forEach(([r, c]) => g.tone(r, c, 'active'));
  path.forEach(([r, c]) => g.set(r, c, '🌉').tone(r, c, 'path'));
  g.tone(hitCell[0], hitCell[1], 'ok');
  v.line(2).eq(`bridge: ${path.map(([r, c]) => `(${r},${c})`).reverse().join(' → ')}`, 'ok').say(`Walking back down the rings from where we touched island B gives one bridge: ${words(flips)} flipped cells, one per ring.`);
  v.answer(bridge(G));

  recap(v, [{ name: 'All cell pairs', time: 'O(A · B)', space: 'O(n²)' }, { name: 'DFS + multi-source BFS', time: 'O(n²)', space: 'O(n²)' }], 'Sources = the whole first island; stop at the second.', ['Shortest distance between two regions → one region as the BFS sources'], 'A region can be a single giant source.');
  return v.build();
}

function twoIslands(r: Rng) { for (;;) { const n = r.int(2, 5); const g = Array.from({ length: n }, () => Array.from({ length: n }, () => (r.chance(0.35) ? 1 : 0))); const seen = g.map((row) => row.map(() => false)); let k = 0; for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) if (g[a][b] && !seen[a][b]) { k++; const st = [[a, b]]; seen[a][b] = true; while (st.length) { const [x, y] = st.pop()!; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < n && ny < n && g[nx][ny] && !seen[nx][ny]) { seen[nx][ny] = true; st.push([nx, ny]); } } } } if (k === 2) return [g]; } }

const problem: Problem = {
  slug: 'shortest-bridge',
  statement: 'You are given an `n × n` binary matrix with exactly two islands (4-directionally connected groups of 1s). You may flip 0s to 1s. Return the smallest number of 0s you must flip to connect the two islands.',
  examples: [{ input: 'grid = [[0,1],[1,0]]', output: '1' }, { input: 'grid = [[0,1,0],[0,0,0],[0,0,1]]', output: '2' }, { input: 'grid = [[1,1,1,1,1],[1,0,0,0,1],[1,0,1,0,1],[1,0,0,0,1],[1,1,1,1,1]]', output: '1' }],
  constraints: ['2 ≤ n ≤ 100', 'exactly two islands'],
  hints: ['Find one island first.', 'BFS outward from all of its cells.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'All cell pairs', idea: 'Label both islands; min over pairs of Manhattan distance − 1.', time: 'O(A · B)', space: 'O(n²)', bottleneck: 'Quadratic pairs.' },
    { id: 'optimal', kind: 'optimal', name: 'DFS + multi-source BFS', idea: 'Mark island A, BFS from all its cells until island B is touched.', time: 'O(n²)', space: 'O(n²)' },
  ],
  takeaway: 'Use **a whole island** as the BFS source.',
  video,
  videoArgs: [G],
  judge: {
    type: 'fn', fn: 'shortestBridge', params: ['int[][]'], ret: 'int',
    tests: [{ args: [[[0, 1], [1, 0]]], out: 1 }, { args: [[[0, 1, 0], [0, 0, 0], [0, 0, 1]]], out: 2 }, { args: [[[1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 1, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1]]], out: 1 }, { args: [G], out: bridge(G) }],
    gen: (r: Rng) => twoIslands(r),
    ref: (g: number[][]) => bridge(g),
  },
};

export default problem;
