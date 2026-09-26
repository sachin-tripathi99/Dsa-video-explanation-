import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

type I = [number, number];
const IV: I[] = [[1, 10], [2, 3], [4, 6], [5, 7], [8, 9]];
function eo(iv: number[][]) { const s = iv.map((x) => [...x]).sort((a, b) => a[1] - b[1]); let end = -Infinity, kept = 0; for (const [a, b] of s) if (a >= end) { end = b; kept++; } return iv.length - kept; }

function video() {
  const v = new Video('non-overlapping-intervals', 'Non-overlapping Intervals');
  v.chapter('intro', 'The problem');
  v.intervals('iv', IV, { label: 'intervals (touching is fine)', min: 0, max: 11 });
  v.say('Return the minimum number of intervals to remove so that the rest do not overlap. Intervals that only touch, like one to two and two to three, are fine.');
  v.eq(`answer: ${eo(IV)}`).say('Removing the fewest is the same as keeping the most. So the real question is: what is the largest set of non-overlapping intervals?');

  v.chapter('brute', 'Brute force: DP over intervals sorted by start', { cx: 'O(n²)', code: ['sort by start', 'keep[i] = 1 + max(keep[j] for j < i with end[j] ≤ start[i])', 'answer = n − max(keep)'] });
  v.eq('like longest increasing subsequence: n² pairs', 'warn').say('One correct approach is a dynamic program, just like longest increasing subsequence: for each interval, the longest chain of compatible intervals ending with it. Checking every earlier interval makes it quadratic.');

  v.chapter('insight', 'Why the earliest end is always safe');
  v.clear();
  const g = v.intervals('g', [[1, 10], [2, 3]], { label: 'two choices for the first kept interval', min: 0, max: 11 });
  g.tone(0, 'bad').tone(1, 'ok');
  v.eq('ending earlier never blocks more than ending later', 'ok').say('Suppose we must pick the first interval to keep. Picking the one that ends earliest is never worse: whatever a later-ending choice allows afterwards, the earlier-ending one allows too, and possibly more. This exchange argument is why greedy by end is correct.');

  v.chapter('optimal', 'Optimal: sort by end, keep greedily', { cx: 'O(n log n)', code: ['sort by end', 'end = −∞', 'for [s, e]: if s ≥ end: keep, end = e', '           else: remove (count += 1)'] });
  v.clear();
  const order = IV.map((_, i) => i).sort((a, b) => IV[a][1] - IV[b][1]);
  const p = v.intervals('iv', IV, { label: 'sorted by end', min: 0, max: 11 });
  order.forEach((k, r) => p.row(k, r));
  v.line(0).say('Sort by end time. The long interval from one to ten drops to the bottom.');
  let end = -Infinity;
  let removed = 0;
  let told = { keep: false, rem: false };
  order.forEach((k) => {
    const [s, e] = IV[k];
    p.tone(k, 'active');
    if (s >= end) {
      const prev = end;
      end = e;
      p.tone(k, 'ok').cursor(end);
      v.line(2).counter(`removed: ${removed}`).eq(prev === -Infinity ? `keep [${s},${e}] · end = ${e}` : `${s} ≥ ${prev} → keep [${s},${e}] · end = ${e}`, 'ok');
      if (!told.keep) { v.say(`[${s}, ${e}] ends first. Keep it; the line marks where the kept set ends.`); told.keep = true; } else v.hold(800);
    } else {
      removed++;
      p.tone(k, 'bad');
      v.line(3).counter(`removed: ${removed}`).eq(`${s} < ${end} → overlaps the kept set, remove [${s},${e}]`, 'bad');
      if (!told.rem) { v.say(`[${s}, ${e}] starts at ${words(s)}, before the kept set ends at ${words(end)}. Keeping it would clash, and since it ends later than what we kept, removing it is the better choice.`); told.rem = true; } else v.hold(800);
    }
  });
  p.cursor(null);
  v.eq(`remove ${removed}`, 'ok').say(`We removed ${words(removed)} intervals, the minimum.`);
  v.answer(eo(IV));

  recap(v, [{ name: 'DP (longest chain)', time: 'O(n²)', space: 'O(n)' }, { name: 'Greedy by end', time: 'O(n log n)', space: 'O(1)' }], 'Keep the interval that ends first; remove anything that starts before the kept end.', ['Min removals / max non-overlapping → sort by end, greedy'], 'Activity selection: finishing first leaves the most room.');
  return v.build();
}

const problem: Problem = {
  slug: 'non-overlapping-intervals',
  statement: 'Given an array of intervals `intervals` where `intervals[i] = [startᵢ, endᵢ]`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping. Intervals that only touch at a point (like `[1,2]` and `[2,3]`) are non-overlapping.',
  examples: [{ input: 'intervals = [[1,2],[2,3],[3,4],[1,3]]', output: '1' }, { input: 'intervals = [[1,2],[1,2],[1,2]]', output: '2' }, { input: 'intervals = [[1,2],[2,3]]', output: '0' }],
  constraints: ['1 ≤ n ≤ 10⁵', '−5·10⁴ ≤ startᵢ < endᵢ ≤ 5·10⁴'],
  hints: ['Minimum removals = n − maximum kept.', 'Which interval should you keep first?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'DP: longest compatible chain', idea: 'Sort by start; keep[i] = 1 + max keep[j] with end[j] ≤ start[i].', time: 'O(n²)', space: 'O(n)', bottleneck: 'Quadratic transitions.' },
    { id: 'optimal', kind: 'optimal', name: 'Greedy by end', idea: 'Sort by end; keep an interval if it starts at or after the last kept end.', time: 'O(n log n)', space: 'O(1)' },
  ],
  pitfalls: ['Touching intervals do not overlap here: compare with ≥.'],
  takeaway: 'Max non-overlapping → **sort by end**.',
  video,
  videoArgs: [IV],
  judge: {
    type: 'fn', fn: 'eraseOverlapIntervals', params: ['int[][]'], ret: 'int',
    tests: [{ args: [[[1, 2], [2, 3], [3, 4], [1, 3]]], out: 1 }, { args: [[[1, 2], [1, 2], [1, 2]]], out: 2 }, { args: [[[1, 2], [2, 3]]], out: 0 }, { args: [IV], out: 2 }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 9) }, () => { const s = r.int(-5, 10); return [s, s + r.int(1, 5)]; })],
    ref: (iv: number[][]) => eo(iv),
  },
};

export default problem;
