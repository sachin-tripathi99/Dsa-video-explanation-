import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const H = [1, 1, 4, 2, 1, 3];

function video() {
  const v = new Video('height-checker', 'Height Checker');
  v.chapter('intro', 'The problem');
  const a = v.array('h', H, { label: 'heights (as students stand)', bars: true });
  v.say('Students should stand in order of height. Count how many are standing in the wrong spot compared with the sorted order.');

  v.chapter('brute', 'Sort a copy and compare', { cx: 'O(n log n)', code: ['expected = sorted(heights)', 'count i where heights[i] != expected[i]'] });
  const e = v.array('e', [...H].sort((x, y) => x - y), { label: 'expected (sorted copy)', bars: true });
  let c = 0;
  H.forEach((x, i) => {
    const exp = [...H].sort((p, q) => p - q)[i];
    const bad = x !== exp;
    if (bad) c++;
    a.tone(i, bad ? 'bad' : 'ok');
    e.tone(i, bad ? 'bad' : 'ok');
  });
  v.line(1).eq(`${c} students out of place`, 'warn');
  v.say(`Sort a copy and compare position by position. ${c} students are out of place. That is n log n because of the sort.`);

  v.chapter('optimal', 'Optimal: counting sort', { cx: 'O(n + k)', code: ['count[h] for each height h (1..100)', 'walk heights; expected[i] = next height with count > 0', 'compare as you go'] });
  v.clear();
  const cnt = v.array('cnt', [0, 0, 0, 0, 0], { label: 'count[height] for heights 0..4' });
  H.forEach((x) => cnt.set(x, (cnt.get(x) as number) + 1));
  cnt.tone([1, 2, 3, 4], 'active');
  v.line(0).say('Heights are between one and one hundred. That tiny range means counting sort: count each height, then read them back in order. No comparisons.');
  const exp = v.array('exp', [], { label: 'expected, read back from the counts' });
  for (let h = 0; h <= 4; h++) for (let k = 0; k < (cnt.get(h) as number); k++) exp.push(h);
  exp.toneRange(0, exp.length - 1, 'sorted');
  v.line(1).eq(`still ${c} mismatches`, 'ok').say('Reading the counts from small to large gives the sorted order in O of n plus k, where k is one hundred. Compare as before.');
  v.answer(c);

  recap(v, [{ name: 'Sort a copy', time: 'O(n log n)', space: 'O(n)' }, { name: 'Counting sort', time: 'O(n + k)', space: 'O(k)' }], 'A comparison sort is n log n; counting sort exploits the small value range.', ['Small value range → counting sort'], 'Always check the value range in the constraints. A small range unlocks counting.');
  return v.build();
}

const problem: Problem = {
  slug: 'height-checker',
  statement: 'Students stand in a line with heights `heights`. The expected line is the same heights sorted in non-decreasing order. Return how many indices `i` have `heights[i] != expected[i]`.',
  examples: [
    { input: 'heights = [1,1,4,2,1,3]', output: '3', why: 'expected = [1,1,1,2,3,4]; positions 2, 4 and 5 differ.' },
    { input: 'heights = [5,1,2,3,4]', output: '5' },
    { input: 'heights = [1,2,3,4,5]', output: '0' },
  ],
  constraints: ['1 ≤ heights.length ≤ 100', '1 ≤ heights[i] ≤ 100'],
  hints: ['Sort a copy and compare.', 'Heights are at most 100. Can you sort without comparisons?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sort a copy', idea: 'Sort a copy, count positions that differ.', time: 'O(n log n)', space: 'O(n)', bottleneck: 'A comparison sort ignores the tiny value range.' },
    { id: 'optimal', kind: 'optimal', name: 'Counting sort', idea: 'Count each height (1…100). Walk through `heights` while advancing a pointer through the counts to know the expected height at each index.', time: 'O(n + k)', space: 'O(k)' },
  ],
  takeaway: 'When values live in a **small range**, counting beats comparing.',
  video,
  videoArgs: [H],
  judge: {
    type: 'fn', fn: 'heightChecker', params: ['int[]'], ret: 'int',
    tests: [{ args: [[1, 1, 4, 2, 1, 3]], out: 3 }, { args: [[5, 1, 2, 3, 4]], out: 5 }, { args: [[1, 2, 3, 4, 5]], out: 0 }],
    gen: (r) => [r.ints(r.int(1, 30), 1, 100)],
    ref: (h: number[]) => { const e = [...h].sort((a, b) => a - b); return h.filter((x, i) => x !== e[i]).length; },
  },
};

export default problem;
