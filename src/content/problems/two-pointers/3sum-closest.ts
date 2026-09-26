import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const A = [-1, 2, 1, -4];
const T = 1;

function closest(nums: number[], t: number) {
  const a = [...nums].sort((x, y) => x - y);
  let best = a[0] + a[1] + a[2];
  for (let i = 0; i < a.length - 2; i++) {
    let l = i + 1, r = a.length - 1;
    while (l < r) {
      const s = a[i] + a[l] + a[r];
      if (Math.abs(s - t) < Math.abs(best - t)) best = s;
      if (s < t) l++; else if (s > t) r--; else return s;
    }
  }
  return best;
}
function allSums(a: number[]) {
  const out: number[] = [];
  for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) for (let k = j + 1; k < a.length; k++) out.push(a[i] + a[j] + a[k]);
  return out;
}

function video() {
  const v = new Video('3sum-closest', '3Sum Closest');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: `nums · target = ${T}` });
  v.say('Pick three numbers whose sum is as close as possible to the target, and return that sum. Exactly one sum is closest.');
  v.eq('−1 + 2 + 1 = 2, distance 1 from the target → answer 2', 'ok');

  v.chapter('brute', 'Brute force: every triple', { cx: 'O(n³)', code: ['for i < j < k:', '  s = a[i] + a[j] + a[k]', '  if |s − target| < |best − target|: best = s'] });
  v.eq('n³/6 sums, keep the closest', 'warn').say('Trying all triples and keeping the closest sum works, but it is cubic.');

  v.chapter('optimal', 'Optimal: sort, fix one, two pointers', { cx: 'O(n²)', code: ['sort a; best = a[0] + a[1] + a[2]', 'for i: l, r = i + 1, n − 1', '  while l < r: s = a[i] + a[l] + a[r]', '    keep s if it is closer', '    s < target → l += 1 · s > target → r −= 1 · equal → return'] });
  v.clear();
  const S = [...A].sort((x, y) => x - y);
  const a = v.array('a', S, { label: `sorted · target = ${T}` });
  let best = S[0] + S[1] + S[2];
  v.counter(`best: ${best}`).line(0).say(`Same skeleton as 3Sum. Sort, fix the first number, and sweep two pointers. The difference: instead of looking for an exact hit, remember the closest sum seen. Start with the first three, ${best}.`);
  let first = true;
  for (let i = 0; i < S.length - 2; i++) {
    let l = i + 1;
    let r = S.length - 1;
    while (l < r) {
      const s = S[i] + S[l] + S[r];
      const better = Math.abs(s - T) < Math.abs(best - T);
      if (better) best = s;
      a.clearTones().tone(i, 'pivot').ptrs({ i, l, r }).tone([l, r], better ? 'ok' : 'cmp');
      v.line(2, 3).counter(`best: ${best}`).eq(`${S[i]} + ${S[l]} + ${S[r]} = ${s}, distance ${Math.abs(s - T)}${better ? ' ← closer' : ''} · ${s < T ? 'too small → l++' : s > T ? 'too big → r−−' : 'exact'}`, better ? 'ok' : undefined);
      if (first) v.say(`Fix minus four: minus four plus minus one plus two is minus three, four away from the target. Too small, so move l right to grow the sum.`);
      else v.hold(700);
      first = false;
      if (s < T) l++;
      else if (s > T) r--;
      else break;
    }
  }
  a.clearTones().noPtr();
  v.eq(`closest sum = ${best}`, 'ok').say(`The pointer moves are the same as in 3Sum: too small means the left side must grow, too big means the right side must shrink. The closest sum is ${best}, found in n squared time.`);
  v.answer(best);

  recap(v, [{ name: 'Every triple', time: 'O(n³)', space: 'O(1)' }, { name: 'Sort + two pointers', time: 'O(n²)', space: 'O(1)' }], 'Same sweep as 3Sum, but track the closest sum.', ['“Closest to target” with sums → sorted two-pointer sweep + running best'], 'When exact matching becomes “closest”, keep the same sweep and track the best answer as you go.');
  return v.build();
}

const problem: Problem = {
  slug: '3sum-closest',
  statement: 'Given an integer array `nums` of length `n` and an integer `target`, find three integers in `nums` whose sum is closest to `target`. Return that sum. Each input has exactly one solution.',
  examples: [{ input: 'nums = [-1,2,1,-4], target = 1', output: '2' }, { input: 'nums = [0,0,0], target = 1', output: '0' }],
  constraints: ['3 ≤ n ≤ 500', '−1000 ≤ nums[i] ≤ 1000', '−10⁴ ≤ target ≤ 10⁴'],
  hints: ['This is 3Sum where you remember the best miss.', 'If the sum is below target, which pointer should move?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every triple', idea: 'Try all triples, keep the sum with the smallest |sum − target|.', time: 'O(n³)', space: 'O(1)', bottleneck: 'Cubic.' },
    { id: 'optimal', kind: 'optimal', name: 'Sort + two pointers', idea: 'Sort; for each i sweep l and r, update the best sum, move l if too small, r if too big, return on an exact match.', time: 'O(n²)', space: 'O(1)' },
  ],
  takeaway: '“Closest” variants keep the **same sweep** plus a running best.',
  video,
  videoArgs: [A, T],
  judge: {
    type: 'fn', fn: 'threeSumClosest', params: ['int[]', 'int'], ret: 'int',
    tests: [{ args: [[-1, 2, 1, -4], 1], out: 2 }, { args: [[0, 0, 0], 1], out: 0 }],
    gen: (r: Rng) => {
      for (;;) {
        const a = r.ints(r.int(3, 9), -10, 10);
        const t = r.int(-15, 15);
        const sums = allSums(a);
        const d = Math.min(...sums.map((s) => Math.abs(s - t)));
        if (new Set(sums.filter((s) => Math.abs(s - t) === d)).size === 1) return [a, t];   // unique answer
      }
    },
    ref: (a: number[], t: number) => closest(a, t),
  },
};

export default problem;
