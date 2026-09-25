import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const A = [4, 9, 2, 7, 9, 1];

function video() {
  const v = new Video('contains-duplicate', 'Contains Duplicate');
  v.chapter('intro', 'The problem');
  v.array('nums', A, { label: 'nums' });
  v.say('Return true if any value appears at least twice. We solved this one in the playbook lesson; now let us compare all three approaches properly.');

  v.chapter('brute', 'Brute force: compare every pair', { cx: 'O(n²)', code: ['for i < j:', '  if a[i] == a[j]: return true'] });
  v.eq('up to n(n−1)/2 comparisons', 'bad').say('Comparing every pair is correct but quadratic.');

  v.chapter('better', 'Better: sort, then check neighbours', { cx: 'O(n log n)', code: ['sort(a)', 'for i in 1..n-1:', '  if a[i] == a[i−1]: return true'] });
  v.clear();
  const s = [...A].sort((x, y) => x - y);
  const b = v.array('sorted', s, { label: 'sorted' });
  for (let i = 1; i < s.length; i++) {
    b.clearTones().tone([i - 1, i], s[i] === s[i - 1] ? 'ok' : 'cmp');
    v.line(2).eq(`${s[i - 1]} vs ${s[i]}`, s[i] === s[i - 1] ? 'ok' : 'none');
    if (i === 1) v.say('After sorting, equal values sit next to each other, so one pass over neighbours finds them.');
    if (s[i] === s[i - 1]) {
      v.say('Nine next to nine. True. Sorting costs n log n, but needs no extra memory if we may sort in place.');
      break;
    }
    v.hold(450);
  }

  v.chapter('optimal', 'Optimal: hash set', { cx: 'O(n)', code: ['seen = set()', 'for x in nums:', '  if x in seen: return true', '  seen.add(x)', 'return false'] });
  v.clear().layout('row');
  const c = v.array('nums', A, { label: 'nums' });
  const set = v.map('seen', { label: 'seen', set: true });
  for (let i = 0; i < A.length; i++) {
    c.clearTones().ptr('x', i).tone(i, 'active');
    if (set.has(A[i])) {
      c.tone(i, 'ok');
      set.clearTones().tone(A[i], 'ok');
      v.line(2).eq(`${A[i]} already in seen → true`, 'ok').say('Nine is already in the set. True, in one pass.');
      break;
    }
    set.put(A[i]);
    v.line(3).eq(`add ${A[i]}`);
    if (i === 0) v.say('The hash set remembers everything seen so far with O of one checks.');
    else v.hold(500);
  }
  v.answer(true);
  recap(v, [{ name: 'Every pair', time: 'O(n²)', space: 'O(1)' }, { name: 'Sort + neighbours', time: 'O(n log n)', space: 'O(1)*' }, { name: 'Hash set', time: 'O(n)', space: 'O(n)' }], 'Sorting trades time for no extra memory; the set trades memory for linear time. *In-place sort.', ['"Seen before?" → hash set', 'Sorting groups equal values together'], 'Know both answers and the trade-off between them. Interviewers often ask which one you would pick and why.');
  return v.build();
}

const problem: Problem = {
  slug: 'contains-duplicate',
  statement: 'Given an integer array `nums`, return `true` if any value appears **at least twice**, and `false` if every element is distinct.',
  examples: [{ input: 'nums = [1,2,3,1]', output: 'true' }, { input: 'nums = [1,2,3,4]', output: 'false' }, { input: 'nums = [1,1,1,3,3,4,3,2,4,2]', output: 'true' }],
  constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁹ ≤ nums[i] ≤ 10⁹'],
  hints: ['After sorting, where are equal values?', 'A set answers "seen before?" in O(1).'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Compare every pair', idea: 'Two nested loops.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Quadratic.' },
    { id: 'better', kind: 'better', name: 'Sort and compare neighbours', idea: 'Sort, then check `a[i] == a[i − 1]`.', time: 'O(n log n)', space: 'O(1) with an in-place sort', bottleneck: 'The sort dominates.' },
    { id: 'optimal', kind: 'optimal', name: 'Hash set', idea: 'Add each value to a set; if it is already there, return true.', time: 'O(n)', space: 'O(n)' },
  ],
  takeaway: '"Have I seen this before?" → **hash set**. Sorting is the no-extra-memory alternative.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'containsDuplicate', params: ['int[]'], ret: 'boolean',
    tests: [{ args: [[1, 2, 3, 1]], out: true }, { args: [[1, 2, 3, 4]], out: false }, { args: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], out: true }, { args: [[5]], out: false }],
    gen: (r) => [r.ints(r.int(1, 15), -30, 30)],
    ref: (a: number[]) => new Set(a).size !== a.length,
  },
};

export default problem;
