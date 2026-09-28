import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';
import { segTree, segQuery, segUpdate, fenSubs, fenQuery, fenAdd } from '../../segviz';

const A = [2, 5, 1, 4, 9, 3];

function video() {
  const v = new Video('segment-and-fenwick-trees', 'Segment trees and Fenwick trees');
  const n = A.length;

  v.chapter('intro', 'Updates and range sums, both fast');
  const a0 = v.array('a', A, { label: 'a' });
  v.say('Picture a shop that records sales per day. Managers keep asking for the total over some range of days, and clerks keep correcting single days. We need both operations fast.');
  a0.win(1, 4, 'win', 'sum = 19');
  v.eq('plain array: update O(1), range sum O(n)', 'warn').say('With a plain array, a correction is instant but every range sum walks the whole range.');
  a0.noWin();
  const P = [0];
  A.forEach((x, i) => P.push(P[i] + x));
  const p0 = v.array('P', P, { label: 'prefix sums' });
  p0.toneRange(4, n, 'warn');
  a0.tone(3, 'active');
  v.eq('prefix sums: range sum O(1), update O(n)', 'warn').say('Prefix sums flip the trade-off: a range sum is one subtraction, but changing day three changes every prefix after it. We want order log n for both. The trick is to store sums of ranges of many sizes.');

  v.chapter('build', 'Segment tree: every node owns a range', { cx: 'O(n) build', code: ['build(k, lo, hi):', '  if lo == hi: sum[k] = a[lo]', '  build left half, right half', '  sum[k] = sum[2k] + sum[2k + 1]'] });
  v.clear();
  v.array('a', A, { label: 'a' });
  v.layout('col');
  let firstLeaf = true;
  segTree(v, 'st', A, {
    animate: true,
    hold: 380,
    line: [3],
    say: (k, lo, hi, val, leaf) => {
      if (leaf && firstLeaf) { firstLeaf = false; return 'The root owns the whole array. Each node splits its range in half and gives one half to each child, until a range is a single element: a leaf. The badge under each node is its range, the number inside is its sum.'; }
      if (k === 2 && !leaf) return `A parent's sum is just its two children added: range zero to two holds ${words(val)}.`;
      if (k === 1) return `The root holds the total, ${words(val)}. There are fewer than two n nodes, and each is computed once: linear build.`;
      return undefined;
    },
  });
  v.weight('st', 2.2);

  v.chapter('query', 'Query: take whole nodes, skip the rest', { cx: 'O(log n)', code: ['query(k, [lo, hi], l, r):', '  outside [l, r] → 0', '  inside [l, r] → sum[k]', '  else → query(left) + query(right)'] });
  v.clear();
  const qa = v.array('a', A, { label: 'a' });
  const S2 = segTree(v, 'st', A);
  v.layout('col').weight('st', 2.2);
  const q = segQuery(v, S2, 1, 4, {
    arr: qa,
    lines: { inside: [2], outside: [1], split: [3] },
    say: (c, lo, hi, val, first) => {
      if (c === 'split' && lo === 0 && hi === n - 1) return 'Sum from one to four. The root overlaps the query only partly, so ask both children.';
      if (c === 'outside' && first) return `Range ${words(lo)} lies completely outside the query: it contributes nothing and we do not go deeper.`;
      if (c === 'inside' && first) return `Range ${words(lo)} lies completely inside: take its stored sum, ${words(val)}, without looking below it.`;
      if (c === 'inside' && lo !== hi) return `Range three to four is inside as a whole: one node gives ${words(val)} for two elements. This is where the saving comes from.`;
      return undefined;
    },
  });
  v.eq(`sum(1, 4) = ${q.parts.join(' + ')} = ${q.total}`, 'ok').say(`The answer is ${q.parts.map(words).join(' plus ')}, which is ${words(q.total)}. On each level at most two nodes are split, so a query touches order log n nodes.`);

  v.chapter('update', 'Update: fix one path', { cx: 'O(log n)', code: ['update(k, [lo, hi], i, val):', '  walk down to the leaf for i', '  set the leaf to val', '  on the way back: sum[k] = sum[2k] + sum[2k + 1]'] });
  v.clear();
  const ua = v.array('a', A, { label: 'a' });
  const S3 = segTree(v, 'st', A);
  v.layout('col').weight('st', 2.2);
  segUpdate(v, S3, 3, 7, {
    arr: ua,
    lines: { down: [1], up: [3] },
    say: (lo, hi, val, leaf) => {
      if (lo < 0) return 'Set a of three to seven. Only the nodes whose range contains index three can change: one path from the root down to that leaf.';
      if (leaf) return 'Change the leaf from four to seven.';
      if (lo === 0 && hi === n - 1) return `Every parent on the path recomputes its sum from its two children, up to the root, now ${words(val)}. One path of length log n: the update is order log n too.`;
      return undefined;
    },
  });

  v.chapter('fenwick', 'Fenwick tree: the same idea, in one array', { cx: 'O(log n)', code: ['prefix(i): while i > 0:', '  s += t[i]; i −= i & −i', 'add(i, d): while i ≤ n:', '  t[i] += d; i += i & −i', 'sum(l, r) = prefix(r + 1) − prefix(l)'] });
  v.clear();
  const T = Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) for (let x = i; x <= n; x += x & -x) T[x] += A[i - 1];
  v.array('a', A, { label: 'a (0-based)' });
  const f = v.array('f', T.slice(1), { label: 't[1..n]: cell i covers the positions written under it (1-based)', showIdx: false });
  f.subs(fenSubs(n));
  v.say('A Fenwick tree, also called a binary indexed tree, keeps just an array. Cell i, counting from one, stores the sum of a block that ends at i, and the block length is the lowest set bit of i. Cell four, binary one zero zero, covers four positions; cell six, one one zero, covers two; odd cells cover one.');
  fenQuery(v, f, T, 5, {
    line: [0, 1],
    say: (vis, tot) => `To add up the first five positions, start at five, binary one zero one. Take t five, drop the lowest bit to get four, take t four, drop it again to reach zero. Just ${words(vis.length)} cells for a total of ${words(tot)}. At most one cell per bit: order log n.`,
  });
  const p1 = fenQuery(v, f, T, 1, { line: [4], eqPrefix: 'sum(1, 4) = prefix(5) − ', say: () => undefined, hold: 900 });
  v.eq(`sum(1, 4) = ${T[5] + T[4]} − ${p1} = ${T[5] + T[4] - p1}`, 'ok').say('Any range sum is a difference of two prefixes, just like prefix sums.');
  fenAdd(v, f, T, 1, 3, {
    line: [2, 3],
    say: (vis) => `To add three to a of zero, which is position one when counting from one, go the other way: add the lowest bit each time. One, two, four: exactly the ${words(vis.length)} cells whose blocks contain position one.`,
  });

  v.chapter('table', 'Which one to use');
  v.clear();
  v.table('t', ['Need', 'Use'], [
    ['prefix / range sums with point updates', 'Fenwick tree (shortest code)'],
    ['range min / max / gcd with updates', 'segment tree'],
    ['update a whole range at once', 'segment tree with lazy propagation'],
    ['count smaller / larger elements seen so far', 'Fenwick tree over value ranks'],
    ['array never changes', 'plain prefix sums'],
  ]);
  v.say('Both trees give order log n updates and queries. Fenwick trees are shorter to write and perfect for sums and counts. Segment trees handle any operation that combines two halves, like minimum or maximum.');
  return v.build();
}

