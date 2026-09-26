import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

type I = [number, number];
const IV: I[] = [[5, 10], [6, 8], [1, 5], [2, 3], [1, 10]];
function groups(iv: number[][]) { const st = iv.map((x) => x[0]).sort((a, b) => a - b), en = iv.map((x) => x[1]).sort((a, b) => a - b); let j = 0, g = 0; for (const s of st) { if (s > en[j]) j++; else g++; } return g; }

function video() {
  const v = new Video('divide-intervals-groups', 'Divide Intervals Into Minimum Number of Groups');
  v.chapter('intro', 'The problem');
  v.intervals('iv', IV, { label: 'inclusive intervals', min: 0, max: 11 });
  v.say('Split the intervals into groups so that no two intervals in the same group intersect. Intervals are inclusive, so [1, 5] and [5, 10] do intersect at five. What is the minimum number of groups?');
  v.eq(`answer: ${groups(IV)}`).say('Think of groups as meeting rooms. The answer is the largest number of intervals that overlap at any single point.');

  v.chapter('brute', 'Brute force: count overlaps at every start', { cx: 'O(n²)', code: ['for each interval a:', '  count intervals b with b.start ≤ a.start ≤ b.end', 'answer = max count'] });
  v.eq('the busiest point is always some start', 'warn').say('The busiest moment is always at the start of some interval. For each start, count how many intervals contain it. Quadratic.');

  v.chapter('better', 'Better: assign greedily with a min-heap of group end times', { cx: 'O(n log n)', code: ['sort by start', 'for [s, e]:', '  if heap.min < s: reuse that group (pop)', '  push e    # heap size = number of groups'] });
  v.clear();
  const order = IV.map((_, i) => i).sort((a, b) => IV[a][0] - IV[b][0] || IV[a][1] - IV[b][1]);
  const p = v.intervals('iv', [], { label: 'each row is a group', min: 0, max: 11 });
  const h = v.heap('h', { label: 'min-heap: end time of each group', min: true });
  const rowEnd: number[] = [];
  let told = { neu: false, reuse: false };
  v.say('Process intervals by start time. Keep a min-heap with the end time of the last interval in each group. The group that frees up earliest is on top. If it ends strictly before the new interval starts, reuse it. Otherwise open a new group.');
  order.forEach((k) => {
    const [s, e] = IV[k];
    const top = h.peek() as number | undefined;
    if (top !== undefined && top < s) {
      h.pop();
      const row = rowEnd.indexOf(top);
      rowEnd[row] = e;
      h.push(e);
      p.clearTones().add(k, s, e, row).tone(k, 'ok');
      v.line(2, 3).counter(`groups: ${rowEnd.length}`).eq(`heap min ${top} < ${s} → reuse group ${row + 1}`, 'ok');
      if (!told.reuse) { v.say(`[${s}, ${e}] starts at ${words(s)}. The earliest group ends at ${words(top)}, strictly before, so this interval joins that group.`); told.reuse = true; } else v.hold(800);
    } else {
      rowEnd.push(e);
      h.push(e);
      p.clearTones().add(k, s, e, rowEnd.length - 1).tone(k, 'active');
      v.line(3).counter(`groups: ${rowEnd.length}`).eq(top === undefined ? `first interval → group 1` : `heap min ${top} ≥ ${s} → every group is busy, open group ${rowEnd.length}`, top === undefined ? undefined : 'warn');
      if (top === undefined) v.say(`[${s}, ${e}] opens the first group.`);
      else if (!told.neu) { v.say(`[${s}, ${e}] starts at ${words(s)}, but even the earliest group is busy until ${words(top)}. Open a new group.`); told.neu = true; }
      else if (top === s) v.say(`[${s}, ${e}] starts at ${words(s)}, exactly when the earliest group ends. Inclusive intervals intersect at that point, so a new group is needed.`);
      else v.hold(800);
    }
  });
  p.clearTones();
  v.eq(`groups = ${rowEnd.length}`, 'ok').say(`We needed ${words(rowEnd.length)} groups. The heap costs log n per interval.`);

  v.chapter('optimal', 'Optimal: sweep over sorted starts and ends', { cx: 'O(n log n), tiny constant', code: ['starts = sorted starts; ends = sorted ends', 'for s in starts:', '  if s > ends[j]: j += 1     # one interval finished', '  else: groups += 1'] });
  v.clear();
  const st = IV.map((x) => x[0]).sort((a, b) => a - b), en = IV.map((x) => x[1]).sort((a, b) => a - b);
  const sa = v.array('st', st, { label: 'starts (sorted)' });
  const ea = v.array('en', en, { label: 'ends (sorted)' });
  let j = 0, g = 0;
  v.say('We do not even need to know which interval ends. Sort the starts and the ends separately. Walk through the starts; the pointer j marks the earliest end not yet used. If the current start is after that end, some interval finished, and its group is reused. Otherwise we need another group.');
  st.forEach((s, i) => {
    sa.clearTones().tone(i, 'active');
    ea.clearTones().ptr('j', j).tone(j, 'cmp');
    if (s > en[j]) {
      v.line(2).counter(`groups: ${g}`).eq(`${s} > ${en[j]} → an interval ended: reuse, j += 1`, 'ok');
      if (j === 0) v.say(`${words(s)} is after the earliest end, ${words(en[j])}. That group is free again. Move j forward.`); else v.hold(800);
      j++;
    } else {
      g++;
      v.line(3).counter(`groups: ${g}`).eq(`${s} ≤ ${en[j]} → all groups busy, groups = ${g}`, 'warn').hold(800);
    }
  });
  sa.clearTones();
  ea.clearTones().noPtr('j');
  v.eq(`groups = ${g}`, 'ok').say(`Same answer, ${words(g)}, with two plain sorted arrays and no heap.`);
  v.answer(groups(IV));

  recap(v, [{ name: 'Count at every start', time: 'O(n²)', space: 'O(1)' }, { name: 'Min-heap of group ends', time: 'O(n log n)', space: 'O(n)' }, { name: 'Sorted starts and ends', time: 'O(n log n)', space: 'O(n)' }], 'Minimum groups = maximum overlap at a point.', ['Rooms / groups / platforms → maximum overlap'], 'Meeting rooms in disguise: count the peak overlap.');
  return v.build();
}

