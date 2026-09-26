import type { Lesson } from '../../types';
import { Video } from '../../helpers';

const SCEN: { s: string; need: string; pick: string; why: string; say: string }[] = [
  { s: 'Phone contacts: look up a number by name', need: 'lookup by key', pick: 'Hash map', why: 'O(1) get by key', say: 'Contacts: you look people up by name. Lookup by key is the only operation that matters, so a hash map, with constant time get.' },
  { s: 'Undo in a text editor', need: 'last in, first out', pick: 'Stack', why: 'push / pop the latest action', say: 'Undo: the most recent action is undone first. Last in, first out. That is a stack.' },
  { s: 'Printer jobs in arrival order', need: 'first in, first out', pick: 'Queue', why: 'enqueue at back, dequeue at front', say: 'Printer jobs are served in the order they arrive. First in, first out. A queue.' },
  { s: 'Emergency room: treat the most urgent first', need: 'repeatedly take the max', pick: 'Heap (priority queue)', why: 'O(log n) push / pop max', say: 'An emergency room always treats the most urgent patient next, while new patients keep arriving. Repeatedly taking the maximum is exactly a heap.' },
  { s: 'Search box suggestions for a prefix', need: 'prefix queries', pick: 'Trie', why: 'O(L) to reach every word with that prefix', say: 'Search suggestions need every stored word starting with a prefix. That is a trie.' },
  { s: 'Bookings: find the first free slot after 3 pm', need: 'sorted order + nearest key', pick: 'Balanced BST (TreeMap)', why: 'O(log n) floor / ceiling', say: 'Bookings need the order of times, and the nearest time after a given one. A balanced search tree, like Java TreeMap, gives floor and ceiling in log n.' },
  { s: 'Maps app: routes between places', need: 'connections', pick: 'Graph', why: 'nodes + edges, BFS / Dijkstra', say: 'A maps app is about places and roads between them. Connections mean a graph.' },
  { s: 'Social network: are two people in the same community?', need: 'merging groups', pick: 'Union-Find', why: 'near O(1) union / find', say: 'Communities that keep merging, with “same group?” questions: union find.' },
  { s: 'Daily temperatures for a year, read by day', need: 'access by position', pick: 'Array', why: 'O(1) a[i]', say: 'A fixed sequence read by index, like temperatures by day of the year, is simply an array.' },
];

function video() {
  const v = new Video('choosing-a-data-structure', 'Which data structure should I use?');
  v.chapter('intro', 'Start from the operations');
  v.text('q', { title: 'Three questions before choosing', lines: ['1. Which operations will I do? (insert, delete, lookup, min/max, order, prefix…)', '2. Which one happens most often?', '3. Which structure makes that one cheap?'], shown: 3 });
  v.say('Choosing a data structure is not about remembering names. Start from the operations your program needs, find the one it does most often, and pick the structure that makes that operation cheap.');

  v.chapter('costs', 'The cost table', { code: [] });
  v.clear();
  const t = v.table('c', ['Structure', 'Access', 'Search', 'Insert / delete', 'Special power'], [
    ['Array', 'O(1)', 'O(n)', 'O(n) (end: O(1))', 'index access, cache friendly'],
    ['Linked list', 'O(n)', 'O(n)', 'O(1) at a known node', 'cheap splicing'],
    ['Stack / Queue / Deque', 'ends only', '—', 'O(1) at the ends', 'LIFO / FIFO order'],
    ['Hash map / set', '—', 'O(1) avg', 'O(1) avg', 'lookup by key'],
    ['Heap', 'min/max O(1)', 'O(n)', 'O(log n)', 'repeatedly take min/max'],
    ['Balanced BST', '—', 'O(log n)', 'O(log n)', 'sorted order, floor/ceiling'],
    ['Trie', '—', 'O(L)', 'O(L)', 'prefix queries'],
    ['Union-Find', '—', 'find ≈ O(1)', 'union ≈ O(1)', 'merging groups'],
  ]);
  v.say('Here is everything in one table. Each structure is fast at something and slow at something else. There is no best structure, only the best one for your operations.');
  t.tone(3, 'ok');
  v.say('Hash maps win at lookup by key, which is why they appear in so many solutions.');
  t.clearTones().tone(4, 'ok').tone(5, 'ok');
  v.say('But hashing forgets order. When you need the smallest, the largest, or things in sorted order, reach for a heap or a balanced search tree.');

  v.chapter('scenarios', 'Real-life scenarios');
  v.clear();
  const sc = v.table('s', ['Scenario', 'Key operation', 'Pick'], []);
  SCEN.forEach((x, i) => {
    sc.addRow([x.s, x.need, x.pick]).clearTones().tone(i, 'active');
    v.eq(`${x.pick}: ${x.why}`, 'ok').say(x.say);
  });
  sc.clearTones();

  v.chapter('combine', 'Combining structures');
  v.clear();
  v.table('m', ['Need', 'Combination', 'Example'], [
    ['O(1) lookup + recency order', 'hash map + doubly linked list', 'LRU cache'],
    ['O(1) lookup + frequency counts', 'hash map of counts', 'top k frequent'],
    ['Sliding window maximum', 'deque of indices', 'monotonic queue'],
    ['Running median', 'two heaps', 'find median from data stream'],
    ['Insert, delete, random pick in O(1)', 'array + hash map of indices', 'randomized set'],
  ]);
  v.say('Harder problems often need two operations to be fast at once. Then you combine structures. An LRU cache pairs a hash map, for instant lookup, with a linked list, for recency order. We will build several of these later.');

  v.chapter('recap', 'Recap');
  v.clear();
  v.text('r', { title: 'Rules of thumb', lines: ['Lookup by key or “seen before?” → hash map / set', 'Repeatedly the smallest / largest → heap', 'Sorted order or nearest value → balanced BST, or sort once', 'Most recent first → stack · oldest first → queue', 'Prefixes → trie · connections → graph · merging groups → union-find', 'Two needs at once → combine two structures'], shown: 6 });
  v.say('Name the operations, find the one that dominates, and pick the structure that makes it cheap. When two operations must both be fast, combine two structures. That is the whole skill.');
  return v.build();
}

