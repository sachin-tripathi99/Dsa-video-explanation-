import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';

const L = [[1, 5, 9], [2, 3, 12], [4, 6, 7, 8]];

function video() {
  const v = new Video('k-way-merge', 'K-way merge');
  v.chapter('intro', 'Merging k sorted sources');
  L.forEach((l, i) => v.array(`l${i}`, l, { label: `list ${i}` }));
  const N = L.flat().length;
  v.say(`We have ${words(L.length)} sorted lists and want one sorted list. Merging two sorted lists is easy: compare the two heads and take the smaller. With k lists, which head is the smallest?`);

  v.chapter('options', 'Three ways to do it');
  v.clear();
  v.table('t', ['Approach', 'Time', 'Idea'], [
    ['concatenate + sort', 'O(N log N)', 'ignores that the lists are sorted'],
    ['merge one list at a time', 'O(N · k)', 'the growing result is re-scanned k times'],
    ['min-heap of the k heads', 'O(N log k)', 'smallest head in O(log k)'],
  ]);
  v.say('Sorting everything wastes the fact that the lists are sorted. Merging them one by one re-walks the growing result k times. The best way keeps the current head of every list in a min-heap: the smallest head is on top, in log k time.');

  v.chapter('run', 'Heap of heads', { code: ['push the head of every list into a min-heap', 'while heap not empty:', '  pop the smallest → append to output', '  push the next element from the same list'] });
  v.clear();
  const W = Math.max(...L.map((l) => l.length));
  const g = v.grid('g', L.map((l) => Array.from({ length: W }, (_, j) => (j < l.length ? l[j] : ''))), { label: 'list 0 / list 1 / list 2 (one per row)' });
  const arrs = L.map((_, i) => ({ tone: (j: number, t: 'dim' | 'cmp') => g.tone(i, j, t) }));
  const h = v.heap('h', { label: 'min-heap of current heads', min: true, treeOnly: true });
  const out = v.array('o', [], { label: 'merged' });
  v.weight('g', 1.2).weight('h', 1.2).weight('o', 1.6);
  const from = new Map<number, number>();
  const idx = L.map(() => 0);
  L.forEach((l, i) => { from.set(l[0], i); h.push(l[0]); arrs[i].tone(0, 'cmp'); });
  v.line(0).eq(`heap = heads {${L.map((l) => l[0]).join(', ')}}`).say('Start by pushing the first element of every list. The heap holds exactly one candidate per list: that list’s smallest unused element.');
  let told = 0;
  let done = 0;
  while (h.size) {
    const x = Number(h.pop());
    const li = from.get(x)!;
    arrs[li].tone(idx[li], 'dim');
    out.push(x);
    out.clearTones().tone(done++, 'ok');
    idx[li]++;
    let pushed: number | null = null;
    if (idx[li] < L[li].length) { pushed = L[li][idx[li]]; from.set(pushed, li); h.push(pushed); arrs[li].tone(idx[li], 'cmp'); }
    v.line(2, 3).counter(`output ${done}/${N}`).eq(`pop ${x} (list ${li})${pushed !== null ? ` → push ${pushed} from list ${li}` : ` → list ${li} is empty`}`, 'ok');
    if (told === 0) { v.say(`The top is ${words(x)}, the smallest of all heads, so it is the smallest element overall. Append it, then replace it with the next element of the same list, ${words(pushed!)}.`); told++; }
    else if (told === 1 && pushed !== null) { v.say(`Pop ${words(x)} and push ${words(pushed)} from list ${words(li)}. The heap never holds more than k elements, so each step costs log k.`); told++; }
    else if (pushed === null && told === 2) { v.say(`List ${words(li)} has run out, so nothing replaces ${words(x)}. The heap just shrinks.`); told++; }
    else v.hold(600);
  }
  out.clearTones();
  v.eq(`merged ${N} elements · O(N log k) time, O(k) extra space`, 'ok').say(`All ${words(N)} elements come out in order. Every element is pushed and popped once, at log k each: N log k overall.`);

  v.chapter('shapes', 'The same idea in disguise');
  v.clear();
  v.table('d', ['Problem', 'The “k sorted lists” are…'], [
    ['Merge k sorted lists', 'the lists themselves'],
    ['Kth smallest in a sorted matrix', 'the rows of the matrix'],
    ['K pairs with smallest sums', 'for each i: pairs (i, 0), (i, 1), … sorted by sum'],
    ['Smallest range covering k lists', 'the lists, plus the current max of the heads'],
  ]);
  v.say('Many problems are k-way merges in disguise. Rows of a sorted matrix are sorted lists. Pairs with a fixed first element form a sorted list by sum. Spot the sorted sequences, and a heap of their heads does the rest.');
  return v.build();
}

