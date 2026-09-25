import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const A = [5, 1, 1, 2, 0, 0];
const BIG = Array.from({ length: 4000 }, (_, i) => ((i * 7919 + 13) % 4001) - 2000);

function video() {
  const v = new Video('sort-an-array', 'Sort an Array');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'nums', bars: true });
  v.say('Sort the array in ascending order without any built-in sort, in O of n log n time and with as little extra space as possible. Up to fifty thousand numbers.');

  v.chapter('brute', 'Brute force: insertion sort', { cx: 'O(n²)', code: ['for i in 1..n-1:', '  insert a[i] into the sorted prefix'] });
  v.clear();
  const ins = v.array('a', A, { label: 'insertion sort', bars: true });
  const ia = [...A];
  for (let i = 1; i < ia.length; i++) {
    const x = ia[i];
    let j = i - 1;
    while (j >= 0 && ia[j] > x) j--;
    ia.splice(i, 1);
    ia.splice(j + 1, 0, x);
    ins.move(i, j + 1).clearTones().toneRange(0, i, 'sorted').tone(j + 1, 'active');
    v.line(1);
    if (i === 1) v.say('Insertion sort is simple: slide each element left into place.');
    else v.hold(550);
  }
  v.eq('fifty thousand numbers → over a billion shifts', 'bad').say('But it is n squared. With fifty thousand values it can do over a billion shifts. We need n log n.');

  v.chapter('better', 'Better: quick sort', { cx: 'O(n log n) avg', code: ['pick a random pivot', 'partition into < pivot, = pivot, > pivot', 'recurse on the < and > parts'] });
  v.clear();
  const q = v.array('a', A, { label: 'three-way partition around pivot 1', bars: true });
  const qa = [...A];
  const pivot = 1;
  let lt = 0;
  let i = 0;
  let gt = qa.length - 1;
  v.say('Quick sort partitions around a pivot. Here the array has many duplicates, so we use a three-way partition: smaller, equal, and bigger. That keeps it fast even when values repeat.');
  while (i <= gt) {
    q.clearTones().ptrs({ lt, i, gt }).tone(i, 'cmp');
    if (qa[i] < pivot) {
      [qa[lt], qa[i]] = [qa[i], qa[lt]];
      q.swap(lt, i);
      lt++;
      i++;
    } else if (qa[i] > pivot) {
      [qa[gt], qa[i]] = [qa[i], qa[gt]];
      q.swap(gt, i);
      gt--;
    } else i++;
    v.hold(600);
  }
  q.clearTones().noPtr().toneRange(0, lt - 1, 'ok').toneRange(lt, gt, 'pivot').toneRange(gt + 1, qa.length - 1, 'warn');
  v.eq('[< 1] [= 1] [> 1] → recurse on the outer parts');
  v.say('Now everything smaller is on the left, the pivots in the middle, and everything bigger on the right. Recurse on the two outer parts. With a random pivot this is n log n on average, but a very unlucky run could still be n squared.');

  v.chapter('optimal', 'Optimal: merge sort', { cx: 'O(n log n)', code: ['sort(lo, hi):', '  if lo >= hi: return', '  sort(lo, mid); sort(mid+1, hi)', '  merge the two sorted halves'] });
  v.clear();
  const t = v.tree('t', { binary: false, label: 'merge sort: split, then merge' });
  const build = (x: number[], parent: string | null): string => {
    const id = t.add(parent, x.join(' '));
    if (x.length > 1) {
      const m = x.length >> 1;
      build(x.slice(0, m), id);
      build(x.slice(m), id);
    }
    return id;
  };
  const root = build(A, null);
  v.line(2).say('Merge sort guarantees n log n: split in half until pieces have one element,');
  const fix = (id: string): number[] => {
    const kids = t.kids(id);
    if (!kids.length) return String(t.val(id)).split(' ').map(Number);
    const s = kids.flatMap(fix).sort((a, b) => a - b);
    t.setVal(id, s.join(' ')).tone(id, 'ok');
    return s;
  };
  const res = fix(root);
  v.line(3).eq(`[${res.join(', ')}]`, 'ok');
  v.say('then merge sorted halves back together. Every level merges n elements and there are log n levels. It needs O of n extra memory for merging, but its worst case is still n log n, which is exactly what this problem asks for.');
  v.answer(res);

  recap(v, [{ name: 'Insertion sort', time: 'O(n²)', space: 'O(1)' }, { name: 'Quick sort (random, 3-way)', time: 'O(n log n) avg', space: 'O(log n)' }, { name: 'Merge sort', time: 'O(n log n)', space: 'O(n)' }], 'Insertion sort is too slow. Quick sort is fast on average. Merge sort guarantees n log n.', ['Guaranteed n log n → merge sort (or heap sort)', 'Many duplicates → three-way partition'], 'Know how to write merge sort from memory; its merge step is a pattern you will reuse.');
  return v.build();
}

const problem: Problem = {
  slug: 'sort-an-array',
  statement: 'Given an array of integers `nums`, sort it in ascending order and return it. Do it **without built-in sort functions** in `O(n log n)` time with the smallest space complexity possible.',
  examples: [
    { input: 'nums = [5,2,3,1]', output: '[1,2,3,5]' },
    { input: 'nums = [5,1,1,2,0,0]', output: '[0,0,1,1,2,5]', why: 'Duplicates are allowed.' },
  ],
  constraints: ['1 ≤ nums.length ≤ 5 · 10⁴', '-5 · 10⁴ ≤ nums[i] ≤ 5 · 10⁴'],
  hints: ['Which comparison sorts are O(n log n) in the worst case?', 'Quick sort with a fixed pivot is attacked by sorted or all-equal inputs. How would you defend?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Insertion sort', idea: 'Grow a sorted prefix; insert each new element by shifting larger ones right.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Quadratic: too slow for 50,000 elements.' },
    { id: 'better', kind: 'better', name: 'Quick sort with random pivot and 3-way partition', idea: 'Partition into `< pivot`, `= pivot`, `> pivot` (Dutch national flag) around a random pivot, then recurse on the outer parts.', time: 'O(n log n) average, O(n²) worst', space: 'O(log n) average', bottleneck: 'No worst-case guarantee.' },
    { id: 'optimal', kind: 'optimal', name: 'Merge sort', idea: 'Split in halves, sort each recursively, merge with two pointers into a temporary buffer.', time: 'O(n log n)', space: 'O(n)' },
  ],
  pitfalls: ['Lomuto quick sort on an array of identical values degrades to O(n²).', 'Allocating a new temp array in every merge call: allocate one buffer up front.'],
  takeaway: 'Merge sort is the safe **O(n log n)** choice; its merge step and quick sort’s partition step are both reusable patterns.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'sortArray', params: ['int[]'], ret: 'int[]',
    tests: [
      { args: [[5, 2, 3, 1]], out: [1, 2, 3, 5] },
      { args: [[5, 1, 1, 2, 0, 0]], out: [0, 0, 1, 1, 2, 5] },
      { args: [[7]], out: [7] },
      { args: [BIG], out: [...BIG].sort((a, b) => a - b), big: true },
      { args: [Array(3000).fill(4)], out: Array(3000).fill(4), big: true },
    ],
    gen: (r) => [r.ints(r.int(1, 40), -50, 50)],
    ref: (a: number[]) => [...a].sort((x, y) => x - y),
  },
};

export default problem;
