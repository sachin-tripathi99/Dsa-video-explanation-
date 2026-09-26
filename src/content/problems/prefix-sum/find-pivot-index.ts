import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const A = [1, 7, 3, 6, 5, 6];

function pivot(a: number[]) {
  const total = a.reduce((x, y) => x + y, 0);
  let left = 0;
  for (let i = 0; i < a.length; i++) { if (left === total - left - a[i]) return i; left += a[i]; }
  return -1;
}

function video() {
  const v = new Video('find-pivot-index', 'Find Pivot Index');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'nums' });
  v.say('Find the leftmost index where the sum of everything to its left equals the sum of everything to its right. The element itself belongs to neither side. Return minus one if there is none.');

  v.chapter('brute', 'Brute force: sum both sides for every index', { cx: 'O(n²)', code: ['for i: if sum(a[0..i−1]) == sum(a[i+1..n−1]): return i'] });
  v.eq('two scans per index', 'warn').say('Recomputing both sides for every index is n squared.');

  v.chapter('optimal', 'Optimal: total minus a running left sum', { cx: 'O(n)', code: ['total = sum(a); left = 0', 'for i in 0..n−1:', '  right = total − left − a[i]', '  if left == right: return i', '  left += a[i]', 'return −1'] });
  v.clear();
  const a = v.array('a', A, { label: 'nums' });
  const total = A.reduce((x, y) => x + y, 0);
  const vars = v.vars('v', { total, left: 0 });
  let left = 0;
  v.line(0).say(`The right sum is simply the total minus the left sum minus the current element. So compute the total once, ${total}, and keep a running left sum.`);
  let ans = -1;
  for (let i = 0; i < A.length; i++) {
    const right = total - left - A[i];
    a.clearTones().tone(i, left === right ? 'ok' : 'active');
    if (i > 0) a.win(0, i - 1, 'win', `left ${left}`);
    else a.noWin();
    vars.set({ total, left, right });
    v.line(2, 3).eq(`i = ${i}: left ${left} vs right ${total} − ${left} − ${A[i]} = ${right}${left === right ? ' ✓' : ''}`, left === right ? 'ok' : undefined);
    if (left === right) { v.say(`At index ${i}, the left sum is ${left} and the right sum is also ${right}. That is the pivot.`); ans = i; break; }
    if (i === 0) v.say('At index zero the left side is empty, zero, and the right side is twenty-seven. Not equal.');
    else v.hold(650);
    left += A[i];
  }
  a.noWin();
  v.answer(ans);
  v.eq('one pass after one total', 'ok');

  recap(v, [{ name: 'Sum both sides each time', time: 'O(n²)', space: 'O(1)' }, { name: 'Total − running left', time: 'O(n)', space: 'O(1)' }], 'right = total − left − a[i].', ['Balance / split points → total and a running prefix'], 'One side of a split is the total minus the other side. No need for a whole prefix array.');
  return v.build();
}

const problem: Problem = {
  slug: 'find-pivot-index',
  statement: 'Given an array `nums`, return the **pivot index**: the leftmost index where the sum of all numbers strictly to its left equals the sum of all numbers strictly to its right. If no such index exists, return `-1`. An empty side sums to `0`.',
  examples: [{ input: 'nums = [1,7,3,6,5,6]', output: '3' }, { input: 'nums = [1,2,3]', output: '-1' }, { input: 'nums = [2,1,-1]', output: '0' }],
  constraints: ['1 ≤ n ≤ 10⁴', '−1000 ≤ nums[i] ≤ 1000'],
  hints: ['If you know the total and the left sum, what is the right sum?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sum both sides', idea: 'For every i, compute both sums from scratch.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Recomputes sums.' },
    { id: 'optimal', kind: 'optimal', name: 'Total − running left', idea: 'right = total − left − nums[i]; return i when left == right.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'One side = **total − the other side − the pivot**.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'pivotIndex', params: ['int[]'], ret: 'int',
    tests: [{ args: [[1, 7, 3, 6, 5, 6]], out: 3 }, { args: [[1, 2, 3]], out: -1 }, { args: [[2, 1, -1]], out: 0 }, { args: [[0]], out: 0 }],
    gen: (r: Rng) => [r.ints(r.int(1, 10), -3, 3)],
    ref: (a: number[]) => pivot(a),
  },
};

export default problem;
