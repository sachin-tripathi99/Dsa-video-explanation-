import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const A = [2, 0, 2, 1, 1, 0];

function video() {
  const v = new Video('sort-colors', 'Sort Colors');
  v.chapter('intro', 'The problem');
  const a0 = v.array('a', A, { label: '0 = red, 1 = white, 2 = blue' });
  A.forEach((x, i) => a0.tone(i, x === 0 ? 'bad' : x === 2 ? 'active' : 'none'));
  v.say('The array holds only zeros, ones and twos, standing for red, white and blue. Sort it in place, without a library sort.');

  v.chapter('brute', 'Brute force: a general sort', { cx: 'O(n log n)', code: ['sort(a)'] });
  v.eq('general sort ignores that there are only 3 values', 'warn').say('Any sort works, in n log n, but it ignores the huge hint: there are only three distinct values.');

  v.chapter('better', 'Better: count, then overwrite', { cx: 'O(n), two passes', code: ['count zeros, ones, twos', 'write that many 0s, then 1s, then 2s'] });
  v.clear();
  const c = [0, 0, 0];
  A.forEach((x) => c[x]++);
  v.table('cnt', ['value', 'count'], c.map((k, i) => [String(i), String(k)]));
  v.eq(`counts ${c.join(', ')} → write ${c[0]} zeros, ${c[1]} ones, ${c[2]} twos`, 'ok').say('Counting sort: count each value in one pass, then overwrite the array in a second pass. Linear time. Can we do it in a single pass?');

  v.chapter('optimal', 'Optimal: one pass with three pointers', { cx: 'O(n), one pass · O(1)', code: ['lo, mid, hi = 0, 0, n − 1', 'while mid <= hi:', '  if a[mid] == 0: swap(a[lo], a[mid]); lo += 1; mid += 1', '  elif a[mid] == 1: mid += 1', '  else: swap(a[mid], a[hi]); hi −= 1   # do not advance mid'] });
  v.clear();
  const a = v.array('a', [...A], { label: '[0, lo) = 0s · [lo, mid) = 1s · (hi, end] = 2s' });
  const cur = [...A];
  let lo = 0;
  let mid = 0;
  let hi = A.length - 1;
  v.say('Dijkstra’s Dutch national flag idea keeps three regions: zeros before lo, ones between lo and mid, twos after hi. Everything from mid to hi is still unknown. Look at a of mid and grow the right region.');
  const paint = () => {
    a.clearTones().ptrs({ lo, mid, hi });
    for (let k = 0; k < lo; k++) a.tone(k, 'bad');
    for (let k = hi + 1; k < A.length; k++) a.tone(k, 'active');
    for (let k = lo; k < mid; k++) a.tone(k, 'done');
  };
  let step = 0;
  while (mid <= hi) {
    paint();
    const x = cur[mid];
    if (x === 0) {
      [cur[lo], cur[mid]] = [cur[mid], cur[lo]];
      a.swap(lo, mid);
      v.line(2).eq(`a[mid] = 0 → swap into the zeros region`);
      lo++;
      mid++;
    } else if (x === 1) {
      v.line(3).eq('a[mid] = 1 → already in the ones region, mid += 1');
      mid++;
    } else {
      [cur[mid], cur[hi]] = [cur[hi], cur[mid]];
      a.swap(mid, hi);
      v.line(4).eq('a[mid] = 2 → swap to the back; the new a[mid] is unknown, so mid stays');
      hi--;
    }
    if (step === 0) v.say('The first value is a two. Swap it to the back and shrink hi. We do not move mid, because the value that just arrived has not been checked yet.');
    else if (step === 1) v.say('Now a zero arrived at mid. Swap it into the zeros region, and move both lo and mid.');
    else v.hold(650);
    step++;
  }
  paint();
  a.noPtr();
  v.eq(`[${cur.join(', ')}] in a single pass`, 'ok').say('When mid passes hi, there is nothing unknown left. Every element was examined once.');
  v.answer(cur);

  recap(v, [
    { name: 'General sort', time: 'O(n log n)', space: 'O(1)–O(n)' },
    { name: 'Counting, two passes', time: 'O(n)', space: 'O(1)' },
    { name: 'Dutch national flag', time: 'O(n), one pass', space: 'O(1)' },
  ], 'Three regions grown by three pointers.', ['Partition into 3 groups in place → lo / mid / hi', 'After swapping from hi, re-check mid'], 'Three-way partitioning uses three pointers. It is also the heart of quicksort with many duplicates.');
  return v.build();
}

const problem: Problem = {
  slug: 'sort-colors',
  statement: 'Given an array `nums` with `n` objects coloured red, white or blue (the integers `0`, `1`, `2`), sort them **in place** so that objects of the same colour are adjacent, in the order red, white, blue. Do not use the library sort.',
  examples: [{ input: 'nums = [2,0,2,1,1,0]', output: '[0,0,1,1,2,2]' }, { input: 'nums = [2,0,1]', output: '[0,1,2]' }],
  constraints: ['1 ≤ n ≤ 300', 'nums[i] is 0, 1 or 2'],
  hints: ['Counting works in two passes. Can you do one?', 'Keep three regions: 0s, 1s, 2s, and an unknown middle.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'General sort', idea: 'Any comparison sort.', time: 'O(n log n)', space: 'O(1)–O(n)', bottleneck: 'Ignores that only three values exist.' },
    { id: 'better', kind: 'better', name: 'Counting sort', idea: 'Count 0s, 1s, 2s, then overwrite the array.', time: 'O(n), two passes', space: 'O(1)' },
    { id: 'optimal', kind: 'optimal', name: 'Dutch national flag', idea: 'lo, mid, hi pointers: 0 → swap with lo, advance lo and mid; 1 → advance mid; 2 → swap with hi, shrink hi.', time: 'O(n), one pass', space: 'O(1)' },
  ],
  pitfalls: ['After swapping a[mid] with a[hi], do **not** advance mid: the incoming value is unexamined.'],
  takeaway: 'Three-way partition: **lo / mid / hi** regions in one pass.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'sortColors', params: ['int[]'], ret: 'void', inplace: 0,
    tests: [{ args: [[2, 0, 2, 1, 1, 0]], out: [0, 0, 1, 1, 2, 2] }, { args: [[2, 0, 1]], out: [0, 1, 2] }, { args: [[1]], out: [1] }],
    gen: (r: Rng) => [r.ints(r.int(1, 12), 0, 2)],
    ref: (a: number[]) => [...a].sort((x, y) => x - y),
  },
};

export default problem;
