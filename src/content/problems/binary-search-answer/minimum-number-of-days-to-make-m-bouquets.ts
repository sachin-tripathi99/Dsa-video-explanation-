import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { answerSearch } from '../../bsviz';

const B = [7, 7, 7, 7, 12, 7, 7];
const M = 2;
const K = 3;
function bouquets(b: number[], day: number, k: number) { let run = 0, n = 0; for (const x of b) { if (x <= day) { run++; if (run === k) { n++; run = 0; } } else run = 0; } return n; }
const solve = (b: number[], m: number, k: number) => { if (m * k > b.length) return -1; let lo = Math.min(...b), hi = Math.max(...b); while (lo < hi) { const d = (lo + hi) >> 1; if (bouquets(b, d, k) >= m) hi = d; else lo = d + 1; } return lo; };

function video() {
  const v = new Video('min-days-bouquets', 'Minimum Number of Days to Make m Bouquets');
  v.chapter('intro', 'The problem');
  v.array('b', B, { label: `bloomDay · need m = ${M} bouquets of k = ${K} ADJACENT flowers` });
  v.say(`Flower i blooms on day bloomDay of i. A bouquet needs ${words(K)} adjacent bloomed flowers, and each flower can be used once. What is the earliest day we can make ${words(M)} bouquets? If there are not even enough flowers, return minus one.`);
  v.eq(`m · k = ${M * K} ≤ ${B.length} flowers, so it is possible eventually`);

  v.chapter('brute', 'Brute force: try every day', { cx: 'O(n · max day)', code: ['for day in sorted distinct bloom days:', '  if bouquets(day) >= m: return day'] });
  v.eq('waiting longer never hurts → monotonic', 'ok').say('The later the day, the more flowers have bloomed, so the number of bouquets never goes down. Checking every day works, but days go up to a billion.');

  v.chapter('optimal', 'Optimal: binary search the day', { cx: 'O(n log max)', code: ['if m · k > n: return −1', 'lo, hi = min(bloom), max(bloom)', 'bouquets(day): count runs of k bloomed flowers', 'if bouquets(mid) >= m: hi = mid else lo = mid + 1'] });
  v.clear();
  const a = v.array('b', B, { label: 'green = bloomed by that day' });
  const paint = (day: number) => { a.clearTones(); B.forEach((x, i) => a.tone(i, x <= day ? 'ok' : 'dim')); };
  const ans = answerSearch(v, {
    lo: Math.min(...B), hi: Math.max(...B), name: 'day', lines: { ok: [3], bad: [3] },
    check: (day) => { paint(day); const n = bouquets(B, day, K); return { ok: n >= M, info: `${n} bouquet${n === 1 ? '' : 's'} ${n >= M ? '≥' : '<'} ${M}` }; },
    firstSay: (day, ok) => `Try day ${words(day)}. The green flowers have bloomed. Scanning left to right, count runs of ${words(K)} adjacent green flowers: ${words(bouquets(B, day, K))}. ${ok ? 'Enough, so try earlier.' : `Not enough: the flower at index four blooms on day twelve and splits the row, so the right side only has two. Wait longer.`}`,
  });
  paint(ans);
  v.line(3).eq(`earliest day = ${ans}`, 'ok').say(`On day ${words(ans)} everything has bloomed and we get ${words(bouquets(B, ans, K))} bouquets. The answer is ${words(ans)}.`);
  v.answer(solve(B, M, K));

  recap(v, [{ name: 'Try every day', time: 'O(n · max)', space: 'O(1)' }, { name: 'Binary search the day', time: 'O(n log max)', space: 'O(1)' }], 'More days → more bloomed flowers → more bouquets.', ['“Earliest time when X becomes possible” → binary search on time'], 'Time is a classic answer space: once something is possible, it stays possible.');
  return v.build();
}

const problem: Problem = {
  slug: 'minimum-number-of-days-to-make-m-bouquets',
  statement: 'You are given `bloomDay`, and integers `m` and `k`. You want `m` bouquets; each needs `k` **adjacent** flowers. Flower `i` blooms on day `bloomDay[i]` and can be used in exactly one bouquet. Return the minimum number of days to wait to make `m` bouquets, or `-1` if impossible.',
  examples: [{ input: 'bloomDay = [1,10,3,10,2], m = 3, k = 1', output: '3' }, { input: 'bloomDay = [1,10,3,10,2], m = 3, k = 2', output: '-1' }, { input: 'bloomDay = [7,7,7,7,12,7,7], m = 2, k = 3', output: '12' }],
  constraints: ['1 ≤ n ≤ 10⁵', '1 ≤ bloomDay[i] ≤ 10⁹', '1 ≤ m ≤ 10⁶', '1 ≤ k ≤ n'],
  hints: ['If you can make m bouquets on day d, can you on day d + 1?', 'Count bouquets greedily in one pass.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Try every day', idea: 'Check days in increasing order.', time: 'O(n · distinct days)', space: 'O(1)', bottleneck: 'Too many days.' },
    { id: 'optimal', kind: 'optimal', name: 'Binary search the day', idea: 'If m·k > n return −1; else first day in [min, max] with bouquets(day) ≥ m.', time: 'O(n log max)', space: 'O(1)' },
  ],
  pitfalls: ['m · k can overflow 32 bits (10⁶ · 10⁵): use 64-bit.'],
  takeaway: 'Earliest feasible **time** → binary search on days.',
  video,
  videoArgs: [B, M, K],
  judge: {
    type: 'fn', fn: 'minDays', params: ['int[]', 'int', 'int'], ret: 'int',
    tests: [{ args: [[1, 10, 3, 10, 2], 3, 1], out: 3 }, { args: [[1, 10, 3, 10, 2], 3, 2], out: -1 }, { args: [[7, 7, 7, 7, 12, 7, 7], 2, 3], out: 12 }, { args: [[1], 1000000, 100000], out: -1 }],
    gen: (r: Rng) => { const b = r.ints(r.int(1, 10), 1, 20); return [b, r.int(1, 4), r.int(1, 3)]; },
    ref: (b: number[], m: number, k: number) => solve(b, m, k),
  },
};

export default problem;
