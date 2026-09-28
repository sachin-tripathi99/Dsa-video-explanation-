import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { fenSubs, fenQuery, fenAdd } from '../../segviz';

const A = [5, 1, 4, 2, 1];
function pairs(a: number[]) { let c = 0; for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (a[i] > 2 * a[j]) c++; return c; }
const BIG = Array.from({ length: 40000 }, (_, i) => ((i * 7919) % 40009) - 20000);
function pairsFast(a: number[]) {
  const vals = [...new Set(a)].sort((x, y) => x - y);
  const upper = (x: number) => { let lo = 0, hi = vals.length; while (lo < hi) { const m = (lo + hi) >> 1; if (vals[m] <= x) lo = m + 1; else hi = m; } return lo; };
  const t = Array(vals.length + 1).fill(0);
  let c = 0;
  a.forEach((x, j) => {
    let below = 0;
    for (let k = upper(2 * x); k > 0; k -= k & -k) below += t[k];
    c += j - below;
    for (let r = upper(x); r < t.length; r += r & -r) t[r]++;
  });
  return c;
}

function video() {
  const v = new Video('reverse-pairs', 'Reverse Pairs');
  const n = A.length;
  const ans = pairs(A);
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'nums' });
  v.say('Count the pairs i before j where nums of i is more than twice nums of j. Like counting inversions, but with a factor of two.');
  const list: string[] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (A[i] > 2 * A[j]) list.push(`(${A[i]}, ${A[j]})`);
  v.eq(`${list.join(' ')} → ${ans}`, 'ok');

  v.chapter('brute', 'Brute force: check every pair', { cx: 'O(n²)', code: ['for i < j:', '  if nums[i] > 2 · nums[j]: count += 1'] });
  v.eq('n = 5 · 10⁴ → 1.25 · 10⁹ pairs', 'bad').say('Checking all pairs is n squared: over a billion pairs for fifty thousand elements.');

  v.chapter('optimal', 'Optimal: count earlier values above 2x with a Fenwick tree', { cx: 'O(n log n)', code: ['vals = sorted distinct nums (ranks)', 'for j in 0 .. n − 1:', '  k = number of vals ≤ 2 · nums[j]', '  count += seen − prefix(k)', '  add(rank(nums[j]), 1); seen += 1'] });
  v.clear();
  const vals = [...new Set(A)].sort((x, y) => x - y);
  const oa = v.array('a', A, { label: 'nums (pairs ending here underneath)' });
  oa.subs(A.map(() => ''));
  const cnt = v.array('c', vals.map(() => 0), { label: 'earlier values seen (by rank)', showIdx: false });
  cnt.subs(vals.map((x, k) => `${x} · r${k + 1}`));
  const T = Array(vals.length + 1).fill(0);
  const f = v.array('f', T.slice(1), { label: 'Fenwick tree over ranks', showIdx: false });
  f.subs(fenSubs(vals.length));
  const vars = v.vars('v', { seen: 0, count: 0 });
  v.line(0).say('Walk left to right. For each j, the pairs ending at j are the earlier values above twice nums of j. Record earlier values in a Fenwick tree over ranks. Then “above two x” is everything seen minus a prefix: the values at most two x.');
  const counts = vals.map(() => 0);
  const per: (number | string)[] = A.map(() => '');
  let total = 0;
  A.forEach((x, j) => {
    const k = vals.filter((y) => y <= 2 * x).length;
    oa.clearTones().ptr('j', j).tone(j, 'active');
    cnt.clearTones();
    for (let q = k; q < vals.length; q++) if (counts[q]) cnt.tone(q, 'ok');
    const seen = j;
    const below = fenQuery(v, f, T, k, {
      line: [2, 3],
      eqPrefix: `2 · ${x} = ${2 * x}, k = ${k}: `,
      say: (_vis, tot) => {
        const got = seen - tot;
        if (j === 0) return `The first value, ${words(x)}, has nothing before it.`;
        if (j === 1) return `Next, ${words(x)}. Twice it is ${words(2 * x)}, and ${words(k)} distinct value${k === 1 ? ' is' : 's are'} at most that, so ask for prefix ${words(k)}: ${words(tot)} earlier value${tot === 1 ? '' : 's'} there. ${words(seen)} seen minus ${words(tot)} leaves ${words(got)} pair${got === 1 ? '' : 's'}: the five.`;
        if (j === n - 1) return `The last value, ${words(x)}: ${words(seen)} values seen, ${words(tot)} of them at most ${words(2 * x)}, so ${words(got)} pairs, with the five and the four.`;
        return undefined;
      },
    });
    const got = seen - below;
    total += got;
    per[j] = got;
    oa.subs(per);
    vars.set({ seen, count: total }, got ? 'ok' : undefined);
    const r = vals.indexOf(x) + 1;
    counts[r - 1]++;
    cnt.clearTones().set(r - 1, counts[r - 1]).tone(r - 1, 'active');
    fenAdd(v, f, T, r, 1, { line: [4], hold: 550, say: () => (j === 0 ? `Record it at its rank, ${words(r)}.` : undefined) });
  });
  oa.clearTones().noPtr();
  f.clearTones();
  v.eq(`total = ${per.join(' + ')} = ${total}`, 'ok').say(`Adding the pairs ending at each position gives ${words(total)}. Each step is a binary search for k, a query and an update: order n log n overall.`);
  v.answer(ans);

  recap(v, [{ name: 'All pairs', time: 'O(n²)', space: 'O(1)' }, { name: 'Fenwick over ranks', time: 'O(n log n)', space: 'O(n)' }], 'Pairs ending at j = earlier values above 2·nums[j] = seen − prefix(k).', ['Inversion-style counting → BIT over ranks or merge sort'], 'Use long for 2 · nums[j]: it overflows int.');
  return v.build();
}

const problem: Problem = {
  slug: 'reverse-pairs',
  statement: 'Given an integer array `nums`, return the number of reverse pairs. A reverse pair is a pair `(i, j)` where `0 ≤ i < j < nums.length` and `nums[i] > 2 * nums[j]`.',
  examples: [{ input: 'nums = [1,3,2,3,1]', output: '2' }, { input: 'nums = [2,4,3,5,1]', output: '3' }],
  constraints: ['1 ≤ nums.length ≤ 5 · 10⁴', '−2³¹ ≤ nums[i] ≤ 2³¹ − 1'],
  hints: ['For each j, count earlier values greater than 2 · nums[j].', 'Fenwick tree over sorted values; binary search the threshold.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'All pairs', idea: 'Check nums[i] > 2 · nums[j] for every i < j.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Quadratic.' },
    { id: 'optimal', kind: 'optimal', name: 'Fenwick over ranks', idea: 'Left to right: count += seen − prefix(#vals ≤ 2x); then add x.', time: 'O(n log n)', space: 'O(n)' },
  ],
  takeaway: 'Count earlier values above a **threshold** with a Fenwick tree.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'reversePairs', params: ['int[]'], ret: 'int',
    tests: [{ args: [[1, 3, 2, 3, 1]], out: 2 }, { args: [[2, 4, 3, 5, 1]], out: 3 }, { args: [A], out: 4 }, { args: [[2147483647, 2147483647, 2147483647, 2147483647, 2147483647, 2147483647]], out: 0 }, { args: [[-5, -5]], out: 1 }, { args: [[2147483647, -2147483648, 0, 1073741824, 1073741823]], out: 3 }, { args: [BIG], out: pairsFast(BIG), big: true }],
    gen: (r: Rng) => [r.ints(r.int(1, 12), -8, 8)],
    ref: (a: number[]) => pairs(a),
  },
};

export default problem;
