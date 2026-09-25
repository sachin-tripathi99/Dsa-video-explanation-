import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

function video() {
  const v = new Video('kth-stream', 'Kth Largest Element in a Stream');
  v.chapter('intro', 'The problem');
  v.text('p', { title: 'A leaderboard that always knows its k-th place', lines: ['KthLargest(k, nums): start with some scores', 'add(val): add a score, return the k-th largest so far'] });
  v.say('Scores arrive one by one. After each new score, report the k-th highest score so far, like the cut-off for the top k on a leaderboard.');

  v.chapter('brute', 'Brute force: sort after every add', { cx: 'O(n log n) per add', code: ['all.append(val); sort(all)', 'return all[len − k]'] });
  v.eq('re-sorting a growing list on every add', 'bad').say('Keeping every score and sorting on each add works, but gets slower and slower as scores pile up.');

  v.chapter('optimal', 'Optimal: min-heap of the top k', { cx: 'O(log k) per add', code: ['heap = min-heap, never more than k items', 'add(val): push(val); if size > k: pop()', 'return heap top  (the k-th largest)'] });
  v.clear();
  const k = 3;
  const h = v.heap('h', { label: `top ${k} scores (min-heap)`, min: true });
  [4, 5, 8, 2].forEach((x) => { h.push(x); if (h.size > k) h.pop(); });
  h.tone(0, 'pivot');
  v.line(0).eq(`k = ${k}, start [4, 5, 8, 2] → keep 4, 5, 8`).say('Keep only the top k scores in a min-heap. The smallest of them, at the root, is exactly the k-th largest. The two can never matter again once three bigger scores exist.');
  [3, 5, 10, 9, 4].forEach((x, i) => {
    h.push(x);
    const dropped = h.size > k ? h.pop() : null;
    h.clearTones().tone(0, 'pivot');
    v.line(1, 2).eq(`add(${x}) → ${dropped !== null ? `drop ${dropped}, ` : ''}return ${h.peek()}`, 'ok');
    if (i === 0) v.say('Add three: it is smaller than the root, so after pushing and popping, three is gone and the answer stays four.');
    else if (i === 1) v.say('Add five: now four is the smallest of four candidates, so it is pushed out, and the k-th largest becomes five.');
    else v.hold(800);
  });
  recap(v, [{ name: 'Sort every time', time: 'O(n log n) per add', space: 'O(n)' }, { name: 'Min-heap of size k', time: 'O(log k) per add', space: 'O(k)' }], 'Only the top k scores can ever be the answer; the heap keeps exactly those.', ['Running top-k over a stream → size-k min-heap', 'Root = k-th largest'], 'For streams, keep exactly what can still matter. Here that is the top k.');
  return v.build();
}

const problem: Problem = {
  slug: 'kth-largest-element-in-a-stream',
  statement: 'Design `KthLargest(k, nums)` with a method `add(val)` that adds `val` to the stream and returns the **k-th largest** element among all values so far.',
  examples: [{ input: 'KthLargest(3, [4,5,8,2]); add(3), add(5), add(10), add(9), add(4)', output: '4, 5, 5, 8, 8' }],
  constraints: ['1 ≤ k ≤ 10⁴', 'at least k elements exist whenever add returns'],
  hints: ['Do you need to remember scores that can never be in the top k?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sort on every add', idea: 'Keep all values; sort after each add; return index `len − k`.', time: 'O(n log n) per add', space: 'O(n)', bottleneck: 'Re-sorts a growing list.' },
    { id: 'optimal', kind: 'optimal', name: 'Min-heap of size k', idea: 'Keep the k largest in a min-heap; after each push, pop if size > k; return the root.', time: 'O(log k) per add', space: 'O(k)' },
  ],
  takeaway: 'Top-k over a **stream**: a **min-heap of size k**, root = k-th largest.',
  video,
  judge: {
    type: 'design', cls: 'KthLargest', ctor: ['int', 'int[]'],
    methods: { add: { params: ['int'], ret: 'int' } },
    tests: [{ ops: ['KthLargest', 'add', 'add', 'add', 'add', 'add'], args: [[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]], out: [null, 4, 5, 5, 8, 8] }],
    gen: (r) => { const k = r.int(1, 4); const nums = r.ints(r.int(Math.max(0, k - 1), 6), -10, 10); const ops = ['KthLargest']; const args: unknown[][] = [[k, nums]]; for (let i = 0; i < 15; i++) { ops.push('add'); args.push([r.int(-10, 10)]); } return { ops, args }; },
    ref: (ops, args) => { const [k, nums] = args[0] as [number, number[]]; const all = [...nums]; return ops.map((op, i) => { if (op === 'KthLargest') return null; all.push(args[i][0] as number); return [...all].sort((a, b) => b - a)[k - 1]; }); },
  },
};

export default problem;
