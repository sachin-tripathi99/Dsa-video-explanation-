import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { expandViz } from '../../palviz';

const S = 'cbabadx';
function longest(s: string) { let b = [0, 0]; for (let c = 0; c < 2 * s.length - 1; c++) { let l = Math.floor(c / 2), r = l + (c % 2); while (l >= 0 && r < s.length && s[l] === s[r]) { if (r - l > b[1] - b[0]) b = [l, r]; l--; r++; } } return s.slice(b[0], b[1] + 1); }

function video() {
  const v = new Video('longest-palindromic-substring', 'Longest Palindromic Substring');
  const ans = longest(S);
  v.chapter('intro', 'The problem');
  v.array('s', S.split(''), { label: 's' });
  v.say('Return the longest contiguous substring that reads the same forwards and backwards.');
  v.eq(`answer: "${ans}" (or another of the same length)`);

  v.chapter('brute', 'Brute force: check every substring', { cx: 'O(n³)', code: ['for i: for j ≥ i:', '  if s[i..j] is a palindrome (two-pointer check): keep the longest'] });
  v.eq('n² substrings × O(n) check', 'bad').say('There are about n squared over two substrings, and checking each takes linear time: cubic overall.');

  v.chapter('better', 'Better: a palindrome table', { cx: 'O(n²) time and space', code: ['pal[i][j] = s[i] == s[j] and pal[i+1][j−1]', 'fill by length, track the longest true cell'] });
  v.eq('each check becomes O(1), but n² memory', 'warn').say('Reusing the inside answer makes each check constant time. The table itself takes n squared memory.');

  v.chapter('optimal', 'Optimal: expand around each centre', { cx: 'O(n²) time, O(1) space', code: ['for each of 2n − 1 centres (letters and gaps):', '  expand while the two ends match', '  keep the longest window seen'] });
  v.clear();
  const a = v.array('s', S.split(''), { label: 's' });
  const bestVars = v.vars('best', { best: '""' });
  let shown = '';
  const res = expandViz(v, a, S, {
    lines: { centre: [0], grow: [1], stop: [1] },
    hold: 330,
    say: (x) => {
      const cur = S.slice(x.best[0], x.best[1] + 1);
      if (cur !== shown) { shown = cur; bestVars.set({ best: `"${cur}"` }, 'ok'); }
      if (x.centre === 0 && x.step === 'start') return 'Try every centre. A centre on a letter starts with that letter alone.';
      if (x.centre === 4 && x.step === 'grow' && x.r - x.l === 2) return 'Around the a in the middle, b and b match: bab.';
      if (x.centre === 4 && x.step === 'stop') return 'One step further out, c and a differ, so this centre stops at bab.';
      return undefined;
    },
  });
  void res;
  v.eq(`longest = "${ans}"`, 'ok').say(`The longest palindrome found is ${ans.split('').join(' ')}, length ${words(ans.length)}. Each centre expands at most n steps, so n squared time, with only two pointers of memory. Manacher’s algorithm even reaches linear time, but rarely comes up in interviews.`);
  v.answer(ans);

  recap(v, [{ name: 'All substrings', time: 'O(n³)', space: 'O(1)' }, { name: 'Palindrome table', time: 'O(n²)', space: 'O(n²)' }, { name: 'Expand around centres', time: 'O(n²)', space: 'O(1)' }], 'Grow palindromes from all 2n − 1 centres.', ['Longest palindromic substring → expand around centres'], 'Include the even centres between letters.');
  return v.build();
}

const problem: Problem = {
  slug: 'longest-palindromic-substring',
  statement: 'Given a string `s`, return the longest palindromic substring in `s`. If several have the same maximum length, any one may be returned.',
  examples: [{ input: 's = "babad"', output: '"bab" ("aba" is also accepted)' }, { input: 's = "cbbd"', output: '"bb"' }],
  constraints: ['1 ≤ s.length ≤ 1000', 'digits and English letters'],
  hints: ['A palindrome mirrors around its centre.', 'There are 2n − 1 centres.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'All substrings', idea: 'Check each substring with two pointers.', time: 'O(n³)', space: 'O(1)', bottleneck: 'Cubic.' },
    { id: 'better', kind: 'better', name: 'Palindrome table', idea: 'pal[i][j] from pal[i+1][j−1], by length.', time: 'O(n²)', space: 'O(n²)', bottleneck: 'Quadratic memory.' },
    { id: 'optimal', kind: 'optimal', name: 'Expand around centres', idea: 'Expand from every letter and gap.', time: 'O(n²)', space: 'O(1)' },
  ],
  takeaway: '**Expand** from every centre.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'longestPalindrome', params: ['String'], ret: 'String', cmp: { checker: 'longestPalSub' },
    tests: [{ args: ['babad'], out: 'bab' }, { args: ['cbbd'], out: 'bb' }, { args: ['a'], out: 'a' }, { args: [S], out: longest(S) }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 14) }, () => 'ab'[r.int(0, 1)]).join('')],
    ref: (s: string) => longest(s),
  },
};

export default problem;
