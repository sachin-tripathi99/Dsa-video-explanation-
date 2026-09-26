import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const A = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];

function video() {
  const v = new Video('remove-duplicates', 'Remove Duplicates from Sorted Array');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'sorted' });
  v.say('The array is sorted. Remove the duplicates in place so each value appears once, keep the order, and return how many values are left. Only the first k slots matter afterwards.');

  v.chapter('brute', 'Brute force: collect distinct values in a new list', { cx: 'O(n) space', code: ['seen = ordered set / new list', 'for x in a: if x != last kept: keep.append(x)', 'copy keep back into a; return len(keep)'] });
  v.clear();
  const src = v.array('a', A, { label: 'a' });
  const keep = v.array('keep', [], { label: 'distinct values (extra array)' });
  let last: number | null = null;
  A.forEach((x, i) => {
    src.clearTones().tone(i, x !== last ? 'active' : 'dim');
    if (x !== last) keep.push(x);
    last = x;
    v.line(1).hold(330);
  });
  src.clearTones();
  v.eq('extra array of up to n values', 'warn').say('Collect each new value into a separate list, then copy it back. Easy, but it needs extra memory, and the problem asks for in place.');

  v.chapter('optimal', 'Optimal: read and write pointers', { cx: 'O(n) time · O(1) space', code: ['w = 1', 'for r in 1..n−1:', '  if a[r] != a[w − 1]:', '    a[w] = a[r]; w += 1', 'return w'] });
  v.clear();
  const a = v.array('a', [...A], { label: 'a' });
  const cur = [...A];
  let w = 1;
  a.tone(0, 'ok');
  v.line(0).say('The first element is always kept, so the writer w starts at one. The reader r visits every element; because the array is sorted, a value is new exactly when it differs from the last kept value, a of w minus one.');
  for (let r = 1; r < A.length; r++) {
    a.ptrs({ w, r });
    const isNew = cur[r] !== cur[w - 1];
    if (isNew) {
      cur[w] = cur[r];
      a.set(w, cur[r]).tone(w, 'ok');
      v.line(3).eq(`a[${r}] = ${cur[r]} ≠ a[${w - 1}] → write at ${w}`, 'ok');
      w++;
    } else v.line(2).eq(`a[${r}] = ${cur[r]} = a[${w - 1}] → skip`);
    if (r === 1) v.say('Zero equals the last kept zero. Skip it.');
    else if (r === 2) v.say('One is new. Write it at position one and move w forward.');
    else v.hold(520);
  }
  for (let k = w; k < A.length; k++) a.tone(k, 'out');
  a.noPtr();
  v.line(4).eq(`k = ${w}: [${cur.slice(0, w).join(', ')}]`, 'ok').say(`Return ${w}. The first five slots hold zero through four. Whatever is left after them does not matter.`);
  v.answer(cur.slice(0, w));

  recap(v, [{ name: 'Copy distinct values out', time: 'O(n)', space: 'O(n)' }, { name: 'Read / write pointers', time: 'O(n)', space: 'O(1)' }], 'A writer keeps the answer compact while a reader scans.', ['“In place” filtering → read + write pointers', 'Sorted → duplicates are adjacent'], 'Read and write pointers filter an array in place in one pass.');
  return v.build();
}

const problem: Problem = {
  slug: 'remove-duplicates-from-sorted-array',
  statement: 'Given an integer array `nums` sorted in non-decreasing order, remove the duplicates **in place** so each unique element appears only once, keeping the relative order. Return `k`, the number of unique elements; the first `k` elements of `nums` must hold them.',
  examples: [{ input: 'nums = [1,1,2]', output: '2, nums = [1,2,_]' }, { input: 'nums = [0,0,1,1,1,2,2,3,3,4]', output: '5, nums = [0,1,2,3,4,_,_,_,_,_]' }],
  constraints: ['1 ≤ nums.length ≤ 3 · 10⁴', '−100 ≤ nums[i] ≤ 100', 'sorted'],
  hints: ['Duplicates are next to each other because the array is sorted.', 'Keep a write index for the next unique value.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Copy distinct values out', idea: 'Collect each value that differs from the previous one into a new list; copy it back.', time: 'O(n)', space: 'O(n)', bottleneck: 'Extra array.' },
    { id: 'optimal', kind: 'optimal', name: 'Read / write pointers', idea: 'w = 1; for each r, if nums[r] differs from nums[w − 1], write it at w and advance w.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'In-place filtering = **reader + writer**; the writer marks the end of the answer.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'removeDuplicates', params: ['int[]'], ret: 'int', returnK: 0,
    tests: [{ args: [[1, 1, 2]], out: [1, 2] }, { args: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], out: [0, 1, 2, 3, 4] }, { args: [[7]], out: [7] }],
    gen: (r: Rng) => [r.ints(r.int(1, 12), -3, 3).sort((a, b) => a - b)],
    ref: (a: number[]) => [...new Set(a)],
  },
};

export default problem;
