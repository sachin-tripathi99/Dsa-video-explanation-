import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const G = [
  [0, 0, 0, 1, 0],
  [1, 1, 0, 1, 0],
  [0, 0, 0, 0, 1],
  [0, 1, 1, 0, 0],
  [0, 0, 0, 1, 0],
];
const D8 = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
function sp(g: number[][]) { const n = g.length; if (g[0][0] || g[n - 1][n - 1]) return -1; const d = g.map((r) => r.map(() => 0)); d[0][0] = 1; const q: [number, number][] = [[0, 0]]; while (q.length) { const [r, c] = q.shift()!; if (r === n - 1 && c === n - 1) return d[r][c]; for (const [dr, dc] of D8) { const nr = r + dr, nc = c + dc; if (nr < 0 || nc < 0 || nr >= n || nc >= n || g[nr][nc] || d[nr][nc]) continue; d[nr][nc] = d[r][c] + 1; q.push([nr, nc]); } } return -1; }

function video() {
  const v = new Video('shortest-path-binary-matrix', 'Shortest Path in Binary Matrix');
  const n = G.length;
  v.chapter('intro', 'The problem');
  v.grid('g', G, { label: '0 = open, 1 = blocked · 8 directions' });
  v.say('Find the shortest clear path from the top-left cell to the bottom-right cell, moving in any of the eight directions, including diagonals, through cells containing zero. The length counts the cells on the path. Return minus one if there is no path.');
  v.eq(`answer: ${sp(G)}`);

  v.chapter('brute', 'Brute force: DFS over every simple path', { cx: 'exponential', code: ['dfs(cell, length): try all 8 neighbours not on the current path', 'keep the best length that reaches the corner'] });
  v.eq('the number of simple paths explodes', 'bad').say('A DFS that tries every simple path and keeps the shortest would work, but the number of paths grows exponentially with the grid size.');

  v.chapter('optimal', 'BFS: rings of equal distance', { cx: 'O(n²)', code: ['if start or end is blocked: return −1', 'dist[start] = 1; queue = [start]', 'pop cell; for 8 neighbours: open and unseen → dist + 1, push', 'the first time the corner is popped, its dist is the answer'] });
  v.clear();
  const g = v.grid('g', G.map((r) => r.map((x) => (x ? '■' : ''))), { label: 'numbers = path length to the cell' });
  const d = G.map((r) => r.map(() => 0));
  d[0][0] = 1;
  g.set(0, 0, 1).tone(0, 0, 'active');
  v.line(0, 1).say('Every step costs the same, so breadth-first search finds the shortest path. Start at the top-left with length one.');
  let q: [number, number][] = [[0, 0]];
  let ring = 1;
  let found = -1;
  while (q.length && found < 0) {
    const next: [number, number][] = [];
    for (const [r, c] of q) for (const [dr, dc] of D8) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= n || nc >= n || G[nr][nc] || d[nr][nc]) continue;
      d[nr][nc] = d[r][c] + 1; next.push([nr, nc]);
    }
    ring++;
    g.clearTones();
    next.forEach(([r, c]) => g.set(r, c, d[r][c]).tone(r, c, 'cmp'));
    const hit = next.find(([r, c]) => r === n - 1 && c === n - 1);
    if (hit) { found = ring; g.tone(n - 1, n - 1, 'ok'); }
    v.line(2).counter(`length ${ring}`).eq(hit ? `corner reached at length ${ring}` : `length ${ring}: ${next.length} new cell${next.length === 1 ? '' : 's'}`, hit ? 'ok' : undefined);
    if (ring === 2) v.say('Ring two: the open cells one step away, diagonals included. Cells are marked when they are first reached, so none is queued twice.');
    else if (hit) v.say(`The bottom-right corner is reached in ring ${words(ring)}: the shortest path visits ${words(ring)} cells.`);
    else v.hold(650);
    if (!next.length) break;
    q = next;
  }
  if (found < 0) v.eq('corner never reached → −1', 'bad').hold(800);
  v.answer(sp(G));

  recap(v, [{ name: 'DFS over all paths', time: 'exponential', space: 'O(n²)' }, { name: 'BFS', time: 'O(n²)', space: 'O(n²)' }], 'Unit-cost steps → BFS; the first arrival is the shortest.', ['Fewest moves on a grid → BFS (8 directions if diagonals are allowed)'], 'Check the blocked start/end corner cases first.');
  return v.build();
}

const problem: Problem = {
  slug: 'shortest-path-in-binary-matrix',
  statement: 'Given an `n × n` binary matrix `grid`, return the length of the shortest clear path from the top-left to the bottom-right cell, or -1. A clear path visits only 0-cells, moving 8-directionally; its length is the number of visited cells.',
  examples: [{ input: 'grid = [[0,1],[1,0]]', output: '2' }, { input: 'grid = [[0,0,0],[1,1,0],[1,1,0]]', output: '4' }, { input: 'grid = [[1,0,0],[1,1,0],[1,1,0]]', output: '-1' }],
  constraints: ['1 ≤ n ≤ 100'],
  hints: ['All moves cost 1: BFS.', 'Check the start and end cells first.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'DFS all paths', idea: 'Try every simple path; keep the shortest.', time: 'exponential', space: 'O(n²)', bottleneck: 'Explodes on open grids.' },
    { id: 'optimal', kind: 'optimal', name: 'BFS', idea: '8-directional BFS with distances.', time: 'O(n²)', space: 'O(n²)' },
  ],
  takeaway: 'Unit cost → **BFS**.',
  video,
  videoArgs: [G],
  judge: {
    type: 'fn', fn: 'shortestPathBinaryMatrix', params: ['int[][]'], ret: 'int',
    tests: [{ args: [[[0, 1], [1, 0]]], out: 2 }, { args: [[[0, 0, 0], [1, 1, 0], [1, 1, 0]]], out: 4 }, { args: [[[1, 0, 0], [1, 1, 0], [1, 1, 0]]], out: -1 }, { args: [[[0]]], out: 1 }, { args: [G], out: sp(G) }],
    gen: (r: Rng) => { const n = r.int(1, 4); return [Array.from({ length: n }, () => Array.from({ length: n }, () => (r.chance(0.3) ? 1 : 0)))]; },
    ref: (g: number[][]) => sp(g),
  },
};

export default problem;
