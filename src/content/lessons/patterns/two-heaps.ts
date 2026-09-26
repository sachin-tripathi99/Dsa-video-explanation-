import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';

const S = [5, 15, 1, 3, 8, 7, 9, 10];

function video() {
  const v = new Video('two-heaps', 'Two heaps for medians');
  v.chapter('intro', 'A median that keeps changing');
  v.array('s', S, { label: 'numbers arriving one at a time' });
  v.say('Numbers arrive one at a time, and after each one we want the median: the middle value of everything seen so far. Re-sorting after every arrival costs n log n each time. Keeping a sorted array costs n per insertion. We can do log n.');

  v.chapter('idea', 'Split into a smaller half and a bigger half');
  v.clear();
  v.text('t', { title: 'Two heaps', lines: ['lo: a MAX-heap holding the smaller half (its top is the largest small number)', 'hi: a MIN-heap holding the bigger half (its top is the smallest big number)', 'Keep sizes equal, or lo one bigger', 'Median = top of lo, or the average of both tops'], shown: 4 });
  v.say('Split the numbers into a smaller half and a bigger half. The smaller half lives in a max-heap, so its largest element is on top. The bigger half lives in a min-heap, so its smallest element is on top. The two tops sit right at the middle of the sorted order, which is exactly where the median is.');

  v.chapter('run', 'Walkthrough', { code: ['push x into lo (max-heap)', 'move lo.top to hi   # lo ≤ hi', 'if size(hi) > size(lo): move hi.top back to lo', 'median = lo.top  or  (lo.top + hi.top) / 2'] });
  v.clear().layout('row');
  const lo = v.heap('lo', { label: 'lo: max-heap (smaller half)', min: false, treeOnly: true });
  const hi = v.heap('hi', { label: 'hi: min-heap (bigger half)', min: true, treeOnly: true });
  const L: number[] = [], H: number[] = [];
  let told = 0;
  v.say('Every new number goes through lo and then hi, so the halves stay ordered. Then we rebalance so lo has the same size as hi, or one more.');
  S.forEach((x, i) => {
    lo.push(x); L.push(x); L.sort((a, b) => b - a);
    v.line(0).counter(`seen: ${S.slice(0, i + 1).join(', ')}`).eq(`push ${x} into lo`).hold(500);
    const m = L.shift()!; lo.pop(); hi.push(m); H.push(m); H.sort((a, b) => a - b);
    v.line(1).eq(`move lo's max ${m} to hi`).hold(500);
    let moved = false;
    if (H.length > L.length) { const b = H.shift()!; hi.pop(); lo.push(b); L.push(b); L.sort((a, c) => c - a); moved = true; v.line(2).eq(`hi is bigger → move ${b} back to lo`).hold(500); }
    const med = L.length > H.length ? L[0] : (L[0] + H[0]) / 2;
    v.line(3).eq(`median = ${L.length > H.length ? `lo.top = ${L[0]}` : `(${L[0]} + ${H[0]}) / 2 = ${med}`}`, 'ok');
    if (told === 0) { v.say(`The first number, ${words(x)}, passes through lo into hi, and then comes back to lo because lo must never be smaller. The median is ${words(med)}.`); told++; }
    else if (told === 1 && !moved) { v.say(`${words(x)} goes into lo, but lo’s largest is ${words(m)}, which belongs to the bigger half, so it moves to hi. Sizes are equal: the median is the average of the two tops, ${med}.`); told++; }
    else if (told === 2 && moved) { v.say(`After adding ${words(x)}, hi had one more element than lo, so its smallest moves back. Now lo has the extra element, and its top is the median, ${words(med)}.`); told++; }
    else v.hold(600);
  });
  v.eq('add: O(log n) · median: O(1)', 'ok').say('Each insertion is a few heap operations, log n. Reading the median just looks at the tops, constant time.');

  v.chapter('uses', 'Where two heaps show up');
  v.clear();
  v.table('u', ['Problem', 'lo holds', 'hi holds'], [
    ['Running median', 'smaller half (max-heap)', 'bigger half (min-heap)'],
    ['Sliding window median', 'same, plus lazy deletion', 'as the window moves'],
    ['IPO / project selection', 'affordable projects by profit (max-heap)', 'locked projects by capital (min-heap or sorted)'],
  ]);
  v.say('The same shape appears whenever items move between two groups with opposite priorities. In IPO, one heap holds projects we cannot afford yet, ordered by cost, and the other holds affordable projects, ordered by profit.');
  return v.build();
}

