import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { fill2D } from '../../dpviz';

const G = [[0, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [1, 0, 0, 0]];
function tbl(g: number[][]) { const R = g.length, C = g[0].length; const d = g.map((r) => r.map(() => 0)); for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) { if (g[r][c]) continue; d[r][c] = r === 0 && c === 0 ? 1 : (r ? d[r - 1][c] : 0) + (c ? d[r][c - 1] : 0); } return d; }
function count(g: number[][]) { const d = tbl(g); return d[g.length - 1][g[0].length - 1]; }

function video() {
  const v = new Video('unique-paths-ii', 'Unique Paths II');
  const R = G.length, C = G[0].length;
  const d = tbl(G);
  const show = G.map((row) => row.map((x) => (x ? '🪨' : '')));
  v.chapter('intro', 'The problem');
  v.grid('g', show, { label: 'rocks block cells' });
  v.say('Same robot, moving only right or down, but some cells hold rocks the robot cannot enter. Count the paths from the top-left to the bottom-right.');
  v.eq(`answer: ${count(G)}`);

  v.chapter('brute', 'Brute force: recursion that stops at rocks', { cx: 'O(2^(m+n))', code: ['paths(r, c): if off-grid or rock: return 0', '  if (r, c) == (0, 0): return 1', '  return paths(r − 1, c) + paths(r, c − 1)'] });
  v.eq('same exponential tree as Unique Paths', 'bad').say('The recursion is the same as before, except a rock returns zero paths. It is still exponential.');

  v.chapter('better', 'Better: memoise each cell', { cx: 'O(m·n)', code: ['cache paths(r, c)'] });
  v.eq('m·n cells', 'warn').say('Each cell is one subproblem, so memoisation is linear in the grid size.');

  v.chapter('optimal', 'Optimal: the table, with zeros on rocks', { cx: 'O(m·n) time, O(n) space', code: ['rock → dp = 0', 'start → dp = 1', 'else dp[r][c] = up + left (missing sides count 0)'] });
  v.clear();
  const g = v.grid('dp', show, { label: 'dp[r][c] = paths to (r, c)' });
  v.line(0).say('Fill the table as before. A rock cell gets zero, so no path passes through it. Note the first row and column are no longer all ones: a rock cuts off everything after it.');
  const cells: [number, number][] = [];
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) cells.push([r, c]);
  fill2D(v, g, cells, {
    deps: (r, c) => (G[r][c] ? [] : [...(r ? [[r - 1, c] as [number, number]] : []), ...(c ? [[r, c - 1] as [number, number]] : [])]),
    val: (r, c) => (G[r][c] ? '🪨0' : d[r][c]),
    tone: (r, c) => (G[r][c] ? 'bad' : 'active'),
    line: (r, c) => (G[r][c] ? [0] : r === 0 && c === 0 ? [1] : [2]),
    eq: (r, c) => (G[r][c] ? `(${r},${c}) is a rock → 0` : r === 0 && c === 0 ? 'start: 1' : `dp[${r}][${c}] = ${r ? d[r - 1][c] : 0} + ${c ? d[r][c - 1] : 0} = ${d[r][c]}`),
    say: (r, c) => (r === 1 && c === 1 ? 'A rock: zero paths lead here.' : r === 1 && c === 2 ? 'This cell’s left neighbour is the rock, so only the path from above counts.' : r === 3 && c === 0 ? 'The first column is cut off by a rock at the bottom.' : undefined),
    hold: 350,
  });
  g.tone(R - 1, C - 1, 'ok');
  v.line(2).eq(`answer = ${count(G)}`, 'ok').say(`${words(count(G))[0].toUpperCase()}${words(count(G)).slice(1)} paths avoid every rock. Rolling one row works exactly as in Unique Paths.`);
  v.answer(count(G));

  recap(v, [{ name: 'Recursion', time: 'O(2^(m+n))', space: 'O(m + n)' }, { name: 'Memoisation', time: 'O(m·n)', space: 'O(m·n)' }, { name: 'Rolling row', time: 'O(m·n)', space: 'O(n)' }], 'Obstacles simply hold zero paths.', ['Grid paths with blocked cells → same DP, 0 on blocks'], 'If the start is blocked, the answer is 0.');
  return v.build();
}

const problem: Problem = {
  slug: 'unique-paths-ii',
  statement: 'A robot moves only down or right on an `m × n` grid from the top-left to the bottom-right corner. `obstacleGrid[i][j] = 1` marks an obstacle. Return the number of unique paths that avoid obstacles.',
  examples: [{ input: 'obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]', output: '2' }, { input: 'obstacleGrid = [[0,1],[0,0]]', output: '1' }],
  constraints: ['1 ≤ m, n ≤ 100', 'obstacleGrid[i][j] is 0 or 1', 'answer ≤ 2 · 10⁹'],
  hints: ['An obstacle has 0 paths.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Above + left; obstacles return 0.', time: 'O(2^(m+n))', space: 'O(m + n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache each cell.', time: 'O(m·n)', space: 'O(m·n)', bottleneck: 'Full table.' },
    { id: 'optimal', kind: 'optimal', name: 'Rolling row', idea: 'One row; reset to 0 on obstacles.', time: 'O(m·n)', space: 'O(n)' },
  ],
  takeaway: 'Obstacles hold **0 paths**.',
  video,
  videoArgs: [G],
  judge: {
    type: 'fn', fn: 'uniquePathsWithObstacles', params: ['int[][]'], ret: 'int',
    tests: [{ args: [[[0, 0, 0], [0, 1, 0], [0, 0, 0]]], out: 2 }, { args: [[[0, 1], [0, 0]]], out: 1 }, { args: [[[1]]], out: 0 }, { args: [G], out: count(G) }],
    gen: (r: Rng) => { const R = r.int(1, 7), C = r.int(1, 7); return [Array.from({ length: R }, () => Array.from({ length: C }, () => (r.chance(0.2) ? 1 : 0)))]; },
    ref: (g: number[][]) => count(g),
  },
};

export default problem;