const body = String.raw`
## The problem they solve

| Structure | Point update | Range sum |
|---|---|---|
| plain array | O(1) | O(n) |
| prefix sums | O(n) | O(1) |
| segment / Fenwick tree | **O(log n)** | **O(log n)** |

> Real-life picture: a company org chart where every manager knows the total sales of their team. To get the total for any group of branches, ask a few managers instead of every clerk. When one clerk’s number changes, only their chain of managers updates.

## Segment tree (recursive, sums)

\`\`\`java
class SegTree {
    int n; int[] sum;
    SegTree(int[] a) { n = a.length; sum = new int[4 * n]; build(1, 0, n - 1, a); }
    void build(int k, int lo, int hi, int[] a) {
        if (lo == hi) { sum[k] = a[lo]; return; }
        int mid = (lo + hi) / 2;
        build(2 * k, lo, mid, a); build(2 * k + 1, mid + 1, hi, a);
        sum[k] = sum[2 * k] + sum[2 * k + 1];
    }
    int query(int k, int lo, int hi, int l, int r) {
        if (r < lo || hi < l) return 0;                    // outside
        if (l <= lo && hi <= r) return sum[k];             // inside
        int mid = (lo + hi) / 2;
        return query(2 * k, lo, mid, l, r) + query(2 * k + 1, mid + 1, hi, l, r);
    }
    void update(int k, int lo, int hi, int i, int val) {
        if (lo == hi) { sum[k] = val; return; }
        int mid = (lo + hi) / 2;
        if (i <= mid) update(2 * k, lo, mid, i, val); else update(2 * k + 1, mid + 1, hi, i, val);
        sum[k] = sum[2 * k] + sum[2 * k + 1];
    }
}
\`\`\`

## Fenwick tree (1-based)

\`\`\`python
class Fenwick:
    def __init__(self, n):
        self.t = [0] * (n + 1)

    def add(self, i, d):            # position i (1-based) += d
        while i < len(self.t):
            self.t[i] += d
            i += i & -i

    def prefix(self, i):            # sum of positions 1..i
        s = 0
        while i > 0:
            s += self.t[i]
            i -= i & -i
        return s
\`\`\`

\`\`\`cpp
struct Fenwick {
    vector<long long> t;
    Fenwick(int n) : t(n + 1) {}
    void add(int i, long long d) { for (; i < (int)t.size(); i += i & -i) t[i] += d; }
    long long prefix(int i) { long long s = 0; for (; i > 0; i -= i & -i) s += t[i]; return s; }
};
\`\`\`

## Counting with a Fenwick tree

To count, for each element, how many smaller elements come after it: compress values to ranks 1..k, scan **right to left**, ask \`prefix(rank − 1)\`, then \`add(rank, 1)\`. The same scan counts inversions and reverse pairs.

## Pitfalls

- Segment tree arrays need size **4n** for the recursive layout.
- Fenwick trees are **1-based**: index 0 loops forever in \`add\`.
- Point *assignment* on a Fenwick tree: add \`val − old\`, and keep the old values in an array.
`;

const lesson: Lesson = {
  slug: 'segment-and-fenwick-trees',
  video,
  body,
  quiz: [
    { q: 'Prefix sums with frequent updates cost…', options: ['O(1) per update', 'O(log n) per update', 'O(n) per update', 'O(n²) per update'], answer: 2, why: 'Every later prefix changes.' },
    { q: 'A segment tree query takes whole nodes that are…', options: ['partly inside', 'completely inside the range', 'leaves only', 'on the left'], answer: 1, why: 'Fully covered nodes answer without going deeper.' },
    { q: 'Fenwick cell 12 (binary 1100) covers how many positions?', options: ['1', '2', '4', '12'], answer: 2, why: 'The lowest set bit of 12 is 4.' },
    { q: 'Range minimum with updates?', options: ['Prefix sums', 'Fenwick tree', 'Segment tree', 'Sorting'], answer: 2, why: 'Min cannot be undone by subtraction, so prefix differences fail; segment trees combine halves.' },
  ],
};

export default lesson;
