import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const S = 'Race, car!';
const alnum = (c: string) => /[a-z0-9]/i.test(c);

function isPal(s: string) {
  const t = s.toLowerCase().split('').filter(alnum).join('');
  return t === [...t].reverse().join('');
}

function video() {
  const v = new Video('valid-palindrome', 'Valid Palindrome');
  const chars = S.split('');
  v.chapter('intro', 'The problem');
  const a = v.array('s', chars.map((c) => (c === ' ' ? '␣' : c)), { label: `s = "${S}"` });
  v.say('A phrase is a palindrome if, after turning uppercase letters into lowercase and throwing away everything that is not a letter or digit, it reads the same forwards and backwards.');
  chars.forEach((c, i) => { if (!alnum(c)) a.tone(i, 'dim'); });
  v.eq('keep letters and digits, ignore case → "racecar"').say('Here the comma, the space and the exclamation mark are ignored, leaving race car, which is a palindrome.');

  v.chapter('brute', 'Brute force: clean, then compare with the reverse', { cx: 'O(n) time · O(n) space', code: ['t = lowercase letters/digits of s', 'return t == reverse(t)'] });
  v.clear();
  const clean = S.toLowerCase().split('').filter(alnum);
  v.array('t', clean, { label: 't = cleaned copy' });
  v.array('rev', [...clean].reverse(), { label: 'reverse(t)' });
  v.line(0, 1).eq(`"${clean.join('')}" == "${[...clean].reverse().join('')}"`, 'ok').say('The direct way builds the cleaned string, reverses it, and compares. Simple and linear, but it builds two extra strings.');

  v.chapter('optimal', 'Optimal: two pointers, skip what does not count', { cx: 'O(n) time · O(1) space', code: ['l, r = 0, n − 1', 'while l < r:', '  skip non-alphanumeric at l and at r', '  if lower(s[l]) != lower(s[r]): return false', '  l += 1; r −= 1', 'return true'] });
  v.clear();
  const b = v.array('s', chars.map((c) => (c === ' ' ? '␣' : c)), { label: `s = "${S}"` });
  let l = 0;
  let r = chars.length - 1;
  b.ptrs({ l, r });
  v.line(0).say('Compare from both ends directly in the original string, skipping characters that do not count.');
  let firstSkip = true;
  let firstCmp = true;
  let ok = true;
  while (l < r) {
    while (l < r && !alnum(chars[l])) { b.tone(l, 'dim'); l++; b.ptrs({ l, r }); v.line(2).eq(`s[${l - 1}] is not a letter → l moves`).hold(450); }
    while (l < r && !alnum(chars[r])) {
      b.tone(r, 'dim');
      r--;
      b.ptrs({ l, r });
      v.line(2).eq(`s[${r + 1}] = '${chars[r + 1] === ' ' ? '␣' : chars[r + 1]}' is not a letter → r moves`);
      if (firstSkip) v.say('The last character is an exclamation mark, so r skips it.');
      else v.hold(450);
      firstSkip = false;
    }
    if (l >= r) break;
    const same = chars[l].toLowerCase() === chars[r].toLowerCase();
    b.tone([l, r], same ? 'ok' : 'bad');
    v.line(3).eq(`'${chars[l]}' vs '${chars[r]}' → ${same ? 'match' : 'mismatch'}`, same ? 'ok' : 'bad');
    if (firstCmp) v.say(`Capital R and small r match once we ignore case. Move both pointers inward.`);
    else v.hold(550);
    firstCmp = false;
    if (!same) { ok = false; break; }
    l++;
    r--;
    b.ptrs({ l, r });
  }
  b.noPtr();
  v.line(5).eq(`${ok} · no copies made`, ok ? 'ok' : 'bad').say('The pointers meet without a mismatch, so it is a palindrome. We never built another string.');
  v.answer(isPal(S));

  recap(v, [{ name: 'Clean + reverse', time: 'O(n)', space: 'O(n)' }, { name: 'Two pointers with skipping', time: 'O(n)', space: 'O(1)' }], 'Compare from both ends and skip characters that do not count.', ['Palindrome → pointers at both ends', 'Skip-while loops inside the main loop'], 'Palindrome checks are two pointers at both ends. Filtering can happen on the fly by skipping.');
  return v.build();
}

const problem: Problem = {
  slug: 'valid-palindrome',
  statement: 'A phrase is a **palindrome** if, after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string `s`, return `true` if it is a palindrome.',
  examples: [{ input: 's = "A man, a plan, a canal: Panama"', output: 'true' }, { input: 's = "race a car"', output: 'false' }, { input: 's = " "', output: 'true', why: 'Empty after cleaning, which reads the same both ways.' }],
  constraints: ['1 ≤ s.length ≤ 2 · 10⁵', 's consists of printable ASCII characters'],
  hints: ['Compare the first and last characters that count.', 'Skip non-alphanumeric characters with inner loops.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Clean and reverse', idea: 'Build the lowercase alphanumeric string and compare it with its reverse.', time: 'O(n)', space: 'O(n)', bottleneck: 'Allocates extra strings.' },
    { id: 'optimal', kind: 'optimal', name: 'Two pointers', idea: 'Move l and r inward, skipping non-alphanumeric characters, comparing lowercase versions.', time: 'O(n)', space: 'O(1)' },
  ],
  pitfalls: ['Inner skip loops must also check `l < r`, or they run off the end on strings like ".,".', 'Digits count as alphanumeric: "0P" is not a palindrome.'],
  takeaway: 'Palindrome check = **two pointers from both ends**, filtering on the fly.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'isPalindrome', params: ['String'], ret: 'boolean',
    tests: [{ args: ['A man, a plan, a canal: Panama'], out: true }, { args: ['race a car'], out: false }, { args: [' '], out: true }, { args: ['0P'], out: false }, { args: ['.,'], out: true }],
    gen: (r: Rng) => { const half = r.str(r.int(0, 5), 'aAbB1 ,'); return [r.chance(0.5) ? half + r.str(r.int(0, 1), 'xX') + [...half].reverse().join('') : r.str(r.int(1, 10), 'abAB1 ,.')]; },
    ref: (s: string) => isPal(s),
  },
};

export default problem;