const problem: Problem = {
  slug: 'divide-intervals-into-minimum-number-of-groups',
  statement: 'You are given a 2D integer array `intervals` where `intervals[i] = [leftᵢ, rightᵢ]` is the inclusive interval. Divide the intervals into groups such that no two intervals in the same group intersect. Return the minimum number of groups. `[1,5]` and `[5,8]` intersect.',
  examples: [{ input: 'intervals = [[5,10],[6,8],[1,5],[2,3],[1,10]]', output: '3' }, { input: 'intervals = [[1,3],[5,6],[8,10],[11,13]]', output: '1' }],
  constraints: ['1 ≤ n ≤ 10⁵', '1 ≤ leftᵢ ≤ rightᵢ ≤ 10⁶'],
  hints: ['The answer is the maximum number of intervals containing a common point.', 'Sort starts and ends separately.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Count at every start', idea: 'For every start, count the intervals that contain it.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Quadratic.' },
    { id: 'better', kind: 'better', name: 'Min-heap of group ends', idea: 'Sort by start; reuse the group ending earliest if it ends before the start.', time: 'O(n log n)', space: 'O(n)', bottleneck: 'Heap overhead.' },
    { id: 'optimal', kind: 'optimal', name: 'Sorted starts and ends', idea: 'Two sorted arrays; a start after ends[j] reuses a group, otherwise count a new group.', time: 'O(n log n)', space: 'O(n)' },
  ],
  pitfalls: ['Inclusive: an interval ending at 5 and one starting at 5 conflict, so reuse needs end < start.'],
  takeaway: 'Minimum groups = **maximum overlap**.',
  video,
  videoArgs: [IV],
  judge: {
    type: 'fn', fn: 'minGroups', params: ['int[][]'], ret: 'int',
    tests: [{ args: [IV], out: 3 }, { args: [[[1, 3], [5, 6], [8, 10], [11, 13]]], out: 1 }, { args: [[[1, 5], [5, 8]]], out: 2 }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 9) }, () => { const s = r.int(1, 12); return [s, s + r.int(0, 5)]; })],
    ref: (iv: number[][]) => groups(iv),
  },
};

export default problem;
