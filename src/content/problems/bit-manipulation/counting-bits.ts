import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { fill1D } from '../../dpviz';

const N = 8;
const pop = (x: number) => x.toString(2).split('').filter((c) => c === '1').length;
const bits = (n: number) => Array.from({ length: n + 1 }, (_, i) => pop(i));

function video() {
  const v = new Video('counting-bits', 'Counting Bits');
  v.chapter('intro', 'The problem');
  v.array('i', [...Array(N + 1).keys()], { label: 'i' });
  v.say(`For every i from zero to n, count the one bits in i. Return all the counts.`);
  v.eq(`n = ${N} → [${bits(N).join(', ')}]`);

  v.chapter('brute', 'Brute force: popcount each number separately', { cx: 'O(n log n)', code: ['for i in 0..n: ans[i] = count bits of i (loop over its bits)'] });
  v.eq('log n work per number', 'warn').say('Counting the bits of each number on its own costs up to log n steps each.');

  v.chapter('optimal', 'Optimal: reuse the answer for i >> 1', { cx: 'O(n)', code: ['ans[0] = 0', 'ans[i] = ans[i >> 1] + (i & 1)', '(i >> 1 drops the last bit, which i & 1 adds back)'] });
  v.clear();
  const a = v.array('dp', Array.from({ length: N + 1 }, (_, i) => (i === 0 ? 0 : '')), { label: 'ans[i] (binary below)' });
  a.subs([...Array(N + 1).keys()].map((i) => i.toString(2)));
  v.line(0).say('Shifting i right by one drops its last bit and gives a smaller number whose count we already know. Add one back if the dropped bit was one.');
  const d = bits(N);
  fill1D(v, a, [...Array(N).keys()].map((k) => k + 1), {
    base: [0], deps: (i) => [i >> 1], val: (i) => d[i], line: [1],
    eq: (i) => `ans[${i}] = ans[${i >> 1}] + ${i & 1} = ${d[i]}`,
    say: (i) => (i === 5 ? 'Five is one zero one. Dropping the last bit gives two, one zero, with one bit, and the dropped bit was a one: two.' : i === 6 ? 'Six is one one zero: three plus a zero at the end, so the same count as three.' : undefined),
    hold: 500,
  });
  v.line(2).eq(`[${d.join(', ')}]`, 'ok').say('Every answer is one lookup and one addition: linear time.');
  v.answer(bits(N));

  recap(v, [{ name: 'Popcount each', time: 'O(n log n)', space: 'O(1) extra' }, { name: 'DP on i >> 1', time: 'O(n)', space: 'O(1) extra' }], 'bits(i) = bits(i >> 1) + (i & 1).', ['Answers for all numbers 0..n → DP from smaller numbers'], 'Alternative: bits(i) = bits(i & (i − 1)) + 1.');
  return v.build();
}

const problem: Problem = {
  slug: 'counting-bits',
  statement: 'Given an integer `n`, return an array `ans` of length n + 1 where `ans[i]` is the number of 1s in the binary representation of i.',
  examples: [{ input: 'n = 2', output: '[0,1,1]' }, { input: 'n = 5', output: '[0,1,1,2,1,2]' }],
  constraints: ['0 ≤ n ≤ 10⁵'],
  hints: ['i >> 1 is a smaller number you already solved.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Popcount each', idea: 'Count bits of every number.', time: 'O(n log n)', space: 'O(1)', bottleneck: 'Repeats work.' },
    { id: 'optimal', kind: 'optimal', name: 'DP on i >> 1', idea: 'ans[i] = ans[i >> 1] + (i & 1).', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Reuse **i >> 1**.',
  video,
  videoArgs: [N],
  judge: {
    type: 'fn', fn: 'countBits', params: ['int'], ret: 'int[]',
    tests: [{ args: [2], out: [0, 1, 1] }, { args: [5], out: [0, 1, 1, 2, 1, 2] }, { args: [0], out: [0] }],
    gen: (r: Rng) => [r.int(0, 60)],
    ref: (n: number) => bits(n),
  },
};

export default problem;
