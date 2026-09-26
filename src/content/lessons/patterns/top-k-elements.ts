import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';

const A = [5, 1, 9, 3, 7, 2, 8, 6];
const K = 3;

function video() {
  const v = new Video('top-k-elements', 'Top K with heaps');
  v.chapter('intro', 'The k biggest, without sorting everything');
  v.array('a', A, { label: `find the ${K} largest` });
  v.say(`Find the ${words(K)} largest numbers. Sorting everything works in n log n, but it does far more work than needed: we do not care about the order of the other numbers. And if the numbers arrive as a stream, we cannot sort at all.`);

  v.chapter('trick', 'The counter-intuitive trick: a MIN-heap for the LARGEST', { code: ['heap = min-heap', 'for x in nums:', '  push x', '  if size > k: pop    # evict the smallest', 'heap now holds the k largest'] });
  v.clear();
  const a = v.array('a', A, { label: 'stream' });
  const h = v.heap('h', { label: `min-heap, size ≤ ${K}: the ${K} best so far`, min: true });
  v.say(`Keep a min-heap of at most ${words(K)} numbers: the best ${words(K)} seen so far. The top of a min-heap is the smallest of them, the weakest member of the club. That is exactly the one to evict when someone better shows up.`);
  let told = 0;
  A.forEach((x, i) => {
    a.clearTones().tone(i, 'active');
    h.push(x);
    v.line(2).eq(`push ${x}`);
    if (h.size <= K) v.hold(600);
    if (h.size > K) {
      const out = h.pop();
      v.line(3).eq(`size ${K + 1} > ${K} → pop the smallest: ${out}`, out === x ? 'warn' : 'bad');
      if (told === 0) { v.say(`The heap now holds four numbers, one too many. Pop the top: ${words(out as number)}, the smallest. It can never be among the ${words(K)} largest because three bigger numbers have already been seen.`); told++; }
      else if (out === x && told === 1) { v.say(`${words(x)} goes in and comes straight back out: it is smaller than all current members.`); told++; }
      else v.hold(700);
    }
  });
  a.clearTones();
  v.line(4).eq(`k largest = {${h.values.map(Number).sort((x, y) => y - x).join(', ')}} · O(n log k) time, O(k) space`, 'ok').say(`The heap holds the ${words(K)} largest. Each step costs log k, because the heap never grows past k. With k much smaller than n, that is a big win over sorting, and it works on a stream.`);

  v.chapter('which', 'Which heap?');
  v.clear();
  v.table('t', ['Want', 'Keep a heap of size k that is…', 'Evict'], [
    ['k largest', 'min-heap', 'the smallest'],
    ['k smallest / k closest', 'max-heap', 'the largest / farthest'],
    ['k most frequent', 'min-heap by count', 'the least frequent'],
  ]);
  v.say('The rule: use the opposite heap. For the k largest, a min-heap, so the smallest member is ready to be evicted. For the k smallest or closest, a max-heap.');

  v.chapter('beyond', 'Even faster: buckets and quickselect');
  v.clear();
  v.table('b', ['Technique', 'Time', 'When'], [
    ['sort everything', 'O(n log n)', 'simplest; fine for small n'],
    ['heap of size k', 'O(n log k)', 'streams, k ≪ n'],
    ['bucket sort by count', 'O(n)', 'counts are bounded by n (frequencies)'],
    ['quickselect', 'O(n) average', 'one batch, order inside the k does not matter'],
  ]);
  v.say('Two more tools. When ranking by frequency, counts are at most n, so we can drop items into buckets indexed by count and read from the top: linear time. And quickselect, the partition step of quicksort, finds the k-th element in linear time on average.');
  return v.build();
}

const body = String.raw`
## The idea

To keep the **k best** items, maintain a heap of size k whose **top is the worst of the best**. When a new item beats it, evict the top.

- k **largest** → **min-heap** (evict the smallest).
- k **smallest / closest** → **max-heap** (evict the largest / farthest).

Time **O(n log k)**, space **O(k)**, and it works on a stream.

> Real-life picture: a leaderboard showing the top 10. A new score only matters if it beats the 10th place, and then the 10th place drops off.

## Template: k largest

\`\`\`java
PriorityQueue<Integer> heap = new PriorityQueue<>();      // min-heap
for (int x : nums) {
    heap.offer(x);
    if (heap.size() > k) heap.poll();                      // evict the smallest
}
\`\`\`

\`\`\`python
heap = []                                                  # min-heap
for x in nums:
    heapq.heappush(heap, x)
    if len(heap) > k:
        heapq.heappop(heap)                                # evict the smallest
\`\`\`

\`\`\`cpp
priority_queue<int, vector<int>, greater<int>> heap;       // min-heap
for (int x : nums) {
    heap.push(x);
    if ((int)heap.size() > k) heap.pop();                  // evict the smallest
}
\`\`\`

## Beyond heaps

| Technique | Time | Use when |
|---|---|---|
| Sort | O(n log n) | small input, simplest code |
| Heap of size k | O(n log k) | streaming, k ≪ n |
| Bucket sort by frequency | O(n) | ranking by counts (counts ≤ n) |
| Quickselect | O(n) average | one batch, order within the top k is free |

## Pitfalls

- A max-heap of all n items then popping k times is O(n + k log n): fine, but it does not work on streams and uses O(n) space.
- For ties (e.g. equal frequency, sort words alphabetically) the heap comparator must break ties in the **reverse** direction of the final order, because the top is the item to evict.
`;

const lesson: Lesson = {
  slug: 'top-k-elements',
  video,
  body,
  quiz: [
    { q: 'To keep the k largest numbers from a stream, use a…', options: ['max-heap of size k', 'min-heap of size k', 'sorted array', 'stack'], answer: 1, why: 'The min-heap top is the smallest of the k largest: the one to evict.' },
    { q: 'Time for n items with a heap of size k?', options: ['O(n log n)', 'O(n log k)', 'O(k log n)', 'O(n k)'], answer: 1, why: 'Each push/pop costs log k.' },
    { q: 'Top k frequent elements in O(n)?', options: ['impossible', 'bucket sort by frequency', 'binary search', 'two heaps'], answer: 1, why: 'Frequencies are at most n, so they index buckets.' },
    { q: 'k closest points to the origin: which heap?', options: ['min-heap by distance of size k', 'max-heap by distance of size k', 'no heap', 'two heaps'], answer: 1, why: 'Evict the farthest of the current k.' },
  ],
};

export default lesson;
