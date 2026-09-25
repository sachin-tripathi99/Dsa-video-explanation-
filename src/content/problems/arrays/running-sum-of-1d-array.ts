import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const A = [3, 1, 2, 10, 1];

function video() {
  const v = new Video('running-sum', 'Running Sum of 1d Array');
  v.chapter('intro', 'The problem');
  const a = v.array('nums', A, { label: 'nums' });
  v.say('For each index i, return the sum of everything from the start up to i. That is called the running sum, or prefix sum.');

  v.chapter('brute', 'Brute force: re-add from the start', { cx: 'O(n²)', code: ['for i in 0..n-1:', '  s = 0', '  for j in 0..i: s += a[j]', '  out[i] = s'] });
  const out = v.array('out', Array(A.length).fill(null), { label: 'running sum' });
  let adds = 0;
  for (let i = 0; i < A.length; i++) {
    let s = 0;
    for (let j = 0; j <= i; j++) {
      s += A[j];
      adds++;
    }
    a.clearTones().toneRange(0, i, 'win').win(0, i);
    out.set(i, s).clearTones().tone(i, 'active');
    v.counter(`additions: ${adds}`).line(2);
    if (i === 0) v.say('The direct way: for every index, add up everything from the start again.');
    else if (i === 3) v.say('Notice we keep re-adding the same prefix. For index three we add three, one, two again, even though we just did that.');
    else v.hold(600);
  }
  a.noWin();
  v.eq(`${adds} additions: 1 + 2 + … + n = O(n²)`, 'bad');

  v.chapter('optimal', 'Optimal: carry the total forward', { cx: 'O(n)', code: ['for i in 1..n-1:', '  a[i] += a[i-1]', 'return a'] });
  v.clear();
  const b = v.array('nums', A, { label: 'nums, updated in place' });
  const vals = [...A];
  b.tone(0, 'ok');
  v.say('Better: the running sum at i is just the running sum at i minus one, plus a of i. Carry it forward, and we can even overwrite the input.');
  for (let i = 1; i < vals.length; i++) {
    const before = vals[i];
    vals[i] += vals[i - 1];
    b.set(i, vals[i]).clearTones().toneRange(0, i - 1, 'ok').tone(i, 'active').tone(i - 1, 'cmp');
    v.counter(`additions: ${i}`).line(1).eq(`a[${i}] = ${before} + ${vals[i - 1]} = ${vals[i]}`);
    if (i === 1) v.say('One plus three is four.');
    else v.hold(650);
  }
  b.clearTones().toneRange(0, vals.length - 1, 'ok');
  v.eq(`[${vals.join(', ')}] with n − 1 additions`, 'ok').say('One pass, n minus one additions. This running total is the prefix sum, a tool we will use for a whole module later.');
  v.answer(vals);

  recap(v, [{ name: 'Re-add every prefix', time: 'O(n²)', space: 'O(n)' }, { name: 'Carry the total forward', time: 'O(n)', space: 'O(1) extra' }], 'Recomputing prefixes is quadratic; reusing the previous total is linear.', ['answer[i] depends on answer[i − 1] → reuse it', 'Prefix sums: prefix[i] = prefix[i − 1] + a[i]'], 'Whenever answer i builds on answer i minus one, reuse it instead of starting over.');
  return v.build();
}

const problem: Problem = {
  slug: 'running-sum-of-1d-array',
  statement: 'Given an array `nums`, return its **running sum**: `runningSum[i] = nums[0] + nums[1] + … + nums[i]`.',
  examples: [
    { input: 'nums = [1,2,3,4]', output: '[1,3,6,10]' },
    { input: 'nums = [1,1,1,1,1]', output: '[1,2,3,4,5]' },
    { input: 'nums = [3,1,2,10,1]', output: '[3,4,6,16,17]' },
  ],
  constraints: ['1 ≤ nums.length ≤ 1000', '-10⁶ ≤ nums[i] ≤ 10⁶'],
  hints: ['How does runningSum[i] relate to runningSum[i − 1]?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Re-add each prefix', idea: 'For every i, sum nums[0..i] from scratch.', time: 'O(n²)', space: 'O(n)', bottleneck: 'The same prefix is re-added again and again.' },
    { id: 'optimal', kind: 'optimal', name: 'Carry the total forward', idea: '`nums[i] += nums[i − 1]` for i from 1 to n − 1, in place.', time: 'O(n)', space: 'O(1) extra' },
  ],
  takeaway: 'If answer i builds on answer i − 1, **reuse it**. This is the prefix-sum idea.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'runningSum', params: ['int[]'], ret: 'int[]',
    tests: [{ args: [[1, 2, 3, 4]], out: [1, 3, 6, 10] }, { args: [[1, 1, 1, 1, 1]], out: [1, 2, 3, 4, 5] }, { args: [[3, 1, 2, 10, 1]], out: [3, 4, 6, 16, 17] }],
    gen: (r) => [r.ints(r.int(1, 30), -1000, 1000)],
    ref: (a: number[]) => { let s = 0; return a.map((x) => (s += x)); },
  },
};

export default problem;
