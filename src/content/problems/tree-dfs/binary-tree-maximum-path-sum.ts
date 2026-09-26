import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { build, randomTree, type Level, type TNode } from '../../treeutil';
import { orderIds } from '../../treevid';

const T: Level = [-10, 9, 20, null, null, 15, 7];
function mps(lv: Level) { let best = -Infinity; const g = (n: TNode | null): number => { if (!n) return 0; const a = Math.max(0, g(n.l)), b = Math.max(0, g(n.r)); best = Math.max(best, n.v + a + b); return n.v + Math.max(a, b); }; g(build(lv)); return best; }

function video() {
  const v = new Video('binary-tree-max-path-sum', 'Binary Tree Maximum Path Sum');
  v.chapter('intro', 'The problem');
  v.binaryTree('t', T, { label: 'root = [-10,9,20,null,null,15,7]' });
  v.say('A path is any sequence of connected nodes, each used at most once. It does not have to include the root. Find the largest possible sum of a path. Values can be negative.');
  v.eq(`answer: ${mps(T)} (15 → 20 → 7)`);

  v.chapter('brute', 'Brute force: try every node as the top of the path', { cx: 'O(n²)', code: ['for each node as the top:', '  best = max(best, node + bestDown(left) + bestDown(right))', 'bestDown() recomputed from scratch'] });
  v.eq('bestDown is recomputed for every ancestor', 'warn').say('Every path has a highest node, where it bends. For each node as the bend, add the best downward path on the left and on the right. Recomputing those downward sums for every node is quadratic.');

  v.chapter('optimal', 'One post-order pass: return a gain, record a bend', { cx: 'O(n)', code: ['gain(node):', '  if not node: return 0', '  a = max(0, gain(left)); b = max(0, gain(right))   # drop negative branches', '  best = max(best, node.val + a + b)               # path bending here', '  return node.val + max(a, b)                      # one branch goes up'] });
  v.clear();
  const t = v.binaryTree('t', T, { label: 'badge = gain returned upward' });
  const post = orderIds(t, 'post');
  const g: Record<string, number> = {};
  let best = -Infinity;
  let told = 0;
  post.forEach((id, i) => {
    const l = t.left(id), r = t.right(id);
    const a = Math.max(0, l ? g[l] : 0), b = Math.max(0, r ? g[r] : 0);
    const val = t.val(id) as number;
    const bend = val + a + b;
    const nb = bend > best;
    best = Math.max(best, bend);
    g[id] = val + Math.max(a, b);
    t.clearTones(); post.slice(0, i).forEach((x) => t.tone(x, 'done')); t.tone(id, nb ? 'ok' : 'active');
    t.badge(id, g[id]);
    v.line(3, 4).counter(`best: ${best}`).eq(`node ${val}: bend ${val} + ${a} + ${b} = ${bend}${nb ? ' ← best' : ''} · return ${g[id]}`, nb ? 'ok' : undefined);
    if (told === 0) { v.say('Like the diameter, each node returns one thing and records another. It returns its gain: its value plus the better of its two downward branches, because a path coming from the parent can only continue down one side. It records the bend: its value plus both branches.'); told++; }
    else if (val === 20) { v.say(`Twenty receives gains of fifteen and seven. The path bending here is fifteen plus twenty plus seven: forty-two, the best so far. But it can only pass one branch upward: twenty plus fifteen, thirty-five.`); }
    else if (id === 't0') { v.say(`The root is minus ten. Its best bend is minus ten plus nine plus thirty-five, thirty-four, less than forty-two. Any branch with a negative gain would be dropped with max of zero: taking nothing beats taking a loss.`); }
    else v.hold(600);
  });
  t.clearTones();
  v.eq(`maximum path sum = ${best}`, 'ok').hold(800);
  v.answer(mps(T));

  recap(v, [{ name: 'Every node as the top', time: 'O(n²)', space: 'O(h)' }, { name: 'Gain + bend in one pass', time: 'O(n)', space: 'O(h)' }], 'Return val + max(a, b); record val + a + b; clamp negative gains to 0.', ['Best path anywhere in a tree → return one branch, record the bend'], 'Diameter with weights: drop negative branches.');
  return v.build();
}

const problem: Problem = {
  slug: 'binary-tree-maximum-path-sum',
  statement: 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge; a node appears at most once, and the path does not need to pass through the root. Given the `root`, return the maximum path sum of any non-empty path.',
  examples: [{ input: 'root = [1,2,3]', output: '6' }, { input: 'root = [-10,9,20,null,null,15,7]', output: '42' }, { input: 'root = [-3]', output: '-3' }],
  constraints: ['1 ≤ nodes ≤ 3 · 10⁴', '−1000 ≤ Node.val ≤ 1000'],
  hints: ['Every path has a highest node.', 'Negative branches should be dropped.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every node as the top', idea: 'Recompute the best downward path on each side for every node.', time: 'O(n²)', space: 'O(h)', bottleneck: 'Recomputation.' },
    { id: 'optimal', kind: 'optimal', name: 'Gain + bend', idea: 'Post-order: a = max(0, gain(l)), b = max(0, gain(r)); best = max(best, v + a + b); return v + max(a, b).', time: 'O(n)', space: 'O(h)' },
  ],
  pitfalls: ['Initialise best to −∞ (all-negative trees).'],
  takeaway: '**Return a gain, record a bend**, clamp negatives to 0.',
  video,
  videoArgs: [T],
  judge: {
    type: 'fn', fn: 'maxPathSum', params: ['TreeNode'], ret: 'int',
    tests: [{ args: [[1, 2, 3]], out: 6 }, { args: [T], out: 42 }, { args: [[-3]], out: -3 }, { args: [[-1, -2, -3]], out: -1 }],
    gen: (r: Rng) => { let lv = randomTree(r, 12, -6, 6); while (!lv.length) lv = randomTree(r, 12, -6, 6); return [lv]; },
    ref: (lv: Level) => mps(lv),
  },
};

export default problem;
