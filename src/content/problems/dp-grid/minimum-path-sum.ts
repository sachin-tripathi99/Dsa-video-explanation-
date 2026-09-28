import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { fill2D } from '../../dpviz';

const G = [[1, 3, 1, 2], [1, 5, 1, 4], [4, 2, 1, 3], [2, 1, 6, 1]];
function tbl(g: number[][]) { const R = g.length, C = g[0].length; const d = g.map((r) => r.map(() => 0)); for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) d[r][c] = g[r][c] + (r === 0 && c === 0 ? 0 : Math.min(r ? d[r - 1][c] : Infinity, c ? d[r][c - 1] : Infinity)); return d; }
function minSum(g: number[][]) { const d = tbl(g); return d[g.length - 1][g[0].length - 1]; }

function video() {
  const v = new Video('minimum-path-sum', 'Minimum Path Sum');
  const R = G.length, C = G[0].length;
  const d = tbl(G);
  v.chapter('intro', 'The problem');
  v.grid('g', G, { label: 'grid of costs' });
  v.say('Move from the top-left to the bottom-right, only right or down, adding up the numbers you pass, including both corners. Find the smallest possible total.');
  v.eq(`answer: ${minSum(G)}`);

  v.chapter('brute', 'Brute force: recursion over both last moves', { cx: 'O(2^(m+n))', code: ['best(r, c) = grid[r][c] + min(best(r−1, c), best(r, c−1))', 'off-grid → ∞; start → grid[0][0]'] });
  v.eq('every path explored', 'bad').say('The recursion tries the cell above and the cell to the left for every cell, re-solving the same cells again and again.');

  v.chapter('better', 'Better: memoise best(r, c)', { cx: 'O(m·n)', code: ['cache best(r, c)'] });
  v.eq('m·n subproblems', 'warn').say('Caching each cell makes it linear in the size of the grid.');

  v.chapter('optimal', 'Optimal: fill the grid in place', { cx: 'O(m·n) time, O(1) extra', code: ['first row: add the left neighbour; first column: add the one above', 'dp[r][c] = grid[r][c] + min(up, left)', 'answer = dp[m−1][n−1]'] });
  v.clear();
  v.grid('in', G, { label: 'costs' });
  const g = v.grid('dp', G.map((r) => r.map(() => '')), { label: 'dp = cheapest total to reach the cell' });
  v.layout('row');
  v.line(0).say('Each cell’s cheapest total is its own cost plus the cheaper of the two ways in. Along the top row and left column there is only one way in.');
  const cells: [number, number][] = [];
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) cells.push([r, c]);
  fill2D(v, g, cells, {
    deps: (r, c) => {
      if (r === 0 && c === 0) return [];
      if (r === 0) return [[0, c - 1]];
      if (c === 0) return [[r - 1, 0]];
      return [d[r - 1][c] <= d[r][c - 1] ? [r - 1, c] : [r, c - 1]];
    },
    val: (r, c) => d[r][c], line: (r, c) => (r === 0 || c === 0 ? [0] : [1]),
    eq: (r, c) => (r === 0 && c === 0 ? `dp[0][0] = ${G[0][0]}` : r === 0 || c === 0 ? `dp[${r}][${c}] = ${G[r][c]} + ${r ? d[r - 1][c] : d[r][c - 1]} = ${d[r][c]}` : `dp[${r}][${c}] = ${G[r][c]} + min(${d[r - 1][c]}, ${d[r][c - 1]}) = ${d[r][c]}`),
    say: (r, c) => (r === 1 && c === 1 ? `Cell one, one costs five. From above the best total is ${words(d[0][1])}, from the left ${words(d[1][0])}. The arrow shows the cheaper choice.` : r === 2 && c === 2 ? 'The arrow always points at the cheaper neighbour: that is the route the cheapest path takes into this cell.' : undefined),
    hold: 380,
  });
  g.tone(R - 1, C - 1, 'ok');
  v.line(2).eq(`answer = ${minSum(G)}`, 'ok').say(`The cheapest total is ${words(minSum(G))}. The grid can be overwritten in place, or a single rolling row used, for constant or linear extra space.`);
  v.answer(minSum(G));

  recap(v, [{ name: 'Recursion', time: 'O(2^(m+n))', space: 'O(m + n)' }, { name: 'Memoisation', time: 'O(m·n)', space: 'O(m·n)' }, { name: 'In-place / rolling row', time: 'O(m·n)', space: 'O(1) or O(n)' }], 'dp = cost + min(up, left).', ['Min cost right/down path → grid DP with min'], 'Edges have only one way in.');
  return v.build();
}

const problem: Problem = {
  slug: 'minimum-path-sum',
  statement: 'Given an `m × n` grid of non-negative numbers, find a path from the top-left to the bottom-right which minimises the sum of all numbers along it. You can only move down or right.',
  examples: [{ input: 'grid = [[1,3,1],[1,5,1],[4,2,1]]', output: '7' }, { input: 'grid = [[1,2,3],[4,5,6]]', output: '12' }],
  constraints: ['1 ≤ m, n ≤ 200', '0 ≤ grid[i][j] ≤ 200'],
  hints: ['dp[r][c] = grid[r][c] + min(up, left).'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Try both last moves recursively.', time: 'O(2^(m+n))', space: 'O(m + n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache each cell.', time: 'O(m·n)', space: 'O(m·n)', bottleneck: 'Memo table + recursion.' },
    { id: 'optimal', kind: 'optimal', name: 'Rolling row', idea: 'One row of best totals.', time: 'O(m·n)', space: 'O(n)' },
  ],
  takeaway: 'Cost **+ min(up, left)**.',
  video,
  videoArgs: [G],
  judge: {
    type: 'fn', fn: 'minPathSum', params: ['int[][]'], ret: 'int',
    tests: [{ args: [[[1, 3, 1], [1, 5, 1], [4, 2, 1]]], out: 7 }, { args: [[[1, 2, 3], [4, 5, 6]]], out: 12 }, { args: [[[5]]], out: 5 }, { args: [G], out: minSum(G) }],
    gen: (r: Rng) => { const R = r.int(1, 7), C = r.int(1, 7); return [Array.from({ length: R }, () => Array.from({ length: C }, () => r.int(0, 9)))]; },
    ref: (g: number[][]) => minSum(g),
  },
};

export default problem;
