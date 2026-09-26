import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const L = [[4, 10, 15, 24, 26], [0, 9, 12, 20], [5, 18, 22, 30]];
function sr(lists: number[][]) { const idx = lists.map(() => 0); let best = [-Infinity, Infinity]; for (;;) { let mn = Infinity, mx = -Infinity, mi = -1; lists.forEach((l, i) => { const x = l[idx[i]]; if (x < mn) { mn = x; mi = i; } if (x > mx) mx = x; }); if (mx - mn < best[1] - best[0]) best = [mn, mx]; idx[mi]++; if (idx[mi] >= lists[mi].length) return best; } }

function video() {
  const v = new Video('smallest-range-k-lists', 'Smallest Range Covering Elements from K Lists');
  v.chapter('intro', 'The problem');
  const W = Math.max(...L.map((l) => l.length));
  v.grid('g', L.map((l) => Array.from({ length: W }, (_, j) => (j < l.length ? l[j] : ''))), { label: 'k sorted lists (one per row)' });
  v.say(`Find the smallest range [a, b] that contains at least one number from each of the ${words(L.length)} lists. A range is smaller if it is narrower, or equally wide but starts earlier.`);
  v.eq(`answer: [${sr(L)}]`);

  v.chapter('brute', 'Brute force: try every start', { cx: 'O(N · N)', code: ['for each value lo (from any list):', '  for each list: first element ≥ lo', '  hi = max of those → range [lo, hi]'] });
  v.eq('N candidate starts × a scan of all lists', 'warn').say('Any optimal range starts at some element. For each possible start, find in every list the first element at least as big, and the range must stretch to the largest of those. Checking every start is quadratic.');

  v.chapter('optimal', 'Optimal: heap of heads + running max', { cx: 'O(N log k)', code: ['heap = first of each list; mx = max', 'range [heap.min, mx]; keep if smaller', 'advance the min’s list; update mx', 'stop when a list runs out'] });
  v.clear();
  const g = v.grid('g', L.map((l) => Array.from({ length: W }, (_, j) => (j < l.length ? l[j] : ''))), { label: 'current pick from each list' });
  const iv = v.intervals('r', [], { label: 'current range [heap min, max]', min: 0, max: 31 });
  v.weight('g', 1.4).weight('r', 1);
  const idx = L.map(() => 0);
  let best = [-Infinity, Infinity];
  let told = 0;
  v.say('A range covers all lists exactly when it contains one current pick from each list. Take the first element of every list. The range from the smallest pick to the largest pick covers everything. To try to shrink it, the only useful move is to raise the smallest pick: move that list forward to its next element. A heap gives the smallest pick; a variable tracks the largest.');
  for (;;) {
    g.clearTones();
    let mn = Infinity, mx = -Infinity, mi = -1;
    L.forEach((l, i) => { const x = l[idx[i]]; g.tone(i, idx[i], 'cmp'); if (x < mn) { mn = x; mi = i; } if (x > mx) mx = x; });
    g.tone(mi, idx[mi], 'active');
    const nb = mx - mn < best[1] - best[0];
    if (nb) best = [mn, mx];
    iv.p.items = [];
    iv.add(0, mn, mx, 0, `[${mn},${mx}]`).tone(0, nb ? 'ok' : 'cmp');
    if (best[0] !== mn || best[1] !== mx) iv.add(1, best[0], best[1], 1, `best [${best}]`).tone(1, 'ok');
    v.line(1).counter(`best [${best}]`).eq(`picks {${L.map((l, i) => l[idx[i]]).join(', ')}} → range [${mn},${mx}] width ${mx - mn}${nb ? ' ← best' : ''}`, nb ? 'ok' : undefined);
    if (told === 0) { v.say(`The picks are ${L.map((l, i) => words(l[idx[i]])).join(', ')}. The range from ${words(mn)} to ${words(mx)} has width ${words(mx - mn)}. The smallest pick, ${words(mn)}, is the one to advance.`); told++; }
    else if (nb && told === 1) { v.say(`Range ${words(mn)} to ${words(mx)}: width ${words(mx - mn)}, a new best.`); told++; }
    else v.hold(800);
    idx[mi]++;
    if (idx[mi] >= L[mi].length) {
      v.line(3).eq(`list ${mi} is exhausted → stop`, 'warn').say(`List ${words(mi)} has no more elements. Raising the minimum is no longer possible without losing that list, so we stop.`);
      break;
    }
  }
  g.clearTones();
  v.eq(`smallest range = [${best}]`, 'ok').say(`The best range is ${words(best[0])} to ${words(best[1])}. Each element enters the heap once, so the time is N log k.`);
  v.answer(sr(L));

  recap(v, [{ name: 'Try every start', time: 'O(N · N)', space: 'O(k)' }, { name: 'Heap of heads + running max', time: 'O(N log k)', space: 'O(k)' }], 'Range = [heap min, running max]; always advance the minimum.', ['Cover every list with one window → k-way merge with a max tracker'], 'Only raising the minimum can ever make the range narrower.');
  return v.build();
}

const problem: Problem = {
  slug: 'smallest-range-covering-elements-from-k-lists',
  statement: 'You have `k` lists of sorted integers. Find the smallest range `[a, b]` that includes at least one number from each list. `[a, b]` is smaller than `[c, d]` if `b − a < d − c`, or `a < c` when `b − a == d − c`.',
  examples: [{ input: 'nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]', output: '[20,24]' }, { input: 'nums = [[1,2,3],[1,2,3],[1,2,3]]', output: '[1,1]' }],
  constraints: ['1 ≤ k ≤ 3500', '1 ≤ list length ≤ 50', 'lists sorted non-decreasing'],
  hints: ['One current element per list; the range is [min, max] of them.', 'Advance the list holding the minimum.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Try every start', idea: 'For each value lo, find the first element ≥ lo in every list; hi = their max.', time: 'O(N · N)', space: 'O(k)', bottleneck: 'Rescans every list per start.' },
    { id: 'optimal', kind: 'optimal', name: 'Heap + running max', idea: 'Heap of current picks; range [min, max]; advance the min’s list until one runs out.', time: 'O(N log k)', space: 'O(k)' },
  ],
  takeaway: 'Advance the **minimum**; track the maximum.',
  video,
  videoArgs: [L],
  judge: {
    type: 'fn', fn: 'smallestRange', params: ['List<List<Integer>>'], ret: 'int[]',
    tests: [{ args: [L], out: [20, 24] }, { args: [[[1, 2, 3], [1, 2, 3], [1, 2, 3]]], out: [1, 1] }, { args: [[[1], [5]]], out: [1, 5] }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 4) }, () => r.ints(r.int(1, 5), -6, 12).sort((a, b) => a - b))],
    ref: (lists: number[][]) => sr(lists),
  },
};

export default problem;
