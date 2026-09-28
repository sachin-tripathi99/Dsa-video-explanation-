import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { fill2D } from '../../dpviz';

const S = 'mbadm';
function tbl(s: string) { const n = s.length; const d = Array.from({ length: n }, () => Array(n).fill(0)); for (let i = n - 1; i >= 0; i--) for (let j = i + 1; j < n; j++) d[i][j] = s[i] === s[j] ? (j - i >= 2 ? d[i + 1][j - 1] : 0) : 1 + Math.min(d[i + 1][j], d[i][j - 1]); return d; }
function ins(s: string) { return s.length ? tbl(s)[0][s.length - 1] : 0; }

function video() {
  const v = new Video('minimum-insertion-steps-to-make-a-string-palindrome', 'Minimum Insertion Steps to Make a String Palindrome');
  const n = S.length;
  const d = tbl(S);
  v.chapter('intro', 'The problem');
  v.array('s', S.split(''), { label: 's' });
  v.say('Insert characters anywhere in the string to turn it into a palindrome. What is the fewest insertions needed?');
  v.eq(`answer: ${ins(S)} ("mbadm" → "mbdadbm")`);
  v.say('Another view: keep the longest palindromic subsequence as it is, and give every other letter a mirror partner. So the answer is n minus the longest palindromic subsequence.');

  v.chapter('brute', 'Brute force: fix the two ends recursively', { cx: 'O(2ⁿ)', code: ['ins(i, j): i ≥ j → 0', '  s[i] == s[j] → ins(i+1, j−1)', '  else 1 + min(ins(i+1, j), ins(i, j−1))'] });
  v.eq('two branches on every mismatch', 'bad').say('If the two ends match, they already mirror each other. If not, insert a copy of one end on the other side, costing one, and solve the rest. Trying both sides is exponential.');

  v.chapter('better', 'Better: memoise ins(i, j)', { cx: 'O(n²)', code: ['cache ins(i, j)'] });
  v.eq('n² ranges', 'warn').say('Only n squared ranges exist, so caching makes it quadratic.');

  v.chapter('optimal', 'Optimal: range table by length', { cx: 'O(n²) time, O(n) space', code: ['dp[i][i] = 0', 's[i] == s[j] → dp[i][j] = dp[i+1][j−1]', 'else dp[i][j] = 1 + min(dp[i+1][j], dp[i][j−1])', 'answer = dp[0][n−1]  (= n − LPS)'] });
  v.clear();
  const g = v.grid('dp', d.map((row, i) => row.map((_, j) => (j < i ? '·' : i === j ? 0 : ''))), { label: 'dp[i][j] = insertions to make s[i..j] a palindrome' });
  g.heads(S.split('').map((c, i) => `${i} ${c}`), S.split('').map((c, j) => `${j} ${c}`));
  v.line(0).say('Single letters are already palindromes: zero. Fill longer ranges after shorter ones.');
  const cells: [number, number][] = [];
  for (let len = 2; len <= n; len++) for (let i = 0; i + len - 1 < n; i++) cells.push([i, i + len - 1]);
  fill2D(v, g, cells, {
    deps: (i, j) => (S[i] === S[j] ? (j - i >= 2 ? [[i + 1, j - 1]] : []) : [d[i + 1][j] <= d[i][j - 1] ? [i + 1, j] : [i, j - 1]]),
    val: (i, j) => d[i][j], tone: (i, j) => (S[i] === S[j] ? 'ok' : 'active'), line: (i, j) => (S[i] === S[j] ? [1] : [2]),
    eq: (i, j) => (S[i] === S[j] ? `'${S[i]}' = '${S[j]}' → inside: ${d[i][j]}` : `'${S[i]}' ≠ '${S[j]}' → 1 + min(${d[i + 1][j]}, ${d[i][j - 1]}) = ${d[i][j]}`),
    say: (i, j) => (i === 0 && j === 1 ? 'M and b differ: insert one letter to mirror the other. One.' : i === 0 && j === n - 1 ? `M and m match, so the answer is whatever the inside, b a d, needs: ${words(d[1][n - 2])}.` : undefined),
    hold: 380,
  });
  g.tone(0, n - 1, 'ok');
  v.line(3).eq(`dp[0][${n - 1}] = ${d[0][n - 1]}`, 'ok').say(`${words(d[0][n - 1])[0].toUpperCase()}${words(d[0][n - 1]).slice(1)} insertions. The longest palindromic subsequence here is m a m, length three, and five minus three is two, as expected.`);
  v.answer(ins(S));

  recap(v, [{ name: 'Recursion', time: 'O(2ⁿ)', space: 'O(n)' }, { name: 'Memoisation', time: 'O(n²)', space: 'O(n²)' }, { name: 'Range table, one row', time: 'O(n²)', space: 'O(n)' }], 'Insertions = n − longest palindromic subsequence.', ['Make a palindrome with insertions or deletions → n − LPS'], 'Matching ends cost nothing.');
  return v.build();
}

const problem: Problem = {
  slug: 'minimum-insertion-steps-to-make-a-string-palindrome',
  statement: 'Given a string `s`, in one step you can insert any character at any index. Return the minimum number of steps to make `s` a palindrome.',
  examples: [{ input: 's = "zzazz"', output: '0' }, { input: 's = "mbadm"', output: '2' }, { input: 's = "leetcode"', output: '5' }],
  constraints: ['1 ≤ s.length ≤ 500', 'lowercase English letters'],
  hints: ['Matching ends need nothing.', 'Answer = n − longest palindromic subsequence.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Match → shrink both; else insert on one side.', time: 'O(2ⁿ)', space: 'O(n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache ins(i, j).', time: 'O(n²)', space: 'O(n²)', bottleneck: 'Table + recursion.' },
    { id: 'optimal', kind: 'optimal', name: 'Range table', idea: 'n − LPS with one rolling row.', time: 'O(n²)', space: 'O(n)' },
  ],
  takeaway: '**n − LPS**.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'minInsertions', params: ['String'], ret: 'int',
    tests: [{ args: ['zzazz'], out: 0 }, { args: ['mbadm'], out: 2 }, { args: ['leetcode'], out: 5 }, { args: ['a'], out: 0 }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 12) }, () => 'abc'[r.int(0, 2)]).join('')],
    ref: (s: string) => ins(s),
  },
};

export default problem;