const body = String.raw`
## Start from the operations

Before choosing, write down:

1. **Which operations** you need: insert, delete, lookup by key, lookup by position, min/max, sorted iteration, prefix search, "are these connected?"…
2. **Which one dominates**: the operation inside your main loop.
3. **Which structure** makes that one cheap.

## The cost table

| Structure | Access | Search | Insert / delete | Special power |
|---|---|---|---|---|
| Array / dynamic array | O(1) | O(n) | O(n); append O(1)* | index access, cache friendly |
| Linked list | O(n) | O(n) | O(1) at a known node | cheap splicing |
| Stack / Queue / Deque | ends only | — | O(1) at the ends | LIFO / FIFO |
| Hash map / set | — | O(1) avg | O(1) avg | lookup by key |
| Heap | min/max O(1) | O(n) | O(log n) | repeatedly take min/max |
| Balanced BST (TreeMap, SortedList) | — | O(log n) | O(log n) | sorted order, floor/ceiling |
| Trie | — | O(L) | O(L) | prefix queries |
| Union-Find | — | find ≈ O(1) | union ≈ O(1) | merging groups |

*amortised

## Real-life scenarios

| Scenario | Key operation | Pick |
|---|---|---|
| Phone contacts by name | lookup by key | hash map |
| Undo in an editor | last in, first out | stack |
| Printer queue | first in, first out | queue |
| Emergency room triage | take the most urgent | heap |
| Search suggestions | prefix queries | trie |
| First free booking after 3 pm | sorted order, nearest key | balanced BST |
| Map routes | connections | graph |
| Growing communities | merging groups | union-find |
| Temperature per day | access by position | array |

## When you need two things at once

| Need | Combination | Classic problem |
|---|---|---|
| O(1) lookup + recency order | hash map + doubly linked list | LRU Cache |
| Sliding window max/min | monotonic deque | Sliding Window Maximum |
| Running median | max-heap + min-heap | Find Median from Data Stream |
| O(1) insert/delete/random | array + index map | Insert Delete GetRandom O(1) |
| Counts + top k | hash map + heap (or buckets) | Top K Frequent Elements |

## In your language

| Structure | Java | Python | C++ |
|---|---|---|---|
| Dynamic array | \`ArrayList\` | \`list\` | \`vector\` |
| Stack | \`ArrayDeque\` (push/pop) | \`list\` | \`stack\` / \`vector\` |
| Queue / deque | \`ArrayDeque\` | \`collections.deque\` | \`queue\` / \`deque\` |
| Hash map / set | \`HashMap\` / \`HashSet\` | \`dict\` / \`set\` | \`unordered_map\` / \`unordered_set\` |
| Sorted map / set | \`TreeMap\` / \`TreeSet\` | \`sortedcontainers\` or sort + \`bisect\` | \`map\` / \`set\` |
| Heap | \`PriorityQueue\` (min) | \`heapq\` (min) | \`priority_queue\` (max) |

## Interview tip

Say your reasoning out loud: *"I need to check whether I've seen a value before, many times, so a hash set makes each check O(1)."* Interviewers are grading exactly this decision.
`;

const lesson: Lesson = {
  slug: 'choosing-a-data-structure',
  video,
  body,
  quiz: [
    { q: 'You process a stream and must always know the 10 largest values so far. Best fit?', options: ['Hash set', 'Min-heap of size 10', 'Sorted array with insert', 'Stack'], answer: 1, why: 'Push each value and pop the smallest when size exceeds 10: O(log 10) per item.' },
    { q: 'Browser back button?', options: ['Queue', 'Stack', 'Heap', 'Trie'], answer: 1, why: 'The most recently visited page comes back first.' },
    { q: 'You need “the smallest key ≥ x” many times with inserts in between.', options: ['Hash map', 'Balanced BST (TreeMap / std::map)', 'Queue', 'Array scan'], answer: 1, why: 'Ceiling queries need sorted order; a balanced BST gives O(log n).' },
    { q: 'LRU cache needs O(1) get and O(1) “evict least recently used”.', options: ['Hash map only', 'Heap', 'Hash map + doubly linked list', 'Trie'], answer: 2, why: 'The map finds nodes instantly; the list keeps recency order with O(1) moves.' },
  ],
};

export default lesson;
