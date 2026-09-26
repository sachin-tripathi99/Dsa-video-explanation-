import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { decisionTree } from '../../btviz';

const N = [1, 2, 1];
function pu(a: number[]) { const s = [...a].sort((x, y) => x - y); const used = s.map(() => false); const out: number[][] = []; const p: number[] = []; const go = () => { if (p.length === s.length) { out.push([...p]); return; } for (let i = 0; i < s.length; i++) { if (used[i]) continue; if (i > 0 && s[i] === s[i - 1] && !used[i - 1]) continue; used[i] = true; p.push(s[i]); go(); p.pop(); used[i] = false; } }; go(); return out; }

function video() {
  const v = new Video('permutations-ii', 'Permutations II');
  v.chapter('intro', 'The problem');
  v.array('a', N, { label: 'nums (may contain duplicates)' });
  v.say('Return all distinct permutations. The input can contain equal numbers, so swapping two equal values must not produce a second copy.');
  v.eq(pu(N).map((x) => `[${x}]`).join(' '));

  v.chapter('brute', 'Brute force: all permutations into a set', { cx: 'O(n · n! · log)', code: ['generate all n! orderings of positions', 'add each value sequence to a set'] });
  v.eq('[1,1,2] appears twice (swap the two 1s)', 'warn').say('Generating all orderings and deduplicating with a set works, but with many equal values most of the n factorial orderings are duplicates.');

  v.chapter('optimal', 'Sort, then use equal values in order only', { cx: 'O(n · n!)', code: ['sort nums', 'for i in 0..n−1:', '  if used[i]: continue', '  if i > 0 and nums[i] == nums[i−1] and not used[i−1]: continue', '  choose i; recurse; un-choose'] });
  v.clear();
  const s = [...N].sort((x, y) => x - y);
  v.array('s', s, { label: 'sorted (the 1s are copy A and copy B)' });
  const d = decisionTree(v, 't', 'equal values must be used left copy first');
  v.weight('s', 0.6).weight('t', 2.4);
  const used = s.map(() => false);
  const path: number[] = [];
  let count = 0, told = 0;
  const go = (edge?: string) => {
    const nid = d.enter(`[${path.join(',')}]`, edge);
    if (path.length === s.length) {
      d.mark(nid, 'ok'); count++;
      v.line(4).counter(`found: ${count}`).eq(`record [${path.join(', ')}]`, 'ok').hold(500);
      d.leave();
      return;
    }
    v.line(1).eq(`path [${path.join(', ')}] → try unused values`).hold(350);
    for (let i = 0; i < s.length; i++) {
      if (used[i]) continue;
      if (i > 0 && s[i] === s[i - 1] && !used[i - 1]) {
        const pid = d.enter('dup', `${s[i]}`);
        d.mark(pid, 'bad');
        v.line(3).eq(`index ${i}: second ${s[i]} while the first ${s[i]} is unused → skip`, 'bad');
        if (told === 0) { v.say(`Here we would place the second one while the first one is still unused. That builds the same sequences as placing the first one, which we already did. Rule: among equal values, always use the leftmost unused copy first. So skip.`); told++; } else v.hold(500);
        d.leave();
        continue;
      }
      used[i] = true; path.push(s[i]);
      go(`${s[i]}`);
      path.pop(); used[i] = false;
    }
    d.leave();
  };
  go();
  v.eq(`${count} distinct permutations`, 'ok').say(`Three distinct permutations: three factorial divided by two factorial for the two equal ones. No duplicates were built.`);
  v.answer(pu(N));

  recap(v, [{ name: 'All permutations + set', time: 'O(n · n! · log)', space: 'O(n · n!)' }, { name: 'Sort + ordered use of equal values', time: 'O(n · n!)', space: 'O(n)' }], 'Skip nums[i] if it equals nums[i−1] and nums[i−1] is unused.', ['Permutations with duplicates → sort + use equal copies left to right'], 'Force equal values into a fixed order so each arrangement is built once.');
  return v.build();
}

const problem: Problem = {
  slug: 'permutations-ii',
  statement: 'Given a collection of numbers, `nums`, that might contain duplicates, return all possible unique permutations in any order.',
  examples: [{ input: 'nums = [1,1,2]', output: '[[1,1,2],[1,2,1],[2,1,1]]' }, { input: 'nums = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' }],
  constraints: ['1 ≤ n ≤ 8'],
  hints: ['Sort first.', 'Use equal values in left-to-right order only.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'All permutations + set', idea: 'Generate every ordering of indices; dedupe value sequences.', time: 'O(n · n! · log)', space: 'O(n · n!)', bottleneck: 'Builds duplicates.' },
    { id: 'optimal', kind: 'optimal', name: 'Sort + skip rule', idea: 'Skip i when nums[i] == nums[i−1] and used[i−1] is false.', time: 'O(n · n!)', space: 'O(n)' },
  ],
  takeaway: 'Use **equal copies left to right**.',
  video,
  videoArgs: [N],
  judge: {
    type: 'fn', fn: 'permuteUnique', params: ['int[]'], ret: 'List<List<Integer>>', cmp: 'sorted',
    tests: [{ args: [[1, 1, 2]], out: pu([1, 1, 2]) }, { args: [[1, 2, 3]], out: pu([1, 2, 3]) }, { args: [[2, 2, 2]], out: [[2, 2, 2]] }],
    gen: (r: Rng) => [r.ints(r.int(1, 5), 0, 2)],
    ref: (a: number[]) => pu(a),
  },
};

export default problem;
