import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';
import { fill1D, fill2D } from '../../dpviz';

const A = [3, 1, 4, 1, 5, 9, 2, 6];
const X = 'abcde', Y = 'ace';
const P = 'horse', Q = 'ros';

function video() {
  const v = new Video('dp-on-subsequences', 'LIS, LCS and edit distance');

  v.chapter('intro', 'Subsequences: keep the order, skip freely');
  v.array('s', 'abcde'.split(''), { label: 'a string' });
  v.say('A subsequence keeps some characters in their original order, skipping any others. A, c, e is a subsequence of a b c d e; so is b, d. Unlike a substring, it does not have to be contiguous. A string of length n has two to the n subsequences, far too many to list, so these problems are solved with DP over positions.');

  v.chapter('lis', 'Longest increasing subsequence: dp[i] ends at i', { cx: 'O(n²)', code: ['dp[i] = longest increasing subsequence ending at a[i]', 'dp[i] = 1 + max(dp[j]) over j < i with a[j] < a[i]', 'answer = max(dp)'] });
  v.clear();
  const a = v.array('a', A, { label: 'a' });
  const n = A.length;
  const d = A.map(() => 1);
  for (let i = 0; i < n; i++) for (let j = 0; j < i; j++) if (A[j] < A[i]) d[i] = Math.max(d[i], d[j] + 1);
  const dp = v.array('dp', A.map(() => ''), { label: 'dp[i] = longest increasing run ending at i' });
  v.line(0).say('The key is to fix where the subsequence ends. Let dp of i be the longest increasing subsequence that ends exactly at position i. It can extend any earlier subsequence whose last value is smaller.');
  fill1D(v, dp, A.map((_, i) => i), {
    deps: (i) => { const js = [...Array(i).keys()].filter((j) => A[j] < A[i]); const m = Math.max(0, ...js.map((j) => d[j])); const b = js.find((j) => d[j] === m); return b === undefined ? [] : [b]; },
    val: (i) => d[i], line: [1],
    eq: (i) => { const js = [...Array(i).keys()].filter((j) => A[j] < A[i]); return js.length ? `dp[${i}] = 1 + max(${js.map((j) => d[j]).join(', ')}) = ${d[i]}` : `dp[${i}] = 1 (nothing smaller before ${A[i]})`; },
    say: (i) => { a.clearTones().tone(i, 'active'); [...Array(i).keys()].filter((j) => A[j] < A[i]).forEach((j) => a.tone(j, 'cmp')); return i === 2 ? 'Four can follow three or one; both have length one, so four ends a run of two.' : i === 5 ? `Nine is bigger than everything before it; the best of those runs ends at five with length ${words(d[4])}, so nine makes ${words(d[5])}.` : undefined; },
    hold: 500,
  });
  a.clearTones();
  const best = Math.max(...d);
  dp.tone(d.indexOf(best), 'ok');
  v.line(2).eq(`LIS = ${best} (e.g. 3, 4, 5, 9)`, 'ok').say(`The longest is ${words(best)}: three, four, five, nine. Each position scans everything before it: n squared. A cleverer version keeps the smallest possible tail for every length and uses binary search, for n log n.`);

  v.chapter('lcs', 'Longest common subsequence: a table over two prefixes', { cx: 'O(m · n)', code: ['dp[i][j] = LCS of x[:i] and y[:j]', 'x[i−1] == y[j−1] → dp[i−1][j−1] + 1', 'else → max(dp[i−1][j], dp[i][j−1])'] });
  v.clear();
  const L = Array.from({ length: X.length + 1 }, () => Array(Y.length + 1).fill(0));
  for (let i = 1; i <= X.length; i++) for (let j = 1; j <= Y.length; j++) L[i][j] = X[i - 1] === Y[j - 1] ? L[i - 1][j - 1] + 1 : Math.max(L[i - 1][j], L[i][j - 1]);
  const g = v.grid('lcs', L.map((row, i) => row.map((x, j) => (i === 0 || j === 0 ? 0 : ''))), { label: 'dp[i][j]' });
  g.heads(['""', ...X.split('')], ['""', ...Y.split('')]);
  v.line(0).say(`With two strings, the state is a pair of prefixes: the first i letters of ${X} and the first j letters of ${Y}. Compare the last letters. If they match, that letter can end the common subsequence: one plus the answer without both. If not, drop one of the two last letters, whichever leaves the longer answer.`);
  const cells: [number, number][] = [];
  for (let i = 1; i <= X.length; i++) for (let j = 1; j <= Y.length; j++) cells.push([i, j]);
  fill2D(v, g, cells, {
    deps: (i, j) => (X[i - 1] === Y[j - 1] ? [[i - 1, j - 1]] : [L[i - 1][j] >= L[i][j - 1] ? [i - 1, j] : [i, j - 1]]),
    val: (i, j) => L[i][j], line: (i, j) => (X[i - 1] === Y[j - 1] ? [1] : [2]),
    tone: (i, j) => (X[i - 1] === Y[j - 1] ? 'ok' : 'active'),
    eq: (i, j) => (X[i - 1] === Y[j - 1] ? `'${X[i - 1]}' = '${Y[j - 1]}' → ${L[i - 1][j - 1]} + 1 = ${L[i][j]}` : `'${X[i - 1]}' ≠ '${Y[j - 1]}' → max(${L[i - 1][j]}, ${L[i][j - 1]}) = ${L[i][j]}`),
    say: (i, j) => (i === 1 && j === 1 ? 'A and a match: the diagonal plus one.' : i === 2 && j === 2 ? 'B and c differ: carry over the better of the cell above or the cell to the left.' : i === 3 && j === 2 ? 'C and c match: one plus the diagonal, which was one. Two.' : undefined),
    hold: 350,
  });
  g.tone(X.length, Y.length, 'ok');
  v.line(0).eq(`LCS = ${L[X.length][Y.length]} ("ace")`, 'ok').say(`The bottom-right cell says the longest common subsequence has length ${words(L[X.length][Y.length])}: a, c, e.`);

  v.chapter('edit', 'Edit distance: the same table with three operations', { cx: 'O(m · n)', code: ['dp[i][j] = edits to turn x[:i] into y[:j]', 'last letters equal → dp[i−1][j−1]', 'else 1 + min(replace dp[i−1][j−1], delete dp[i−1][j], insert dp[i][j−1])', 'row 0 / column 0: i or j (all inserts / deletes)'] });
  v.clear();
  const E = Array.from({ length: P.length + 1 }, (_, i) => Array.from({ length: Q.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= P.length; i++) for (let j = 1; j <= Q.length; j++) E[i][j] = P[i - 1] === Q[j - 1] ? E[i - 1][j - 1] : 1 + Math.min(E[i - 1][j - 1], E[i - 1][j], E[i][j - 1]);
  const eg = v.grid('ed', E.map((row, i) => row.map((x, j) => (i === 0 || j === 0 ? x : ''))), { label: 'dp[i][j]' });
  eg.heads(['""', ...P.split('')], ['""', ...Q.split('')]);
  v.line(3).say(`How many single-letter inserts, deletes or replacements turn ${P} into ${Q}? The first row and column are easy: turning the empty string into j letters takes j inserts, and turning i letters into nothing takes i deletes.`);
  const ec: [number, number][] = [];
  for (let i = 1; i <= P.length; i++) for (let j = 1; j <= Q.length; j++) ec.push([i, j]);
  fill2D(v, eg, ec, {
    deps: (i, j) => { if (P[i - 1] === Q[j - 1]) return [[i - 1, j - 1]]; const o: [number, number][] = [[i - 1, j - 1], [i - 1, j], [i, j - 1]]; const m = Math.min(...o.map(([a2, b2]) => E[a2][b2])); return [o.find(([a2, b2]) => E[a2][b2] === m)!]; },
    val: (i, j) => E[i][j], line: (i, j) => (P[i - 1] === Q[j - 1] ? [1] : [2]),
    eq: (i, j) => (P[i - 1] === Q[j - 1] ? `'${P[i - 1]}' = '${Q[j - 1]}' → free: ${E[i][j]}` : `1 + min(rep ${E[i - 1][j - 1]}, del ${E[i - 1][j]}, ins ${E[i][j - 1]}) = ${E[i][j]}`),
    say: (i, j) => (i === 1 && j === 1 ? 'H versus r: replace h with r, costing one plus the diagonal zero.' : i === 2 && j === 2 ? 'O and o match, so they cost nothing: copy the diagonal.' : undefined),
    hold: 300,
  });
  eg.tone(P.length, Q.length, 'ok');
  v.eq(`edit distance = ${E[P.length][Q.length]}`, 'ok').say(`${words(E[P.length][Q.length])[0].toUpperCase()}${words(E[P.length][Q.length]).slice(1)} edits: replace h with r, delete r, delete e. The arrows trace which operation each cell used.`);

  v.chapter('family', 'The family');
  v.clear();
  v.table('t', ['Problem', 'State', 'Transition'], [
    ['LIS', 'dp[i]: best ending at i', '1 + max dp[j], a[j] < a[i]'],
    ['LCS', 'dp[i][j]: prefixes', 'match → diag + 1, else max(up, left)'],
    ['edit distance', 'dp[i][j]: prefixes', 'match → diag, else 1 + min of 3'],
    ['delete to equal', 'LCS', 'm + n − 2·LCS'],
    ['distinct subsequences', 'dp[i][j]: count', 'match → diag + up, else up'],
    ['interleaving', 'dp[i][j]: bool', 'from up (s1) or left (s2)'],
  ]);
  v.say('One string: fix where the subsequence ends. Two strings: a table over pairs of prefixes, deciding by comparing the last characters.');
  return v.build();
}

const body = String.raw`
## The idea

A **subsequence** keeps order but may skip elements. There are 2ⁿ of them, so we never enumerate: we do DP over **positions**.

- **One sequence** (LIS): \`dp[i]\` = best answer **ending at** i.
- **Two sequences** (LCS, edit distance): \`dp[i][j]\` = answer for the **prefixes** \`x[:i]\` and \`y[:j]\`; look at the last characters.

> Real-life picture: \`diff\` between two versions of a file is an LCS of their lines; spell-checkers rank suggestions by edit distance.

## LCS

\`\`\`java
int lcs(String x, String y) {
    int m = x.length(), n = y.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = x.charAt(i - 1) == y.charAt(j - 1)
                ? dp[i - 1][j - 1] + 1                 // use both last letters
                : Math.max(dp[i - 1][j], dp[i][j - 1]); // drop one of them
    return dp[m][n];
}
\`\`\`

\`\`\`python
def lcs(x, y):
    m, n = len(x), len(y)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if x[i - 1] == y[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1        # use both last letters
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])   # drop one of them
    return dp[m][n]
\`\`\`

\`\`\`cpp
int lcs(string x, string y) {
    int m = x.size(), n = y.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = x[i - 1] == y[j - 1] ? dp[i - 1][j - 1] + 1   // use both last letters
                                            : max(dp[i - 1][j], dp[i][j - 1]);   // drop one
    return dp[m][n];
}
\`\`\`

## Edit distance

\`dp[i][j] = dp[i−1][j−1]\` if the last letters match, else \`1 + min(dp[i−1][j−1] (replace), dp[i−1][j] (delete), dp[i][j−1] (insert))\`. Row 0 is \`j\`, column 0 is \`i\`.

## LIS in O(n log n)

Keep \`tails[k]\` = smallest possible last value of an increasing subsequence of length k + 1. For each x, binary-search the first tail ≥ x and replace it (or append). The length of \`tails\` is the answer.

## Pitfalls

- Index shift: \`dp[i][j]\` talks about \`x[i−1]\` and \`y[j−1]\`.
- LIS "ending at i" means the answer is \`max(dp)\`, not \`dp[n−1]\`.
- Strictly vs non-strictly increasing changes \`<\` vs \`≤\` (and lower vs upper bound).
- Only the previous row is needed: roll rows for O(n) space.
`;

const lesson: Lesson = {
  slug: 'dp-on-subsequences',
  video,
  body,
  quiz: [
    { q: 'In LIS, dp[i] means…', options: ['best in a[0..i]', 'best ending exactly at i', 'best starting at i', 'count of increasing pairs'], answer: 1, why: 'Fixing the end makes the transition possible.' },
    { q: 'LCS: last letters differ. dp[i][j] =', options: ['dp[i−1][j−1]', 'dp[i−1][j−1] + 1', 'max(dp[i−1][j], dp[i][j−1])', '0'], answer: 2, why: 'One of the two last letters is not in the LCS.' },
    { q: 'Minimum deletions to make two strings equal =', options: ['edit distance', 'm + n − 2·LCS', '|m − n|', 'LIS'], answer: 1, why: 'Keep the LCS, delete everything else from both.' },
    { q: 'Edit distance from "" to "abc"?', options: ['0', '1', '3', 'undefined'], answer: 2, why: 'Three inserts.' },
  ],
};

export default lesson;
