import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';

const A = [4, 2, 12, 3, 8, 5, 1, 7];
const K = 3;

function video() {
  const v = new Video('monotonic-queue', 'Monotonic deque');
  v.chapter('intro', 'The maximum of every window');
  const a0 = v.array('a', A, { label: `window size k = ${K}` });
  a0.win(0, K - 1, 'win', `max ${Math.max(...A.slice(0, K))}`);
  v.say(`Slide a window of size ${words(K)} across the array and report the maximum of each window. A plain sliding window keeps a running sum easily, but a running maximum is harder: when the maximum leaves the window, what is the next one?`);
  v.eq('rescanning every window: O(n · k)', 'warn').say('Rescanning each window costs k per step, n times k overall. A heap gets n log n. A monotonic deque gets linear time.');

  v.chapter('insight', 'Some elements can never be the answer');
  v.clear();
  const a1 = v.array('a', A, { label: 'nums' });
  a1.win(0, 2, 'win').tone(1, 'dim').tone(2, 'ok');
  v.eq('12 arrived after 4 and 2 → they are useless forever', 'bad');
  v.say('Look at twelve. It arrived after four and two, it is larger, and it will stay in the window longer than both of them. So four and two can never again be the maximum of any window. We can throw them away the moment twelve arrives.');
  v.text('rule', { title: 'What we keep', lines: ['Only candidates: elements with no larger element after them in the window', 'They are in decreasing order from front to back', 'The front is the current maximum'], shown: 3 });
  v.say('What remains is a list of candidates in decreasing order. The front is the maximum of the window. When a new element arrives, it removes smaller candidates from the back. When the front gets too old, it leaves from the front. That needs a double-ended queue: a deque.');

  v.chapter('run', 'Walkthrough', { code: ['for i in 0..n−1:', '  if dq.front ≤ i − k: pop front', '  while a[dq.back] ≤ a[i]: pop back', '  push back i', '  if i ≥ k − 1: answer.append(a[dq.front])'] });
  v.clear();
  const a = v.array('a', A, { label: 'nums' });
  const out = v.array('out', Array(A.length - K + 1).fill(null), { label: 'window maximums' });
  const q = v.queue('dq', [], { label: 'deque of indices (values decreasing)', ends: ['front = max', 'back'] });
  const dq: number[] = [];
  const told = { old: false, back: false, ans: false };
  v.say('Store indices in the deque, so we can tell when the front has left the window.');
  A.forEach((x, i) => {
    a.clearTones().noWin().win(Math.max(0, i - K + 1), i, 'win').tone(i, 'active');
    if (dq.length && dq[0] <= i - K) {
      const j = dq.shift()!;
      q.shift();
      a.tone(j, 'dim');
      v.line(1).eq(`index ${j} (${A[j]}) is outside the window → pop front`, 'warn');
      if (!told.old) { v.say(`Index ${words(j)} has slid out of the window, so its value, ${words(A[j])}, leaves from the front. It was the maximum, and the next candidate behind it takes over.`); told.old = true; } else v.hold(700);
    }
    while (dq.length && A[dq[dq.length - 1]] <= x) {
      const j = dq.pop()!;
      q.pop();
      a.tone(j, 'bad');
      v.line(2).eq(`${A[j]} ≤ ${x} → ${A[j]} can never be a maximum again, pop back`, 'bad');
      if (!told.back) { v.say(`${words(x)} arrives. ${words(A[j])} is smaller and older, so it is useless: pop it from the back.`); told.back = true; } else v.hold(650);
    }
    dq.push(i);
    q.push(`${i}:${x}`);
    v.line(3).eq(`push index ${i} (${x})`).hold(450);
    if (i >= K - 1) {
      out.set(i - K + 1, A[dq[0]]).tone(i - K + 1, 'ok');
      a.tone(dq[0], 'ok');
      q.tone(0, 'ok');
      v.line(4).eq(`window [${i - K + 1}..${i}] → max = ${A[dq[0]]} (front)`, 'ok');
      if (!told.ans) { v.say(`The first full window is ready. Its maximum is simply the front of the deque, ${words(A[dq[0]])}.`); told.ans = true; } else v.hold(700);
      q.clearTones();
    }
  });
  a.clearTones().noWin();
  v.eq('each index pushed once, popped at most once → O(n) time, O(k) space', 'ok').say('Every index enters the deque once and leaves at most once, from one end or the other. So the whole scan is linear, and the deque never holds more than k indices.');

  v.chapter('variants', 'Variants');
  v.clear();
  v.table('t', ['Need', 'Deque keeps', 'Example'], [
    ['window maximum', 'decreasing values', 'Sliding window maximum'],
    ['window minimum', 'increasing values', 'min of every window'],
    ['max and min together', 'two deques', 'Longest subarray with |diff| ≤ limit'],
    ['best earlier prefix', 'increasing prefix sums', 'Shortest subarray with sum ≥ K'],
    ['best dp value in a range', 'decreasing dp values', 'Jump Game VI, Constrained Subsequence Sum'],
  ]);
  v.say('Flip the comparison for window minimums. Keep two deques when you need the maximum and the minimum at the same time. And the same trick speeds up dynamic programming whenever each state takes the best value from a sliding range of earlier states.');
  return v.build();
}

