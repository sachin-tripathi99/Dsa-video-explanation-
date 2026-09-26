import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { decisionTree } from '../../btviz';

const N = [1, 2, 3];
function perms(a: number[]) { const out: number[][] = []; const used = a.map(() => false); const p: number[] = []; const go = () => { if (p.length === a.length) { out.push([...p]); return; } for (let i = 0; i < a.length; i++) { if (used[i]) continue; used[i] = true; p.push(a[i]); go(); p.pop(); used[i] = false; } }; go(); return out; }

function video() {
  const v = new Video('permutations', 'Permutations');
  v.chapter('intro', 'The problem');
  v.array('a', N, { label: 'nums (distinct)' });
  v.say('Return every ordering of the numbers. For three numbers there are three factorial, six, permutations.');
  v.eq(perms(N).map((p) => `[${p}]`).join(' '));

  v.chapter('brute', 'Brute force: every sequence, keep the ones without repeats', { cx: 'O(nⁿ · n)', code: ['for every sequence of n picks (with repetition):', '  keep it if all picks are different'] });
  v.eq(`${N.length}ⁿ = ${N.length ** N.length} sequences to find ${perms(N).length}`, 'bad').say('Generate every sequence of n picks, allowing repeats, and throw away the ones that reuse a number. That is n to the n sequences to find only n factorial answers.');

  v.chapter('optimal', 'Backtracking with a used[] array', { cx: 'O(n · n!)', code: ['def go(path):', '  if len(path) == n: record a copy; return', '  for i in 0..n−1: if not used[i]:', '    used[i] = True; path.append(nums[i]); go(path)', '    path.pop(); used[i] = False'] });
  v.clear();
  const d = decisionTree(v, 't', 'each level picks the next position from the unused numbers');
  const used = N.map(() => false);
  const path: number[] = [];
  let count = 0, told = 0;
  const go = (edge?: string) => {
    const nid = d.enter(`[${path.join(',')}]`, edge);
    if (path.length === N.length) {
      d.mark(nid, 'ok');
      count++;
      v.line(1).counter(`permutations: ${count}`).eq(`record [${path.join(', ')}]`, 'ok');
      if (told === 1) { v.say('All three positions are filled: record [1, 2, 3].'); told++; }
      else if (told === 2) { v.say('Return, un-choose three and two. At the second position, the only other unused number is three, then two fills the last spot: [1, 3, 2].'); told++; }
      else v.hold(450);
      d.leave();
      return;
    }
    v.eq(`path [${path.join(', ')}] → try each unused number`);
    if (told === 0) { v.line(2).say('Unlike subsets, order matters, so every level loops over all the numbers and skips the ones already used. A used array answers that in constant time.'); told++; } else v.line(2).hold(300);
    for (let i = 0; i < N.length; i++) {
      if (used[i]) continue;
      used[i] = true; path.push(N[i]);
      go(`${N[i]}`);
      path.pop(); used[i] = false;
    }
    d.leave();
  };
  go();
  v.line(4).eq(`${count} = ${N.length}! permutations · O(n · n!)`, 'ok').say(`Six leaves, one per permutation. The tree has n factorial leaves, and copying each costs n.`);
  v.answer(perms(N));

  recap(v, [{ name: 'All sequences + filter', time: 'O(nⁿ · n)', space: 'O(n)' }, { name: 'Backtracking + used[]', time: 'O(n · n!)', space: 'O(n)' }], 'Loop over all unused elements at every level.', ['All orderings → permutation backtracking with used[]'], 'Order matters → loop over everything unused, not from a start index.');
  return v.build();
}

const problem: Problem = {
  slug: 'permutations',
  statement: 'Given an array `nums` of distinct integers, return all the possible permutations, in any order.',
  examples: [{ input: 'nums = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' }, { input: 'nums = [0,1]', output: '[[0,1],[1,0]]' }],
  constraints: ['1 ≤ n ≤ 6', 'distinct integers'],
  hints: ['Track which elements are already placed.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'All sequences + filter', idea: 'Every length-n sequence with repetition, keep those with distinct picks.', time: 'O(nⁿ · n)', space: 'O(n)', bottleneck: 'Mostly invalid sequences.' },
    { id: 'optimal', kind: 'optimal', name: 'Backtracking + used[]', idea: 'Pick any unused element for the next position.', time: 'O(n · n!)', space: 'O(n)' },
  ],
  takeaway: 'Permutations: loop over **all unused** elements.',
  video,
  videoArgs: [N],
  judge: {
    type: 'fn', fn: 'permute', params: ['int[]'], ret: 'List<List<Integer>>', cmp: 'sorted',
    tests: [{ args: [[1, 2, 3]], out: perms([1, 2, 3]) }, { args: [[0, 1]], out: [[0, 1], [1, 0]] }, { args: [[1]], out: [[1]] }],
    gen: (r: Rng) => [r.shuffle(Array.from({ length: 10 }, (_, i) => i - 3)).slice(0, r.int(1, 5))],
    ref: (a: number[]) => perms(a),
  },
};

export default problem;
