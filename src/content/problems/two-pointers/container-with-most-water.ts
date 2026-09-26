import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const H = [1, 8, 6, 2, 5, 4, 8, 3, 7];

function best(h: number[]) {
  let l = 0, r = h.length - 1, b = 0;
  while (l < r) { b = Math.max(b, Math.min(h[l], h[r]) * (r - l)); if (h[l] < h[r]) l++; else r--; }
  return b;
}

function video() {
  const v = new Video('container-most-water', 'Container With Most Water');
  v.chapter('intro', 'The problem');
  const a = v.array('h', H, { label: 'heights of vertical lines', bars: true });
  v.say('Each number is the height of a vertical line. Pick two lines; together with the floor they form a container. How much water can the best container hold?');
  a.win(1, 8, 'win').tone([1, 8], 'active');
  v.eq('area = min(h[l], h[r]) × (r − l) = min(8, 7) × 7 = 49').say('Water fills up to the shorter of the two lines, and spreads across their distance. Lines one and eight give seven times seven, forty-nine.');
  a.noWin().clearTones();

  v.chapter('brute', 'Brute force: every pair', { cx: 'O(n²)', code: ['for l in 0..n−1:', '  for r in l+1..n−1:', '    best = max(best, min(h[l], h[r]) × (r − l))'] });
  v.eq(`${(H.length * (H.length - 1)) / 2} pairs for ${H.length} lines → O(n²)`, 'warn').say('Trying every pair works, but for a hundred thousand lines that is five billion pairs.');

  v.chapter('optimal', 'Optimal: start wide, move the shorter line', { cx: 'O(n)', code: ['l, r = 0, n − 1', 'while l < r:', '  best = max(best, min(h[l], h[r]) × (r − l))', '  if h[l] < h[r]: l += 1   # drop the shorter', '  else: r −= 1'] });
  let l = 0;
  let r = H.length - 1;
  let b = 0;
  let step = 0;
  v.say('Start with the widest container, the two outermost lines. Then think about which line to move.');
  while (l < r) {
    const area = Math.min(H[l], H[r]) * (r - l);
    const improved = area > b;
    b = Math.max(b, area);
    a.clearTones().ptrs({ l, r }).win(l, r, 'win', `area ${area}`).tone([l, r], 'active');
    const short = H[l] < H[r] ? l : r;
    a.tone(short, 'bad');
    v.line(2, H[l] < H[r] ? 3 : 4).counter(`best: ${b}`).eq(`min(${H[l]}, ${H[r]}) × ${r - l} = ${area}${improved ? ' ← new best' : ''} · move the shorter (${H[short]})`, improved ? 'ok' : undefined);
    if (step === 0) v.say(`Heights one and seven, width eight: area eight. Now, the left line is only one tall. Any narrower container using it holds at most one times a smaller width, so it can never beat eight. That line is useless from now on. Move it.`);
    else if (step === 1) v.say(`Eight and seven, width seven: forty-nine, the new best. The right line, seven, is shorter, so every narrower container that keeps it is worse. Move r.`);
    else v.hold(700);
    step++;
    if (H[l] < H[r]) l++;
    else r--;
  }
  a.noWin().noPtr().clearTones();
  v.eq(`best = ${b}`, 'ok').say(`Every move discards a line that cannot be part of a better answer, so one pass finds the best: ${b}.`);
  v.answer(b);

  recap(v, [{ name: 'Every pair', time: 'O(n²)', space: 'O(1)' }, { name: 'Two pointers, move the shorter', time: 'O(n)', space: 'O(1)' }], 'The shorter line limits every narrower container, so drop it.', ['Maximise over pairs with width × limiting height → start wide, move the limiting side'], 'Start wide and always move the side that limits you. Moving the taller side can only make things worse.');
  return v.build();
}

const problem: Problem = {
  slug: 'container-with-most-water',
  statement: 'You are given `height` of length `n`: line `i` goes from `(i, 0)` to `(i, height[i])`. Find two lines that, together with the x-axis, form a container holding the most water. Return that maximum amount.',
  examples: [{ input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49' }, { input: 'height = [1,1]', output: '1' }],
  constraints: ['2 ≤ n ≤ 10⁵', '0 ≤ height[i] ≤ 10⁴'],
  hints: ['Start with the widest container.', 'Moving the taller line inward can never help. Why?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every pair', idea: 'Compute min(h[l], h[r]) × (r − l) for every pair.', time: 'O(n²)', space: 'O(1)', bottleneck: 'n²/2 pairs.' },
    { id: 'optimal', kind: 'optimal', name: 'Two pointers', idea: 'Start at both ends; record the area; move the pointer at the shorter line.', time: 'O(n)', space: 'O(1)' },
  ],
  pitfalls: ['When heights are equal, moving either side is fine: both are limiting.'],
  takeaway: 'Start **wide**, then always move the **limiting** side.',
  video,
  videoArgs: [H],
  judge: {
    type: 'fn', fn: 'maxArea', params: ['int[]'], ret: 'int',
    tests: [{ args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], out: 49 }, { args: [[1, 1]], out: 1 }, { args: [Array.from({ length: 30000 }, (_, i) => (i * 7919) % 10001)], out: best(Array.from({ length: 30000 }, (_, i) => (i * 7919) % 10001)), big: true }],
    gen: (r: Rng) => [r.ints(r.int(2, 12), 0, 12)],
    ref: (h: number[]) => best(h),
  },
};

export default problem;
