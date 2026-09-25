import type { Lesson } from '../../types';
import { Video } from '../../helpers';

function video() {
  const v = new Video('arrays', 'Arrays and dynamic arrays');
  v.chapter('intro', 'Seats in a row');
  const seats = v.array('mem', [12, 7, 30, 4, 19, 8], { label: 'an array: values side by side in memory' });
  seats.subs(['@1000', '@1004', '@1008', '@1012', '@1016', '@1020']);
  v.say('An array is like a row of numbered cinema seats. The values sit side by side in memory, and each one has a number, its index, starting from zero.');
  v.eq('address of a[i] = start + i × 4 bytes');
  v.say('Because every slot has the same size and they are packed together, the computer can compute where any index lives: the start address plus i times the slot size.');

  v.chapter('access', 'Access by index: O(1)', { code: ['x = a[3]'] });
  seats.ptr('i', 3).tone(3, 'active');
  v.line(0).eq('a[3] → 1000 + 3 × 4 = @1012 → 4', 'ok').counter('steps: 1');
  v.say('So reading a of three is one calculation and one jump, no matter how long the array is. That is constant time, and it is the superpower of arrays.');

  v.chapter('search', 'Search by value: O(n)', { code: ['for i in 0..n-1:', '  if a[i] == target: return i', 'return -1'] });
  v.clear();
  const s = v.array('a', [12, 7, 30, 4, 19, 8], { label: 'find 19' });
  for (let i = 0; i <= 4; i++) {
    s.clearTones().ptr('i', i).tone(i, i === 4 ? 'ok' : 'cmp');
    for (let k = 0; k < i; k++) s.tone(k, 'done');
    v.counter(`checks: ${i + 1}`).line(1);
    if (i === 0) v.say('But finding a value is different. If the array is not sorted, we have no idea where nineteen is, so we check every seat.');
    else if (i === 4) v.eq('found at index 4', 'ok').say('Found at index four after five checks. In the worst case, n checks: O of n. If the array were sorted, binary search would do it in log n.');
    else v.hold(420);
  }

  v.chapter('insert', 'Insert in the middle: O(n)', { code: ['shift a[i..n-1] one step right', 'a[i] = x'] });
  v.clear();
  const ins = v.array('a', [12, 7, 30, 4, 19, null], { label: 'insert 25 at index 2 (one free slot at the end)' });
  ins.ptr('i', 2);
  v.say('Inserting in the middle is expensive. To put twenty-five at index two, everyone from index two onwards must shift one seat right to make room.');
  for (let k = 4; k >= 2; k--) {
    ins.set(k + 1, ins.get(k) as number).set(k, null).clearTones().tone(k + 1, 'warn');
    v.line(0).counter(`shifts: ${5 - k}`).hold(550);
  }
  ins.set(2, 25).clearTones().tone(2, 'ok');
  v.line(1).eq('3 shifts; worst case n shifts → O(n)', 'warn').say('Three shifts here, n shifts in the worst case. Deleting from the middle is the same story in reverse. That is why inserting at the front of a big array is slow.');

  v.chapter('append', 'Append at the end: O(1) amortised');
  v.clear();
  const ap = v.array('a', [12, 7, 30, null], { label: 'size 3, capacity 4' });
  ap.set(3, 5).tone(3, 'ok');
  v.eq('free slot at the end → O(1)', 'ok').say('Adding at the end is cheap when there is a free slot.');
  ap.setAll([12, 7, 30, 5, 9, null, null, null]).clearTones().toneRange(0, 3, 'warn').tone(4, 'ok').label('full → capacity doubled to 8, old values copied');
  v.eq('full → allocate 2× capacity, copy, then append', 'warn');
  v.say('When it is full, a dynamic array, like Java ArrayList, Python list or C plus plus vector, allocates double the space and copies everything over. That copy is rare enough that appends average out to constant time, as we saw in the complexity lessons.');

  v.chapter('grid', '2D arrays');
  v.clear();
  const g = v.grid('g', [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], { label: 'grid[3][4]: 3 rows × 4 columns', rowHead: ['r0', 'r1', 'r2'], colHead: ['c0', 'c1', 'c2', 'c3'] });
  g.tone(1, 2, 'active');
  v.eq('grid[1][2] = 7 · rows × cols cells');
  v.say('A two-dimensional array is an array of rows. Grid of row one, column two is seven. Games boards, images and dynamic programming tables are all 2D arrays. Visiting every cell costs rows times columns.');

  v.chapter('recap', 'When to use an array');
  v.clear();
  v.table('ops', ['Operation', 'Cost'], [
    ['Read / write a[i]', 'O(1)'],
    ['Append at the end', 'O(1) amortised'],
    ['Insert / delete at the end', 'O(1)'],
    ['Insert / delete at front or middle', 'O(n)'],
    ['Search unsorted', 'O(n)'],
    ['Search sorted (binary search)', 'O(log n)'],
  ]).tone(0, 'ok');
  v.say('Use an array when you need fast access by position and you mostly add at the end. If you constantly insert at the front, use a deque. If you constantly search by value, use a hash set. Most patterns in this course, two pointers, sliding window, prefix sums, run on arrays.');
  return v.build();
}

