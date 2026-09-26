import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [2, 3, 1, 0, 2, 0, 1];
const B = [3, 2, 1, 0, 4];
function cj(a: number[]) { let r = 0; for (let i = 0; i < a.length; i++) { if (i > r) return false; r = Math.max(r, i + a[i]); } return true; }

function video() {
  const v = new Video('jump-game', 'Jump Game');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'nums[i] = maximum jump length from i' });
  v.say('You start at index zero. From index i you may jump forward by any distance up to nums of i. Can you reach the last index?');
  v.eq(`[${A}] → ${cj(A)} · [${B}] → ${cj(B)}`);

  v.chapter('brute', 'Brute force: try every jump', { cx: 'O(2ⁿ)', code: ['canReach(i):', '  if i is last: true', '  for step in 1..nums[i]: if canReach(i + step): true', '  false'] });
  v.eq('the same index is explored again and again', 'bad').say('Recursively try every jump from every index. Many paths lead to the same index, so the work explodes.');

  v.chapter('better', 'Better: DP from the right', { cx: 'O(n²)', code: ['good[n−1] = true', 'for i from n−2 down to 0:', '  good[i] = any good[i + step] for step ≤ nums[i]'] });
  v.clear();
  const b = v.array('a', A, { label: 'nums' });
  const good = v.array('g', A.map((_, i) => (i === A.length - 1 ? 'T' : null)), { label: 'good[i]: can reach the end from i' });
  v.say('Remember which indices can reach the end. Work from the right: index i is good if any index it can jump to is good. Each index checks up to n others: quadratic.');
  const gd = A.map((_, i) => i === A.length - 1);
  for (let i = A.length - 2; i >= 0; i--) {
    let ok = false;
    for (let s = 1; s <= A[i] && i + s < A.length; s++) if (gd[i + s]) { ok = true; break; }
    gd[i] = ok;
    b.clearTones().tone(i, 'active').win(i + 1, Math.min(A.length - 1, i + A[i]), 'win');
    good.set(i, ok ? 'T' : 'F').tone(i, ok ? 'ok' : 'bad');
    v.line(2).eq(`i = ${i}: can reach ${i + 1}..${Math.min(A.length - 1, i + A[i])} → ${ok ? 'good' : 'bad'}`).hold(700);
  }
  b.clearTones().noWin();
  v.eq(`good[0] = ${gd[0]}`, 'ok').say('Index zero is good, so the answer is true. But we can avoid the inner loop entirely.');

  v.chapter('optimal', 'Optimal: track the furthest reachable index', { cx: 'O(n)', code: ['reach = 0', 'for i in 0..n−1:', '  if i > reach: return false', '  reach = max(reach, i + nums[i])', 'return true'] });
  v.clear();
  const run = (arr: number[], label: string, first: boolean) => {
    const a = v.array(label, arr, { label: `nums = [${arr}]` });
    let reach = 0;
    for (let i = 0; i < arr.length; i++) {
      a.clearTones().noWin().win(0, Math.min(arr.length - 1, reach), 'ok', `reach ${reach}`).tone(i, 'active');
      if (i > reach) {
        a.tone(i, 'bad');
        v.line(2).counter(`reach: ${reach}`).eq(`i = ${i} > reach ${reach} → stuck`, 'bad').say(`Index ${words(i)} is beyond the furthest reachable index, ${words(reach)}. Every index we could reach jumps no further. We are stuck: false.`);
        return;
      }
      const nr = Math.max(reach, i + arr[i]);
      v.line(3).counter(`reach: ${nr}`).eq(`i = ${i}: i + nums[i] = ${i + arr[i]} → reach ${nr}`);
      if (first && i === 0) v.say(`Walk left to right keeping reach, the furthest index any jump so far can land on. From index zero we can reach index ${words(nr)}.`);
      else if (first && nr >= arr.length - 1 && reach < arr.length - 1) v.say(`From index ${words(i)}, reach becomes ${words(nr)}: the last index is within reach.`);
      else if (!first && arr[i] === 0) v.say(`Index ${words(i)} has a zero. Reach stays at ${words(nr)}.`);
      else v.hold(600);
      reach = nr;
    }
    a.clearTones().noWin().win(0, arr.length - 1, 'ok');
    v.eq('every index reachable → true', 'ok').hold(700);
  };
  run(A, 'a', true);
  v.clear();
  run(B, 'b', false);
  v.eq('one pass · O(n) time, O(1) space', 'ok').say('Each index is visited once: linear time and constant space.');
  v.answer(cj(A));

  recap(v, [{ name: 'Try every jump', time: 'O(2ⁿ)', space: 'O(n)' }, { name: 'DP from the right', time: 'O(n²)', space: 'O(n)' }, { name: 'Furthest reach', time: 'O(n)', space: 'O(1)' }], 'If i > reach you are stuck; otherwise extend reach with i + nums[i].', ['Reachability with jump lengths → keep the furthest reach'], 'You never need to know how you got somewhere, only how far you can get.');
  return v.build();
}

const problem: Problem = {
  slug: 'jump-game',
  statement: 'You are given an integer array `nums`. You start at index 0, and `nums[i]` is the maximum jump length from index `i`. Return `true` if you can reach the last index.',
  examples: [{ input: 'nums = [2,3,1,1,4]', output: 'true' }, { input: 'nums = [3,2,1,0,4]', output: 'false' }],
  constraints: ['1 ≤ n ≤ 10⁴', '0 ≤ nums[i] ≤ 10⁵'],
  hints: ['Track the furthest index you can reach so far.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Try every jump', idea: 'Recursively try each jump length.', time: 'O(2ⁿ)', space: 'O(n)', bottleneck: 'Repeated work.' },
    { id: 'better', kind: 'better', name: 'DP from the right', idea: 'good[i] = some reachable good index.', time: 'O(n²)', space: 'O(n)', bottleneck: 'Inner loop.' },
    { id: 'optimal', kind: 'optimal', name: 'Furthest reach', idea: 'reach = max(reach, i + nums[i]); fail if i > reach.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Keep the **furthest reach**.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'canJump', params: ['int[]'], ret: 'boolean',
    tests: [{ args: [[2, 3, 1, 1, 4]], out: true }, { args: [[3, 2, 1, 0, 4]], out: false }, { args: [[0]], out: true }, { args: [A], out: cj(A) }],
    gen: (r: Rng) => [r.ints(r.int(1, 11), 0, 3)],
    ref: (a: number[]) => cj(a),
  },
};

export default problem;
