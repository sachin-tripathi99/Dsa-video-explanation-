import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const N = 30;

function video() {
  const v = new Video('trailing-zeroes', 'Factorial Trailing Zeroes');
  v.chapter('intro', 'The problem');
  v.text('p', { title: 'How many zeros at the end of n! ?', lines: ['5! = 120 → 1 zero', '10! = 3,628,800 → 2 zeros', '30! has 33 digits → too big to compute'] });
  v.say('How many zeros does n factorial end with? Five factorial is one hundred and twenty: one zero. But factorials get enormous fast, so we can not just compute them.');

  v.chapter('brute', 'Count factors of 5 one by one', { cx: 'O(n log n)', code: ['count = 0', 'for i in 1..n:', '  while i % 5 == 0:', '    count += 1; i /= 5'] });
  v.clear();
  v.text('why', { title: 'Where do trailing zeros come from?', lines: ['Each trailing zero = one factor of 10 = 2 × 5', 'Factors of 2 are everywhere (every even number)', 'So zeros = number of factors of 5 in 1 × 2 × … × n'] });
  v.say('Each trailing zero comes from a factor of ten, which is two times five. Twos are plentiful, every even number has one, so the fives are the bottleneck. Count the factors of five.');
  v.clear();
  const a = v.array('m', Array.from({ length: N / 5 }, (_, i) => (i + 1) * 5), { label: `multiples of 5 up to ${N}` });
  a.subs(a.values.map((x) => { let c = 0; let y = x as number; while (y % 5 === 0) { c++; y /= 5; } return `×${c}`; }));
  a.tone(4, 'warn');
  v.eq('25 = 5 × 5 contributes two fives', 'warn');
  v.say('Only multiples of five contribute. Most contribute one five, but twenty-five contributes two. Counting them number by number works, but loops up to n.');

  v.chapter('optimal', 'Optimal: n/5 + n/25 + n/125 + …', { cx: 'O(log n)', code: ['count = 0', 'while n > 0:', '  n = n / 5', '  count += n', 'return count'] });
  v.clear();
  const t = v.table('t', ['divide by', `${N} / that`, 'meaning'], []);
  let n = N;
  let count = 0;
  let pw = 5;
  while (n > 0) {
    n = Math.floor(n / 5);
    count += n;
    t.addRow([String(pw), String(n), pw === 5 ? 'numbers with at least one 5' : `numbers with at least ${Math.round(Math.log(pw) / Math.log(5))} fives`]);
    t.clearTones().tone(t.p.rows.length - 1, 'active');
    v.line(2, 3).eq(`count = ${count}`);
    if (pw === 5) v.say(`Instead, count in bulk: n over five numbers have at least one five. Thirty over five is six.`);
    else if (pw === 25) v.say('Thirty over twenty-five is one: twenty-five has a second five.');
    else v.hold(700);
    pw *= 5;
  }
  t.clearTones();
  v.eq(`${N}! ends with ${count} zeros`, 'ok').say(`Six plus one is seven. Thirty factorial ends in seven zeros. We divide by five each step, so it is O of log n.`);
  v.answer(count);

  recap(v, [{ name: 'Factor each number', time: 'O(n log n)', space: 'O(1)' }, { name: 'Sum of n / 5ᵏ', time: 'O(log n)', space: 'O(1)' }], 'Counting in bulk replaces the loop over every number.', ['Trailing zeros = min(#2s, #5s) = #5s', 'Count multiples of 5, 25, 125, …'], 'Turn "count per item" into "count per power": a classic math trick.');
  return v.build();
}

const problem: Problem = {
  slug: 'factorial-trailing-zeroes',
  statement: 'Given an integer `n`, return the number of trailing zeroes in `n!` (n factorial).',
  examples: [
    { input: 'n = 3', output: '0', why: '3! = 6' },
    { input: 'n = 5', output: '1', why: '5! = 120' },
    { input: 'n = 0', output: '0' },
  ],
  constraints: ['0 ≤ n ≤ 10⁴ (LeetCode), our tests go higher'],
  hints: ['A trailing zero is a factor 10 = 2 × 5. Which factor is rarer?', 'How many numbers ≤ n are multiples of 5? Of 25?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Count fives in every number', idea: 'For each `i` from 1 to n, count how many times 5 divides it and add up.', time: 'O(n log n)', space: 'O(1)', bottleneck: 'Visits every number up to n.' },
    { id: 'optimal', kind: 'optimal', name: 'Sum of n / 5 + n / 25 + …', idea: '`n / 5` numbers give at least one five, `n / 25` give a second, and so on. Keep dividing n by 5 and summing.', time: 'O(log n)', space: 'O(1)' },
  ],
  pitfalls: ['Computing n! directly overflows almost immediately.', 'Counting only multiples of 5 and forgetting the extra fives in 25, 125, …'],
  takeaway: 'Trailing zeros are limited by **factors of 5**: add `n/5 + n/25 + n/125 + …`.',
  video,
  videoArgs: [N],
  judge: {
    type: 'fn', fn: 'trailingZeroes', params: ['int'], ret: 'int',
    tests: [{ args: [3], out: 0 }, { args: [5], out: 1 }, { args: [0], out: 0 }, { args: [25], out: 6 }, { args: [10000], out: 2499 }, { args: [1000000000], out: 249999998, big: true }],
    gen: (r) => [r.int(0, 20000)],
    ref: (n: number) => { let c = 0; while (n) { n = Math.floor(n / 5); c += n; } return c; },
  },
};

export default problem;
