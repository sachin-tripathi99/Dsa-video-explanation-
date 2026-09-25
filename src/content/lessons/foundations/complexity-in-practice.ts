import type { Lesson } from '../../types';
import { Video } from '../../helpers';

function video() {
  const v = new Video('complexity-in-practice', 'Analysing real code');
  v.chapter('triangle', 'Loops that depend on each other', { code: ['for i in 0..n-1:', '  for j in i+1..n-1:', '    work(i, j)'] });
  const n = 6;
  const g = v.grid('g', Array.from({ length: n }, () => Array(n).fill('')), { label: 'pairs (i, j) with j > i', rowHead: Array.from({ length: n }, (_, i) => `i=${i}`), colHead: Array.from({ length: n }, (_, j) => `j=${j}`) });
  for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) g.tone(i, j, 'dim');
  v.say('Real code is messier than one clean loop. Here the inner loop starts at i plus one, so it gets shorter each time. Is it still n squared?');
  let w = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      w++;
      g.set(i, j, w).tone(i, j, 'active');
    }
    for (let j = i + 1; j < n; j++) g.tone(i, j, 'done');
    v.counter(`work: ${w}`).line(2).eq(`row i=${i}: ${n - 1 - i} pairs`);
    v.hold(650);
  }
  v.eq('5 + 4 + 3 + 2 + 1 = 15 = n(n−1)/2', 'warn');
  v.say('Five plus four plus three plus two plus one: fifteen, which is n times n minus one, over two. That is half the square, but half of n squared is still O of n squared. Constants do not change the class.');

  v.chapter('doubling', 'Multiply or divide each step', { code: ['i = 1', 'while i < n:', '  i = i * 2'] });
  v.clear();
  const d = v.array('d', [1, 2, 4, 8, 16, 32, 64], { label: 'values of i when n = 100' });
  for (let k = 0; k < 7; k++) {
    d.clearTones().ptr('i', k).tone(k, 'active');
    v.counter(`steps: ${k + 1}`).line(2);
    if (k === 0) v.say('When the loop variable doubles each time instead of adding one, it reaches n in very few steps.');
    else v.hold(420);
  }
  v.eq('doubling until n = log₂ n steps').note('i *= 2 or i /= 2 → O(log n)');
  v.say('One, two, four, all the way past a hundred in seven steps. Doubling or halving the loop variable gives O of log n.');
  v.clear();
  v.text('nlogn', { title: 'Put them together', lines: ['`for i = 1; i < n; i *= 2` → runs log n times', '`  for j in 0..n-1` → runs n times each', 'total: n · log n → O(n log n)'], mono: false });
  v.say('Combine them: an outer loop that doubles, and an inner loop over everything. That multiplies to n log n.');

  v.chapter('rtree', 'Recursion trees', { code: ['fib(n):', '  if n < 2: return n', '  return fib(n-1) + fib(n-2)'] });
  v.clear();
  const t = v.tree('fib', { binary: false, label: 'calls made by fib(5)' });
  const counts = { calls: 0 };
  const build = (k: number, parent: string | null) => {
    const id = t.add(parent, `f(${k})`);
    counts.calls++;
    if (k >= 2) {
      build(k - 1, id);
      build(k - 2, id);
    }
    return id;
  };
  const root = build(5, null);
  const all = t.bfs();
  const depth: Record<string, number> = { [root]: 0 };
  for (const id of all) for (const k of t.kids(id)) depth[k] = depth[id] + 1;
  const maxD = Math.max(...Object.values(depth));
  const saved = JSON.parse(JSON.stringify(t.p.nodes));
  // Hide deeper levels, then reveal level by level.
  for (let lvl = 0; lvl <= maxD; lvl++) {
    const nodes: typeof t.p.nodes = {};
    for (const id of all) if (depth[id] <= lvl) nodes[id] = { v: saved[id].v, kids: saved[id].kids.filter((k: string) => depth[k] <= lvl) };
    t.p.nodes = nodes;
    const shown = Object.keys(nodes).length;
    v.counter(`calls: ${shown}`).line(2);
    if (lvl === 0) v.say('For recursion, draw the tree of calls. Fibonacci of five calls fib of four and fib of three.');
    else if (lvl === 1) v.say('Each of those calls two more.');
    else v.hold(800);
  }
  const f2 = all.filter((id) => t.val(id) === 'f(2)');
  t.tone(f2, 'warn');
  v.eq(`${counts.calls} calls for n = 5 · fib(2) computed ${f2.length} times`, 'bad');
  v.say(`Fifteen calls for n equals five. The tree roughly doubles every level, so the work is about two to the n. Notice fib of two is computed ${f2.length} times. That repeated work is exactly what dynamic programming removes later in the course.`);
  t.clearTones();

  v.chapter('msort', 'Levels × work per level');
  v.clear();
  v.table('lv', ['Level', 'Pieces', 'Size of each', 'Work at this level'], [
    ['0', '1', 'n', 'n'],
    ['1', '2', 'n/2', 'n'],
    ['2', '4', 'n/4', 'n'],
    ['…', '…', '…', 'n'],
    ['log n', 'n', '1', 'n'],
  ]).tone(4, 'active');
  v.eq('log n levels × n work each = O(n log n)', 'ok');
  v.say('Merge sort splits the array in half again and again. There are log n levels, and every level does n work in total to merge. Levels times work per level: n log n. This levels-times-work trick analyses most divide and conquer algorithms.');

  v.chapter('amortised', 'Amortised: dynamic arrays', { code: ['append(x):', '  if size == capacity:', '    capacity *= 2; copy everything', '  a[size++] = x'] });
  v.clear();
  const cap = v.array('cap', [null], { label: 'capacity 1' });
  const info = v.vars('v', { size: 0, capacity: 1, 'total copies': 0 });
  let size = 0;
  let capacity = 1;
  let copies = 0;
  for (let x = 1; x <= 9; x++) {
    if (size === capacity) {
      copies += size;
      capacity *= 2;
      const vals = cap.values.slice(0, size);
      cap.setAll([...vals, ...Array(capacity - size).fill(null)]).clearTones().toneRange(0, size - 1, 'warn');
      cap.label(`capacity ${capacity}: copied ${size}`);
      info.set({ capacity, 'total copies': copies });
      v.line(2).eq(`full → double to ${capacity}, copy ${size}`, 'warn').hold(700);
    }
    cap.set(size, x).clearTones().tone(size, 'ok');
    size++;
    info.set({ size });
    v.line(3).eq(`append ${x}`);
    if (x === 1) v.say('A dynamic array, like an ArrayList, Python list or C++ vector, has a capacity. When it is full, it doubles and copies everything over. That copy costs O of n.');
    else if (x === 5) v.say('Copies happen at sizes one, two, four, eight: rarely, and each time the array doubles.');
    else v.hold(420);
  }
  v.eq(`9 appends, ${copies} copies in total < 2n`, 'ok').note('O(1) amortised per append');
  v.say('Add up all the copying: one plus two plus four plus eight is less than two n. Spread over n appends, each one costs O of one on average. That is called amortised O of one.');

  v.chapter('traps', 'Hidden costs');
  v.clear();
  v.table('tr', ['Looks like O(n)…', 'Actually', 'Because'], [
    ['`s = s + c` in a loop (Java/Python)', 'O(n²)', 'strings are immutable, each + copies'],
    ['`list.remove(0)` / `pop(0)` in a loop', 'O(n²)', 'every element shifts left'],
    ['`x in list` inside a loop', 'O(n²)', 'membership test scans the list'],
    ['`sort()` inside a loop', 'O(n² log n)', 'each sort is O(n log n)'],
  ]);
  v.say('Finally, watch for hidden costs. Building a string with plus in a loop copies it every time. Removing from the front of a list shifts everything. Checking membership in a list scans it. Each turns an innocent loop into n squared. Use a string builder, a deque, and a set instead.');

  v.chapter('recap', 'Recap');
  v.clear();
  v.text('r', { title: 'A checklist for any code', lines: ['Loops in sequence add; nested loops multiply', 'Inner loop shrinking by one each time is still O(n²)', 'Doubling / halving → O(log n)', 'Recursion: count calls in the tree, or levels × work per level', 'Amortised O(1): occasional expensive steps spread over many cheap ones', 'Always check the cost of library calls inside loops'] });
  v.say('That is your checklist. With it, you can analyse any solution in this course, and you will see us do it in every video.');
  return v.build();
}

