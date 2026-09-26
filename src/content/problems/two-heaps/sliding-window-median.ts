import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [1, 3, -1, -3, 5, 3, 6, 7];
const K = 3;
function swm(a: number[], k: number) { const out: number[] = []; for (let i = 0; i + k <= a.length; i++) { const s = a.slice(i, i + k).sort((x, y) => x - y); out.push(k % 2 ? s[k >> 1] : (s[k / 2 - 1] + s[k / 2]) / 2); } return out; }

function video() {
  const v = new Video('sliding-window-median', 'Sliding Window Median');
  const n = A.length;
  v.chapter('intro', 'The problem');
  const a0 = v.array('a', A, { label: `nums, k = ${K}` });
  a0.win(0, K - 1, 'win', 'median 1');
  v.say(`A window of size ${words(K)} slides across the array. Return the median of every window.`);
  v.eq(`answer: [${swm(A, K).join(', ')}]`);

  v.chapter('brute', 'Brute force: sort every window', { cx: 'O(n · k log k)', code: ['for each window: sort a copy, take the middle'] });
  v.eq('re-sorting k elements for each of n windows', 'bad').say('Sorting every window from scratch costs k log k per window.');

  v.chapter('better', 'Better: keep the window sorted', { cx: 'O(n · k)', code: ['sorted = first window, sorted', 'slide: remove the outgoing value (binary search + shift)', '       insert the incoming value (binary search + shift)'] });
  v.clear();
  const b = v.array('a', A, { label: 'nums' });
  const w = v.array('w', A.slice(0, K).sort((x, y) => x - y), { label: 'window, kept sorted' });
  b.win(0, K - 1, 'win');
  v.say('Keep the window itself sorted. Each slide removes one value and inserts one, each found by binary search, but shifting elements makes each step linear in k.');
  const cur = A.slice(0, K).sort((x, y) => x - y);
  for (let i = K; i < Math.min(n, K + 2); i++) {
    cur.splice(cur.indexOf(A[i - K]), 1);
    let p = 0; while (p < cur.length && cur[p] < A[i]) p++;
    cur.splice(p, 0, A[i]);
    w.p.items = []; cur.forEach((x) => w.push(x));
    w.clearTones().tone(p, 'active');
    b.noWin().win(i - K + 1, i, 'win');
    v.eq(`remove ${A[i - K]}, insert ${A[i]} → median ${cur[K >> 1]}`).hold(900);
  }
  v.eq('O(k) per slide', 'warn').say('Better, but still n times k.');

  v.chapter('optimal', 'Optimal: two heaps with lazy deletion', { cx: 'O(n log k)', code: ['lo = max-heap, hi = min-heap', 'insert incoming; mark outgoing', 'rebalance; pop marked tops', 'median from the tops'] });
  v.clear().layout('row');
  const lo = v.heap('lo', { label: 'lo: max-heap (smaller half)', min: false, treeOnly: true });
  const hi = v.heap('hi', { label: 'hi: min-heap (bigger half)', min: true, treeOnly: true });
  const dm = v.map('d', { label: 'to delete (lazy)' });
  v.weight('lo', 1.4).weight('hi', 1.4).weight('d', 0.8);
  v.say('Use the two heaps from Find Median. The new problem is removing the value that leaves the window: a heap cannot delete from the middle cheaply. Lazy deletion solves it. Write the value into a “to delete” table and adjust the live size counters. The value physically stays in its heap until it reaches the top; then we throw it away.');
  // Faithful simulation of the lazy two-heap algorithm.
  const LO: number[] = [], HI: number[] = [];
  const delayed = new Map<number, number>();
  let loSize = 0, hiSize = 0;
  const loTop = () => Math.max(...LO), hiTop = () => Math.min(...HI);
  const popLo = () => { const t = loTop(); LO.splice(LO.indexOf(t), 1); return t; };
  const popHi = () => { const t = hiTop(); HI.splice(HI.indexOf(t), 1); return t; };
  const pruned: string[] = [];
  const pruneLo = () => { while (LO.length && (delayed.get(loTop()) ?? 0) > 0) { const t = popLo(); delayed.set(t, delayed.get(t)! - 1); pruned.push(`${t} from lo`); } };
  const pruneHi = () => { while (HI.length && (delayed.get(hiTop()) ?? 0) > 0) { const t = popHi(); delayed.set(t, delayed.get(t)! - 1); pruned.push(`${t} from hi`); } };
  const balance = () => {
    if (loSize > hiSize + 1) { HI.push(popLo()); loSize--; hiSize++; pruneLo(); }
    else if (loSize < hiSize) { LO.push(popHi()); hiSize--; loSize++; pruneHi(); }
  };
  const insert = (x: number) => { if (!LO.length || x <= loTop()) { LO.push(x); loSize++; } else { HI.push(x); hiSize++; } balance(); };
  const erase = (x: number) => { delayed.set(x, (delayed.get(x) ?? 0) + 1); if (x <= loTop()) { loSize--; if (x === loTop()) pruneLo(); } else { hiSize--; if (x === hiTop()) pruneHi(); } balance(); };
  const median = () => (K % 2 ? loTop() : (loTop() + hiTop()) / 2);
  const show = () => {
    lo.p.items = []; hi.p.items = [];
    LO.forEach((x) => lo.push(x)); HI.forEach((x) => hi.push(x));
    const stale = new Set([...delayed.entries()].filter(([, c]) => c > 0).map(([x]) => x));
    lo.p.items.forEach((it, i) => { if (stale.has(Number(it.v))) lo.tone(i, 'dim'); });
    hi.p.items.forEach((it, i) => { if (stale.has(Number(it.v))) hi.tone(i, 'dim'); });
    dm.clearAll();
    [...delayed.entries()].filter(([, c]) => c > 0).forEach(([x, c]) => dm.put(x, c));
  };
  for (let i = 0; i < K; i++) insert(A[i]);
  show();
  v.line(0).counter(`window [${A.slice(0, K).join(', ')}] · live sizes ${loSize}/${hiSize}`).eq(`median = lo.top = ${median()}`, 'ok').say(`Insert the first window, ${A.slice(0, K).map(words).join(', ')}. With k odd, lo keeps one extra element and the median is its top, ${words(median())}.`);
  let told = { mark: false, prune: false };
  for (let i = K; i < n; i++) {
    const outV = A[i - K], inV = A[i];
    pruned.length = 0;
    insert(inV);
    erase(outV);
    show();
    const md = median();
    v.line(1, 2, 3).counter(`window [${A.slice(i - K + 1, i + 1).join(', ')}] · live sizes ${loSize}/${hiSize}`).eq(`in ${inV}, out ${outV}${pruned.length ? ` · pruned ${pruned.join(', ')}` : ' · marked, still inside'} → median ${md}`, 'ok');
    const stillThere = LO.includes(outV) || HI.includes(outV);
    if (!told.mark && stillThere) { v.say(`${words(inV)} arrives and ${words(outV)} leaves. ${words(outV)} is not at a heap top, so we only write it into the table and lower the live size of its half. It stays in the heap, greyed out, until it surfaces. The median is ${words(md)}.`); told.mark = true; }
    else if (!told.prune && pruned.length) { v.say(`${words(inV)} arrives and ${words(outV)} leaves. We mark ${words(outV)} in the table, but it is sitting at the top of ${pruned[0].endsWith('lo') ? 'lo' : 'hi'}, so it is popped right away and its mark is used up. The median is ${words(md)}.`); told.prune = true; }
    else v.hold(1000);
  }
  v.eq(`[${swm(A, K).join(', ')}]`, 'ok').say('Every value is pushed once and popped at most once, each in log k. Deletions cost nothing until the value surfaces.');
  v.answer(swm(A, K));

  recap(v, [{ name: 'Sort every window', time: 'O(n · k log k)', space: 'O(k)' }, { name: 'Sorted window', time: 'O(n · k)', space: 'O(k)' }, { name: 'Two heaps + lazy deletion', time: 'O(n log k)', space: 'O(n)' }], 'Two heaps plus a “to delete” table; prune tops before reading them.', ['Median of a moving window → two heaps with lazy deletion'], 'Lazy deletion lets heaps support removals.');
  return v.build();
}

