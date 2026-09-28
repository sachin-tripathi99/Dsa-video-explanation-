import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { fill2D } from '../../dpviz';

const S = 'rabbbit', T = 'rabbit';
function tbl(s: string, t: string) { const d: number[][] = Array.from({ length: s.length + 1 }, (_, i) => Array.from({ length: t.length + 1 }, (_, j) => (j === 0 ? 1 : 0))); for (let i = 1; i <= s.length; i++) for (let j = 1; j <= t.length; j++) d[i][j] = d[i - 1][j] + (s[i - 1] === t[j - 1] ? d[i - 1][j - 1] : 0); return d; }
function count(s: string, t: string) { return tbl(s, t)[s.length][t.length]; }

function video() {
  const v = new Video('distinct-subsequences', 'Distinct Subsequences');
  const d = tbl(S, T);
  const m = S.length, n = T.length;
  v.chapter('intro', 'The problem');
  v.array('s', S.split(''), { label: 's' });
  v.array('t', T.split(''), { label: 't' });
  v.say('Count the ways to delete characters from s so that what remains is exactly t. Two ways are different if they keep different positions.');
  v.eq(`answer: ${count(S, T)} (which one of the three b’s to drop)`);

  v.chapter('brute', 'Brute force: skip or use each character of s', { cx: 'O(2ᵐ)', code: ['ways(i, j): j == n → 1; i == m → 0', '  skip s[i]: ways(i+1, j)', '  if s[i] == t[j]: + ways(i+1, j+1)'] });
  v.eq('two branches whenever the letters match', 'bad').say('Walk through s. Each character is either skipped, or, if it matches the next needed character of t, used. Counting both branches is exponential.');

  v.chapter('better', 'Better: memoise (i, j)', { cx: 'O(m·n)', code: ['cache ways(i, j)'] });
  v.eq('(m+1)(n+1) states', 'warn').say('Only the positions in s and t matter.');

  v.chapter('optimal', 'Optimal: counting table over prefixes', { cx: 'O(m·n) time, O(n) space', code: ['dp[i][0] = 1 (empty t: delete everything)', 'dp[i][j] = dp[i−1][j]                (skip s[i−1])', '        + dp[i−1][j−1] if s[i−1] == t[j−1] (use it)', 'answer = dp[m][n]'] });
  v.clear();
  const g = v.grid('dp', d.map((row, i) => row.map((x, j) => (j === 0 ? 1 : i === 0 ? 0 : ''))), { label: 'dp[i][j] = ways to form t[:j] from s[:i]' });
  g.heads(['""', ...S.split('')], ['""', ...T.split('')]);
  v.line(0).say('dp of i, j counts the ways the first i letters of s can produce the first j letters of t. The empty target can always be produced exactly one way: delete everything. A non-empty target from an empty s: zero ways.');
  const cells: [number, number][] = [];
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) cells.push([i, j]);
  fill2D(v, g, cells, {
    deps: (i, j) => [[i - 1, j], ...(S[i - 1] === T[j - 1] ? [[i - 1, j - 1] as [number, number]] : [])],
    val: (i, j) => d[i][j], tone: (i, j) => (S[i - 1] === T[j - 1] ? 'ok' : 'active'), line: (i, j) => (S[i - 1] === T[j - 1] ? [2] : [1]),
    eq: (i, j) => (S[i - 1] === T[j - 1] ? `'${S[i - 1]}' = '${T[j - 1]}' → skip ${d[i - 1][j]} + use ${d[i - 1][j - 1]} = ${d[i][j]}` : `'${S[i - 1]}' ≠ '${T[j - 1]}' → skip only: ${d[i][j]}`),
    say: (i, j) => (i === 5 && j === 4 ? 'The third b of s can be the second b of t: add the ways the earlier letters made r, a, b. Or skip it and keep the ways already found. Two plus one: three.' : i === 3 && j === 3 ? 'The first b of s can be the first b of t.' : undefined),
    hold: 180,
  });
  g.tone(m, n, 'ok');
  v.line(3).eq(`dp[${m}][${n}] = ${d[m][n]}`, 'ok').say(`${words(d[m][n])[0].toUpperCase()}${words(d[m][n]).slice(1)} ways. Each row only reads the row above, so a single row updated from right to left is enough.`);
  v.answer(count(S, T));

  recap(v, [{ name: 'Skip / use recursion', time: 'O(2ᵐ)', space: 'O(m)' }, { name: 'Memoisation', time: 'O(m·n)', space: 'O(m·n)' }, { name: 'One row, right to left', time: 'O(m·n)', space: 'O(n)' }], 'Match → skip + use; else skip only.', ['Count ways a sequence appears as a subsequence → counting table'], 'dp[i][0] = 1: the empty target.');
  return v.build();
}

const problem: Problem = {
  slug: 'distinct-subsequences',
  statement: 'Given two strings `s` and `t`, return the number of distinct subsequences of `s` which equal `t`. The answer fits in a 32-bit signed integer.',
  examples: [{ input: 's = "rabbbit", t = "rabbit"', output: '3' }, { input: 's = "babgbag", t = "bag"', output: '5' }],
  constraints: ['1 ≤ s.length, t.length ≤ 1000', 'lowercase English letters'],
  hints: ['Each character of s is skipped or used.', 'dp[i][j] = dp[i−1][j] + (match ? dp[i−1][j−1] : 0).'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Skip or use each character of s.', time: 'O(2ᵐ)', space: 'O(m)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache ways(i, j).', time: 'O(m·n)', space: 'O(m·n)', bottleneck: 'Table + recursion.' },
    { id: 'optimal', kind: 'optimal', name: 'One row', idea: 'Update dp[j] for j from n down to 1.', time: 'O(m·n)', space: 'O(n)' },
  ],
  takeaway: 'Match → **skip + use**.',
  video,
  videoArgs: [S, T],
  judge: {
    type: 'fn', fn: 'numDistinct', params: ['String', 'String'], ret: 'int',
    tests: [{ args: [S, T], out: 3 }, { args: ['babgbag', 'bag'], out: 5 }, { args: ['a', 'b'], out: 0 }, { args: ['aaa', 'a'], out: 3 }],
    gen: (r: Rng) => { const al = 'ab'; const s = (k: number) => Array.from({ length: k }, () => al[r.int(0, 1)]).join(''); return [s(r.int(1, 12)), s(r.int(1, 4))]; },
    ref: (s: string, t: string) => count(s, t),
  },
};

export default problem;
