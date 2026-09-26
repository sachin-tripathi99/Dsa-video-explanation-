import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [3, 2, 2, 4, 1, 6];
const solve = (a: number[]) => { const c = Array(a.length + 1).fill(0); a.forEach((x) => c[x]++); return [c.findIndex((k, i) => i > 0 && k === 2), c.findIndex((k, i) => i > 0 && k === 0)]; };

function video() {
  const v = new Video('set-mismatch', 'Set Mismatch');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'should be 1..n exactly once; one number got copied over another' });
  const [d, m] = solve(A);
  v.say(`The set one to n lost a number: by mistake one value was duplicated and overwrote another. Return the duplicate and the missing number.`);
  v.eq(`duplicate ${d}, missing ${m}`);

  v.chapter('brute', 'Brute force: count occurrences', { cx: 'O(n) · O(n) extra', code: ['count[x] += 1 for every x', 'duplicate: count 2 · missing: count 0'] });
  v.eq('a count array of size n + 1', 'warn').say('Counting each value finds both in linear time, with an extra array.');

  v.chapter('optimal', 'Optimal: cyclic sort, one misfit', { cx: 'O(n) · O(1) extra', code: ['cyclic sort (skip duplicates)', 'the index i with a[i] != i + 1:', '  duplicate = a[i], missing = i + 1'] });
  v.clear();
  const a = v.array('a', [...A], { label: 'after sending every value home' });
  const c = [...A];
  let i = 0;
  while (i < c.length) { const h = c[i] - 1; if (c[i] !== c[h]) [c[i], c[h]] = [c[h], c[i]]; else i++; }
  v.say('Send every value to index value minus one. With exactly one duplicate, exactly one slot ends up wrong.');
  a.setAll(c);
  const k = c.findIndex((x, j) => x !== j + 1);
  c.forEach((x, j) => a.tone(j, j === k ? 'bad' : 'ok'));
  a.ptr('misfit', k);
  v.line(1, 2).eq(`index ${k} holds ${c[k]} instead of ${k + 1} → [${c[k]}, ${k + 1}]`, 'ok').say(`Index ${words(k)} should hold ${words(k + 1)} but holds ${words(c[k])}. So ${words(c[k])} is the duplicate and ${words(k + 1)} is missing.`);
  a.noPtr();
  v.answer([c[k], k + 1]);

  recap(v, [{ name: 'Count occurrences', time: 'O(n)', space: 'O(n)' }, { name: 'Cyclic sort', time: 'O(n)', space: 'O(1)' }], 'One misfit reveals both answers.', ['1..n with one error → cyclic sort or sign marking'], 'The misplaced value is the duplicate, and the slot it sits in names the missing number.');
  return v.build();
}

const problem: Problem = {
  slug: 'set-mismatch',
  statement: 'You have a set of integers `s` originally containing all numbers from `1` to `n`. Due to an error, one number was duplicated to another number, resulting in one repetition and one loss. Given `nums` (the set after the error), return `[duplicate, missing]`.',
  examples: [{ input: 'nums = [1,2,2,4]', output: '[2,3]' }, { input: 'nums = [1,1]', output: '[1,2]' }],
  constraints: ['2 ≤ n ≤ 10⁴', '1 ≤ nums[i] ≤ n'],
  hints: ['After putting values home, which slot is wrong?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Count occurrences', idea: 'count[x]; the value with 2 is duplicated, the one with 0 is missing.', time: 'O(n)', space: 'O(n)', bottleneck: 'Extra array.' },
    { id: 'optimal', kind: 'optimal', name: 'Cyclic sort', idea: 'Put values home; the single misfit index i gives [a[i], i + 1].', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'The one misfit gives **both** the duplicate and the missing number.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'findErrorNums', params: ['int[]'], ret: 'int[]',
    tests: [{ args: [[1, 2, 2, 4]], out: [2, 3] }, { args: [[1, 1]], out: [1, 2] }, { args: [[2, 2]], out: [2, 1] }],
    gen: (r: Rng) => { const n = r.int(2, 10); const a = Array.from({ length: n }, (_, i) => i + 1); const lose = r.int(0, n - 1); let dup = r.int(0, n - 1); while (dup === lose) dup = r.int(0, n - 1); a[lose] = a[dup]; return [r.shuffle(a)]; },
    ref: (a: number[]) => solve(a),
  },
};

export default problem;
