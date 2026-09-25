import type { Lesson } from '../../types';
import { Video } from '../../helpers';

const A = [5, 2, 9, 1, 6, 3];

function video() {
  const v = new Video('sorting-algorithms', 'Sorting algorithms');
  v.chapter('intro', 'Why sorting matters');
  v.text('t', { title: 'Sorting', subtitle: 'The most common first step in an optimal solution', big: true });
  v.say('Sorting shows up everywhere. Once data is sorted, duplicates sit together, binary search works, and two pointers become possible. Let us see five ways to sort, and why some are much faster than others.');

  /* Bubble sort */
  v.chapter('bubble', 'Bubble sort', { cx: 'O(n²)', code: ['repeat n-1 passes:', '  for j in 0..n-2-pass:', '    if a[j] > a[j+1]: swap them'] });
  v.clear();
  const b = v.array('a', A, { label: 'bubble sort', bars: true });
  const vb = v.vars('v', { swaps: 0 });
  const arr = [...A];
  let swaps = 0;
  v.say('Bubble sort compares neighbours and swaps them if they are out of order. Each pass carries the largest remaining value to the end, like a bubble rising.');
  for (let pass = 0; pass < arr.length - 1; pass++) {
    for (let j = 0; j < arr.length - 1 - pass; j++) {
      b.clearTones(['sorted']).tone([j, j + 1], 'cmp').ptr('j', j);
      v.line(2).eq(`${arr[j]} vs ${arr[j + 1]}`);
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        b.swap(j, j + 1).tone([j, j + 1], 'warn');
        vb.set({ swaps });
        v.eq(`swap → ${arr.join(' ')}`, 'warn');
      }
      v.hold(pass === 0 ? 550 : 300);
    }
    b.clearTones(['sorted']).tone(arr.length - 1 - pass, 'sorted').noPtr();
    if (pass === 0) v.eq('9 bubbled to the end', 'ok').say('After one pass, nine, the largest, is at the end. It is in its final place.');
  }
  b.clearTones().toneRange(0, arr.length - 1, 'sorted');
  v.eq('sorted', 'ok').note('n passes × n comparisons = O(n²)');
  v.say('After n minus one passes, everything is sorted. That is up to n squared comparisons. Simple, but slow. It is stable, meaning equal values keep their order, and in place.');

  /* Selection sort */
  v.chapter('selection', 'Selection sort', { cx: 'O(n²)', code: ['for i in 0..n-1:', '  m = index of min in a[i..n-1]', '  swap a[i], a[m]'] });
  v.clear();
  const s = v.array('a', A, { label: 'selection sort', bars: true });
  const sa = [...A];
  for (let i = 0; i < sa.length - 1; i++) {
    let m = i;
    for (let j = i + 1; j < sa.length; j++) if (sa[j] < sa[m]) m = j;
    s.clearTones(['sorted']).ptrs({ i, min: m }).tone(m, 'active');
    v.line(1).eq(`smallest of the rest: ${sa[m]}`);
    if (i === 0) v.say('Selection sort scans for the smallest remaining value and swaps it into the next slot. One is the smallest, so it goes to the front.');
    else v.hold(650);
    [sa[i], sa[m]] = [sa[m], sa[i]];
    s.swap(i, m).clearTones(['sorted']).tone(i, 'sorted');
    v.line(2).hold(500);
  }
  s.clearTones().toneRange(0, 5, 'sorted').noPtr();
  v.eq('always n²/2 comparisons, even if already sorted', 'bad').say('It always does about n squared over two comparisons, even on sorted input. Few swaps, but still quadratic.');

  /* Insertion sort */
  v.chapter('insertion', 'Insertion sort', { cx: 'O(n²)', code: ['for i in 1..n-1:', '  x = a[i]', '  shift bigger items in a[0..i-1] right', '  put x in the gap'] });
  v.clear();
  const ins = v.array('a', A, { label: 'insertion sort', bars: true });
  const ia = [...A];
  v.say('Insertion sort is how most people sort playing cards. Keep a sorted part on the left, and insert each new card into its place.');
  for (let i = 1; i < ia.length; i++) {
    const x = ia[i];
    let j = i - 1;
    while (j >= 0 && ia[j] > x) j--;
    const to = j + 1;
    ins.clearTones().toneRange(0, i - 1, 'sorted').tone(i, 'active').ptr('i', i);
    v.line(1).eq(`insert ${x}`).hold(500);
    ia.splice(i, 1);
    ia.splice(to, 0, x);
    ins.move(i, to).clearTones().toneRange(0, i, 'sorted').tone(to, 'active');
    v.line(3).eq(`${x} goes to index ${to}`);
    if (i === 1) v.say('Two is smaller than five, so five shifts right and two slides in front.');
    else if (i === 3) v.say('One is smaller than everything so far, so it slides all the way to the front.');
    else v.hold(650);
  }
  ins.clearTones().toneRange(0, 5, 'sorted').noPtr();
  v.eq('nearly sorted input → close to O(n)', 'ok').note('great for small or nearly sorted arrays');
  v.say('Worst case is still n squared. But on nearly sorted data it is almost linear, which is why real sorting libraries use it for small pieces.');

  /* Merge sort */
  v.chapter('merge', 'Merge sort', { cx: 'O(n log n)', code: ['sort(a):', '  if len(a) <= 1: return a', '  L = sort(left half); R = sort(right half)', '  return merge(L, R)'] });
  v.clear();
  const t = v.tree('t', { binary: false, label: 'split in halves, then merge back up' });
  const lab = (x: number[]) => x.join(' ');
  const splitTree = (x: number[], parent: string | null): string => {
    const id = t.add(parent, lab(x));
    if (x.length > 1) {
      const m = x.length >> 1;
      splitTree(x.slice(0, m), id);
      splitTree(x.slice(m), id);
    }
    return id;
  };
  const root = splitTree(A, null);
  const byLevel: string[][] = [];
  const lvl = (id: string, d: number) => {
    (byLevel[d] ??= []).push(id);
    t.kids(id).forEach((k) => lvl(k, d + 1));
  };
  lvl(root, 0);
  const saved = JSON.parse(JSON.stringify(t.p.nodes));
  const depthOf: Record<string, number> = {};
  byLevel.forEach((ids, d) => ids.forEach((id) => (depthOf[id] = d)));
  for (let d = 0; d < byLevel.length; d++) {
    const nodes: typeof t.p.nodes = {};
    for (const id of Object.keys(saved)) if (depthOf[id] <= d) nodes[id] = { v: saved[id].v, kids: saved[id].kids.filter((k: string) => depthOf[k] <= d) };
    t.p.nodes = nodes;
    t.clearTones().tone(byLevel[d], 'active');
    v.line(2);
    if (d === 0) v.say('Merge sort is divide and conquer. Split the array in half, sort each half, then merge the two sorted halves.');
    else if (d === byLevel.length - 1) v.say('Keep splitting until every piece has one element. A single element is already sorted.');
    else v.hold(800);
  }
  // Merge back up: relabel nodes bottom-up with sorted contents.
  const sortedLabel = (id: string): number[] => {
    const kids = t.kids(id);
    if (!kids.length) return String(saved[id].v).split(' ').map(Number);
    return kids.flatMap(sortedLabel).sort((p, q) => p - q);
  };
  for (let d = byLevel.length - 2; d >= 0; d--) {
    for (const id of byLevel[d]) t.setVal(id, lab(sortedLabel(id)));
    t.clearTones().tone(byLevel[d], 'ok');
    v.line(3);
    if (d === byLevel.length - 2) v.say('Now merge back up. Merging two sorted lists is easy: repeatedly take the smaller front element.');
    else v.hold(900);
  }
  v.eq('log n levels × n work per level', 'ok');
  v.say('There are log n levels of splitting, and each level merges n elements in total. So merge sort is always n log n. It is stable, but needs O of n extra memory for merging.');
  v.clear();
  const L = [2, 5, 9];
  const R = [1, 3, 6];
  const la = v.array('L', L, { label: 'left (sorted)' });
  const ra = v.array('R', R, { label: 'right (sorted)' });
  const out = v.array('out', Array(6).fill(null), { label: 'merged' });
  let i = 0;
  let j = 0;
  let k = 0;
  v.code(['i, j = 0, 0', 'while i < len(L) and j < len(R):', '  take the smaller of L[i], R[j]', 'copy what is left']);
  while (i < 3 || j < 3) {
    la.clearTones().ptr('i', i < 3 ? i : null);
    ra.clearTones().ptr('j', j < 3 ? j : null);
    const takeL = j >= 3 || (i < 3 && L[i] <= R[j]);
    if (takeL) la.tone(i, 'ok');
    else ra.tone(j, 'ok');
    out.set(k, takeL ? L[i] : R[j]).clearTones().tone(k, 'ok');
    v.line(2).eq(takeL ? `take ${L[i]} from left` : `take ${R[j]} from right`);
    if (k === 0) v.say('The merge step, up close. Compare the fronts: one is smaller than two, so take one from the right.');
    else v.hold(600);
    if (takeL) i++;
    else j++;
    k++;
  }
  v.eq('each element copied once → O(n) per merge', 'ok').hold(900);

  /* Quick sort */
  v.chapter('quick', 'Quick sort', { cx: 'O(n log n) avg', code: ['partition(lo, hi):', '  pivot = a[hi]; i = lo', '  for j in lo..hi-1:', '    if a[j] < pivot: swap a[i], a[j]; i++', '  swap a[i], a[hi]  → pivot is placed'] });
  v.clear();
  const q = v.array('a', A, { label: 'quick sort: partition around the last element', bars: true });
  const qa = [...A];
  const hi = qa.length - 1;
  const pivot = qa[hi];
  let pi = 0;
  q.tone(hi, 'pivot').ptrs({ i: 0, j: 0 });
  v.line(1).eq(`pivot = ${pivot}`).say('Quick sort picks a pivot, here the last element, three, and partitions: everything smaller goes to its left, everything bigger to its right.');
  for (let jj = 0; jj < hi; jj++) {
    q.clearTones().tone(hi, 'pivot').ptrs({ i: pi, j: jj }).tone(jj, 'cmp');
    for (let x = 0; x < pi; x++) q.tone(x, 'ok');
    v.line(3).eq(`${qa[jj]} ${qa[jj] < pivot ? '<' : '≥'} ${pivot}`);
    if (qa[jj] < pivot) {
      [qa[pi], qa[jj]] = [qa[jj], qa[pi]];
      q.swap(pi, jj).tone(pi, 'ok');
      pi++;
      v.eq(`smaller → swap into the left part`, 'ok');
    }
    v.hold(jj === 0 ? 900 : 650);
  }
  [qa[pi], qa[hi]] = [qa[hi], qa[pi]];
  q.swap(pi, hi).clearTones().tone(pi, 'sorted').noPtr();
  for (let x = 0; x < pi; x++) q.tone(x, 'ok');
  v.line(4).eq(`pivot ${pivot} is in its final place (index ${pi})`, 'ok');
  v.say('Finally swap the pivot into the gap. Three is now exactly where it belongs. Recursively sort the left part and the right part the same way.');
  v.note('bad pivots (e.g. sorted input) → O(n²)');
  v.say('On average the pivot splits the array roughly in half, giving n log n, and quick sort is very fast in practice and in place. But if the pivot is always the smallest or largest, it degrades to n squared. Random pivots avoid that.');

  /* Counting sort */
  v.chapter('counting', 'Counting sort', { cx: 'O(n + k)', code: ['count[v] += 1 for every value v', 'for v in 0..k: output v, count[v] times'] });
  v.clear();
  const C = [2, 0, 3, 2, 1, 0, 2];
  const ca = v.array('in', C, { label: 'values between 0 and 3' });
  const cnt = v.array('cnt', [0, 0, 0, 0], { label: 'count[value]' });
  C.forEach((x, idx) => {
    ca.clearTones().tone(idx, 'active');
    cnt.set(x, (cnt.get(x) as number) + 1).clearTones().tone(x, 'active');
    v.line(0);
    if (idx === 0) v.say('When values are small integers, you do not need comparisons at all. Count how many times each value appears.');
    else v.hold(380);
  });
  const outv: number[] = [];
  [0, 1, 2, 3].forEach((val) => {
    for (let c = 0; c < (cnt.get(val) as number); c++) outv.push(val);
  });
  ca.setAll(outv).clearTones().toneRange(0, outv.length - 1, 'sorted');
  cnt.clearTones();
  v.line(1).eq(`${outv.join(' ')}`, 'ok').say('Then write each value out as many times as it was counted. That is O of n plus k, where k is the range of values. Perfect for grades, ages, or letters.');

  v.chapter('recap', 'Which sort?');
  v.clear();
  v.table('cmp', ['Algorithm', 'Time (avg / worst)', 'Space', 'Stable'], [
    ['Bubble / selection', 'O(n²) / O(n²)', 'O(1)', 'bubble yes, selection no'],
    ['Insertion', 'O(n²) / O(n²), ~O(n) nearly sorted', 'O(1)', 'yes'],
    ['Merge', 'O(n log n) / O(n log n)', 'O(n)', 'yes'],
    ['Quick', 'O(n log n) / O(n²)', 'O(log n)', 'no'],
    ['Counting', 'O(n + k)', 'O(k)', 'yes'],
  ]).tone(2, 'ok').tone(3, 'ok');
  v.say('In interviews, you will almost always call the built-in sort, which is n log n: Java uses a quick sort variant for primitives and Tim sort for objects, Python uses Tim sort, and C plus plus uses intro sort. But you must know merge sort and quick sort, because their ideas, merging and partitioning, appear in many problems.');
  return v.build();
}

