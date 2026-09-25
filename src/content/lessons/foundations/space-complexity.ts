import type { Lesson } from '../../types';
import { Video, bullets } from '../../helpers';

function video() {
  const v = new Video('space-complexity', 'Space complexity');
  v.chapter('intro', 'Memory is a budget too');
  v.text('t', { title: 'How much memory does it need?', subtitle: 'Space complexity: extra memory, as the input grows.', big: true });
  v.say('Time is not the only cost. Algorithms also use memory, and memory is limited. Space complexity measures how much extra memory an algorithm needs as the input grows.');
  v.clear();
  bullets(v, 'what', 'What counts', ['**Input space**: the input itself (usually not counted)', '**Auxiliary space**: new arrays, maps, strings you create', '**Call stack**: every active recursive call takes memory'], [
    'The input is already there, so we usually do not count it.',
    'What we count is auxiliary space: new arrays, hash maps, strings, anything we create.',
    'And one that people forget: the call stack. Every recursive call that has not returned yet is holding memory.',
  ]);

  v.chapter('constant', 'O(1): a few variables', { code: ['best = a[0]', 'for x in a:', '  best = max(best, x)', 'return best'] });
  v.clear();
  const arr = [5, 2, 9, 1, 7];
  const a = v.array('a', arr, { label: 'input (not counted)' });
  const vars = v.vars('mem', { best: 5 }, { label: 'extra memory' });
  v.line(0).counter('extra cells: 1');
  v.say('Finding the maximum. However long the array is, we only keep one extra variable: best.');
  let best = arr[0];
  arr.forEach((x, i) => {
    best = Math.max(best, x);
    a.clearTones().ptr('x', i).tone(i, 'active');
    vars.set({ best });
    v.line(2);
    v.hold(450);
  });
  v.eq('extra memory does not grow with n → O(1)', 'ok');
  v.say('Five numbers or five million, still one variable. That is constant space, O of one.');

  v.chapter('linear', 'O(n): a copy or a map', { code: ['out = new array of size n', 'for i in 0..n-1:', '  out[i] = a[i] * a[i]', 'return out'] });
  v.clear();
  const b = v.array('a', arr, { label: 'input' });
  const out = v.array('out', arr.map(() => null), { label: 'out: new array (counted)' });
  v.line(0).counter('extra cells: 5');
  v.say('Now we build a new array of squares. The new array has one slot per input number.');
  arr.forEach((x, i) => {
    b.clearTones().ptr('i', i).tone(i, 'active');
    out.clearTones().set(i, x * x).tone(i, 'ok');
    v.line(2).hold(420);
  });
  v.eq('n new cells → O(n) extra space', 'warn');
  v.say('n numbers need n new cells: O of n extra space. Hash maps and sets that store every element are O of n too.');

  v.chapter('stack', 'The hidden cost: recursion', { code: ['sum(n):', '  if n == 0: return 0', '  return n + sum(n - 1)'] });
  v.clear();
  const st = v.stack('calls', [], { label: 'call stack', ends: ['top', ''] });
  v.layout('row');
  const vr = v.vars('v', { calls: 0 }, { label: 'memory in use' });
  v.say('Here is a sneaky one. A recursive function that adds numbers from n down to zero has no arrays at all. Does it use constant space?');
  for (let k = 4; k >= 0; k--) {
    st.push(`sum(${k})`);
    st.clearTones().toneTop('active');
    vr.set({ calls: 5 - k });
    v.line(k === 0 ? 1 : 2).counter(`frames: ${5 - k}`);
    if (k === 4) v.say('Each call waits for the next one to finish. Its variables stay in memory, stacked up on the call stack.');
    else v.hold(600);
  }
  v.eq('n waiting calls on the stack', 'warn');
  v.say('When we reach the base case, n plus one calls are waiting at once.');
  let acc = 0;
  for (let k = 0; k <= 4; k++) {
    acc += k;
    st.pop();
    st.clearTones().toneTop('ok');
    vr.set({ calls: 4 - k });
    v.line(2).eq(`sum(${k}) returns ${acc}`).hold(500);
  }
  v.eq('recursion depth n → O(n) space', 'bad').note('deep recursion can overflow the stack');
  v.say('Then they return one by one. The peak was n frames, so this is O of n space. And if n is a million, the stack can overflow. A simple loop would use O of one.');

  v.chapter('tradeoff', 'Trading space for time');
  v.clear();
  v.table('tr', ['Problem', 'Less memory', 'Less time'], [
    ['Contains duplicate', 'sort: O(n log n) time, O(1) space', 'hash set: O(n) time, O(n) space'],
    ['Fibonacci(n)', 'loop with 2 variables: O(1) space', 'memo table: O(n) space, fast lookups'],
    ['Range sums, many queries', 'sum on demand: O(n) per query', 'prefix sums: O(n) space, O(1) per query'],
  ]);
  v.say('Very often you can buy speed with memory. A hash set makes duplicate checks linear. A prefix sum array answers range questions instantly. Knowing both costs lets you explain the trade-off, which interviewers love.');

  v.chapter('recap', 'Recap');
  v.clear();
  v.text('r', { title: 'Space complexity in one minute', lines: ['Count extra memory you create, not the input', 'A few variables → O(1)', 'A new array, map or set of n items → O(n)', 'Recursion depth d → O(d) on the call stack', 'A 2D table n × m → O(n · m)'] });
  v.say('Count the extra memory you create. A few variables is constant. A copy or a map of n items is linear. Recursion depth counts too. Next, we will analyse trickier code.');
  return v.build();
}

