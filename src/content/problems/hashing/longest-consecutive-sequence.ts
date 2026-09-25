import type { Problem } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [100, 4, 200, 1, 3, 2];

function video() {
  const v = new Video('longest-consecutive', 'Longest Consecutive Sequence');
  v.chapter('intro', 'The problem');
  v.array('nums', A, { label: 'nums (unsorted)' });
  v.say('Find the length of the longest run of consecutive integers, like one, two, three, four, in any order in the array. The target is O of n time.');

  v.chapter('brute', 'Brute force: extend from every number', { cx: 'O(n²)+', code: ['for x in nums:', '  length = 1', '  while x + length is in nums (scan): length += 1'] });
  v.eq('each "is it in nums?" is a scan → far too slow', 'bad').say('For each number, keep checking whether the next number exists by scanning the array. Each check is linear, so this is at least n squared.');

  v.chapter('better', 'Better: sort', { cx: 'O(n log n)', code: ['sort(nums)', 'walk and count runs where a[i] == a[i−1] + 1 (skip duplicates)'] });
  v.clear();
  const s = [...A].sort((x, y) => x - y);
  const b = v.array('s', s, { label: 'sorted' });
  b.toneRange(0, 3, 'ok');
  v.line(1).eq('1, 2, 3, 4 → length 4', 'ok').say('After sorting, consecutive numbers sit together, and one pass counts the runs. But sorting is n log n, and the problem asks for linear time.');

  v.chapter('optimal', 'Optimal: a set, and only start at run beginnings', { cx: 'O(n)', code: ['set = all numbers', 'for x in set:', '  if x − 1 not in set:          (x starts a run)', '    count up while x + k in set', '  best = max(best, run length)'] });
  v.clear().layout('row');
  const a = v.array('nums', A, { label: 'nums' });
  const set = v.map('set', { label: 'set', set: true });
  A.forEach((x) => set.put(x));
  const vv = v.vars('v', { best: 0 });
  v.line(0).say('Put every number in a hash set, so "is it there?" is O of one.');
  let best = 0;
  for (let i = 0; i < A.length; i++) {
    const x = A[i];
    a.clearTones().ptr('x', i).tone(i, 'active');
    set.clearTones();
    if (set.has(x - 1)) {
      set.tone(x - 1, 'warn');
      v.line(2).eq(`${x - 1} exists → ${x} is not a start, skip`, 'warn');
      if (x === 4) v.say(`${words(x)}: ${words(x - 1)} is in the set, so ${words(x)} is not the start of a run. Skip it; the run will be counted from its real start.`);
      else v.hold(600);
      continue;
    }
    let len = 1;
    set.tone(x, 'ok');
    while (set.has(x + len)) {
      set.tone(x + len, 'ok');
      len++;
    }
    best = Math.max(best, len);
    vv.set({ best });
    v.line(3).eq(`${x} starts a run of ${len}`, len > 1 ? 'ok' : 'none');
    if (x === 100) v.say('A hundred: ninety-nine is not in the set, so a hundred starts a run. A hundred and one is not there: length one.');
    else if (len > 1) v.say(`${words(x)} starts a run: ${Array.from({ length: len }, (_, k) => words(x + k)).join(', ')}. Length ${words(len)}.`);
    else v.hold(600);
  }
  a.noPtr();
  v.eq(`longest = ${best}`, 'ok').note('each number is visited at most twice').say('Only run starts count upward, so every number is touched at most twice in total. That is O of n.');
  v.answer(best);
  recap(v, [{ name: 'Extend from every number (scan)', time: 'O(n²) or worse', space: 'O(1)' }, { name: 'Sort then walk', time: 'O(n log n)', space: 'O(1)' }, { name: 'Hash set + run starts', time: 'O(n)', space: 'O(n)' }], 'The set gives O(1) membership, and starting only at run beginnings avoids repeated work.', ['O(n) with lookups → hash set', 'Avoid repeated work: only start counting where a run begins'], 'Only start work where something begins. That one check turns quadratic into linear.');
  return v.build();
}

const problem: Problem = {
  slug: 'longest-consecutive-sequence',
  statement: 'Given an unsorted array of integers `nums`, return the length of the longest sequence of **consecutive integers** (like 1, 2, 3, 4) that appear in `nums`, in any order. Aim for `O(n)` time.',
  examples: [{ input: 'nums = [100,4,200,1,3,2]', output: '4', why: '1, 2, 3, 4' }, { input: 'nums = [0,3,7,2,5,8,4,6,0,1]', output: '9' }, { input: 'nums = [1,0,1,2]', output: '3' }],
  constraints: ['0 ≤ nums.length ≤ 10⁵', '-10⁹ ≤ nums[i] ≤ 10⁹'],
  hints: ['Sorting solves it in O(n log n). What gives O(1) "is x present?"', 'Only start counting from a number x when x − 1 is not present.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Extend from each number', idea: 'For every x, count x+1, x+2, … by scanning the array each time.', time: 'O(n³) worst', space: 'O(1)', bottleneck: 'Each membership test is a full scan, and runs are recounted from every member.' },
    { id: 'better', kind: 'better', name: 'Sort and walk', idea: 'Sort; count runs where `a[i] == a[i−1] + 1`, skipping duplicates.', time: 'O(n log n)', space: 'O(1)', bottleneck: 'Sorting is n log n.' },
    { id: 'optimal', kind: 'optimal', name: 'Hash set, start at run beginnings', idea: 'Put all numbers in a set. For each x with `x − 1` not in the set, count upward.', time: 'O(n)', space: 'O(n)' },
  ],
  pitfalls: ['Duplicates in the sorted approach must not break or extend a run.', 'Counting upward from every number (not just run starts) makes the set approach O(n²).'],
  takeaway: 'Use a set for O(1) membership, and **only begin work at the start of a run**.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'longestConsecutive', params: ['int[]'], ret: 'int',
    tests: [{ args: [[100, 4, 200, 1, 3, 2]], out: 4 }, { args: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], out: 9 }, { args: [[1, 0, 1, 2]], out: 3 }, { args: [[]], out: 0 }, { args: [[-1, -2, 2147483647, -2147483648]], out: 2 }],
    gen: (r) => [r.ints(r.int(0, 20), -15, 15)],
    ref: (a: number[]) => { const s = new Set(a); let b = 0; for (const x of s) if (!s.has(x - 1)) { let l = 1; while (s.has(x + l)) l++; b = Math.max(b, l); } return b; },
  },
};

export default problem;
