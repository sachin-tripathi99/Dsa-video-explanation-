import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';
import { bsShow } from '../../bsviz';

const A = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];

function video() {
  const v = new Video('binary-search', 'Binary search');
  v.chapter('intro', 'Halve the problem every step');
  v.text('i', { title: 'Guess a number between 1 and 100', lines: ['Guess 50 → “higher” → 51..100', 'Guess 75 → “lower” → 51..74', 'Every guess throws away half of what is left', 'At most 7 guesses: log₂ 100 ≈ 6.6'], shown: 4 });
  v.say('You have played this game: guess a number between one and a hundred, and I say higher or lower. The smart guess is always the middle, because whatever the answer, half the possibilities disappear. After seven guesses at most, you know the number. That is binary search, and it needs one thing: an order that tells you which half to throw away.');

  v.chapter('exact', 'Exact search in a sorted array', { code: ['lo, hi = 0, n − 1', 'while lo <= hi:', '  mid = lo + (hi − lo) / 2', '  if a[mid] == target: return mid', '  if a[mid] < target: lo = mid + 1', '  else: hi = mid − 1', 'return −1'] });
  v.clear();
  const a = v.array('a', A, { label: 'sorted · target = 23' });
  let lo = 0;
  let hi = A.length - 1;
  let step = 0;
  bsShow(a, lo, hi);
  v.line(0).say('Keep a range, lo to hi, that must contain the target if it exists. Look at the middle.');
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const x = A[mid];
    bsShow(a, lo, hi, mid, x === 23 ? 'ok' : 'cmp');
    step++;
    v.counter(`checks: ${step}`);
    if (x === 23) { v.line(3).eq(`a[${mid}] = ${x} ✓`, 'ok').say(`The middle is ${words(x)}. Found it in ${words(step)} checks.`); break; }
    if (x < 23) {
      v.line(2, 4).eq(`a[${mid}] = ${x} < 23 → answer is right of mid: lo = ${mid + 1}`);
      v.say(step === 1 ? `The middle value is ${words(x)}, smaller than twenty-three. Since the array is sorted, everything to the left of mid is smaller too. Throw that half away: lo becomes mid plus one.` : `${words(x)} is too small. Move lo past it.`);
      lo = mid + 1;
    } else {
      v.line(2, 5).eq(`a[${mid}] = ${x} > 23 → answer is left of mid: hi = ${mid - 1}`);
      v.say(`${words(x)} is too big, so everything from mid rightwards is too big. hi becomes mid minus one.`);
      hi = mid - 1;
    }
  }
  a.noPtr();
  v.eq('mid = lo + (hi − lo) / 2 · (lo + hi) / 2 can overflow', 'warn');
  v.say('A detail: compute mid as lo plus half the distance, not lo plus hi over two. With huge indices, lo plus hi can overflow a thirty-two bit integer.');

  v.chapter('boundary', 'The most useful form: first index where a condition becomes true', { code: ['lo, hi = 0, n          # answer is in [lo, hi]', 'while lo < hi:', '  mid = lo + (hi − lo) / 2', '  if ok(mid): hi = mid     # mid might be the answer', '  else: lo = mid + 1', 'return lo'] });
  v.clear();
  const B = [1, 3, 3, 5, 5, 5, 8, 9];
  const T = 5;
  const b = v.array('a', B, { label: `first index with a[i] ≥ ${T} (lower bound)` });
  b.subs(B.map((x) => (x >= T ? 'T' : 'F')));
  v.say(`Most binary search problems are not “find this exact value”. They are “find the first position where some condition becomes true”. Here the condition is a of i at least ${words(T)}. Written as false or true under each cell, it reads false, false, false, then true from some point on. Binary search finds that switch point.`);
  lo = 0;
  hi = B.length;
  let first = true;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const okm = B[mid] >= T;
    bsShow(b, lo, Math.min(hi, B.length - 1), mid, okm ? 'ok' : 'bad');
    v.line(3, 4).eq(`mid ${mid}: a[mid] = ${B[mid]} ${okm ? `≥ ${T} → hi = ${mid}` : `< ${T} → lo = ${mid + 1}`}`);
    if (first) v.say(`At mid ${words(mid)}, the condition is ${okm ? 'true' : 'false'}. ${okm ? 'Mid could be the first true position, so keep it: hi becomes mid, not mid minus one.' : 'So the first true position is to the right: lo becomes mid plus one.'}`);
    else v.hold(800);
    first = false;
    if (okm) hi = mid;
    else lo = mid + 1;
  }
  bsShow(b, lo, lo, lo, 'ok');
  v.line(5).eq(`lo = hi = ${lo}: first index with a[i] ≥ ${T}`, 'ok').say(`When lo meets hi, that is the answer: index ${words(lo)}. This one template gives lower bound, upper bound, first and last occurrence, square roots, and every “binary search on the answer” problem you will meet next.`);
  b.noPtr();

  v.chapter('rotated', 'Partly sorted: rotated arrays');
  v.clear();
  const RA = [15, 18, 22, 3, 6, 9, 12];
  const ra = v.array('a', RA, { label: 'sorted, then rotated' });
  ra.toneRange(0, 2, 'cmp').toneRange(3, 6, 'active');
  v.eq('one half around mid is always sorted: check it, then decide').say('A sorted array that was rotated is not sorted, but it is two sorted runs. Around any mid, at least one of the two halves is fully sorted, and a sorted half tells you in one comparison whether the target can be inside it. That is enough to keep halving.');

  v.chapter('recap', 'Checklist');
  v.clear();
  v.table('r', ['Question', 'Template'], [
    ['Is target present? Where?', 'lo <= hi, return inside the loop'],
    ['First index where condition is true', 'lo < hi, hi = mid / lo = mid + 1'],
    ['Last index where condition is true', 'first index where it is false, minus one'],
    ['Minimum value x that works', 'binary search on the answer (next module)'],
    ['Rotated / bitonic arrays', 'decide which half is sorted, then discard'],
  ]);
  v.say('Two templates cover almost everything: the exact search with lo less than or equal to hi, and the boundary search with lo less than hi. The requirement is always the same: a monotonic yes or no that splits the range in two.');
  return v.build();
}

