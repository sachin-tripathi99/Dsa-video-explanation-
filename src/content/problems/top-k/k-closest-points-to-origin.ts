import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

type P = [number, number];
const PTS: P[] = [[3, 3], [5, -1], [-2, 4], [1, 1], [0, -3]];
const K = 2;
const sn = (x: number) => (x < 0 ? `minus ${words(-x)}` : words(x));
const d2 = (p: number[]) => p[0] * p[0] + p[1] * p[1];
function kc(pts: number[][], k: number) { return pts.map((p) => [...p]).sort((a, b) => d2(a) - d2(b)).slice(0, k); }

function video() {
  const v = new Video('k-closest-points', 'K Closest Points to Origin');
  v.chapter('intro', 'The problem');
  const t = v.table('t', ['point', 'x² + y²'], PTS.map((p) => [`(${p})`, String(d2(p))]));
  v.say(`Return the ${words(K)} points closest to the origin, in any order. Compare squared distances, x squared plus y squared: the square root never changes the order, so we skip it.`);
  v.eq(`answer: ${kc(PTS, K).map((p) => `(${p})`).join(' ')}`);

  v.chapter('brute', 'Brute force: sort all points by distance', { cx: 'O(n log n)', code: ['sort points by x² + y²', 'return the first k'] });
  v.eq('sorts n points to keep k', 'warn').say('Sorting every point works but orders points we will throw away.');

  v.chapter('better', 'Better: max-heap of size k', { cx: 'O(n log k)', code: ['for p in points:', '  push p into a max-heap by distance', '  if size > k: pop    # the farthest'] });
  v.clear();
  const t2 = v.table('t', ['point', 'x² + y²'], PTS.map((p) => [`(${p})`, String(d2(p))]));
  const byD = new Map<number, number>(PTS.map((p, i) => [d2(p), i]));
  const h = v.heap('h', { label: `max-heap of squared distances, size ≤ ${K}`, min: false });
  let told = false;
  v.say(`We want the smallest distances, so we keep a max-heap: the farthest of the current ${words(K)} candidates sits on top, ready to be evicted. The heap stores squared distances; each one stands for its point in the table.`);
  PTS.forEach((p, i) => {
    t2.clearTones().tone(i, 'active');
    h.values.forEach((d) => t2.tone(byD.get(Number(d))!, 'cmp'));
    h.push(d2(p));
    v.line(1).eq(`push (${p}), distance² ${d2(p)}`).hold(600);
    if (h.size > K) {
      const out = Number(h.pop());
      const q = PTS[byD.get(out)!];
      t2.tone(byD.get(out)!, 'bad');
      v.line(2).eq(`size > ${K} → pop the farthest: (${q}) at ${out}`, 'bad');
      if (!told) { v.say(`Three candidates: evict the farthest, the point ${sn(q[0])}, ${sn(q[1])}, with squared distance ${words(out)}.`); told = true; } else v.hold(700);
    }
  });
  t2.clearTones();
  h.values.forEach((d) => t2.tone(byD.get(Number(d))!, 'ok'));
  v.eq(`heap: ${h.values.map((d) => `(${PTS[byD.get(Number(d))!]})`).join(' ')}`, 'ok').say('The heap holds the answer.');

  v.chapter('optimal', 'Optimal: quickselect', { cx: 'O(n) average', code: ['partition around a pivot distance', 'if pivot lands at index k: done', 'else recurse into the side containing index k'] });
  v.clear();
  const arr = PTS.map((p) => [...p] as P);
  const a = v.array('a', arr.map((p) => d2(p)), { label: 'distances² (we move whole points with them)' });
  v.say('If the order inside the answer does not matter, we can do better than a heap. Quickselect is the partition step of quicksort: pick a pivot, move closer points to its left and farther ones to its right. If the pivot lands at position k, the first k points are the answer. Otherwise recurse into only one side.');
  let lo = 0, hi = arr.length - 1;
  while (lo < hi) {
    const piv = d2(arr[hi]);
    a.clearTones().tone(hi, 'cmp').win(lo, hi, 'win');
    v.line(0).eq(`pivot = ${piv} (last of range [${lo}..${hi}])`).hold(700);
    let s = lo;
    for (let i = lo; i < hi; i++) if (d2(arr[i]) < piv) { [arr[i], arr[s]] = [arr[s], arr[i]]; s++; }
    [arr[s], arr[hi]] = [arr[hi], arr[s]];
    arr.forEach((p, i) => a.set(i, d2(p)));
    a.clearTones().tone(s, 'active');
    for (let i = lo; i < s; i++) a.tone(i, 'ok');
    v.eq(`after partition: pivot at index ${s}`).say(`Everything closer than ${words(piv)} moved left; the pivot landed at index ${words(s)}.`);
    if (s === K) { v.line(1).eq(`index ${s} = k → the first ${K} are the closest`, 'ok').hold(700); break; }
    if (s < K) { lo = s + 1; v.line(2).eq(`${s} < ${K} → recurse right`).hold(700); } else { hi = s - 1; v.line(2).eq(`${s} > ${K} → recurse left`).hold(700); }
  }
  a.noWin().clearTones();
  for (let i = 0; i < K; i++) a.tone(i, 'ok');
  v.eq(`answer: ${arr.slice(0, K).map((p) => `(${p})`).join(' ')}`, 'ok').say('Each round keeps only one side, so the expected work is n plus n over two plus n over four, and so on: linear on average. Quadratic in the unlucky worst case, which a random pivot makes very unlikely.');
  void t;
  v.answer(kc(PTS, K));

  recap(v, [{ name: 'Sort', time: 'O(n log n)', space: 'O(n)' }, { name: 'Max-heap of size k', time: 'O(n log k)', space: 'O(k)' }, { name: 'Quickselect', time: 'O(n) avg', space: 'O(1) extra' }], 'k smallest distances: max-heap of size k, or quickselect.', ['k closest / k smallest → max-heap of size k (or quickselect)'], 'Use squared distances and evict the farthest.');
  return v.build();
}

