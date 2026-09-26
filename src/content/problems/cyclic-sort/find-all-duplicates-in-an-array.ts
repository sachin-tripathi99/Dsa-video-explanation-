import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [4, 3, 2, 7, 8, 2, 3, 1];
const dups = (a: number[]) => { const c = new Map<number, number>(); a.forEach((x) => c.set(x, (c.get(x) ?? 0) + 1)); return [...c].filter(([, k]) => k === 2).map(([x]) => x).sort((x, y) => x - y); };

function video() {
  const v = new Video('find-all-duplicates', 'Find All Duplicates in an Array');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'values in 1..n; each appears once or twice' });
  v.say('Each value between one and n appears once or twice. Return all values that appear twice, in linear time and constant extra space.');
  v.eq(`answer: [${dups(A).join(', ')}]`);

  v.chapter('brute', 'Brute force: a hash set', { cx: 'O(n) · O(n)', code: ['for x: if x in seen: output x else seen.add(x)'] });
  v.eq('extra memory', 'warn');

  v.chapter('optimal', 'Optimal: mark visits with a minus sign', { cx: 'O(n) · O(1) extra', code: ['for x in a:', '  j = |x| − 1', '  if a[j] < 0: output |x|    # visited before', '  else: a[j] = −a[j]'] });
  v.clear();
  const a = v.array('a', [...A], { label: 'negative at index j = the value j + 1 was seen' });
  const c = [...A];
  const out = v.array('out', [], { label: 'duplicates' });
  let told = 0;
  v.say('Use the sign of a of j as a “seen” flag for the value j plus one. Values stay recoverable with absolute value.');
  for (let i = 0; i < c.length; i++) {
    const x = Math.abs(c[i]);
    const j = x - 1;
    a.clearTones().ptr('i', i).tone(j, 'cmp');
    if (c[j] < 0) {
      out.push(x).tone(out.length - 1, 'ok');
      a.tone(j, 'bad');
      v.line(2).eq(`|a[${i}]| = ${x} → a[${j}] already negative → ${x} is a duplicate`, 'ok');
      v.say(`Now value ${words(x)} again: a of ${words(j)} is already negative. ${words(x)} has been seen before, so it is a duplicate.`);
    } else {
      c[j] = -c[j];
      a.set(j, c[j]);
      v.line(3).eq(`|a[${i}]| = ${x} → flip a[${j}] to ${c[j]}`);
      if (told === 0) { v.say('Value four: flip the sign at index three. It now means “four has been seen”.'); told++; }
      else v.hold(500);
    }
  }
  a.noPtr().clearTones();
  v.answer(dups(A));
  v.eq('one pass, the array itself stores the flags', 'ok');

  recap(v, [{ name: 'Hash set', time: 'O(n)', space: 'O(n)' }, { name: 'Sign marking', time: 'O(n)', space: 'O(1)' }], 'Negative a[x − 1] means “x already seen”.', ['Values 1..n, O(1) space → encode flags in signs'], 'When values are indices, a sign bit is a free boolean per index.');
  return v.build();
}

const problem: Problem = {
  slug: 'find-all-duplicates-in-an-array',
  statement: 'Given an integer array `nums` of length `n` where all integers are in `[1, n]` and each appears **once or twice**, return an array of all the integers that appear twice. Use O(n) time and only constant auxiliary space.',
  examples: [{ input: 'nums = [4,3,2,7,8,2,3,1]', output: '[2,3]' }, { input: 'nums = [1,1,2]', output: '[1]' }, { input: 'nums = [1]', output: '[]' }],
  constraints: ['1 ≤ n ≤ 10⁵', '1 ≤ nums[i] ≤ n'],
  hints: ['Use nums[x − 1] to remember that x was seen.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Hash set', idea: 'Report values already in the set.', time: 'O(n)', space: 'O(n)', bottleneck: 'Extra set.' },
    { id: 'optimal', kind: 'optimal', name: 'Sign marking', idea: 'For each x, j = |x| − 1: if nums[j] < 0 report |x|, else negate nums[j].', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Signs as flags: **a[x − 1] < 0 ⇔ x seen**.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'findDuplicates', params: ['int[]'], ret: 'List<Integer>', cmp: 'sorted',
    tests: [{ args: [[4, 3, 2, 7, 8, 2, 3, 1]], out: [2, 3] }, { args: [[1, 1, 2]], out: [1] }, { args: [[1]], out: [] }],
    gen: (r: Rng) => { const n = r.int(1, 10); const vals = r.shuffle(Array.from({ length: n }, (_, i) => i + 1)); const a: number[] = []; for (const x of vals) { if (a.length >= n) break; a.push(x); if (a.length < n && r.chance(0.4)) a.push(x); } return [r.shuffle(a)]; },
    ref: (a: number[]) => dups(a),
  },
};

export default problem;
