import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const S = [41, 35, 62, 5, 97, 108];
function med(a: number[]) { const s = [...a].sort((x, y) => x - y); const n = s.length; return n % 2 ? s[n >> 1] : (s[n / 2 - 1] + s[n / 2]) / 2; }

function video() {
  const v = new Video('find-median-from-data-stream', 'Find Median from Data Stream');
  v.chapter('intro', 'The problem');
  v.array('s', S, { label: 'addNum calls, in order' });
  v.say('Design a class with two methods: addNum adds a number from a stream, and findMedian returns the median of all numbers so far. Both are called many times, interleaved.');
  v.eq(`after all adds: median = ${med(S)}`);

  v.chapter('brute', 'Brute force: sort on every findMedian', { cx: 'add O(1) · median O(n log n)', code: ['addNum: append', 'findMedian: sort, take the middle'] });
  v.eq('sorting again and again', 'bad').say('Appending is instant, but every findMedian sorts the whole list again.');

  v.chapter('better', 'Better: keep a sorted array', { cx: 'add O(n) · median O(1)', code: ['addNum: binary search the position, insert (shift elements)', 'findMedian: middle element(s)'] });
  v.clear();
  const arr: number[] = [];
  const a = v.array('a', [], { label: 'sorted array' });
  v.say('Keep the numbers sorted. Binary search finds the position in log n, but inserting shifts every larger element one step right: linear time per add.');
  S.slice(0, 4).forEach((x) => {
    let p = 0; while (p < arr.length && arr[p] < x) p++;
    arr.splice(p, 0, x);
    a.p.items = []; arr.forEach((y) => a.push(y));
    a.clearTones().tone(p, 'active');
    for (let q = p + 1; q < arr.length; q++) a.tone(q, 'warn');
    v.eq(`insert ${x} at index ${p}${arr.length - p - 1 ? ` · shift ${arr.length - p - 1}` : ''}`).hold(800);
  });
  a.clearTones();
  v.eq('shifting is O(n) per add', 'warn').say('The shifting is the bottleneck.');

  v.chapter('optimal', 'Optimal: two heaps', { cx: 'add O(log n) · median O(1)', code: ['lo = max-heap (smaller half), hi = min-heap', 'addNum: push to lo; move lo.top to hi', '  if size(hi) > size(lo): move hi.top to lo', 'findMedian: lo.top or (lo.top + hi.top) / 2'] });
  v.clear().layout('row');
  const lo = v.heap('lo', { label: 'lo: max-heap (smaller half)', min: false, treeOnly: true });
  const hi = v.heap('hi', { label: 'hi: min-heap (bigger half)', min: true, treeOnly: true });
  const L: number[] = [], H: number[] = [];
  v.say('Keep the smaller half in a max-heap and the bigger half in a min-heap. The two tops are the middle of the sorted order.');
  let told = 0;
  S.forEach((x, i) => {
    lo.push(x); L.push(x); L.sort((p, q) => q - p);
    const m = L.shift()!; lo.pop(); hi.push(m); H.push(m); H.sort((p, q) => p - q);
    let back: number | null = null;
    if (H.length > L.length) { back = H.shift()!; hi.pop(); lo.push(back); L.push(back); L.sort((p, q) => q - p); }
    const md = L.length > H.length ? L[0] : (L[0] + H[0]) / 2;
    v.line(1, 2, 3).counter(`added ${i + 1}`).eq(`add ${x}: ${m} → hi${back !== null ? `, ${back} → lo` : ''} · median ${md}`, 'ok');
    if (told === 0) { v.say(`Add ${words(x)}. It passes through lo into hi, and since hi is now bigger, it comes back to lo. The median is ${words(md)}.`); told++; }
    else if (told === 1) { v.say(`Add ${words(x)}. It enters lo, but lo’s top, ${words(m)}, is moved to hi. Now the sizes are equal, and the median is the average of ${words(L[0])} and ${words(H[0])}: ${md}.`); told++; }
    else v.hold(900);
  });
  v.eq(`findMedian() = ${med(S)}`, 'ok').say(`After all six numbers, the tops are ${words(L[0])} and ${words(H[0])}, so the median is ${med(S)}. Adding costs log n; finding the median is constant time.`);
  v.answer([null, ...S.map(() => null), med(S)]);

  recap(v, [{ name: 'Sort on demand', time: 'median O(n log n)', space: 'O(n)' }, { name: 'Sorted array', time: 'add O(n)', space: 'O(n)' }, { name: 'Two heaps', time: 'add O(log n), median O(1)', space: 'O(n)' }], 'Max-heap for the smaller half, min-heap for the bigger half.', ['Running median / middle of a stream → two heaps'], 'The two tops are the middle of the sorted order.');
  return v.build();
}

const problem: Problem = {
  slug: 'find-median-from-data-stream',
  statement: 'Implement `MedianFinder`: `MedianFinder()` initialises the object; `addNum(int num)` adds an integer from the data stream; `findMedian()` returns the median of all elements so far (the average of the two middle values when the count is even).',
  examples: [{ input: '["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]\n[[],[1],[2],[],[3],[]]', output: '[null,null,null,1.5,null,2.0]' }],
  constraints: ['−10⁵ ≤ num ≤ 10⁵', 'findMedian is called only after at least one addNum', 'up to 5 · 10⁴ calls'],
  hints: ['Split the numbers into two halves.', 'Which heap should hold the smaller half?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sort on demand', idea: 'Append; sort in findMedian.', time: 'O(n log n) per median', space: 'O(n)', bottleneck: 'Repeated sorting.' },
    { id: 'better', kind: 'better', name: 'Sorted array', idea: 'Binary-search insert; median by index.', time: 'O(n) per add', space: 'O(n)', bottleneck: 'Shifting on insert.' },
    { id: 'optimal', kind: 'optimal', name: 'Two heaps', idea: 'lo max-heap, hi min-heap, balanced; median from the tops.', time: 'O(log n) add, O(1) median', space: 'O(n)' },
  ],
  takeaway: '**Two heaps** meet at the median.',
  video,
  videoArgs: [],
  judge: {
    type: 'design', cls: 'MedianFinder', ctor: [],
    methods: { addNum: { params: ['int'], ret: 'void' }, findMedian: { params: [], ret: 'double' } },
    tests: [
      { ops: ['MedianFinder', 'addNum', 'addNum', 'findMedian', 'addNum', 'findMedian'], args: [[], [1], [2], [], [3], []], out: [null, null, null, 1.5, null, 2] },
      { ops: ['MedianFinder', ...S.map(() => 'addNum'), 'findMedian'], args: [[], ...S.map((x) => [x]), []], out: [null, ...S.map(() => null), med(S)] },
      { ops: ['MedianFinder', 'addNum', 'findMedian', 'addNum', 'findMedian'], args: [[], [-100000], [], [-100000], []], out: [null, null, -100000, null, -100000] },
    ],
    gen: (r: Rng) => { const ops = ['MedianFinder']; const args: unknown[][] = [[]]; let added = 0; for (let t = 0; t < 20; t++) { if (added && r.chance(0.4)) { ops.push('findMedian'); args.push([]); } else { ops.push('addNum'); args.push([r.int(-20, 20)]); added++; } } return { ops, args }; },
    ref: (ops, args) => { const seen: number[] = []; return ops.map((op, i) => { if (op === 'addNum') { seen.push(args[i][0] as number); return null; } if (op === 'findMedian') return med(seen); return null; }); },
  },
};

export default problem;
