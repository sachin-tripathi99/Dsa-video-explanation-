import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const NUMS = [2, 5, 6, 9, 10];

function video() {
  const v = new Video('gcd-array', 'Find Greatest Common Divisor of Array');
  v.chapter('intro', 'The problem');
  const a = v.array('nums', NUMS, { label: 'nums' });
  v.say('Return the greatest common divisor of the smallest and the largest number in the array.');
  a.tone(0, 'active').tone(4, 'active');
  v.eq('min = 2, max = 10').say('First find them in one pass: the smallest is two and the largest is ten.');

  v.chapter('brute', 'Brute force: try divisors', { cx: 'O(min)', code: ['for d = min down to 1:', '  if min % d == 0 and max % d == 0:', '    return d'] });
  v.clear();
  const d = v.array('d', [2, 1], { label: 'candidate divisors, largest first' });
  d.ptr('d', 0).tone(0, 'ok');
  v.line(1).eq('10 % 2 == 0 and 2 % 2 == 0 → 2', 'ok');
  v.say('Brute force tries every candidate from the smaller number downwards and returns the first that divides both. That can take as many steps as the smaller number, up to a thousand here.');

  v.chapter('optimal', "Optimal: Euclid's algorithm", { cx: 'O(log min)', code: ['a, b = max, min', 'while b != 0:', '  a, b = b, a % b', 'return a'] });
  v.clear();
  const t = v.table('t', ['a', 'b', 'a % b'], [['10', '2', '0']]);
  t.tone(0, 'active');
  v.line(2).say('Euclid replaces the pair with b and a mod b. Ten mod two is zero.');
  t.addRow(['2', '0', '']);
  t.clearTones().tone(1, 'ok');
  v.line(3).eq('gcd = 2', 'ok').say('When b becomes zero, a is the answer: two. The numbers shrink at least by half every two steps, so it is logarithmic.');
  v.answer(2);

  recap(v, [{ name: 'Try every divisor', time: 'O(n + min)', space: 'O(1)' }, { name: 'Min/max + Euclid', time: 'O(n + log max)', space: 'O(1)' }], 'Finding min and max is one pass. Euclid finishes the job in logarithmic steps.', ['gcd(a, b) = gcd(b, a % b), gcd(a, 0) = a', 'Built-ins: Math/std::gcd, math.gcd'], "Euclid's algorithm is short enough to write from memory. Do.");
  return v.build();
}

const problem: Problem = {
  slug: 'find-greatest-common-divisor-of-array',
  statement: 'Given an integer array `nums`, return the **greatest common divisor** of the smallest and the largest number in `nums`.',
  examples: [
    { input: 'nums = [2,5,6,9,10]', output: '2', why: 'gcd(2, 10) = 2' },
    { input: 'nums = [7,5,6,8,3]', output: '1', why: 'gcd(3, 8) = 1' },
    { input: 'nums = [3,3]', output: '3' },
  ],
  constraints: ['2 ≤ nums.length ≤ 1000', '1 ≤ nums[i] ≤ 1000'],
  hints: ['Find the min and max in one pass.', 'gcd(a, b) = gcd(b, a mod b).'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Try divisors from min down', idea: 'Test every `d` from `min` down to 1 and return the first that divides both.', time: 'O(n + min)', space: 'O(1)', bottleneck: 'Linear in the value of min; Euclid is logarithmic.' },
    { id: 'optimal', kind: 'optimal', name: "Euclid's algorithm", idea: 'Replace `(a, b)` with `(b, a % b)` until `b == 0`.', time: 'O(n + log max)', space: 'O(1)' },
  ],
  takeaway: "Memorise **Euclid's GCD**: `while b: a, b = b, a % b`.",
  video,
  videoArgs: [NUMS],
  judge: {
    type: 'fn', fn: 'findGCD', params: ['int[]'], ret: 'int',
    tests: [{ args: [[2, 5, 6, 9, 10]], out: 2 }, { args: [[7, 5, 6, 8, 3]], out: 1 }, { args: [[3, 3]], out: 3 }],
    gen: (r) => [r.ints(r.int(2, 12), 1, 1000)],
    ref: (a: number[]) => { let x = Math.max(...a); let y = Math.min(...a); while (y) [x, y] = [y, x % y]; return x; },
  },
};

export default problem;