const body = String.raw`
## The idea

When the search space is **ordered** so that one comparison tells you which half cannot contain the answer, check the middle and discard half. n → n/2 → n/4 … → 1 takes **log₂ n** steps: 30 steps for a billion elements.

> Real-life picture: finding a word in a paper dictionary. Open in the middle, see if your word is before or after, and never look at the other half again.

## Template 1: exact match

\`\`\`java
int lo = 0, hi = n - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;          // no overflow
    if (a[mid] == target) return mid;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid - 1;
}
return -1;
\`\`\`

\`\`\`python
lo, hi = 0, len(a) - 1
while lo <= hi:
    mid = (lo + hi) // 2                   # Python ints don't overflow
    if a[mid] == target:
        return mid
    if a[mid] < target:
        lo = mid + 1
    else:
        hi = mid - 1
return -1
\`\`\`

\`\`\`cpp
int lo = 0, hi = n - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;          // no overflow
    if (a[mid] == target) return mid;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid - 1;
}
return -1;
\`\`\`

## Template 2: first index where \`ok(i)\` is true

The condition must be **monotonic**: false … false true … true.

\`\`\`python
lo, hi = 0, n                  # n means "nowhere"
while lo < hi:
    mid = (lo + hi) // 2
    if ok(mid):
        hi = mid               # mid may be the answer: keep it
    else:
        lo = mid + 1
return lo
\`\`\`

\`\`\`java
int lo = 0, hi = n;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (ok(mid)) hi = mid; else lo = mid + 1;
}
return lo;
\`\`\`

\`\`\`cpp
int lo = 0, hi = n;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (ok(mid)) hi = mid; else lo = mid + 1;
}
return lo;
\`\`\`

| Want | ok(i) |
|---|---|
| lower bound (first ≥ x) | \`a[i] >= x\` |
| upper bound (first > x) | \`a[i] > x\` |
| last occurrence of x | upper bound − 1 |
| insertion position | lower bound |

Library versions: Java \`Arrays.binarySearch\` (any match), Python \`bisect_left / bisect_right\`, C++ \`lower_bound / upper_bound\`.

## Rotated sorted arrays

At least one half around \`mid\` is sorted. If \`a[lo] <= a[mid]\` the left half is sorted: check whether the target lies in \`[a[lo], a[mid])\`; otherwise the right half is sorted. Discard accordingly.

## Pitfalls

- **Infinite loops** with \`lo < hi\` and \`lo = mid\`: when you need \`lo = mid\`, round mid up: \`mid = lo + (hi − lo + 1) / 2\`.
- Mixing templates: \`lo <= hi\` goes with \`hi = mid − 1\`; \`lo < hi\` goes with \`hi = mid\`.
- Overflow of \`lo + hi\` in Java/C++.
`;

const lesson: Lesson = {
  slug: 'binary-search',
  video,
  body,
  quiz: [
    { q: 'How many steps does binary search need for 1,000,000 elements?', options: ['about 1,000', 'about 20', 'about 100', 'about 500,000'], answer: 1, why: '2²⁰ ≈ 1,048,576.' },
    { q: 'In the “first true” template, why hi = mid instead of mid − 1?', options: ['Style', 'mid itself might be the first true index', 'To avoid overflow', 'It is a bug'], answer: 1, why: 'When ok(mid) is true, mid is still a candidate.' },
    { q: 'Why write mid = lo + (hi − lo) / 2?', options: ['Faster', 'lo + hi may overflow a 32-bit int', 'Rounds up', 'Required by Python'], answer: 1, why: 'For indices near 2³¹, lo + hi exceeds the int range.' },
    { q: 'What property does binary search need?', options: ['Distinct values', 'A monotonic yes/no split of the search space', 'Even length', 'Positive numbers'], answer: 1, why: 'Each check must tell you which half can be discarded.' },
  ],
};

export default lesson;
