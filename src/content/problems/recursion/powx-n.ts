import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

function video() {
  const v = new Video('powx-n', 'Pow(x, n)');
  v.chapter('intro', 'The problem');
  v.text('p', { title: 'Compute xⁿ', lines: ['x is a decimal number, n is any 32-bit integer', 'pow(2, 10) = 1024', 'pow(2, −2) = 1 / 2² = 0.25', 'n can be as large as 2³¹ − 1 ≈ 2.1 billion'], shown: 2 });
  v.say('Implement pow of x and n: x multiplied by itself n times. Pow of two and ten is one thousand and twenty-four.');
  v.text('p', { title: 'Compute xⁿ', lines: ['x is a decimal number, n is any 32-bit integer', 'pow(2, 10) = 1024', 'pow(2, −2) = 1 / 2² = 0.25', 'n can be as large as 2³¹ − 1 ≈ 2.1 billion'], shown: 4 }).tone(3, 'warn');
  v.say('A negative n means one over x to the positive n. And n can be over two billion, which is the part that makes this interesting.');

  v.chapter('brute', 'Brute force: multiply n times', { cx: 'O(n)', code: ['result = 1', 'repeat |n| times:', '  result *= x', 'if n < 0: result = 1 / result'] });
  v.clear();
  const steps = v.array('steps', Array.from({ length: 10 }, () => null), { label: 'multiplications for 2¹⁰' });
  const vr = v.vars('v', { result: 1 });
  let r = 1;
  for (let i = 0; i < 10; i++) {
    r *= 2;
    steps.set(i, r).clearTones().tone(i, 'active');
    vr.set({ result: r });
    v.counter(`multiplications: ${i + 1}`).line(2);
    if (i === 0) v.say('The obvious way: start with one and multiply by x, n times.');
    else v.hold(330);
  }
  v.eq('n = 2,147,483,647 → 2 billion multiplications', 'bad');
  v.say('Ten multiplications for n equals ten. But for n near two billion it is two billion multiplications. Too slow. We need to reuse work.');

  v.chapter('better', 'Better: halve the exponent', { cx: 'O(log n)', code: ['pow(x, n):', '  if n == 0: return 1', '  half = pow(x, n / 2)', '  if n is even: return half * half', '  else: return half * half * x'] });
  v.clear();
  const t = v.tree('t', { binary: false, label: 'each call halves n' });
  const chain = [10, 5, 2, 1, 0];
  let parent: string | null = null;
  const ids: string[] = [];
  chain.forEach((k, i) => {
    parent = t.add(parent, `2^${k}`);
    ids.push(parent);
    t.clearTones().tone(parent, 'active');
    v.counter(`calls: ${i + 1}`).line(k === 0 ? 1 : 2);
    if (i === 0) v.say('Key insight: x to the ten equals x to the five, squared. We only need to compute x to the five once and square it.');
    else if (i === 1) v.say('X to the five is x to the two, squared, times one extra x, because five is odd.');
    else v.hold(600);
  });
  const vals = [1024, 32, 4, 2, 1];
  for (let i = chain.length - 1; i >= 0; i--) {
    t.badge(ids[i], `=${vals[i]}`).clearTones().tone(ids[i], 'ok');
    const k = chain[i];
    const half = i + 1 < chain.length ? vals[i + 1] : 1;
    v.line(k === 0 ? 1 : k % 2 === 0 ? 3 : 4).eq(k === 0 ? 'x⁰ = 1' : k % 2 === 0 ? `x^${k} = ${half} × ${half} = ${vals[i]}` : `x^${k} = ${half} × ${half} × 2 = ${vals[i]}`);
    if (i === chain.length - 1) v.say('The base case is n equals zero: the answer is one. Then each level squares the result on the way back up.');
    else v.hold(750);
  }
  v.eq('n halves each call → about log₂ n calls', 'ok').note('n = 2 billion → only 31 calls');
  v.say('Since n halves each time, there are only about log n calls. For two billion, just thirty-one. The recursion stack uses O of log n space.');

  v.chapter('optimal', 'Optimal: binary exponentiation (loop)', { cx: 'O(log n)', code: ['N = |n| (as a 64-bit number)', 'result = 1', 'while N > 0:', '  if N is odd: result *= x', '  x *= x;  N //= 2', 'return n < 0 ? 1/result : result'] });
  v.clear();
  const bits = v.bits('b', [{ label: 'n = 10', bits: '1010', note: '= 8 + 2' }]);
  const vv = v.vars('v', { N: 10, x: 2, result: 1 });
  v.line(1).say('We can do the same thing with a loop, reading n in binary. Ten is one zero one zero: eight plus two. So x to the ten is x to the eight times x squared.');
  let N = 10;
  let x = 2;
  let res = 1;
  let bit = 3;
  while (N > 0) {
    const odd = N % 2 === 1;
    const tones: Record<number, 'active' | 'ok'> = { [bit]: odd ? 'ok' : 'active' };
    bits.update({ rows: [{ label: 'n = 10', bits: '1010', note: '= 8 + 2', tones }] });
    if (odd) res *= x;
    v.line(odd ? 3 : 4).eq(odd ? `bit is 1 → result *= ${x} → ${res}` : `bit is 0 → skip`, odd ? 'ok' : 'none');
    vv.set({ N, x, result: res });
    if (bit === 3) v.say('Look at the lowest bit. If it is one, multiply the result by the current x. Then square x and shift n right by one.');
    else v.hold(1000);
    x *= x;
    N = Math.floor(N / 2);
    bit--;
    vv.set({ N, x, result: res });
    v.line(4).hold(600);
  }
  v.eq(`result = ${res}`, 'ok').note('O(log n) time · O(1) space');
  v.say('Four loop steps, one per bit, and the result is one thousand and twenty-four. Log n time and constant space.');
  v.answer(res);
  v.clear();
  v.text('neg', { title: 'Negative n and overflow', lines: ['n < 0: compute x^|n|, then return 1 / result', '|−2³¹| = 2³¹ does not fit in a 32-bit int', 'So store |n| in a 64-bit long first'] }).tone(1, 'bad');
  v.say('Two details. For negative n, compute the positive power and take one over it. And careful: the absolute value of the smallest 32-bit integer does not fit in an int, so convert n to a 64-bit long first.');

  recap(
    v,
    [
      { name: 'Multiply n times', time: 'O(n)', space: 'O(1)' },
      { name: 'Recursive halving', time: 'O(log n)', space: 'O(log n)' },
      { name: 'Binary exponentiation loop', time: 'O(log n)', space: 'O(1)' },
    ],
    'Multiplying n times is linear. Halving the exponent reuses the half result, giving log n. The loop version reads the bits of n and needs no stack.',
    ['xⁿ = (x^(n/2))², times x if n is odd', 'Halving the problem → O(log n)', 'Watch overflow when negating the minimum int'],
    'Remember: square the half result instead of recomputing it. Halving a problem each step is the source of every log n in this course.',
  );
  return v.build();
}

