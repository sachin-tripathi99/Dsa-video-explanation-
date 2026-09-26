import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [3, 8, 4, 1, 2];
function ngc(a: number[]) { const n = a.length; const ans = a.map(() => -1); const st: number[] = []; for (let i = 0; i < 2 * n; i++) { const x = a[i % n]; while (st.length && a[st[st.length - 1]] < x) ans[st.pop()!] = x; if (i < n) st.push(i); } return ans; }

function video() {
  const v = new Video('next-greater-element-ii', 'Next Greater Element II');
  const n = A.length;
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'circular: after the last element comes the first' });
  v.say('The array is circular. For every element, find the next greater number when walking right and wrapping around to the start, or minus one if none exists.');
  v.eq(`answer: [${ngc(A).join(', ')}]`);

  v.chapter('brute', 'Brute force: walk up to n − 1 steps from each index', { cx: 'O(n²)', code: ['for i: for k in 1..n−1: j = (i + k) % n; if a[j] > a[i]: ans[i] = a[j]; break'] });
  v.eq('n walks of up to n steps', 'warn');

  v.chapter('optimal', 'Optimal: monotonic stack over two laps', { cx: 'O(n)', code: ['for i in 0..2n−1:', '  x = a[i % n]', '  while stack and a[stack.top] < x: ans[stack.pop()] = x', '  if i < n: push i        # only the first lap pushes'] });
  v.clear();
  const a = v.array('a', [...A, ...A], { label: 'two laps (second lap only answers, never waits)' });
  a.toneRange(n, 2 * n - 1, 'dim');
  const out = v.array('ans', A.map(() => -1), { label: 'answer' });
  const st = v.stack('st', [], { label: 'waiting indices' });
  const stack: number[] = [];
  let told = 0;
  v.say('Run the usual next greater loop, but go around the array twice, using i mod n. In the second lap, elements near the end of the array can finally see the elements at the start. Only the first lap pushes, since every index needs to wait only once.');
  for (let i = 0; i < 2 * n; i++) {
    const x = A[i % n];
    a.clearTones().toneRange(n, 2 * n - 1, 'dim').tone(i, 'active');
    while (stack.length && A[stack[stack.length - 1]] < x) {
      const j = stack.pop()!;
      st.pop();
      out.set(j, x).tone(j, 'ok');
      v.line(2).eq(`${A[j]} < ${x} → ans[${j}] = ${x}${i >= n ? ' (found after wrapping)' : ''}`, 'ok');
      if (i >= n && told === 0) { v.say(`In the second lap, ${words(x)} at the start answers ${words(A[j])}, which was waiting near the end. That is the circular part.`); told++; } else v.hold(500);
    }
    if (i < n) { stack.push(i); st.push(`${i}:${x}`); }
    v.line(3).hold(300);
  }
  a.clearTones();
  v.eq(`[${ngc(A).join(', ')}]`, 'ok').say(`${words(Math.max(...A))}, the maximum, never finds anything larger, so it stays minus one.`);
  v.answer(ngc(A));

  recap(v, [{ name: 'Walk from each index', time: 'O(n²)', space: 'O(1)' }, { name: 'Stack over 2n indices', time: 'O(n)', space: 'O(n)' }], 'Circular → iterate 2n times with i % n.', ['Circular next greater → second lap without pushes'], 'Doubling the loop is the standard trick for circular arrays.');
  return v.build();
}

const problem: Problem = {
  slug: 'next-greater-element-ii',
  statement: 'Given a circular integer array `nums` (the next element of `nums[n − 1]` is `nums[0]`), return the next greater number for every element: the first greater number traversing forward (circularly), or `-1` if it does not exist.',
  examples: [{ input: 'nums = [1,2,1]', output: '[2,-1,2]' }, { input: 'nums = [1,2,3,4,3]', output: '[2,3,4,-1,4]' }],
  constraints: ['1 ≤ n ≤ 10⁴'],
  hints: ['Pretend the array is written twice.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Walk from each index', idea: 'For each i, check up to n − 1 following indices modulo n.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Quadratic.' },
    { id: 'optimal', kind: 'optimal', name: 'Stack over two laps', idea: 'For i in 0..2n−1 with x = nums[i % n]: pop smaller and assign; push i only in the first lap.', time: 'O(n)', space: 'O(n)' },
  ],
  takeaway: 'Circular arrays: **loop 2n times, index mod n**.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'nextGreaterElements', params: ['int[]'], ret: 'int[]',
    tests: [{ args: [[1, 2, 1]], out: [2, -1, 2] }, { args: [[1, 2, 3, 4, 3]], out: [2, 3, 4, -1, 4] }, { args: [[5, 5]], out: [-1, -1] }],
    gen: (r: Rng) => [r.ints(r.int(1, 10), 0, 6)],
    ref: (a: number[]) => ngc(a),
  },
};

export default problem;
