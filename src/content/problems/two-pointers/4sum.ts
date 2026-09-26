import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const A = [1, 0, -1, 0, -2, 2];
const T = 0;

function four(nums: number[], t: number) {
  const a = [...nums].sort((x, y) => x - y);
  const n = a.length;
  const out: number[][] = [];
  for (let i = 0; i < n - 3; i++) {
    if (i > 0 && a[i] === a[i - 1]) continue;
    for (let j = i + 1; j < n - 2; j++) {
      if (j > i + 1 && a[j] === a[j - 1]) continue;
      let l = j + 1, r = n - 1;
      while (l < r) {
        const s = a[i] + a[j] + a[l] + a[r];
        if (s < t) l++;
        else if (s > t) r--;
        else { out.push([a[i], a[j], a[l], a[r]]); l++; r--; while (l < r && a[l] === a[l - 1]) l++; }
      }
    }
  }
  return out;
}

function video() {
  const v = new Video('4sum', '4Sum');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: `nums · target = ${T}` });
  v.say('Now four numbers. Return all unique quadruplets that add up to the target.');
  const ans = four(A, T);
  v.eq(ans.map((q) => `[${q.join(', ')}]`).join('  ')).say(`Here there are ${ans.length} of them.`);

  v.chapter('brute', 'Brute force: every quadruple', { cx: 'O(n⁴)', code: ['for i < j < k < l: check the sum, dedupe with a set'] });
  v.eq('n⁴/24 quadruples', 'bad').say('Four nested loops are n to the fourth. For two hundred numbers that is already sixty-five million quadruples.');

  v.chapter('optimal', 'Optimal: fix two, two pointers for the rest', { cx: 'O(n³)', code: ['sort a', 'for i: skip equal a[i]', '  for j > i: skip equal a[j]', '    l, r = j + 1, n − 1: two-pointer sweep for target − a[i] − a[j]', '    use 64-bit sums'] });
  v.clear();
  const S = [...A].sort((x, y) => x - y);
  const a = v.array('a', S, { label: `sorted · target = ${T}` });
  const res = v.table('res', ['quadruplet'], []);
  v.line(0).say('Same recipe as 3Sum, one level deeper. Sort, fix two numbers with two loops, and find the last two with a two pointer sweep. Skip equal values at every level to avoid duplicates.');
  let shown = 0;
  let checks = 0;
  const n = S.length;
  for (let i = 0; i < n - 3; i++) {
    if (i > 0 && S[i] === S[i - 1]) continue;
    for (let j = i + 1; j < n - 2; j++) {
      if (j > i + 1 && S[j] === S[j - 1]) continue;
      let l = j + 1;
      let r = n - 1;
      while (l < r) {
        const s = S[i] + S[j] + S[l] + S[r];
        checks++;
        const hit = s === T;
        a.clearTones().tone([i, j], 'pivot').ptrs({ i, j, l, r }).tone([l, r], hit ? 'ok' : 'cmp');
        v.line(3).counter(`sums checked: ${checks}`).eq(`${S[i]} + ${S[j]} + ${S[l]} + ${S[r]} = ${s}${hit ? ' ✓' : s < T ? ' → l++' : ' → r−−'}`, hit ? 'ok' : undefined);
        if (shown === 0) v.say('Fix minus two and minus one. The sweep over the rest works exactly like Two Sum Two.');
        else if (hit) v.say(`Found ${S[i]}, ${S[j]}, ${S[l]}, ${S[r]}.`);
        else v.hold(450);
        shown++;
        if (hit) {
          res.addRow([`[${S[i]}, ${S[j]}, ${S[l]}, ${S[r]}]`]).clearTones().tone(res.p.rows.length - 1, 'ok');
          l++;
          r--;
          while (l < r && S[l] === S[l - 1]) l++;
        } else if (s < T) l++;
        else r--;
      }
    }
  }
  a.clearTones().noPtr();
  v.eq(`${checks} sums checked · O(n²) pairs × O(n) sweep = O(n³)`, 'ok').say('Two fixed loops times a linear sweep is n cubed. The same idea generalises: k Sum is n to the k minus one, by fixing k minus two numbers. Use sixty-four bit sums, because four large values can overflow an int.');
  v.answer(ans);

  recap(v, [{ name: 'Every quadruple', time: 'O(n⁴)', space: 'O(k)' }, { name: 'Sort + fix two + two pointers', time: 'O(n³)', space: 'O(1) extra' }], 'k-Sum: fix k − 2 values, sweep for the last two.', ['k-Sum → O(n^(k−1))', 'Skip duplicates at every level', 'Watch for overflow with 4 values'], 'Every k Sum reduces to Two Sum Two on sorted data. Skip duplicates at each level, and mind overflow.');
  return v.build();
}

const problem: Problem = {
  slug: '4sum',
  statement: 'Given an array `nums` of `n` integers and an integer `target`, return all **unique** quadruplets `[nums[a], nums[b], nums[c], nums[d]]` with distinct indices whose sum equals `target`.',
  examples: [{ input: 'nums = [1,0,-1,0,-2,2], target = 0', output: '[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]' }, { input: 'nums = [2,2,2,2,2], target = 8', output: '[[2,2,2,2]]' }],
  constraints: ['1 ≤ n ≤ 200', '−10⁹ ≤ nums[i], target ≤ 10⁹'],
  hints: ['How did 3Sum reduce to Two Sum?', 'Sums of four values up to 10⁹ can overflow 32-bit integers.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every quadruple', idea: 'Four nested loops; dedupe sorted quadruplets with a set.', time: 'O(n⁴)', space: 'O(k)', bottleneck: 'n⁴/24 combinations.' },
    { id: 'optimal', kind: 'optimal', name: 'Sort + fix two + two pointers', idea: 'Sort; loop i and j (skipping equal values); sweep l and r for the remaining sum using 64-bit arithmetic.', time: 'O(n³)', space: 'O(1) extra' },
  ],
  pitfalls: ['Overflow: `nums[i] + nums[j] + nums[l] + nums[r]` can exceed 2³¹ − 1; use long / long long.', 'Skip duplicates for i, j and l.'],
  takeaway: 'k-Sum = fix **k − 2**, two pointers for the last two: O(n^(k−1)).',
  video,
  videoArgs: [A, T],
  judge: {
    type: 'fn', fn: 'fourSum', params: ['int[]', 'int'], ret: 'List<List<Integer>>', cmp: 'deepSorted',
    tests: [
      { args: [[1, 0, -1, 0, -2, 2], 0], out: [[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]] },
      { args: [[2, 2, 2, 2, 2], 8], out: [[2, 2, 2, 2]] },
      { args: [[1000000000, 1000000000, 1000000000, 1000000000], -294967296], out: [] },
    ],
    gen: (r: Rng) => [r.ints(r.int(1, 10), -4, 4), r.int(-4, 4)],
    ref: (a: number[], t: number) => four(a, t),
  },
};

export default problem;
