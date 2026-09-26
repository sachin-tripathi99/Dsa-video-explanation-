import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';

const W = [3, 2, 2, 4, 1, 4];
const D = 3;

function trips(cap: number) {
  let t = 1, load = 0;
  for (const w of W) { if (load + w > cap) { t++; load = 0; } load += w; }
  return t;
}

function video() {
  const v = new Video('binary-search-on-answer', 'Binary search on the answer');
  v.chapter('intro', 'Search over answers, not positions');
  v.array('w', W, { label: `box weights, shipped in order · must finish in ${D} days` });
  v.say(`A conveyor belt carries boxes in a fixed order. Each day a truck takes boxes from the front, as many as fit in its capacity. What is the smallest capacity that ships everything within ${words(D)} days?`);
  v.say('There is no sorted array to search here. But look at the possible answers themselves: capacities four, five, six and so on. And ask a yes or no question about each one.');

  v.chapter('monotonic', 'The yes/no question is monotonic', { code: ['feasible(cap): simulate greedily, count days', 'return days <= D'] });
  v.clear();
  const lo0 = Math.max(...W);
  const hi0 = W.reduce((a, b) => a + b, 0);
  const caps = Array.from({ length: hi0 - lo0 + 1 }, (_, i) => lo0 + i);
  const c = v.array('cap', caps, { label: 'candidate capacities (max weight … total weight)' });
  c.subs(caps.map((x) => (trips(x) <= D ? 'yes' : 'no')));
  caps.forEach((x, i) => c.tone(i, trips(x) <= D ? 'ok' : 'bad'));
  v.eq(`below ${lo0} a box cannot fit · at ${hi0} one day is enough`).say(`The capacity must be at least the heaviest box, ${words(lo0)}, and ${words(hi0)}, the total, always works in a single day. Under each candidate, can we finish in ${words(D)} days? The answers go no, no, then yes forever. If a capacity works, any bigger one works too. That is monotonic, so binary search can find the first yes.`);

  v.chapter('search', 'Binary search the first “yes”', { code: ['lo, hi = max(w), sum(w)', 'while lo < hi:', '  mid = lo + (hi − lo) / 2', '  if feasible(mid): hi = mid', '  else: lo = mid + 1', 'return lo'] });
  c.clearTones().subs(caps.map(() => ''));
  let lo = lo0;
  let hi = hi0;
  let k = 0;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const t = trips(mid);
    const ok = t <= D;
    c.clearTones().noPtr();
    caps.forEach((x, i) => { if (x < lo || x > hi) c.tone(i, 'out'); });
    c.tone(mid - lo0, ok ? 'ok' : 'bad').ptrs({ lo: lo - lo0, mid: mid - lo0, hi: hi - lo0 });
    c.sub(mid - lo0, `${t} days`);
    v.line(3, 4).eq(`feasible(${mid}): ${t} day${t === 1 ? '' : 's'} ${ok ? `≤ ${D} ✓ → hi = ${mid}` : `> ${D} ✗ → lo = ${mid + 1}`}`, ok ? 'ok' : 'bad');
    if (k === 0) v.say(`Try the middle capacity, ${words(mid)}. Simulating the truck, loading boxes until the next one does not fit, takes ${words(t)} days. ${ok ? `That works, so the answer is ${words(mid)} or smaller.` : `Too many, so the answer is bigger than ${words(mid)}.`}`);
    else v.hold(900);
    k++;
    if (ok) hi = mid;
    else lo = mid + 1;
  }
  c.clearTones().noPtr().ptr('answer', lo - lo0).tone(lo - lo0, 'ok');
  v.line(5).eq(`smallest capacity = ${lo}`, 'ok').say(`The first capacity that works is ${words(lo)}. Each check costs one pass over the boxes, n, and we do log of the range many checks. So n log of the range, instead of trying every capacity.`);

  v.chapter('recipe', 'The recipe');
  v.clear();
  v.table('t', ['Step', 'Question to ask'], [
    ['1. What is the answer?', 'a number: speed, capacity, days, distance, maximum sum…'],
    ['2. Lowest and highest possible answer', 'bounds that are surely too small / surely enough'],
    ['3. feasible(x)', 'usually a greedy simulation in O(n)'],
    ['4. Monotonic?', 'if x works, does every larger (or smaller) x work?'],
    ['5. Search', 'first x that works (minimise) or last x that works (maximise)'],
  ]);
  v.say('The recipe: identify the answer as a number, bound it, write a feasibility check, usually a greedy simulation, confirm it is monotonic, and binary search. Phrases like “minimise the largest” or “maximise the smallest” are the classic signal.');

  v.chapter('recap', 'Recap');
  v.clear();
  v.text('r', { title: 'Binary search on the answer', lines: ['Search space = possible answers, not array indices', 'feasible(x) must be monotonic', 'Cost = O(check) × log(range)', 'Signals: “minimum capacity / speed / days”, “minimise the maximum”'], shown: 4 });
  v.say('When you can check an answer quickly but cannot compute it directly, binary search the answer.');
  return v.build();
}