const body = String.raw`
## Sequential vs nested

- Loops **one after another** add: O(n) + O(m) = **O(n + m)**.
- Loops **inside each other** multiply: O(n) × O(m) = **O(n · m)**.

## Loops that depend on each other

\`\`\`java
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        work(i, j);       // (n-1) + (n-2) + ... + 1 = n(n-1)/2  →  O(n²)
\`\`\`

\`\`\`python
for i in range(n):
    for j in range(i + 1, n):
        work(i, j)        # (n-1) + (n-2) + ... + 1 = n(n-1)/2  →  O(n²)
\`\`\`

\`\`\`cpp
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        work(i, j);       // (n-1) + (n-2) + ... + 1 = n(n-1)/2  →  O(n²)
\`\`\`

Useful sums:

| Sum | Value | Big-O |
|---|---|---|
| 1 + 2 + … + n | n(n+1)/2 | O(n²) |
| 1 + 2 + 4 + … + n | 2n − 1 | O(n) |
| n + n/2 + n/4 + … + 1 | ≈ 2n | O(n) |
| 1 + ½ + ⅓ + … + 1/n | ≈ ln n | O(log n) |

That last row explains why a loop like \`for i in 1..n: for j in range(i, n, i)\` (the sieve of Eratosthenes) is O(n log n), not O(n²).

## Loops that multiply or divide

\`\`\`java
for (int i = 1; i < n; i *= 2) { ... }     // O(log n)
for (int i = n; i > 0; i /= 2) { ... }     // O(log n)
for (int i = 1; i < n; i *= 2)             // O(n log n)
    for (int j = 0; j < n; j++) { ... }
\`\`\`

\`\`\`python
i = 1
while i < n:          # O(log n)
    i *= 2
\`\`\`

\`\`\`cpp
for (int i = 1; i < n; i *= 2) { /* ... */ }   // O(log n)
\`\`\`

## Recursion

Two tools:

1. **Draw the call tree and count nodes.** \`fib(n)\` makes two calls per call and goes n levels deep: about 2ⁿ calls. The same subproblem appears many times, which is the signal for dynamic programming.
2. **Levels × work per level.** Merge sort has log n levels; each level merges n elements in total: O(n log n). Binary search has log n levels with O(1) work each: O(log n).

| Recurrence | Example | Result |
|---|---|---|
| T(n) = T(n/2) + O(1) | binary search | O(log n) |
| T(n) = T(n−1) + O(1) | linear recursion | O(n) |
| T(n) = 2T(n/2) + O(n) | merge sort | O(n log n) |
| T(n) = T(n−1) + O(n) | selection sort | O(n²) |
| T(n) = 2T(n−1) + O(1) | naive fibonacci, subsets | O(2ⁿ) |

Space for recursion = **maximum depth** of the tree (the call stack), not the number of nodes.

## Amortised analysis

Some operations are usually cheap but occasionally expensive. A dynamic array (Java \`ArrayList\`, Python \`list\`, C++ \`vector\`) doubles its capacity when full and copies everything. Over n appends the total copying is 1 + 2 + 4 + … < 2n, so each append is **O(1) amortised**. Other examples: a stack-based queue ([Implement Queue using Stacks](#/problem/implement-queue-using-stacks)), and monotonic stacks where each element is pushed and popped at most once.

## Hidden costs of built-ins

| Operation | Java | Python | C++ |
|---|---|---|---|
| Append to end | \`list.add\` O(1)* | \`append\` O(1)* | \`push_back\` O(1)* |
| Insert/remove at front | \`list.add(0, x)\` O(n) | \`insert(0, x)\`, \`pop(0)\` O(n) | \`insert(begin)\` O(n) |
| Deque front ops | \`ArrayDeque\` O(1) | \`deque.appendleft\` O(1) | \`deque::push_front\` O(1) |
| Membership | \`list.contains\` O(n), \`set.contains\` O(1)† | \`x in list\` O(n), \`x in set\` O(1)† | \`find\` O(n), \`unordered_set::count\` O(1)† |
| String + in a loop | O(n²) total, use \`StringBuilder\` | O(n²) worst case, use \`''.join\` | \`s += c\` is amortised O(1) |
| Sort | O(n log n) | O(n log n) | O(n log n) |
| Slice / substring | O(k) copy | O(k) copy | \`substr\` O(k) |

\* amortised, † average

## From constraints to complexity

About 10⁸ simple operations per second is a safe estimate.

| n | Target |
|---|---|
| ≤ 12 | O(n!), permutations |
| ≤ 25 | O(2ⁿ), subsets or bitmask DP |
| ≤ 500 | O(n³) |
| ≤ 5,000 | O(n²) |
| ≤ 10⁶ | O(n log n) |
| ≤ 10⁸ | O(n) |
| larger | O(log n) or a formula |
`;

const lesson: Lesson = {
  slug: 'complexity-in-practice',
  video,
  body,
  quiz: [
    { q: '`for i in 0..n: for j in 0..i:` does how much work?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'], answer: 2, why: '0 + 1 + … + (n−1) = n(n−1)/2, which is O(n²).' },
    { q: 'Merge sort: log n levels, each merging n elements in total. Time?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], answer: 1, why: 'Levels × work per level.' },
    { q: 'Why is appending to a dynamic array O(1) amortised even though resizing costs O(n)?', options: ['Resizing never happens', 'Resizes double the capacity, so total copying over n appends is < 2n', 'The copy is done in parallel', 'The array is a linked list internally'], answer: 1, why: 'Doubling makes expensive steps rare enough to average out.' },
    { q: 'Naive recursive fib(n) runs in about…', options: ['O(n)', 'O(n²)', 'O(2ⁿ)', 'O(log n)'], answer: 2, why: 'Each call branches into two, n levels deep. Memoisation brings it to O(n).' },
    { q: 'Space used by recursion depends on…', options: ['the total number of calls', 'the maximum depth of the call stack', 'the number of loops', 'nothing, recursion is free'], answer: 1, why: 'Only calls on the current path are in memory at once.' },
  ],
};

export default lesson;
