import type { Problem } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [3, 8, 1, 6, 4];
const T = 10;

function video() {
  const v = new Video('two-sum', 'Two Sum');
  v.chapter('intro', 'The problem');
  const a = v.array('nums', A, { label: `nums · target = ${T}` });
  v.say('The most famous interview problem. Return the indices of the two numbers that add up to the target. Exactly one pair works, and you may not use the same element twice.');
  a.tone([3, 4], 'ok');
  v.eq('6 + 4 = 10 → [3, 4]', 'ok').hold(800);
  a.clearTones();

  v.chapter('brute', 'Brute force: every pair', { cx: 'O(n²)', code: ['for i in 0..n-1:', '  for j in i+1..n-1:', '    if a[i] + a[j] == target: return [i, j]'] });
  let c = 0;
  outer: for (let i = 0; i < A.length; i++) {
    for (let j = i + 1; j < A.length; j++) {
      c++;
      const hit = A[i] + A[j] === T;
      a.clearTones().ptrs({ i, j }).tone([i, j], hit ? 'ok' : 'cmp');
      v.counter(`checks: ${c}`).line(2).eq(`${A[i]} + ${A[j]} = ${A[i] + A[j]}`, hit ? 'ok' : 'bad');
      if (c === 1) v.say(`Check every pair. ${words(A[i])} plus ${words(A[j])} is ${words(A[i] + A[j])}. Not ten.`);
      else if (hit) v.say(`${words(A[i])} plus ${words(A[j])} is ten, after ${words(c)} checks. For n numbers that is up to n squared over two checks.`);
      else v.hold(420);
      if (hit) break outer;
    }
  }
  a.noPtr();

  v.chapter('better', 'Better: sort + two pointers', { cx: 'O(n log n)', code: ['pairs = sorted (value, index)', 'L, R at both ends', 'move L or R until the sum hits target'] });
  v.clear();
  const sorted = A.map((x, i) => [x, i] as [number, number]).sort((p, q) => p[0] - q[0]);
  const b = v.array('s', sorted.map((p) => p[0]), { label: 'sorted values (original index below)' });
  b.subs(sorted.map((p) => `i=${p[1]}`));
  let L = 0;
  let R = sorted.length - 1;
  while (L < R) {
    const s = sorted[L][0] + sorted[R][0];
    b.clearTones().ptrs({ L, R }).tone([L, R], s === T ? 'ok' : 'cmp');
    v.line(2).eq(`${sorted[L][0]} + ${sorted[R][0]} = ${s}`, s === T ? 'ok' : 'bad');
    if (L === 0 && R === sorted.length - 1) v.say(`If we sort the values, remembering their original indices, the two-pointer trick from Two Sum Two works. ${words(sorted[L][0])} plus ${words(sorted[R][0])} is ${words(s)}, too ${s > T ? 'big, so R moves left' : 'small, so L moves right'}.`);
    else if (s === T) v.say(`Found ${words(sorted[L][0])} plus ${words(sorted[R][0])}. Their original indices are ${words(sorted[L][1])} and ${words(sorted[R][1])}. Sorting costs n log n.`);
    else v.hold(700);
    if (s === T) break;
    if (s > T) R--;
    else L++;
  }

  v.chapter('optimal', 'Optimal: one pass with a hash map', { cx: 'O(n)', code: ['seen = {}', 'for i, x in enumerate(nums):', '  if target − x in seen: return [seen[target − x], i]', '  seen[x] = i'] });
  v.clear().layout('row');
  const o = v.array('nums', A, { label: 'nums' });
  const m = v.map('seen', { label: 'seen: value → index' });
  let ans: number[] = [];
  for (let i = 0; i < A.length; i++) {
    const need = T - A[i];
    o.clearTones().ptr('i', i).tone(i, 'active');
    if (m.has(need)) {
      const j = Number(m.get(need));
      o.tone([j, i], 'ok');
      m.clearTones().tone(need, 'ok');
      v.line(2).eq(`need ${need} → seen at index ${j} → [${j}, ${i}]`, 'ok');
      v.say(`At ${words(A[i])}, we need ten minus ${words(A[i])}, which is ${words(need)}. It is in the map at index ${words(j)}. Done, in one pass.`);
      ans = [j, i];
      break;
    }
    m.put(A[i], i).clearTones().tone(A[i], 'active');
    v.line(3).eq(`need ${need} → not seen · store ${A[i]} → ${i}`);
    if (i === 0) v.say('Now the classic solution. For each number, ask: have I already seen its partner, target minus x? A hash map from value to index answers in O of one. If not, store the current number.');
    else v.hold(750);
  }
  v.note('O(n) time · O(n) space');
  v.answer(ans);

  recap(v, [{ name: 'Every pair', time: 'O(n²)', space: 'O(1)' }, { name: 'Sort + two pointers', time: 'O(n log n)', space: 'O(n)' }, { name: 'Hash map of complements', time: 'O(n)', space: 'O(n)' }], 'The hash map remembers every number seen so far, so the partner check is instant.', ['Looking for a partner / complement → hash map from value to index', 'Check before inserting, so an element is never paired with itself'], 'Whenever you are searching for a partner, remember what you have seen in a hash map.');
  return v.build();
}

