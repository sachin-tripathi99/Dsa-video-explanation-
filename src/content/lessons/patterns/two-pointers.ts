import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';

const A = [1, 3, 4, 6, 9, 11];
const T = 13;

function video() {
  const v = new Video('two-pointers', 'Two pointers');
  v.chapter('intro', 'One pass instead of a nested loop');
  v.text('i', { title: 'The idea', lines: ['A nested loop looks at every pair: about n² / 2 checks', 'Two pointers move through the data together, each only forward', 'Together they take at most about n steps'], shown: 3 });
  v.say('Many array problems ask about pairs: two numbers that add up to something, two ends of a string that should match. A nested loop checks every pair, which is about n squared over two checks. Two pointers is the trick of moving two indexes together, so the whole job takes one pass.');

  v.chapter('ends', 'Type 1: from both ends', { code: ['l, r = 0, n − 1', 'while l < r:', '  swap(a[l], a[r])', '  l += 1; r −= 1'] });
  v.clear();
  const R = ['h', 'e', 'l', 'l', 'o'];
  const rv = v.array('s', [...R], { label: 'reverse in place' });
  rv.ptrs({ l: 0, r: R.length - 1 });
  v.line(0).say('The first shape starts one pointer at each end and walks them toward each other. Reversing a string is the simplest example.');
  for (let l = 0, r = R.length - 1; l < r; l++, r--) {
    rv.swap(l, r).clearTones().tone([l, r], 'ok').ptrs({ l, r });
    v.line(2).eq(`swap a[${l}] and a[${r}]`).hold(750);
    rv.ptrs({ l: l + 1, r: r - 1 });
  }
  rv.clearTones().noPtr();
  v.line(1).eq('pointers met → done in n / 2 swaps', 'ok').say('When the pointers meet in the middle, every character has been swapped exactly once. That is n over two steps and no extra memory.');

  v.chapter('why', 'Why skipping is safe: the pair matrix', { code: ['l, r = 0, n − 1', 'while l < r:', '  s = a[l] + a[r]', '  if s == target: return', '  if s < target: l += 1   # row l is too small', '  else: r −= 1            # column r is too big'] });
  v.clear();
  const arr = v.array('a', A, { label: `sorted · target = ${T}` });
  // Row i = a[i] for i < n − 1, column c = a[c + 1]: only the pairs with i < j.
  const M = A.slice(0, -1).map((x, i) => A.slice(1).map((y, c) => (c + 1 > i ? x + y : null)));
  const gg = v.grid('m', M, { label: 'every pair sum a[i] + a[j] (i < j)', rowHead: A.slice(0, -1).map(String), colHead: A.slice(1).map(String) });
  const g = { tone: (i: number, j: number, t: Parameters<typeof gg.tone>[2]) => gg.tone(i, j - 1, t) };
  v.say(`Here is the classic example: in a sorted array, find two numbers that add up to ${words(T)}. On the right is every possible pair sum. A nested loop checks all fifteen of them.`);
  let l = 0;
  let r = A.length - 1;
  arr.ptrs({ l, r });
  let first = true;
  while (l < r) {
    const s = A[l] + A[r];
    g.tone(l, r, s === T ? 'ok' : 'active');
    arr.clearTones().tone([l, r], s === T ? 'ok' : 'cmp');
    if (s === T) {
      v.line(3).eq(`${A[l]} + ${A[r]} = ${T} ✓`, 'ok').say(`${words(A[l])} plus ${words(A[r])} is ${words(T)}. Found it, after checking only a handful of cells.`);
      break;
    }
    if (s < T) {
      v.line(4).eq(`${A[l]} + ${A[r]} = ${s} < ${T} → every pair with ${A[l]} is too small`, 'bad');
      if (first) v.say(`Start at the two ends: ${words(A[l])} plus ${words(A[r])} is ${words(s)}, too small. Now the key insight. ${words(A[r])} is the largest number, so ${words(A[l])} paired with anything is at most ${words(s)}. The whole row for ${words(A[l])} is useless. Move l right and cross it out.`);
      else v.say(`${words(s)} is too small, so the row for ${words(A[l])} goes. Move l right.`);
      for (let j = l + 1; j <= r; j++) g.tone(l, j, 'dim');
      l++;
    } else {
      v.line(5).eq(`${A[l]} + ${A[r]} = ${s} > ${T} → every pair with ${A[r]} is too big`, 'bad');
      v.say(`${words(s)} is too big. ${words(A[l])} is the smallest number left, so ${words(A[r])} with anything left is at least ${words(s)}. The column for ${words(A[r])} goes. Move r left.`);
      for (let i = l; i < r; i++) g.tone(i, r, 'dim');
      r--;
    }
    first = false;
    arr.ptrs({ l, r });
  }
  v.note('each step removes a whole row or column');
  v.say('Each step throws away an entire row or column of the matrix, never a possible answer. So at most n steps cover all n squared pairs. That argument is why two pointers is correct, and it is worth saying out loud in an interview.');

  v.chapter('same', 'Type 2: same direction (read and write)', { code: ['w = 1', 'for r in 1..n−1:', '  if a[r] != a[w − 1]:', '    a[w] = a[r]; w += 1', 'return w'] });
  v.clear();
  const D = [1, 1, 2, 2, 2, 3, 5, 5];
  const d = v.array('a', [...D], { label: 'remove duplicates from a sorted array, in place' });
  let w = 1;
  d.ptrs({ w: 1, r: 1 }).tone(0, 'ok');
  v.line(0).say('The second shape moves both pointers in the same direction. A read pointer r scans every element; a write pointer w marks where the next kept value goes. Here we keep one copy of each value.');
  const cur = [...D];
  for (let rr = 1; rr < D.length; rr++) {
    const keep = cur[rr] !== cur[w - 1];
    d.ptrs({ w, r: rr }).tone(rr, keep ? 'active' : 'dim');
    if (keep) {
      cur[w] = cur[rr];
      d.set(w, cur[rr]).tone(w, 'ok');
      v.line(3).eq(`a[${rr}] = ${cur[rr]} is new → write at ${w}`, 'ok');
      w++;
    } else v.line(2).eq(`a[${rr}] = ${cur[rr]} repeats → skip`);
    if (rr === 1) v.say('One equals the last kept value, so skip it. The reader moves on, the writer waits.');
    else if (rr === 2) v.say('Two is new, so write it at w and move w forward.');
    else v.hold(600);
  }
  for (let k = w; k < D.length; k++) d.tone(k, 'out');
  d.noPtr();
  v.line(4).eq(`first ${w} slots: ${cur.slice(0, w).join(', ')}`, 'ok').say(`The first ${words(w)} slots now hold every distinct value. One pass, no extra array. The same read and write shape solves move zeroes, remove element, and many filtering problems.`);

  v.chapter('two', 'Type 3: one pointer per array', { code: ['i, j = 0, 0', 'while i < len(a) and j < len(b):', '  take the smaller of a[i], b[j]; advance that pointer'] });
  v.clear();
  const a1 = v.array('a', [1, 4, 7], { label: 'a' });
  const b1 = v.array('b', [2, 3, 8], { label: 'b' });
  const out = v.array('out', [], { label: 'merged' });
  v.say('The third shape keeps one pointer in each of two sorted arrays and always advances the one with the smaller value. This is the merge step of merge sort.');
  const X = [1, 4, 7];
  const Y = [2, 3, 8];
  let i = 0;
  let j = 0;
  while (i < 3 || j < 3) {
    a1.clearTones().ptr('i', i < 3 ? i : null);
    b1.clearTones().ptr('j', j < 3 ? j : null);
    if (j >= 3 || (i < 3 && X[i] <= Y[j])) { a1.tone(i, 'ok'); out.push(X[i]); i++; }
    else { b1.tone(j, 'ok'); out.push(Y[j]); j++; }
    v.line(2).hold(500);
  }
  a1.noPtr();
  b1.noPtr();
  v.eq('each pointer only moves forward → O(n + m)', 'ok').say('Each step moves one pointer forward, so the merge is linear in the total length.');

  v.chapter('recap', 'When to reach for two pointers');
  v.clear();
  v.table('r', ['Signal', 'Shape'], [
    ['Sorted array, find a pair / triplet with a sum', 'both ends, move by comparing to target'],
    ['Palindrome or symmetric check', 'both ends, compare and move inward'],
    ['Filter / compact in place', 'read + write, same direction'],
    ['Two sorted sequences', 'one pointer each, advance the smaller'],
    ['Maximize area / width between two ends', 'both ends, move the limiting side'],
  ]);
  v.say('Sorted input, pairs, palindromes, in place filtering, or two sorted lists: think two pointers. And remember the reason it works: every move rules out something that can never be the answer.');
  return v.build();
}

