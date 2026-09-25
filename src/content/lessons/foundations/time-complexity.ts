import type { Lesson } from '../../types';
import { Video, bullets } from '../../helpers';

function video() {
  const v = new Video('time-complexity', 'Time complexity and Big-O');
  v.chapter('intro', 'Why not seconds?');
  v.text('t', { title: 'How fast is my code?', subtitle: 'Not in seconds. In steps, as the input grows.', big: true });
  v.say('How fast is a piece of code? You might time it in seconds. But the same code runs faster on a new laptop than an old phone, and faster on small inputs than big ones.');
  v.clear();
  bullets(v, 'why', 'Seconds are a bad ruler', ['Different machines → different seconds', 'Different languages → different seconds', 'What we really want: how the work grows as the input grows'], [
    'Seconds depend on the machine,',
    'and on the language.',
    'What we really care about is how the amount of work grows when the input gets bigger. That is time complexity.',
  ]);

  v.chapter('count', 'Counting steps', { code: ['total = 0', 'for x in nums:', '  total += x', 'return total'] });
  v.clear();
  const nums = [4, 8, 15, 16, 23, 42];
  const a = v.array('nums', nums, { label: 'nums (n = 6)' });
  const vars = v.vars('vars', { total: 0 });
  v.line(0).counter('steps: 1');
  v.say("Let's count. Here is code that adds up an array. Setting total to zero is one step.");
  let total = 0;
  for (let i = 0; i < nums.length; i++) {
    total += nums[i];
    a.clearTones().ptr('i', i).tone(i, 'active');
    for (let k = 0; k < i; k++) a.tone(k, 'done');
    vars.set({ total });
    v.line(2).counter(`steps: ${i + 2}`);
    if (i === 0) v.say('Then one step for each number: add it to the total.');
    else v.hold(550);
  }
  a.clearTones().noPtr().tone([0, 1, 2, 3, 4, 5], 'done');
  v.line(3).counter('steps: 8').eq('steps = n + 2');
  v.say('Six numbers took eight steps: one per number, plus two. For n numbers, it is n plus two steps.');
  v.clear();
  v.bars('b', [
    { label: 'n = 10', value: 12 },
    { label: 'n = 100', value: 102 },
    { label: 'n = 1,000', value: 1002 },
  ], { label: 'steps for n + 2' });
  v.eq('10× more input → 10× more work');
  v.say('Ten times more input means about ten times more work. The plus two barely matters. The work grows in a straight line with n. We call that linear time, written O of n.');

  v.chapter('growth', 'How work grows');
  v.clear();
  const curves = [
    { f: '1', label: 'O(1)' },
    { f: 'logn', label: 'O(log n)' },
    { f: 'n', label: 'O(n)' },
    { f: 'nlogn', label: 'O(n log n)' },
    { f: 'n2', label: 'O(n²)' },
    { f: '2n', label: 'O(2ⁿ)' },
  ];
  const ch = v.chart('c', [curves[0]], { xMax: 16, yMax: 48, label: 'operations as n grows' });
  ch.update({ highlight: '1' });
  v.say('Different algorithms grow at different rates. O of one, constant time, never grows. Reading an array element by index is constant.');
  ch.update({ curves: curves.slice(0, 2), highlight: 'logn' });
  v.say('O of log n grows very slowly. Each step halves the problem, like binary search. A million items take only about twenty steps.');
  ch.update({ curves: curves.slice(0, 3), highlight: 'n' });
  v.say('O of n, linear, is one pass over the input.');
  ch.update({ curves: curves.slice(0, 4), highlight: 'nlogn' });
  v.say('O of n log n is typical of good sorting algorithms. Slightly worse than linear, still very fast.');
  ch.update({ curves: curves.slice(0, 5), highlight: 'n2' });
  v.say('O of n squared comes from nested loops over the input. Look how quickly it shoots up.');
  ch.update({ curves, highlight: '2n' });
  v.say('And O of two to the n doubles with every extra element. That is trying every subset. It explodes almost immediately.');
  ch.update({ highlight: undefined });
  v.note('as n grows, the steeper curve always loses');
  v.say('For small n they are all close. As n grows, the order of these curves never changes. That is why we care about growth, not exact counts.');

  v.chapter('rules', 'Big-O rules');
  v.clear();
  const tb = v.table('rules', ['Exact count', 'Big-O', 'Why'], [
    ['3n + 5', 'O(n)', 'drop constants'],
    ['n² + 100n + 7', 'O(n²)', 'keep the biggest term'],
    ['500', 'O(1)', 'does not grow with n'],
    ['log₂ n or log₁₀ n', 'O(log n)', 'base is just a constant factor'],
    ['n + m (two inputs)', 'O(n + m)', 'keep both if both can be large'],
  ]);
  tb.tone(0, 'active');
  v.say('Big O keeps only what matters for growth. Rule one: drop constant factors. Three n plus five is O of n.');
  tb.tone(0, 'none').tone(1, 'active');
  v.say('Rule two: keep only the biggest term. When n is a million, n squared is a trillion and a hundred n is only a hundred million, so n squared wins.');
  tb.tone(1, 'none').tone(2, 'active');
  v.say('Anything that does not grow with n, even five hundred steps, is O of one.');
  tb.tone(2, 'none').tone(3, 'active');
  v.say('The base of a logarithm does not matter; changing it only multiplies by a constant.');
  tb.tone(3, 'none').tone(4, 'active');
  v.say('And with two separate inputs, like two arrays of sizes n and m, keep both: O of n plus m.');

  v.chapter('loops', 'Reading loops', { code: ['for i in 0..n-1:', '  for j in 0..n-1:', '    work()'] });
  v.clear();
  const n = 5;
  const g = v.grid('g', Array.from({ length: n }, () => Array(n).fill('')), { label: 'every (i, j) pair = one unit of work', rowHead: ['i=0', 'i=1', 'i=2', 'i=3', 'i=4'], colHead: ['j=0', '1', '2', '3', '4'] });
  let w = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      w++;
      g.set(i, j, w).tone(i, j, 'active');
      if (j > 0) g.tone(i, j - 1, 'done');
      if (j === 0 && i > 0) g.tone(i - 1, n - 1, 'done');
      v.counter(`work: ${w}`).line(2);
      if (i === 0 && j === 0) v.say('Nested loops: for every i, the inner loop runs over every j. Each cell is one unit of work.');
      else if (i === 0 || i === n - 1) v.hold(300);
    }
    if (i === 1) {
      v.hold(250);
    }
  }
  g.tone(n - 1, n - 1, 'done');
  v.eq('5 × 5 = 25 → n × n = O(n²)');
  v.say('Five rows of five: twenty-five units. For n, it is n times n. Two nested loops over the same input give O of n squared.');

  v.chapter('halving', 'Halving → log n', { code: ['lo, hi = 0, n-1', 'while lo <= hi:', '  mid = (lo + hi) / 2', '  cut the range in half'] });
  v.clear();
  const h = v.array('h', Array.from({ length: 16 }, (_, i) => i * 2 + 1), { label: 'n = 16 sorted numbers, find 23' });
  let lo = 0;
  let hi = 15;
  let steps = 0;
  const target = 23;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    steps++;
    h.clearTones();
    for (let i = 0; i < 16; i++) if (i < lo || i > hi) h.tone(i, 'out');
    h.ptrs({ lo, mid, hi }).tone(mid, h.get(mid) === target ? 'ok' : 'cmp');
    v.counter(`steps: ${steps}`).line(2).eq(`range size ${hi - lo + 1}`);
    if (steps === 1) v.say('Now a loop that cuts the problem in half every time, like binary search. Sixteen numbers, and we check the middle.');
    else if (h.get(mid) === target) v.say(`Found it after ${steps} steps. Sixteen, eight, four, two, one: each step halves the range.`);
    else v.hold(900);
    if (h.get(mid) === target) break;
    if ((h.get(mid) as number) < target) lo = mid + 1;
    else hi = mid - 1;
  }
  v.eq('halvings until 1 left = log₂ n').note('n = 1,000,000 → only ~20 steps');
  v.say('How many times can you halve n before one is left? That is log base two of n. For a million, just twenty steps. Halving loops are O of log n.');

  v.chapter('scale', 'What it means in practice');
  v.clear();
  v.bars('ops', [
    { label: 'O(log n)', value: 17, tone: 'ok', text: '17 ops · instant' },
    { label: 'O(n)', value: 100000, tone: 'ok', text: '100,000 ops · 1 ms' },
    { label: 'O(n log n)', value: 1700000, tone: 'ok', text: '1.7M ops · 17 ms' },
    { label: 'O(n²)', value: 1e10, tone: 'bad', text: '10 billion ops · ~100 s' },
  ], { label: 'n = 100,000 · about 10⁸ simple steps per second', log: true });
  v.say('Why does this matter? Take a hundred thousand numbers. A computer does roughly a hundred million simple steps per second. Log n, n, and n log n all finish in milliseconds.');
  v.note('this is why constraints matter');
  v.say('But n squared needs ten billion steps, well over a minute. Online judges give you about one second. That is why the input size in the constraints tells you which complexity you need.');

  v.chapter('cases', 'Best, worst, average', { code: ['for i in 0..n-1:', '  if a[i] == target: return i', 'return -1'] });
  v.clear();
  const s = v.array('s', [9, 4, 7, 1, 3, 8], { label: 'linear search' });
  s.ptr('i', 0).tone(0, 'ok');
  v.eq('best case: target is first → 1 step', 'ok').line(1);
  v.say('One more idea. Searching for a value one by one: if it happens to be first, we are done in one step. That is the best case.');
  s.clearTones().ptr('i', 5);
  for (let i = 0; i < 6; i++) s.tone(i, 'done');
  v.eq('worst case: target missing → n steps', 'bad').line(2);
  v.say('If it is missing, we check all n. That is the worst case. Unless told otherwise, Big O means the worst case, because that is the guarantee you can count on.');

  v.chapter('recap', 'Recap');
  v.clear();
  v.table('sum', ['Code shape', 'Complexity'], [
    ['Fixed number of steps', 'O(1)'],
    ['Halve the range each step', 'O(log n)'],
    ['One loop over the input', 'O(n)'],
    ['Sort, or divide and conquer', 'O(n log n)'],
    ['Two nested loops', 'O(n²)'],
    ['Try every subset', 'O(2ⁿ)'],
  ]);
  v.say('To recap: count steps, keep only the fastest-growing term, and match code shapes to their complexity. Next, we will measure memory the same way: space complexity.');
  return v.build();
}

