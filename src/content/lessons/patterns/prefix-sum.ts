import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';

const A = [3, 1, 4, 1, 5, 9, 2];

function video() {
  const v = new Video('prefix-sum', 'Prefix sums');
  v.chapter('intro', 'Many range questions, one precomputation');
  v.text('i', { title: 'Answer “sum of a[l..r]” in O(1)', lines: ['Summing a range directly costs O(length)', 'With q queries that is O(n · q)', 'Precompute running totals once, then every range sum is one subtraction'], shown: 3 });
  v.say('Suppose you must answer many questions of the form: what is the sum from index l to index r? Adding them up each time costs up to n per question. Prefix sums pay once, up front, and then answer every question with a single subtraction.');

  v.chapter('build', 'Building the prefix array', { code: ['P[0] = 0', 'for i in 0..n−1:', '  P[i + 1] = P[i] + a[i]   # sum of the first i + 1 elements'] });
  v.clear();
  const a = v.array('a', A, { label: 'a' });
  const P = [0];
  const p = v.array('P', [0, ...A.map(() => null)], { label: 'P[i] = sum of the first i elements' });
  p.tone(0, 'ok');
  v.line(0).say('P of i is the sum of the first i elements. P of zero is zero, the sum of nothing. That extra leading zero removes every special case later.');
  A.forEach((x, i) => {
    P.push(P[i] + x);
    a.clearTones().tone(i, 'active');
    p.set(i + 1, P[i + 1]).clearTones().tone(i + 1, 'ok').tone(i, 'cmp');
    v.line(2).eq(`P[${i + 1}] = P[${i}] + a[${i}] = ${P[i]} + ${x} = ${P[i + 1]}`);
    if (i === 0) v.say('Each entry is the previous total plus the next element. One pass.');
    else v.hold(450);
  });
  a.clearTones();
  p.clearTones();

  v.chapter('query', 'Any range sum in O(1)', { code: ['sum(a[l..r]) = P[r + 1] − P[l]'] });
  const l = 2;
  const r = 5;
  a.win(l, r, 'win', `sum ${A.slice(l, r + 1).reduce((x, y) => x + y, 0)}`);
  p.tone(r + 1, 'ok').tone(l, 'bad');
  v.line(0).eq(`sum(a[${l}..${r}]) = P[${r + 1}] − P[${l}] = ${P[r + 1]} − ${P[l]} = ${P[r + 1] - P[l]}`, 'ok');
  v.say(`To get the sum from index ${words(l)} to ${words(r)}, take everything up to ${words(r)}, that is P of ${words(r + 1)}, ${words(P[r + 1])}, and subtract everything before ${words(l)}, P of ${words(l)}, ${words(P[l])}. The answer is ${words(P[r + 1] - P[l])}. One subtraction, no matter how long the range.`);
  a.noWin();
  p.clearTones();

  v.chapter('hash', 'Prefix sums + hash map: count subarrays with sum k', { code: ['count = {0: 1}; run = 0', 'for x in a:', '  run += x', '  answer += count[run − k]    # earlier prefixes that leave exactly k', '  count[run] += 1'] });
  v.clear();
  const B = [1, 2, 1, -1, 2];
  const K = 3;
  const b = v.array('a', B, { label: `count subarrays with sum ${K} (negatives allowed)` });
  const m = v.map('cnt', { label: 'prefix sum → how many times seen' });
  m.put(0, 1);
  let run = 0;
  let ans = 0;
  const cnt = new Map<number, number>([[0, 1]]);
  v.say(`Now a harder question: how many subarrays sum to exactly ${K}? Negative numbers are allowed, so a sliding window does not work. But a subarray from i to j sums to k exactly when P of j plus one minus P of i equals k. So at each position, ask: how many earlier prefix sums equal the current running sum minus k? A hash map of prefix-sum counts answers that instantly.`);
  const seenAt = new Map<number, number[]>([[0, [-1]]]);   // prefix value → indices where it ended
  let told = 0;
  B.forEach((x, i) => {
    run += x;
    const got = cnt.get(run - K) ?? 0;
    ans += got;
    b.clearTones().tone(i, 'active');
    m.clearTones();
    if (got) m.tone(run - K, 'ok');
    v.line(2, 3).counter(`answer: ${ans}`).eq(`run = ${run} · look up ${run} − ${K} = ${run - K} → ${got}`, got ? 'ok' : undefined);
    if (got) {
      const subs = (seenAt.get(run - K) ?? []).map((p) => B.slice(p + 1, i + 1));
      (seenAt.get(run - K) ?? []).forEach((p) => b.toneRange(p + 1, i, 'ok'));
      const desc = subs.map((sa) => sa.map((y) => (y < 0 ? `minus ${words(-y)}` : words(y))).join(', ')).join('; and ');
      if (told === 0) v.say(`The running sum is ${words(run)}. ${words(run)} minus ${words(K)} is ${words(run - K)}, and a prefix of ${words(run - K)} was seen ${got === 1 ? 'once' : `${words(got)} times`}. So ${got === 1 ? 'one subarray' : `${words(got)} subarrays`} ending here ${got === 1 ? 'sums' : 'sum'} to ${words(K)}: ${desc}.`);
      else v.say(`Running sum ${words(run)}: look up ${words(run - K)}, found ${got === 1 ? 'once' : `${words(got)} times`}. The subarray ${desc} sums to ${words(K)}.`);
      told++;
    } else v.hold(700);
    cnt.set(run, (cnt.get(run) ?? 0) + 1);
    seenAt.set(run, [...(seenAt.get(run) ?? []), i]);
    m.put(run, cnt.get(run)!).tone(run, 'active');
    v.line(4).hold(350);
  });
  b.clearTones();
  v.eq(`${ans} subarrays · one pass, O(n)`, 'ok').say(`${words(ans)} subarrays in total, found in one pass. This prefix sum plus hash map trick is one of the most useful ideas in interviews.`);

  v.chapter('diff', 'Difference arrays: many range updates', { code: ['d[l] += v; d[r + 1] −= v    # for each update', 'a = prefix sums of d          # once, at the end'] });
  v.clear();
  const n = 7;
  const U: [number, number, number][] = [[1, 3, 2], [2, 5, 3], [0, 1, 1]];
  const d = Array(n + 1).fill(0);
  const dv = v.array('d', [...d], { label: 'difference array d' });
  v.say('The reverse problem: many updates of the form “add v to every element from l to r”, then read the final array. Instead of touching every element, record the change at the start and cancel it just after the end.');
  U.forEach(([ul, ur, val], k) => {
    d[ul] += val;
    d[ur + 1] -= val;
    dv.set(ul, d[ul]).set(ur + 1, d[ur + 1]).clearTones().tone(ul, 'ok').tone(ur + 1, 'bad');
    v.line(0).eq(`add ${val} to [${ul}..${ur}] → d[${ul}] += ${val}, d[${ur + 1}] −= ${val}`);
    if (k === 0) v.say('Add two to indices one through three: plus two at index one, minus two at index four. Two writes, whatever the range length.');
    else v.hold(700);
  });
  const res: number[] = [];
  let acc = 0;
  for (let i = 0; i < n; i++) { acc += d[i]; res.push(acc); }
  dv.clearTones();
  v.array('res', res, { label: 'final array = prefix sums of d' });
  v.line(1).eq(`running total of d → [${res.join(', ')}]`, 'ok').say('At the end, one prefix sum pass over d turns the recorded starts and stops into the final values. q updates and n elements cost q plus n, instead of q times n.');

  v.chapter('recap', 'Recap');
  v.clear();
  v.table('r', ['Need', 'Tool'], [
    ['Many range-sum queries, no updates', 'prefix array: P[r+1] − P[l]'],
    ['Count / find subarrays with sum k (negatives ok)', 'prefix sums + hash map of counts'],
    ['Longest subarray with sum k', 'prefix sums + map of first index'],
    ['Many range updates, read at the end', 'difference array'],
    ['Rectangle sums in a grid', '2D prefix sums (inclusion–exclusion)'],
    ['Updates and queries interleaved', 'Fenwick / segment tree (later)'],
  ]);
  v.say('Prefix sums turn range sums into one subtraction. With a hash map they count subarrays. Their inverse, the difference array, applies range updates. Remember these three and a whole family of problems becomes easy.');
  return v.build();
}

