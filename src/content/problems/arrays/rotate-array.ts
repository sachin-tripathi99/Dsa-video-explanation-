import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const A = [1, 2, 3, 4, 5, 6, 7];
const K = 3;

function video() {
  const v = new Video('rotate-array', 'Rotate Array');
  v.chapter('intro', 'The problem');
  const a = v.array('nums', A, { label: 'nums, rotate right by k = 3' });
  v.say('Rotate the array to the right by k steps, in place. Every element moves k places right, and elements that fall off the end wrap around to the front.');
  v.eq('[1..7] → [5, 6, 7, 1, 2, 3, 4]');

  v.chapter('brute', 'Brute force: rotate one step, k times', { cx: 'O(n·k)', code: ['repeat k times:', '  last = a[n-1]', '  shift everything right by one', '  a[0] = last'] });
  const arr = [...A];
  for (let s = 0; s < K; s++) {
    const last = arr.pop()!;
    arr.unshift(last);
    a.move(A.length - 1, 0).clearTones().tone(0, 'warn');
    v.line(3).counter(`rotations: ${s + 1}`).eq(`moved ${last} to the front`);
    if (s === 0) v.say('Simplest idea: move the last element to the front, and do that k times. Each single rotation shifts all n elements.');
    else v.hold(700);
  }
  v.eq('n shifts × k times = O(n·k)', 'bad').say('That is n times k work. With a hundred thousand elements and k near a hundred thousand, that is ten billion moves.');

  v.chapter('better', 'Better: use a second array', { cx: 'O(n)', code: ['out[(i + k) % n] = a[i] for every i', 'copy out back into a'] });
  v.clear();
  const src = v.array('src', A, { label: 'nums' });
  const out = v.array('out', Array(A.length).fill(null), { label: 'out: element i goes to (i + k) % n' });
  A.forEach((x, i) => {
    const to = (i + K) % A.length;
    src.clearTones().tone(i, 'active');
    out.set(to, x).clearTones().tone(to, 'ok');
    v.line(0);
    if (i === 0) v.say('Better: we know exactly where each element ends up, at i plus k, modulo n. Place each one directly into a new array.');
    else v.hold(350);
  });
  v.eq('O(n) time, O(n) extra space', 'warn').say('One pass. But the extra array costs O of n memory, and the follow-up asks for constant space.');

  v.chapter('optimal', 'Optimal: three reversals', { cx: 'O(n)', code: ['k = k % n', 'reverse(a, 0, n-1)', 'reverse(a, 0, k-1)', 'reverse(a, k, n-1)'] });
  v.clear();
  const r = v.array('nums', A, { label: 'nums' });
  const cur = [...A];
  const rev = (lo: number, hi: number, label: string, say: string) => {
    r.clearTones().win(lo, hi, 'active', label);
    v.hold(500);
    let l = lo;
    let h = hi;
    while (l < h) {
      [cur[l], cur[h]] = [cur[h], cur[l]];
      r.swap(l, h);
      l++;
      h--;
    }
    r.toneRange(lo, hi, 'ok');
    v.eq(`[${cur.join(', ')}]`);
    v.say(say);
  };
  v.line(0).say('The clever version uses reversals. First, take k modulo n, since rotating by n changes nothing.');
  v.line(1);
  rev(0, A.length - 1, 'reverse all', 'Reverse the whole array. Now the last k elements are at the front, but backwards.');
  v.line(2);
  rev(0, K - 1, 'first k', 'Reverse the first k elements to fix their order.');
  v.line(3);
  rev(K, A.length - 1, 'the rest', 'And reverse the rest to fix theirs. Done: five, six, seven, one, two, three, four.');
  r.noWin().clearTones().toneRange(0, A.length - 1, 'sorted');
  v.note('each element moves at most twice').eq('O(n) time, O(1) space', 'ok').hold(900);
  v.answer(cur);

  recap(v, [{ name: 'Rotate by one, k times', time: 'O(n·k)', space: 'O(1)' }, { name: 'Extra array', time: 'O(n)', space: 'O(n)' }, { name: 'Three reversals', time: 'O(n)', space: 'O(1)' }], 'Reversal rotates in place with two in-place passes.', ['k = k % n first', 'Rotate = reverse all, then reverse each part'], 'Reversing segments is a surprisingly powerful in-place tool: rotate arrays, reverse words, and more.');
  return v.build();
}

const problem: Problem = {
  slug: 'rotate-array',
  statement: 'Given an integer array `nums`, rotate it to the **right** by `k` steps, where `k` is non-negative. Do it in place.',
  examples: [
    { input: 'nums = [1,2,3,4,5,6,7], k = 3', output: '[5,6,7,1,2,3,4]' },
    { input: 'nums = [-1,-100,3,99], k = 2', output: '[3,99,-1,-100]' },
  ],
  constraints: ['1 ≤ nums.length ≤ 10⁵', '0 ≤ k ≤ 10⁵'],
  hints: ['k can be bigger than n. What does rotating by n do?', 'Where does element i end up? Could you write it there directly?', 'What happens if you reverse the whole array?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Rotate by one, k times', idea: 'Move the last element to the front k times (after k %= n).', time: 'O(n·k)', space: 'O(1)', bottleneck: 'Each single-step rotation shifts every element.' },
    { id: 'better', kind: 'better', name: 'Extra array', idea: 'Write `nums[i]` to `out[(i + k) % n]`, then copy back.', time: 'O(n)', space: 'O(n)', bottleneck: 'Uses a second array.' },
    { id: 'optimal', kind: 'optimal', name: 'Three reversals', idea: 'After `k %= n`: reverse the whole array, then reverse the first k elements, then reverse the rest.', time: 'O(n)', space: 'O(1)' },
  ],
  pitfalls: ['Forgetting `k %= n`, which breaks when k > n.', 'Rotating left instead of right: reverse the parts in the right order.'],
  takeaway: 'To rotate in place: **reverse all, then reverse each part**.',
  video,
  videoArgs: [A, K],
  judge: {
    type: 'fn', fn: 'rotate', params: ['int[]', 'int'], ret: 'void', inplace: 0,
    tests: [{ args: [[1, 2, 3, 4, 5, 6, 7], 3], out: [5, 6, 7, 1, 2, 3, 4] }, { args: [[-1, -100, 3, 99], 2], out: [3, 99, -1, -100] }, { args: [[1, 2], 5], out: [2, 1] }, { args: [[1], 0], out: [1] }],
    gen: (r) => [r.ints(r.int(1, 15), -20, 20), r.int(0, 40)],
    ref: (a: number[], k: number) => { const n = a.length; const out = Array(n); a.forEach((x, i) => (out[(i + k) % n] = x)); return out; },
  },
};

export default problem;