const body = String.raw`
## The idea

Maintain two heaps:

- **lo**: a **max-heap** with the smaller half.
- **hi**: a **min-heap** with the larger half.

Invariant: every element of lo ≤ every element of hi, and \`size(lo) == size(hi)\` or \`size(lo) == size(hi) + 1\`. Then the median is \`lo.top\` (odd count) or \`(lo.top + hi.top) / 2\` (even count).

> Real-life picture: two lines of people sorted by height facing each other. The tallest of the short group and the shortest of the tall group stand at the middle.

## Template

\`\`\`java
PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder());   // max-heap
PriorityQueue<Integer> hi = new PriorityQueue<>();                            // min-heap
void add(int x) {
    lo.offer(x);
    hi.offer(lo.poll());                               // largest small → hi
    if (hi.size() > lo.size()) lo.offer(hi.poll());    // rebalance
}
double median() {
    return lo.size() > hi.size() ? lo.peek() : ((long) lo.peek() + hi.peek()) / 2.0;
}
\`\`\`

\`\`\`python
lo, hi = [], []                                        # lo stores negatives (max-heap)
def add(x):
    heapq.heappush(lo, -x)
    heapq.heappush(hi, -heapq.heappop(lo))             # largest small → hi
    if len(hi) > len(lo):
        heapq.heappush(lo, -heapq.heappop(hi))         # rebalance
def median():
    return -lo[0] if len(lo) > len(hi) else (-lo[0] + hi[0]) / 2
\`\`\`

\`\`\`cpp
priority_queue<int> lo;                                // max-heap
priority_queue<int, vector<int>, greater<int>> hi;     // min-heap
void add(int x) {
    lo.push(x);
    hi.push(lo.top()); lo.pop();                       // largest small → hi
    if (hi.size() > lo.size()) { lo.push(hi.top()); hi.pop(); }
}
double median() {
    return lo.size() > hi.size() ? lo.top() : ((long long)lo.top() + hi.top()) / 2.0;
}
\`\`\`

## Removing elements (sliding windows)

Heaps cannot delete arbitrary elements cheaply. Use **lazy deletion**: record the value in a "to delete" map, adjust the logical sizes, and discard it only when it reaches a heap top.

## Pitfalls

- Averaging two ints can overflow: widen to long or double first.
- Always rebalance after each operation, or the tops stop being the middle.
`;

const lesson: Lesson = {
  slug: 'two-heaps',
  video,
  body,
  quiz: [
    { q: 'Which heap holds the smaller half?', options: ['min-heap', 'max-heap', 'either', 'neither'], answer: 1, why: 'Its top must be the largest of the small numbers.' },
    { q: 'With 6 numbers balanced 3/3, the median is…', options: ['lo.top', 'hi.top', '(lo.top + hi.top) / 2', 'the average of all'], answer: 2, why: 'Even count: average of the two middle values.' },
    { q: 'Cost of adding a number?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 1, why: 'A few heap pushes and pops.' },
    { q: 'How do you remove an element that is not at the top?', options: ['search the heap', 'lazy deletion: mark it, drop it when it surfaces', 'rebuild the heap', 'impossible'], answer: 1, why: 'Marking keeps each operation O(log n) amortised.' },
  ],
};

export default lesson;
