import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const D = [1, 2, 9, 9];

function video() {
  const v = new Video('plus-one', 'Plus One');
  v.chapter('intro', 'The problem');
  const a = v.array('digits', D, { label: 'digits of a big number' });
  v.say('A large number is stored as an array of digits, most significant first. Add one to it and return the new digits.');
  v.eq('1299 + 1 = 1300');

  v.chapter('brute', 'Brute force: convert to a number', { cx: 'O(n)', code: ['x = digits as a number', 'x += 1', 'return digits of x'] });
  v.text('b', { title: 'Why this breaks', lines: ['The array can have 100 digits', 'A 64-bit integer holds only about 19 digits', '→ overflow; Java/C++ give garbage'] });
  v.say('The obvious idea is to turn the digits into a number, add one, and split it back. But the array can hold a hundred digits, and a sixty-four bit integer only holds about nineteen. It overflows.');
  v.drop('b');

  v.chapter('optimal', 'Optimal: add like on paper', { cx: 'O(n)', code: ['for i from last to first:', '  if digits[i] < 9:', '    digits[i] += 1; return digits', '  digits[i] = 0          (carry continues)', 'return [1] + digits      (all were 9)'] });
  const arr = [...D];
  for (let i = arr.length - 1; i >= 0; i--) {
    a.clearTones().ptr('i', i).tone(i, 'active');
    if (arr[i] < 9) {
      arr[i]++;
      a.set(i, arr[i]).tone(i, 'ok');
      v.line(2).eq(`${arr[i] - 1} + 1 = ${arr[i]}, no carry → done`, 'ok').say('Two is less than nine, so add one and stop. No more carry.');
      break;
    }
    arr[i] = 0;
    a.set(i, 0).tone(i, 'warn');
    v.line(3).eq('9 + 1 = 10 → write 0, carry 1', 'warn');
    if (i === arr.length - 1) v.say('Add one like on paper, from the right. Nine plus one is ten: write zero and carry one.');
    else v.hold(700);
  }
  a.noPtr();
  v.answer(arr);
  v.clear();
  const n9 = v.array('d', [9, 9, 9], { label: 'special case: all nines' });
  n9.toneRange(0, 2, 'warn');
  v.eq('999 + 1 = 1000 → new array [1, 0, 0, 0]').line(4);
  v.say('If every digit is nine, the carry falls off the front. Then the answer is a one followed by zeros, one digit longer.');
  n9.setAll([1, 0, 0, 0]).clearTones().tone(0, 'ok');
  v.hold(800);

  recap(v, [{ name: 'Convert to a number', time: 'O(n)', space: 'O(n)' }, { name: 'Carry from the right', time: 'O(n)', space: 'O(1)*' }], 'Converting overflows; carrying digit by digit works for any length. *Only the all-nines case allocates a new array.', ['Big numbers as digit arrays → do arithmetic like on paper', 'Stop as soon as there is no carry'], 'When numbers are too big for built-in types, do the arithmetic digit by digit.');
  return v.build();
}

const problem: Problem = {
  slug: 'plus-one',
  statement: 'A large non-negative integer is given as an array `digits`, most significant digit first, with no leading zeros. Add one to the integer and return the resulting array of digits.',
  examples: [
    { input: 'digits = [1,2,3]', output: '[1,2,4]' },
    { input: 'digits = [4,3,2,1]', output: '[4,3,2,2]' },
    { input: 'digits = [9]', output: '[1,0]' },
  ],
  constraints: ['1 ≤ digits.length ≤ 100', '0 ≤ digits[i] ≤ 9'],
  hints: ['How do you add 1 on paper?', 'What happens when a digit is 9? When every digit is 9?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Convert to a number', idea: 'Build the integer, add one, split back into digits.', time: 'O(n)', space: 'O(n)', bottleneck: 'Overflows for more than ~18 digits.' },
    { id: 'optimal', kind: 'optimal', name: 'Carry from the right', idea: 'From the last digit: if it is < 9, increment it and return. Otherwise set it to 0 and keep carrying. If the loop finishes, prepend a 1.', time: 'O(n)', space: 'O(1) (O(n) only when all digits are 9)' },
  ],
  pitfalls: ['Forgetting the all-nines case, where the result is one digit longer.'],
  takeaway: 'Numbers too big for built-in types: do **digit-by-digit arithmetic** with a carry.',
  video,
  videoArgs: [D],
  judge: {
    type: 'fn', fn: 'plusOne', params: ['int[]'], ret: 'int[]',
    tests: [
      { args: [[1, 2, 3]], out: [1, 2, 4] }, { args: [[4, 3, 2, 1]], out: [4, 3, 2, 2] }, { args: [[9]], out: [1, 0] }, { args: [[9, 9, 9]], out: [1, 0, 0, 0] },
      { args: [[9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 9, 9]], out: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 0, 0], big: true },
    ],
    gen: (r) => { const n = r.int(1, 15); const d = r.ints(n, 0, 9); if (d[0] === 0) d[0] = r.int(1, 9); if (r.chance(0.3)) for (let i = r.int(0, n - 1); i < n; i++) d[i] = 9; return [d]; },
    ref: (d: number[]) => { const a = [...d]; for (let i = a.length - 1; i >= 0; i--) { if (a[i] < 9) { a[i]++; return a; } a[i] = 0; } return [1, ...a]; },
  },
};

export default problem;
