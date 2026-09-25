import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const N1 = [1, 2, 3, 0, 0, 0];
const N2 = [2, 5, 6];

function video() {
  const v = new Video('merge-sorted-array', 'Merge Sorted Array');
  v.chapter('intro', 'The problem');
  const a = v.array('nums1', N1, { label: 'nums1 (m = 3 real values + 3 empty slots)' });
  const b = v.array('nums2', N2, { label: 'nums2 (n = 3)' });
  a.toneRange(3, 5, 'dim');
  v.say('Two sorted arrays. nums1 has room at the end for everything in nums2. Merge nums2 into nums1 in place, so nums1 ends up sorted.');

  v.chapter('brute', 'Brute force: copy, then sort', { cx: 'O((m+n) log(m+n))', code: ['copy nums2 into nums1[m..]', 'sort(nums1)'] });
  const a1 = [...N1];
  for (let i = 0; i < 3; i++) {
    a1[3 + i] = N2[i];
    a.set(3 + i, N2[i]).tone(3 + i, 'warn');
  }
  b.clearTones();
  v.line(0).say('The lazy way: drop nums2 into the empty slots and sort the whole thing.');
  const sorted = [...a1].sort((x, y) => x - y);
  a.setAll(sorted).clearTones().toneRange(0, 5, 'sorted');
  v.line(1).eq('works, but sorting ignores that both halves were already sorted', 'bad');
  v.say('Correct, but sorting costs m plus n times log, and it throws away the fact that both arrays were already sorted.');

  v.chapter('better', 'Better: merge into a new array', { cx: 'O(m+n)', code: ['i, j = 0, 0; out = []', 'while i < m and j < n:', '  append the smaller of nums1[i], nums2[j]', 'append the leftovers; copy out into nums1'] });
  v.clear();
  v.text('m', { title: 'The merge step from merge sort', lines: ['Two pointers at the fronts; take the smaller each time', 'O(m + n) time', 'But it needs an O(m + n) temporary array, and the problem wants it in place'] });
  v.say('Better: the merge step from merge sort. Two pointers at the fronts, always take the smaller. That is linear, but it builds a separate output array. Can we merge directly into nums1?');

  v.chapter('optimal', 'Optimal: merge from the back', { cx: 'O(m+n)', code: ['i, j, k = m−1, n−1, m+n−1', 'while j >= 0:', '  if i >= 0 and nums1[i] > nums2[j]:', '    nums1[k] = nums1[i]; i -= 1', '  else: nums1[k] = nums2[j]; j -= 1', '  k -= 1'] });
  v.clear();
  const x = v.array('nums1', N1, { label: 'nums1' });
  const y = v.array('nums2', N2, { label: 'nums2' });
  const arr = [...N1];
  let i = 2;
  let j = 2;
  let k = 5;
  x.toneRange(3, 5, 'dim').ptrs({ i, k });
  y.ptr('j', j);
  v.line(0).say('The trick: fill nums1 from the back. The empty slots are at the end, so writing the largest values there never overwrites anything we still need.');
  let first = true;
  while (j >= 0) {
    const takeI = i >= 0 && arr[i] > N2[j];
    x.clearTones();
    for (let q = k + 1; q < 6; q++) x.tone(q, 'sorted');
    if (i >= 0) x.tone(i, 'cmp');
    y.clearTones().tone(j, 'cmp');
    v.line(2).eq(`${i >= 0 ? arr[i] : '—'} vs ${N2[j]} → write ${takeI ? arr[i] : N2[j]} at k=${k}`);
    if (takeI) {
      arr[k] = arr[i];
      x.set(k, arr[i]);
      i--;
    } else {
      arr[k] = N2[j];
      x.set(k, N2[j]);
      j--;
    }
    x.tone(k, 'ok');
    k--;
    x.ptrs({ i: i >= 0 ? i : null, k: k >= 0 ? k : null });
    y.ptr('j', j >= 0 ? j : null);
    if (first) v.say('Compare the last real values: three and six. Six is bigger, so it goes into the very last slot.');
    else v.hold(800);
    first = false;
  }
  x.clearTones().toneRange(0, 5, 'sorted').noPtr();
  y.noPtr();
  v.eq(`nums1 = [${arr.join(', ')}]`, 'ok').note('stop when nums2 is used up');
  v.say('Once nums2 is empty we can stop: whatever is left in nums1 is already in place. One pass, no extra array.');
  v.answer(arr);

  recap(v, [{ name: 'Copy + sort', time: 'O((m+n) log(m+n))', space: 'O(1)*' }, { name: 'Merge into new array', time: 'O(m+n)', space: 'O(m+n)' }, { name: 'Merge from the back', time: 'O(m+n)', space: 'O(1)' }], 'Merging beats re-sorting, and merging from the back needs no extra memory.', ['Two sorted inputs → merge with two pointers', 'Free space at the end → fill from the back'], 'When the free space is at the end, fill from the end. It avoids overwriting data you still need.');
  return v.build();
}