const body = String.raw`
## The idea

A **monotonic deque** holds the indices of the only elements that can still be the answer for the current window, in sorted order of value.

For a window **maximum**: when a new value arrives, every older value that is **smaller or equal** is useless forever: it will leave the window earlier and it is not bigger. Pop those from the **back**. When the index at the **front** falls out of the window, pop it from the **front**. The front is always the window maximum.

> Real-life picture: a job queue where only the strongest candidates stay. A strong new applicant makes weaker applicants who applied earlier irrelevant, and the oldest applicant retires when their term ends.

## Sliding window maximum

\`\`\`java
Deque<Integer> dq = new ArrayDeque<>();            // indices, values decreasing
for (int i = 0; i < n; i++) {
    if (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();   // too old
    while (!dq.isEmpty() && a[dq.peekLast()] <= a[i]) dq.pollLast(); // useless
    dq.offerLast(i);
    if (i >= k - 1) out[i - k + 1] = a[dq.peekFirst()];
}
\`\`\`

\`\`\`python
dq = deque()                                       # indices, values decreasing
for i, x in enumerate(a):
    if dq and dq[0] <= i - k:
        dq.popleft()                               # too old
    while dq and a[dq[-1]] <= x:
        dq.pop()                                   # useless
    dq.append(i)
    if i >= k - 1:
        out.append(a[dq[0]])
\`\`\`

\`\`\`cpp
deque<int> dq;                                     // indices, values decreasing
for (int i = 0; i < n; i++) {
    if (!dq.empty() && dq.front() <= i - k) dq.pop_front();       // too old
    while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();    // useless
    dq.push_back(i);
    if (i >= k - 1) out.push_back(a[dq.front()]);
}
\`\`\`

## Why O(n)

Each index is pushed once and popped at most once (from either end). The deque holds at most **k** indices.

## Monotonic stack vs monotonic deque

| | Stack | Deque |
|---|---|---|
| removes from | top only | both ends |
| answers | next / previous greater or smaller | best value in a **moving window** |
| typical | daily temperatures, histogram | window max/min, DP over a sliding range |

## Where it shows up

- **Window min / max** of fixed or variable windows.
- **Two deques** (max and min) for "longest window whose max − min ≤ limit".
- **Prefix sums + increasing deque** for "shortest subarray with sum ≥ K" when numbers can be negative (a plain sliding window fails there).
- **DP optimisation:** \`dp[i] = a[i] + max(dp[i−k..i−1])\` becomes O(n).

## Pitfalls

- Store **indices**, not values: you need them to expire the front.
- Choose \`<=\` vs \`<\` on purpose; with \`<=\` equal values keep only the newest index, which stays longest.
`;

const lesson: Lesson = {
  slug: 'monotonic-queue',
  video,
  body,
  quiz: [
    { q: 'For a window maximum, which values does the deque drop from the back when x arrives?', options: ['values ≥ x', 'values ≤ x', 'the oldest value', 'nothing'], answer: 1, why: 'Smaller, older values can never be a maximum again.' },
    { q: 'Where is the current window maximum?', options: ['back of the deque', 'front of the deque', 'middle', 'must scan the deque'], answer: 1, why: 'Values decrease from front to back.' },
    { q: 'Why does the deque store indices?', options: ['to save memory', 'to know when the front leaves the window', 'values may repeat', 'it is required by Java'], answer: 1, why: 'The front is removed once its index ≤ i − k.' },
    { q: 'Time complexity of sliding window maximum with a deque?', options: ['O(n log k)', 'O(n · k)', 'O(n)', 'O(k)'], answer: 2, why: 'Each index enters and leaves once.' },
  ],
};

export default lesson;
