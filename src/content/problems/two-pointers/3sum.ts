import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const A = [-1, 0, 1, 2, -1, -4];

function three(nums: number[]) {
  const a = [...nums].sort((x, y) => x - y);
  const out: number[][] = [];
  for (let i = 0; i < a.length - 2; i++) {
    if (i > 0 && a[i] === a[i - 1]) continue;
    let l = i + 1, r = a.length - 1;
    while (l < r) {
      const s = a[i] + a[l] + a[r];
      if (s < 0) l++;
      else if (s > 0) r--;
      else { out.push([a[i], a[l], a[r]]); l++; r--; while (l < r && a[l] === a[l - 1]) l++; }
    }
  }
  return out;
}

function video() {
  const v = new Video('3sum', '3Sum');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'nums' });
  v.say('Find all unique triplets whose values add up to zero. Positions must differ, and the same triplet of values must not appear twice in the answer.');
  v.eq('answer: [−1, −1, 2] and [−1, 0, 1]').say('Here there are two: minus one, minus one, two, and minus one, zero, one. Note there are two minus ones in the input, so it is easy to report the same triplet twice.');

  v.chapter('brute', 'Brute force: every triple', { cx: 'O(n³)', code: ['for i < j < k:', '  if a[i] + a[j] + a[k] == 0:', '    add sorted(a[i], a[j], a[k]) to a set'] });
  v.eq(`${(A.length * (A.length - 1) * (A.length - 2)) / 6} triples for n = ${A.length} · n³/6 in general`, 'bad').say('Three nested loops try every triple, and a set of sorted triplets removes duplicates. For three thousand numbers that is four and a half billion triples.');

  v.chapter('better', 'Better: fix one, hash for the rest', { cx: 'O(n²)', code: ['for i in 0..n−1:', '  seen = {}', '  for j in i+1..n−1:', '    if −a[i] − a[j] in seen: record triplet', '    seen.add(a[j])'] });
  v.eq('fix a[i]: find two numbers summing to −a[i] with a hash set · O(n) each', 'warn').say('Fixing the first number turns the rest into a two sum problem: find two numbers adding up to minus a of i. A hash set solves each one in linear time, so n squared overall. It still needs a set to throw away duplicate triplets.');

  v.chapter('optimal', 'Optimal: sort, fix one, two pointers', { cx: 'O(n²) · O(1) extra', code: ['sort a', 'for i in 0..n−3:', '  if i > 0 and a[i] == a[i−1]: continue   # same first value', '  l, r = i + 1, n − 1', '  while l < r: move by comparing a[i] + a[l] + a[r] with 0', '  on a hit: record, move both, skip equal a[l]'] });
  v.clear();
  const S = [...A].sort((x, y) => x - y);
  const a = v.array('a', S, { label: 'sorted nums' });
  const res = v.table('res', ['triplet'], []);
  v.line(0).say('Sort first. Now, for each first number, the other two can be found with the two pointer sweep from the Two Sum Two problem. And because equal values sit next to each other, skipping duplicates is easy.');
  let firstSweep = true;
  for (let i = 0; i < S.length - 2; i++) {
    a.clearTones().noPtr().ptr('i', i).tone(i, 'pivot');
    if (i > 0 && S[i] === S[i - 1]) {
      a.tone(i, 'dim');
      v.line(2).eq(`a[${i}] = ${S[i]} same as a[${i - 1}] → skip (would repeat triplets)`, 'warn').say(`Index ${i} is minus one again. Every triplet starting with minus one was already found, so skip it.`);
      continue;
    }
    let l = i + 1;
    let r = S.length - 1;
    v.line(3).eq(`fix a[${i}] = ${S[i]} → need a[l] + a[r] = ${-S[i]}`);
    if (firstSweep) v.say(`Fix minus four. We need two numbers adding up to four.`);
    else v.hold(600);
    while (l < r) {
      const s = S[i] + S[l] + S[r];
      a.clearTones().tone(i, 'pivot').ptrs({ i, l, r }).tone([l, r], s === 0 ? 'ok' : 'cmp');
      v.line(4).eq(`${S[i]} + ${S[l]} + ${S[r]} = ${s}${s === 0 ? ' ✓' : s < 0 ? ' < 0 → l++' : ' > 0 → r−−'}`, s === 0 ? 'ok' : undefined);
      if (firstSweep && s < 0) { v.say('Minus four plus minus one plus two is minus three, too small. Move l right.'); firstSweep = false; }
      else if (s === 0) v.say(`Zero! Record ${S[i]}, ${S[l]}, ${S[r]}, then move both pointers inward.`);
      else v.hold(550);
      if (s < 0) l++;
      else if (s > 0) r--;
      else {
        res.addRow([`[${S[i]}, ${S[l]}, ${S[r]}]`]).tone(res.p.rows.length - 1, 'ok');
        l++;
        r--;
        while (l < r && S[l] === S[l - 1]) l++;
      }
    }
    firstSweep = false;
  }
  a.clearTones().noPtr();
  const out = three(A);
  v.eq(`${out.length} unique triplets · n sweeps × O(n) = O(n²)`, 'ok').say('Each first number costs one linear sweep, so the total is n squared, with no hash set and no duplicate filtering afterwards.');
  v.answer(out);

  recap(v, [
    { name: 'Every triple + set', time: 'O(n³)', space: 'O(k)' },
    { name: 'Fix one + hash set', time: 'O(n²)', space: 'O(n)' },
    { name: 'Sort + fix one + two pointers', time: 'O(n²)', space: 'O(1) extra' },
  ], 'Sort, fix one element, and two-pointer the rest; skip equal neighbours.', ['k-Sum → sort, fix k − 2, two pointers', 'Duplicates in sorted data are adjacent: skip them'], 'Reduce 3Sum to many sorted Two Sums. Sorting also makes duplicate handling trivial.');
  return v.build();
}

