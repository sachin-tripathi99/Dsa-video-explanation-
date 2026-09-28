import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';
import { fill2D } from '../../dpviz';
import { expandViz } from '../../palviz';

const S = 'abacdc';
const Q = 'bbbab';

function video() {
  const v = new Video('dp-palindromes', 'Palindromes: expand and tabulate');
  const n = S.length;

  v.chapter('intro', 'A palindrome reads the same both ways');
  v.array('s', S.split(''), { label: 's' });
  v.say('A palindrome reads the same forwards and backwards, like level or noon. Every palindrome has a centre: a single letter for odd lengths, or the gap between two letters for even lengths. And a palindrome with its two end letters removed is still a palindrome. Both facts lead to efficient algorithms.');

  v.chapter('expand', 'Technique 1: expand around every centre', { cx: 'O(n²) time, O(1) space', code: ['for each of the 2n − 1 centres:', '  l, r = centre', '  while l ≥ 0, r < n and s[l] == s[r]: record; l −= 1; r += 1'] });
  v.clear();
  const a = v.array('s', S.split(''), { label: 's' });
  let told = 0;
  const res = expandViz(v, a, S, {
    lines: { centre: [0, 1], grow: [2], stop: [2] },
    hold: 280,
    say: (x) => {
      if (x.centre === 0 && x.step === 'start') return 'Start at the first letter: a single letter is always a palindrome.';
      if (x.centre === 1 && x.step === 'stop') return 'Even centres sit between two letters. A and b differ, so nothing grows here.';
      if (x.centre === 2 && x.step === 'grow' && told++ === 0) return 'Centred on b, the letters on both sides are a and a: equal, so aba is a palindrome. Keep expanding.';
      return undefined;
    },
  });
  v.eq(`${res.found.length} palindromic substrings · longest "${S.slice(res.best[0], res.best[1] + 1)}"`, 'ok').say(`Every palindrome is found from its centre, so this lists all ${words(res.found.length)} palindromic substrings, and the longest, in n squared time and constant space.`);

  v.chapter('table', 'Technique 2: a table over [i, j], filled by length', { cx: 'O(n²) time and space', code: ['pal[i][i] = true', 'pal[i][i+1] = s[i] == s[i+1]', 'pal[i][j] = s[i] == s[j] and pal[i+1][j−1]', 'fill by increasing length j − i'] });
  v.clear();
  const P = Array.from({ length: n }, () => Array(n).fill(false));
  for (let len = 1; len <= n; len++) for (let i = 0; i + len - 1 < n; i++) { const j = i + len - 1; P[i][j] = S[i] === S[j] && (len <= 2 || P[i + 1][j - 1]); }
  const g = v.grid('pal', P.map((row, i) => row.map((_, j) => (j < i ? '·' : ''))), { label: 'pal[i][j]: is s[i..j] a palindrome?' });
  g.heads(S.split('').map((c, i) => `${i} ${c}`), S.split('').map((c, j) => `${j} ${c}`));
  v.line(0).say('The second idea is a table. Cell i, j answers whether the substring from i to j is a palindrome. It is exactly when its end letters match and the inside, i plus one to j minus one, is a palindrome. The inside is shorter, so fill the table by length: the diagonal first, then pairs, then longer ranges.');
  const cells: [number, number][] = [];
  for (let len = 1; len <= n; len++) for (let i = 0; i + len - 1 < n; i++) cells.push([i, i + len - 1]);
  fill2D(v, g, cells, {
    deps: (i, j) => (j - i >= 2 && S[i] === S[j] ? [[i + 1, j - 1]] : []),
    val: (i, j) => (P[i][j] ? 'T' : 'F'), tone: (i, j) => (P[i][j] ? 'ok' : 'bad'),
    line: (i, j) => (i === j ? [0] : j === i + 1 ? [1] : [2]),
    eq: (i, j) => (i === j ? `"${S[i]}" → T` : j === i + 1 ? `"${S.slice(i, j + 1)}" → ${P[i][j] ? 'T' : 'F'}` : `'${S[i]}' ${S[i] === S[j] ? '=' : '≠'} '${S[j]}'${S[i] === S[j] ? ` and inside ${P[i + 1][j - 1] ? 'T' : 'F'}` : ''} → ${P[i][j] ? 'T' : 'F'}`),
    say: (i, j) => (i === 0 && j === 2 ? 'A and a match, and the inside, b, is a palindrome: aba is true. The arrow points at the inside cell.' : i === 0 && j === 3 ? 'A and c differ: false, whatever is inside.' : undefined),
    hold: 250,
  });
  v.say('Two nested loops, n squared cells. The table costs more memory than expanding, but it answers any is-this-a-palindrome question in constant time, which the partitioning problems need.');

  v.chapter('subseq', 'Palindromic subsequences: the same idea, skipping allowed', { cx: 'O(n²)', code: ['lps[i][j] = longest palindromic subsequence of s[i..j]', 's[i] == s[j] → 2 + lps[i+1][j−1]', 'else max(lps[i+1][j], lps[i][j−1])'] });
  v.clear();
  const m = Q.length;
  const L = Array.from({ length: m }, () => Array(m).fill(0));
  for (let len = 1; len <= m; len++) for (let i = 0; i + len - 1 < m; i++) { const j = i + len - 1; L[i][j] = i === j ? 1 : Q[i] === Q[j] ? 2 + (len > 2 ? L[i + 1][j - 1] : 0) : Math.max(L[i + 1][j], L[i][j - 1]); }
  const lg = v.grid('lps', L.map((row, i) => row.map((_, j) => (j < i ? '·' : ''))), { label: `lps[i][j] for "${Q}"` });
  lg.heads(Q.split(''), Q.split(''));
  v.line(0).say('For subsequences, letters may be skipped. If the two ends match, both join the palindrome around the best inside. If not, drop one end. It is LCS thinking on one string, filled by length.');
  const lc: [number, number][] = [];
  for (let len = 1; len <= m; len++) for (let i = 0; i + len - 1 < m; i++) lc.push([i, i + len - 1]);
  fill2D(v, lg, lc, {
    deps: (i, j) => (i === j ? [] : Q[i] === Q[j] ? (j - i >= 2 ? [[i + 1, j - 1]] : []) : [L[i + 1][j] >= L[i][j - 1] ? [i + 1, j] : [i, j - 1]]),
    val: (i, j) => L[i][j], tone: (i, j) => (i !== j && Q[i] === Q[j] ? 'ok' : 'active'), line: (i, j) => (Q[i] === Q[j] ? [1] : [2]),
    eq: (i, j) => (i === j ? `single '${Q[i]}' → 1` : Q[i] === Q[j] ? `'${Q[i]}' = '${Q[j]}' → 2 + ${j - i >= 2 ? L[i + 1][j - 1] : 0} = ${L[i][j]}` : `max(${L[i + 1][j]}, ${L[i][j - 1]}) = ${L[i][j]}`),
    hold: 260,
  });
  lg.tone(0, m - 1, 'ok');
  v.eq(`longest palindromic subsequence = ${L[0][m - 1]} ("bbbb")`, 'ok').say(`The whole string’s answer is in the top-right cell: ${words(L[0][m - 1])}, from b b b b. It also equals the LCS of the string and its reverse.`);

  v.chapter('family', 'The family');
  v.clear();
  v.table('t', ['Problem', 'Technique'], [
    ['longest palindromic substring', 'expand around centres'],
    ['count palindromic substrings', 'expand around centres (count every step)'],
    ['longest palindromic subsequence', 'interval DP, or LCS(s, reverse s)'],
    ['min insertions to make a palindrome', 'n − LPS'],
    ['min cuts for a palindrome partition', 'pal table + cuts[i] = min cuts[j−1] + 1'],
  ]);
  v.say('Substrings: expand around centres. Subsequences: an interval table. Partitions: a palindrome table plus a one-dimensional DP over prefixes.');
  return v.build();
}

