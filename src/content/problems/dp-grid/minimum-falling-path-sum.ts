import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { fill2D } from '../../dpviz';

const A = [[2, 1, 3, 5], [6, 5, 4, 1], [7, 8, 9, 2], [3, 6, 1, 4]];
function tbl(a: number[][]) { const n = a.length; const d = a.map((r) => [...r]); for (let r = 1; r < n; r++) for (let c = 0; c < n; c++) d[r][c] = a[r][c] + Math.min(...[c - 1, c, c + 1].filter((k) => k >= 0 && k < n).map((k) => d[r - 1][k])); return d; }
function falling(a: number[][]) { return Math.min(...tbl(a)[a.length - 1]); }

function video() {
  const v = new Video('minimum-falling-path-sum', 'Minimum Falling Path Sum');
  const n = A.length;
  const d = tbl(A);
  const ans = falling(A);
  v.chapter('intro', 'The problem');
  v.grid('g', A, { label: 'n × n matrix' });
  v.say('Start anywhere in the top row and fall to the bottom row. From a cell you may move to the cell directly below or diagonally left or right below it. Find the smallest sum.');
  v.eq(`answer: ${ans}`);

  v.chapter('brute', 'Brute force: from every top cell, try all three moves', { cx: 'O(n · 3ⁿ)', code: ['fall(r, c) = a[r][c] + min(fall(r+1, c−1), fall(r+1, c), fall(r+1, c+1))', 'answer = min over top cells'] });
  v.eq('3 choices per row', 'bad').say('Each step has up to three choices, so each starting cell explores up to three to the n paths.');

  v.chapter('better', 'Better: memoise fall(r, c)', { cx: 'O(n²)', code: ['cache fall(r, c)'] });
  v.eq('n² cells, 3 lookups each', 'warn').say('Each cell is one subproblem, shared by all starting cells: n squared total.');

  v.chapter('optimal', 'Optimal: row by row, keep the previous row', { cx: 'O(n²) time, O(n) space', code: ['dp = top row', 'for r in 1..n−1:', '  dp[r][c] = a[r][c] + min(dp[r−1][c−1 .. c+1])', 'answer = min(last row)'] });
  v.clear();
  v.grid('in', A, { label: 'matrix' });
  const g = v.grid('dp', A.map((row, r) => (r === 0 ? row : row.map(() => ''))), { label: 'dp = cheapest fall ending here' });
  v.layout('row');
  v.line(0).say('The top row costs just its own numbers. Every cell below adds its number to the cheapest of the up to three cells above it that could fall into it.');
  const cells: [number, number][] = [];
  for (let r = 1; r < n; r++) for (let c = 0; c < n; c++) cells.push([r, c]);
  fill2D(v, g, cells, {
    deps: (r, c) => { const ks = [c - 1, c, c + 1].filter((k) => k >= 0 && k < n); const m = Math.min(...ks.map((k) => d[r - 1][k])); return [[r - 1, ks.find((k) => d[r - 1][k] === m)!]]; },
    val: (r, c) => d[r][c], line: [2],
    eq: (r, c) => { const ks = [c - 1, c, c + 1].filter((k) => k >= 0 && k < n); return `dp[${r}][${c}] = ${A[r][c]} + min(${ks.map((k) => d[r - 1][k]).join(', ')}) = ${d[r][c]}`; },
    say: (r, c) => (r === 1 && c === 0 ? 'An edge cell only has two cells above it that can reach it.' : r === 1 && c === 1 ? 'A middle cell has three candidates. The arrow marks the cheapest one.' : undefined),
    hold: 380,
  });
  const col = d[n - 1].indexOf(ans);
  g.tone(n - 1, col, 'ok');
  v.line(3).eq(`min(last row) = min(${d[n - 1].join(', ')}) = ${ans}`, 'ok').say(`The fall can end anywhere, so the answer is the smallest value in the last row: ${words(ans)}.`);
  v.answer(ans);

  recap(v, [{ name: 'Recursion from each top cell', time: 'O(n · 3ⁿ)', space: 'O(n)' }, { name: 'Memoisation', time: 'O(n²)', space: 'O(n²)' }, { name: 'Row by row', time: 'O(n²)', space: 'O(n)' }], 'dp = cell + min of up to three cells above.', ['Falling / descending paths with diagonal moves → row DP'], 'Watch the edges: only two parents there.');
  return v.build();
}

const problem: Problem = {
  slug: 'minimum-falling-path-sum',
  statement: 'Given an `n × n` integer matrix, return the minimum sum of any falling path. A falling path starts at any element of the first row and chooses the element in the next row that is directly below or diagonally left/right.',
  examples: [{ input: 'matrix = [[2,1,3],[6,5,4],[7,8,9]]', output: '13' }, { input: 'matrix = [[-19,57],[-40,-5]]', output: '-59' }],
  constraints: ['1 ≤ n ≤ 100', '−100 ≤ matrix[i][j] ≤ 100'],
  hints: ['Each cell can be reached from up to three cells above.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'From each top cell, try all three moves.', time: 'O(n · 3ⁿ)', space: 'O(n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache fall(r, c).', time: 'O(n²)', space: 'O(n²)', bottleneck: 'Memo table.' },
    { id: 'optimal', kind: 'optimal', name: 'Row by row', idea: 'Keep only the previous row.', time: 'O(n²)', space: 'O(n)' },
  ],
  takeaway: 'Cell **+ min of three above**.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'minFallingPathSum', params: ['int[][]'], ret: 'int',
    tests: [{ args: [[[2, 1, 3], [6, 5, 4], [7, 8, 9]]], out: 13 }, { args: [[[-19, 57], [-40, -5]]], out: -59 }, { args: [[[7]]], out: 7 }, { args: [A], out: falling(A) }],
    gen: (r: Rng) => { const n = r.int(1, 7); return [Array.from({ length: n }, () => Array.from({ length: n }, () => r.int(-20, 20)))]; },
    ref: (a: number[][]) => falling(a),
  },
};

export default problem;