const body = String.raw`
## The idea

Replace a nested loop over pairs with **two indexes that each only move forward** (or toward each other). Every step rules out possibilities that can never be the answer, so one pass of at most **n** steps replaces **n²/2** checks.

> Real-life picture: two people searching a bookshelf from opposite ends for a pair of books whose page counts add to 500. If the sum is too small, the left person moves right; too large, the right person moves left.

## Shape 1: opposite ends (converging)

Use when the input is **sorted** or the question is **symmetric** (palindromes, reversing).

\`\`\`java
int l = 0, r = n - 1;
while (l < r) {
    int s = a[l] + a[r];
    if (s == target) return new int[]{l, r};
    if (s < target) l++;       // a[l] + anything ≤ s: drop a[l]
    else r--;                  // a[r] + anything ≥ s: drop a[r]
}
\`\`\`

\`\`\`python
l, r = 0, len(a) - 1
while l < r:
    s = a[l] + a[r]
    if s == target:
        return [l, r]
    if s < target:
        l += 1                 # a[l] + anything <= s: drop a[l]
    else:
        r -= 1                 # a[r] + anything >= s: drop a[r]
\`\`\`

\`\`\`cpp
int l = 0, r = n - 1;
while (l < r) {
    int s = a[l] + a[r];
    if (s == target) return {l, r};
    if (s < target) l++;       // a[l] + anything <= s: drop a[l]
    else r--;                  // a[r] + anything >= s: drop a[r]
}
\`\`\`

**Why it is correct:** picture the matrix of all pair sums. When \`a[l] + a[r]\` is too small, \`a[r]\` is the largest remaining value, so the whole row of \`a[l]\` is too small: discard it. When too large, the whole column of \`a[r]\` is too large. Each step removes a row or column and never the answer.

## Shape 2: same direction (read / write, slow / fast)

Use to **filter or compact in place**: the reader \`r\` visits every element; the writer \`w\` points to the next free slot.

\`\`\`python
w = 0
for r in range(len(a)):
    if keep(a[r]):
        a[w] = a[r]
        w += 1
return w                       # a[:w] is the result
\`\`\`

\`\`\`java
int w = 0;
for (int r = 0; r < n; r++)
    if (keep(a[r])) a[w++] = a[r];
return w;                      // a[0..w) is the result
\`\`\`

\`\`\`cpp
int w = 0;
for (int r = 0; r < n; r++)
    if (keep(a[r])) a[w++] = a[r];
return w;                      // a[0..w) is the result
\`\`\`

## Shape 3: one pointer per sequence

Merging two sorted arrays, comparing two strings, checking if one string is a subsequence of another: advance the pointer whose element is "behind".

## Recognising the pattern

| Signal | Shape |
|---|---|
| Sorted array + pair/triplet with a target sum | opposite ends |
| Palindrome, reverse, symmetric comparison | opposite ends |
| "In place", "O(1) extra space", remove/move elements | read / write |
| Two sorted inputs | one pointer each |
| Max area / container between two lines | opposite ends, move the shorter side |
| k-Sum (3Sum, 4Sum) | sort, fix k − 2 elements, two pointers for the rest |

## Pitfalls

- Using opposite-end pointers on **unsorted** data for a sum problem: the elimination argument needs sorted order (sort first, or use a hash map).
- Off-by-one in \`while (l < r)\` vs \`l <= r\`: pairs need two distinct indexes, so \`l < r\`.
- Skipping duplicates in 3Sum: move past equal values **after** recording a triplet.
`;

const lesson: Lesson = {
  slug: 'two-pointers',
  video,
  body,
  quiz: [
    { q: 'Sorted array, a[l] + a[r] < target. Why is it safe to move l right?', options: ['Because l is smaller', 'a[r] is the largest remaining value, so a[l] cannot reach the target with anything', 'Random choice', 'To avoid duplicates'], answer: 1, why: 'Every pair containing a[l] sums to at most a[l] + a[r], which is already too small.' },
    { q: 'Which shape removes elements in place?', options: ['Opposite ends', 'Read / write pointers in the same direction', 'Binary search', 'Hashing'], answer: 1, why: 'The reader scans everything; the writer copies only the elements you keep.' },
    { q: 'Two Sum on an UNSORTED array without sorting. Best approach?', options: ['Two pointers from both ends', 'Hash map of seen values', 'Binary search', 'Stack'], answer: 1, why: 'The two-pointer elimination argument requires sorted order.' },
    { q: 'How many pointer moves at most for converging pointers on n elements?', options: ['n²', 'n log n', 'about n', 'log n'], answer: 2, why: 'Each move brings l and r one step closer.' },
  ],
};

export default lesson;
