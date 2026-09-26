import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const A = [0, 1, 0, 3, 12];

function video() {
  const v = new Video('move-zeroes', 'Move Zeroes');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'nums' });
  v.say('Move every zero to the end of the array, keeping the non-zero numbers in their original order. Do it in place.');
  v.eq('[0, 1, 0, 3, 12] → [1, 3, 12, 0, 0]');

  v.chapter('brute', 'Brute force: a second array', { cx: 'O(n) space', code: ['tmp = non-zeros of nums, in order', 'pad tmp with zeros', 'copy tmp back into nums'] });
  v.clear();
  const src = v.array('a', A, { label: 'nums' });
  const tmp = v.array('tmp', [], { label: 'tmp (extra memory)' });
  A.forEach((x, i) => {
    src.clearTones().tone(i, x ? 'active' : 'dim');
    if (x) tmp.push(x);
    v.line(0).hold(380);
  });
  A.filter((x) => !x).forEach(() => tmp.push(0));
  src.clearTones();
  v.line(1).eq('correct, but needs n extra slots', 'warn').say('Copy the non-zero numbers into a new array, fill the rest with zeros, and copy back. Correct, but not in place.');

  v.chapter('optimal', 'Optimal: swap non-zeros forward', { cx: 'O(n) · O(1) space', code: ['w = 0', 'for r in 0..n−1:', '  if nums[r] != 0:', '    swap(nums[w], nums[r]); w += 1'] });
  v.clear();
  const a = v.array('a', [...A], { label: 'nums' });
  const cur = [...A];
  let w = 0;
  v.say('Use a writer w for the next place a non-zero belongs, and a reader r that scans. Every time r finds a non-zero, swap it into position w. The zeros get pushed back automatically.');
  for (let r = 0; r < A.length; r++) {
    a.ptrs({ w, r }).clearTones();
    for (let k = 0; k < w; k++) a.tone(k, 'ok');
    if (cur[r] !== 0) {
      [cur[w], cur[r]] = [cur[r], cur[w]];
      a.tone([w, r], 'cmp');
      v.line(3).eq(w === r ? `nums[${r}] = ${cur[w]} is already in place` : `swap nums[${w}] and nums[${r}] → ${cur[w]} moves forward`);
      a.swap(w, r);
      if (r === 1) v.say('At index one we find a one. Swap it with the zero at w. The one moves to the front and the zero moves back.');
      else v.hold(650);
      w++;
    } else {
      a.tone(r, 'dim');
      v.line(2).eq(`nums[${r}] = 0 → skip`);
      if (r === 0) v.say('Index zero is a zero, so the reader moves on while w stays put.');
      else v.hold(550);
    }
  }
  a.noPtr().clearTones();
  for (let k = 0; k < w; k++) a.tone(k, 'ok');
  v.eq(`[${cur.join(', ')}]`, 'ok').say('One pass, a few swaps, and the order of the non-zero numbers never changed.');
  v.answer(cur);

  recap(v, [{ name: 'Second array', time: 'O(n)', space: 'O(n)' }, { name: 'Read / write with swaps', time: 'O(n)', space: 'O(1)' }], 'Swap each kept element to the writer’s position.', ['Stable in-place partition → read / write pointers'], 'Moving elements to one side while keeping order is a read and write pointer job.');
  return v.build();
}

const problem: Problem = {
  slug: 'move-zeroes',
  statement: 'Given an integer array `nums`, move all `0`s to the end while keeping the relative order of the non-zero elements. Do it **in place**.',
  examples: [{ input: 'nums = [0,1,0,3,12]', output: '[1,3,12,0,0]' }, { input: 'nums = [0]', output: '[0]' }],
  constraints: ['1 ≤ nums.length ≤ 10⁴', '−2³¹ ≤ nums[i] ≤ 2³¹ − 1'],
  hints: ['Keep an index for where the next non-zero should go.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Second array', idea: 'Copy non-zeros to a new array, pad with zeros, copy back.', time: 'O(n)', space: 'O(n)', bottleneck: 'Not in place.' },
    { id: 'optimal', kind: 'optimal', name: 'Read / write pointers', idea: 'For each non-zero at r, swap it with nums[w] and advance w.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Stable in-place partition: **writer + reader**, swap kept items forward.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'moveZeroes', params: ['int[]'], ret: 'void', inplace: 0,
    tests: [{ args: [[0, 1, 0, 3, 12]], out: [1, 3, 12, 0, 0] }, { args: [[0]], out: [0] }, { args: [[1, 2]], out: [1, 2] }],
    gen: (r: Rng) => [r.ints(r.int(1, 12), -2, 3).map((x) => (x < 0 ? 0 : x))],
    ref: (a: number[]) => [...a.filter((x) => x !== 0), ...a.filter((x) => x === 0)],
  },
};

export default problem;
