import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { fill2D } from '../../dpviz';

const S = 'agbdba';
function tbl(s: string) { const n = s.length; const d = Array.from({ length: n }, () => Array(n).fill(0)); for (let i = n - 1; i >= 0; i--) { d[i][i] = 1; for (let j = i + 1; j < n; j++) d[i][j] = s[i] === s[j] ? 2 + (j - i >= 2 ? d[i + 1][j - 1] : 0) : Math.max(d[i + 1][j], d[i][j - 1]); } return d; }
export function lps(s: string) { return s.length ? tbl(s)[0][s.length - 1] : 0; }

function video() {
  const v = new Video('longest-palindromic-subsequence', 'Longest Palindromic Subsequence');
  const n = S.length;
  const d = tbl(S);
  v.chapter('intro', 'The problem');
  v.array('s', S.split(''), { label: 's' });
  v.say('Find the length of the longest subsequence that is a palindrome. Letters may be skipped, but the order is kept.');
  v.eq(`answer: ${lps(S)} ("abdba")`);

  v.chapter('brute', 'Brute force: compare the two ends recursively', { cx: 'O(2ⁿ)', code: ['lps(i, j): i > j → 0; i == j → 1', '  s[i] == s[j] → 2 + lps(i+1, j−1)', '  else max(lps(i+1, j), lps(i, j−1))'] });
  v.eq('two branches whenever the ends differ', 'bad').say('Look at both ends of the range. If they match, both belong to the palindrome. If not, at least one of them is not used: try dropping each. Exponential without a cache.');

  v.chapter('better', 'Better: memoise lps(i, j)', { cx: 'O(n²)', code: ['cache lps(i, j)'] });
  v.eq('n² ranges', 'warn').say('Only n squared ranges exist. Caching makes it quadratic.');

  v.chapter('optimal', 'Optimal: fill the range table by length', { cx: 'O(n²) time, O(n) space', code: ['dp[i][i] = 1', 's[i] == s[j] → dp[i][j] = 2 + dp[i+1][j−1]', 'else dp[i][j] = max(dp[i+1][j], dp[i][j−1])', 'answer = dp[0][n−1]'] });
  v.clear();
  const g = v.grid('dp', d.map((row, i) => row.map((_, j) => (j < i ? '·' : ''))), { label: 'dp[i][j] = longest palindromic subsequence of s[i..j]' });
  g.heads(S.split('').map((c, i) => `${i} ${c}`), S.split('').map((c, j) => `${j} ${c}`));
  v.line(0).say('Each cell depends on shorter ranges: the inside, or the range without one end. So fill the diagonals in order of length, from single letters up to the whole string.');
  const cells: [number, number][] = [];
  for (let len = 1; len <= n; len++) for (let i = 0; i + len - 1 < n; i++) cells.push([i, i + len - 1]);
  fill2D(v, g, cells, {
    deps: (i, j) => (i === j ? [] : S[i] === S[j] ? (j - i >= 2 ? [[i + 1, j - 1]] : []) : [d[i + 1][j] >= d[i][j - 1] ? [i + 1, j] : [i, j - 1]]),
    val: (i, j) => d[i][j], tone: (i, j) => (i !== j && S[i] === S[j] ? 'ok' : 'active'), line: (i, j) => (i === j ? [0] : S[i] === S[j] ? [1] : [2]),
    eq: (i, j) => (i === j ? `'${S[i]}' → 1` : S[i] === S[j] ? `'${S[i]}' = '${S[j]}' → 2 + ${j - i >= 2 ? d[i + 1][j - 1] : 0} = ${d[i][j]}` : `'${S[i]}' ≠ '${S[j]}' → max(${d[i + 1][j]}, ${d[i][j - 1]}) = ${d[i][j]}`),
    say: (i, j) => (i === 2 && j === 4 ? 'B and b match around d: two plus one, bdb.' : i === 0 && j === n - 1 ? 'The whole string: a and a match around the best of the inside, gbdb, which is three. Five.' : undefined),
    hold: 260,
  });
  g.tone(0, n - 1, 'ok');
  v.line(3).eq(`dp[0][${n - 1}] = ${d[0][n - 1]}`, 'ok').say(`The top-right cell holds ${words(d[0][n - 1])}: a, b, d, b, a. Filling with i from the end and j forwards, one row is enough.`);
  v.answer(lps(S));

  recap(v, [{ name: 'Recursion on the ends', time: 'O(2ⁿ)', space: 'O(n)' }, { name: 'Memoisation', time: 'O(n²)', space: 'O(n²)' }, { name: 'Range table, one row', time: 'O(n²)', space: 'O(n)' }], 'Ends match → 2 + inside; else drop an end.', ['Longest palindromic subsequence → interval DP (= LCS with the reverse)'], 'Fill ranges shortest first.');
  return v.build();
}

const problem: Problem = {
  slug: 'longest-palindromic-subsequence',
  statement: 'Given a string `s`, return the length of its longest palindromic subsequence.',
  examples: [{ input: 's = "bbbab"', output: '4' }, { input: 's = "cbbd"', output: '2' }],
  constraints: ['1 ≤ s.length ≤ 1000', 'lowercase English letters'],
  hints: ['Compare s[i] and s[j].'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Ends match → keep both; else drop one.', time: 'O(2ⁿ)', space: 'O(n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache lps(i, j).', time: 'O(n²)', space: 'O(n²)', bottleneck: 'Table + recursion.' },
    { id: 'optimal', kind: 'optimal', name: 'Range table, one row', idea: 'i from n−1 down, j upward, one rolling row.', time: 'O(n²)', space: 'O(n)' },
  ],
  takeaway: 'Ends match → **2 + inside**.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'longestPalindromeSubseq', params: ['String'], ret: 'int',
    tests: [{ args: ['bbbab'], out: 4 }, { args: ['cbbd'], out: 2 }, { args: ['a'], out: 1 }, { args: [S], out: lps(S) }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 12) }, () => 'abc'[r.int(0, 2)]).join('')],
    ref: (s: string) => lps(s),
  },
};

export default problem;
