import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const A = [2, 2, 1, 1, 1, 2, 2];

function video() {
  const v = new Video('majority-element', 'Majority Element');
  v.chapter('intro', 'The problem');
  const a = v.array('nums', A, { label: 'nums' });
  v.say('One value appears more than half the time. Find it. Here, two appears four times out of seven.');

  v.chapter('brute', 'Brute force: count each value', { cx: 'O(n²)', code: ['for x in nums:', '  if count(x in nums) > n/2: return x'] });
  a.ptr('x', 0).tone(0, 'active');
  v.line(1).eq('count(2) = 4 > 3.5 → 2', 'ok').say('For each value, count how often it appears in the whole array. Counting is O of n, done for up to n values: O of n squared.');

  v.chapter('better', 'Better: count with a hash map', { cx: 'O(n)', code: ['counts = {}', 'for x in nums:', '  counts[x] += 1', '  if counts[x] > n/2: return x'] });
  v.clear();
  const b = v.array('nums', A, { label: 'nums' });
  const m = v.map('counts', { label: 'counts' });
  const cnt: Record<number, number> = {};
  A.forEach((x, i) => {
    cnt[x] = (cnt[x] ?? 0) + 1;
    m.put(x, cnt[x]).clearTones().tone(x, 'active');
    b.clearTones().ptr('i', i).tone(i, 'active');
    v.line(2);
    if (i === 0) v.say('A hash map counts in one pass.');
    else v.hold(350);
  });
  m.tone(2, 'ok');
  v.eq('O(n) time but O(n) extra space', 'warn').say('Linear time, but the map uses extra memory. Can we do it with just two variables?');

  v.chapter('optimal', "Optimal: Boyer-Moore voting", { cx: 'O(n)', code: ['candidate, count = None, 0', 'for x in nums:', '  if count == 0: candidate = x', '  count += 1 if x == candidate else −1', 'return candidate'] });
  v.clear();
  const c = v.array('nums', A, { label: 'nums' });
  const vv = v.vars('v', { candidate: '—', count: 0 });
  v.say('Boyer-Moore voting. Think of it as a battle: every majority element cancels out one other element. Since the majority is more than half, it survives the battle.');
  let cand: number | null = null;
  let count = 0;
  A.forEach((x, i) => {
    if (count === 0) cand = x;
    count += x === cand ? 1 : -1;
    c.clearTones().ptr('i', i).tone(i, x === cand ? 'ok' : 'bad');
    vv.set({ candidate: cand, count });
    v.line(count === 1 && x === cand ? 2 : 3).eq(x === cand ? `${x} supports the candidate → count ${count}` : `${x} cancels one vote → count ${count}`, x === cand ? 'ok' : 'bad');
    if (i === 0) v.say('Two becomes the candidate with one vote.');
    else if (i === 3) v.say('The ones cancel the twos, and when the count hits zero, the next element becomes the new candidate.');
    else v.hold(700);
  });
  c.clearTones().noPtr();
  v.eq(`candidate = ${cand}`, 'ok').say(`After one pass the candidate is ${cand}. Because a majority is guaranteed, the survivor must be it. O of n time and O of one space.`);
  v.answer(cand);

  recap(v, [{ name: 'Count each value', time: 'O(n²)', space: 'O(1)' }, { name: 'Hash map counts', time: 'O(n)', space: 'O(n)' }, { name: 'Boyer-Moore voting', time: 'O(n)', space: 'O(1)' }], 'Counting is simple; voting removes the map by cancelling pairs of different values.', ['More than half → pairs of different values cancel out, the majority survives'], 'When something is guaranteed to be a majority, pair it off against everything else.');
  return v.build();
}

const problem: Problem = {
  slug: 'majority-element',
  statement: 'Given an array `nums` of size `n`, return the **majority element**: the value that appears **more than ⌊n / 2⌋** times. It is guaranteed to exist.',
  examples: [{ input: 'nums = [3,2,3]', output: '3' }, { input: 'nums = [2,2,1,1,1,2,2]', output: '2' }],
  constraints: ['1 ≤ n ≤ 5 · 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹'],
  hints: ['A hash map of counts works. Can you avoid it?', 'If you pair each majority element with a different element, what is left over?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Count each value', idea: 'For each element, count its occurrences in the whole array.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Recounts the same values repeatedly.' },
    { id: 'better', kind: 'better', name: 'Hash map of counts', idea: 'Count in one pass; return the value whose count exceeds n/2.', time: 'O(n)', space: 'O(n)', bottleneck: 'O(n) extra memory.' },
    { id: 'optimal', kind: 'optimal', name: 'Boyer-Moore voting', idea: 'Keep a candidate and a count. When count is 0, take the current element as candidate. Same value → +1, different → −1.', time: 'O(n)', space: 'O(1)' },
  ],
  pitfalls: ['Boyer-Moore only works when a majority is guaranteed; otherwise verify the candidate with a second pass.'],
  takeaway: 'A value that is **more than half** survives if every pair of different values cancels out.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'majorityElement', params: ['int[]'], ret: 'int',
    tests: [{ args: [[3, 2, 3]], out: 3 }, { args: [[2, 2, 1, 1, 1, 2, 2]], out: 2 }, { args: [[1]], out: 1 }],
    gen: (r) => { const n = r.int(1, 25); const maj = r.int(-5, 5); const k = Math.floor(n / 2) + 1; return [r.shuffle([...Array(k).fill(maj), ...r.ints(n - k, -5, 5)])]; },
    ref: (a: number[]) => { const c = new Map<number, number>(); for (const x of a) c.set(x, (c.get(x) ?? 0) + 1); for (const [x, k] of c) if (k > a.length / 2) return x; return -1; },
  },
};

export default problem;