const body = String.raw`
## What space complexity measures

Space complexity is the **extra memory** an algorithm needs, as a function of the input size. By convention we count **auxiliary space**: memory you allocate beyond the input itself.

> Real-life picture: sorting a pile of papers. If you sort them on your desk by swapping papers around, you need no extra desk (O(1)). If you lay them all out on a second table first, you need a second table as big as the pile (O(n)).

## What to count

| You create… | Extra space |
|---|---|
| A few variables, counters, pointers | O(1) |
| A copy of the array, a result array of size n | O(n) |
| A hash map/set with up to n entries | O(n) |
| A 2D table n × m (e.g. DP) | O(n · m) |
| Recursion that goes d calls deep | O(d) for the call stack |
| A string built by concatenation of n pieces | O(n) (and possibly O(n²) time) |

**Output space:** if the problem asks you to return an array of n items, many interviewers don't count it. Say which convention you're using.

## The call stack

Every function call that hasn't returned yet keeps its local variables on the **call stack**. A recursion that goes n levels deep uses O(n) memory even with no arrays. Very deep recursion (around 10⁴–10⁵ levels depending on the language) can crash with a stack overflow; Python's default limit is 1000 levels.

\`\`\`java
// O(n) space: n frames on the call stack
int sumTo(int n) {
    if (n == 0) return 0;
    return n + sumTo(n - 1);
}

// O(1) space: one loop, two variables
int sumToIter(int n) {
    int total = 0;
    for (int k = 1; k <= n; k++) total += k;
    return total;
}
\`\`\`

\`\`\`python
# O(n) space: n frames on the call stack
def sum_to(n):
    if n == 0:
        return 0
    return n + sum_to(n - 1)

# O(1) space: one loop, two variables
def sum_to_iter(n):
    total = 0
    for k in range(1, n + 1):
        total += k
    return total
\`\`\`

\`\`\`cpp
// O(n) space: n frames on the call stack
int sumTo(int n) {
    if (n == 0) return 0;
    return n + sumTo(n - 1);
}

// O(1) space: one loop, two variables
int sumToIter(int n) {
    int total = 0;
    for (int k = 1; k <= n; k++) total += k;
    return total;
}
\`\`\`

## Trading space for time

Many optimisations in this course spend memory to save time:

- **Hash set** to remember seen values: O(n) space turns O(n²) pair checks into O(n).
- **Prefix sums**: O(n) space lets you answer any range-sum query in O(1).
- **Memoisation**: storing results of subproblems turns exponential recursion into polynomial time.

And sometimes the reverse: **in-place** algorithms (two pointers, cyclic sort, reversing a linked list) avoid extra memory entirely. When an interviewer says *"can you do it in O(1) extra space?"*, think in-place.

## In-place vs not

An algorithm is **in-place** if it uses O(1) extra space and modifies the input directly. Reversing an array with two pointers is in-place; building a reversed copy is not.
`;

const lesson: Lesson = {
  slug: 'space-complexity',
  video,
  body,
  quiz: [
    { q: 'A function creates a hash set and inserts every element of an n-element array. Extra space?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2, why: 'In the worst case all n elements are distinct and stored.' },
    { q: 'A recursive function calls itself on n − 1 until n = 0, with no arrays. Space?', options: ['O(1), no arrays are created', 'O(n), for the call stack', 'O(log n)', 'O(n²)'], answer: 1, why: 'n calls are waiting on the stack at the deepest point.' },
    { q: 'Which is an in-place algorithm?', options: ['Reversing an array by swapping the two ends inward', 'Copying the array backwards into a new array', 'Merge sort with a temporary array', 'Counting frequencies in a hash map'], answer: 0, why: 'Swapping ends uses two index variables: O(1) extra space.' },
    { q: 'A DP table has (n + 1) rows and (m + 1) columns. Space?', options: ['O(n + m)', 'O(n · m)', 'O(max(n, m))', 'O(1)'], answer: 1, why: 'Every cell is stored.' },
  ],
};

export default lesson;
