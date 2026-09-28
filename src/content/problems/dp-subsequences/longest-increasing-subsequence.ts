import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { fill1D } from '../../dpviz';

const A = [10, 9, 2, 5, 3, 7, 101, 18];
function lis(a: number[]) { const t: number[] = []; for (const x of a) { let lo = 0, hi = t.length; while (lo < hi) { const m = (lo + hi) >> 1; if (t[m] < x) lo = m + 1; else hi = m; } t[lo] = x; } return t.length; }

function video() {
  const v = new Video('longest-increasing-subsequence', 'Longest Increasing Subsequence');
  const n = A.length;
  const d = A.map(() => 1);
  for (let i = 0; i < n; i++) for (let j = 0; j < i; j++) if (A[j] < A[i]) d[i] = Math.max(d[i], d[j] + 1);
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'nums' });
  v.say('Find the length of the longest strictly increasing subsequence: elements in their original order, each larger than the one before, not necessarily next to each other.');
  v.eq(`answer: ${lis(A)} (e.g. 2, 3, 7, 18)`);

  v.chapter('brute', 'Brute force: take or skip each element', { cx: 'O(2ⁿ)', code: ['best(i, prev): i == n → 0', '  skip a[i]: best(i+1, prev)', '  take a[i] if a[i] > prev: 1 + best(i+1, a[i])'] });
  v.eq(`2^${n} subsequences`, 'bad').say('Deciding for every element whether to include it, remembering the last value taken, explores every subsequence: exponential.');

  v.chapter('better', 'Better: dp[i] = longest ending at i', { cx: 'O(n²)', code: ['dp[i] = 1 + max(dp[j] for j < i with a[j] < a[i])', 'answer = max(dp)'] });
  v.clear();
  const a = v.array('a', A, { label: 'nums' });
  const dp = v.array('dp', A.map(() => ''), { label: 'dp[i] = longest increasing subsequence ending at i' });
  v.line(0).say('Fix the last element. The longest increasing subsequence ending at i extends the best one ending at some earlier, smaller element.');
  fill1D(v, dp, A.map((_, i) => i), {
    deps: (i) => { const js = [...Array(i).keys()].filter((j) => A[j] < A[i]); const m = Math.max(0, ...js.map((j) => d[j])); const b = js.find((j) => d[j] === m); return b === undefined ? [] : [b]; },
    val: (i) => d[i], line: [0],
    eq: (i) => { const js = [...Array(i).keys()].filter((j) => A[j] < A[i]); return js.length ? `dp[${i}] = 1 + max(${js.map((j) => d[j]).join(', ')}) = ${d[i]}` : `dp[${i}] = 1`; },
    say: (i) => { a.clearTones().tone(i, 'active'); [...Array(i).keys()].filter((j) => A[j] < A[i]).forEach((j) => a.tone(j, 'cmp')); return i === 3 ? 'Five can follow two only: length two.' : i === 5 ? 'Seven can follow two, five or three; the best of those is two long, so seven makes three.' : undefined; },
    hold: 450,
  });
  a.clearTones();
  v.line(1).eq(`max(dp) = ${Math.max(...d)}`, 'ok').say(`The best is ${words(Math.max(...d))}. But each element scans all earlier ones: n squared.`);

  v.chapter('optimal', 'Optimal: smallest tails + binary search', { cx: 'O(n log n)', code: ['tails[k] = smallest last value of an increasing run of length k+1', 'for x: i = first index with tails[i] ≥ x', '  i == len → append x; else tails[i] = x', 'answer = len(tails)'] });
  v.clear();
  const src = v.array('a', A, { label: 'nums' });
  const tails = v.array('t', [], { label: 'tails' });
  v.line(0).say('A cleverer summary: for every possible length, remember only the smallest value a run of that length can end with. A small ending is always better, because more numbers can follow it. This tails list is always sorted, so each new number finds its place with binary search.');
  const T: number[] = [];
  A.forEach((x, k) => {
    src.clearTones().tone(k, 'active');
    let lo = 0, hi = T.length; while (lo < hi) { const m = (lo + hi) >> 1; if (T[m] < x) lo = m + 1; else hi = m; }
    const app = lo === T.length;
    const old = T[lo];
    T[lo] = x;
    if (app) tails.push(x); else tails.set(lo, x);
    tails.clearTones().tone(lo, app ? 'ok' : 'warn');
    v.line(1, 2).counter(`length ${T.length}`).eq(app ? `${x} is larger than every tail → append (length ${T.length})` : `${x}: first tail ≥ ${x} is ${old} → replace it`, app ? 'ok' : 'warn');
    if (k === 1) v.say('Nine: a run of length one ending at nine is better than one ending at ten. Replace.');
    else if (k === 3) v.say('Five is bigger than every tail, two, so it extends the longest run: append.');
    else if (k === 4) v.say('Three replaces five: a length-two run can end at three instead, which is easier to extend.');
    else if (k === n - 1) v.say('Eighteen replaces one hundred and one as the best ending for length four.');
    else v.hold(700);
  });
  src.clearTones();
  v.line(3).eq(`len(tails) = ${T.length}`, 'ok').say(`The list has length ${words(T.length)}, the answer. Careful: tails itself is not always a real subsequence, only its length is meaningful. Each number costs one binary search: n log n.`);
  v.answer(lis(A));

  recap(v, [{ name: 'Take / skip', time: 'O(2ⁿ)', space: 'O(n)' }, { name: 'dp ending at i', time: 'O(n²)', space: 'O(n)' }, { name: 'Tails + binary search', time: 'O(n log n)', space: 'O(n)' }], 'Smallest tail per length, binary search to place each number.', ['Longest increasing subsequence → patience sorting'], 'tails is not the subsequence, only its length.');
  return v.build();
}

const problem: Problem = {
  slug: 'longest-increasing-subsequence',
  statement: 'Given an integer array `nums`, return the length of the longest strictly increasing subsequence.',
  examples: [{ input: 'nums = [10,9,2,5,3,7,101,18]', output: '4' }, { input: 'nums = [0,1,0,3,2,3]', output: '4' }, { input: 'nums = [7,7,7,7,7,7,7]', output: '1' }],
  constraints: ['1 ≤ nums.length ≤ 2500', '−10⁴ ≤ nums[i] ≤ 10⁴'],
  hints: ['dp[i] = longest ending at i.', 'For O(n log n): smallest tail per length.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Take / skip recursion', idea: 'Include or exclude each element, tracking the previous value.', time: 'O(2ⁿ)', space: 'O(n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'O(n²) DP', idea: 'dp[i] = 1 + max dp[j] over smaller earlier elements.', time: 'O(n²)', space: 'O(n)', bottleneck: 'Scans all earlier elements.' },
    { id: 'optimal', kind: 'optimal', name: 'Tails + binary search', idea: 'Keep the smallest tail for each length.', time: 'O(n log n)', space: 'O(n)' },
  ],
  takeaway: '**Smallest tails** + binary search.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'lengthOfLIS', params: ['int[]'], ret: 'int',
    tests: [{ args: [A], out: 4 }, { args: [[0, 1, 0, 3, 2, 3]], out: 4 }, { args: [[7, 7, 7, 7, 7, 7, 7]], out: 1 }, { args: [[5]], out: 1 }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 15) }, () => r.int(-10, 10))],
    ref: (a: number[]) => lis(a),
  },
};

export default problem;
