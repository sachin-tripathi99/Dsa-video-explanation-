import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { decisionTree } from '../../btviz';

const N = [1, 2, 3];
function subsets(a: number[]) { const out: number[][] = []; const p: number[] = []; const go = (s: number) => { out.push([...p]); for (let i = s; i < a.length; i++) { p.push(a[i]); go(i + 1); p.pop(); } }; go(0); return out; }

function video() {
  const v = new Video('subsets', 'Subsets');
  v.chapter('intro', 'The problem');
  v.array('a', N, { label: 'nums (distinct)' });
  v.say('Return every subset of the array, the power set. The empty set and the whole array both count. Any order is fine.');
  v.eq(`${2 ** N.length} subsets: ${subsets(N).map((s) => `[${s}]`).join(' ')}`);

  v.chapter('brute', 'Bitmask enumeration', { cx: 'O(n · 2ⁿ)', code: ['for mask in 0 .. 2ⁿ − 1:', '  subset = { nums[i] : bit i of mask is 1 }'] });
  v.clear();
  const rows = Array.from({ length: 2 ** N.length }, (_, m) => [String(m), m.toString(2).padStart(N.length, '0'), `[${N.filter((_, i) => (m >> (N.length - 1 - i)) & 1).join(',')}]`]);
  const t = v.table('t', ['mask', 'bits (1 2 3)', 'subset'], []);
  v.say('Each subset is a yes or no decision for each element, exactly like the bits of a number. Counting from zero to two to the n minus one lists every subset.');
  rows.forEach((r, i) => { t.addRow(r).clearTones().tone(i, 'ok'); v.hold(i < 2 ? 700 : 350); });
  t.clearTones();
  v.eq('2ⁿ masks × n bits', 'ok').say('This is already optimal in time, since there are two to the n subsets, each up to n long. But it only works when the decisions are independent yes or no bits.');

  v.chapter('optimal', 'Backtracking: extend from a start index', { cx: 'O(n · 2ⁿ)', code: ['def go(start, path):', '  record a copy of path', '  for i in start .. n−1:', '    path.append(nums[i]); go(i + 1, path); path.pop()'] });
  v.clear();
  const d = decisionTree(v, 't', 'every node is a subset; children only use later elements');
  const path: number[] = [];
  let count = 0;
  let told = 0;
  const go = (start: number, edge?: string) => {
    const nid = d.enter(`[${path.join(',')}]`, edge);
    d.mark(nid, 'ok');
    count++;
    v.line(1).counter(`recorded: ${count}`).eq(`record [${path.join(', ')}]`, 'ok');
    if (told === 0) { v.say('This version records a subset at every node, not just at the leaves. Start at the root with the empty subset and record it.'); told++; }
    else if (told === 1) { v.say(`Choose one: the path is [1]. Record it and recurse with start moved past it.`); told++; }
    else if (path.length === 3 && told === 2) { v.say('Keep going down: [1, 2], then [1, 2, 3]. Nothing is left to add, so this call returns, and we un-choose three.'); told++; }
    else if (path.length === 1 && path[0] === 2 && told === 3) { v.say('Back at the root, the loop moves on to two. Because children only use elements after the start index, we never build [2, 1] after [1, 2]: no duplicates.'); told++; }
    else v.hold(500);
    for (let i = start; i < N.length; i++) {
      path.push(N[i]);
      v.line(3).hold(250);
      go(i + 1, `+${N[i]}`);
      path.pop();
    }
    d.leave();
  };
  go(0);
  v.eq(`${count} subsets · O(n · 2ⁿ)`, 'ok').say(`All ${words(count)} subsets, each recorded exactly once. The start index is what makes this the subsets family: never look back.`);
  v.answer(subsets(N));

  recap(v, [{ name: 'Bitmask enumeration', time: 'O(n · 2ⁿ)', space: 'O(n) extra' }, { name: 'Backtracking (start index)', time: 'O(n · 2ⁿ)', space: 'O(n) stack' }], 'Record at every node; loop i from start; recurse with i + 1.', ['All subsets / combinations → start-index backtracking'], 'The output has 2ⁿ entries, so O(n · 2ⁿ) is the best possible.');
  return v.build();
}

const problem: Problem = {
  slug: 'subsets',
  statement: 'Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.',
  examples: [{ input: 'nums = [1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]' }, { input: 'nums = [0]', output: '[[],[0]]' }],
  constraints: ['1 ≤ n ≤ 10', 'elements are distinct'],
  hints: ['Each element is either in or out.', 'Backtrack with a start index so you never look back.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Bitmask enumeration', idea: 'For each mask 0..2ⁿ−1, take the elements whose bits are set.', time: 'O(n · 2ⁿ)', space: 'O(n) extra', bottleneck: 'Only for independent yes/no choices.' },
    { id: 'optimal', kind: 'optimal', name: 'Backtracking', idea: 'Record the path at every node; extend with elements after the start index.', time: 'O(n · 2ⁿ)', space: 'O(n) stack' },
  ],
  takeaway: 'Record at **every node**; loop from the **start index**.',
  video,
  videoArgs: [N],
  judge: {
    type: 'fn', fn: 'subsets', params: ['int[]'], ret: 'List<List<Integer>>', cmp: 'deepSorted',
    tests: [{ args: [[1, 2, 3]], out: subsets([1, 2, 3]) }, { args: [[0]], out: [[], [0]] }],
    gen: (r: Rng) => [r.shuffle(Array.from({ length: 12 }, (_, i) => i - 4)).slice(0, r.int(1, 6))],
    ref: (a: number[]) => subsets(a),
  },
};

export default problem;
