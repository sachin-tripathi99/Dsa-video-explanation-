import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { brow, ones } from '../../bitviz';

const L = 26, R = 30;
function rangeAnd(l: number, r: number) { let s = 0; while (l < r) { l >>= 1; r >>= 1; s++; } return l << s; }

function video() {
  const v = new Video('bitwise-and-of-numbers-range', 'Bitwise AND of Numbers Range');
  const W = 5;
  v.chapter('intro', 'The problem');
  v.say(`Return the bitwise AND of every integer from left to right, inclusive. Here ${words(L)} to ${words(R)}.`);
  v.eq(`answer: ${rangeAnd(L, R)}`);

  v.chapter('brute', 'Brute force: AND them all', { cx: 'O(right − left)', code: ['result = left', 'for x in left+1..right: result &= x'] });
  v.clear();
  const b = v.bits('b', []);
  let acc = L;
  const rows = [brow(String(L), L, W)];
  for (let x = L + 1; x <= R; x++) { acc &= x; rows.push(brow(String(x), x, W)); }
  rows.push(brow('AND', acc, W, { note: `= ${acc}`, tone: ones('ok') }));
  b.update({ rows });
  v.line(0, 1).eq('up to 2³¹ numbers', 'bad').say('Directly ANDing every number is fine for five numbers, but the range can span two billion.');

  v.chapter('optimal', 'Optimal: keep only the common prefix', { cx: 'O(32)', code: ['shift = 0', 'while left < right:', '  left >>= 1; right >>= 1', '  shift += 1', 'return left << shift'] });
  v.line(0).say('Look at the columns. Any bit below the point where left and right first differ goes through both zero and one somewhere in the range, so its AND is zero. Only the common prefix of left and right survives.');
  let l = L, r = R, s = 0;
  const o = v.bits('b', [brow('left', l, W), brow('right', r, W)]);
  while (l < r) {
    l >>= 1; r >>= 1; s++;
    o.update({ rows: [brow('left', l << s, W, { tone: (i) => (i < W - s ? 'ok' : 'dim') }), brow('right', r << s, W, { tone: (i) => (i < W - s ? 'ok' : 'dim') })] });
    v.line(1, 2, 3).counter(`shift ${s}`).eq(`left = ${l}, right = ${r}`);
    if (s === 1) v.say('Shift both right until they are equal. Each shift throws away a column where they might still differ.'); else v.hold(800);
  }
  v.line(4).eq(`${l} << ${s} = ${l << s}`, 'ok').say(`They agree after ${words(s)} shifts: the common prefix, shifted back into place, is ${words(l << s)}.`);
  v.answer(rangeAnd(L, R));

  recap(v, [{ name: 'AND every number', time: 'O(right − left)', space: 'O(1)' }, { name: 'Common prefix', time: 'O(32)', space: 'O(1)' }], 'The AND of a range is the common binary prefix of its ends.', ['Bitwise AND / OR over a range → common prefix'], 'Alternative: while right > left: right &= right − 1.');
  return v.build();
}

const problem: Problem = {
  slug: 'bitwise-and-of-numbers-range',
  statement: 'Given two integers `left` and `right` representing the range [left, right], return the bitwise AND of all numbers in this range, inclusive.',
  examples: [{ input: 'left = 5, right = 7', output: '4' }, { input: 'left = 0, right = 0', output: '0' }, { input: 'left = 1, right = 2147483647', output: '0' }],
  constraints: ['0 ≤ left ≤ right ≤ 2³¹ − 1'],
  hints: ['Only the common prefix of left and right survives.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'AND all', idea: 'Loop over the range (stop early at 0).', time: 'O(right − left)', space: 'O(1)', bottleneck: 'Huge ranges.' },
    { id: 'optimal', kind: 'optimal', name: 'Common prefix', idea: 'Shift both right until equal, shift back.', time: 'O(32)', space: 'O(1)' },
  ],
  takeaway: 'Keep the **common prefix**.',
  video,
  videoArgs: [L, R],
  judge: {
    type: 'fn', fn: 'rangeBitwiseAnd', params: ['int', 'int'], ret: 'int',
    tests: [{ args: [5, 7], out: 4 }, { args: [0, 0], out: 0 }, { args: [1, 2147483647], out: 0 }, { args: [L, R], out: rangeAnd(L, R) }, { args: [2147483646, 2147483647], out: 2147483646 }],
    gen: (r: Rng) => { const a = r.int(0, 5000); return [a, a + r.int(0, 300)]; },
    ref: (l: number, r: number) => rangeAnd(l, r),
  },
};

export default problem;
