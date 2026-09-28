import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { callTree, fill2D } from '../../dpviz';

const M = 3, N = 7;
function paths(m: number, n: number) { const row = Array(n).fill(1); for (let r = 1; r < m; r++) for (let c = 1; c < n; c++) row[c] += row[c - 1]; return row[n - 1]; }

function video() {
  const v = new Video('unique-paths', 'Unique Paths');
  const P = (r: number, c: number) => paths(r + 1, c + 1);
  v.chapter('intro', 'The problem');
  const g0 = v.grid('g', Array.from({ length: M }, () => Array(N).fill('')), { label: `${M} × ${N} grid` });
  g0.set(0, 0, '🤖').set(M - 1, N - 1, '🏁');
  v.say(`A robot in the top-left corner of a ${words(M)} by ${words(N)} grid can only move right or down. How many different paths lead to the bottom-right corner?`);
  v.eq(`answer: ${paths(M, N)}`);

  v.chapter('brute', 'Brute force: recursion on the last move', { cx: 'O(2^(m+n))', code: ['paths(r, c): if r == 0 or c == 0: return 1', 'return paths(r − 1, c) + paths(r, c − 1)'] });
  v.clear();
  const t = callTree<[number, number]>(v, 'rt', 'calls for a 3 × 3 corner (2, 2)', [2, 2], {
    kids: ([r, c]) => (r === 0 || c === 0 ? [] : [[r - 1, c], [r, c - 1]]), key: String, text: ([r, c]) => `${r},${c}`,
    lines: { call: [1], base: [0] },
    say: ([r, c], i) => (i.calls === 1 ? 'The last move into a cell came from above or from the left, so add the paths to those two cells.' : i.repeat && r === 1 && c === 1 ? 'Cell one, one is solved twice.' : undefined),
    hold: 300,
  });
  v.eq(`${t.calls} calls for 3 × 3 · exponential`, 'bad').say('The number of calls grows like the number of paths itself, which is exponential in the grid size.');

  v.chapter('better', 'Better: memoise each cell', { cx: 'O(m·n) time and space', code: ['memo[r][c] computed once'] });
  v.eq('m·n cells, O(1) each', 'warn').say('Each cell is only one subproblem. Caching turns the exponential tree into m times n work.');

  v.chapter('optimal', 'Optimal: fill a table, then keep one row', { cx: 'O(m·n) time, O(n) space', code: ['first row and column: 1', 'dp[r][c] = dp[r−1][c] + dp[r][c−1]', 'rolling row: row[c] += row[c − 1]'] });
  v.clear();
  const g = v.grid('dp', Array.from({ length: M }, (_, r) => Array.from({ length: N }, (_, c) => (r === 0 || c === 0 ? 1 : ''))), { label: 'dp[r][c] = paths to (r, c)' });
  v.line(0).say('The top row and left column have only one path each. Then fill row by row: every cell is the sum of the cell above and the cell to its left.');
  const cells: [number, number][] = [];
  for (let r = 1; r < M; r++) for (let c = 1; c < N; c++) cells.push([r, c]);
  fill2D(v, g, cells, {
    deps: (r, c) => [[r - 1, c], [r, c - 1]], val: P, line: [1],
    eq: (r, c) => `dp[${r}][${c}] = ${P(r - 1, c)} + ${P(r, c - 1)} = ${P(r, c)}`,
    say: (r, c) => (r === 1 && c === 1 ? 'Two paths reach cell one, one.' : r === 2 && c === 1 ? 'Row two starts: three paths reach cell two, one.' : undefined),
    hold: 380,
  });
  g.tone(M - 1, N - 1, 'ok');
  v.line(2).eq(`answer = ${paths(M, N)}`, 'ok').say(`${words(paths(M, N))[0].toUpperCase()}${words(paths(M, N)).slice(1)} paths. Only the previous row is ever read, so one row of length n is enough. There is also a closed form: choose which m minus one of the m plus n minus two moves go down.`);
  v.answer(paths(M, N));

  recap(v, [{ name: 'Recursion', time: 'O(2^(m+n))', space: 'O(m + n)' }, { name: 'Memoisation', time: 'O(m·n)', space: 'O(m·n)' }, { name: 'Rolling row', time: 'O(m·n)', space: 'O(n)' }], 'paths(r, c) = paths(r−1, c) + paths(r, c−1).', ['Count right/down paths → grid DP (or C(m+n−2, m−1))'], 'Edges of the grid have exactly one path.');
  return v.build();
}

const problem: Problem = {
  slug: 'unique-paths',
  statement: 'A robot is located at the top-left corner of an `m × n` grid and can only move down or right. How many unique paths lead to the bottom-right corner?',
  examples: [{ input: 'm = 3, n = 7', output: '28' }, { input: 'm = 3, n = 2', output: '3' }],
  constraints: ['1 ≤ m, n ≤ 100', 'the answer is at most 2 · 10⁹'],
  hints: ['The last move came from above or from the left.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Sum paths from above and from the left.', time: 'O(2^(m+n))', space: 'O(m + n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache each cell.', time: 'O(m·n)', space: 'O(m·n)', bottleneck: 'Full table.' },
    { id: 'optimal', kind: 'optimal', name: 'Rolling row', idea: 'row[c] += row[c − 1] for each row.', time: 'O(m·n)', space: 'O(n)' },
  ],
  takeaway: '**Above + left.**',
  video,
  videoArgs: [M, N],
  judge: {
    type: 'fn', fn: 'uniquePaths', params: ['int', 'int'], ret: 'int',
    tests: [{ args: [3, 7], out: 28 }, { args: [3, 2], out: 3 }, { args: [1, 1], out: 1 }, { args: [23, 12], out: paths(23, 12), big: true }],
    gen: (r: Rng) => [r.int(1, 9), r.int(1, 9)],
    ref: (m: number, n: number) => paths(m, n),
  },
};

export default problem;
