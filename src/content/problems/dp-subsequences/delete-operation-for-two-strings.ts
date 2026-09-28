import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { fill2D } from '../../dpviz';

const X = 'sea', Y = 'eat';
function lcsT(x: string, y: string) { const d = Array.from({ length: x.length + 1 }, () => Array(y.length + 1).fill(0)); for (let i = 1; i <= x.length; i++) for (let j = 1; j <= y.length; j++) d[i][j] = x[i - 1] === y[j - 1] ? d[i - 1][j - 1] + 1 : Math.max(d[i - 1][j], d[i][j - 1]); return d; }
function steps(x: string, y: string) { return x.length + y.length - 2 * lcsT(x, y)[x.length][y.length]; }

function video() {
  const v = new Video('delete-operation-for-two-strings', 'Delete Operation for Two Strings');
  const d = lcsT(X, Y);
  const m = X.length, n = Y.length, L = d[m][n];
  v.chapter('intro', 'The problem');
  v.array('x', X.split(''), { label: 'word1' });
  v.array('y', Y.split(''), { label: 'word2' });
  v.say('In one step you may delete one character from either string. What is the fewest steps to make the two strings equal?');
  v.eq(`answer: ${steps(X, Y)} (delete s from "sea", t from "eat")`);

  v.chapter('insight', 'What survives is a common subsequence');
  v.say('Whatever is left at the end is a common subsequence of both words, since deleting keeps the order. To delete as little as possible, keep the longest common subsequence and delete everything else: m minus LCS from the first word, n minus LCS from the second.');

  v.chapter('brute', 'Brute force: recursion on the last characters', { cx: 'O(2^(m+n))', code: ['del(i, j): i == 0 → j; j == 0 → i', '  equal → del(i−1, j−1)', '  else 1 + min(del(i−1, j), del(i, j−1))'] });
  v.eq('two branches on every mismatch', 'bad').say('Directly: if the last characters match, keep both; otherwise delete one of them and recurse. Exponential without caching.');

  v.chapter('better', 'Better: memoise', { cx: 'O(m·n)', code: ['cache del(i, j)'] });
  v.eq('(m+1)(n+1) states', 'warn').say('Caching pairs of prefixes gives m times n.');

  v.chapter('optimal', 'Optimal: LCS table, then m + n − 2·LCS', { cx: 'O(m·n) time, O(n) space', code: ['dp = LCS table of word1 and word2', 'answer = m + n − 2 · dp[m][n]'] });
  v.clear();
  const g = v.grid('dp', d.map((row, i) => row.map((x, j) => (i === 0 || j === 0 ? 0 : ''))), { label: 'LCS of prefixes' });
  g.heads(['""', ...X.split('')], ['""', ...Y.split('')]);
  v.line(0).say('Fill the usual LCS table.');
  const cells: [number, number][] = [];
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) cells.push([i, j]);
  fill2D(v, g, cells, {
    deps: (i, j) => (X[i - 1] === Y[j - 1] ? [[i - 1, j - 1]] : [d[i - 1][j] >= d[i][j - 1] ? [i - 1, j] : [i, j - 1]]),
    val: (i, j) => d[i][j], tone: (i, j) => (X[i - 1] === Y[j - 1] ? 'ok' : 'active'), line: [0],
    eq: (i, j) => (X[i - 1] === Y[j - 1] ? `'${X[i - 1]}' = '${Y[j - 1]}' → ${d[i][j]}` : `max(${d[i - 1][j]}, ${d[i][j - 1]}) = ${d[i][j]}`),
    say: (i, j) => (i === 2 && j === 1 ? 'E matches e.' : i === 3 && j === 2 ? 'A matches a, extending the diagonal to two: "ea".' : undefined),
    hold: 450,
  });
  g.tone(m, n, 'ok');
  v.line(1).eq(`${m} + ${n} − 2·${L} = ${steps(X, Y)}`, 'ok').say(`The longest common subsequence is "ea", length ${words(L)}. Delete the other ${words(m - L)} letter from sea and ${words(n - L)} from eat: ${words(steps(X, Y))} steps.`);
  v.answer(steps(X, Y));

  recap(v, [{ name: 'Recursion', time: 'O(2^(m+n))', space: 'O(m + n)' }, { name: 'Memoisation', time: 'O(m·n)', space: 'O(m·n)' }, { name: 'LCS, two rows', time: 'O(m·n)', space: 'O(n)' }], 'Keep the LCS, delete the rest: m + n − 2·LCS.', ['Deletions only to make strings equal → LCS'], 'Reduce to a known problem.');
  return v.build();
}

const problem: Problem = {
  slug: 'delete-operation-for-two-strings',
  statement: 'Given two strings `word1` and `word2`, return the minimum number of steps required to make them the same, where each step deletes exactly one character from either string.',
  examples: [{ input: 'word1 = "sea", word2 = "eat"', output: '2' }, { input: 'word1 = "leetcode", word2 = "etco"', output: '4' }],
  constraints: ['1 ≤ word1.length, word2.length ≤ 500', 'lowercase English letters'],
  hints: ['What remains is a common subsequence.', 'Answer = m + n − 2 · LCS.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Match → both shrink; else delete one side.', time: 'O(2^(m+n))', space: 'O(m + n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache del(i, j).', time: 'O(m·n)', space: 'O(m·n)', bottleneck: 'Table + recursion.' },
    { id: 'optimal', kind: 'optimal', name: 'Via LCS', idea: 'm + n − 2·LCS with rolling rows.', time: 'O(m·n)', space: 'O(n)' },
  ],
  takeaway: 'Keep the **LCS**.',
  video,
  videoArgs: [X, Y],
  judge: {
    type: 'fn', fn: 'minDistance', params: ['String', 'String'], ret: 'int',
    tests: [{ args: ['sea', 'eat'], out: 2 }, { args: ['leetcode', 'etco'], out: 4 }, { args: ['a', 'a'], out: 0 }, { args: ['a', 'b'], out: 2 }],
    gen: (r: Rng) => { const al = 'abc'; const s = () => Array.from({ length: r.int(1, 8) }, () => al[r.int(0, 2)]).join(''); return [s(), s()]; },
    ref: (x: string, y: string) => steps(x, y),
  },
};

export default problem;