const body = String.raw`
## The idea

Some problems ask for the **smallest (or largest) value x** such that something is possible. If you can answer "is x enough?" quickly, and the answer is **monotonic** (no, no, …, no, yes, yes, …), binary search over x itself.

> Real-life picture: tuning an oven. If 180° bakes the cake in time, 200° will too. Try the middle temperature, and halve the range each time.

## Recipe

1. Define the answer as a number \`x\`.
2. Find bounds: \`lo\` surely too small (or the smallest possible), \`hi\` surely enough.
3. Write \`feasible(x)\`, usually a greedy O(n) simulation.
4. Check monotonicity.
5. Binary search the boundary.

\`\`\`python
def first_feasible(lo, hi):
    while lo < hi:
        mid = (lo + hi) // 2
        if feasible(mid):
            hi = mid           # mid works: try smaller
        else:
            lo = mid + 1
    return lo
\`\`\`

\`\`\`java
int lo = LOW, hi = HIGH;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (feasible(mid)) hi = mid; else lo = mid + 1;
}
return lo;
\`\`\`

\`\`\`cpp
long long lo = LOW, hi = HIGH;
while (lo < hi) {
    long long mid = lo + (hi - lo) / 2;
    if (feasible(mid)) hi = mid; else lo = mid + 1;
}
return lo;
\`\`\`

For "maximise the minimum" (last feasible x), flip the template: \`if feasible(mid): lo = mid else: hi = mid − 1\` with \`mid = lo + (hi − lo + 1) / 2\`.

## Typical feasibility checks

| Problem | x | feasible(x) |
|---|---|---|
| Koko eating bananas | speed | Σ ceil(pile / x) ≤ h |
| Ship packages in D days | capacity | greedy loading uses ≤ D days |
| Split array largest sum | max part sum | greedy cut uses ≤ k parts |
| Minimum days for bouquets | day | enough adjacent bloomed flowers |
| Smallest divisor | divisor | Σ ceil(a / x) ≤ threshold |

## Complexity

O(cost of feasible × log(hi − lo)). With an O(n) check and a range up to 10⁹, that is about 30 passes.

## Pitfalls

- Wrong bounds: capacity must start at \`max(weights)\`, not 1 (a box larger than the capacity can never ship).
- Overflow in sums inside \`feasible\`: use 64-bit.
- Ceil division without floats: \`(a + x − 1) / x\`.
`;

const lesson: Lesson = {
  slug: 'binary-search-on-answer',
  video,
  body,
  quiz: [
    { q: 'What must be true of feasible(x) to binary search on x?', options: ['It is O(1)', 'It is monotonic: once true, it stays true (or vice versa)', 'x is an index', 'The input is sorted'], answer: 1, why: 'Monotonicity gives the single boundary that binary search finds.' },
    { q: 'Ship packages: why is the lower bound max(weights)?', options: ['Convention', 'A capacity below the heaviest box can never ship it', 'For speed', 'It is the answer'], answer: 1, why: 'Every box must fit in one day’s load.' },
    { q: 'Cost with an O(n) check over answers in [1, 10⁹]?', options: ['O(n · 10⁹)', 'O(n log 10⁹) ≈ 30n', 'O(log n)', 'O(n²)'], answer: 1, why: 'About 30 checks of O(n) each.' },
    { q: 'Integer ceil(a / b) without floating point:', options: ['a / b + 1', '(a + b − 1) / b', '(a − 1) / b', 'a % b'], answer: 1, why: 'Adds just enough to round up when there is a remainder.' },
  ],
};

export default lesson;
