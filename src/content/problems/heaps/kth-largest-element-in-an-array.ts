import type { Problem } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [3, 2, 1, 5, 6, 4];
const K = 2;

function video() {
  const v = new Video('kth-largest', 'Kth Largest Element in an Array');
  v.chapter('intro', 'The problem');
  v.array('nums', A, { label: `nums · k = ${K}` });
  v.say(`Find the k-th largest element: the element that would be at position k if the array were sorted from largest to smallest. For k equals two here, it is five.`);

  v.chapter('brute', 'Brute force: sort', { cx: 'O(n log n)', code: ['sort(nums)', 'return nums[n − k]'] });
  const s = [...A].sort((x, y) => x - y);
  v.array('sorted', s, { label: 'sorted' }).tone(s.length - K, 'ok');
  v.line(1).eq(`nums[${s.length - K}] = ${s[s.length - K]}`, 'ok').say('Sorting works: the answer is at index n minus k. But sorting orders everything when we only need one position.');

  v.chapter('better', 'Better: a min-heap of size k', { cx: 'O(n log k)', code: ['heap = min-heap', 'for x in nums:', '  push(x)', '  if size > k: pop()   (drop the smallest)', 'return heap top'] });
  v.clear().layout('row');
  const a = v.array('nums', A, { label: 'nums' });
  const h = v.heap('h', { label: `min-heap holding the ${K} largest so far`, min: true });
  A.forEach((x, i) => {
    a.clearTones().ptr('x', i).tone(i, 'active');
    h.push(x);
    let dropped: number | null = null;
    if (h.size > K) dropped = h.pop() as number;
    h.clearTones().tone(0, 'pivot');
    v.line(dropped === null ? 2 : 3).eq(dropped === null ? `push ${x}` : `push ${x}, too many → drop the smallest (${dropped})`);
    if (i === 0) v.say(`Keep a min-heap of the ${words(K)} largest values seen so far. Its root is the smallest of them, the k-th largest so far.`);
    else if (dropped !== null && i === K) v.say('When the heap grows past k, pop its minimum. That value can not be among the k largest.');
    else v.hold(650);
  });
  a.noPtr();
  v.eq(`heap top = ${h.peek()}`, 'ok').say('At the end, the root is the answer. Each step costs log k, so n log k in total, and only k memory.');

  v.chapter('optimal', 'Optimal: quickselect', { cx: 'O(n) average', code: ['target = n − k (index in sorted order)', 'partition around a random pivot', 'recurse only into the side that contains target'] });
  v.clear();
  const q = v.array('nums', A, { label: `quickselect: find the element that belongs at index ${A.length - K}` });
  const arr = [...A];
  const target = A.length - K;
  const pivot = 4;
  const less = arr.filter((x) => x < pivot);
  const more = arr.filter((x) => x > pivot);
  const part = [...less, pivot, ...more];
  q.setAll(part).clearTones().toneRange(0, less.length - 1, 'ok').tone(less.length, 'pivot').toneRange(less.length + 1, part.length - 1, 'warn');
  v.line(1).eq(`pivot ${pivot} lands at index ${less.length}; target index ${target} is on the right`);
  v.say(`Quickselect uses quick sort's partition step, but only recurses into one side. With pivot four, everything smaller goes left and everything bigger goes right, and four lands at index ${words(less.length)}. The target index, ${words(target)}, is on the right, so the left side is ignored completely.`);
  q.toneRange(0, less.length, 'dim').tone(target, 'ok');
  v.line(2).eq(`right part [${more.join(', ')}] → index ${target} holds ${[...A].sort((x, y) => x - y)[target]}`, 'ok').say('Partitioning the right part places five at index four. Found. On average each step halves the work: n plus n over two plus n over four, which is O of n. A random pivot avoids the n squared worst case.');
  v.answer([...A].sort((x, y) => x - y)[target]);
  recap(v, [{ name: 'Sort', time: 'O(n log n)', space: 'O(1)' }, { name: 'Min-heap of size k', time: 'O(n log k)', space: 'O(k)' }, { name: 'Quickselect', time: 'O(n) avg, O(n²) worst', space: 'O(1)' }], 'The heap is the safe, streaming-friendly answer; quickselect is fastest on average.', ['k-th largest → min-heap of size k', 'One order statistic → quickselect (partition, recurse one side)'], 'Mention both in interviews: the heap is predictable and works on streams; quickselect is linear on average.');
  return v.build();
}

const problem: Problem = {
  slug: 'kth-largest-element-in-an-array',
  statement: 'Given an integer array `nums` and an integer `k`, return the **k-th largest element** in sorted order (not the k-th distinct). Can you solve it without sorting?',
  examples: [{ input: 'nums = [3,2,1,5,6,4], k = 2', output: '5' }, { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', output: '4' }],
  constraints: ['1 ≤ k ≤ nums.length ≤ 10⁵', '-10⁴ ≤ nums[i] ≤ 10⁴'],
  hints: ['Sorting works. What if you only kept the k largest values seen so far?', 'Quick sort’s partition places one element in its final position. Which side do you need?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sort', idea: 'Sort and return `nums[n − k]`.', time: 'O(n log n)', space: 'O(1)', bottleneck: 'Sorts everything to find one position.' },
    { id: 'better', kind: 'better', name: 'Min-heap of size k', idea: 'Push each value; if the heap exceeds k, pop the minimum. The root is the answer.', time: 'O(n log k)', space: 'O(k)', bottleneck: 'Still pays log k per element.' },
    { id: 'optimal', kind: 'optimal', name: 'Quickselect', idea: 'Partition around a random pivot (three-way to handle duplicates); recurse only into the part that contains index `n − k`.', time: 'O(n) average', space: 'O(1)' },
  ],
  pitfalls: ['A fixed pivot can hit O(n²) on sorted input or many duplicates: use a random pivot and three-way partition.'],
  takeaway: 'K-th largest: a **size-k min-heap** (safe, O(n log k)) or **quickselect** (O(n) average).',
  video,
  videoArgs: [A, K],
  judge: {
    type: 'fn', fn: 'findKthLargest', params: ['int[]', 'int'], ret: 'int',
    tests: [{ args: [[3, 2, 1, 5, 6, 4], 2], out: 5 }, { args: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], out: 4 }, { args: [Array(3000).fill(1), 1500], out: 1 }],
    gen: (r) => { const a = r.ints(r.int(1, 20), -10, 10); return [a, r.int(1, a.length)]; },
    ref: (a: number[], k: number) => [...a].sort((x, y) => y - x)[k - 1],
  },
};

export default problem;
