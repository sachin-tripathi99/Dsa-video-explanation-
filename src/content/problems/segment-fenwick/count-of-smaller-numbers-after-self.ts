import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { fenSubs, fenQuery, fenAdd } from '../../segviz';

const A = [5, 2, 6, 1, 3];
function smaller(a: number[]) { return a.map((x, i) => a.slice(i + 1).filter((y) => y < x).length); }
function smallerFast(a: number[]) {
  const vals = [...new Set(a)].sort((x, y) => x - y);
  const rk = new Map(vals.map((x, i) => [x, i + 1]));
  const t = Array(vals.length + 1).fill(0);
  const res = Array(a.length).fill(0);
  for (let i = a.length - 1; i >= 0; i--) {
    const r = rk.get(a[i])!;
    for (let x = r - 1; x > 0; x -= x & -x) res[i] += t[x];
    for (let x = r; x < t.length; x += x & -x) t[x]++;
  }
  return res;
}
const BIG = Array.from({ length: 30000 }, (_, i) => 10000 - ((i * 7919) % 20001));

function video() {
  const v = new Video('count-of-smaller-numbers-after-self', 'Count of Smaller Numbers After Self');
  const n = A.length;
  const ans = smaller(A);
  v.chapter('intro', 'The problem');
  const a0 = v.array('a', A, { label: 'nums (counts underneath)' });
  a0.subs(ans);
  v.say('For every element, count how many elements to its right are smaller. For five, the smaller ones to its right are two, one and three: three of them.');
  v.eq(`answer = [${ans.join(', ')}]`, 'ok');

  v.chapter('brute', 'Brute force: scan everything to the right', { cx: 'O(n²)', code: ['for i in 0 .. n − 1:', '  count j > i with nums[j] < nums[i]'] });
  v.clear();
  const ba = v.array('a', A, { label: 'nums' });
  ba.tone(0, 'active');
  for (let j = 1; j < n; j++) ba.tone(j, A[j] < A[0] ? 'ok' : 'dim');
  v.line(1).eq(`nums[0] = ${A[0]}: ${ans[0]} smaller to the right`).say('For each element, look at everything after it. That is n squared comparisons: far too slow for a hundred thousand elements.');

  v.chapter('optimal', 'Optimal: scan from the right with a Fenwick tree', { cx: 'O(n log n)', code: ['for i = n − 1 down to 0:', '  r = rank of nums[i] (1-based)', '  ans[i] = prefix(r − 1)', '  add(r, 1)'] });
  v.clear();
  const vals = [...new Set(A)].sort((x, y) => x - y);
  const rank = (x: number) => vals.indexOf(x) + 1;
  const oa = v.array('a', A, { label: 'nums (answers underneath)' });
  oa.subs(A.map(() => ''));
  const cnt = v.array('c', vals.map(() => 0), { label: 'how many of each value seen so far (by rank)', showIdx: false });
  cnt.subs(vals.map((x, k) => `${x} · r${k + 1}`));
  const T = Array(vals.length + 1).fill(0);
  const f = v.array('f', T.slice(1), { label: 'Fenwick tree over ranks', showIdx: false });
  f.subs(fenSubs(vals.length));
  v.line(0, 1).say('Flip the question. Walk from right to left and keep a record of every value already passed: those are exactly the elements to the right. Then “how many smaller” becomes “how many seen values are below mine”, a prefix sum over values. Values can be huge, so replace each by its rank among the sorted distinct values.');
  const res = Array(n).fill('');
  const counts = vals.map(() => 0);
  for (let i = n - 1; i >= 0; i--) {
    const r = rank(A[i]);
    oa.clearTones().ptr('i', i).tone(i, 'active');
    cnt.clearTones();
    for (let k = 0; k < r - 1; k++) cnt.tone(k, 'cmp');
    const got = fenQuery(v, f, T, r - 1, {
      line: [2],
      eqPrefix: `nums[${i}] = ${A[i]}, rank ${r}: `,
      say: (vis, tot) => {
        if (i === n - 1) return `Start at the right end: ${words(A[i])}, rank ${words(r)}. Nothing has been seen yet, so zero smaller values.`;
        if (tot >= 2 && vis.length) return `${words(A[i])} has rank ${words(r)}. Ask the Fenwick tree for the count of ranks one to ${words(r - 1)}: ${vis.length === 1 ? 'cell' : 'cells'} ${vis.map(words).join(' and ')}, giving ${words(tot)}.`;
        return undefined;
      },
    });
    res[i] = got;
    oa.subs(res);
    counts[r - 1]++;
    cnt.clearTones().set(r - 1, counts[r - 1]).tone(r - 1, 'active');
    fenAdd(v, f, T, r, 1, {
      line: [3],
      say: (vis) => (i === n - 1 ? `Then record it: add one at rank ${words(r)}. The Fenwick tree updates cells ${vis.map(words).join(' and ')}, the blocks that contain rank ${words(r)}.` : undefined),
      hold: 600,
    });
  }
  oa.clearTones().noPtr();
  f.clearTones();
  v.eq(`answer = [${res.join(', ')}]`, 'ok').say('Every element did one query and one update, each order log n. Sorting for the ranks is n log n too.');
  v.answer(ans);

  recap(v, [{ name: 'Scan right for each', time: 'O(n²)', space: 'O(1)' }, { name: 'Fenwick over ranks, right to left', time: 'O(n log n)', space: 'O(n)' }], 'Counting smaller elements seen so far = prefix sum over value ranks.', ['“How many smaller / larger to the right” → BIT over ranks', 'Merge sort with indices also works'], 'Duplicates share a rank; query rank − 1 for strictly smaller.');
  return v.build();
}

const problem: Problem = {
  slug: 'count-of-smaller-numbers-after-self',
  statement: 'Given an integer array `nums`, return an integer array `counts` where `counts[i]` is the number of smaller elements to the right of `nums[i]`.',
  examples: [{ input: 'nums = [5,2,6,1]', output: '[2,1,1,0]' }, { input: 'nums = [-1]', output: '[0]' }, { input: 'nums = [-1,-1]', output: '[0,0]' }],
  constraints: ['1 ≤ nums.length ≤ 10⁵', '−10⁴ ≤ nums[i] ≤ 10⁴'],
  hints: ['Process from the right.', 'Count seen values below the current one with a Fenwick tree over ranks.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Scan right', idea: 'For each i, count smaller elements after it.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Quadratic.' },
    { id: 'optimal', kind: 'optimal', name: 'Fenwick over ranks', idea: 'Right to left: answer = prefix(rank − 1), then add(rank, 1).', time: 'O(n log n)', space: 'O(n)' },
  ],
  takeaway: 'Scan from the right, **count seen values** with a Fenwick tree.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'countSmaller', params: ['int[]'], ret: 'List<Integer>',
    tests: [{ args: [[5, 2, 6, 1]], out: [2, 1, 1, 0] }, { args: [[-1]], out: [0] }, { args: [[-1, -1]], out: [0, 0] }, { args: [A], out: smaller(A) }, { args: [[3, 3, 1, 2, 3, -10000, 10000]], out: [3, 3, 1, 1, 1, 0, 0] }, { args: [BIG], out: smallerFast(BIG), big: true }],
    gen: (r: Rng) => [r.ints(r.int(1, 12), -5, 5)],
    ref: (a: number[]) => smaller(a),
  },
};

export default problem;
