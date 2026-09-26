import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const M = [
  ['1', '0', '1', '0', '0'],
  ['1', '0', '1', '1', '1'],
  ['1', '1', '1', '1', '1'],
  ['1', '0', '0', '1', '0'],
];
function lr(h: number[]) { const st: number[] = []; let b = 0; for (let i = 0; i <= h.length; i++) { const x = i === h.length ? 0 : h[i]; while (st.length && h[st[st.length - 1]] > x) { const t = st.pop()!; const left = st.length ? st[st.length - 1] : -1; b = Math.max(b, h[t] * (i - left - 1)); } st.push(i); } return b; }
function lrw(h: number[]) { let b = { area: 0, l: 0, r: 0 }; const st: number[] = []; for (let i = 0; i <= h.length; i++) { const x = i === h.length ? 0 : h[i]; while (st.length && h[st[st.length - 1]] > x) { const t = st.pop()!; const left = st.length ? st[st.length - 1] : -1; const area = h[t] * (i - left - 1); if (area > b.area) b = { area, l: left + 1, r: i - 1 }; } st.push(i); } return b; }
function mr(m: string[][]) { if (!m.length) return 0; const h = Array(m[0].length).fill(0); let b = 0; for (const row of m) { row.forEach((c, j) => (h[j] = c === '1' ? h[j] + 1 : 0)); b = Math.max(b, lr(h)); } return b; }

function video() {
  const v = new Video('maximal-rectangle', 'Maximal Rectangle');
  v.chapter('intro', 'The problem');
  v.grid('m', M, { label: 'binary matrix' });
  v.say('Find the largest rectangle containing only ones in a binary matrix, and return its area.');
  v.eq(`answer: ${mr(M)}`);

  v.chapter('brute', 'Brute force: every rectangle', { cx: 'O(m² n²) with prefix sums', code: ['for every top-left and bottom-right corner:', '  all ones? (2D prefix sum) → area'] });
  v.eq('(mn)² rectangles', 'bad').say('Trying every pair of corners, even with a two-dimensional prefix sum to check each in constant time, is m squared n squared.');

  v.chapter('optimal', 'Optimal: a histogram per row', { cx: 'O(m · n)', code: ['for each row:', '  h[j] = cell is 1 ? h[j] + 1 : 0', '  best = max(best, histogram(h))'] });
  v.clear().layout('row');
  const g = v.grid('m', M, { label: 'matrix' });
  const n = M[0].length;
  const h = Array(n).fill(0);
  const hv = v.array('h', [...h], { label: 'heights (histogram for this row)', bars: true });
  let best = 0;
  v.say('Look at the matrix row by row, as the ground of a histogram. For each column, the height is how many consecutive ones stand on top of each other ending at this row. Then the largest rectangle whose bottom edge lies on this row is the largest rectangle in that histogram, which the previous problem solves in linear time.');
  M.forEach((row, r) => {
    row.forEach((c, j) => { h[j] = c === '1' ? h[j] + 1 : 0; hv.set(j, h[j]); });
    const w = lrw(h);
    const area = w.area;
    const nb = area > best;
    hv.noWin();
    if (area) hv.win(w.l, w.r, nb ? 'ok' : 'win', `area ${area}`);
    best = Math.max(best, area);
    g.clearTones().toneRow(r, 'active');
    v.line(1, 2).counter(`best: ${best}`).eq(`row ${r}: heights [${h.join(', ')}] → largest rectangle ${area}${nb ? ' ← best' : ''}`, nb ? 'ok' : undefined);
    if (r === 0) v.say('After the first row, the heights are just the row itself.');
    else if (r === 2) v.say(`On row two, a zero resets a column to zero, and ones stack up. The histogram is ${h.map(words).join(', ')}, and its largest rectangle has area ${words(area)}: height two across the last three columns.`);
    else v.hold(900);
  });
  g.clearTones();
  hv.noWin();
  v.eq(`maximal rectangle = ${best}`, 'ok').say(`The best over all rows is ${words(best)}. Each row costs linear time for the histogram, so m times n overall.`);
  v.answer(mr(M));

  recap(v, [{ name: 'Every rectangle', time: 'O(m² n²)', space: 'O(mn)' }, { name: 'Histogram per row + stack', time: 'O(m · n)', space: 'O(n)' }], 'Each row is the base of a histogram of stacked ones.', ['2D rectangle of 1s → reduce to “largest rectangle in histogram” per row'], 'Reduce a 2D problem to a 1D problem you have already solved.');
  return v.build();
}

const problem: Problem = {
  slug: 'maximal-rectangle',
  statement: 'Given a `rows × cols` binary matrix filled with `\'0\'`s and `\'1\'`s, find the largest rectangle containing only `1`s and return its area.',
  examples: [{ input: 'matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]', output: '6' }, { input: 'matrix = [["0"]]', output: '0' }, { input: 'matrix = [["1"]]', output: '1' }],
  constraints: ['1 ≤ rows, cols ≤ 200'],
  hints: ['Treat each row as the ground of a histogram.', 'Use Largest Rectangle in Histogram per row.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every rectangle', idea: 'Check every pair of corners with a 2D prefix sum.', time: 'O(m² n²)', space: 'O(mn)', bottleneck: 'Too many rectangles.' },
    { id: 'optimal', kind: 'optimal', name: 'Histogram per row', idea: 'heights[j] = consecutive ones up to this row; run the monotonic-stack histogram solution each row.', time: 'O(m · n)', space: 'O(n)' },
  ],
  takeaway: 'Reduce 2D to **1D histograms**.',
  video,
  videoArgs: [M],
  judge: {
    type: 'fn', fn: 'maximalRectangle', params: ['char[][]'], ret: 'int',
    tests: [{ args: [M], out: 6 }, { args: [[['0']]], out: 0 }, { args: [[['1']]], out: 1 }],
    gen: (r: Rng) => { const R = r.int(1, 5), C = r.int(1, 5); return [Array.from({ length: R }, () => Array.from({ length: C }, () => (r.chance(0.65) ? '1' : '0')))]; },
    ref: (m: string[][]) => mr(m),
  },
};

export default problem;