const body = String.raw`
## The idea

Two facts drive every palindrome algorithm:

1. Every palindrome has a **centre** (a letter, or a gap between two letters): 2n − 1 centres in total.
2. \`s[i..j]\` is a palindrome ⇔ \`s[i] == s[j]\` and \`s[i+1..j−1]\` is one.

> Real-life picture: checking a palindrome is like folding a strip of paper in half: the letters that meet must match.

## Expand around centres

\`\`\`java
int countPalindromes(String s) {
    int n = s.length(), count = 0;
    for (int c = 0; c < 2 * n - 1; c++) {
        int l = c / 2, r = l + c % 2;
        while (l >= 0 && r < n && s.charAt(l) == s.charAt(r)) { count++; l--; r++; }
    }
    return count;
}
\`\`\`

\`\`\`python
def count_palindromes(s):
    n, count = len(s), 0
    for c in range(2 * n - 1):
        l, r = c // 2, c // 2 + c % 2
        while l >= 0 and r < n and s[l] == s[r]:
            count += 1
            l, r = l - 1, r + 1
    return count
\`\`\`

\`\`\`cpp
int countPalindromes(string s) {
    int n = s.size(), count = 0;
    for (int c = 0; c < 2 * n - 1; c++) {
        int l = c / 2, r = l + c % 2;
        while (l >= 0 && r < n && s[l] == s[r]) { count++; l--; r++; }
    }
    return count;
}
\`\`\`

## Interval tables

Fill \`dp[i][j]\` by **increasing length** (or \`i\` from n−1 down to 0 and \`j\` from i up), because \`[i, j]\` depends on \`[i+1, j−1]\`, \`[i+1, j]\`, \`[i, j−1]\`.

| Question | Transition |
|---|---|
| is s[i..j] a palindrome? | \`s[i]==s[j] && pal[i+1][j−1]\` |
| longest palindromic subsequence | match → \`2 + in\`; else \`max(drop left, drop right)\` |
| min insertions | \`n − LPS\` |

## Pitfalls

- Don't forget even-length centres (between letters).
- Length-1 and length-2 ranges are base cases for the table.
- Substring ≠ subsequence: pick the right technique.
`;

const lesson: Lesson = {
  slug: 'dp-palindromes',
  video,
  body,
  quiz: [
    { q: 'How many centres does a string of length n have?', options: ['n', 'n − 1', '2n − 1', 'n²'], answer: 2, why: 'n letters and n − 1 gaps.' },
    { q: 'pal[i][j] depends on…', options: ['pal[i−1][j+1]', 'pal[i+1][j−1]', 'pal[i][j−1] only', 'nothing'], answer: 1, why: 'The inside of the range.' },
    { q: 'Minimum insertions to make s a palindrome =', options: ['n − LPS(s)', 'LPS(s)', 'n / 2', 'edit distance to reverse(s)'], answer: 0, why: 'Keep the longest palindromic subsequence; mirror every other letter.' },
    { q: 'Longest palindromic subsequence of s also equals…', options: ['LIS of s', 'LCS of s and reverse(s)', 'n − LCS', 'number of centres'], answer: 1, why: 'A palindromic subsequence appears in both directions.' },
  ],
};

export default lesson;
