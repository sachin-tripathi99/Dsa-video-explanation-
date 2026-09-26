import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomTree, type Level, type TNode } from '../../treeutil';

const T: Level = [10, 5, -3, 3, 2, null, 11, 3, -2, null, 1];
const S = 8;
function ps3(lv: Level, s: number) { let c = 0; const m = new Map<number, number>([[0, 1]]); const go = (n: TNode | null, cur: number) => { if (!n) return; cur += n.v; c += m.get(cur - s) ?? 0; m.set(cur, (m.get(cur) ?? 0) + 1); go(n.l, cur); go(n.r, cur); m.set(cur, m.get(cur)! - 1); }; go(build(lv), 0); return c; }

function video() {
  const v = new Video('path-sum-iii', 'Path Sum III');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: `targetSum = ${S}` });
  v.say(`Count the paths that add up to ${words(S)}. A path must go downwards, from parent to child, but it can start and end at any node, not just the root or a leaf.`);
  v.eq(`answer: ${ps3(T, S)} (5→3, 5→2→1, −3→11)`);

  v.chapter('brute', 'Brute force: start a downward search from every node', { cx: 'O(n²) worst, O(n log n) balanced', code: ['for each node start:', '  walk down every path from start, adding values', '  count each time the sum hits the target'] });
  v.eq('n starting points × up to n nodes below each', 'warn').say('Every node can be a starting point. From each, walk down all paths and count sums that hit the target. On a chain this is quadratic.');

  v.chapter('optimal', 'Prefix sums along the root path + a hash map', { cx: 'O(n)', code: ['cur = root-to-node sum', 'count += seen[cur − target]', 'seen[cur] += 1; recurse', 'seen[cur] −= 1   # leaving'] });
  v.clear().layout('row');
  const t = v.binaryTree('t', T, { label: 'badge = prefix sum from the root' });
  const m = v.map('m', { label: 'prefix sums on the current path → count' });
  v.weight('t', 1.8);
  const seen = new Map<number, number>([[0, 1]]);
  m.put(0, 1);
  let count = 0;
  const path: string[] = [];
  let told = 0;
  v.say('This is Subarray Sum Equals K, applied to each root-to-node path. Let cur be the sum from the root down to the current node. A downward path ending here sums to the target exactly when some ancestor’s prefix sum equals cur minus target. A hash map counts the prefix sums on the current path. It starts with zero, once, for paths that begin at the root.');
  const go = (id: string | null, cur: number) => {
    if (!id) return;
    path.push(id);
    cur += t.val(id) as number;
    t.badge(id, cur);
    const add = seen.get(cur - S) ?? 0;
    count += add;
    t.clearTones(); path.forEach((x) => t.tone(x, 'path')); t.tone(id, add ? 'ok' : 'active');
    m.clearTones(); if (seen.has(cur - S)) m.tone(cur - S, 'ok');
    v.line(1).counter(`count: ${count}`).eq(`cur = ${cur}; need ${cur} − ${S} = ${cur - S} → seen ${add} time${add === 1 ? '' : 's'}`, add ? 'ok' : undefined);
    if (told === 0) { v.say(`At the root, cur is ten. We would need an earlier prefix sum of two; there is none.`); told++; }
    else if (add && told === 1) { v.say(`Here cur is ${words(cur)}. The prefix sum ${words(cur - S)} appeared earlier on this path, so the stretch between that ancestor and here adds up to ${words(S)}. Count it.`); told++; }
    else v.hold(600);
    seen.set(cur, (seen.get(cur) ?? 0) + 1);
    m.put(cur, seen.get(cur)!);
    go(t.left(id), cur);
    go(t.right(id), cur);
    seen.set(cur, seen.get(cur)! - 1);
    if (seen.get(cur) === 0) { seen.delete(cur); m.del(cur); } else m.put(cur, seen.get(cur)!);
    path.pop();
    if (told === 2) { v.line(3).eq(`leave ${t.val(id)}: remove prefix ${cur}`, 'warn').say('When we return from a node, remove its prefix sum from the map. Other branches must not see it: a path cannot jump sideways.'); told++; }
  };
  go(t.root(), 0);
  t.clearTones(); m.clearTones();
  v.eq(`count = ${count}`, 'ok').say(`${words(count)} paths, in one pass. Each node does constant work with the map.`);
  v.answer(ps3(T, S));

  recap(v, [{ name: 'Search from every node', time: 'O(n²)', space: 'O(h)' }, { name: 'Prefix sums + map (with backtracking)', time: 'O(n)', space: 'O(h)' }], 'count += seen[cur − target]; add cur on the way down, remove it on the way up.', ['Downward paths with a target sum → prefix sums on the root path'], 'Subarray Sum Equals K, on every root-to-node path.');
  return v.build();
}

const problem: Problem = {
  slug: 'path-sum-iii',
  statement: 'Given the `root` of a binary tree and an integer `targetSum`, return the number of paths where the sum of the values along the path equals `targetSum`. The path must go downwards (parent to child) but need not start at the root or end at a leaf.',
  examples: [{ input: 'root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8', output: '3' }, { input: 'root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22', output: '3' }],
  constraints: ['0 ≤ nodes ≤ 1000', '−10⁹ ≤ Node.val ≤ 10⁹', '−1000 ≤ targetSum ≤ 1000'],
  hints: ['A downward path is a difference of two root prefix sums.', 'Remove a prefix sum from the map when you leave its node.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Search from every node', idea: 'DFS from each start node, summing downward.', time: 'O(n²)', space: 'O(h)', bottleneck: 'Repeated sums.' },
    { id: 'optimal', kind: 'optimal', name: 'Prefix sums + map', idea: 'count += seen[cur − target]; add/remove cur around the recursion.', time: 'O(n)', space: 'O(h)' },
  ],
  pitfalls: ['Sums can exceed 32 bits: use 64-bit.', 'Seed the map with {0: 1}.'],
  takeaway: '**Prefix sums** on the current root path.',
  video,
  videoArgs: [T, S],
  judge: {
    type: 'fn', fn: 'pathSum', params: ['TreeNode', 'int'], ret: 'int',
    tests: [{ args: [T, S], out: 3 }, { args: [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], 22], out: 3 }, { args: [[], 0], out: 0 }, { args: [[1000000000, 1000000000, null, 294967296, null, 1000000000, null, 1000000000, null, 1000000000], 0], out: 0 }],
    gen: (r: Rng) => [randomTree(r, 12, -3, 4), r.int(-3, 6)],
    ref: (lv: Level, s: number) => ps3(lv, s),
  },
};

export default problem;
