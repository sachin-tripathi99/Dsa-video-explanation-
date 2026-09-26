import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const H = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];

function trap(h: number[]) {
  let l = 0, r = h.length - 1, lm = 0, rm = 0, w = 0;
  while (l < r) {
    if (h[l] < h[r]) { lm = Math.max(lm, h[l]); w += lm - h[l]; l++; }
    else { rm = Math.max(rm, h[r]); w += rm - h[r]; r--; }
  }
  return w;
}

function video() {
  const v = new Video('trapping-rain-water', 'Trapping Rain Water');
  const n = H.length;
  const water = H.map((h, i) => Math.max(0, Math.min(Math.max(...H.slice(0, i + 1)), Math.max(...H.slice(i))) - h));
  v.chapter('intro', 'The problem');
  const a = v.array('h', H, { label: 'elevation map', bars: true });
  v.say('The numbers are the heights of bars, each one unit wide. After it rains, how much water is trapped between the bars?');
  water.forEach((w, i) => { if (w) a.sub(i, `+${w}`).tone(i, 'active'); });
  v.eq(`water per column: ${water.join(' ')} → total ${water.reduce((x, y) => x + y, 0)}`, 'ok').say('The blue columns hold water. Six units in total.');
  a.clearTones().subs([]);

  v.chapter('insight', 'Water above one column');
  v.clear();
  const b = v.array('h', H, { label: 'column 5', bars: true });
  const i5 = 5;
  const lm = Math.max(...H.slice(0, i5 + 1));
  const rm = Math.max(...H.slice(i5));
  b.tone(i5, 'active').tone(H.indexOf(lm), 'cmp').tone(H.indexOf(rm, i5), 'cmp');
  v.eq(`water[i] = min(maxLeft, maxRight) − h[i] = min(${lm}, ${rm}) − ${H[i5]} = ${Math.min(lm, rm) - H[i5]}`).say(`Focus on one column. Water above it rises until it spills over the lower of two walls: the tallest bar to its left, and the tallest bar to its right. For column five, those are ${lm} and ${rm}, so the water level is ${Math.min(lm, rm)}, and the column holds ${Math.min(lm, rm) - H[i5]} units.`);

  v.chapter('brute', 'Brute force: scan both sides for every column', { cx: 'O(n²)', code: ['for i in 0..n−1:', '  maxLeft = max(h[0..i]); maxRight = max(h[i..n−1])', '  total += min(maxLeft, maxRight) − h[i]'] });
  v.eq('each column scans the whole array → O(n²)', 'warn').say('Applying that formula directly, each column scans left and right for its tallest walls. That is n squared.');

  v.chapter('better', 'Better: precompute maxLeft and maxRight', { cx: 'O(n) · O(n) space', code: ['left[i] = max(left[i−1], h[i])', 'right[i] = max(right[i+1], h[i])', 'total += min(left[i], right[i]) − h[i]'] });
  v.clear();
  const L: number[] = [];
  const R: number[] = Array(n).fill(0);
  H.forEach((h, i) => L.push(Math.max(i ? L[i - 1] : 0, h)));
  for (let i = n - 1; i >= 0; i--) R[i] = Math.max(i < n - 1 ? R[i + 1] : 0, H[i]);
  v.array('h', H, { label: 'h', bars: true });
  v.array('L', L, { label: 'maxLeft[i]' });
  v.array('R', R, { label: 'maxRight[i]' });
  v.line(0, 1).eq('two passes build the walls; a third sums the water').say('Those maximums are prefix and suffix maximums. Compute them once, left to right and right to left, and every column costs constant time. Linear time, but two extra arrays.');

  v.chapter('optimal', 'Optimal: two pointers, trust the lower side', { cx: 'O(n) · O(1)', code: ['l, r = 0, n − 1; lmax = rmax = 0', 'while l < r:', '  if h[l] < h[r]:', '    lmax = max(lmax, h[l]); water += lmax − h[l]; l += 1', '  else:', '    rmax = max(rmax, h[r]); water += rmax − h[r]; r −= 1'] });
  v.clear();
  const c = v.array('h', H, { label: 'h', bars: true });
  const vars = v.vars('v', { lmax: 0, rmax: 0, water: 0 });
  v.say('Can we drop the arrays? Put pointers at both ends and keep the tallest wall seen from each side. Here is the key: if h of l is lower than h of r, then there is a wall at least as tall as h of r on the right. So the water at l is decided by the left maximum alone. We can settle column l and move on.');
  let l = 0;
  let r = n - 1;
  let lmax = 0;
  let rmax = 0;
  let w = 0;
  let told = false;
  while (l < r) {
    c.clearTones().ptrs({ l, r });
    for (let k = 0; k < l; k++) c.tone(k, 'done');
    for (let k = r + 1; k < n; k++) c.tone(k, 'done');
    if (H[l] < H[r]) {
      lmax = Math.max(lmax, H[l]);
      const add = lmax - H[l];
      w += add;
      c.tone(l, add ? 'active' : 'cmp');
      if (add) c.sub(l, `+${add}`);
      vars.set({ lmax, rmax, water: w });
      v.line(3).eq(`h[l]=${H[l]} < h[r]=${H[r]} → settle l: lmax ${lmax} − ${H[l]} = +${add}`);
      if (add && !told) {
        v.say(`Here the left bar, height ${H[l]}, is lower than the right one, and the tallest wall seen on the left is ${lmax}. So this column holds ${add} unit${add === 1 ? '' : 's'} of water, whatever lies further right.`);
        told = true;
      } else v.hold(600);
      l++;
    } else {
      rmax = Math.max(rmax, H[r]);
      const add = rmax - H[r];
      w += add;
      c.tone(r, add ? 'active' : 'cmp');
      if (add) c.sub(r, `+${add}`);
      vars.set({ lmax, rmax, water: w });
      v.line(5).eq(`h[l]=${H[l]} ≥ h[r]=${H[r]} → settle r: rmax ${rmax} − ${H[r]} = +${add}`);
      v.hold(600);
      r--;
    }
  }
  c.clearTones().noPtr();
  v.eq(`total = ${w}`, 'ok').say(`Every column is settled exactly once, from whichever side is lower. Total: ${w} units, in one pass and constant memory.`);
  v.answer(trap(H));

  recap(v, [
    { name: 'Scan both sides per column', time: 'O(n²)', space: 'O(1)' },
    { name: 'Prefix / suffix maxima', time: 'O(n)', space: 'O(n)' },
    { name: 'Two pointers', time: 'O(n)', space: 'O(1)' },
  ], 'Water at i = min(maxLeft, maxRight) − h[i]; the lower side can be settled now.', ['Per-element answer depends on max to the left and right → prefix/suffix maxima', 'Two pointers settle the side whose bound is known'], 'Write the per-column formula first. Then precompute it, then realise the lower side is already decided.');
  return v.build();
}

