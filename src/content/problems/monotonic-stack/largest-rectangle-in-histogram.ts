import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const H = [2, 1, 5, 6, 2, 3];
function lr(h: number[]) { const st: number[] = []; let b = 0; for (let i = 0; i <= h.length; i++) { const x = i === h.length ? 0 : h[i]; while (st.length && h[st[st.length - 1]] > x) { const t = st.pop()!; const left = st.length ? st[st.length - 1] : -1; b = Math.max(b, h[t] * (i - left - 1)); } st.push(i); } return b; }

function video() {
  const v = new Video('largest-rectangle-histogram', 'Largest Rectangle in Histogram');
  v.chapter('intro', 'The problem');
  const a0 = v.array('h', H, { label: 'bar heights, each of width 1', bars: true });
  a0.win(2, 3, 'win', 'area 10');
  v.say('Find the area of the largest rectangle that fits inside the histogram. Here bars five and six together allow a rectangle of height five and width two: area ten.');

  v.chapter('brute', 'Brute force: expand from every bar', { cx: 'O(n²)', code: ['for each bar i:', '  extend left and right while bars are ≥ h[i]', '  area = h[i] × width'] });
  v.eq('each bar can scan the whole histogram', 'warn').say('The best rectangle has the height of some bar, the shortest one it covers. So for each bar, extend left and right while bars are at least as tall. That is n squared in the worst case.');

  v.chapter('optimal', 'Optimal: increasing stack; a popped bar knows its width', { cx: 'O(n)', code: ['for i in 0..n (h[n] = 0 as a sentinel):', '  while stack and h[stack.top] > h[i]:', '    t = pop; left = new top (or −1)', '    area = h[t] × (i − left − 1)', '  push i'] });
  v.clear();
  const a = v.array('h', H, { label: 'heights', bars: true });
  const st = v.stack('st', [], { label: 'indices, heights increasing' });
  const stack: number[] = [];
  let best = 0;
  let told = 0;
  v.say('Each bar needs two numbers: the nearest shorter bar on its left and on its right. An increasing stack gives both at once. When a shorter bar arrives, it is the right boundary for the taller bars it pops, and whatever remains on the stack below a popped bar is its left boundary.');
  for (let i = 0; i <= H.length; i++) {
    const x = i === H.length ? 0 : H[i];
    a.clearTones().noWin();
    if (i < H.length) a.tone(i, 'active');
    while (stack.length && H[stack[stack.length - 1]] > x) {
      const t = stack.pop()!;
      st.pop();
      const left = stack.length ? stack[stack.length - 1] : -1;
      const area = H[t] * (i - left - 1);
      const nb = area > best;
      best = Math.max(best, area);
      a.win(left + 1, i - 1, nb ? 'ok' : 'win', `${H[t]}×${i - left - 1}=${area}`).tone(t, 'cmp');
      v.line(2, 3).counter(`best: ${best}`).eq(`pop height ${H[t]}: width ${i} − ${left < 0 ? '(−1)' : left} − 1 = ${i - left - 1} → area ${area}${nb ? ' ← best' : ''}`, nb ? 'ok' : undefined);
      if (told === 0) { v.say(`Bar one arrives, shorter than two. So two cannot extend past it on the right, and nothing is left below it on the stack, so it cannot extend left either. Its rectangle is two by one.`); told++; }
      else if (area === 10) { v.say(`Popping five: the right boundary is the bar at index ${words(i)}, the left boundary is the bar at index ${words(left)}. Width two, area ten, the best so far.`); }
      else v.hold(700);
    }
    if (i < H.length) { stack.push(i); st.push(`${i}:${H[i]}`); v.line(4).hold(350); }
  }
  a.noWin().clearTones();
  v.eq(`largest area = ${best}`, 'ok').say(`A zero-height sentinel at the end flushes every remaining bar. Each bar is pushed and popped once, so the whole thing is linear. The answer is ${words(best)}.`);
  v.answer(lr(H));

  recap(v, [{ name: 'Expand from every bar', time: 'O(n²)', space: 'O(1)' }, { name: 'Increasing monotonic stack', time: 'O(n)', space: 'O(n)' }], 'Popped bar: right boundary = current index, left boundary = new stack top.', ['Largest rectangle / widest span bounded by smaller elements → monotonic stack'], 'This is the classic monotonic stack problem: popping reveals both boundaries at once.');
  return v.build();
}

const problem: Problem = {
  slug: 'largest-rectangle-in-histogram',
  statement: 'Given an array of integers `heights` representing the histogram’s bar heights where the width of each bar is 1, return the area of the largest rectangle in the histogram.',
  examples: [{ input: 'heights = [2,1,5,6,2,3]', output: '10' }, { input: 'heights = [2,4]', output: '4' }],
  constraints: ['1 ≤ n ≤ 10⁵', '0 ≤ heights[i] ≤ 10⁴'],
  hints: ['The best rectangle’s height equals some bar’s height.', 'For each bar, find the nearest shorter bar on each side.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Expand from every bar', idea: 'For each bar extend left and right while bars ≥ h[i].', time: 'O(n²)', space: 'O(1)', bottleneck: 'Long expansions.' },
    { id: 'optimal', kind: 'optimal', name: 'Monotonic stack', idea: 'Increasing stack of indices with a 0 sentinel; on pop, width = i − newTop − 1.', time: 'O(n)', space: 'O(n)' },
  ],
  takeaway: 'Popping a bar reveals **both** its boundaries.',
  video,
  videoArgs: [H],
  judge: {
    type: 'fn', fn: 'largestRectangleArea', params: ['int[]'], ret: 'int',
    tests: [{ args: [[2, 1, 5, 6, 2, 3]], out: 10 }, { args: [[2, 4]], out: 4 }, { args: [[0]], out: 0 }, { args: [[3, 3, 3]], out: 9 }],
    gen: (r: Rng) => [r.ints(r.int(1, 12), 0, 8)],
    ref: (h: number[]) => lr(h),
  },
};

export default problem;