const body = String.raw`
## What time complexity measures

Time complexity describes **how the number of steps grows as the input grows**. We ignore the machine, the language and small constant costs, and focus on the shape of the growth.

> Real-life picture: handing out exam papers. Giving one paper to each student takes time proportional to the class size (O(n)). Writing the date on the board takes the same time for 5 students or 500 (O(1)). Having every student shake hands with every other student grows like n² .

## Big-O notation

We write **O(f(n))** to mean "grows no faster than f(n), ignoring constant factors". Three rules cover almost everything:

1. **Drop constants.** 3n + 5 → O(n). 2n² → O(n²).
2. **Keep the dominant term.** n² + 100n + 7 → O(n²).
3. **Different inputs keep different letters.** Looping over an array of size n and another of size m is O(n + m); nested loops over both are O(n · m).

## Common complexities, fastest to slowest

| Big-O | Name | Typical code | n = 10⁵ |
|---|---|---|---|
| O(1) | constant | array index, hash map lookup, push/pop | 1 step |
| O(log n) | logarithmic | binary search, balanced BST, heap push | ~17 |
| O(n) | linear | one loop over the input | 10⁵ |
| O(n log n) | linearithmic | sorting, merge sort, heap of n items | ~1.7 × 10⁶ |
| O(n²) | quadratic | two nested loops | 10¹⁰ (too slow) |
| O(2ⁿ) | exponential | all subsets | impossible |
| O(n!) | factorial | all orderings | impossible |

## Reading code

### Constant time: O(1)

\`\`\`java
int first(int[] a) {
    return a[0];            // one step, no matter how long a is
}
\`\`\`

\`\`\`python
def first(a):
    return a[0]             # one step, no matter how long a is
\`\`\`

\`\`\`cpp
int first(vector<int>& a) {
    return a[0];            // one step, no matter how long a is
}
\`\`\`

### Linear time: O(n)

\`\`\`java
int sum(int[] a) {
    int total = 0;
    for (int x : a) total += x;   // runs n times
    return total;
}
\`\`\`

\`\`\`python
def total(a):
    s = 0
    for x in a:                   # runs n times
        s += x
    return s
\`\`\`

\`\`\`cpp
int sum(vector<int>& a) {
    int total = 0;
    for (int x : a) total += x;   // runs n times
    return total;
}
\`\`\`

### Quadratic time: O(n²)

\`\`\`java
int countPairs(int[] a) {
    int count = 0;
    for (int i = 0; i < a.length; i++)
        for (int j = i + 1; j < a.length; j++)   // about n²/2 pairs
            if (a[i] + a[j] == 0) count++;
    return count;
}
\`\`\`

\`\`\`python
def count_pairs(a):
    count = 0
    for i in range(len(a)):
        for j in range(i + 1, len(a)):   # about n²/2 pairs
            if a[i] + a[j] == 0:
                count += 1
    return count
\`\`\`

\`\`\`cpp
int countPairs(vector<int>& a) {
    int count = 0;
    for (int i = 0; i < (int)a.size(); i++)
        for (int j = i + 1; j < (int)a.size(); j++)   // about n²/2 pairs
            if (a[i] + a[j] == 0) count++;
    return count;
}
\`\`\`

n²/2 is still **O(n²)**: dropping the ½ is rule 1.

### Logarithmic time: O(log n)

\`\`\`java
int halvings(int n) {
    int steps = 0;
    while (n > 1) { n /= 2; steps++; }   // n, n/2, n/4, ... 1
    return steps;
}
\`\`\`

\`\`\`python
def halvings(n):
    steps = 0
    while n > 1:          # n, n/2, n/4, ... 1
        n //= 2
        steps += 1
    return steps
\`\`\`

\`\`\`cpp
int halvings(int n) {
    int steps = 0;
    while (n > 1) { n /= 2; steps++; }   // n, n/2, n/4, ... 1
    return steps;
}
\`\`\`

## Best, worst and average case

Linear search finds the target in 1 step if it's first (best case) and in n steps if it's missing (worst case). **Big-O normally means the worst case**, because it's the guarantee. Some structures are quoted by average case (hash maps are O(1) on average), and some by *amortised* cost (dynamic arrays); we cover both in [Complexity in practice](#/lesson/complexity-in-practice).

## Use the constraints

About **10⁸ simple operations run in a second**. Read the constraint on n and aim for:

| n up to | aim for |
|---|---|
| 10–12 | O(n!) |
| 20–25 | O(2ⁿ) |
| 500 | O(n³) |
| 5,000 | O(n²) |
| 10⁶ | O(n log n) or O(n) |
| 10⁹+ | O(log n) or O(1) |

## Common mistakes

- Thinking a single loop is always O(n). A loop that calls \`list.remove(0)\` or \`s.substring()\` inside can be O(n²) because those calls are O(n) themselves.
- Forgetting the cost of built-ins: sorting is O(n log n), \`in\` on a Python list is O(n), \`in\` on a set is O(1).
- Writing O(2n) or O(n + 5). Simplify to O(n).
`;