const body = String.raw`
## The idea

Given **k sorted sequences**, keep the **current head of each** in a min-heap. Pop the smallest, output it, and push the next element **from the same sequence**. The heap never exceeds k entries, so N elements cost **O(N log k)**.

> Real-life picture: k checkout queues sorted by arrival time. To serve customers in global arrival order, you only ever compare the person at the front of each queue.

## Template

\`\`\`java
PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));   // (value, list, index)
for (int i = 0; i < k; i++) if (lists[i].length > 0) heap.offer(new int[]{lists[i][0], i, 0});
while (!heap.isEmpty()) {
    int[] t = heap.poll();
    out.add(t[0]);
    if (t[2] + 1 < lists[t[1]].length) heap.offer(new int[]{lists[t[1]][t[2] + 1], t[1], t[2] + 1});
}
\`\`\`

\`\`\`python
heap = [(lst[0], i, 0) for i, lst in enumerate(lists) if lst]
heapq.heapify(heap)
while heap:
    val, i, j = heapq.heappop(heap)
    out.append(val)
    if j + 1 < len(lists[i]):
        heapq.heappush(heap, (lists[i][j + 1], i, j + 1))
\`\`\`

\`\`\`cpp
priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<>> heap;   // (value, list, index)
for (int i = 0; i < k; i++) if (!lists[i].empty()) heap.push({lists[i][0], i, 0});
while (!heap.empty()) {
    auto [val, i, j] = heap.top(); heap.pop();
    out.push_back(val);
    if (j + 1 < (int)lists[i].size()) heap.push({lists[i][j + 1], i, j + 1});
}
\`\`\`

## Alternatives

| Approach | Time |
|---|---|
| Concatenate and sort | O(N log N) |
| Merge lists one at a time | O(N · k) |
| Divide and conquer (merge pairs, then pairs of pairs) | O(N log k) |
| Heap of heads | O(N log k) |

## Recognising it

- "k sorted lists / arrays / rows"
- "k-th smallest" across sorted sources: pop k − 1 times.
- Pairs from two sorted arrays: each row i of the (i, j) grid is sorted by sum.

## Pitfalls

- Store **where** each heap entry came from (list index, position), not just its value.
- Seed the heap with at most k entries (or min(k, rows) for k-th smallest problems).
`;

const lesson: Lesson = {
  slug: 'k-way-merge',
  video,
  body,
  quiz: [
    { q: 'What does the heap contain during a k-way merge?', options: ['all N elements', 'the current head of each list', 'the last element of each list', 'k random elements'], answer: 1, why: 'One candidate per list, so at most k entries.' },
    { q: 'After popping an element, what do you push?', options: ['nothing', 'the next element of the same list', 'the head of the next list', 'the largest remaining'], answer: 1, why: 'Its list now has a new head.' },
    { q: 'Time to merge N total elements from k lists with a heap?', options: ['O(N log N)', 'O(N log k)', 'O(N k)', 'O(k log N)'], answer: 1, why: 'Each of N elements: one push and one pop on a heap of size ≤ k.' },
    { q: 'Kth smallest in an n×n row- and column-sorted matrix with a heap?', options: ['push the whole matrix', 'push row heads, pop k − 1 times, pushing the right neighbour', 'binary search each row', 'sort each column'], answer: 1, why: 'Rows are k sorted lists.' },
  ],
};

export default lesson;
