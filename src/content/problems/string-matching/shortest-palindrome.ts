import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { lpsViz } from '../../kmpviz';

const S = 'abac';
const rev = (s: string) => [...s].reverse().join('');
function shortest(s: string) { for (let k = s.length; k > 0; k--) { const p = s.slice(0, k); if (p === rev(p)) return rev(s.slice(k)) + s; } return s; }
const spell = (s: string) => s.split('').join(' ');

function video() {
  const v = new Video('shortest-palindrome', 'Shortest Palindrome');
  const n = S.length;
  const ans = shortest(S);
  v.chapter('intro', 'The problem');
  v.array('s', [...S], { label: 's' });
  v.say('You may only add characters in front of s. Return the shortest palindrome you can make.');
  v.eq(`“${S}” → “${ans}”`, 'ok');
  v.say('Whatever we add goes in front, so some prefix of s must already be a palindrome and stay in the middle. The longer that palindromic prefix, the less we add. Everything after it is copied, reversed, to the front.');

  v.chapter('brute', 'Brute force: longest palindromic prefix, checked directly', { cx: 'O(n²)', code: ['for k = n down to 1:', '  if s[0 : k] is a palindrome:', '    return reverse(s[k :]) + s', 'return s'] });
  v.clear();
  const a = v.array('s', [...S], { label: 's' });
  for (let k = n; k > 0; k--) {
    const p = S.slice(0, k);
    a.clearTones();
    if (p === rev(p)) {
      a.toneRange(0, k - 1, 'ok');
      v.line(1, 2).eq(`“${p}” is a palindrome → ${rev(S.slice(k))} + ${S} = ${ans}`, 'ok');
      v.say(`${spell(p)} reads the same both ways. Put the reverse of what is left, ${spell(rev(S.slice(k)))}, in front: ${spell(ans)}. Checking each prefix costs up to n, so this is order n squared.`);
      break;
    }
    let l = 0;
    while (p[l] === p[k - 1 - l]) l++;
    a.tone([l, k - 1 - l], 'bad');
    v.line(1).eq(`“${p}”: ${p[l]} ≠ ${p[k - 1 - l]} → not a palindrome`, 'bad');
    v.say(k === n ? 'Try the longest prefix first: the whole string. Its ends differ.' : `Length ${words(k)}: not a palindrome either.`);
  }

  v.chapter('optimal', 'Optimal: KMP on s + # + reverse(s)', { cx: 'O(n)', code: ['c = s + "#" + reverse(s)', 'l = lps[last] of c', 'return reverse(s)[0 : n − l] + s'] });
  v.clear();
  const C = `${S}#${rev(S)}`;
  const ca = v.array('c', [...C], { label: 's + # + reverse(s)' });
  v.line(0).say('A palindromic prefix of s, read backwards, is itself: so it is a prefix of s that is also a suffix of reverse s. The longest such thing is a border of s, hash, reverse s. The hash stops a border from running across the middle and becoming longer than s.');
  const L = lpsViz(v, ca, C, {
    lines: { match: [1], fall: [1], zero: [1] },
    name: 'c',
    hold: 420,
    say: (e) => {
      if (e.kind === 'zero' && C[e.i] === '#') return 'The separator matches nothing, so lps resets to zero here.';
      if (e.i === C.length - 1 && e.kind === 'match') return `The last character extends the border to ${words(e.len)}: ${spell(S.slice(0, e.len))} is both the start of s and the end of reverse s.`;
      return undefined;
    },
  });
  const l = L[C.length - 1];
  ca.toneRange(0, l - 1, 'ok').toneRange(C.length - l, C.length - 1, 'ok');
  v.line(2).eq(`l = ${l} → ${rev(S).slice(0, n - l)} + ${S} = ${ans}`, 'ok').say(`The longest palindromic prefix has length ${words(l)}. ${n - l === 1 ? 'The first character of reverse s goes' : `The first ${words(n - l)} characters of reverse s go`} in front: ${spell(ans)}.`);
  v.answer(ans);

  recap(v, [{ name: 'Check every prefix', time: 'O(n²)', space: 'O(n)' }, { name: 'KMP on s # rev(s)', time: 'O(n)', space: 'O(n)' }], 'Longest palindromic prefix = border of s + # + reverse(s).', ['Palindrome prefix / suffix → KMP on s and its reverse'], 'Without the separator, a border can overshoot n.');
  return v.build();
}

const problem: Problem = {
  slug: 'shortest-palindrome',
  statement: 'You are given a string `s`. You can convert `s` to a palindrome by adding characters in front of it. Return the shortest palindrome you can find by performing this transformation.',
  examples: [{ input: 's = "aacecaaa"', output: '"aaacecaaa"' }, { input: 's = "abcd"', output: '"dcbabcd"' }],
  constraints: ['0 ≤ s.length ≤ 5 · 10⁴', 's consists of lowercase English letters only'],
  hints: ['Find the longest palindromic prefix.', 'It is the longest border of s + "#" + reverse(s).'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Check every prefix', idea: 'Longest prefix that is a palindrome, tested directly.', time: 'O(n²)', space: 'O(n)', bottleneck: 'Quadratic on inputs like "aaaa…ab".' },
    { id: 'optimal', kind: 'optimal', name: 'KMP', idea: 'l = last lps of s + "#" + reverse(s); prepend reverse(s)[0 : n − l].', time: 'O(n)', space: 'O(n)' },
  ],
  takeaway: 'Palindromic prefix = **border** of s # reverse(s).',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'shortestPalindrome', params: ['String'], ret: 'String',
    tests: [{ args: ['aacecaaa'], out: 'aaacecaaa' }, { args: ['abcd'], out: 'dcbabcd' }, { args: [S], out: 'cabac' }, { args: ['a'], out: 'a' }, { args: ['aba'], out: 'aba' }, { args: ['ab'], out: 'bab' }],
    gen: (r: Rng) => [r.str(r.int(1, 10), 'abc')],
    ref: (s: string) => shortest(s),
  },
};

export default problem;