const problem: Problem = {
  slug: 'trapping-rain-water',
  statement: 'Given `n` non-negative integers representing an elevation map where each bar has width 1, compute how much water it can trap after raining.',
  examples: [{ input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' }, { input: 'height = [4,2,0,3,2,5]', output: '9' }],
  constraints: ['1 ≤ n ≤ 2 · 10⁴', '0 ≤ height[i] ≤ 10⁵'],
  hints: ['How high does water rise above a single bar?', 'water[i] = min(max left, max right) − height[i].', 'If height[l] < height[r], is the right wall of l already tall enough?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Scan per column', idea: 'For each i, find the max to its left and right by scanning.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Rescans for every column.' },
    { id: 'better', kind: 'better', name: 'Prefix and suffix maxima', idea: 'Precompute maxLeft[i] and maxRight[i]; sum min − height.', time: 'O(n)', space: 'O(n)' },
    { id: 'optimal', kind: 'optimal', name: 'Two pointers', idea: 'Move the side with the lower bar; its water is its own side’s running max minus its height.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Per-column formula → **prefix/suffix max** → two pointers settling the **lower side**.',
  video,
  videoArgs: [H],
  judge: {
    type: 'fn', fn: 'trap', params: ['int[]'], ret: 'int',
    tests: [
      { args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], out: 6 },
      { args: [[4, 2, 0, 3, 2, 5]], out: 9 },
      { args: [[5]], out: 0 },
      { args: [Array.from({ length: 20000 }, (_, i) => (i * 37) % 1000)], out: trap(Array.from({ length: 20000 }, (_, i) => (i * 37) % 1000)), big: true },
    ],
    gen: (r: Rng) => [r.ints(r.int(1, 14), 0, 6)],
    ref: (h: number[]) => trap(h),
  },
};

export default problem;
