import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const K = 3;
const W = 0;
const P = [1, 2, 3, 5, 6];
const C = [0, 1, 1, 3, 4];
function ipo(k: number, w: number, p: number[], c: number[]) { const idx = p.map((_, i) => i).sort((a, b) => c[a] - c[b]); const avail: number[] = []; let j = 0; for (let t = 0; t < k; t++) { while (j < idx.length && c[idx[j]] <= w) avail.push(p[idx[j++]]); if (!avail.length) break; avail.sort((a, b) => b - a); w += avail.shift()!; } return w; }

function video() {
  const v = new Video('ipo', 'IPO');
  v.chapter('intro', 'The problem');
  const t0 = v.table('t', ['project', 'capital needed', 'profit'], P.map((p, i) => [String(i), String(C[i]), String(p)]));
  void t0;
  v.say(`You start with capital ${words(W)} and may finish at most ${words(K)} projects, one after another. A project can start only if your current capital is at least its requirement, and finishing it adds its profit to your capital. Maximise the final capital.`);
  v.eq(`answer: ${ipo(K, W, P, C)}`);

  v.chapter('insight', 'Greedy: among affordable projects, take the most profitable');
  v.clear();
  v.text('g', { title: 'Why greedy works', lines: ['Profits are never negative, so capital only grows', 'Anything affordable now stays affordable later', 'So taking the biggest affordable profit first never hurts'], shown: 3 });
  v.say('Capital only goes up. So any project you can afford now, you can also afford later. Taking the most profitable affordable project first can only unlock more projects, never fewer. That makes greedy safe.');

  v.chapter('brute', 'Brute force: scan all projects each round', { cx: 'O(k · n)', code: ['repeat k times:', '  scan every unused project with capital ≤ w', '  take the max profit'] });
  v.eq('k rounds × n projects', 'warn').say('Scanning all projects every round costs k times n.');

  v.chapter('optimal', 'Optimal: sort by capital + max-heap of unlocked profits', { cx: 'O(n log n)', code: ['sort projects by capital', 'repeat k times:', '  push profits of every project with capital ≤ w  (pointer j)', '  if heap empty: stop; w += heap.pop()'] });
  v.clear();
  const idx = P.map((_, i) => i).sort((a, b) => C[a] - C[b]);
  const t = v.table('t', ['project', 'capital needed', 'profit'], idx.map((i) => [String(i), String(C[i]), String(P[i])]), { label: 'sorted by capital' });
  const h = v.heap('h', { label: 'max-heap: profits of unlocked projects', min: false, treeOnly: true });
  v.weight('t', 1.2).weight('h', 1.3);
  let w = W, j = 0;
  v.say('Two groups with opposite priorities. Locked projects wait in a list sorted by capital; a pointer releases them as soon as we can afford them. Unlocked projects go into a max-heap by profit, so the best choice is always on top.');
  for (let r = 0; r < K; r++) {
    const rel: number[] = [];
    while (j < idx.length && C[idx[j]] <= w) { h.push(P[idx[j]]); t.tone(j, 'cmp'); rel.push(idx[j]); j++; }
    v.line(2).counter(`capital: ${w} · round ${r + 1}/${K}`).eq(rel.length ? `capital ${w} unlocks project${rel.length > 1 ? 's' : ''} ${rel.join(', ')}` : `capital ${w} unlocks nothing new`);
    if (r === 0) v.say(`With capital ${words(w)}, only project zero is affordable. Release it into the heap.`); else if (rel.length) v.say(`Capital ${words(w)} now unlocks ${rel.length === 1 ? `project ${words(rel[0])}` : `projects ${rel.map(words).join(' and ')}`}.`); else v.hold(700);
    if (!h.size) { v.eq('nothing affordable → stop', 'warn').hold(800); break; }
    const best = Number(h.pop());
    const row = idx.findIndex((i, q) => q < j && P[i] === best && t.p.tones[q] === 'cmp');
    if (row >= 0) t.tone(row, 'ok');
    w += best;
    v.line(3).counter(`capital: ${w} · round ${r + 1}/${K}`).eq(`take profit ${best} → capital ${w}`, 'ok');
    if (r === 0) v.say(`Take it: capital becomes ${words(w)}.`); else v.say(`The best unlocked profit is ${words(best)}. Capital becomes ${words(w)}.`);
  }
  v.eq(`final capital = ${w}`, 'ok').say(`After ${words(K)} projects, the capital is ${words(w)}. Sorting is n log n, and each project enters and leaves the heap at most once.`);
  v.answer(ipo(K, W, P, C));

  recap(v, [{ name: 'Scan each round', time: 'O(k · n)', space: 'O(n)' }, { name: 'Sort + max-heap', time: 'O(n log n)', space: 'O(n)' }], 'Unlock by capital (sorted pointer), choose by profit (max-heap).', ['Budget grows as you pick → sort by cost + max-heap by value'], 'Two orderings: one to unlock, one to choose.');
  return v.build();
}

const problem: Problem = {
  slug: 'ipo',
  statement: 'You have `n` projects; project `i` has a pure profit `profits[i]` and needs at least `capital[i]` to start. You start with `w` capital and can finish at most `k` distinct projects. Finishing a project adds its profit to your capital. Return the maximised final capital.',
  examples: [{ input: 'k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]', output: '4' }, { input: 'k = 3, w = 0, profits = [1,2,3], capital = [0,1,2]', output: '6' }],
  constraints: ['1 ≤ k ≤ 10⁵', '0 ≤ w ≤ 10⁹', '1 ≤ n ≤ 10⁵', '0 ≤ profits[i] ≤ 10⁴', '0 ≤ capital[i] ≤ 10⁹'],
  hints: ['Capital never decreases.', 'Among affordable projects, which should you do first?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Scan each round', idea: 'k times, scan all unused affordable projects for the max profit.', time: 'O(k · n)', space: 'O(n)', bottleneck: 'Rescans.' },
    { id: 'optimal', kind: 'optimal', name: 'Sort + max-heap', idea: 'Sort by capital; push newly affordable profits into a max-heap; pop the best k times.', time: 'O(n log n)', space: 'O(n)' },
  ],
  takeaway: 'Unlock with a **sorted pointer**, choose with a **max-heap**.',
  video,
  videoArgs: [K, W, P, C],
  judge: {
    type: 'fn', fn: 'findMaximizedCapital', params: ['int', 'int', 'int[]', 'int[]'], ret: 'int',
    tests: [{ args: [2, 0, [1, 2, 3], [0, 1, 1]], out: 4 }, { args: [3, 0, [1, 2, 3], [0, 1, 2]], out: 6 }, { args: [K, W, P, C], out: ipo(K, W, P, C) }, { args: [1, 0, [1], [1]], out: 0 }],
    gen: (r: Rng) => { const n = r.int(1, 8); return [r.int(1, n + 1), r.int(0, 3), r.ints(n, 0, 6), r.ints(n, 0, 8)]; },
    ref: (k: number, w: number, p: number[], c: number[]) => ipo(k, w, p, c),
  },
};

export default problem;