const body = String.raw`
## Why sorting matters

Sorting is often the first step that unlocks a faster algorithm: equal items become neighbours, binary search becomes possible, and two pointers can walk from both ends. Built-in sorts run in **O(n log n)**, so adding a sort rarely hurts.

## Vocabulary

- **In-place:** uses O(1) (or O(log n)) extra memory.
- **Stable:** equal elements keep their original relative order. Matters when sorting records by one key after another.
- **Comparison sort:** decides order only by comparing pairs. No comparison sort can beat **O(n log n)** in the worst case.

## The algorithms

| Algorithm | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| Bubble sort | O(n) | O(n²) | O(n²) | O(1) | yes |
| Selection sort | O(n²) | O(n²) | O(n²) | O(1) | no |
| Insertion sort | O(n) | O(n²) | O(n²) | O(1) | yes |
| Merge sort | O(n log n) | O(n log n) | O(n log n) | O(n) | yes |
| Quick sort | O(n log n) | O(n log n) | O(n²) | O(log n) | no |
| Heap sort | O(n log n) | O(n log n) | O(n log n) | O(1) | no |
| Counting sort | O(n + k) | O(n + k) | O(n + k) | O(k) | yes |

### Insertion sort

Great for small or nearly-sorted arrays; libraries use it for tiny sub-arrays.

\`\`\`java
void insertionSort(int[] a) {
    for (int i = 1; i < a.length; i++) {
        int x = a[i], j = i - 1;
        while (j >= 0 && a[j] > x) { a[j + 1] = a[j]; j--; }  // shift bigger items right
        a[j + 1] = x;
    }
}
\`\`\`

\`\`\`python
def insertion_sort(a):
    for i in range(1, len(a)):
        x, j = a[i], i - 1
        while j >= 0 and a[j] > x:      # shift bigger items right
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = x
\`\`\`

\`\`\`cpp
void insertionSort(vector<int>& a) {
    for (int i = 1; i < (int)a.size(); i++) {
        int x = a[i], j = i - 1;
        while (j >= 0 && a[j] > x) { a[j + 1] = a[j]; j--; }  // shift bigger items right
        a[j + 1] = x;
    }
}
\`\`\`

### Merge sort

Split in half, sort each half recursively, merge. Always O(n log n); stable; needs O(n) extra space. The **merge** step (two pointers over two sorted lists) is a pattern of its own: it appears in [Merge Sorted Array](#/problem/merge-sorted-array), [Merge Two Sorted Lists](#/problem/merge-two-sorted-lists) and counting inversions.

\`\`\`java
void mergeSort(int[] a, int lo, int hi, int[] tmp) {   // sorts a[lo..hi]
    if (lo >= hi) return;
    int mid = (lo + hi) / 2;
    mergeSort(a, lo, mid, tmp);
    mergeSort(a, mid + 1, hi, tmp);
    int i = lo, j = mid + 1, k = lo;
    while (i <= mid && j <= hi) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];  // <= keeps it stable
    while (i <= mid) tmp[k++] = a[i++];
    while (j <= hi) tmp[k++] = a[j++];
    for (k = lo; k <= hi; k++) a[k] = tmp[k];
}
\`\`\`

\`\`\`python
def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left, right = merge_sort(a[:mid]), merge_sort(a[mid:])
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:         # <= keeps it stable
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    return out + left[i:] + right[j:]
\`\`\`

\`\`\`cpp
void mergeSort(vector<int>& a, int lo, int hi, vector<int>& tmp) {  // sorts a[lo..hi]
    if (lo >= hi) return;
    int mid = (lo + hi) / 2;
    mergeSort(a, lo, mid, tmp);
    mergeSort(a, mid + 1, hi, tmp);
    int i = lo, j = mid + 1, k = lo;
    while (i <= mid && j <= hi) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];  // <= keeps it stable
    while (i <= mid) tmp[k++] = a[i++];
    while (j <= hi) tmp[k++] = a[j++];
    for (k = lo; k <= hi; k++) a[k] = tmp[k];
}
\`\`\`

### Quick sort

Pick a pivot, **partition** so smaller elements are on its left and larger on its right, then recurse on both sides. Average O(n log n), in place, very fast in practice; worst case O(n²) with bad pivots, so pick the pivot at random. Partitioning is also the heart of **quickselect** (k-th smallest in average O(n)) and [Sort Colors](#/problem/sort-colors).

\`\`\`java
int partition(int[] a, int lo, int hi) {     // Lomuto: pivot = a[hi]
    int pivot = a[hi], i = lo;
    for (int j = lo; j < hi; j++)
        if (a[j] < pivot) { int t = a[i]; a[i] = a[j]; a[j] = t; i++; }
    int t = a[i]; a[i] = a[hi]; a[hi] = t;
    return i;                                // pivot's final index
}
\`\`\`

\`\`\`python
def partition(a, lo, hi):                    # Lomuto: pivot = a[hi]
    pivot, i = a[hi], lo
    for j in range(lo, hi):
        if a[j] < pivot:
            a[i], a[j] = a[j], a[i]
            i += 1
    a[i], a[hi] = a[hi], a[i]
    return i                                 # pivot's final index
\`\`\`

\`\`\`cpp
int partition(vector<int>& a, int lo, int hi) {  // Lomuto: pivot = a[hi]
    int pivot = a[hi], i = lo;
    for (int j = lo; j < hi; j++)
        if (a[j] < pivot) swap(a[i++], a[j]);
    swap(a[i], a[hi]);
    return i;                                    // pivot's final index
}
\`\`\`

### Counting sort

For small integer ranges [0, k): count occurrences, then write values out in order. O(n + k), no comparisons.

## Sorting in your language

| | Java | Python | C++ |
|---|---|---|---|
| Sort array/list | \`Arrays.sort(a)\`, \`Collections.sort(list)\` | \`a.sort()\`, \`sorted(a)\` | \`sort(a.begin(), a.end())\` |
| Descending | \`Arrays.sort(boxed, Collections.reverseOrder())\` | \`a.sort(reverse=True)\` | \`sort(a.rbegin(), a.rend())\` |
| By key | \`list.sort((x, y) -> x[0] - y[0])\` | \`a.sort(key=lambda x: x[0])\` | \`sort(..., [](auto& x, auto& y){ return x[0] < y[0]; })\` |
| Stable? | objects: yes (TimSort); primitives: no | yes (TimSort) | \`stable_sort\` if you need it |

> Comparator pitfall in Java: \`(x, y) -> x - y\` can overflow for large values. Use \`Integer.compare(x, y)\`.
`;

