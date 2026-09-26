import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const S = ['h', 'e', 'l', 'l', 'o'];

function video() {
  const v = new Video('reverse-string', 'Reverse String');
  v.chapter('intro', 'The problem');
  v.array('s', S, { label: 'reverse this array of characters in place' });
  v.say('Reverse an array of characters. The catch: do it in place, using only constant extra memory.');

  v.chapter('brute', 'Brute force: build a reversed copy', { cx: 'O(n) space', code: ['copy = []', 'for i from n−1 down to 0: copy.append(s[i])', 'for i in 0..n−1: s[i] = copy[i]'] });
  v.clear();
  const src = v.array('s', S, { label: 's' });
  const cp = v.array('copy', [], { label: 'copy (extra memory)' });
  v.say('The obvious way reads the array backwards into a new array, then copies it back.');
  for (let i = S.length - 1; i >= 0; i--) {
    src.clearTones().tone(i, 'active');
    cp.push(S[i]);
    v.line(1).hold(450);
  }
  src.clearTones();
  v.eq('works, but uses n extra slots', 'warn').say('That works in linear time, but the copy uses n extra slots of memory, which the problem does not allow.');

  v.chapter('optimal', 'Optimal: swap from both ends', { cx: 'O(n) time · O(1) space', code: ['l, r = 0, n − 1', 'while l < r:', '  swap(s[l], s[r])', '  l += 1; r −= 1'] });
  v.clear();
  const a = v.array('s', [...S], { label: 's' });
  const cur = [...S];
  a.ptrs({ l: 0, r: S.length - 1 });
  v.line(0).say('Instead, notice that the first and last characters simply trade places, then the second and second to last, and so on. Two pointers from the ends.');
  for (let l = 0, r = S.length - 1; l < r; l++, r--) {
    a.ptrs({ l, r }).clearTones().tone([l, r], 'cmp');
    v.line(2).eq(`swap s[${l}] = '${cur[l]}' and s[${r}] = '${cur[r]}'`).hold(500);
    [cur[l], cur[r]] = [cur[r], cur[l]];
    a.swap(l, r).tone([l, r], 'ok');
    v.hold(500);
  }
  a.clearTones().noPtr();
  v.eq(`"${cur.join('')}" · only one temporary variable`, 'ok').say('When the pointers meet, the middle character stays where it is and we are done. Each pair is swapped once, with no extra array.');
  v.answer(cur);

  recap(v, [{ name: 'Reversed copy', time: 'O(n)', space: 'O(n)' }, { name: 'Swap from both ends', time: 'O(n)', space: 'O(1)' }], 'Swapping symmetric positions reverses in place.', ['“In place” + symmetry → pointers at both ends'], 'Reversal is the simplest two-pointer pattern, and it shows up inside bigger problems like rotate array.');
  return v.build();
}

const problem: Problem = {
  slug: 'reverse-string',
  statement: 'Write a function that reverses a string given as an array of characters `s`. Modify the input array **in place** with O(1) extra memory.',
  examples: [{ input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' }, { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' }],
  constraints: ['1 ≤ s.length ≤ 10⁵', 's[i] is a printable ASCII character'],
  hints: ['Which characters trade places?', 'Use two indexes, one at each end.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Reversed copy', idea: 'Read s backwards into a new array, then copy it back.', time: 'O(n)', space: 'O(n)', bottleneck: 'Needs a whole extra array.' },
    { id: 'optimal', kind: 'optimal', name: 'Two pointers', idea: 'Swap s[l] and s[r], move l right and r left until they meet.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Symmetric positions + **in place** → swap with pointers at both ends.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'reverseString', params: ['char[]'], ret: 'void', inplace: 0,
    tests: [{ args: [['h', 'e', 'l', 'l', 'o']], out: ['o', 'l', 'l', 'e', 'h'] }, { args: [['H', 'a', 'n', 'n', 'a', 'h']], out: ['h', 'a', 'n', 'n', 'a', 'H'] }, { args: [['x']], out: ['x'] }],
    gen: (r: Rng) => [r.str(r.int(1, 12), 'abcXYZ').split('')],
    ref: (s: string[]) => [...s].reverse(),
  },
};

export default problem;
