import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [3, 4, -1, 1, 9, 2];
const fmp = (a: number[]) => { const s = new Set(a); let x = 1; while (s.has(x)) x++; return x; };

function video() {
  const v = new Video('first-missing-positive', 'First Missing Positive');
  const n = A.length;
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'unsorted, any integers' });
  v.say('Return the smallest positive integer that is not in the array, in linear time and constant extra space.');
  v.eq(`answer: ${fmp(A)}`);

  v.chapter('brute', 'Brute force: sort, or a hash set', { cx: 'O(n log n) or O(n) space', code: ['s = set(a); x = 1', 'while x in s: x += 1', 'return x'] });
  v.eq('a set is O(n) memory; sorting is O(n log n)', 'warn').say('A hash set and counting up from one is easy, but uses linear memory. Sorting avoids the memory but costs n log n.');

  v.chapter('insight', 'Key insight: the answer is in 1..n + 1');
  v.clear();
  v.text('t', { title: `n = ${n}`, lines: [`The answer is at most n + 1 = ${n + 1}: n slots can hold at most 1..n`, `So values ≤ 0 or > n (here −1 and 9) can never matter`, 'The remaining values fit the cyclic-sort pattern'], shown: 3 });
  v.say(`With n numbers, the best case is that they are exactly one to n, and then the answer is n plus one. So the answer always lies between one and n plus one. Any value that is zero, negative, or bigger than n is irrelevant, and everything else can be sent home.`);

  v.chapter('optimal', 'Optimal: cyclic sort ignoring out-of-range values', { cx: 'O(n) · O(1)', code: ['while i < n:', '  home = a[i] − 1', '  if 0 <= home < n and a[i] != a[home]: swap', '  else: i += 1', 'return first i + 1 with a[i] != i + 1, else n + 1'] });
  v.clear();
  const a = v.array('a', [...A], { label: 'values 1..n go home; others stay as junk' });
  const c = [...A];
  let i = 0;
  let told = 0;
  while (i < n) {
    const h = c[i] - 1;
    a.clearTones().ptr('i', i);
    for (let k = 0; k < n; k++) if (c[k] === k + 1) a.tone(k, 'ok');
    if (h >= 0 && h < n && c[i] !== c[h]) {
      a.tone(i, 'active').tone(h, 'cmp');
      v.line(2).eq(`${c[i]} → index ${h}`);
      if (told === 0) { v.say('Three goes to index two, and minus one comes back.'); told++; }
      else v.hold(450);
      [c[i], c[h]] = [c[h], c[i]];
      a.swap(i, h);
    } else {
      if (h < 0 || h >= n) {
        a.tone(i, 'dim');
        v.line(3).eq(`${c[i]} is outside 1..${n} → ignore`, 'warn');
        if (told === 1) { v.say(`${c[i] < 0 ? `Minus ${words(-c[i])}` : words(c[i])} is outside one to ${words(n)}, so it has no home. Leave it and move on.`); told++; }
        else v.hold(450);
      } else v.line(3).hold(250);
      i++;
    }
  }
  a.noPtr().clearTones();
  const k = c.findIndex((x, j) => x !== j + 1);
  c.forEach((x, j) => a.tone(j, x === j + 1 ? 'ok' : 'bad'));
  const ans = k < 0 ? n + 1 : k + 1;
  v.line(4).eq(`first misfit at index ${k} → answer ${ans}`, 'ok').say(`Scan for the first index not holding its own number: index ${words(k)} wants ${words(k + 1)}. So ${words(ans)} is the first missing positive.`);
  v.answer(fmp(A));

  recap(v, [{ name: 'Hash set', time: 'O(n)', space: 'O(n)' }, { name: 'Sort', time: 'O(n log n)', space: 'O(1)' }, { name: 'Cyclic sort', time: 'O(n)', space: 'O(1)' }], 'Only 1..n matter; place them home, then scan.', ['Smallest missing positive → answer in 1..n + 1 → cyclic sort'], 'Bounding the answer first is what makes the index-as-hash trick possible.');
  return v.build();
}

const problem: Problem = {
  slug: 'first-missing-positive',
  statement: 'Given an unsorted integer array `nums`, return the smallest positive integer that is not present in `nums`. You must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space.',
  examples: [{ input: 'nums = [1,2,0]', output: '3' }, { input: 'nums = [3,4,-1,1]', output: '2' }, { input: 'nums = [7,8,9,11,12]', output: '1' }],
  constraints: ['1 ≤ n ≤ 10⁵', '−2³¹ ≤ nums[i] ≤ 2³¹ − 1'],
  hints: ['The answer is between 1 and n + 1.', 'Ignore values outside [1, n] and cyclic-sort the rest.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Hash set', idea: 'Put values in a set; count up from 1.', time: 'O(n)', space: 'O(n)', bottleneck: 'Extra memory.' },
    { id: 'better', kind: 'better', name: 'Sort', idea: 'Sort, then walk looking for the first gap among positives.', time: 'O(n log n)', space: 'O(1)' },
    { id: 'optimal', kind: 'optimal', name: 'Cyclic sort', idea: 'Place each value in [1, n] at index value − 1; the first index i with a[i] ≠ i + 1 gives i + 1, else n + 1.', time: 'O(n)', space: 'O(1)' },
  ],
  pitfalls: ['`nums[i] - 1` overflows for Integer.MIN_VALUE in Java/C++ only if you compute it before range-checking with care; check `nums[i] >= 1 && nums[i] <= n` first.'],
  takeaway: 'Bound the answer to **1..n+1**, then use cyclic sort.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'firstMissingPositive', params: ['int[]'], ret: 'int',
    tests: [{ args: [[1, 2, 0]], out: 3 }, { args: [[3, 4, -1, 1]], out: 2 }, { args: [[7, 8, 9, 11, 12]], out: 1 }, { args: [[-2147483648, 1]], out: 2 }, { args: [[1, 1]], out: 2 }],
    gen: (r: Rng) => [r.ints(r.int(1, 10), -3, 10)],
    ref: (a: number[]) => fmp(a),
  },
};

export default problem;
