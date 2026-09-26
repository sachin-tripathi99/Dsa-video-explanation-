import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

type I = [number, number];
const IN: I[] = [[2, 6], [8, 10], [1, 3], [15, 18], [9, 11]];
const fmt = (a: number[][]) => `[${a.map((x) => `[${x}]`).join(', ')}]`;
function mergeRef(a: number[][]) { const s = a.map((x) => [...x]).sort((x, y) => x[0] - y[0]); const out: number[][] = []; for (const [st, e] of s) { if (out.length && st <= out[out.length - 1][1]) out[out.length - 1][1] = Math.max(out[out.length - 1][1], e); else out.push([st, e]); } return out; }

function video() {
  const v = new Video('merge-intervals', 'Merge Intervals');
  v.chapter('intro', 'The problem');
  v.intervals('iv', IN, { label: 'intervals', min: 0, max: 19 });
  v.say('Merge all overlapping intervals and return the non-overlapping intervals that cover exactly the same ranges.');
  v.eq(`→ ${fmt(mergeRef(IN))}`);

  v.chapter('brute', 'Brute force: merge any overlapping pair until none is left', { cx: 'O(n³)', code: ['repeat:', '  find any i, j that overlap', '  replace them with their union', 'until no pair overlaps; sort the result'] });
  v.eq('each pass checks n² pairs, up to n passes', 'bad').say('Without sorting, we can keep looking for any two intervals that overlap and replace them with their union, until no pair overlaps. Each pass checks every pair, and there can be n passes: cubic.');

  v.chapter('optimal', 'Optimal: sort by start, then one sweep', { cx: 'O(n log n)', code: ['sort by start', 'for [s, e] in intervals:', '  if out and s ≤ out.last.end:', '    out.last.end = max(out.last.end, e)', '  else: out.append([s, e])'] });
  v.clear();
  const order = IN.map((_, i) => i).sort((a, b) => IN[a][0] - IN[b][0]);
  const inp = v.intervals('in', IN, { label: 'input', min: 0, max: 19 });
  v.line(0).say('Why sort by start? After sorting, any interval that overlaps the current group must come right after it. We never have to look back further than the last merged interval.');
  order.forEach((k, r) => inp.row(k, r));
  v.eq(`sorted: ${order.map((k) => `[${IN[k]}]`).join(' ')}`).hold(900);
  const out = v.intervals('out', [], { label: 'merged', min: 0, max: 19 });
  const merged: I[] = [];
  const told = { ext: false, gap: false };
  order.forEach((k) => {
    const [s, e] = IN[k];
    inp.clearTones().tone(k, 'active').cursor(s);
    out.clearTones();
    const last = merged[merged.length - 1];
    if (last && s <= last[1]) {
      const old = last[1];
      last[1] = Math.max(old, e);
      out.set(merged.length - 1, last[0], last[1]).tone(merged.length - 1, 'ok');
      v.line(2, 3).eq(`${s} ≤ ${old} → overlap: last becomes [${last[0]},${last[1]}]`, 'ok');
      if (!told.ext) { v.say(`[${s}, ${e}] starts at ${words(s)}, before the last merged interval ends at ${words(old)}. They overlap, so extend the end to the larger of the two ends, ${words(last[1])}.`); told.ext = true; }
      else v.say(`${words(s)} is at most ${words(old)} again: extend to ${words(last[1])}.`);
    } else {
      merged.push([s, e]);
      out.add(merged.length - 1, s, e, 0).tone(merged.length - 1, 'active');
      v.line(4).eq(last ? `${s} > ${last[1]} → no overlap, append [${s},${e}]` : `first interval → append [${s},${e}]`);
      if (!last) v.say('The first interval starts the output.');
      else if (!told.gap) { v.say(`${words(s)} comes after ${words(last[1])}: a gap. Since everything later starts even further right, the previous group is final. Start a new one.`); told.gap = true; }
      else v.hold(800);
    }
  });
  inp.clearTones().cursor(null);
  out.clearTones();
  v.eq(fmt(merged), 'ok').say(`Three merged intervals remain. The sweep is linear; the sort makes it n log n overall.`);
  v.answer(mergeRef(IN));

  recap(v, [{ name: 'Merge pairs until stable', time: 'O(n³)', space: 'O(n)' }, { name: 'Sort by start + sweep', time: 'O(n log n)', space: 'O(n)' }], 'Sort by start; extend the last interval or append.', ['Overlapping ranges to combine → sort by start and sweep'], 'Sorting turns “compare with everyone” into “compare with the last one”.');
  return v.build();
}

const problem: Problem = {
  slug: 'merge-intervals',
  statement: 'Given an array of `intervals` where `intervals[i] = [startᵢ, endᵢ]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input (sorted by start).',
  examples: [{ input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' }, { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', why: 'Touching intervals overlap.' }],
  constraints: ['1 ≤ n ≤ 10⁴', '0 ≤ startᵢ ≤ endᵢ ≤ 10⁴'],
  hints: ['Sort by start.', 'Compare each interval only with the last merged one.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Merge pairs until stable', idea: 'Repeatedly find any overlapping pair and replace it with its union.', time: 'O(n³)', space: 'O(n)', bottleneck: 'Rescans all pairs after each merge.' },
    { id: 'optimal', kind: 'optimal', name: 'Sort + sweep', idea: 'Sort by start; extend the last output interval or append a new one.', time: 'O(n log n)', space: 'O(n)' },
  ],
  pitfalls: ['Extend with max(end, e), not e: a later interval may be fully inside.'],
  takeaway: '**Sort by start**, then compare with the last merged interval.',
  video,
  videoArgs: [IN],
  judge: {
    type: 'fn', fn: 'merge', params: ['int[][]'], ret: 'int[][]',
    tests: [{ args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], out: [[1, 6], [8, 10], [15, 18]] }, { args: [[[1, 4], [4, 5]]], out: [[1, 5]] }, { args: [[[1, 4], [2, 3]]], out: [[1, 4]] }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 8) }, () => { const s = r.int(0, 15); return [s, s + r.int(0, 4)]; })],
    ref: (a: number[][]) => mergeRef(a),
  },
};

export default problem;
