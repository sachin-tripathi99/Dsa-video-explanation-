import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [1, 3, 4, 2, 2];

function floyd(a: number[]) {
  let s = a[0], f = a[a[0]];
  while (s !== f) { s = a[s]; f = a[a[f]]; }
  s = 0;
  while (s !== f) { s = a[s]; f = a[f]; }
  return s;
}

function video() {
  const v = new Video('find-duplicate', 'Find the Duplicate Number');
  const n = A.length;
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: `n + 1 = ${n} numbers, each in 1..${n - 1}` });
  v.say(`There are n plus one numbers, each between one and n, so by the pigeonhole principle at least one repeats. Exactly one value is repeated, possibly several times. Find it without modifying the array and with constant extra space.`);

  v.chapter('brute', 'Brute force: hash set (or sort a copy)', { cx: 'O(n) · O(n) extra', code: ['seen = {}', 'for x in a: if x in seen: return x; seen.add(x)'] });
  v.eq('extra memory is not allowed; sorting would modify the array', 'warn').say('A hash set finds it immediately but uses extra memory. Sorting or cyclic sort would move elements, which is not allowed here.');

  v.chapter('better', 'Better: binary search on the value', { cx: 'O(n log n) · O(1)', code: ['for a candidate m: count = how many values are ≤ m', 'count > m → the duplicate is ≤ m'] });
  v.eq('pigeonhole on a value range, halving it each time', 'ok').say('Binary search the value: if more than m numbers are at most m, the duplicate is at most m. Constant space, n log n time.');

  v.chapter('optimal', "Optimal: Floyd's cycle detection on i → a[i]", { cx: 'O(n) · O(1)', code: ['treat index i as a node pointing to a[i]', 'slow = a[slow]; fast = a[a[fast]] until they meet', 'slow = 0; move both one step until they meet', 'the meeting point is the duplicate'] });
  v.clear().layout('row');
  const pos: [number, number][] = [[8, 50], [32, 20], [60, 20], [85, 50], [60, 82]];
  const nodes = A.map((_, i) => ({ id: String(i), label: String(i), x: pos[i][0], y: pos[i][1] }));
  const edges = A.map((x, i) => ({ a: String(i), b: String(x) }));
  const g = v.graph('g', nodes, edges, { label: 'node i → node a[i]', directed: true });
  v.array('a', A, { label: 'a' });
  v.say('Here is a different view. Treat each index as a node with one arrow, from i to a of i. Starting from node zero and following arrows, because two indices point to the same value, the path must eventually loop. The node where the loop begins is pointed to twice: it is the duplicate.');
  let s = 0;
  let f = 0;
  let step = 0;
  do {
    s = A[s];
    f = A[A[f]];
    g.clearTones().tone(String(s), 'active').tone(String(f), 'warn').badge(String(s), 'slow').badge(String(f), s === f ? 'slow+fast' : 'fast');
    for (const nd of nodes) if (nd.id !== String(s) && nd.id !== String(f)) g.badge(nd.id, null);
    v.line(1).eq(`slow → ${s}, fast → ${f}${s === f ? ' · meet!' : ''}`, s === f ? 'ok' : undefined);
    if (step === 0) v.say('Phase one: slow moves one arrow per step, fast moves two. Inside the loop, fast gains one step each time, so they must meet.');
    else v.hold(800);
    step++;
  } while (s !== f);
  g.badge(String(s), null);
  let p = 0;
  let q = s;
  v.say(`They meet at node ${words(s)}. Phase two: put one pointer back at the start, zero, and move both one step at a time. A little algebra shows they meet exactly at the loop entrance.`);
  while (p !== q) {
    p = A[p];
    q = A[q];
    g.clearTones().tone(String(p), 'active').tone(String(q), 'warn');
    v.line(2).eq(`p → ${p}, q → ${q}${p === q ? ' · meet' : ''}`, p === q ? 'ok' : undefined).hold(800);
  }
  g.clearTones().tone(String(p), 'ok');
  v.line(3).eq(`duplicate = ${p}`, 'ok').say(`They meet at node ${words(p)}, the start of the loop. The duplicate is ${words(p)}. The array was never modified, and we used two variables.`);
  v.answer(floyd(A));

  recap(v, [{ name: 'Hash set', time: 'O(n)', space: 'O(n)' }, { name: 'Binary search on value', time: 'O(n log n)', space: 'O(1)' }, { name: "Floyd's cycle detection", time: 'O(n)', space: 'O(1)' }], 'Values as pointers: the duplicate is where the cycle begins.', ['Read-only array + values in 1..n → i → a[i] linked structure', 'Cycle start = Floyd phase two'], 'An array of indices is secretly a linked list. Floyd’s algorithm finds where its cycle starts.');
  return v.build();
}

const problem: Problem = {
  slug: 'find-the-duplicate-number',
  statement: 'Given an array `nums` of `n + 1` integers where each integer is in the range `[1, n]`, there is only one repeated number (it may appear more than twice). Return it **without modifying** the array and using only constant extra space.',
  examples: [{ input: 'nums = [1,3,4,2,2]', output: '2' }, { input: 'nums = [3,1,3,4,2]', output: '3' }, { input: 'nums = [3,3,3,3,3]', output: '3' }],
  constraints: ['1 ≤ n ≤ 10⁵', 'exactly one value repeats'],
  hints: ['Think of nums as a function i → nums[i].', 'Following it from 0 must enter a cycle. Where does the cycle start?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Hash set', idea: 'Return the first value seen twice.', time: 'O(n)', space: 'O(n)', bottleneck: 'Extra memory.' },
    { id: 'better', kind: 'better', name: 'Binary search on value', idea: 'For candidate m, count values ≤ m; if count > m the duplicate is ≤ m.', time: 'O(n log n)', space: 'O(1)' },
    { id: 'optimal', kind: 'optimal', name: "Floyd's cycle detection", idea: 'slow = a[slow], fast = a[a[fast]] until equal; reset one to 0 and step both until equal.', time: 'O(n)', space: 'O(1)' },
  ],
  pitfalls: ['Cyclic sort and sorting both modify the array, which the problem forbids.'],
  takeaway: 'Index → value links form a **linked list with a cycle**; its entrance is the duplicate.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'findDuplicate', params: ['int[]'], ret: 'int',
    tests: [{ args: [[1, 3, 4, 2, 2]], out: 2 }, { args: [[3, 1, 3, 4, 2]], out: 3 }, { args: [[3, 3, 3, 3, 3]], out: 3 }],
    gen: (r: Rng) => { const n = r.int(1, 8); const d = r.int(1, n); const base = Array.from({ length: n }, (_, i) => i + 1); const extra = r.int(1, 3); const a = [...base]; for (let k = 0; k < extra; k++) a.push(d); const out = a.slice(0, n + 1); while (out.filter((x) => x === d).length < 2) out[out.findIndex((x) => x !== d)] = d; return [r.shuffle(out)]; },
    ref: (a: number[]) => { const s = new Set<number>(); for (const x of a) { if (s.has(x)) return x; s.add(x); } return -1; },
  },
};

export default problem;
