import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { brow, ones } from '../../bitviz';

const A = [2, 2, 3, 2];
function single3(a: number[]) { let r = 0; for (let b = 0; b < 32; b++) { let c = 0; for (const x of a) c += (x >> b) & 1; if (c % 3) r |= 1 << b; } return r | 0; }

function video() {
  const v = new Video('single-number-ii', 'Single Number II');
  const W = 4;
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'nums' });
  v.say('Now every number appears three times, except one that appears once. XOR no longer cancels triples. Find the loner in linear time and constant space.');
  v.eq(`answer: ${single3(A)}`);

  v.chapter('brute', 'Brute force: a hash map of counts', { cx: 'O(n) time, O(n) space', code: ['count every number; return the one with count 1'] });
  v.eq('linear memory', 'warn').say('Counting in a hash map works but needs memory for every distinct number.');

  v.chapter('better', 'Better: count each bit position modulo 3', { cx: 'O(32 · n)', code: ['for bit in 0..31:', '  c = number of nums with this bit set', '  if c % 3 == 1: set this bit in the answer'] });
  v.clear();
  const b = v.bits('b', A.map((x) => brow(String(x), x, W)));
  v.line(0).say('Look at one bit position at a time. Every number that appears three times adds its bit three times, a multiple of three. So the count of ones in a column, modulo three, is exactly the loner’s bit.');
  const counts = Array.from({ length: W }, (_, p) => A.filter((x) => (x >> (W - 1 - p)) & 1).length);
  b.update({ rows: [...A.map((x) => brow(String(x), x, W)), { label: 'count', bits: counts.join(''), tones: {} }, { label: 'count % 3', bits: counts.map((c) => c % 3).join(''), tones: Object.fromEntries(counts.map((c, i) => [i, c % 3 ? 'ok' : 'dim'])) as never, note: `= ${single3(A)}` }] });
  v.line(1, 2).eq(`column counts ${counts.join(' ')} → mod 3 → ${counts.map((c) => c % 3).join('')}`, 'ok').say('The ones column has a single one, from the three. The twos column counts four ones: three from the triple of twos plus one from the three, and four modulo three is one. So the answer has both bits: three.');

  v.chapter('optimal', 'Optimal: two masks count to three', { cx: 'O(n), O(1) space', code: ['ones = twos = 0', 'ones = (ones ^ x) & ~twos', 'twos = (twos ^ x) & ~ones', 'return ones'] });
  v.clear();
  const o = v.bits('b', [brow('ones', 0, W), brow('twos', 0, W)]);
  const arr = v.array('a', A, { label: 'nums' });
  v.line(0).say('The per-bit counter modulo three can run in parallel for all bits at once. Two masks store a two-bit counter per position: a bit in ones means seen once, a bit in twos means seen twice, and on the third time both clear.');
  let ones1 = 0, twos = 0;
  A.forEach((x, i) => {
    ones1 = (ones1 ^ x) & ~twos;
    twos = (twos ^ x) & ~ones1;
    arr.clearTones().tone(i, 'active');
    o.update({ rows: [brow(`x = ${x}`, x, W), brow('ones', ones1, W, { tone: ones('ok') }), brow('twos', twos, W, { tone: ones('warn') })] });
    v.line(1, 2).eq(`after ${x}: ones = ${ones1}, twos = ${twos}`);
    if (i === 0) v.say('The first two: its bit enters ones.');
    else if (i === 1) v.say('The second two: the bit moves from ones to twos.');
    else if (i === 3) v.say('The third two: the bit is in twos, so it clears from both. The three, seen once, stays in ones.');
    else v.hold(900);
  });
  arr.clearTones();
  v.line(3).eq(`answer = ones = ${ones1}`, 'ok').say(`Ones holds the bits seen once more than a multiple of three: ${words(ones1)}.`);
  v.answer(single3(A));

  recap(v, [{ name: 'Hash map counts', time: 'O(n)', space: 'O(n)' }, { name: 'Bit counts mod 3', time: 'O(32n)', space: 'O(1)' }, { name: 'ones / twos masks', time: 'O(n)', space: 'O(1)' }], 'Count each bit modulo 3.', ['Every element k times except one → per-bit counts mod k'], 'Mind the sign bit in Python.');
  return v.build();
}

const problem: Problem = {
  slug: 'single-number-ii',
  statement: 'Given an integer array `nums` where every element appears three times except for one, which appears exactly once, find the single element in linear time and constant extra space.',
  examples: [{ input: 'nums = [2,2,3,2]', output: '3' }, { input: 'nums = [0,1,0,1,0,1,99]', output: '99' }],
  constraints: ['1 ≤ nums.length ≤ 3 · 10⁴', '−2³¹ ≤ nums[i] ≤ 2³¹ − 1'],
  hints: ['Count each bit position modulo 3.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Hash map', idea: 'Count occurrences.', time: 'O(n)', space: 'O(n)', bottleneck: 'Memory.' },
    { id: 'better', kind: 'better', name: 'Bit counts mod 3', idea: 'For each of 32 bits, count ones mod 3.', time: 'O(32n)', space: 'O(1)', bottleneck: '32 passes.' },
    { id: 'optimal', kind: 'optimal', name: 'ones / twos', idea: 'Two masks implement a per-bit counter mod 3.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Per-bit counts **mod 3**.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'singleNumber', params: ['int[]'], ret: 'int',
    tests: [{ args: [A], out: 3 }, { args: [[0, 1, 0, 1, 0, 1, 99]], out: 99 }, { args: [[-2, -2, 1, 1, -3, 1, -2]], out: -3 }, { args: [[5]], out: 5 }],
    gen: (r: Rng) => { const k = r.int(0, 4); const vals = r.distinct(k + 1, -60, 60); const a = [...vals.slice(0, k), ...vals.slice(0, k), ...vals.slice(0, k), vals[k]]; return [r.shuffle(a)]; },
    ref: (a: number[]) => single3(a),
  },
};

export default problem;
