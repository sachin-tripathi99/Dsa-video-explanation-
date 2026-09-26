import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [1, 3, -1, -3, 5, 3, 6, 7];
const K = 3;
function swm(a: number[], k: number) { const dq: number[] = [], out: number[] = []; for (let i = 0; i < a.length; i++) { if (dq.length && dq[0] <= i - k) dq.shift(); while (dq.length && a[dq[dq.length - 1]] <= a[i]) dq.pop(); dq.push(i); if (i >= k - 1) out.push(a[dq[0]]); } return out; }
const say = (x: number) => (x < 0 ? `minus ${words(-x)}` : words(x));

function video() {
  const v = new Video('sliding-window-maximum', 'Sliding Window Maximum');
  const n = A.length;
  v.chapter('intro', 'The problem');
  const a0 = v.array('a', A, { label: `nums, k = ${K}` });
  a0.win(0, K - 1, 'win', 'max 3');
  v.say(`A window of size ${words(K)} slides from left to right one step at a time. Return the maximum of every window.`);
  v.eq(`answer: [${swm(A, K).join(', ')}]`);

  v.chapter('brute', 'Brute force: rescan every window', { cx: 'O(n · k)', code: ['for each window start s:', '  out.append(max(nums[s .. s+k−1]))'] });
  v.eq(`${n - K + 1} windows × ${K} elements`, 'warn').say('Take the maximum of each window from scratch. With a window of fifty thousand, that is billions of steps.');

  v.chapter('better', 'Better: max-heap with lazy deletion', { cx: 'O(n log n)', code: ['push (value, index) for each i', 'while heap.top.index ≤ i − k: pop   # expired', 'answer = heap.top.value'] });
  v.clear();
  const b = v.array('a', A, { label: 'nums' });
  b.win(2, 4, 'win').tone(4, 'ok').tone(1, 'dim');
  v.eq('top of heap may be expired → pop it lazily', 'warn').say('A max-heap of value and index gives the maximum quickly. We do not delete old elements right away. Only when an expired element reaches the top do we pop it. That is n log n.');

  v.chapter('optimal', 'Optimal: monotonic deque', { cx: 'O(n)', code: ['if dq.front ≤ i − k: pop front', 'while a[dq.back] ≤ a[i]: pop back', 'push back i', 'if i ≥ k − 1: out.append(a[dq.front])'] });
  v.clear();
  const a = v.array('a', A, { label: 'nums' });
  const out = v.array('out', Array(n - K + 1).fill(null), { label: 'window maximums' });
  const q = v.queue('dq', [], { label: 'deque: index:value (values decreasing)', ends: ['front = max', 'back'] });
  const dq: number[] = [];
  const told = { old: false, back: false, ans: false };
  v.say('Keep a deque of indices whose values decrease from front to back. A new value throws out smaller values from the back, because they are older and smaller and can never win again. The front is the maximum, and it leaves once it slides out of the window.');
  A.forEach((x, i) => {
    a.clearTones().noWin().win(Math.max(0, i - K + 1), i, 'win').tone(i, 'active');
    if (dq.length && dq[0] <= i - K) {
      const j = dq.shift()!;
      q.shift();
      v.line(0).eq(`index ${j} (${A[j]}) left the window → pop front`, 'warn');
      if (!told.old) { v.say(`Now index ${words(j)}, value ${say(A[j])}, is outside the window. It leaves from the front.`); told.old = true; } else v.hold(700);
    }
    let popped = 0;
    while (dq.length && A[dq[dq.length - 1]] <= x) {
      const j = dq.pop()!;
      q.pop();
      a.tone(j, 'bad');
      popped++;
      v.line(1).eq(`${A[j]} ≤ ${x} → pop back`, 'bad');
      if (!told.back) { v.say(`${say(x)} arrives. ${say(A[j])} at the back is smaller and older, so it can never be a window maximum again. Pop it.`); told.back = true; }
      else if (popped === 2 && x === 5) v.say(`Five keeps going: it also pops ${say(A[j])}. Both smaller values are gone for good.`);
      else v.hold(650);
    }
    dq.push(i);
    q.push(`${i}:${x}`);
    v.line(2).eq(`push ${i}:${x}`).hold(450);
    if (i >= K - 1) {
      out.set(i - K + 1, A[dq[0]]).tone(i - K + 1, 'ok');
      a.tone(dq[0], 'ok');
      q.tone(0, 'ok');
      v.line(3).eq(`window [${i - K + 1}..${i}] max = ${A[dq[0]]}`, 'ok');
      if (!told.ans) { v.say(`The first window is complete. Its maximum is the front: ${say(A[dq[0]])}.`); told.ans = true; } else v.hold(700);
      q.clearTones();
    }
  });
  a.clearTones().noWin();
  v.eq(`[${swm(A, K).join(', ')}]`, 'ok').say('Every index is pushed and popped at most once, so the scan is linear.');
  v.answer(swm(A, K));

  recap(v, [{ name: 'Rescan each window', time: 'O(n · k)', space: 'O(1)' }, { name: 'Heap with lazy deletion', time: 'O(n log n)', space: 'O(n)' }, { name: 'Monotonic deque', time: 'O(n)', space: 'O(k)' }], 'Drop smaller, older values from the back; expire the front.', ['Max / min of every window → monotonic deque'], 'The deque keeps only the candidates that can still win.');
  return v.build();
}

const problem: Problem = {
  slug: 'sliding-window-maximum',
  statement: 'You are given an array of integers `nums` and a sliding window of size `k` moving from the very left of the array to the very right, one position at a time. Return the maximum of each window.',
  examples: [{ input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', output: '[3,3,5,5,6,7]' }, { input: 'nums = [1], k = 1', output: '[1]' }],
  constraints: ['1 ≤ k ≤ n ≤ 10⁵', '−10⁴ ≤ nums[i] ≤ 10⁴'],
  hints: ['Which elements can never be the maximum again once a larger element arrives?', 'Keep the useful indices in a deque, in decreasing order of value.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Rescan each window', idea: 'Take the maximum of each window directly.', time: 'O(n · k)', space: 'O(1)', bottleneck: 'Each window rescans k elements.' },
    { id: 'better', kind: 'better', name: 'Max-heap, lazy deletion', idea: 'Heap of (value, index); pop tops whose index is outside the window.', time: 'O(n log n)', space: 'O(n)', bottleneck: 'Log factor; heap keeps stale entries.' },
    { id: 'optimal', kind: 'optimal', name: 'Monotonic deque', idea: 'Deque of indices with decreasing values; pop back while smaller, pop front when expired.', time: 'O(n)', space: 'O(k)' },
  ],
  pitfalls: ['Store indices so the front can expire.', 'Only start recording once i ≥ k − 1.'],
  takeaway: 'Window max → **monotonic deque**.',
  video,
  videoArgs: [A, K],
  judge: {
    type: 'fn', fn: 'maxSlidingWindow', params: ['int[]', 'int'], ret: 'int[]',
    tests: [{ args: [A, K], out: [3, 3, 5, 5, 6, 7] }, { args: [[1], 1], out: [1] }, { args: [[9, 8, 7, 6], 2], out: [9, 8, 7] }, { args: [[4, 4, 4], 3], out: [4] }],
    gen: (r: Rng) => { const a = r.ints(r.int(1, 12), -5, 5); return [a, r.int(1, a.length)]; },
    ref: (a: number[], k: number) => swm(a, k),
  },
};

export default problem;
