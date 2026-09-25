import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const A = [3, 30, 34, 5, 9];

function video() {
  const v = new Video('largest-number', 'Largest Number');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'nums' });
  v.say('Arrange the numbers so that, glued together, they form the largest possible number. Return it as a string.');
  v.eq('answer: "9534330"', 'ok').say('For three, thirty, thirty-four, five and nine, the answer is nine five three four three three zero.');

  v.chapter('brute', 'Brute force: try every order', { cx: 'O(n! · n)', code: ['for each permutation p:', '  best = max(best, join(p))'] });
  v.clear();
  v.text('b', { title: 'Try all n! orders', lines: ['5 numbers → 120 orders', '10 numbers → 3,628,800 orders', '100 numbers → impossible'] });
  v.say('We could try every ordering and keep the biggest string. That is n factorial orders: fine for five numbers, impossible for a hundred.');

  v.chapter('optimal', 'Optimal: sort by a custom rule', { cx: 'O(n log n)', code: ['sort strings so that a comes before b if a + b > b + a', 'join them', 'if the result starts with "0": return "0"'] });
  v.clear();
  const t = v.table('cmp', ['a', 'b', 'a + b', 'b + a', 'order'], []);
  const pairs: [string, string][] = [['3', '30'], ['3', '34'], ['9', '5']];
  v.say('Instead, decide the order of any two numbers directly. Should a come before b? Just glue them both ways and compare.');
  for (const [a, b] of pairs) {
    const ab = a + b;
    const ba = b + a;
    t.addRow([a, b, ab, ba, ab > ba ? `${a} first` : `${b} first`]);
    t.clearTones().tone(t.p.rows.length - 1, 'active');
    if (a === '3' && b === '30') v.say('Three and thirty: three thirty beats thirty three, so three goes first, even though thirty is bigger as a number.');
    else v.hold(1000);
  }
  t.clearTones();
  v.say('This rule is consistent, so we can use it as the comparator in a normal sort.');
  v.clear();
  const sorted = A.map(String).sort((x, y) => (y + x).localeCompare(x + y));
  const s = v.array('s', sorted, { label: 'sorted with the rule a + b > b + a' });
  s.toneRange(0, sorted.length - 1, 'sorted');
  const ans = sorted.join('');
  v.eq(`"${ans}"`, 'ok').line(1);
  v.say('Sorted: nine, five, thirty-four, three, thirty. Joined, that is the answer. One sort, so n log n comparisons, each comparing short strings.');
  v.note('edge case: [0, 0] → "0", not "00"');
  v.line(2).say('One edge case: if every number is zero, the result would be a string of zeros. Return a single zero instead.');
  v.answer(ans);

  recap(v, [{ name: 'Try every order', time: 'O(n! · n)', space: 'O(n)' }, { name: 'Sort with a + b vs b + a', time: 'O(n log n · d)', space: 'O(n)' }], 'Permutations explode; a custom comparator sorts in n log n.', ['"Best order" of items → can you compare any two items directly?', 'Custom comparators: Java compareTo, Python cmp_to_key, C++ lambdas'], 'When you need the best arrangement, look for a pairwise rule and sort with it.');
  return v.build();
}

const problem: Problem = {
  slug: 'largest-number',
  statement: 'Given a list of non-negative integers `nums`, arrange them so they form the **largest number** when concatenated, and return it as a string.',
  examples: [
    { input: 'nums = [10,2]', output: '"210"' },
    { input: 'nums = [3,30,34,5,9]', output: '"9534330"' },
    { input: 'nums = [0,0]', output: '"0"' },
  ],
  constraints: ['1 ≤ nums.length ≤ 100', '0 ≤ nums[i] ≤ 10⁹'],
  hints: ['Numeric order is wrong: 3 should come before 30.', 'For two numbers a and b, which of "ab" and "ba" is bigger?', 'What if every number is 0?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Try every permutation', idea: 'Generate all orders, join each, keep the lexicographically largest (all have equal length).', time: 'O(n! · n)', space: 'O(n)', bottleneck: 'n! orders: hopeless beyond ~10 numbers.' },
    { id: 'optimal', kind: 'optimal', name: 'Custom comparator', idea: 'Convert to strings and sort so that `a` comes before `b` when `a + b > b + a`. Join; if the first character is "0", return "0".', time: 'O(n log n · d)', space: 'O(n)' },
  ],
  pitfalls: ['Sorting numerically or lexicographically: "3" vs "30" breaks both.', 'Returning "00…0" when all numbers are zero.'],
  takeaway: 'To find the best **ordering**, find a **pairwise comparison rule** and sort with it.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'largestNumber', params: ['int[]'], ret: 'String',
    tests: [
      { args: [[10, 2]], out: '210' },
      { args: [[3, 30, 34, 5, 9]], out: '9534330' },
      { args: [[0, 0]], out: '0' },
      { args: [[1000000000, 999999999, 0, 12, 121, 8247, 824]], out: '99999999982482471212110000000000', big: true },
    ],
    gen: (r) => [r.ints(r.int(1, 6), 0, r.pick([9, 120, 1000]))],
    ref: (a: number[]) => { const s = a.map(String).sort((x, y) => ((y + x) > (x + y) ? 1 : (y + x) < (x + y) ? -1 : 0)).join(''); return s[0] === '0' ? '0' : s; },
  },
};

export default problem;