const problem: Problem = {
  slug: 'k-closest-points-to-origin',
  statement: 'Given an array of `points` where `points[i] = [xᵢ, yᵢ]` and an integer `k`, return the `k` closest points to the origin `(0, 0)` (Euclidean distance), in any order. The answer is unique.',
  examples: [{ input: 'points = [[1,3],[-2,2]], k = 1', output: '[[-2,2]]' }, { input: 'points = [[3,3],[5,-1],[-2,4]], k = 2', output: '[[3,3],[-2,4]]' }],
  constraints: ['1 ≤ k ≤ n ≤ 10⁴', '−10⁴ ≤ xᵢ, yᵢ ≤ 10⁴'],
  hints: ['Compare x² + y², no square roots.', 'Max-heap of size k, or quickselect.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sort', idea: 'Sort by squared distance, take k.', time: 'O(n log n)', space: 'O(n)', bottleneck: 'Orders points that are discarded.' },
    { id: 'better', kind: 'better', name: 'Max-heap of size k', idea: 'Keep k candidates; evict the farthest.', time: 'O(n log k)', space: 'O(k)', bottleneck: 'Log factor.' },
    { id: 'optimal', kind: 'optimal', name: 'Quickselect', idea: 'Partition by distance until the pivot lands at index k.', time: 'O(n) average', space: 'O(1) extra' },
  ],
  pitfalls: ['Squared distances up to 2·10⁸ fit in int.'],
  takeaway: 'k smallest → **max-heap of size k** or **quickselect**.',
  video,
  videoArgs: [PTS, K],
  judge: {
    type: 'fn', fn: 'kClosest', params: ['int[][]', 'int'], ret: 'int[][]', cmp: 'sorted',
    tests: [{ args: [[[1, 3], [-2, 2]], 1], out: [[-2, 2]] }, { args: [[[3, 3], [5, -1], [-2, 4]], 2], out: [[3, 3], [-2, 4]] }, { args: [PTS, K], out: [[1, 1], [0, -3]] }],
    gen: (r: Rng) => {
      const n = r.int(1, 8), k = r.int(1, n);
      const used = new Set<number>();
      const pts: number[][] = [];
      while (pts.length < n) { const p = [r.int(-9, 9), r.int(-9, 9)]; if (!used.has(d2(p))) { used.add(d2(p)); pts.push(p); } }
      return [pts, k];
    },
    ref: (pts: number[][], k: number) => kc(pts, k),
  },
};

export default problem;
