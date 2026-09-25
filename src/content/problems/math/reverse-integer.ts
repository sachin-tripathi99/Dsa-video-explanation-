import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const X = -123;

function video() {
  const v = new Video('reverse-integer', 'Reverse Integer');
  v.chapter('intro', 'The problem');
  v.text('p', { title: 'Reverse the digits of a 32-bit integer', lines: ['123 → 321', '−123 → −321', '120 → 21', '1534236469 → 9646324351 overflows → return 0'], shown: 4 }).tone(3, 'warn');
  v.say('Reverse the digits of a signed thirty-two bit integer. Keep the sign. And if the reversed number does not fit in thirty-two bits, return zero. You are not allowed to use sixty-four bit numbers.');

  v.chapter('brute', 'Using a string and a wider type', { cx: 'O(d)', code: ['s = reverse(str(|x|))', 'r = parse as 64-bit, apply the sign', 'return r if it fits in 32 bits else 0'] });
  v.clear();
  v.text('b', { title: 'Easy, but breaks the rules', lines: ['Reverse the string of digits, parse it as a long, check the range', 'Correct, but the problem says the environment has no 64-bit integers'] });
  v.say('The easy way reverses the string and parses it into a sixty-four bit long, then checks the range. It works, but the problem forbids storing sixty-four bit values, so interviewers expect the next approach.');

  v.chapter('optimal', 'Optimal: pop and push with an overflow check', { cx: 'O(d)', code: ['rev = 0', 'while x != 0:', '  d = x % 10;  x = x / 10  (truncate toward 0)', '  if rev > MAX/10 or rev < MIN/10: return 0', '  rev = rev * 10 + d', 'return rev'] });
  v.clear();
  const vv = v.vars('v', { x: X, rev: 0 });
  const out = v.array('rev', [], { label: 'digits pushed into rev' });
  let x = X;
  let rev = 0;
  let first = true;
  while (x !== 0) {
    const d = x % 10;
    x = Math.trunc(x / 10);
    rev = rev * 10 + d;
    out.push(d).clearTones().tone(out.length - 1, 'active');
    vv.set({ x, digit: d, rev });
    v.line(2, 4).eq(`pop ${d}, push → rev = ${rev}`);
    if (first) v.say('Pop the last digit with mod ten and push it onto rev. In Java and C plus plus, minus one two three mod ten is minus three, so negative numbers just work: the digits carry the sign.');
    else v.hold(800);
    first = false;
  }
  v.eq(`rev = ${rev}`, 'ok');
  v.say('The result is minus three two one.');
  v.clear();
  v.text('ov', { title: 'Checking overflow before it happens', lines: ['MAX = 2,147,483,647', 'rev * 10 + d overflows if rev > MAX / 10 = 214,748,364', '(or rev == 214,748,364 and d > 7)', 'Same on the negative side with MIN / 10'] }).tone(1, 'warn');
  v.line(3).say('The trick is to check before multiplying. If rev is already bigger than the max divided by ten, multiplying by ten would overflow, so return zero. The same check applies on the negative side. Because an input digit can not exceed two in the top position, checking rev against max over ten is enough.');
  v.answer(rev);

  recap(v, [{ name: 'String + 64-bit parse', time: 'O(d)', space: 'O(d)' }, { name: 'Pop/push with overflow check', time: 'O(d)', space: 'O(1)' }], 'Both are linear in the digits; only the second follows the 32-bit rule.', ['Check `rev > MAX / 10` before `rev * 10`', 'Truncating division keeps the sign in Java and C++'], 'The overflow-before-multiply check is a pattern worth remembering for any digit-building problem.');
  return v.build();
}

const problem: Problem = {
  slug: 'reverse-integer',
  statement: 'Given a signed 32-bit integer `x`, return `x` with its digits reversed. If reversing makes the value go outside the 32-bit range `[−2³¹, 2³¹ − 1]`, return `0`. Assume you cannot store 64-bit integers.',
  examples: [
    { input: 'x = 123', output: '321' },
    { input: 'x = -123', output: '-321' },
    { input: 'x = 120', output: '21' },
  ],
  constraints: ['-2³¹ ≤ x ≤ 2³¹ − 1'],
  hints: ['Pop the last digit with `% 10`, push it with `rev * 10 + d`.', 'Before `rev * 10`, check whether it would overflow: compare `rev` with `MAX / 10`.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'String reverse + 64-bit check', idea: 'Reverse the digit string, parse as a 64-bit integer, apply the sign, check the range.', time: 'O(d)', space: 'O(d)', bottleneck: 'Relies on 64-bit storage, which the problem rules out.' },
    {
      id: 'optimal', kind: 'optimal', name: 'Pop and push digits with an overflow check',
      idea: 'Repeatedly take `d = x % 10` and `x /= 10`. Before `rev = rev * 10 + d`, return 0 if `rev > MAX/10` or `rev < MIN/10`.',
      time: 'O(d)', space: 'O(1)',
    },
  ],
  pitfalls: ['Python `%` and `//` round toward negative infinity; handle the sign separately in Python.', 'Checking overflow after multiplying is too late in Java/C++.'],
  takeaway: 'When building a number digit by digit in fixed-width integers, **check for overflow before multiplying**.',
  video,
  videoArgs: [X],
  judge: {
    type: 'fn', fn: 'reverse', params: ['int'], ret: 'int',
    tests: [{ args: [123], out: 321 }, { args: [-123], out: -321 }, { args: [120], out: 21 }, { args: [0], out: 0 }, { args: [1534236469], out: 0 }, { args: [-2147483648], out: 0 }, { args: [1463847412], out: 2147483641 }, { args: [-2147483412], out: -2143847412 }],
    gen: (r) => [r.chance(0.3) ? r.int(1000000000, 2147483647) * (r.chance(0.5) ? -1 : 1) : r.int(-99999, 99999)],
    ref: (x: number) => { const s = [...String(Math.abs(x))].reverse().join(''); const v = Number(s) * Math.sign(x || 1); return v > 2147483647 || v < -2147483648 ? 0 : v; },
  },
};

export default problem;