const problem: Problem = {
  slug: 'merge-sorted-array',
  statement: 'You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and integers `m` and `n`: the number of real elements in each. `nums1` has length `m + n`; its last `n` slots are `0` placeholders. Merge `nums2` into `nums1` **in place** so that `nums1` is sorted. Return nothing.',
  examples: [
    { input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', output: '[1,2,2,3,5,6]' },
    { input: 'nums1 = [1], m = 1, nums2 = [], n = 0', output: '[1]' },
    { input: 'nums1 = [0], m = 0, nums2 = [1], n = 1', output: '[1]' },
  ],
  constraints: ['nums1.length == m + n', '0 ≤ m, n ≤ 200', '-10⁹ ≤ values ≤ 10⁹'],
  hints: ['Both inputs are sorted. How does the merge step of merge sort work?', 'Merging from the front would overwrite values in nums1. Where is the free space?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Copy then sort', idea: 'Put nums2 into the last n slots and sort nums1.', time: 'O((m+n) log(m+n))', space: 'O(1) (sort-dependent)', bottleneck: 'Ignores that both parts are already sorted.' },
    { id: 'better', kind: 'better', name: 'Merge into a temporary array', idea: 'Two pointers at the fronts, take the smaller each time into a new array, then copy back.', time: 'O(m+n)', space: 'O(m+n)', bottleneck: 'Needs a temporary array.' },
    {
      id: 'optimal', kind: 'optimal', name: 'Three pointers from the back',
      idea: 'Start `i` at the last real value of nums1, `j` at the end of nums2, `k` at the last slot. Write the larger of `nums1[i]` and `nums2[j]` into `nums1[k]` and move left. Stop when nums2 is used up.',
      time: 'O(m+n)', space: 'O(1)',
    },
  ],
  pitfalls: ['Looping while `i >= 0` instead of `j >= 0`: leftover nums2 values would never be copied.', 'Merging from the front overwrites unread values of nums1.'],
  takeaway: 'Merge two sorted sequences with two pointers. If the free space is at the end, **merge from the back**.',
  video,
  videoArgs: [N1, 3, N2, 3],
  judge: {
    type: 'fn', fn: 'merge', params: ['int[]', 'int', 'int[]', 'int'], ret: 'void', inplace: 0,
    tests: [
      { args: [[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3], out: [1, 2, 2, 3, 5, 6] },
      { args: [[1], 1, [], 0], out: [1] },
      { args: [[0], 0, [1], 1], out: [1] },
      { args: [[4, 5, 6, 0, 0, 0], 3, [1, 2, 3], 3], out: [1, 2, 3, 4, 5, 6] },
    ],
    gen: (r) => {
      const m = r.int(0, 8);
      const n = r.int(0, 8);
      const a = r.ints(m, -20, 20).sort((p, q) => p - q);
      const b = r.ints(n, -20, 20).sort((p, q) => p - q);
      return [[...a, ...Array(n).fill(0)], m, b, n];
    },
    ref: (a: number[], m: number, b: number[], n: number) => [...a.slice(0, m), ...b.slice(0, n)].sort((p, q) => p - q),
  },
};

export default problem;
