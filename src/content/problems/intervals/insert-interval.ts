import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

type I = [number, number];
const IV: I[] = [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]];
const NEW: I = [4, 8];
const fmt = (a: number[][]) => `[${a.map((x) => `[${x}]`).join(', ')}]`;
function ins(iv: number[][], nw: number[]) { const out: number[][] = []; let [s, e] = nw; let i = 0; while (i < iv.length && iv[i][1] < s) out.push([...iv[i++]]); while (i < iv.length && iv[i][0] <= e) { s = Math.min(s, iv[i][0]); e = Math.max(e, iv[i][1]); i++; } out.push([s, e]); while (i < iv.length) out.push([...iv[i++]]); return out; }

function video() {
  const v = new Video('insert-interval', 'Insert Interval');
  v.chapter('intro', 'The problem');
  const p0 = v.intervals('iv', IV.map((x) => x), { label: 'sorted, non-overlapping intervals + the new one', min: 0, max: 17 });
  IV.forEach((_, k) => p0.row(k, 0));
  p0.add(99, NEW[0], NEW[1], 1).tone(99, 'active');
  v.say('The intervals are already sorted and do not overlap. Insert a new interval and merge wherever it overlaps, so the result is still sorted and non-overlapping.');
  v.eq(`insert [${NEW}] → ${fmt(ins(IV, NEW))}`);

  v.chapter('brute', 'Brute force: append and re-merge', { cx: 'O(n log n)', code: ['intervals.append(newInterval)', 'return merge(intervals)   # sort + sweep'] });
  v.eq('re-sorting ignores that the input is already sorted', 'warn').say('The easy way: append the new interval and run Merge Intervals again. That sorts, n log n, even though the input was already sorted.');

  v.chapter('optimal', 'Optimal: three phases, one pass', { cx: 'O(n)', code: ['copy intervals with end < new.start', 'absorb intervals with start ≤ new.end', 'append new', 'copy the rest'] });
  v.clear();
  const p = v.intervals('iv', IV.map((x) => x), { label: 'intervals (top) · new interval (bottom)', min: 0, max: 17 });
  IV.forEach((_, k) => p.row(k, 0));
  p.add(99, NEW[0], NEW[1], 1).tone(99, 'active');
  const out = v.intervals('out', [], { label: 'result', min: 0, max: 17 });
  let [s, e] = NEW;
  let i = 0;
  let n = 0;
  v.say('Since the list is sorted, the intervals fall into three groups: those completely before the new interval, those that overlap it, and those completely after it. We handle each group in order in a single pass.');
  while (i < IV.length && IV[i][1] < s) {
    p.tone(i, 'dim');
    out.add(n++, IV[i][0], IV[i][1], 0);
    v.line(0).eq(`[${IV[i]}] ends at ${IV[i][1]} < ${s} → entirely before, copy`);
    if (i === 0) v.say(`[${IV[i]}] ends at ${words(IV[i][1])}, before the new interval starts at ${words(s)}. It cannot overlap: copy it.`); else v.hold(700);
    i++;
  }
  let first = true;
  while (i < IV.length && IV[i][0] <= e) {
    const os = s, oe = e;
    s = Math.min(s, IV[i][0]);
    e = Math.max(e, IV[i][1]);
    p.tone(i, 'ok');
    p.set(99, s, e);
    v.line(1).eq(`[${IV[i]}] starts at ${IV[i][0]} ≤ ${oe} → absorb: new = [${s},${e}]`, 'ok');
    if (first) { v.say(`[${IV[i]}] starts at ${words(IV[i][0])}, before the new interval ends at ${words(oe)}. They overlap. Absorb it: the new interval grows to ${words(s)} through ${words(e)}.`); first = false; }
    else if (os !== s || oe !== e) v.say(`[${IV[i]}] also overlaps. Absorb it: now ${words(s)} through ${words(e)}.`);
    else v.hold(700);
    i++;
  }
  out.add(n++, s, e, 0).tone(n - 1, 'ok');
  v.line(2).eq(`next starts after ${e} → place [${s},${e}]`, 'ok').say(`The next interval starts after ${words(e)}, so the merging is done. Place the grown interval.`);
  out.clearTones();
  while (i < IV.length) {
    p.tone(i, 'dim');
    out.add(n++, IV[i][0], IV[i][1], 0);
    v.line(3).eq(`[${IV[i]}] → after, copy`).hold(700);
    i++;
  }
  v.eq(fmt(ins(IV, NEW)), 'ok').say('Everything left comes after it and is copied as is. One pass, linear time.');
  v.answer(ins(IV, NEW));

  recap(v, [{ name: 'Append + merge', time: 'O(n log n)', space: 'O(n)' }, { name: 'Three phases', time: 'O(n)', space: 'O(n)' }], 'Before: end < new.start. Overlap: start ≤ new.end. After: the rest.', ['Insert into an already sorted interval list → one pass, three phases'], 'Use the fact that the input is already sorted.');
  return v.build();
}

const problem: Problem = {
  slug: 'insert-interval',
  statement: 'You are given an array of non-overlapping intervals `intervals` sorted by start, and an interval `newInterval`. Insert `newInterval` so that `intervals` is still sorted and non-overlapping (merge if necessary). Return the result.',
  examples: [{ input: 'intervals = [[1,3],[6,9]], newInterval = [2,5]', output: '[[1,5],[6,9]]' }, { input: 'intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]', output: '[[1,2],[3,10],[12,16]]' }],
  constraints: ['0 ≤ n ≤ 10⁴', 'intervals sorted by start, non-overlapping'],
  hints: ['Split the intervals into before, overlapping, and after.', 'Overlapping ones satisfy start ≤ new.end and end ≥ new.start.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Append + merge', idea: 'Add the new interval and run Merge Intervals.', time: 'O(n log n)', space: 'O(n)', bottleneck: 'Sorting what is already sorted.' },
    { id: 'optimal', kind: 'optimal', name: 'Three phases', idea: 'Copy intervals ending before new.start; absorb those starting ≤ new.end; append; copy the rest.', time: 'O(n)', space: 'O(n)' },
  ],
  takeaway: 'Sorted input → **one pass** in three phases.',
  video,
  videoArgs: [IV, NEW],
  judge: {
    type: 'fn', fn: 'insert', params: ['int[][]', 'int[]'], ret: 'int[][]',
    tests: [{ args: [[[1, 3], [6, 9]], [2, 5]], out: [[1, 5], [6, 9]] }, { args: [IV, NEW], out: [[1, 2], [3, 10], [12, 16]] }, { args: [[], [5, 7]], out: [[5, 7]] }, { args: [[[1, 5]], [6, 8]], out: [[1, 5], [6, 8]] }],
    gen: (r: Rng) => { const iv: number[][] = []; let t = r.int(0, 3); const n = r.int(0, 6); for (let k = 0; k < n; k++) { const s = t, e = s + r.int(0, 3); iv.push([s, e]); t = e + r.int(1, 3); } const s = r.int(0, t + 2); return [iv, [s, s + r.int(0, 6)]]; },
    ref: (iv: number[][], nw: number[]) => ins(iv, nw),
  },
};

export default problem;
