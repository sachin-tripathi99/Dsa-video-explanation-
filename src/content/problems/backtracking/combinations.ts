import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { decisionTree } from '../../btviz';

const N = 4, K = 2;
function combos(n: number, k: number) { const out: number[][] = []; const p: number[] = []; const go = (s: number) => { if (p.length === k) { out.push([...p]); return; } for (let x = s; x <= n - (k - p.length) + 1; x++) { p.push(x); go(x + 1); p.pop(); } }; go(1); return out; }

function video() {
  const v = new Video('combinations', 'Combinations');
  v.chapter('intro', 'The problem');
  v.array('a', Array.from({ length: N }, (_, i) => i + 1), { label: `numbers 1..${N}, choose k = ${K}` });
  v.say(`Return all combinations of ${words(K)} numbers chosen from one to ${words(N)}. Order inside a combination does not matter.`);
  v.eq(combos(N, K).map((c) => `[${c}]`).join(' '));

  v.chapter('brute', 'Brute force: all subsets, keep size k', { cx: 'O(n · 2ⁿ)', code: ['for mask in 0 .. 2ⁿ − 1:', '  if popcount(mask) == k: record it'] });
  v.eq(`2ⁿ = ${2 ** N} masks to find ${combos(N, K).length}`, 'warn').say('Enumerate every subset and keep those of size k. When k is small, almost all of the two to the n subsets are wasted.');

  v.chapter('optimal', 'Backtracking with pruning', { cx: 'O(k · C(n, k))', code: ['def go(start, path):', '  if len(path) == k: record; return', '  need = k − len(path)', '  for x in start .. n − need + 1:     # enough numbers left', '    path.append(x); go(x + 1, path); path.pop()'] });
  v.clear();
  const d = decisionTree(v, 't', 'children only use larger numbers; branches that cannot reach k are cut');
  const path: number[] = [];
  let count = 0, told = 0;
  const go = (s: number, edge?: string) => {
    const nid = d.enter(`[${path.join(',')}]`, edge);
    if (path.length === K) {
      d.mark(nid, 'ok'); count++;
      v.line(1).counter(`combinations: ${count}`).eq(`record [${path.join(', ')}]`, 'ok');
      if (told === 0) { v.say(`[${path.join(', ')}] has ${words(K)} numbers: record it and go back.`); told++; } else v.hold(450);
      d.leave();
      return;
    }
    const need = K - path.length;
    for (let x = s; x <= N; x++) {
      if (x > N - need + 1) {
        const pid = d.enter(x, `${x}`);
        d.mark(pid, 'bad');
        v.line(3).eq(`start at ${x}: only ${N - x + 1} number${N - x + 1 === 1 ? '' : 's'} left, need ${need} → prune`, 'bad');
        if (told === 1) { v.say(`At the root, starting with ${words(x)} leaves nothing bigger to pair it with. The loop bound, n minus need plus one, cuts this branch before it is explored.`); told++; } else v.hold(600);
        d.leave();
        break;
      }
      path.push(x);
      go(x + 1, `${x}`);
      path.pop();
    }
    d.leave();
  };
  go(1);
  v.eq(`${count} combinations = C(${N}, ${K})`, 'ok').say(`${words(count)} combinations: four choose two. With pruning, every explored branch leads to an answer.`);
  v.answer(combos(N, K));

  recap(v, [{ name: 'All subsets + filter', time: 'O(n · 2ⁿ)', space: 'O(n)' }, { name: 'Backtracking + pruning', time: 'O(k · C(n, k))', space: 'O(k)' }], 'Loop x from start to n − need + 1.', ['Choose k of n → start-index backtracking with a count bound'], 'Prune branches that cannot possibly reach the required size.');
  return v.build();
}

const problem: Problem = {
  slug: 'combinations',
  statement: 'Given two integers `n` and `k`, return all possible combinations of `k` numbers chosen from the range `[1, n]`, in any order.',
  examples: [{ input: 'n = 4, k = 2', output: '[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]' }, { input: 'n = 1, k = 1', output: '[[1]]' }],
  constraints: ['1 ≤ n ≤ 20', '1 ≤ k ≤ n'],
  hints: ['Like subsets, but stop at size k.', 'Stop the loop when too few numbers remain.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'All subsets + filter', idea: 'Bitmasks with popcount k.', time: 'O(n · 2ⁿ)', space: 'O(n)', bottleneck: 'Most masks have the wrong size.' },
    { id: 'optimal', kind: 'optimal', name: 'Backtracking + pruning', idea: 'Start-index recursion; x runs to n − (k − len) + 1.', time: 'O(k · C(n, k))', space: 'O(k)' },
  ],
  takeaway: '**Prune** when not enough numbers are left.',
  video,
  videoArgs: [N, K],
  judge: {
    type: 'fn', fn: 'combine', params: ['int', 'int'], ret: 'List<List<Integer>>', cmp: 'deepSorted',
    tests: [{ args: [4, 2], out: combos(4, 2) }, { args: [1, 1], out: [[1]] }, { args: [5, 5], out: [[1, 2, 3, 4, 5]] }],
    gen: (r: Rng) => { const n = r.int(1, 8); return [n, r.int(1, n)]; },
    ref: (n: number, k: number) => combos(n, k),
  },
};

export default problem;