const lesson: Lesson = {
  slug: 'sorting-algorithms',
  video,
  body,
  quiz: [
    { q: 'Which sort is always O(n log n) but needs O(n) extra memory?', options: ['Quick sort', 'Merge sort', 'Insertion sort', 'Selection sort'], answer: 1, why: 'Merge sort splits into log n levels and merges with a temporary array.' },
    { q: 'When does quick sort degrade to O(n²)?', options: ['When the array is small', 'When pivots repeatedly split the array very unevenly', 'When there are negative numbers', 'Never'], answer: 1, why: 'Always picking the min or max as pivot (e.g. last element on sorted input) gives n levels.' },
    { q: 'Which sort is best for an almost-sorted array?', options: ['Selection sort', 'Insertion sort', 'Counting sort', 'Quick sort with last-element pivot'], answer: 1, why: 'Each element moves only a little, so insertion sort is close to O(n).' },
    { q: '"Stable" means…', options: ['It never crashes', 'Equal elements keep their original relative order', 'It uses O(1) memory', 'It is always O(n log n)'], answer: 1, why: 'Stability matters when sorting by multiple keys.' },
    { q: 'Counting sort on n values in the range [0, k) costs…', options: ['O(n log n)', 'O(n + k)', 'O(nk)', 'O(k log k)'], answer: 1, why: 'One pass to count, one pass over the k buckets to output.' },
  ],
};

export default lesson;
