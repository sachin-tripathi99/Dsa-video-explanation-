import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';

const A = [2, 1, 5, 1, 3, 2, 6, 1];
const K = 3;
const S = 'abcabcbb';

function video() {
  const v = new Video('sliding-window', 'Sliding window');
  v.chapter('intro', 'A window over a contiguous range');
  v.text('i', { title: 'When the question is about a contiguous subarray or substring', lines: ['“maximum sum of k consecutive…”', '“longest substring with…”', '“shortest subarray whose sum ≥ …”', 'Keep a window [l, r] and update it as it slides instead of recomputing'], shown: 4 });
  v.say('Many problems ask about a contiguous piece of an array or string: the best sum of k consecutive numbers, the longest substring with some property, the shortest subarray reaching a target. The sliding window keeps one range, from l to r, and updates its summary as the range moves, instead of recomputing from scratch.');

  v.chapter('fixed', 'Fixed size: add the new, remove the old', { code: ['sum = a[0] + … + a[k−1]', 'for r in k..n−1:', '  sum += a[r] − a[r − k]   # one in, one out', '  best = max(best, sum)'] });
  v.clear();
  const a = v.array('a', A, { label: `maximum sum of ${K} consecutive numbers` });
  let sum = A.slice(0, K).reduce((x, y) => x + y, 0);
  let best = sum;
  a.win(0, K - 1, 'win', `sum ${sum}`);
  v.line(0).counter(`best: ${best}`).say(`Find the largest sum of three consecutive numbers. Adding up every group of three from scratch costs k work per position. Instead, compute the first window once: ${words(sum)}.`);
  for (let r = K; r < A.length; r++) {
    sum += A[r] - A[r - K];
    best = Math.max(best, sum);
    a.clearTones().tone(r, 'ok').tone(r - K, 'bad').win(r - K + 1, r, 'win', `sum ${sum}`);
    v.line(2, 3).counter(`best: ${best}`).eq(`+${A[r]} −${A[r - K]} → ${sum}`);
    if (r === K) v.say(`Slide one step: ${words(A[r])} enters on the right, ${words(A[r - K])} leaves on the left. The new sum is the old sum plus ${words(A[r])} minus ${words(A[r - K])}: ${words(sum)}. Two operations, whatever k is.`);
    else v.hold(650);
  }
  a.clearTones().noWin();
  v.eq(`best = ${best} · O(n) instead of O(n · k)`, 'ok').say(`Every slide costs constant time, so the whole scan is linear. The best sum is ${words(best)}.`);

  v.chapter('variable', 'Variable size: grow right, shrink left while invalid', { code: ['l = 0', 'for r in 0..n−1:', '  add s[r] to the window', '  while the window is invalid: remove s[l]; l += 1', '  best = max(best, r − l + 1)'] });
  v.clear();
  const b = v.array('s', S.split(''), { label: 'longest substring without repeating characters' });
  const set = v.map('set', { set: true, label: 'characters in the window' });
  let l = 0;
  let bl = 0;
  const inWin = new Set<string>();
  v.say('Most window problems have no fixed size. Then the rule is: always grow the window to the right. If adding a character breaks the rule, here a repeated letter, shrink from the left until the window is valid again.');
  let told = 0;
  for (let r = 0; r < S.length; r++) {
    const c = S[r];
    if (inWin.has(c)) {
      b.clearTones().tone(r, 'bad').win(l, r - 1, 'win');
      v.line(3).eq(`'${c}' already in the window → shrink`, 'bad');
      if (told === 0) { v.say(`Now r reaches a second ${c}. The window would contain ${c} twice, so it is invalid. Shrink from the left until the old ${c} is gone.`); told = 1; }
      else v.hold(500);
      while (inWin.has(c)) {
        inWin.delete(S[l]);
        set.del(S[l]);
        l++;
        b.win(l, r - 1, 'win');
        v.hold(400);
      }
    }
    inWin.add(c);
    set.put(c);
    bl = Math.max(bl, r - l + 1);
    b.clearTones().tone(r, 'ok').win(l, r, 'win', `len ${r - l + 1}`);
    v.line(2, 4).counter(`best: ${bl}`).eq(`window "${S.slice(l, r + 1)}"`);
    if (r === 0) v.say('The window starts empty. Add a.');
    else v.hold(500);
  }
  b.clearTones().noWin();
  v.eq(`best = ${bl} · each character enters once and leaves at most once → O(n)`, 'ok').say(`The longest valid window had length ${words(bl)}. And although there is a loop inside a loop, l only ever moves forward. Each character enters the window once and leaves at most once, so the total work is linear.`);

  v.chapter('shape', 'The two templates');
  v.clear();
  v.table('t', ['Question', 'Window rule', 'Answer updated'], [
    ['Longest window that is valid', 'grow r; shrink l while invalid', 'after shrinking (window is valid)'],
    ['Shortest window that is valid', 'grow r; while valid: record, then shrink l', 'inside the shrink loop'],
    ['Exactly k-sized windows', 'add a[r], drop a[r − k]', 'every step once r ≥ k − 1'],
  ]);
  v.say('There are only three shapes. Longest: shrink while invalid, then record. Shortest: while the window is valid, record it and try to shrink further. Fixed size: one in, one out. The state you keep inside the window, a sum, a set, or a count per character, changes from problem to problem.');

  v.chapter('recap', 'When it works');
  v.clear();
  v.text('r', { title: 'Sliding window checklist', lines: ['Contiguous subarray / substring', 'Validity changes monotonically: growing can only break it, shrinking can only fix it', 'Window state updatable in O(1) per add / remove (sum, counts, set)', 'Negative numbers break “sum ≥ target” windows → use prefix sums instead'], shown: 4 });
  v.say('The window works when the answer is contiguous, and when growing can only make things worse and shrinking can only make them better. With negative numbers, a sum can go up or down either way, so the window breaks, and prefix sums take over. That is the next module.');
  return v.build();
}