const body = String.raw`
## The idea

Precompute \`P[i]\` = sum of the first \`i\` elements (with \`P[0] = 0\`). Then

$$\text{sum}(a[l..r]) = P[r+1] - P[l]$$

is O(1) per query after O(n) preprocessing.

> Real-life picture: a car's odometer. To know how far you drove between two towns, subtract the odometer readings; you don't re-drive the road.

\`\`\`java
long[] P = new long[n + 1];
for (int i = 0; i < n; i++) P[i + 1] = P[i] + a[i];
long rangeSum(int l, int r) { return P[r + 1] - P[l]; }
\`\`\`

\`\`\`python
P = [0] * (n + 1)
for i, x in enumerate(a):
    P[i + 1] = P[i] + x
def range_sum(l, r):
    return P[r + 1] - P[l]
# or: from itertools import accumulate; P = [0, *accumulate(a)]
\`\`\`

\`\`\`cpp
vector<long long> P(n + 1, 0);
for (int i = 0; i < n; i++) P[i + 1] = P[i] + a[i];
auto rangeSum = [&](int l, int r) { return P[r + 1] - P[l]; };
\`\`\`

## Prefix sums + hash map

A subarray \`a[i..j]\` has sum \`k\` exactly when \`P[j+1] − P[i] = k\`. Scanning left to right with a running sum \`run\`, the number of good subarrays ending here is the number of earlier prefixes equal to \`run − k\`.

\`\`\`python
count = {0: 1}               # the empty prefix
run = ans = 0
for x in a:
    run += x
    ans += count.get(run - k, 0)
    count[run] = count.get(run, 0) + 1
\`\`\`

\`\`\`java
Map<Integer, Integer> count = new HashMap<>();
count.put(0, 1);
int run = 0, ans = 0;
for (int x : a) {
    run += x;
    ans += count.getOrDefault(run - k, 0);
    count.merge(run, 1, Integer::sum);
}
\`\`\`

\`\`\`cpp
unordered_map<int, int> count{{0, 1}};
int run = 0, ans = 0;
for (int x : a) {
    run += x;
    if (auto it = count.find(run - k); it != count.end()) ans += it->second;
    count[run]++;
}
\`\`\`

Variations: store the **first index** of each prefix to get the longest subarray; use \`run % k\` as the key for "divisible by k"; map 0 → −1 and 1 → +1 to balance zeros and ones.

## Difference arrays

To add \`v\` to every element of \`a[l..r]\` many times: \`d[l] += v; d[r+1] -= v\`, then take prefix sums of \`d\` once at the end. O(1) per update, O(n) to materialise.

## 2D prefix sums

\`S[i][j]\` = sum of the rectangle from \`(0,0)\` to \`(i−1, j−1)\`:

- build: \`S[i+1][j+1] = a[i][j] + S[i][j+1] + S[i+1][j] − S[i][j]\`
- query \`(r1,c1)..(r2,c2)\`: \`S[r2+1][c2+1] − S[r1][c2+1] − S[r2+1][c1] + S[r1][c1]\`

## Pitfalls

- Forgetting \`count[0] = 1\` (subarrays that start at index 0).
- Overflow: prefix sums of many ints can exceed 32 bits; use long.
- Negative modulo in "divisible by k": normalise with \`((run % k) + k) % k\` in Java/C++.
`;

