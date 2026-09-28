import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { fill1D } from '../../dpviz';

const S = 'aabbac';
function palT(s: string) { const n = s.length; const p = Array.from({ length: n }, () => Array(n).fill(false)); for (let i = n - 1; i >= 0; i--) for (let j = i; j < n; j++) p[i][j] = s[i] === s[j] && (j - i < 2 || p[i + 1][j - 1]); return p; }
function cutsT(s: string) { const n = s.length; const p = palT(s); const c = Array(n).fill(0); for (let j = 0; j < n; j++) { if (p[0][j]) { c[j] = 0; continue; } c[j] = j; for (let i = 1; i <= j; i++) if (p[i][j]) c[j] = Math.min(c[j], c[i - 1] + 1); } return c; }
function minCut(s: string) { return cutsT(s)[s.length - 1]; }

function video() {
  const v = new Video('palindrome-partitioning-ii', 'Palindrome Partitioning II');
  const n = S.length;
  const P = palT(S);
  const C = cutsT(S);
  const bestStart = (j: number) => { if (P[0][j]) return 0; let b = -1; for (let i = 1; i <= j; i++) if (P[i][j] && (b < 0 || C[i - 1] < C[b - 1])) b = i; return b; };
  v.chapter('intro', 'The problem');
  v.array('s', S.split(''), { label: 's' });
  v.say('Cut the string into pieces that are all palindromes, using as few cuts as possible.');
  v.eq(`answer: ${minCut(S)} cuts: "a" | "abba" | "c"`);

  v.chapter('brute', 'Brute force: try every palindromic first piece', { cx: 'O(2ⁿ · n)', code: ['cuts(i): the rest s[i:] is a palindrome → 0', '  min over palindromic s[i..j] of 1 + cuts(j + 1)'] });
  v.eq('every way to cut the string', 'bad').say('Choose a palindromic first piece, then solve the rest. Without caching this explores every way of cutting: exponential, with a linear palindrome check each time.');

  v.chapter('better', 'Better: memoise cuts(i)', { cx: 'O(n³)', code: ['cache cuts(i); check palindromes directly'] });
  v.eq('n states × n pieces × O(n) check', 'warn').say('Caching the suffix answers leaves n squared piece choices, each still checked in linear time: cubic.');

  v.chapter('optimal', 'Optimal: palindrome table + cuts over prefixes', { cx: 'O(n²) time and space', code: ['pal[i][j] precomputed (range table)', 'cuts[j] = 0 if s[0..j] is a palindrome', 'else min over i ≥ 1 with pal[i][j] of cuts[i−1] + 1', 'answer = cuts[n−1]'] });
  v.clear();
  const a = v.array('s', S.split(''), { label: 's' });
  const c = v.array('cuts', S.split('').map(() => ''), { label: 'cuts[j] = fewest cuts for s[0..j]' });
  v.line(0).say('First precompute the palindrome table, so any piece can be checked in constant time. Then let cuts of j be the fewest cuts for the prefix ending at j. Its last piece is some palindrome from i to j: cut just before i, and add the best for the prefix before it.');
  fill1D(v, c, S.split('').map((_, j) => j), {
    deps: (j) => { const b = bestStart(j); return b > 0 ? [b - 1] : []; }, val: (j) => C[j], line: [1, 2],
    eq: (j) => { const b = bestStart(j); return b === 0 ? `"${S.slice(0, j + 1)}" is a palindrome → 0 cuts` : `last piece "${S.slice(b, j + 1)}" → cuts[${b - 1}] + 1 = ${C[j]}`; },
    say: (j) => {
      const b = bestStart(j);
      a.clearTones().noWin();
      a.win(b, j, 'ok', S.slice(b, j + 1));
      if (j === 1) return 'The prefix a a is itself a palindrome: no cut needed.';
      if (j === 4) return 'Ending at the second a, the best last piece is a b b a, a palindrome starting at index one. Cut after the first a: one cut.';
      if (j === n - 1) return `The final c can only be its own piece: one more than the best for everything before it, ${words(C[n - 2])}.`;
      return undefined;
    },
    hold: 700,
  });
  a.clearTones().noWin();
  c.tone(n - 1, 'ok');
  v.line(3).eq(`cuts[${n - 1}] = ${C[n - 1]}`, 'ok').say(`${words(C[n - 1])[0].toUpperCase()}${words(C[n - 1]).slice(1)} cuts: a, abba, c. The table and the cuts loop are both n squared.`);
  v.answer(minCut(S));

  recap(v, [{ name: 'Try every cutting', time: 'O(2ⁿ · n)', space: 'O(n)' }, { name: 'Memoised suffixes', time: 'O(n³)', space: 'O(n)' }, { name: 'pal table + cuts', time: 'O(n²)', space: 'O(n²)' }], 'cuts[j] = min over palindromic last pieces of cuts[i−1] + 1.', ['Fewest palindromic pieces → palindrome table + 1D DP'], 'A whole-prefix palindrome needs 0 cuts.');
  return v.build();
}

const problem: Problem = {
  slug: 'palindrome-partitioning-ii',
  statement: 'Given a string `s`, partition it so that every substring of the partition is a palindrome. Return the minimum number of cuts needed.',
  examples: [{ input: 's = "aab"', output: '1' }, { input: 's = "a"', output: '0' }, { input: 's = "ab"', output: '1' }],
  constraints: ['1 ≤ s.length ≤ 2000', 'lowercase English letters'],
  hints: ['Precompute which ranges are palindromes.', 'cuts[j] = min over the last palindromic piece.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Try every palindromic first piece.', time: 'O(2ⁿ · n)', space: 'O(n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache cuts(i), checking palindromes directly.', time: 'O(n³)', space: 'O(n)', bottleneck: 'Linear palindrome checks.' },
    { id: 'optimal', kind: 'optimal', name: 'Table + cuts', idea: 'pal[i][j] then 1D cuts over prefixes.', time: 'O(n²)', space: 'O(n²)' },
  ],
  takeaway: 'Palindrome **table**, then **cuts over prefixes**.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'minCut', params: ['String'], ret: 'int',
    tests: [{ args: ['aab'], out: 1 }, { args: ['a'], out: 0 }, { args: ['ab'], out: 1 }, { args: [S], out: minCut(S) }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 12) }, () => 'ab'[r.int(0, 1)]).join('')],
    ref: (s: string) => minCut(s),
  },
};

export default problem;
