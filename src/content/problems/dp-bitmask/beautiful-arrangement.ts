import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { fill1D } from '../../dpviz';

const N = 4;
const pop = (m: number) => m.toString(2).split('').filter((c) => c === '1').length;
function tbl(n: number) { const d = Array(1 << n).fill(0); d[0] = 1; for (let m = 1; m < 1 << n; m++) { const pos = pop(m); for (let i = 0; i < n; i++) if (m & (1 << i) && ((i + 1) % pos === 0 || pos % (i + 1) === 0)) d[m] += d[m ^ (1 << i)]; } return d; }
function count(n: number) { return tbl(n)[(1 << n) - 1]; }

function video() {
  const v = new Video('beautiful-arrangement', 'Beautiful Arrangement');
  const d = tbl(N);
  const bin = (m: number) => m.toString(2).padStart(N, '0');
  v.chapter('intro', 'The problem');
  v.array('pos', [1, 2, 3, 4], { label: 'positions 1..n' });
  v.say(`Arrange the numbers one to ${words(N)} in a row. At every position, either the number divides the position, or the position divides the number. How many arrangements work?`);
  v.eq(`answer: ${count(N)}`);

  v.chapter('brute', 'Brute force: all permutations', { cx: 'O(n! · n)', code: ['for each permutation: check every position'] });
  v.eq(`${N}! = 24 permutations here; 15! ≈ 1.3·10¹²`, 'bad').say('Checking every permutation is n factorial.');

  v.chapter('better', 'Better: backtracking with pruning', { cx: '≪ n!', code: ['place(pos): for each unused x that fits pos: use it, place(pos + 1)'] });
  v.eq('prunes, but still explores many branches', 'warn').say('Filling positions one by one and only trying numbers that fit cuts most branches, but different paths reach the same situation: the same set of numbers used so far.');

  v.chapter('optimal', 'Optimal: dp over the set of used numbers', { cx: 'O(2ⁿ · n)', code: ['dp[mask] = ways to fill 1..pos using exactly mask', 'dp[0] = 1; pos = popcount(mask)', 'dp[mask] = Σ dp[mask − x], x in mask fitting pos', 'answer = dp[all]'] });
  v.clear();
  const a = v.array('dp', Array.from({ length: 1 << N }, (_, m) => (m === 0 ? 1 : '')), { label: 'dp[mask] (bit x−1 set = number x used)' });
  a.subs([...Array(1 << N).keys()].map(bin));
  v.line(0, 1).say('Here is the key: which numbers are already placed matters, their order does not. And the set also tells us which position is next: if the set has k numbers, they fill positions one to k. So dp over masks: the last position, k, holds some number x from the set that fits k, and the rest fill the positions before it.');
  const masks = [...Array((1 << N) - 1).keys()].map((k) => k + 1).sort((x, y) => pop(x) - pop(y) || x - y);
  fill1D(v, a, masks, {
    base: [0],
    deps: (m) => { const pos = pop(m); return [...Array(N).keys()].filter((i) => m & (1 << i) && ((i + 1) % pos === 0 || pos % (i + 1) === 0)).map((i) => m ^ (1 << i)); },
    val: (m) => d[m], line: [2],
    eq: (m) => { const pos = pop(m); const xs = [...Array(N).keys()].filter((i) => m & (1 << i)); const ok = xs.filter((i) => (i + 1) % pos === 0 || pos % (i + 1) === 0); return `{${xs.map((i) => i + 1).join(',')}} → position ${pos} holds ${ok.length ? ok.map((i) => i + 1).join(' or ') : 'nothing valid'} → ${d[m]}`; },
    say: (m) => (m === 1 ? 'The set holding only the number one: it sits at position one, which works. One way.' : m === 0b0101 ? 'The set one and three: position two must hold one or three. Neither three divides two nor two three, so only one fits: one way.' : m === 15 ? `All numbers placed: position four can hold one, two or four. Adding up the ways gives ${words(d[15])}.` : undefined),
    hold: 320,
  });
  a.tone(15, 'ok');
  v.line(3).eq(`dp[1111] = ${d[15]}`, 'ok').say(`${words(d[15])[0].toUpperCase()}${words(d[15]).slice(1)} beautiful arrangements. Two to the n masks times n numbers: for n = 15 about half a million steps.`);
  v.answer(count(N));

  recap(v, [{ name: 'All permutations', time: 'O(n! · n)', space: 'O(n)' }, { name: 'Backtracking', time: 'pruned n!', space: 'O(n)' }, { name: 'Bitmask DP', time: 'O(2ⁿ · n)', space: 'O(2ⁿ)' }], 'The used set determines the next position: popcount(mask).', ['Permutations with position constraints, small n → dp over used-set masks'], 'Order of the used numbers does not matter, only which.');
  return v.build();
}

const problem: Problem = {
  slug: 'beautiful-arrangement',
  statement: 'A permutation `perm` of 1..n is beautiful if for every i (1-indexed), `perm[i]` is divisible by i or i is divisible by `perm[i]`. Given `n`, return the number of beautiful arrangements.',
  examples: [{ input: 'n = 2', output: '2' }, { input: 'n = 1', output: '1' }],
  constraints: ['1 ≤ n ≤ 15'],
  hints: ['Fill positions in order; the set of used numbers is all that matters.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'All permutations', idea: 'Generate and check every permutation.', time: 'O(n! · n)', space: 'O(n)', bottleneck: 'Factorial.' },
    { id: 'better', kind: 'better', name: 'Backtracking', idea: 'Place only numbers that fit the next position.', time: 'pruned', space: 'O(n)', bottleneck: 'Repeated used-sets.' },
    { id: 'optimal', kind: 'optimal', name: 'Bitmask DP', idea: 'dp[mask] summed over the number at position popcount(mask).', time: 'O(2ⁿ · n)', space: 'O(2ⁿ)' },
  ],
  takeaway: 'Position = **popcount(mask)**.',
  video,
  videoArgs: [N],
  judge: {
    type: 'fn', fn: 'countArrangement', params: ['int'], ret: 'int',
    tests: [{ args: [2], out: 2 }, { args: [1], out: 1 }, { args: [4], out: 8 }, { args: [8], out: count(8) }, { args: [15], out: count(15), big: true }],
    gen: (r: Rng) => [r.int(1, 8)],
    ref: (n: number) => count(n),
  },
};

export default problem;