const problem: Problem = {
  slug: 'two-sum',
  statement: 'Given an array `nums` and an integer `target`, return the **indices** of the two numbers that add up to `target`. Exactly one solution exists, and you may not use the same element twice. Any order is accepted.',
  examples: [
    { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
    { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    { input: 'nums = [3,3], target = 6', output: '[0,1]' },
  ],
  constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i], target ≤ 10⁹', 'Exactly one valid answer'],
  hints: ['For each x, the partner you need is target − x.', 'How can you check "have I seen target − x?" in O(1)?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every pair', idea: 'Check all pairs `i < j`.', time: 'O(n²)', space: 'O(1)', bottleneck: 'For each element we scan all others looking for one specific value.' },
    { id: 'better', kind: 'better', name: 'Sort with indices + two pointers', idea: 'Sort (value, index) pairs, then move two pointers inward like Two Sum II.', time: 'O(n log n)', space: 'O(n)', bottleneck: 'Sorting costs n log n; a hash map finds partners in O(1).' },
    { id: 'optimal', kind: 'optimal', name: 'One-pass hash map', idea: 'Map value → index. For each `x`, if `target − x` is in the map, return both indices; otherwise store `x`.', time: 'O(n)', space: 'O(n)' },
  ],
  pitfalls: ['Inserting before checking can pair an element with itself (e.g. target = 6, x = 3 once).', 'Sorting the array directly loses the original indices.'],
  takeaway: 'Searching for a **partner / complement**? Store what you have seen in a **hash map**.',
  video,
  videoArgs: [A, T],
  judge: {
    type: 'fn', fn: 'twoSum', params: ['int[]', 'int'], ret: 'int[]', cmp: 'sorted',
    tests: [{ args: [[2, 7, 11, 15], 9], out: [0, 1] }, { args: [[3, 2, 4], 6], out: [1, 2] }, { args: [[3, 3], 6], out: [0, 1] }, { args: [[-3, 4, 3, 90], 0], out: [0, 2] }],
    gen: (r) => {
      for (;;) {
        const a = r.ints(r.int(2, 12), -20, 20);
        const i = r.int(0, a.length - 2);
        const j = r.int(i + 1, a.length - 1);
        const t = a[i] + a[j];
        let pairs = 0;
        for (let x = 0; x < a.length; x++) for (let y = x + 1; y < a.length; y++) if (a[x] + a[y] === t) pairs++;
        if (pairs === 1) return [a, t];
      }
    },
    ref: (a: number[], t: number) => { for (let x = 0; x < a.length; x++) for (let y = x + 1; y < a.length; y++) if (a[x] + a[y] === t) return [x, y]; return []; },
  },
};

export default problem;
