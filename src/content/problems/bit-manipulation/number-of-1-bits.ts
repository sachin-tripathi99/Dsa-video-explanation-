import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { brow, ones } from '../../bitviz';

const N = 44;
const pop = (x: number) => (x >>> 0).toString(2).split('').filter((c) => c === '1').length;

function video() {
  const v = new Video('number-of-1-bits', 'Number of 1 Bits');
  const W = 8;
  v.chapter('intro', 'The problem');
  v.bits('b', [brow(`n = ${N}`, N, W, { tone: ones('ok') })]);
  v.say(`Count the one bits in the binary form of n, also called the Hamming weight. Forty-four is one zero one one zero zero: three ones.`);
  v.eq(`answer: ${pop(N)}`);

  v.chapter('brute', 'Brute force: check all 32 bits', { cx: 'O(32)', code: ['for i in 0..31:', '  if (n >> i) & 1: count += 1'] });
  v.clear();
  const b = v.bits('b', [brow('n', N, W)]);
  v.line(0, 1).say('Test every bit position with a shift and an AND. Always thirty-two steps, even for a number with a single one bit.');
  let c = 0;
  for (let i = 0; i < W; i++) {
    const bit = (N >> i) & 1;
    c += bit;
    b.update({ rows: [brow('n', N, W, { tone: (p) => (p === W - 1 - i ? (bit ? 'ok' : 'cmp') : undefined) }), brow(`(n >> ${i}) & 1`, bit, 1, { note: `count ${c}` })] });
    v.line(1).counter(`bit ${i}`).hold(450);
  }
  v.eq(`${W} checks for ${c} ones`, 'warn');

  v.chapter('optimal', 'Optimal: n & (n − 1) removes one 1 at a time', { cx: 'O(number of 1s)', code: ['count = 0', 'while n: n &= n − 1; count += 1', 'return count'] });
  v.clear();
  const o = v.bits('b', [brow('n', N, W, { tone: ones('ok') })]);
  v.line(0).say('The trick from the lesson: n AND n minus one clears the lowest one bit. Repeat until n is zero; the number of steps is the answer.');
  let x = N, k = 0;
  while (x) {
    const y = x & (x - 1);
    k++;
    o.update({ rows: [brow('n', x, W, { tone: ones('ok') }), brow('n − 1', x - 1, W), brow('n & (n−1)', y, W, { note: `step ${k}`, tone: ones('ok') })] });
    v.line(1).counter(`count ${k}`).eq(`${x} & ${x - 1} = ${y}`);
    if (k === 1) v.say('Forty-four AND forty-three is forty: the lowest one, worth four, is gone.'); else v.hold(900);
    x = y;
  }
  v.line(2).eq(`count = ${k}`, 'ok').say(`${words(k)[0].toUpperCase()}${words(k).slice(1)} steps, one per one bit, no matter how many zeros there are.`);
  v.answer(pop(N));

  recap(v, [{ name: 'Check 32 bits', time: 'O(32)', space: 'O(1)' }, { name: 'n &= n − 1', time: 'O(popcount)', space: 'O(1)' }], 'n & (n − 1) drops the lowest set bit.', ['Count set bits → Kernighan’s trick or a built-in popcount'], 'Treat the input as unsigned in Java.');
  return v.build();
}

const problem: Problem = {
  slug: 'number-of-1-bits',
  statement: 'Given a positive integer `n`, return the number of set bits in its binary representation (its Hamming weight).',
  examples: [{ input: 'n = 11', output: '3' }, { input: 'n = 128', output: '1' }, { input: 'n = 2147483645', output: '30' }],
  constraints: ['1 ≤ n ≤ 2³¹ − 1'],
  hints: ['n & (n − 1) clears the lowest set bit.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Check every bit', idea: 'Shift and test 32 positions.', time: 'O(32)', space: 'O(1)', bottleneck: 'Always 32 steps.' },
    { id: 'optimal', kind: 'optimal', name: 'Kernighan', idea: 'Repeat n &= n − 1 and count.', time: 'O(popcount)', space: 'O(1)' },
  ],
  takeaway: '**n & (n − 1)** removes one 1.',
  video,
  videoArgs: [N],
  judge: {
    type: 'fn', fn: 'hammingWeight', params: ['int'], ret: 'int',
    tests: [{ args: [11], out: 3 }, { args: [128], out: 1 }, { args: [2147483645], out: 30 }, { args: [1], out: 1 }],
    gen: (r: Rng) => [r.int(1, 2147483647)],
    ref: (n: number) => pop(n),
  },
};

export default problem;
