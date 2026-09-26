import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const S = 'abdcba';

function isPal(s: string, l: number, r: number) {
  while (l < r) if (s[l++] !== s[r--]) return false;
  return true;
}
function valid(s: string) {
  let l = 0, r = s.length - 1;
  while (l < r) { if (s[l] !== s[r]) return isPal(s, l + 1, r) || isPal(s, l, r - 1); l++; r--; }
  return true;
}

function video() {
  const v = new Video('valid-palindrome-ii', 'Valid Palindrome II');
  v.chapter('intro', 'The problem');
  v.array('s', S.split(''), { label: `s = "${S}"` });
  v.say('Can this string become a palindrome if we delete at most one character?');
  v.eq('delete "d" → "abcba" ✓', 'ok');

  v.chapter('brute', 'Brute force: try deleting each character', { cx: 'O(n²)', code: ['if isPalindrome(s): return true', 'for i in 0..n−1:', '  if isPalindrome(s without s[i]): return true', 'return false'] });
  v.eq(`${S.length} deletions × O(n) check each → O(n²)`, 'warn').say('We could try deleting every character in turn and check the rest. That is n palindrome checks of length n: n squared.');

  v.chapter('optimal', 'Optimal: at the first mismatch, try both skips', { cx: 'O(n)', code: ['l, r = 0, n − 1', 'while l < r:', '  if s[l] != s[r]:', '    return isPal(l + 1, r) or isPal(l, r − 1)', '  l += 1; r −= 1', 'return true'] });
  v.clear();
  const a = v.array('s', S.split(''), { label: `s = "${S}"` });
  let l = 0;
  let r = S.length - 1;
  v.say('Walk two pointers inward as in a normal palindrome check. Matching pairs never need deleting.');
  while (l < r && S[l] === S[r]) {
    a.ptrs({ l, r }).tone([l, r], 'ok');
    v.line(1).eq(`'${S[l]}' = '${S[r]}'`).hold(600);
    l++;
    r--;
  }
  a.ptrs({ l, r }).tone([l, r], 'bad');
  v.line(2).eq(`'${S[l]}' ≠ '${S[r]}' → one of them must go`, 'bad').say(`At the first mismatch, ${S[l]} against ${S[r]}, we must delete one of these two characters. Nothing else can fix it. So there are only two options to check.`);
  const skipL = isPal(S, l + 1, r);
  a.clearTones().toneRange(0, l - 1, 'done').toneRange(r + 1, S.length - 1, 'done').tone(l, 'dim').toneRange(l + 1, r, skipL ? 'ok' : 'bad');
  v.line(3).eq(`delete '${S[l]}': s[${l + 1}..${r}] = "${S.slice(l + 1, r + 1)}" is ${skipL ? '' : 'not '}a palindrome`, skipL ? 'ok' : 'bad').say(skipL ? `Delete the ${S[l]}: what remains between the pointers, ${S.slice(l + 1, r + 1).split('').join(', ')}, is a palindrome. So the answer is true.` : 'Deleting the left one does not work.');
  const skipR = isPal(S, l, r - 1);
  a.clearTones().toneRange(0, l - 1, 'done').toneRange(r + 1, S.length - 1, 'done').tone(r, 'dim').toneRange(l, r - 1, skipR ? 'ok' : 'bad');
  v.eq(`delete '${S[r]}': s[${l}..${r - 1}] = "${S.slice(l, r)}" is ${skipR ? '' : 'not '}a palindrome`, skipR ? 'ok' : 'bad').say(`We would also accept deleting the ${S[r]} instead, which leaves ${S.slice(l, r)}. Either way, each option is one linear check, so the whole thing is O of n.`);
  a.noPtr().clearTones();
  v.answer(valid(S));

  recap(v, [{ name: 'Try every deletion', time: 'O(n²)', space: 'O(n)' }, { name: 'Two pointers + two checks at the mismatch', time: 'O(n)', space: 'O(1)' }], 'Only the first mismatching pair can be the deleted character.', ['“Delete at most one” → branch once at the first conflict'], 'When you get one correction, spend it at the first conflict, and check both ways.');
  return v.build();
}

const problem: Problem = {
  slug: 'valid-palindrome-ii',
  statement: 'Given a string `s`, return `true` if `s` can be a palindrome after deleting **at most one** character from it.',
  examples: [{ input: 's = "aba"', output: 'true' }, { input: 's = "abca"', output: 'true', why: 'Delete "c".' }, { input: 's = "abc"', output: 'false' }],
  constraints: ['1 ≤ s.length ≤ 10⁵', 'lowercase English letters'],
  hints: ['Do the normal palindrome check. What happens at the first mismatch?', 'Try skipping the left character, then the right one.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Try every deletion', idea: 'For each index, check whether the string without it is a palindrome.', time: 'O(n²)', space: 'O(n)', bottleneck: 'n full checks.' },
    { id: 'optimal', kind: 'optimal', name: 'Two pointers + two checks', idea: 'Move inward while characters match; at the first mismatch, return isPal(l+1, r) or isPal(l, r−1).', time: 'O(n)', space: 'O(1)' },
  ],
  pitfalls: ['Checking only one of the two skips: for "cuppucu"-like strings only one side works.'],
  takeaway: 'One allowed fix → **branch once** at the first conflict, both ways.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'validPalindrome', params: ['String'], ret: 'boolean',
    tests: [{ args: ['aba'], out: true }, { args: ['abca'], out: true }, { args: ['abc'], out: false }, { args: ['cupuufuc'], out: false }, { args: ['ebcbbececabbacecbbcbe'], out: true }],
    gen: (r: Rng) => { const h = r.str(r.int(0, 5), 'abc'); let s = h + r.str(r.int(0, 1), 'abc') + [...h].reverse().join(''); if (s.length && r.chance(0.7)) { const i = r.int(0, s.length); s = s.slice(0, i) + r.pick(['a', 'b', 'c']) + s.slice(i); } if (r.chance(0.3)) s = s + r.str(2, 'abc'); return [s || 'a']; },
    ref: (s: string) => valid(s),
  },
};

export default problem;
