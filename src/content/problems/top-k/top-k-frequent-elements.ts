import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [4, 1, 4, 2, 1, 4, 3, 2, 4, 1];
const K = 2;
function counts(a: number[]) { const m = new Map<number, number>(); for (const x of a) m.set(x, (m.get(x) ?? 0) + 1); return m; }
function topk(a: number[], k: number) { return [...counts(a).entries()].sort((x, y) => y[1] - x[1] || x[0] - y[0]).slice(0, k).map((e) => e[0]); }

function video() {
  const v = new Video('top-k-frequent-elements', 'Top K Frequent Elements');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: `nums, k = ${K}` });
  v.say(`Return the ${words(K)} most frequent numbers, in any order. The answer is guaranteed to be unique.`);
  v.eq(`answer: [${topk(A, K).join(', ')}]`);

  v.chapter('count', 'Step 1 (every approach): count');
  v.clear();
  const a = v.array('a', A, { label: 'nums' });
  const m = v.map('m', { label: 'count' });
  const cnt = new Map<number, number>();
  v.say('Every approach starts by counting how often each number appears, with a hash map. That is linear.');
  A.forEach((x, i) => {
    cnt.set(x, (cnt.get(x) ?? 0) + 1);
    a.clearTones().tone(i, 'active');
    m.clearTones().put(x, cnt.get(x)!).tone(x, 'active');
    v.hold(i < 3 ? 600 : 300);
  });
  a.clearTones();
  m.clearTones();
  const entries = [...cnt.entries()];
  v.eq(`counts: ${entries.map(([x, c]) => `${x}→${c}`).join(', ')}`).say('Now the question is only: which keys have the largest counts?');

  v.chapter('brute', 'Brute force: sort the keys by count', { cx: 'O(n log n)', code: ['count', 'sort distinct keys by count, descending', 'take the first k'] });
  v.eq('sorts all distinct keys', 'warn').say('Sorting all distinct keys by count costs up to n log n.');

  v.chapter('better', 'Better: min-heap of size k', { cx: 'O(n log k)', code: ['for (key, c) in counts:', '  push (c, key) into a min-heap', '  if size > k: pop    # least frequent'] });
  v.clear();
  const cmpMap = new Map<string, number>();
  const h = v.heap('h', { label: `min-heap by count, size ≤ ${K}`, cmp: (x, y) => (cmpMap.get(String(x)) ?? 0) - (cmpMap.get(String(y)) ?? 0) });
  const m2 = v.map('m', { label: 'count' });
  entries.forEach(([x, c]) => m2.put(x, c));
  let told = false;
  v.say(`Walk through the counts and keep the ${words(K)} most frequent in a min-heap ordered by count. The least frequent member sits on top, ready to be evicted.`);
  entries.forEach(([x, c]) => {
    const label = `${x} (×${c})`;
    cmpMap.set(label, c);
    m2.clearTones().tone(x, 'active');
    h.push(label);
    v.line(1).eq(`push ${label}`).hold(600);
    if (h.size > K) {
      const out = h.pop();
      v.line(2).eq(`size > ${K} → pop ${out}`, 'bad');
      if (!told) { v.say(`Three in the heap: pop the least frequent, ${words(Number(String(out).split(' ')[0]))}.`); told = true; } else v.hold(700);
    }
  });
  m2.clearTones();
  v.eq(`heap: ${h.values.join(', ')}`, 'ok').say(`The heap holds the answer. Each operation costs log k.`);

  v.chapter('optimal', 'Optimal: bucket sort by frequency', { cx: 'O(n)', code: ['bucket[c] = keys that appear exactly c times   (c ≤ n)', 'for c from n down to 1:', '  take keys from bucket[c] until we have k'] });
  v.clear();
  const n = A.length;
  const buckets: string[][] = Array.from({ length: n + 1 }, () => []);
  entries.forEach(([x, c]) => buckets[c].push(String(x)));
  const b = v.array('b', buckets.map(() => null), { label: 'bucket[count] = keys with that count' });
  v.say(`A count can never exceed n, the array length. So make n plus one buckets, one per possible count, and drop each key into the bucket of its count. No comparison sorting at all.`);
  entries.forEach(([x, c]) => {
    b.set(c, buckets[c].join(',')).clearTones().tone(c, 'active');
    v.line(0).eq(`${x} appears ${c}× → bucket[${c}]`).hold(600);
  });
  b.clearTones();
  const res: number[] = [];
  v.eq('scan buckets from the highest count down').say('Now walk the buckets from the highest count down, collecting keys until we have k.');
  for (let c = n; c >= 1 && res.length < K; c--) {
    if (!buckets[c].length) continue;
    b.tone(c, 'ok');
    for (const x of buckets[c]) if (res.length < K) res.push(Number(x));
    v.line(1, 2).eq(`bucket[${c}] → take ${buckets[c].join(', ')} · result [${res.join(', ')}]`, 'ok').hold(800);
  }
  v.eq(`[${res.join(', ')}]`, 'ok').say(`The result is ${res.map(words).join(' and ')}. Counting, bucketing and the scan are each linear.`);
  v.answer(topk(A, K));

  recap(v, [{ name: 'Sort by count', time: 'O(n log n)', space: 'O(n)' }, { name: 'Min-heap of size k', time: 'O(n log k)', space: 'O(n)' }, { name: 'Bucket sort', time: 'O(n)', space: 'O(n)' }], 'Count, then rank by count: sort, heap of size k, or buckets.', ['Top k by frequency → count + heap or buckets'], 'Frequencies are bounded by n, so they can be bucket indexes.');
  return v.build();
}

const problem: Problem = {
  slug: 'top-k-frequent-elements',
  statement: 'Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order. The answer is unique.',
  examples: [{ input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]' }, { input: 'nums = [1], k = 1', output: '[1]' }],
  constraints: ['1 ≤ n ≤ 10⁵', 'k is in the range [1, number of distinct elements]', 'the answer is unique'],
  hints: ['Count with a hash map first.', 'A frequency is at most n: use it as an index.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sort by count', idea: 'Count, sort keys by count descending, take k.', time: 'O(n log n)', space: 'O(n)', bottleneck: 'Sorts every distinct key.' },
    { id: 'better', kind: 'better', name: 'Min-heap of size k', idea: 'Push (count, key); pop when size exceeds k.', time: 'O(n log k)', space: 'O(n)', bottleneck: 'Log factor.' },
    { id: 'optimal', kind: 'optimal', name: 'Bucket sort', idea: 'bucket[count] lists keys; scan from high counts.', time: 'O(n)', space: 'O(n)' },
  ],
  takeaway: 'Counts ≤ n → **bucket sort**.',
  video,
  videoArgs: [A, K],
  judge: {
    type: 'fn', fn: 'topKFrequent', params: ['int[]', 'int'], ret: 'int[]', cmp: 'sorted',
    tests: [{ args: [[1, 1, 1, 2, 2, 3], 2], out: [1, 2] }, { args: [[1], 1], out: [1] }, { args: [A, K], out: [4, 1] }, { args: [[-1, -1, 5], 1], out: [-1] }],
    gen: (r: Rng) => {
      const d = r.int(1, 6), k = r.int(1, d);
      const vals = r.shuffle(Array.from({ length: 20 }, (_, i) => i - 5)).slice(0, d);
      const freq = r.shuffle(Array.from({ length: d }, (_, i) => i + 1));
      const a: number[] = [];
      vals.forEach((x, i) => { for (let t = 0; t < freq[i]; t++) a.push(x); });
      return [r.shuffle(a), k];
    },
    ref: (a: number[], k: number) => topk(a, k),
  },
};

export default problem;
