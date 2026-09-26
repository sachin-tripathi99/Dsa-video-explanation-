import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

type I = [number, number];
const A: I[] = [[0, 2], [5, 10], [13, 23], [24, 25]];
const B: I[] = [[1, 5], [8, 12], [15, 24], [25, 26]];
const fmt = (a: number[][]) => `[${a.map((x) => `[${x}]`).join(', ')}]`;
function isect(a: number[][], b: number[][]) { const out: number[][] = []; let i = 0, j = 0; while (i < a.length && j < b.length) { const lo = Math.max(a[i][0], b[j][0]), hi = Math.min(a[i][1], b[j][1]); if (lo <= hi) out.push([lo, hi]); if (a[i][1] < b[j][1]) i++; else j++; } return out; }

function video() {
  const v = new Video('interval-list-intersections', 'Interval List Intersections');
  const AK = (i: number) => i, BK = (j: number) => 100 + j;
  const both = (label: string) => {
    const p = v.intervals('ab', [], { label, min: 0, max: 30 });
    A.forEach((x, i) => p.add(AK(i), x[0], x[1], 0));
    B.forEach((x, j) => p.add(BK(j), x[0], x[1], 1));
    return p;
  };
  v.chapter('intro', 'The problem');
  both('first list (top) · second list (bottom)');
  v.say('Each list is sorted and its intervals are disjoint. Return the intersection of the two lists: every range covered by both.');
  v.eq(`→ ${fmt(isect(A, B))}`);

  v.chapter('brute', 'Brute force: intersect every pair', { cx: 'O(m · n)', code: ['for a in first: for b in second:', '  lo = max(a.start, b.start); hi = min(a.end, b.end)', '  if lo ≤ hi: add [lo, hi]'] });
  v.eq('two intervals intersect in [max(starts), min(ends)] if that is non-empty', 'warn').say('Two closed intervals intersect in the range from the larger start to the smaller end, if that range is not empty. Trying every pair is m times n.');

  v.chapter('optimal', 'Optimal: two pointers', { cx: 'O(m + n)', code: ['lo = max(A[i].start, B[j].start)', 'hi = min(A[i].end, B[j].end)', 'if lo ≤ hi: add [lo, hi]', 'advance whichever interval ends first'] });
  v.clear();
  const p = both('first list (top) · second list (bottom)');
  const out = v.intervals('out', [], { label: 'intersections', min: 0, max: 30 });
  let i = 0, j = 0, n = 0;
  let told = { hit: false, adv: false, miss: false };
  v.say('Point at the first interval of each list. Compute their intersection. Then move past whichever one ends first: it cannot intersect anything else in the other list, because the other list only moves further right.');
  while (i < A.length && j < B.length) {
    const lo = Math.max(A[i][0], B[j][0]), hi = Math.min(A[i][1], B[j][1]);
    p.clearTones().tone(AK(i), 'active').tone(BK(j), 'cmp');
    out.clearTones();
    if (lo <= hi) {
      out.add(n, lo, hi, n % 2).tone(n, 'ok'); n++;
      v.line(0, 1, 2).eq(`[${A[i]}] ∩ [${B[j]}] = [${lo},${hi}]`, 'ok');
      if (!told.hit) { v.say(`[${A[i]}] and [${B[j]}]: the larger start is ${words(lo)}, the smaller end is ${words(hi)}. That range is not empty, so it is an intersection.`); told.hit = true; }
      else if (lo === hi) v.say(`[${A[i]}] and [${B[j]}] meet at a single point, ${words(lo)}. A single point still counts.`);
      else v.hold(800);
    } else {
      v.line(0, 1, 2).eq(`[${A[i]}] ∩ [${B[j]}]: ${lo} > ${hi} → empty`, 'bad');
      if (!told.miss) { v.say(`[${A[i]}] and [${B[j]}] do not intersect: the larger start, ${words(lo)}, is past the smaller end, ${words(hi)}.`); told.miss = true; } else v.hold(700);
    }
    const ai = A[i][1] < B[j][1];
    v.line(3).eq(ai ? `A ends first (${A[i][1]} < ${B[j][1]}) → i += 1` : `B ends first (${B[j][1]} ≤ ${A[i][1]}) → j += 1`);
    if (!told.adv) { v.say(`${ai ? `The top interval ends first, at ${words(A[i][1])}` : `The bottom interval ends first, at ${words(B[j][1])}`}. Move past it.`); told.adv = true; } else v.hold(500);
    if (ai) { p.tone(AK(i), 'dim'); i++; } else { p.tone(BK(j), 'dim'); j++; }
  }
  p.clearTones();
  v.eq(fmt(isect(A, B)), 'ok').say('Each step moves one pointer, so the total is m plus n steps.');
  v.answer(isect(A, B));

  recap(v, [{ name: 'All pairs', time: 'O(m · n)', space: 'O(1) extra' }, { name: 'Two pointers', time: 'O(m + n)', space: 'O(1) extra' }], 'Intersect [max start, min end]; advance the interval that ends first.', ['Two sorted interval lists → two pointers'], 'The interval that ends first is done: drop it.');
  return v.build();
}

function lists(r: Rng) { const out: number[][] = []; let t = r.int(0, 3); const n = r.int(0, 5); for (let k = 0; k < n; k++) { const s = t, e = s + r.int(0, 4); out.push([s, e]); t = e + r.int(1, 3); } return out; }

const problem: Problem = {
  slug: 'interval-list-intersections',
  statement: 'You are given two lists of closed intervals, `firstList` and `secondList`. Each list is pairwise disjoint and sorted. Return the intersection of these two interval lists.',
  examples: [{ input: 'firstList = [[0,2],[5,10],[13,23],[24,25]], secondList = [[1,5],[8,12],[15,24],[25,26]]', output: '[[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]' }, { input: 'firstList = [[1,3],[5,9]], secondList = []', output: '[]' }],
  constraints: ['0 ≤ m, n ≤ 1000', 'each list sorted and pairwise disjoint'],
  hints: ['Intersection of [a,b] and [c,d] is [max(a,c), min(b,d)] if non-empty.', 'Which interval can you discard after comparing?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'All pairs', idea: 'Intersect every pair; the order stays sorted.', time: 'O(m · n)', space: 'O(1) extra', bottleneck: 'Most pairs are far apart.' },
    { id: 'optimal', kind: 'optimal', name: 'Two pointers', idea: 'Intersect A[i] and B[j]; advance the one with the smaller end.', time: 'O(m + n)', space: 'O(1) extra' },
  ],
  takeaway: 'Advance the interval that **ends first**.',
  video,
  videoArgs: [A, B],
  judge: {
    type: 'fn', fn: 'intervalIntersection', params: ['int[][]', 'int[][]'], ret: 'int[][]',
    tests: [{ args: [A, B], out: [[1, 2], [5, 5], [8, 10], [15, 23], [24, 24], [25, 25]] }, { args: [[[1, 3], [5, 9]], []], out: [] }, { args: [[[1, 7]], [[3, 10]]], out: [[3, 7]] }],
    gen: (r: Rng) => [lists(r), lists(r)],
    ref: (a: number[][], b: number[][]) => isect(a, b),
  },
};

export default problem;
