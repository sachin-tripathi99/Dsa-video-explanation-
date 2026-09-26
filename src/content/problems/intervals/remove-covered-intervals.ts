import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

type I = [number, number];
const IV: I[] = [[3, 6], [1, 4], [2, 8], [1, 9], [10, 12], [10, 11]];
function rc(iv: number[][]) { const s = iv.map((x) => [...x]).sort((a, b) => a[0] - b[0] || b[1] - a[1]); let mx = -Infinity, kept = 0; for (const [, e] of s) if (e > mx) { kept++; mx = e; } return kept; }

function video() {
  const v = new Video('remove-covered-intervals', 'Remove Covered Intervals');
  v.chapter('intro', 'The problem');
  v.intervals('iv', IV, { label: 'intervals', min: 0, max: 13 });
  v.say('An interval is covered by another if the other one starts at or before it and ends at or after it. Remove every covered interval and return how many remain.');
  v.eq(`answer: ${rc(IV)}`);

  v.chapter('brute', 'Brute force: check every pair', { cx: 'O(n²)', code: ['for each a:', '  covered if some b ≠ a has b.start ≤ a.start and a.end ≤ b.end'] });
  v.eq('n² pairs', 'warn').say('For each interval, check whether any other interval covers it. Quadratic.');

  v.chapter('optimal', 'Optimal: sort by start, longest first; track the furthest end', { cx: 'O(n log n)', code: ['sort by start ↑, then end ↓', 'maxEnd = −∞', 'for [s, e]: if e ≤ maxEnd: covered', '           else: keep; maxEnd = e'] });
  v.clear();
  const order = IV.map((_, i) => i).sort((a, b) => IV[a][0] - IV[b][0] || IV[b][1] - IV[a][1]);
  const p = v.intervals('iv', IV, { label: 'sorted: start ↑, end ↓', min: 0, max: 13 });
  order.forEach((k, r) => p.row(k, r));
  v.line(0).say('Sort by start. When two intervals share a start, put the longer one first, so it is seen before the ones it covers. Now every earlier interval starts at or before the current one. The current one is covered exactly when some earlier interval ends at or after its end, which means: when its end is at most the furthest end seen so far.');
  let mx = -Infinity;
  let kept = 0;
  let told = { keep: false, cov: false };
  order.forEach((k) => {
    const [s, e] = IV[k];
    p.tone(k, 'active');
    if (e > mx) {
      const prev = mx;
      kept++;
      mx = e;
      p.tone(k, 'ok').cursor(mx);
      v.line(3).counter(`kept: ${kept}`).eq(prev === -Infinity ? `keep [${s},${e}] · maxEnd = ${e}` : `${e} > ${prev} → sticks out, keep · maxEnd = ${e}`, 'ok');
      if (!told.keep) { v.say(`[${s}, ${e}] is first. Keep it. The dashed line marks the furthest end so far.`); told.keep = true; } else v.hold(800);
    } else {
      p.tone(k, 'bad');
      v.line(2).counter(`kept: ${kept}`).eq(`${e} ≤ ${mx} → covered, remove [${s},${e}]`, 'bad');
      if (!told.cov) { v.say(`[${s}, ${e}] ends at ${words(e)}, inside the furthest end, ${words(mx)}. An earlier interval starts no later and ends no earlier, so this one is covered.`); told.cov = true; } else v.hold(800);
    }
  });
  p.cursor(null);
  v.eq(`remaining = ${kept}`, 'ok').say(`${words(kept)} intervals remain. The tie-break matters: without longest-first, [10, 11] would be seen before [10, 12] and counted wrongly.`);
  v.answer(rc(IV));

  recap(v, [{ name: 'All pairs', time: 'O(n²)', space: 'O(1)' }, { name: 'Sort + running max end', time: 'O(n log n)', space: 'O(1)' }], 'Sort by start asc, end desc; covered ⇔ end ≤ max end so far.', ['Containment between intervals → sort with a tie-break, sweep'], 'A careful tie-break turns a pairwise check into a single sweep.');
  return v.build();
}

const problem: Problem = {
  slug: 'remove-covered-intervals',
  statement: 'Given an array `intervals` where `intervals[i] = [lᵢ, rᵢ]` (all distinct), remove all intervals that are covered by another interval. `[a,b)` is covered by `[c,d)` if `c ≤ a` and `b ≤ d`. Return the number of remaining intervals.',
  examples: [{ input: 'intervals = [[1,4],[3,6],[2,8]]', output: '2' }, { input: 'intervals = [[1,4],[2,3]]', output: '1' }],
  constraints: ['1 ≤ n ≤ 1000', '0 ≤ lᵢ < rᵢ ≤ 10⁵', 'all intervals are unique'],
  hints: ['After sorting by start, earlier intervals start no later.', 'Break ties by longer first.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'All pairs', idea: 'For each interval, check if any other covers it.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Quadratic.' },
    { id: 'optimal', kind: 'optimal', name: 'Sort + max end', idea: 'Sort by start asc, end desc; count intervals whose end exceeds the running max.', time: 'O(n log n)', space: 'O(1)' },
  ],
  pitfalls: ['Equal starts: the longer interval must come first.'],
  takeaway: 'Sort with the right **tie-break**, then sweep.',
  video,
  videoArgs: [IV],
  judge: {
    type: 'fn', fn: 'removeCoveredIntervals', params: ['int[][]'], ret: 'int',
    tests: [{ args: [[[1, 4], [3, 6], [2, 8]]], out: 2 }, { args: [[[1, 4], [2, 3]]], out: 1 }, { args: [IV], out: 2 }],
    gen: (r: Rng) => { const seen = new Set<string>(); const out: number[][] = []; const n = r.int(1, 8); while (out.length < n) { const s = r.int(0, 10), e = s + r.int(1, 5); if (!seen.has(`${s},${e}`)) { seen.add(`${s},${e}`); out.push([s, e]); } } return [out]; },
    ref: (iv: number[][]) => rc(iv),
  },
};

export default problem;
