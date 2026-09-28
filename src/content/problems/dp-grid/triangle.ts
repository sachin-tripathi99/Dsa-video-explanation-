import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { fill2D } from '../../dpviz';

const T = [[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]];
function tbl(t: number[][]) { const n = t.length; const d = t.map((r) => [...r]); for (let r = n - 2; r >= 0; r--) for (let c = 0; c <= r; c++) d[r][c] = t[r][c] + Math.min(d[r + 1][c], d[r + 1][c + 1]); return d; }
function minTotal(t: number[][]) { return tbl(t)[0][0]; }

function video() {
  const v = new Video('triangle', 'Triangle');
  const n = T.length;
  const d = tbl(T);
  const pad = (rows: (number | string)[][]) => rows.map((row) => [...row, ...Array(n - row.length).fill('')]);
  v.chapter('intro', 'The problem');
  v.grid('g', pad(T), { label: 'triangle (row r has r + 1 numbers)' });
  v.say('Walk from the top of the triangle to the bottom row. From position c you may step to position c or c plus one in the row below. Find the smallest possible sum.');
  v.eq(`answer: ${minTotal(T)} (2 + 3 + 5 + 1)`);

  v.chapter('brute', 'Brute force: try both steps from every cell', { cx: 'O(2ⁿ)', code: ['best(r, c) = t[r][c] + min(best(r+1, c), best(r+1, c+1))', 'bottom row: best = t[r][c]'] });
  v.eq(`2^${n - 1} = ${2 ** (n - 1)} paths here`, 'bad').say('From the top, every step branches two ways, so there are two to the n minus one paths, and the recursion revisits middle cells from both parents.');

  v.chapter('better', 'Better: memoise best(r, c)', { cx: 'O(n²)', code: ['cache best(r, c)'] });
  v.eq('n(n+1)/2 cells', 'warn').say('Each position is one subproblem: caching makes the work the size of the triangle.');

  v.chapter('optimal', 'Optimal: fold the triangle from the bottom up', { cx: 'O(n²) time, O(n) space', code: ['dp = copy of the bottom row', 'for r from n−2 up to 0:', '  dp[c] = t[r][c] + min(dp[c], dp[c+1])', 'return dp[0]'] });
  v.clear();
  v.grid('in', pad(T), { label: 'triangle' });
  const g = v.grid('dp', pad(T.map((row, r) => (r === n - 1 ? row : row.map(() => '')))), { label: 'dp = cheapest sum from here to the bottom' });
  v.layout('row');
  v.line(0).say('Work upwards instead. From the bottom row, the cheapest continuation is just the number itself. Every cell above adds its own number to the cheaper of the two cells below it. The top then holds the answer, and there is no need to pick a best bottom cell at the end.');
  const cells: [number, number][] = [];
  for (let r = n - 2; r >= 0; r--) for (let c = 0; c <= r; c++) cells.push([r, c]);
  fill2D(v, g, cells, {
    deps: (r, c) => [d[r + 1][c] <= d[r + 1][c + 1] ? [r + 1, c] : [r + 1, c + 1]],
    val: (r, c) => d[r][c], line: [2],
    eq: (r, c) => `dp[${r}][${c}] = ${T[r][c]} + min(${d[r + 1][c]}, ${d[r + 1][c + 1]}) = ${d[r][c]}`,
    say: (r, c) => (r === n - 2 && c === 0 ? `Six can step onto four or one below it; one is cheaper, so six plus one is seven.` : r === 0 ? `The top: two plus the cheaper of ${words(d[1][0])} and ${words(d[1][1])}. ${words(d[0][0])[0].toUpperCase()}${words(d[0][0]).slice(1)}.` : undefined),
    hold: 500,
  });
  g.tone(0, 0, 'ok');
  v.line(3).eq(`answer = ${d[0][0]}`, 'ok').say(`The minimum path sum is ${words(d[0][0])}. Keeping a single array for the row below gives linear extra space.`);
  v.answer(minTotal(T));

  recap(v, [{ name: 'Recursion', time: 'O(2ⁿ)', space: 'O(n)' }, { name: 'Memoisation', time: 'O(n²)', space: 'O(n²)' }, { name: 'Bottom-up, one row', time: 'O(n²)', space: 'O(n)' }], 'Bottom-up: t[r][c] + min of the two cells below.', ['Paths ending anywhere in the last row → fill from that row upwards'], 'Going bottom-up avoids choosing the best last cell.');
  return v.build();
}

const problem: Problem = {
  slug: 'triangle',
  statement: 'Given a `triangle` array, return the minimum path sum from top to bottom. From index `i` of a row you may move to index `i` or `i + 1` of the next row.',
  examples: [{ input: 'triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]', output: '11' }, { input: 'triangle = [[-10]]', output: '-10' }],
  constraints: ['1 ≤ triangle.length ≤ 200', 'triangle[i].length = i + 1', '−10⁴ ≤ triangle[i][j] ≤ 10⁴'],
  hints: ['Go from the bottom up.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Try both children from every cell.', time: 'O(2ⁿ)', space: 'O(n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache best(r, c).', time: 'O(n²)', space: 'O(n²)', bottleneck: 'Memo table.' },
    { id: 'optimal', kind: 'optimal', name: 'Bottom-up row', idea: 'dp[c] = t[r][c] + min(dp[c], dp[c+1]) from the last row up.', time: 'O(n²)', space: 'O(n)' },
  ],
  takeaway: 'Fold **bottom-up**; the top is the answer.',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'minimumTotal', params: ['List<List<Integer>>'], ret: 'int',
    tests: [{ args: [T], out: 11 }, { args: [[[-10]]], out: -10 }, { args: [[[1], [2, 3]]], out: 3 }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 12) }, (_, i) => Array.from({ length: i + 1 }, () => r.int(-9, 9)))],
    ref: (t: number[][]) => minTotal(t),
  },
};

export default problem;