const lesson: Lesson = {
  slug: 'time-complexity',
  video,
  body,
  quiz: [
    { q: 'Simplify `4n² + 3n + 100` in Big-O.', options: ['O(4n²)', 'O(n² + n)', 'O(n²)', 'O(100)'], answer: 2, why: 'Drop constants and keep only the dominant term.' },
    { q: 'A loop runs `while n > 1: n = n / 2`. Its complexity is…', options: ['O(n)', 'O(log n)', 'O(n / 2)', 'O(1)'], answer: 1, why: 'The number of halvings until 1 is log₂ n.' },
    { q: 'You loop over array A (size n) and, separately after it, over array B (size m). Total?', options: ['O(n · m)', 'O(n + m)', 'O(max(n, m)²)', 'O(1)'], answer: 1, why: 'Sequential loops add. Nested loops would multiply.' },
    { q: 'n ≤ 10⁵ and the time limit is 1 second. Which complexity is too slow?', options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'], answer: 2, why: '10¹⁰ steps is roughly 100 seconds at 10⁸ steps per second.' },
    { q: 'Which statement about Big-O is true?', options: ['It measures seconds on a reference machine', 'It usually describes the worst-case growth rate', 'O(n) is always faster than O(n²) for every input', 'It counts every single instruction exactly'], answer: 1, why: 'Big-O describes growth, usually worst case. For tiny inputs an O(n²) algorithm can beat an O(n) one because of constants.' },
    { q: 'Checking `x in my_list` in Python for a list of n items costs…', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2, why: 'A list has to be scanned. A set would be O(1) on average.' },
  ],
};

export default lesson;