const problem: Problem = {
  slug: 'sliding-window-median',
  statement: 'Given an integer array `nums` and an integer `k`, a window of size `k` moves from the left to the right. Return the median of each window. Answers within 10⁻⁵ are accepted.',
  examples: [{ input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', output: '[1.0,-1.0,-1.0,3.0,5.0,6.0]' }, { input: 'nums = [1,2,3,4,2,3,1,4,2], k = 3', output: '[2.0,3.0,3.0,3.0,2.0,3.0,2.0]' }],
  constraints: ['1 ≤ k ≤ n ≤ 10⁵', '−2³¹ ≤ nums[i] ≤ 2³¹ − 1'],
  hints: ['Find Median from Data Stream, plus removals.', 'Delete lazily: mark the value, remove it when it reaches a top.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sort every window', idea: 'Sort a copy of each window.', time: 'O(n · k log k)', space: 'O(k)', bottleneck: 'Re-sorting.' },
    { id: 'better', kind: 'better', name: 'Sorted window', idea: 'Binary-search remove and insert in a sorted list.', time: 'O(n · k)', space: 'O(k)', bottleneck: 'Shifting.' },
    { id: 'optimal', kind: 'optimal', name: 'Two heaps + lazy deletion', idea: 'Balanced max/min heaps, a delayed-deletion map and logical sizes.', time: 'O(n log k)', space: 'O(n)' },
  ],
  pitfalls: ['Average with doubles: values can be ±2³¹.', 'Prune heap tops before reading or comparing them.'],
  takeaway: 'Heaps + **lazy deletion** support sliding windows.',
  video,
  videoArgs: [A, K],
  judge: {
    type: 'fn', fn: 'medianSlidingWindow', params: ['int[]', 'int'], ret: 'double[]', cmp: 'float',
    tests: [{ args: [A, K], out: [1, -1, -1, 3, 5, 6] }, { args: [[1, 2, 3, 4, 2, 3, 1, 4, 2], 3], out: [2, 3, 3, 3, 2, 3, 2] }, { args: [[2147483647, 2147483647], 2], out: [2147483647] }, { args: [[-2147483648, -2147483648, 2147483647], 2], out: [-2147483648, -0.5] }],
    gen: (r: Rng) => { const a = r.ints(r.int(1, 12), -6, 6); return [a, r.int(1, a.length)]; },
    ref: (a: number[], k: number) => swm(a, k),
  },
};

export default problem;
