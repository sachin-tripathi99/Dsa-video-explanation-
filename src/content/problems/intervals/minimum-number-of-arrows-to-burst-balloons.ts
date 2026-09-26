import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

type I = [number, number];
const B: I[] = [[10, 16], [2, 8], [1, 6], [7, 12]];
function arrows(p: number[][]) { const s = p.map((x) => [...x]).sort((a, b) => a[1] - b[1]); let n = 0, x = -Infinity; for (const [a, b] of s) if (a > x) { n++; x = b; } return n; }

function video() {
  const v = new Video('min-arrows', 'Minimum Number of Arrows to Burst Balloons');
  v.chapter('intro', 'The problem');
  v.intervals('b', B, { label: 'balloons: horizontal spans [x_start, x_end]', min: 0, max: 17 });
  v.say('Each balloon spans a range on the x axis. An arrow shot straight up at position x bursts every balloon whose range contains x, including the endpoints. What is the minimum number of arrows to burst them all?');
  v.eq(`answer: ${arrows(B)}`);

  v.chapter('brute', 'Brute force: repeatedly shoot for the balloon that ends first', { cx: 'O(n²)', code: ['while balloons remain:', '  b = remaining balloon with the smallest end', '  shoot at b.end; burst every balloon containing it'] });
  v.eq('n arrows × n balloons to check', 'warn').say('Without sorting, each round scans every balloon to find the one ending first and then scans again to burst everything the arrow hits. That is quadratic.');

  v.chapter('insight', 'Why shoot at the earliest end?');
  v.clear();
  const g = v.intervals('g', [[1, 6], [2, 8]], { label: 'the balloon that ends first', min: 0, max: 17 });
  g.tone(0, 'active').cursor(6);
  v.eq('some arrow must hit [1,6]; the furthest right it can be is 6', 'ok').say('The balloon that ends first, one to six, must be hit by some arrow at or before six. Pushing that arrow as far right as possible, exactly at six, can only hit more balloons. So shoot at the end of the earliest-ending balloon.');

  v.chapter('optimal', 'Optimal: sort by end, shoot at ends', { cx: 'O(n log n)', code: ['sort by end', 'for [s, e]:', '  if s > arrow: arrows += 1; arrow = e', '  else: already burst'] });
  v.clear();
  const order = B.map((_, i) => i).sort((a, b) => B[a][1] - B[b][1]);
  const p = v.intervals('b', B, { label: 'balloons sorted by end', min: 0, max: 17 });
  order.forEach((k, r) => p.row(k, r));
  v.line(0).say('Sort the balloons by where they end.');
  let x = -Infinity;
  let n = 0;
  let told = { shot: 0, hit: false };
  order.forEach((k) => {
    const [s, e] = B[k];
    if (s > x) {
      const px = x;
      n++;
      x = e;
      p.clearTones().tone(k, 'active').cursor(x);
      order.forEach((j) => { if (B[j][0] <= x && x <= B[j][1] && j !== k) p.tone(j, 'cmp'); });
      v.line(2).counter(`arrows: ${n}`).eq(n === 1 ? `no arrow yet → shoot at x = ${e}` : `${s} > ${px} (last arrow) → new arrow at x = ${e}`, 'ok');
      if (told.shot === 0) v.say(`[${s}, ${e}] ends first. Shoot the first arrow at ${words(e)}.`);
      else v.say(`[${s}, ${e}] starts at ${words(s)}, to the right of the last arrow. It is still intact, so it needs a new arrow: shoot at its end, ${words(e)}.`);
      told.shot++;
    } else {
      p.tone(k, 'ok');
      v.line(3).eq(`${s} ≤ ${x} ≤ ${e} → already burst by the arrow at ${x}`, 'ok');
      if (!told.hit) { v.say(`[${s}, ${e}] starts at ${words(s)}, at or before the arrow at ${words(x)}, and since balloons are sorted by end, it ends at or after it. The arrow already burst it.`); told.hit = true; } else v.hold(800);
    }
  });
  p.cursor(null).clearTones();
  v.eq(`arrows = ${n}`, 'ok').say(`${words(n)} arrows burst every balloon.`);
  v.answer(arrows(B));

  recap(v, [{ name: 'Repeated scans', time: 'O(n²)', space: 'O(n)' }, { name: 'Sort by end, greedy shots', time: 'O(n log n)', space: 'O(1)' }], 'Shoot at the end of the first intact balloon.', ['Minimum points to stab all intervals → sort by end'], 'The same greedy as non-overlapping intervals, with closed endpoints.');
  return v.build();
}

const problem: Problem = {
  slug: 'minimum-number-of-arrows-to-burst-balloons',
  statement: 'Balloons are given as `points[i] = [x_start, x_end]`. An arrow shot vertically at `x` bursts every balloon with `x_start ≤ x ≤ x_end`. Return the minimum number of arrows that must be shot to burst all balloons.',
  examples: [{ input: 'points = [[10,16],[2,8],[1,6],[7,12]]', output: '2' }, { input: 'points = [[1,2],[3,4],[5,6],[7,8]]', output: '4' }, { input: 'points = [[1,2],[2,3],[3,4],[4,5]]', output: '2' }],
  constraints: ['1 ≤ n ≤ 10⁵', '−2³¹ ≤ x_start < x_end ≤ 2³¹ − 1'],
  hints: ['Some arrow must hit the balloon that ends first.', 'Where should that arrow be to hit as many others as possible?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Repeated scans', idea: 'Find the intact balloon with the smallest end, shoot at its end, burst all it hits; repeat.', time: 'O(n²)', space: 'O(n)', bottleneck: 'Rescans.' },
    { id: 'optimal', kind: 'optimal', name: 'Sort by end', idea: 'Sort by end; when a balloon starts after the last arrow, shoot at its end.', time: 'O(n log n)', space: 'O(1)' },
  ],
  pitfalls: ['Values span the full int range: use Integer.compare, not subtraction.', 'Endpoints count: use s > arrow for a new arrow.'],
  takeaway: 'Stab intervals → **sort by end**.',
  video,
  videoArgs: [B],
  judge: {
    type: 'fn', fn: 'findMinArrowShots', params: ['int[][]'], ret: 'int',
    tests: [{ args: [B], out: 2 }, { args: [[[1, 2], [3, 4], [5, 6], [7, 8]]], out: 4 }, { args: [[[1, 2], [2, 3], [3, 4], [4, 5]]], out: 2 }, { args: [[[-2147483648, 2147483647]]], out: 1 }, { args: [[[-2147483646, -2147483645], [2147483646, 2147483647]]], out: 2 }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 9) }, () => { const s = r.int(-5, 12); return [s, s + r.int(1, 5)]; })],
    ref: (p: number[][]) => arrows(p),
  },
};

export default problem;