const problem: Problem = {
  slug: 'powx-n',
  statement: 'Implement `pow(x, n)`, which returns **x raised to the power n**. `x` is a floating point number and `n` is a 32-bit signed integer, possibly negative.',
  examples: [
    { input: 'x = 2.00000, n = 10', output: '1024.00000' },
    { input: 'x = 2.10000, n = 3', output: '9.26100' },
    { input: 'x = 2.00000, n = -2', output: '0.25000', why: '2⁻² = 1/2² = 1/4' },
  ],
  constraints: ['-100.0 < x < 100.0', '-2³¹ ≤ n ≤ 2³¹ − 1', 'Either x ≠ 0 or n > 0', '-10⁴ ≤ xⁿ ≤ 10⁴'],
  hints: ['Multiplying n times works but n can be 2 billion.', 'x¹⁰ = (x⁵)². How do you get x⁵ from x²?', 'Handle negative n with 1 / x^|n|, and beware of |−2³¹| overflowing an int.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Multiply |n| times', idea: 'Start at 1 and multiply by `x` `|n|` times; invert at the end if `n` is negative.', time: 'O(n)', space: 'O(1)', bottleneck: 'Up to 2³¹ multiplications: far too slow.' },
    { id: 'better', kind: 'better', name: 'Recursive fast power', idea: 'Compute `half = pow(x, n/2)` once, then return `half * half` (times `x` if `n` is odd). The exponent halves at each call.', time: 'O(log n)', space: 'O(log n)', bottleneck: 'Uses a call stack of depth log n; a loop can do it in O(1) space.' },
    {
      id: 'optimal', kind: 'optimal', name: 'Binary exponentiation (iterative)',
      idea: 'Read `n` in binary. Keep squaring `x` (x, x², x⁴, x⁸…) and multiply it into the result whenever the current bit of `n` is 1.',
      steps: ['`N = |n|` as a 64-bit integer', '`result = 1`', 'While `N > 0`: if `N` is odd, `result *= x`; then `x *= x`, `N /= 2`', 'Return `1 / result` if `n < 0`, else `result`'],
      time: 'O(log n)', space: 'O(1)',
    },
  ],
  pitfalls: ['`-n` overflows when `n = -2³¹`: convert to `long` first.', 'Calling `pow(x, n/2)` twice instead of storing it destroys the speed-up (it becomes O(n) again).'],
  takeaway: 'Reuse the half result: **xⁿ = (x^(n/2))²**. Halving the problem each step gives O(log n); the same trick powers modular exponentiation.',
  video,
  videoArgs: [2, 10],
  judge: {
    type: 'fn', fn: 'myPow', params: ['double', 'int'], ret: 'double', cmp: 'float',
    tests: [
      { args: [2, 10], out: 1024 },
      { args: [2.1, 3], out: 9.261 },
      { args: [2, -2], out: 0.25 },
      { args: [1, 2147483647], out: 1, big: true },
      { args: [-1, -2147483648], out: 1, big: true },
      { args: [0.5, 0], out: 1 },
      { args: [-2, 3], out: -8 },
    ],
    gen: (r) => {
      const n = r.int(-8, 8);
      let x = r.int(-250, 250) / 100;
      if (x === 0 && n <= 0) x = 1.5;
      return [x, n];
    },
    ref: (x: number, n: number) => Math.pow(x, n),
  },
};

export default problem;