const body = String.raw`
## The idea

An **array** stores elements **contiguously** (side by side) in memory, each in a slot of the same size. Because of that, the address of \`a[i]\` is simply \`start + i × slotSize\`, so reading or writing any index is **O(1)**.

> Real-life picture: numbered seats in a cinema row. You can walk straight to seat 17 without checking the others. But if a group wants to squeeze in at seat 3, everyone from seat 3 onwards has to shift over.

A **dynamic array** (Java \`ArrayList\`, Python \`list\`, C++ \`vector\`) grows automatically: when full, it allocates a bigger block (usually 1.5–2×) and copies everything, which keeps appends **O(1) amortised**.

## Operation costs

| Operation | Static array | Dynamic array |
|---|---|---|
| Access \`a[i]\` | O(1) | O(1) |
| Update \`a[i] = x\` | O(1) | O(1) |
| Append | not possible | O(1) amortised |
| Insert / remove at index i | O(n) | O(n) |
| Remove last | — | O(1) |
| Search (unsorted) | O(n) | O(n) |
| Search (sorted, binary search) | O(log n) | O(log n) |

## In your language

\`\`\`java
int[] fixed = new int[5];                 // static size, zeros
int[] a = {3, 1, 4};
List<Integer> list = new ArrayList<>();   // dynamic
list.add(7);                              // append, O(1) amortised
list.get(0);                              // O(1)
list.add(0, 9);                           // insert at front: O(n)
list.remove(list.size() - 1);             // remove last: O(1)
int[][] grid = new int[3][4];             // 3 rows, 4 columns
\`\`\`

\`\`\`python
a = [3, 1, 4]            # Python lists are dynamic arrays
a.append(7)              # O(1) amortised
a[0]                     # O(1)
a.insert(0, 9)           # O(n)
a.pop()                  # remove last: O(1)
a.pop(0)                 # remove first: O(n) (use collections.deque instead)
grid = [[0] * 4 for _ in range(3)]   # NOT [[0]*4]*3, which shares one row
\`\`\`

\`\`\`cpp
int fixedArr[5] = {};                     // static size
vector<int> a = {3, 1, 4};                // dynamic
a.push_back(7);                           // O(1) amortised
a[0];                                     // O(1)
a.insert(a.begin(), 9);                   // O(n)
a.pop_back();                             // O(1)
vector<vector<int>> grid(3, vector<int>(4, 0));
\`\`\`

## Common array techniques

These appear constantly; each has its own module later:

- **Two pointers**: indices moving toward each other or at different speeds ([Two pointers](#/learn/two-pointers)).
- **Sliding window**: a moving range \`[l, r]\` over the array ([Sliding window](#/learn/sliding-window)).
- **Prefix sums**: precomputed running totals for O(1) range sums ([Prefix sums](#/learn/prefix-sum)).
- **In-place overwrite with a write pointer**: filter an array without extra space ([Remove Element](#/problem/remove-element)).
- **Reversal tricks**: rotate an array with three reversals ([Rotate Array](#/problem/rotate-array)).
- **Tracking the best so far**: one pass remembering the minimum or maximum ([Best Time to Buy and Sell Stock](#/problem/best-time-to-buy-and-sell-stock)).

## When to use an array

- You need **fast access by position**.
- You mostly **add or remove at the end**.
- The data is naturally ordered (a sequence, a timeline, a grid).

Choose something else when you frequently insert/delete at the **front** (deque), insert in the **middle** of a huge sequence (linked list or balanced tree), or look things up **by value** (hash set/map).

## Pitfalls

- **Off-by-one errors:** valid indices are \`0 … n-1\`. Loop with \`i < n\`, not \`i <= n\`.
- **Modifying while iterating:** removing items from a list inside a for-each loop skips elements or throws.
- **Python 2D arrays:** \`[[0]*m]*n\` creates n references to the *same* row.
- **Hidden O(n) calls:** \`insert(0, x)\`, \`pop(0)\`, \`list.remove(x)\`, slicing.
`;

const lesson: Lesson = {
  slug: 'arrays',
  video,
  body,
  quiz: [
    { q: 'Why is `a[i]` O(1) in an array?', options: ['Arrays are sorted', 'The address can be computed directly: start + i × size', 'The computer caches every element', 'Arrays are small'], answer: 1, why: 'Contiguous equal-size slots make the address a simple calculation.' },
    { q: 'Inserting at index 0 of an array with n elements costs…', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2, why: 'Every element must shift one place to the right.' },
    { q: 'Appending to a dynamic array is O(1)…', options: ['always', 'amortised: occasional resizes copy everything, but they are rare', 'only in Python', 'never'], answer: 1, why: 'Doubling capacity makes the total copying over n appends less than 2n.' },
    { q: 'You need to repeatedly remove from the front of a large sequence. Best choice?', options: ['Array / list with remove(0)', 'A deque', 'A 2D array', 'Sorting it first'], answer: 1, why: 'Deques support O(1) removal at both ends.' },
    { q: 'In Python, what is wrong with `grid = [[0] * 3] * 3`?', options: ['Nothing', 'All three rows are the same list object', 'It creates a 1D list', 'It is too slow'], answer: 1, why: 'Changing grid[0][0] also changes grid[1][0] and grid[2][0]. Use a list comprehension.' },
  ],
};

export default lesson;
