import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const E = [[5, 4], [6, 4], [6, 7], [2, 3], [7, 8], [3, 5], [6, 5]];
function dolls(e: number[][]) { const s = [...e].sort((a, b) => a[0] - b[0] || b[1] - a[1]); const t: number[] = []; for (const [, h] of s) { let lo = 0, hi = t.length; while (lo < hi) { const m = (lo + hi) >> 1; if (t[m] < h) lo = m + 1; else hi = m; } t[lo] = h; } return t.length; }

function video() {
  const v = new Video('russian-doll-envelopes', 'Russian Doll Envelopes');
  const sorted = [...E].sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  v.chapter('intro', 'The problem');
  v.table('e', ['width', 'height'], E.map(([w, h]) => [String(w), String(h)]));
  v.say('An envelope fits inside another only if both its width and its height are strictly smaller. What is the most envelopes you can nest, one inside the next?');
  v.eq(`answer: ${dolls(E)} ([2,3] → [3,5] → [6,7] → [7,8])`);

  v.chapter('brute', 'Brute force: sort by width, O(n²) LIS on both dimensions', { cx: 'O(n²)', code: ['sort by width', 'dp[i] = 1 + max(dp[j]) over j with w[j] < w[i] and h[j] < h[i]'] });
  v.eq('n = 10⁵ → 10¹⁰ steps', 'bad').say('After sorting by width, this is a longest increasing subsequence where both dimensions must grow. The quadratic LIS is too slow for a hundred thousand envelopes.');

  v.chapter('trick', 'The trick: equal widths sorted by height, descending');
  v.clear();
  v.table('s', ['width', 'height'], sorted.map(([w, h]) => [String(w), String(h)]));
  v.say('Sort by width ascending. Now we want an increasing subsequence of heights, but two envelopes with the same width must never both be chosen. Sorting equal widths by height descending guarantees that: within a group of equal widths the heights go down, so a strictly increasing run can take at most one of them.');

  v.chapter('optimal', 'LIS on heights with binary search', { cx: 'O(n log n)', code: ['sort by (width ↑, height ↓)', 'tails = []', 'for each height h: replace the first tail ≥ h, or append', 'answer = len(tails)'] });
  const hs = sorted.map((e) => e[1]);
  const src = v.array('h', hs, { label: 'heights after sorting' });
  const tails = v.array('t', [], { label: 'tails' });
  v.line(0, 1);
  const T: number[] = [];
  hs.forEach((h, k) => {
    src.clearTones().tone(k, 'active');
    let lo = 0, hi = T.length; while (lo < hi) { const m = (lo + hi) >> 1; if (T[m] < h) lo = m + 1; else hi = m; }
    const app = lo === T.length; const old = T[lo]; T[lo] = h;
    if (app) tails.push(h); else tails.set(lo, h);
    tails.clearTones().tone(lo, app ? 'ok' : 'warn');
    v.line(2).counter(`nested ${T.length}`).eq(app ? `${h}: larger than all tails → append` : `${h}: replaces ${old}`, app ? 'ok' : 'warn');
    if (k === 3) v.say('The three width-six envelopes arrive as seven, five, four. Seven appends, then five and four can only replace a tail: never two width-six envelopes in one chain.');
    else v.hold(700);
  });
  src.clearTones();
  v.line(3).eq(`len(tails) = ${T.length}`, 'ok').say(`${words(T.length)[0].toUpperCase()}${words(T.length).slice(1)} envelopes nest. Sorting plus one binary search per envelope: n log n.`);
  v.answer(dolls(E));

  recap(v, [{ name: 'Sort + O(n²) LIS', time: 'O(n²)', space: 'O(n)' }, { name: 'Sort (w ↑, h ↓) + fast LIS', time: 'O(n log n)', space: 'O(n)' }], 'Width ascending, height descending on ties, then LIS on heights.', ['2D nesting / chains → sort one dimension, LIS on the other'], 'Descending heights on equal widths prevents illegal pairs.');
  return v.build();
}

const problem: Problem = {
  slug: 'russian-doll-envelopes',
  statement: 'You are given `envelopes[i] = [wi, hi]`. One envelope fits into another if both its width and height are strictly smaller. Return the maximum number of envelopes you can Russian-doll (put one inside the other).',
  examples: [{ input: 'envelopes = [[5,4],[6,4],[6,7],[2,3]]', output: '3' }, { input: 'envelopes = [[1,1],[1,1],[1,1]]', output: '1' }],
  constraints: ['1 ≤ envelopes.length ≤ 10⁵', '1 ≤ wi, hi ≤ 10⁵'],
  hints: ['Sort by width.', 'For equal widths, sort heights descending, then LIS on heights.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sort + O(n²) LIS', idea: 'LIS with both dimensions checked.', time: 'O(n²)', space: 'O(n)', bottleneck: 'Quadratic.' },
    { id: 'optimal', kind: 'optimal', name: 'Sort trick + fast LIS', idea: 'Sort (w asc, h desc); LIS of heights with binary search.', time: 'O(n log n)', space: 'O(n)' },
  ],
  takeaway: 'Sort **(w ↑, h ↓)**, then LIS.',
  video,
  videoArgs: [E],
  judge: {
    type: 'fn', fn: 'maxEnvelopes', params: ['int[][]'], ret: 'int',
    tests: [{ args: [[[5, 4], [6, 4], [6, 7], [2, 3]]], out: 3 }, { args: [[[1, 1], [1, 1], [1, 1]]], out: 1 }, { args: [E], out: dolls(E) }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 12) }, () => [r.int(1, 8), r.int(1, 8)])],
    ref: (e: number[][]) => dolls(e),
  },
};

export default problem;
