import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { expandViz } from '../../palviz';

const S = 'aaba';
function count(s: string) { let k = 0; for (let c = 0; c < 2 * s.length - 1; c++) { let l = Math.floor(c / 2), r = l + (c % 2); while (l >= 0 && r < s.length && s[l] === s[r]) { k++; l--; r++; } } return k; }

function video() {
  const v = new Video('palindromic-substrings', 'Palindromic Substrings');
  const ans = count(S);
  v.chapter('intro', 'The problem');
  v.array('s', S.split(''), { label: 's' });
  v.say('Count the substrings that are palindromes. Substrings at different positions count separately, even if they spell the same thing.');
  v.eq(`answer: ${ans} (a, a, b, a, aa, aba)`);

  v.chapter('brute', 'Brute force: test every substring', { cx: 'O(n³)', code: ['for every (i, j): if s[i..j] is a palindrome: count++'] });
  v.eq('n² substrings × O(n) each', 'bad').say('Checking each of the n squared substrings with two pointers is cubic.');

  v.chapter('better', 'Better: palindrome table', { cx: 'O(n²) time and space', code: ['pal[i][j] = s[i] == s[j] and pal[i+1][j−1]', 'count the true cells'] });
  v.eq('O(1) per substring, O(n²) memory', 'warn').say('The table makes each check constant, but stores n squared booleans.');

  v.chapter('optimal', 'Optimal: expand around centres, counting each step', { cx: 'O(n²) time, O(1) space', code: ['for each of 2n − 1 centres:', '  while the ends match: count += 1; expand'] });
  v.clear();
  const a = v.array('s', S.split(''), { label: 's' });
  const cnt = v.vars('c', { count: 0 });
  v.line(0).say('Every palindrome has exactly one centre. So expand around every centre, and every successful expansion step is one more palindrome.');
  expandViz(v, a, S, {
    lines: { centre: [0], grow: [1], stop: [1] },
    hold: 380,
    say: (x) => {
      cnt.set({ count: x.count }, x.step === 'stop' ? undefined : 'ok');
      if (x.centre === 1 && x.step !== 'stop') return 'The gap between the two a’s: they match, so aa counts.';
      if (x.centre === 4 && x.r - x.l === 2 && x.step === 'grow') return 'Around b, the a’s on both sides match: aba counts too.';
      return undefined;
    },
  });
  cnt.set({ count: ans }, 'ok');
  v.eq(`count = ${ans}`, 'ok').say(`${words(ans)[0].toUpperCase()}${words(ans).slice(1)} palindromic substrings, found without any extra memory.`);
  v.answer(ans);

  recap(v, [{ name: 'Check all substrings', time: 'O(n³)', space: 'O(1)' }, { name: 'Palindrome table', time: 'O(n²)', space: 'O(n²)' }, { name: 'Expand around centres', time: 'O(n²)', space: 'O(1)' }], 'Each successful expansion = one palindrome.', ['Count palindromic substrings → expand around centres'], 'Every palindrome has exactly one centre.');
  return v.build();
}

const problem: Problem = {
  slug: 'palindromic-substrings',
  statement: 'Given a string `s`, return the number of palindromic substrings in it. Substrings with different start or end positions count as different.',
  examples: [{ input: 's = "abc"', output: '3' }, { input: 's = "aaa"', output: '6' }],
  constraints: ['1 ≤ s.length ≤ 1000', 'lowercase English letters'],
  hints: ['Each palindrome has one centre.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'All substrings', idea: 'Check each substring.', time: 'O(n³)', space: 'O(1)', bottleneck: 'Cubic.' },
    { id: 'better', kind: 'better', name: 'Palindrome table', idea: 'Fill pal[i][j] by length; count trues.', time: 'O(n²)', space: 'O(n²)', bottleneck: 'Memory.' },
    { id: 'optimal', kind: 'optimal', name: 'Expand around centres', idea: 'Count each successful expansion.', time: 'O(n²)', space: 'O(1)' },
  ],
  takeaway: 'One centre per palindrome: **count expansions**.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'countSubstrings', params: ['String'], ret: 'int',
    tests: [{ args: ['abc'], out: 3 }, { args: ['aaa'], out: 6 }, { args: [S], out: count(S) }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 14) }, () => 'ab'[r.int(0, 1)]).join('')],
    ref: (s: string) => count(s),
  },
};

export default problem;