const body = String.raw`
## The idea

For questions about a **contiguous** subarray or substring, keep a window \`[l, r]\` and a small summary of it (a sum, a set, character counts). Move \`r\` forward to add elements and \`l\` forward to remove them, updating the summary in O(1). Both pointers only move forward, so the total work is **O(n)**.

> Real-life picture: a train window. As the train moves, one new tree appears on the right and one old tree disappears on the left; you never re-look at the whole view.

## Template 1: fixed size k

\`\`\`java
int sum = 0, best = Integer.MIN_VALUE;
for (int r = 0; r < n; r++) {
    sum += a[r];                     // one in
    if (r >= k) sum -= a[r - k];     // one out
    if (r >= k - 1) best = Math.max(best, sum);
}
\`\`\`

\`\`\`python
s, best = 0, float("-inf")
for r, x in enumerate(a):
    s += x                           # one in
    if r >= k:
        s -= a[r - k]                # one out
    if r >= k - 1:
        best = max(best, s)
\`\`\`

\`\`\`cpp
long long sum = 0, best = LLONG_MIN;
for (int r = 0; r < n; r++) {
    sum += a[r];                     // one in
    if (r >= k) sum -= a[r - k];     // one out
    if (r >= k - 1) best = max(best, sum);
}
\`\`\`

## Template 2: longest valid window

\`\`\`python
l = 0
for r in range(n):
    add(a[r])
    while not valid():
        remove(a[l])
        l += 1
    best = max(best, r - l + 1)      # window is valid here
\`\`\`

\`\`\`java
int l = 0;
for (int r = 0; r < n; r++) {
    add(a[r]);
    while (!valid()) remove(a[l++]);
    best = Math.max(best, r - l + 1);
}
\`\`\`

\`\`\`cpp
int l = 0;
for (int r = 0; r < n; r++) {
    add(a[r]);
    while (!valid()) remove(a[l++]);
    best = max(best, r - l + 1);
}
\`\`\`

## Template 3: shortest valid window

\`\`\`python
l = 0
for r in range(n):
    add(a[r])
    while valid():
        best = min(best, r - l + 1)  # record, then try to shrink
        remove(a[l])
        l += 1
\`\`\`

\`\`\`java
int l = 0;
for (int r = 0; r < n; r++) {
    add(a[r]);
    while (valid()) {
        best = Math.min(best, r - l + 1);
        remove(a[l++]);
    }
}
\`\`\`

\`\`\`cpp
int l = 0;
for (int r = 0; r < n; r++) {
    add(a[r]);
    while (valid()) {
        best = min(best, r - l + 1);
        remove(a[l++]);
    }
}
\`\`\`

## Why it is O(n)

The inner \`while\` looks like a nested loop, but \`l\` never moves backward and never passes \`r\`. Across the whole run, \`l\` moves at most n times, so the total work is at most 2n steps.

## When the window does NOT work

The window needs **monotonic validity**: extending can only break the condition, shrinking can only restore it. "Subarray sum equals k" with negative numbers breaks this (adding a negative number can fix a too-large sum), so use **prefix sums + hash map** instead.

## Common window states

| Problem type | State | Valid when |
|---|---|---|
| No repeated characters | set or last-index map | no duplicates |
| At most k distinct | count map + distinct counter | distinct ≤ k |
| Replace ≤ k characters | counts + max frequency | len − maxFreq ≤ k |
| Anagram / permutation | 26 counts + "matched" counter | counts equal |
| Sum ≥ target (positives) | running sum | sum ≥ target |
`;

const lesson: Lesson = {
  slug: 'sliding-window',
  video,
  body,
  quiz: [
    { q: 'Why is the variable-size window O(n) despite the inner while loop?', options: ['The inner loop runs once', 'l only moves forward, at most n times in total', 'Hashing is O(1)', 'It is actually O(n²)'], answer: 1, why: 'Each element is added once and removed at most once.' },
    { q: 'Where do you update the answer in a “shortest valid window” problem?', options: ['Before adding a[r]', 'Inside the while-valid loop, before shrinking', 'Only at the end', 'Never'], answer: 1, why: 'Every valid window is a candidate, and shrinking might find a shorter one.' },
    { q: '“Count subarrays with sum exactly k”, values may be negative. Sliding window?', options: ['Yes', 'No: validity is not monotonic; use prefix sums + hash map'], answer: 1, why: 'With negatives, growing a window can increase or decrease the sum.' },
    { q: 'Fixed window of size k: moving one step costs…', options: ['O(k)', 'O(1): add the new element, subtract the old', 'O(log k)', 'O(n)'], answer: 1, why: 'Only two elements change.' },
  ],
};

export default lesson;
