import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const A = [0, 1, 2, 2, 3, 0, 4, 2];
const VAL = 2;

function video() {
  const v = new Video('remove-element', 'Remove Element');
  v.chapter('intro', 'The problem');
  const a = v.array('nums', A, { label: `nums, remove every ${VAL}` });
  A.forEach((x, i) => x === VAL && a.tone(i, 'bad'));
  v.say('Remove every occurrence of val from the array, in place. Return k, the number of elements left, and make sure the first k slots hold them. What is after slot k does not matter.');

  v.chapter('brute', 'Brute force: copy to a new array', { cx: 'O(n)', code: ['keep = [x for x in nums if x != val]', 'copy keep into the front of nums', 'return len(keep)'] });
  v.clear();
  const b = v.array('nums', A, { label: 'nums' });
  const keep = v.array('keep', [], { label: 'keep (extra array)' });
  A.forEach((x, i) => {
    b.clearTones().ptr('i', i).tone(i, x === VAL ? 'bad' : 'active');
    if (x !== VAL) keep.push(x).clearTones().tone(keep.length - 1, 'ok');
    v.line(0).hold(380);
  });
  b.noPtr().clearTones();
  v.eq('O(n) time, but O(n) extra space', 'warn').say('Collecting the survivors into a new array works in one pass, but it uses extra memory, and the problem asks for in place.');

  v.chapter('optimal', 'Optimal: a write pointer', { cx: 'O(n)', code: ['k = 0', 'for x in nums:', '  if x != val:', '    nums[k] = x; k += 1', 'return k'] });
  v.clear();
  const c = v.array('nums', A, { label: 'nums: read with i, write with k' });
  const arr = [...A];
  let k = 0;
  c.ptrs({ k: 0, i: 0 });
  v.line(0).say('Use two indices. i reads every element. k marks where the next survivor should be written. Everything before k is already the answer.');
  for (let i = 0; i < arr.length; i++) {
    c.clearTones().toneRange(0, k - 1, 'ok').ptrs({ k, i }).tone(i, arr[i] === VAL ? 'bad' : 'cmp');
    if (arr[i] !== VAL) {
      arr[k] = arr[i];
      c.set(k, arr[i]).tone(k, 'ok');
      k++;
      c.ptr('k', k);
      v.line(3).eq(`${arr[i]} ≠ ${VAL} → write at k, k = ${k}`);
    } else v.line(2).eq(`${arr[i]} = ${VAL} → skip`, 'bad');
    if (i === 0) v.say('Zero is not two: write it at k and move k forward.');
    else if (i === 2) v.say('Two is the value to remove, so skip it. k stays put, and the next survivor will overwrite that slot.');
    else v.hold(550);
  }
  c.clearTones().toneRange(0, k - 1, 'ok').noPtr().win(0, k - 1, 'ok', `k = ${k}`);
  v.line(4).eq(`k = ${k}: first ${k} slots = [${arr.slice(0, k).join(', ')}]`, 'ok').say(`One pass, no extra array. k is ${k}, and the first ${k} slots hold the survivors.`);
  v.answer(arr.slice(0, k));

  recap(v, [{ name: 'Copy survivors to a new array', time: 'O(n)', space: 'O(n)' }, { name: 'Read pointer + write pointer', time: 'O(n)', space: 'O(1)' }], 'Same time; the write pointer removes the extra array.', ['Filter in place: read with i, write with k', 'Everything before k is finished'], 'The read and write pointer trick filters an array in place. You will see it again in two pointers.');
  return v.build();
}

const problem: Problem = {
  slug: 'remove-element',
  statement: 'Given an array `nums` and a value `val`, remove all occurrences of `val` **in place**. Return `k`, the number of remaining elements; the first `k` elements of `nums` must be the remaining values (any order is accepted by LeetCode; our checker expects the original order).',
  examples: [
    { input: 'nums = [3,2,2,3], val = 3', output: '2, nums = [2,2,_,_]' },
    { input: 'nums = [0,1,2,2,3,0,4,2], val = 2', output: '5, nums = [0,1,3,0,4,_,_,_]' },
  ],
  constraints: ['0 ≤ nums.length ≤ 100', '0 ≤ nums[i], val ≤ 100'],
  hints: ['You don’t need to delete anything: just overwrite.', 'Keep a pointer to where the next kept element should go.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Copy survivors to a new array', idea: 'Collect every element ≠ val in a new list, copy it back to the front of nums.', time: 'O(n)', space: 'O(n)', bottleneck: 'Uses an extra array; the problem asks for in place.' },
    { id: 'optimal', kind: 'optimal', name: 'Write pointer', idea: 'Scan with `i`; whenever `nums[i] != val`, copy it to `nums[k]` and increment `k`.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'To filter an array **in place**, read with one index and write with another.',
  video,
  videoArgs: [A, VAL],
  judge: {
    type: 'fn', fn: 'removeElement', params: ['int[]', 'int'], ret: 'int', returnK: 0,
    tests: [{ args: [[3, 2, 2, 3], 3], out: [2, 2] }, { args: [[0, 1, 2, 2, 3, 0, 4, 2], 2], out: [0, 1, 3, 0, 4] }, { args: [[], 1], out: [] }, { args: [[1, 1, 1], 1], out: [] }],
    gen: (r) => [r.ints(r.int(0, 20), 0, 5), r.int(0, 5)],
    ref: (a: number[], val: number) => a.filter((x) => x !== val),
  },
};

export default problem;
