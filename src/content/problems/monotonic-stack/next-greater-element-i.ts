import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const N1 = [4, 1, 2];
const N2 = [1, 3, 4, 2];
function nge(n1: number[], n2: number[]) { const m = new Map<number, number>(); const st: number[] = []; for (const x of n2) { while (st.length && st[st.length - 1] < x) m.set(st.pop()!, x); st.push(x); } return n1.map((x) => m.get(x) ?? -1); }

function video() {
  const v = new Video('next-greater-element-i', 'Next Greater Element I');
  v.chapter('intro', 'The problem');
  v.array('n1', N1, { label: 'nums1 (queries, a subset of nums2)' });
  v.array('n2', N2, { label: 'nums2 (distinct values)' });
  v.say('For each value in nums1, find it in nums2 and report the first larger value to its right in nums2, or minus one.');
  v.eq(`answer: [${nge(N1, N2).join(', ')}]`);

  v.chapter('brute', 'Brute force: search right for every query', { cx: 'O(m · n)', code: ['for x in nums1:', '  find x in nums2; scan right for the first larger value'] });
  v.eq('each query rescans nums2', 'warn').say('For every query, locate it in nums2 and scan to the right. That is m times n.');

  v.chapter('optimal', 'Optimal: monotonic stack over nums2 + hash map', { cx: 'O(m + n)', code: ['for x in nums2:', '  while stack and stack.top < x: nextGreater[stack.pop()] = x', '  push x', 'answer = [nextGreater.get(q, −1) for q in nums1]'] });
  v.clear();
  const a = v.array('n2', N2, { label: 'nums2', bars: true });
  const st = v.stack('st', [], { label: 'values waiting for a larger one' });
  const m = v.map('m', { label: 'next greater of each value' });
  const stack: number[] = [];
  let told = 0;
  v.say('Precompute the next greater value of every element in nums2 with one monotonic stack pass, storing the answers in a hash map. Then each query is a lookup.');
  N2.forEach((x, i) => {
    a.clearTones().tone(i, 'active');
    while (stack.length && stack[stack.length - 1] < x) {
      const y = stack.pop()!;
      st.pop();
      m.put(y, x).clearTones().tone(y, 'ok');
      v.line(1).eq(`${y} < ${x} → next greater of ${y} is ${x}`, 'ok');
      if (told === 0) { v.say(`${words(x)} is larger than ${words(y)} on top of the stack, so it is ${words(y)}’s next greater value.`); told++; } else v.hold(600);
    }
    stack.push(x);
    st.push(x);
    v.line(2).eq(`push ${x}`).hold(450);
  });
  stack.forEach((y) => m.put(y, -1));
  a.clearTones();
  v.line(3).eq(`look up [${N1.join(', ')}] → [${nge(N1, N2).join(', ')}]`, 'ok').say('Values left on the stack have no larger value to their right. Finally answer each query from the map.');
  v.answer(nge(N1, N2));

  recap(v, [{ name: 'Scan right per query', time: 'O(m · n)', space: 'O(1)' }, { name: 'Monotonic stack + map', time: 'O(m + n)', space: 'O(n)' }], 'Precompute every next greater value once; answer queries by lookup.', ['Many “next greater” queries → one stack pass + a map'], 'Answer all queries at once, then look them up.');
  return v.build();
}

const problem: Problem = {
  slug: 'next-greater-element-i',
  statement: 'The next greater element of `x` in an array is the first element to the right of `x` that is greater than `x`. Given two distinct-valued arrays `nums1` and `nums2` where `nums1` is a subset of `nums2`, for each `nums1[i]` find its next greater element in `nums2` (or `-1`).',
  examples: [{ input: 'nums1 = [4,1,2], nums2 = [1,3,4,2]', output: '[-1,3,-1]' }, { input: 'nums1 = [2,4], nums2 = [1,2,3,4]', output: '[3,-1]' }],
  constraints: ['1 ≤ nums1.length ≤ nums2.length ≤ 1000', 'values are unique'],
  hints: ['Compute the next greater element for every value in nums2 first.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Scan right per query', idea: 'Find each query in nums2 and scan right.', time: 'O(m · n)', space: 'O(1)', bottleneck: 'Repeated scans.' },
    { id: 'optimal', kind: 'optimal', name: 'Monotonic stack + map', idea: 'One decreasing-stack pass over nums2 fills value → next greater; answer queries from the map.', time: 'O(m + n)', space: 'O(n)' },
  ],
  takeaway: 'One stack pass answers **all** next-greater queries.',
  video,
  videoArgs: [N1, N2],
  judge: {
    type: 'fn', fn: 'nextGreaterElement', params: ['int[]', 'int[]'], ret: 'int[]',
    tests: [{ args: [[4, 1, 2], [1, 3, 4, 2]], out: [-1, 3, -1] }, { args: [[2, 4], [1, 2, 3, 4]], out: [3, -1] }],
    gen: (r: Rng) => { const n2 = r.distinct(r.int(1, 10), 0, 20); return [r.shuffle([...n2]).slice(0, r.int(1, n2.length)), n2]; },
    ref: (a: number[], b: number[]) => nge(a, b),
  },
};

export default problem;
