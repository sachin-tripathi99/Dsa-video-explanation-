import type { Lesson } from '../../types';
import { Video } from '../../helpers';

function video() {
  const v = new Video('heaps', 'Heaps and priority queues');
  v.chapter('intro', 'The emergency room');
  v.text('t', { title: 'Always serve the most urgent first', subtitle: 'A priority queue gives you the smallest (or largest) item in O(1), and updates in O(log n)', big: true });
  v.say('In an emergency room, patients are not served in arrival order but by urgency. A priority queue works the same way: you can always take the most important item next. The usual way to build one is a heap.');

  v.chapter('shape', 'A tree stored in an array');
  v.clear();
  const h = v.heap('h', { label: 'min-heap: every parent ≤ its children', min: true });
  [1, 3, 2, 7, 4, 5].forEach((x) => h.push(x));
  v.say('A binary heap is a complete binary tree with one rule. In a min-heap, every parent is smaller than or equal to its children. So the smallest value is always at the root.');
  h.tone(0, 'ok');
  v.eq('children of i: 2i + 1 and 2i + 2 · parent of i: (i − 1) / 2').say('Because the tree is complete, it fits perfectly into an array with no pointers. The children of index i are at two i plus one and two i plus two, and the parent is at i minus one, over two.');
  h.clearTones();

  v.chapter('push', 'Push: add at the end, sift up', { code: ['append x at the end', 'while x < parent: swap them'] });
  v.eq('push(0)').say('To push, put the new value in the next free slot at the bottom, then sift it up: while it is smaller than its parent, swap them.');
  h.push(0, true);
  v.eq('0 bubbled up to the root: log n swaps at most', 'ok').say('Zero rose all the way to the root. The tree has height log n, so push takes O of log n.');

  v.chapter('pop', 'Pop: take the root, sift down', { code: ['top = a[0]; move the last element to the root', 'while it is bigger than a child: swap with the smaller child'] });
  v.eq('pop() → 0').say('To pop the minimum, take the root. Move the last element into the root, then sift it down, always swapping with the smaller child, until the heap rule holds again.');
  h.pop(true);
  v.eq('heap restored: O(log n)', 'ok').say('Again at most log n swaps. Peek, just reading the root, is O of one.');

  v.chapter('build', 'Heapify and heap sort');
  v.clear();
  v.table('c', ['Operation', 'Cost'], [
    ['peek min / max', 'O(1)'],
    ['push', 'O(log n)'],
    ['pop min / max', 'O(log n)'],
    ['build from n items (heapify)', 'O(n)'],
    ['search for an arbitrary value', 'O(n)'],
  ]);
  v.say('Building a heap from n items at once, called heapify, takes only O of n. Popping everything in order gives heap sort, n log n. But heaps are not for searching: finding an arbitrary value is still O of n.');

  v.chapter('kinds', 'Min-heap vs max-heap');
  v.clear();
  v.table('k', ['Language', 'Default', 'Max-heap'], [
    ['Java', 'PriorityQueue<Integer> (min)', 'new PriorityQueue<>(Collections.reverseOrder())'],
    ['Python', 'heapq on a list (min)', 'push −x and negate when popping'],
    ['C++', 'priority_queue<int> (max!)', 'min: priority_queue<int, vector<int>, greater<int>>'],
  ]);
  v.say('Careful with defaults. Java and Python give you a min-heap. C plus plus priority queue is a max-heap. In Python, fake a max-heap by pushing negative numbers.');

  v.chapter('recap', 'When to use a heap');
  v.clear();
  v.text('r', { title: 'Reach for a heap when you need…', lines: ['the smallest / largest item repeatedly, while items keep arriving', 'the top k items (keep a heap of size k)', 'to merge many sorted streams (k-way merge)', 'the next event in time order (scheduling, Dijkstra)'] });
  v.say('Use a heap whenever you repeatedly need the best item while the collection keeps changing: top k, merging sorted lists, scheduling, and shortest paths.');
  return v.build();
}

const body = String.raw`
## The idea

A **priority queue** lets you repeatedly remove the most important item. The standard implementation is a **binary heap**: a complete binary tree where each parent is ≤ its children (**min-heap**) or ≥ them (**max-heap**). The top is always the minimum (or maximum).

> Real-life picture: the emergency room. Arrival order doesn't matter; the most urgent patient is always seen next.

## Stored as an array

For index \`i\`: children at \`2i + 1\` and \`2i + 2\`, parent at \`(i − 1) / 2\`. No pointers needed.

## Costs

| Operation | Cost |
|---|---|
| peek top | O(1) |
| push | O(log n): append, then sift up |
| pop top | O(log n): move last to root, sift down |
| heapify n items | O(n) |
| search / delete an arbitrary item | O(n) |

## In your language

\`\`\`java
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
PriorityQueue<int[]> byDist = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
minHeap.offer(5);
int top = minHeap.peek();
int x = minHeap.poll();
\`\`\`

\`\`\`python
import heapq
h = []
heapq.heappush(h, 5)
top = h[0]
x = heapq.heappop(h)
heapq.heapify(nums)                     # O(n), in place
heapq.heappush(h, -5)                   # max-heap trick: store negatives
heapq.heappush(h, (dist, node))         # tuples compare by first element
largest3 = heapq.nlargest(3, nums)
\`\`\`

\`\`\`cpp
priority_queue<int> maxHeap;                                  // max by default!
priority_queue<int, vector<int>, greater<int>> minHeap;
priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> byDist;
maxHeap.push(5);
int top = maxHeap.top();
maxHeap.pop();                                                 // returns void
\`\`\`

## Patterns built on heaps

- **Top K** ([module](#/learn/top-k)): keep a heap of size k; the root is the k-th best so far.
- **K-way merge** ([module](#/learn/k-way-merge)): heap of the current heads of k sorted lists.
- **Two heaps** ([module](#/learn/two-heaps)): a max-heap of the lower half and a min-heap of the upper half give the running median.
- **Greedy scheduling:** always pick the task that frees up soonest / costs least.
- **Dijkstra** ([shortest paths](#/learn/shortest-paths)): repeatedly expand the closest unvisited node.

## Pitfalls

- C++ \`priority_queue\` is a **max**-heap; Java and Python default to **min**.
- Java comparator \`(a, b) -> a - b\` overflows for large values; use \`Integer.compare\`.
- A heap is not sorted: only the root is guaranteed. Iterating it gives an arbitrary order.
`;

const lesson: Lesson = {
  slug: 'heaps',
  video,
  body,
  quiz: [
    { q: 'In a min-heap stored in an array, where are the children of index 3?', options: ['4 and 5', '6 and 7', '7 and 8', '1 and 2'], answer: 2, why: '2·3 + 1 = 7 and 2·3 + 2 = 8.' },
    { q: 'Cost of pop in a binary heap?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 1, why: 'Sift-down follows one root-to-leaf path.' },
    { q: 'What does `std::priority_queue<int>` give you by default in C++?', options: ['A min-heap', 'A max-heap', 'A sorted array', 'A hash set'], answer: 1, why: 'Use greater<int> for a min-heap.' },
    { q: 'Heapify (building a heap from n items at once) costs…', options: ['O(n log n)', 'O(n)', 'O(log n)', 'O(n²)'], answer: 1, why: 'Most nodes are near the bottom and sift down only a little.' },
  ],
};

export default lesson;
