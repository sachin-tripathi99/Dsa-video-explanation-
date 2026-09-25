import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const X = 1221;

function video() {
  const v = new Video('palindrome-number', 'Palindrome Number');
  v.chapter('intro', 'The problem');
  const d = v.array('d', [...String(X)].map(Number), { label: `x = ${X}` });
  d.tone([0, 3], 'cmp');
  v.say('Is the number a palindrome, reading the same forwards and backwards? One two two one is. Negative numbers never are, because of the minus sign.');
  d.clearTones().tone([1, 2], 'cmp');
  v.hold(700);

  v.chapter('brute', 'Brute force: convert to a string', { cx: 'O(d)', code: ['s = str(x)', 'return s == reverse(s)'] });
  v.clear();
  const s = v.array('s', [...String(X)], { label: 'as a string' });
  s.ptrs({ L: 0, R: 3 }).tone([0, 3], 'ok');
  v.line(1).say('The easy way: turn it into a string and compare it with its reverse. It works, in time proportional to the number of digits, but it uses extra memory for the string, and the follow-up asks us to avoid strings.');

  v.chapter('optimal', 'Optimal: reverse half the number', { cx: 'O(d)', code: ['if x < 0 or (x % 10 == 0 and x != 0): return false', 'rev = 0', 'while x > rev:', '  rev = rev * 10 + x % 10', '  x = x / 10', 'return x == rev or x == rev / 10'] });
  v.clear();
  const vv = v.vars('v', { x: X, rev: 0 });
  const left = v.array('x', [...String(X)].map(Number), { label: 'x (digits still in x)' });
  const right = v.array('rev', [], { label: 'rev (reversed digits)' });
  v.line(0).say('Without strings: peel digits off the end of x and build the reversed number. But only reverse half. Once rev catches up with x, compare them.');
  let x = X;
  let rev = 0;
  while (x > rev) {
    const dgt = x % 10;
    rev = rev * 10 + dgt;
    x = Math.floor(x / 10);
    left.pop();
    right.push(dgt);
    left.clearTones();
    right.clearTones().tone(right.length - 1, 'active');
    vv.set({ x, rev });
    v.line(3, 4).eq(`move ${dgt}: x = ${x}, rev = ${rev}`);
    if (rev < 10) v.say('Take the last digit, one, and move it into rev. x becomes one two two.');
    else v.say('Take two. Now x is twelve and rev is twelve, so we stop: we have reversed half the digits.');
  }
  const ok = x === rev || x === Math.floor(rev / 10);
  left.tone([0, 1], ok ? 'ok' : 'bad');
  right.tone([0, 1], ok ? 'ok' : 'bad');
  v.line(5).eq(`x = ${x}, rev = ${rev} → ${ok}`, ok ? 'ok' : 'bad').note('odd length: compare x with rev / 10');
  v.say('Twelve equals twelve, so it is a palindrome. For an odd number of digits, like one two one, the middle digit ends up in rev, so compare x with rev divided by ten.');
  v.clear();
  v.text('edge', { title: 'Two quick rejections', lines: ['x < 0 → false (the minus sign)', 'x ends in 0 but x ≠ 0 → false (no number starts with 0)'] });
  v.say('Two quick rejections first. Negative numbers are never palindromes. And a number ending in zero, other than zero itself, can not be one, because numbers do not start with zero. That also stops the half-reversal from misbehaving.');
  v.answer(ok);

  recap(v, [{ name: 'Convert to string', time: 'O(d)', space: 'O(d)' }, { name: 'Reverse half the digits', time: 'O(d)', space: 'O(1)' }], 'Both are linear in the number of digits. Reversing only half needs no string and can never overflow.', ['`x % 10` and `x / 10` peel digits', 'Reverse half and compare → no overflow'], 'Remember the half-reversal trick: stop when the reversed part catches up, and it cannot overflow.');
  return v.build();
}

const problem: Problem = {
  slug: 'palindrome-number',
  statement: 'Given an integer `x`, return `true` if `x` reads the same forwards and backwards, otherwise `false`. Follow-up: can you do it without converting to a string?',
  examples: [
    { input: 'x = 121', output: 'true' },
    { input: 'x = -121', output: 'false', why: 'Backwards it reads 121-.' },
    { input: 'x = 10', output: 'false', why: 'Backwards it reads 01.' },
  ],
  constraints: ['-2³¹ ≤ x ≤ 2³¹ − 1'],
  hints: ['Negative numbers can never be palindromes.', 'Build the reverse with `rev = rev * 10 + x % 10`. Reversing the full number could overflow… what if you only reverse half?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Convert to a string', idea: 'Compare the decimal string with its reverse.', time: 'O(d)', space: 'O(d)', bottleneck: 'Allocates a string; the follow-up forbids it.' },
    {
      id: 'optimal', kind: 'optimal', name: 'Reverse half the number',
      idea: 'Move digits from the end of `x` into `rev` until `rev ≥ x`. Then the number is a palindrome if `x == rev` (even length) or `x == rev / 10` (odd length).',
      steps: ['Return false if `x < 0`, or if `x % 10 == 0` and `x != 0`', 'While `x > rev`: `rev = rev * 10 + x % 10`, `x /= 10`', 'Return `x == rev || x == rev / 10`'],
      time: 'O(d)', space: 'O(1)',
    },
  ],
  pitfalls: ['Reversing the whole number can overflow a 32-bit int.', 'Forgetting numbers like 10 that end in 0: without the early check, half-reversal would say true.'],
  takeaway: 'Peel digits with `% 10` and `/ 10`. Reversing **only half** avoids overflow and extra space.',
  video,
  videoArgs: [X],
  judge: {
    type: 'fn', fn: 'isPalindrome', params: ['int'], ret: 'boolean',
    tests: [{ args: [121], out: true }, { args: [-121], out: false }, { args: [10], out: false }, { args: [0], out: true }, { args: [1221], out: true }, { args: [2147447412], out: true }, { args: [2147483647], out: false }, { args: [1000021], out: false }],
    gen: (r) => {
      if (r.chance(0.5)) {
        const half = String(r.int(1, 99999));
        const mid = r.chance(0.5) ? String(r.int(0, 9)) : '';
        const s = half + mid + [...half].reverse().join('');
        const n = Number(s);
        return [n <= 2147483647 ? n : r.int(0, 100000)];
      }
      return [r.int(-1000, 2000000000)];
    },
    ref: (x: number) => x >= 0 && String(x) === [...String(x)].reverse().join(''),
  },
};

export default problem;