const problem: Problem = {
  slug: '3sum',
  statement: 'Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i`, `j`, `k` are distinct and `nums[i] + nums[j] + nums[k] == 0`. The answer must not contain duplicate triplets.',
  examples: [{ input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' }, { input: 'nums = [0,1,1]', output: '[]' }, { input: 'nums = [0,0,0]', output: '[[0,0,0]]' }],
  constraints: ['3 ≤ nums.length ≤ 3000', '−10⁵ ≤ nums[i] ≤ 10⁵'],
  hints: ['Fix the first number. What is left is a Two Sum.', 'Sort to use two pointers and to put duplicates side by side.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every triple', idea: 'Three nested loops; store sorted triplets in a set to remove duplicates.', time: 'O(n³)', space: 'O(k)', bottleneck: 'n³/6 triples.' },
    { id: 'better', kind: 'better', name: 'Fix one + hash set', idea: 'For each i, solve Two Sum for −nums[i] on the rest with a hash set; dedupe with a set of sorted triplets.', time: 'O(n²)', space: 'O(n)', bottleneck: 'Needs hashing and a dedupe set.' },
    { id: 'optimal', kind: 'optimal', name: 'Sort + two pointers', idea: 'Sort; for each i (skipping equal values), sweep l and r inward; on a hit record it and skip equal values of l.', time: 'O(n²)', space: 'O(1) extra (sorting aside)' },
  ],
  pitfalls: ['Skip duplicates for the first element (`a[i] == a[i−1]`) and for l after a hit.', 'Break early when `a[i] > 0`: three positives cannot sum to zero (optional speed-up).'],
  takeaway: '**k-Sum** = sort, fix k − 2 elements, two pointers for the last two.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'threeSum', params: ['int[]'], ret: 'List<List<Integer>>', cmp: 'deepSorted',
    tests: [{ args: [[-1, 0, 1, 2, -1, -4]], out: [[-1, -1, 2], [-1, 0, 1]] }, { args: [[0, 1, 1]], out: [] }, { args: [[0, 0, 0, 0]], out: [[0, 0, 0]] }],
    gen: (r: Rng) => [r.ints(r.int(3, 12), -5, 5)],
    ref: (a: number[]) => three(a),
  },
};

export default problem;
