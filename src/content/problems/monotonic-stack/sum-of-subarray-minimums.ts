import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [3, 1, 2, 4];
const MOD = 1_000_000_007;
function ssm(a: number[]) {
  const n = a.length, left = Array(n), right = Array(n);
  let st: number[] = [];
  for (let i = 0; i < n; i++) { while (st.length && a[st[st.length - 1]] > a[i]) st.pop(); left[i] = st.length ? i - st[st.length - 1] : i + 1; st.push(i); }
  st = [];
  for (let i = n - 1; i >= 0; i--) { while (st.length && a[st[st.length - 1]] >= a[i]) st.pop(); right[i] = st.length ? st[st.length - 1] - i : n - i; st.push(i); }
  let s = 0;
  for (let i = 0; i < n; i++) s = (s + a[i] * left[i] * right[i]) % MOD;
  return s;
}

function video() {
  const v = new Video('sum-subarray-minimums', 'Sum of Subarray Minimums');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'arr' });
  v.say('Take every contiguous subarray, find its minimum, and add all those minimums up. Return the sum modulo ten to the nine plus seven.');
  v.eq(`10 subarrays; minimums 3,1,2,4, 1,1,2, 1,1, 1 → ${ssm(A)}`);

  v.chapter('brute', 'Brute force: every subarray with a running minimum', { cx: 'O(n²)', code: ['for i: m = ∞', '  for j from i: m = min(m, a[j]); total += m'] });
  v.eq('n² / 2 subarrays', 'warn').say('Fix a start, extend the end while tracking the minimum, and add it each time. Quadratic.');

  v.chapter('insight', 'Flip the question: how many subarrays is each element the minimum of?');
  v.clear();
  const n = A.length;
  const a = v.array('a', A, { label: 'element 1 at index 1' });
  a.tone(1, 'active').win(0, 3, 'win', 'extends 2 left, 3 right');
  v.eq('1 is the minimum of 2 × 3 = 6 subarrays → contributes 1 × 6').say('Instead of looping over subarrays, loop over elements. The one at index one is the minimum of every subarray that contains it and does not contain anything smaller. It can start at index zero or one, two choices, and end at index one, two or three, three choices. So it is the minimum of six subarrays and contributes one times six.');
  a.noWin();
  v.eq('need: previous smaller and next smaller of every element').say('For each element we need the distance to the previous smaller element and to the next smaller element. That is exactly what a monotonic stack gives.');

  v.chapter('optimal', 'Optimal: previous and next smaller with stacks', { cx: 'O(n)', code: ['left[i] = i − (index of previous element < a[i])', 'right[i] = (index of next element ≤ a[i]) − i', 'total = Σ a[i] · left[i] · right[i]  (mod 1e9+7)'] });
  v.clear();
  const b = v.array('a', A, { label: 'arr' });
  const left: number[] = [];
  const right: number[] = [];
  let st: number[] = [];
  for (let i = 0; i < n; i++) { while (st.length && A[st[st.length - 1]] > A[i]) st.pop(); left[i] = st.length ? i - st[st.length - 1] : i + 1; st.push(i); }
  st = [];
  for (let i = n - 1; i >= 0; i--) { while (st.length && A[st[st.length - 1]] >= A[i]) st.pop(); right[i] = st.length ? st[st.length - 1] - i : n - i; st.push(i); }
  const t = v.table('t', ['i', 'a[i]', 'left', 'right', 'contribution'], []);
  let total = 0;
  v.say('Two monotonic stack passes compute left and right for every element. Then each element contributes its value times left times right.');
  for (let i = 0; i < n; i++) {
    const c = A[i] * left[i] * right[i];
    total += c;
    b.clearTones().tone(i, 'active').win(i - left[i] + 1, i + right[i] - 1, 'win');
    t.addRow([String(i), String(A[i]), String(left[i]), String(right[i]), `${A[i]}·${left[i]}·${right[i]} = ${c}`]).clearTones().tone(i, 'ok');
    v.line(2).counter(`total: ${total}`).eq(`a[${i}] = ${A[i]} is the minimum of ${left[i]} × ${right[i]} subarrays`);
    const ls = left[i] === 1 ? 'a subarray it wins must start at it' : `a subarray it wins can start at ${words(left[i])} positions`;
    const rs = right[i] === 1 ? 'and must end at it' : `and end at ${words(right[i])} positions`;
    v.say(`${words(A[i])} at index ${words(i)}: ${ls}, ${rs}. It adds ${words(A[i])} times ${words(left[i] * right[i])}, which is ${words(c)}.`);
  }
  b.clearTones().noWin();
  v.eq(`total = ${total}`, 'ok').say(`The contributions add up to ${words(total)}. One detail: with equal values, use strictly smaller on one side and smaller or equal on the other, so each subarray’s minimum is counted exactly once.`);
  v.answer(ssm(A));

  recap(v, [{ name: 'Every subarray', time: 'O(n²)', space: 'O(1)' }, { name: 'Contribution via monotonic stacks', time: 'O(n)', space: 'O(n)' }], 'Sum over elements: value × (#subarrays where it is the minimum).', ['Sum of min / max over all subarrays → contribution technique'], 'Count how many subarrays each element wins. That flips a quadratic sum into a linear one.');
  return v.build();
}

const problem: Problem = {
  slug: 'sum-of-subarray-minimums',
  statement: 'Given an array of integers `arr`, find the sum of `min(b)`, where `b` ranges over every (contiguous) subarray of `arr`. Since the answer may be large, return it modulo `10⁹ + 7`.',
  examples: [{ input: 'arr = [3,1,2,4]', output: '17' }, { input: 'arr = [11,81,94,43,3]', output: '444' }],
  constraints: ['1 ≤ n ≤ 3 · 10⁴', '1 ≤ arr[i] ≤ 3 · 10⁴'],
  hints: ['For each element, in how many subarrays is it the minimum?', 'Previous smaller and next smaller elements bound those subarrays.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every subarray', idea: 'Running minimum from each start.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Quadratic.' },
    { id: 'optimal', kind: 'optimal', name: 'Contribution + monotonic stacks', idea: 'left[i] = distance to previous smaller (strict), right[i] = distance to next smaller-or-equal; sum a[i]·left·right.', time: 'O(n)', space: 'O(n)' },
  ],
  pitfalls: ['Use < on one side and ≤ on the other to avoid double counting equal minimums.', 'Use 64-bit products before taking the modulus.'],
  takeaway: '**Contribution technique**: value × number of subarrays it is the minimum of.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'sumSubarrayMins', params: ['int[]'], ret: 'int',
    tests: [{ args: [[3, 1, 2, 4]], out: 17 }, { args: [[11, 81, 94, 43, 3]], out: 444 }, { args: [[2, 2, 2]], out: 12 }],
    gen: (r: Rng) => [r.ints(r.int(1, 10), 1, 6)],
    ref: (a: number[]) => ssm(a),
  },
};

export default problem;
