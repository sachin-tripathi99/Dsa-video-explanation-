import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { brow, ones } from '../../bitviz';

const A = [1, 2, 1, 3, 2, 5];
function two(a: number[]) { const x = a.reduce((p, q) => p ^ q, 0); const low = x & -x; let p = 0, q = 0; for (const y of a) if (y & low) p ^= y; else q ^= y; return [p, q]; }

function video() {
  const v = new Video('single-number-iii', 'Single Number III');
  const W = 4;
  const [p, q] = two(A);
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'nums' });
  v.say('Every number appears twice, except two numbers that each appear once. Return both, in linear time and constant space.');
  v.eq(`answer: ${[p, q].sort((x, y) => x - y).join(', ')}`);

  v.chapter('brute', 'Brute force: count with a hash map', { cx: 'O(n) time, O(n) space', code: ['count occurrences; return those with count 1'] });
  v.eq('linear memory', 'warn').say('A hash map of counts finds both, but uses linear memory.');

  v.chapter('optimal', 'Optimal: XOR, then split by one differing bit', { cx: 'O(n), O(1) space', code: ['x = XOR of all → a ^ b', 'low = x & −x (a bit where a and b differ)', 'XOR the numbers with that bit → a', 'XOR the numbers without it → b'] });
  v.clear();
  const arr = v.array('a', A, { label: 'nums' });
  const x = A.reduce((s, y) => s ^ y, 0);
  const b = v.bits('b', [brow('XOR all', x, W, { note: `= ${x} = a ^ b` })]);
  v.line(0).say(`XOR everything: pairs cancel, leaving the two loners XORed together, ${words(x)}. That is not either answer, but it tells us where they differ: every one bit in it is a position where exactly one of them has a one.`);
  const low = x & -x;
  b.update({ rows: [brow('a ^ b', x, W), brow('low = x & −x', low, W, { note: `= ${low}`, tone: ones('warn') })] });
  v.line(1).say(`Pick the lowest such bit, ${words(low)}. One loner has it and the other does not.`);
  arr.clearTones();
  A.forEach((y, i) => arr.tone(i, y & low ? 'ok' : 'cmp'));
  b.update({ rows: [brow('low', low, W, { tone: ones('warn') }), brow('group with bit', p, W, { note: `XOR = ${p}`, tone: ones('ok') }), brow('group without', q, W, { note: `XOR = ${q}` })] });
  v.line(2, 3).eq(`green group → ${p} · blue group → ${q}`, 'ok').say(`Split all numbers by that bit. Each pair lands entirely in one group, since both copies are equal, while the two loners land in different groups. XOR each group on its own: the pairs cancel, and each group leaves one loner: ${words(p)} and ${words(q)}.`);
  v.answer([p, q]);

  recap(v, [{ name: 'Hash map', time: 'O(n)', space: 'O(n)' }, { name: 'XOR + split by a differing bit', time: 'O(n)', space: 'O(1)' }], 'a ^ b tells where they differ; split and XOR again.', ['Two loners among pairs → XOR, lowest set bit, two groups'], 'In C++, compute x & −x on unsigned values: negating INT_MIN overflows.');
  return v.build();
}

const problem: Problem = {
  slug: 'single-number-iii',
  statement: 'Given an integer array `nums` in which exactly two elements appear only once and all others appear exactly twice, return the two single elements in any order, in linear time and constant extra space.',
  examples: [{ input: 'nums = [1,2,1,3,2,5]', output: '[3,5]' }, { input: 'nums = [-1,0]', output: '[-1,0]' }, { input: 'nums = [0,1]', output: '[1,0]' }],
  constraints: ['2 ≤ nums.length ≤ 3 · 10⁴', '−2³¹ ≤ nums[i] ≤ 2³¹ − 1'],
  hints: ['XOR of all = a ^ b.', 'Split by any set bit of a ^ b.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Hash map', idea: 'Count occurrences.', time: 'O(n)', space: 'O(n)', bottleneck: 'Memory.' },
    { id: 'optimal', kind: 'optimal', name: 'XOR split', idea: 'Split by the lowest bit of a ^ b and XOR each group.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Split by a **differing bit**.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'singleNumber', params: ['int[]'], ret: 'int[]', cmp: 'sorted',
    tests: [{ args: [A], out: [3, 5] }, { args: [[-1, 0]], out: [-1, 0] }, { args: [[0, 1]], out: [1, 0] }, { args: [[-2147483648, 5, 5, 7]], out: [-2147483648, 7] }],
    gen: (r: Rng) => { const k = r.int(0, 5); const vals = r.distinct(k + 2, -60, 60); const a = [...vals.slice(0, k), ...vals.slice(0, k), vals[k], vals[k + 1]]; return [r.shuffle(a)]; },
    ref: (a: number[]) => two(a),
  },
};

export default problem;