const lesson: Lesson = {
  slug: 'prefix-sum',
  video,
  body,
  quiz: [
    { q: 'With P[0] = 0 and P[i+1] = P[i] + a[i], the sum of a[2..5] is…', options: ['P[5] − P[2]', 'P[6] − P[2]', 'P[6] − P[3]', 'P[5] − P[1]'], answer: 1, why: 'P[r+1] − P[l] = P[6] − P[2].' },
    { q: 'Why initialise the hash map with {0: 1} when counting subarrays with sum k?', options: ['To avoid null errors', 'The empty prefix lets subarrays starting at index 0 be counted', 'It makes it faster', 'It is not needed'], answer: 1, why: 'A subarray a[0..j] has sum k when run − 0 = k.' },
    { q: 'You get 10⁵ updates “add v to a[l..r]” and read the array once at the end. Best?', options: ['Update each element: O(q · n)', 'Difference array: O(q + n)', 'Sort the updates', 'Binary search'], answer: 1, why: 'Two writes per update, then one prefix pass.' },
    { q: 'Subarray sum equals k with negative numbers: why not a sliding window?', options: ['It is fine', 'Adding an element can decrease the sum, so shrinking/growing is not monotonic', 'Windows need sorted input', 'Hash maps are faster'], answer: 1, why: 'The window template needs monotonic validity.' },
  ],
};

export default lesson;
