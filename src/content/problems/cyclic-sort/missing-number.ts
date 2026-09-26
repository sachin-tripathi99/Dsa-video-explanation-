import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [3, 0, 1, 5, 2];

function video() {
  const v = new Video('missing-number', 'Missing Number');
  const n = A.length;
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: `n = ${n} distinct numbers from 0..${n}` });
  v.say(`The array holds ${words(n)} distinct numbers taken from zero to ${words(n)}. Exactly one number in that range is missing. Find it.`);

  v.chapter('brute', 'Brute force: sort, then look for the gap', { cx: 'O(n log n)', code: ['sort a', 'return the first i with a[i] != i (or n)'] });
  v.clear();
  const s = [...A].sort((x, y) => x - y);
  const sa = v.array('a', s, { label: 'sorted' });
  const gap = s.findIndex((x, i) => x !== i);
  sa.tone(gap, 'bad');
  v.line(1).eq(`a[${gap}] = ${s[gap]} ≠ ${gap} → ${gap} is missing`).say(`After sorting, the first index that does not hold its own value is the gap: ${words(gap)}. Sorting costs n log n.`);

  v.chapter('better', 'Better: hash set / cyclic sort', { cx: 'O(n)', code: ['seen = set(a)', 'return the first x in 0..n not in seen'] });
  v.eq('linear, but O(n) extra space (or modifies the array with cyclic sort)', 'ok').say('A hash set of the values finds it in linear time, with linear extra memory. Cyclic sort also works, at the cost of modifying the array.');

  v.chapter('optimal', 'Optimal: expected sum minus actual sum', { cx: 'O(n) · O(1)', code: ['expected = n · (n + 1) / 2', 'return expected − sum(a)'] });
  v.clear();
  v.array('a', A, { label: 'nums' });
  const expected = (n * (n + 1)) / 2;
  const actual = A.reduce((x, y) => x + y, 0);
  v.line(0).eq(`0 + 1 + … + ${n} = ${n}·${n + 1}/2 = ${expected}`).say(`If nothing were missing, the numbers zero to ${words(n)} would add up to n times n plus one over two: ${words(expected)}.`);
  v.line(1).eq(`${expected} − ${actual} = ${expected - actual}`, 'ok').say(`The actual sum is ${words(actual)}. The difference, ${words(expected - actual)}, is exactly the missing number. XOR of all indices and values works the same way and can never overflow.`);
  v.answer(expected - actual);

  recap(v, [{ name: 'Sort and scan', time: 'O(n log n)', space: 'O(1)' }, { name: 'Hash set', time: 'O(n)', space: 'O(n)' }, { name: 'Sum formula / XOR', time: 'O(n)', space: 'O(1)' }], 'One missing value in a known range → compare with the expected total.', ['Exactly one missing from a known set → sum or XOR'], 'When you know exactly what should be there, the difference of totals tells you what is missing.');
  return v.build();
}

const problem: Problem = {
  slug: 'missing-number',
  statement: 'Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.',
  examples: [{ input: 'nums = [3,0,1]', output: '2' }, { input: 'nums = [0,1]', output: '2' }, { input: 'nums = [9,6,4,2,3,5,7,0,1]', output: '8' }],
  constraints: ['1 ≤ n ≤ 10⁴', 'all numbers are unique'],
  hints: ['What would the total be if nothing were missing?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sort and scan', idea: 'Sort; the first i with nums[i] ≠ i is missing (or n).', time: 'O(n log n)', space: 'O(1)', bottleneck: 'Sorting.' },
    { id: 'better', kind: 'better', name: 'Hash set', idea: 'Put all values in a set; find the absent one in 0..n.', time: 'O(n)', space: 'O(n)' },
    { id: 'optimal', kind: 'optimal', name: 'Sum formula', idea: 'n(n+1)/2 − sum(nums). (XOR of indices and values also works.)', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Known range, one missing → **expected total − actual total**.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'missingNumber', params: ['int[]'], ret: 'int',
    tests: [{ args: [[3, 0, 1]], out: 2 }, { args: [[0, 1]], out: 2 }, { args: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], out: 8 }],
    gen: (r: Rng) => { const n = r.int(1, 10); const m = r.int(0, n); return [r.shuffle(Array.from({ length: n + 1 }, (_, i) => i).filter((x) => x !== m))]; },
    ref: (a: number[]) => (a.length * (a.length + 1)) / 2 - a.reduce((x, y) => x + y, 0),
  },
};

export default problem;
