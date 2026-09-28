import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { callTree, fill2D } from '../../dpviz';

const X = 'abcbdab', Y = 'bdcaba';
function tbl(x: string, y: string) { const d = Array.from({ length: x.length + 1 }, () => Array(y.length + 1).fill(0)); for (let i = 1; i <= x.length; i++) for (let j = 1; j <= y.length; j++) d[i][j] = x[i - 1] === y[j - 1] ? d[i - 1][j - 1] + 1 : Math.max(d[i - 1][j], d[i][j - 1]); return d; }
function lcs(x: string, y: string) { return tbl(x, y)[x.length][y.length]; }

function video() {
  const v = new Video('longest-common-subsequence', 'Longest Common Subsequence');
  const d = tbl(X, Y);
  const m = X.length, n = Y.length;
  v.chapter('intro', 'The problem');
  v.array('x', X.split(''), { label: 'text1' });
  v.array('y', Y.split(''), { label: 'text2' });
  v.say('Find the length of the longest sequence of characters that appears, in order, in both strings.');
  v.eq(`answer: ${lcs(X, Y)} (e.g. "bcba")`);

  v.chapter('brute', 'Brute force: compare the last characters recursively', { cx: 'O(2^(m+n))', code: ['lcs(i, j): if i == 0 or j == 0: 0', '  x[i−1] == y[j−1] → 1 + lcs(i−1, j−1)', '  else max(lcs(i−1, j), lcs(i, j−1))'] });
  v.clear();
  const sx = 'abc', sy = 'bd';
  const t = callTree<[number, number]>(v, 'rt', `lcs(i, j) for "${sx}" and "${sy}"`, [3, 2], {
    kids: ([i, j]) => (i === 0 || j === 0 ? [] : sx[i - 1] === sy[j - 1] ? [[i - 1, j - 1]] : [[i - 1, j], [i, j - 1]]),
    key: String, text: ([i, j]) => `${i},${j}`, lines: { call: [1, 2], base: [0] }, hold: 330,
    say: ([i, j], info) => (info.calls === 1 ? 'C and d differ, so one of them is not in the answer: try dropping each.' : info.repeat ? 'The same pair of prefixes is reached twice.' : undefined),
  });
  v.eq(`${t.calls} calls even here · exponential`, 'bad').say('When the characters keep differing, every call branches in two, and pairs of prefixes repeat.');

  v.chapter('better', 'Better: memoise lcs(i, j)', { cx: 'O(m·n)', code: ['cache lcs(i, j)'] });
  v.eq('(m+1)(n+1) pairs of prefixes', 'warn').say('There are only m plus one times n plus one pairs of prefixes. Caching them makes it m times n.');

  v.chapter('optimal', 'Optimal: fill the table row by row', { cx: 'O(m·n) time, O(n) space', code: ['row 0 and column 0 are 0', 'match: dp[i][j] = dp[i−1][j−1] + 1', 'else: dp[i][j] = max(dp[i−1][j], dp[i][j−1])', 'answer = dp[m][n]'] });
  v.clear();
  const g = v.grid('dp', d.map((row, i) => row.map((x, j) => (i === 0 || j === 0 ? 0 : ''))), { label: 'dp[i][j] = LCS of the first i and j characters' });
  g.heads(['""', ...X.split('')], ['""', ...Y.split('')]);
  v.line(0).say('Row i is the first i letters of text one, column j the first j letters of text two. A green cell is a match, which extends the diagonal by one.');
  const cells: [number, number][] = [];
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) cells.push([i, j]);
  fill2D(v, g, cells, {
    deps: (i, j) => (X[i - 1] === Y[j - 1] ? [[i - 1, j - 1]] : [d[i - 1][j] >= d[i][j - 1] ? [i - 1, j] : [i, j - 1]]),
    val: (i, j) => d[i][j], tone: (i, j) => (X[i - 1] === Y[j - 1] ? 'ok' : 'active'),
    line: (i, j) => (X[i - 1] === Y[j - 1] ? [1] : [2]),
    eq: (i, j) => (X[i - 1] === Y[j - 1] ? `'${X[i - 1]}' = '${Y[j - 1]}' → ${d[i - 1][j - 1]} + 1 = ${d[i][j]}` : `'${X[i - 1]}' ≠ '${Y[j - 1]}' → max(${d[i - 1][j]}, ${d[i][j - 1]}) = ${d[i][j]}`),
    say: (i, j) => (i === 1 && j === 4 ? 'A meets a: a match, one plus the diagonal zero.' : i === 2 && j === 1 ? 'B meets b: another match.' : undefined),
    hold: 180,
  });
  g.tone(m, n, 'ok');
  v.line(3).eq(`dp[${m}][${n}] = ${d[m][n]}`, 'ok').say(`The longest common subsequence has length ${words(d[m][n])}. Following the arrows back from the corner recovers one such subsequence. Only the previous row is needed for the length.`);
  v.answer(lcs(X, Y));

  recap(v, [{ name: 'Recursion', time: 'O(2^(m+n))', space: 'O(m + n)' }, { name: 'Memoisation', time: 'O(m·n)', space: 'O(m·n)' }, { name: 'Table, rolling row', time: 'O(m·n)', space: 'O(n)' }], 'Match → diagonal + 1; else max(up, left).', ['Common subsequence of two sequences → LCS table'], 'dp[i][j] compares x[i−1] and y[j−1].');
  return v.build();
}

const problem: Problem = {
  slug: 'longest-common-subsequence',
  statement: 'Given two strings `text1` and `text2`, return the length of their longest common subsequence, or 0 if there is none.',
  examples: [{ input: 'text1 = "abcde", text2 = "ace"', output: '3' }, { input: 'text1 = "abc", text2 = "abc"', output: '3' }, { input: 'text1 = "abc", text2 = "def"', output: '0' }],
  constraints: ['1 ≤ text1.length, text2.length ≤ 1000', 'lowercase English letters'],
  hints: ['Compare the last characters of the two prefixes.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Match → both shrink; else try dropping either.', time: 'O(2^(m+n))', space: 'O(m + n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache lcs(i, j).', time: 'O(m·n)', space: 'O(m·n)', bottleneck: 'Recursion + table.' },
    { id: 'optimal', kind: 'optimal', name: 'Rolling rows', idea: 'Bottom-up table keeping two rows.', time: 'O(m·n)', space: 'O(n)' },
  ],
  takeaway: 'Match → **diag + 1**, else **max(up, left)**.',
  video,
  videoArgs: [X, Y],
  judge: {
    type: 'fn', fn: 'longestCommonSubsequence', params: ['String', 'String'], ret: 'int',
    tests: [{ args: ['abcde', 'ace'], out: 3 }, { args: ['abc', 'abc'], out: 3 }, { args: ['abc', 'def'], out: 0 }, { args: [X, Y], out: lcs(X, Y) }],
    gen: (r: Rng) => { const al = 'abc'; const s = () => Array.from({ length: r.int(1, 9) }, () => al[r.int(0, 2)]).join(''); return [s(), s()]; },
    ref: (x: string, y: string) => lcs(x, y),
  },
};

export default problem;
